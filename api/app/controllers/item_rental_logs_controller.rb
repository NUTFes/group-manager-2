# frozen_string_literal: true

class ItemRentalLogsController < ApplicationController
  include RentalBffAuthenticatable

  # 人の認証はCloudflare Accessが行い、ここではBFFからの呼び出しであることを検証する。
  # 記録者を残す作成時のみ、BFFが転送するメールアドレスを必須にする。
  before_action :authenticate_rental_bff!
  before_action :require_rental_recorder_email!, only: %i[create transfer]

  # 同じuidでの再送が同一イベントかを判定する属性。memoは含めない。
  # 送信失敗時の再送でメモだけ変わっていても409にせず、最初の記録を正とする。
  IDEMPOTENCY_ATTRIBUTES = %w[
    assign_rental_item_id group_id rental_item_id stocker_place_id category quantity recorder_email
  ].freeze

  ASSIGNMENT_CHANGE_CATEGORIES = %w[addition reduction].freeze

  # GET /item_rental_logs
  def index
    assign_rental_items = AssignRentalItem.where(assign_rental_item_filter_params)
    item_rental_logs = ItemRentalLog.where(assign_rental_item_id: assign_rental_items.select(:id))
    if params[:group_id].present? && params[:rental_place_id].blank?
      assignment_change_logs = ItemRentalLog.where(group_id: params[:group_id], assign_rental_item_id: nil)
      item_rental_logs = item_rental_logs.or(assignment_change_logs)
    end

    render json: fmt(ok, { item_rental_logs: item_rental_logs, assign_rental_items: assign_rental_items })
  end

  # POST /item_rental_logs
  def create
    return render_unprocessable_entity('Invalid category') unless valid_category?(params[:category])

    if ASSIGNMENT_CHANGE_CATEGORIES.include?(params[:category])
      item_rental_log = ItemRentalLog.new(item_rental_log_params)
    else
      assign_rental_item = AssignRentalItem.find_by(id: params[:assign_rental_item_id])
      return render_not_found('assign_rental_item not found') unless assign_rental_item

      item_rental_log = ItemRentalLog.new(
        item_rental_log_params.merge(
          rental_item_id: assign_rental_item.rental_item_id,
          stocker_place_id: assign_rental_item.stocker_place_id,
          group_id: assign_rental_item.group_id
        )
      )
    end
    # 記録者はリクエストパラメータではなく、Cloudflare Accessが付与しBFFが転送した
    # メールアドレスを使う。クライアントが偽装した値を信用しない。
    item_rental_log.recorder_email = rental_recorder_email

    existing_log = ItemRentalLog.find_by(uid: item_rental_log.uid)
    return render_idempotent_result(existing_log, item_rental_log) if existing_log

    if item_rental_log.save
      render json: fmt(created, item_rental_log), status: :created
    else
      render_validation_errors(item_rental_log)
    end
  rescue ActiveRecord::RecordNotUnique
    existing_log = ItemRentalLog.find_by!(uid: item_rental_log.uid)
    render_idempotent_result(existing_log, item_rental_log)
  end

  # POST /item_rental_logs/transfer
  #
  # 超過貸出（団体間で割当を付け替える操作）。提供元にreduction、渡す先にadditionを
  # 対で記録する。片方だけ残ると在庫が消えたように見えるため、必ず1つのトランザクションで
  # 両方を書く。2件のuidは <uid>-reduction / <uid>-addition で、同じuidでの再送は
  # 既存の対をそのまま返す（冪等）。
  def transfer
    invalid = transfer_param_error
    return render_unprocessable_entity(invalid) if invalid

    logs = build_transfer_logs
    existing = existing_transfer_logs
    return render_transfer_conflict unless transfer_logs_match?(logs, existing)
    return render json: fmt(ok, transfer_payload(existing)) if existing.size == logs.size

    # 既に reduction がある再送では、その分だけ提供元が減った後の値になるので確かめない
    unless existing.key?(transfer_uid(:reduction))
      available = source_unlent_quantity
      return render_unprocessable_entity("quantity exceeds the source group's unlent quantity (#{available})") if
        params[:quantity].to_i > available
    end

    # 片方だけ既にある状態（過去の部分的な記録）でも、足りない方だけを補って対にする
    ItemRentalLog.transaction do
      logs.each { |log| log.save! unless existing.key?(log.uid) }
    end
    render json: fmt(created, transfer_payload(existing_transfer_logs)), status: :created
  rescue ActiveRecord::RecordInvalid => e
    render_validation_errors(e.record)
  rescue ActiveRecord::RecordNotUnique
    # 同じuidが同時に投入された場合。対が揃っているはずなので読み直して返す
    retried = existing_transfer_logs
    if retried.size == 2 && transfer_logs_match?(build_transfer_logs, retried)
      render json: fmt(ok, transfer_payload(retried))
    else
      render_transfer_conflict
    end
  end

  private

  def valid_category?(category)
    ItemRentalLog.categories.key?(category.to_s)
  end

  def assign_rental_item_filter_params
    filter = {}
    filter[:rental_place_id] = params[:rental_place_id] if params[:rental_place_id].present?
    filter[:group_id] = params[:group_id] if params[:group_id].present?
    filter
  end

  def item_rental_log_params
    params.permit(:uid, :assign_rental_item_id, :category, :quantity, :group_id, :rental_item_id,
                  :stocker_place_id, :memo)
  end

  def render_idempotent_result(existing_log, candidate_log)
    if same_event?(existing_log, candidate_log)
      render json: fmt(ok, existing_log)
    else
      render json: fmt(conflict, [], 'uid already exists with different event data'), status: :conflict
    end
  end

  def same_event?(existing_log, candidate_log)
    existing_log.attributes.slice(*IDEMPOTENCY_ATTRIBUTES) ==
      candidate_log.attributes.slice(*IDEMPOTENCY_ATTRIBUTES)
  end

  # --- 超過貸出（transfer） ---

  def transfer_uid(kind)
    "#{params[:uid]}-#{kind}"
  end

  def transfer_uids
    %i[reduction addition].map { |kind| transfer_uid(kind) }
  end

  def existing_transfer_logs
    ItemRentalLog.where(uid: transfer_uids).index_by(&:uid)
  end

  def build_transfer_logs
    common = {
      rental_item_id: params[:rental_item_id],
      stocker_place_id: params[:stocker_place_id],
      quantity: params[:quantity],
      memo: params[:memo],
      # 記録者はcreateと同じくAccessが付与しBFFが転送したメールを使う
      recorder_email: rental_recorder_email
    }

    [
      ItemRentalLog.new(common.merge(uid: transfer_uid(:reduction), category: :reduction,
                                     group_id: params[:from_group_id])),
      ItemRentalLog.new(common.merge(uid: transfer_uid(:addition), category: :addition,
                                     group_id: params[:to_group_id]))
    ]
  end

  # 提供元の未貸出数 = Σ（実効割当数 − 貸出済数）。既に渡した分は手元に無いので回せない。
  # 同じ物品・在庫場所の割当が複数あることがあるため合計する（設計書5章）。
  def source_unlent_quantity
    AssignRentalItem.where(
      group_id: params[:from_group_id],
      rental_item_id: params[:rental_item_id],
      stocker_place_id: params[:stocker_place_id]
    ).sum(&:lent_remaining)
  end

  # 既に記録済みのuidが、今回と同じ操作を指しているか
  def transfer_logs_match?(logs, existing)
    logs.all? { |log| existing[log.uid].nil? || same_event?(existing[log.uid], log) }
  end

  def transfer_payload(logs_by_uid)
    { reduction: logs_by_uid[transfer_uid(:reduction)], addition: logs_by_uid[transfer_uid(:addition)] }
  end

  def transfer_param_error
    return 'uid is required' if params[:uid].blank?
    return 'quantity must be a positive integer' unless positive_integer?(params[:quantity])
    return 'from_group_id and to_group_id are required' if params[:from_group_id].blank? || params[:to_group_id].blank?
    return 'from_group_id and to_group_id must be different' if params[:from_group_id].to_s == params[:to_group_id].to_s

    nil
  end

  def positive_integer?(value)
    parsed = Integer(value.to_s, exception: false)
    !parsed.nil? && parsed.positive?
  end

  def render_transfer_conflict
    render json: fmt(conflict, [], 'uid already exists with different event data'), status: :conflict
  end

  def render_unprocessable_entity(message)
    render json: fmt(unprocessable_entity, [], message), status: :unprocessable_entity
  end

  def render_not_found(message)
    render json: fmt(not_found, [], message), status: :not_found
  end
end
