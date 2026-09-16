# frozen_string_literal: true

# rental/（貸出・返却記録アプリ）向けの読み取りAPI。
#
# 既存の `GET /item_rental_logs` はidしか返さないため、画面表示に必要な名前
# （物品名・在庫場所名・貸出場所名・団体名）を含めて返す。認証はBFF経由のみで、
# 記録者メールは読み取りでは要求しない（RentalBffAuthenticatable を参照）。
class Api::V1::RentalRecordsApiController < ApplicationController
  include RentalBffAuthenticatable

  before_action :authenticate_rental_bff!

  # GET /api/v1/get_rental_places_for_rental_view
  # 作業場所（貸出場所）の候補。今年度の割当で貸出場所として使われている場所のみ返す。
  def get_rental_places_for_rental_view
    place_ids = current_year_assign_rental_items.where.not(rental_place_id: nil)
                                                .distinct
                                                .pluck(:rental_place_id)
    places = StockerPlace.where(id: place_ids).order(:id)

    render json: fmt(ok, places.map { |place| { id: place.id, name: place.display_name } })
  end

  # GET /api/v1/get_groups_for_rental_view?rental_place_id=
  # この作業場所に割当がある今年度の団体一覧。手動での団体選択に使う。
  def get_groups_for_rental_view
    group_ids = place_filtered_assign_rental_items.distinct.select(:group_id)
    groups = Group.where(id: group_ids).order(:id)

    render json: fmt(ok, groups.map { |group| { id: group.id, name: group.name } })
  end

  # GET /api/v1/get_assign_rental_items_for_rental_view?rental_place_id=&group_id=
  # 登録画面・進捗確認画面が使う本体。割当に名前を添え、それぞれの記録を同梱する。
  #
  # addition / reduction（団体間の割当変更）は assign_rental_item に紐づかず
  # 貸出場所も持たないため、割当の配列には載らない。フロントが2回クエリを投げずに
  # 済むよう、対象団体の割当変更ログを assignment_change_logs として同じ応答に含める。
  def get_assign_rental_items_for_rental_view
    assign_rental_items = filtered_assign_rental_items
    logs_by_assign_id = ItemRentalLog.where(assign_rental_item_id: assign_rental_items.map(&:id))
                                     .order(:created_at, :id)
                                     .group_by(&:assign_rental_item_id)

    render json: fmt(ok, {
                       assign_rental_items: assign_rental_items.map do |assign_rental_item|
                         assign_rental_item_h(assign_rental_item, logs_by_assign_id)
                       end,
                       assignment_change_logs: assignment_change_logs(assign_rental_items).map { |log| log_h(log) }
                     })
  end

  private

  def current_fes_year_id
    @current_fes_year_id ||= UserPageSetting.first&.fes_year_id
  end

  # 今年度の団体の割当だけを対象にする。assign_rental_items は年度を持たないため
  # groups 経由で絞る。
  def current_year_assign_rental_items
    AssignRentalItem.where(group_id: Group.where(fes_year_id: current_fes_year_id).select(:id))
  end

  # 作業場所だけで絞った割当。団体一覧を出すときに使う。
  def place_filtered_assign_rental_items
    scope = current_year_assign_rental_items
    return scope if params[:rental_place_id].blank?

    scope.where(rental_place_id: params[:rental_place_id])
  end

  def filtered_assign_rental_items
    scope = current_year_assign_rental_items
            .includes(:group, :rental_item, :stocker_place, :rental_place)
    scope = scope.where(rental_place_id: params[:rental_place_id]) if params[:rental_place_id].present?
    scope = scope.where(group_id: params[:group_id]) if params[:group_id].present?
    scope.order(:id)
  end

  # 割当変更ログ。団体単位の記録で assign_rental_item に紐づかないため、返す割当に
  # 出てくる団体の分をまとめて返す。団体を指定していない進捗確認でも実効割当数を
  # 正しく出せるようにするため（指定時はその団体だけで足りる）。
  def assignment_change_logs(assign_rental_items)
    group_ids = params[:group_id].presence || assign_rental_items.map(&:group_id).uniq
    return ItemRentalLog.none if group_ids.blank?

    ItemRentalLog.where(group_id: group_ids, assign_rental_item_id: nil)
                 .order(:created_at, :id)
  end

  def assign_rental_item_h(assign_rental_item, logs_by_assign_id)
    {
      id: assign_rental_item.id,
      group_id: assign_rental_item.group_id,
      group_name: assign_rental_item.group&.name.to_s,
      rental_item_id: assign_rental_item.rental_item_id,
      rental_item_name: assign_rental_item.rental_item&.name.to_s,
      stocker_place_id: assign_rental_item.stocker_place_id,
      stock_place_name: assign_rental_item.stock_place_name,
      rental_place_id: assign_rental_item.rental_place_id,
      rental_place_name: assign_rental_item.rental_place_name,
      num: assign_rental_item.num,
      remark: assign_rental_item.remark,
      item_rental_logs: (logs_by_assign_id[assign_rental_item.id] || []).map { |log| log_h(log) }
    }
  end

  def log_h(log)
    {
      id: log.id,
      uid: log.uid,
      assign_rental_item_id: log.assign_rental_item_id,
      group_id: log.group_id,
      rental_item_id: log.rental_item_id,
      stocker_place_id: log.stocker_place_id,
      category: log.category,
      quantity: log.quantity,
      memo: log.memo,
      recorder_email: log.recorder_email,
      created_at: log.created_at
    }
  end
end
