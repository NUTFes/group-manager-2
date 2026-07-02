# frozen_string_literal: true

class Api::V1::HealthCenterSubmissionStatusesApiController < ApplicationController
  APPLICATION_TYPES = HealthCenterSubmissionStatus.application_types.keys.freeze

  before_action :authenticate_api_user!, only: %i[
    get_health_center_submission_status_index_for_admin_view
    get_health_center_submission_status_show_for_admin_view
    get_health_center_submission_status_for_user
    update_health_center_submission_status
    update_health_center_submission_status_for_user
    upsert_health_center_submission_status
    upsert_health_center_submission_status_for_user
    get_health_center_submission_status_counts
    create_health_center_submission_status_comment
    create_health_center_submission_status_comment_mail
    resend_health_center_submission_status_comment_mail
    sync_health_center_submission_statuses
  ]

  before_action :require_group_id, only: %i[
    get_health_center_submission_status_counts
    get_health_center_submission_status_show_for_admin_view
    get_health_center_submission_status_for_user
  ]
  before_action :require_mail_delivery_role!, only: %i[
    create_health_center_submission_status_comment_mail
    resend_health_center_submission_status_comment_mail
  ]

  #---取得（GET）

  # 全グループの保健所提出ステータス一覧取得
  def get_health_center_submission_status_index_for_admin_view
    @groups = Group.preload(:health_center_submission_statuses, :group_category, :fes_year)
    render json: fmt(ok, fit_index_for_admin_view(@groups))
  end

  # 承認済・再提出・未確認の件数取得
  def get_health_center_submission_status_counts
    @statuses = HealthCenterSubmissionStatus.where(group_id: params[:group_id])
    render json: fmt(ok, {
                       approved: @statuses.approved.count,
                       waiting_resubmission: @statuses.waiting_resubmission.count,
                       unapproved: @statuses.unapproved.count,
                       unsubmitted: @statuses.unsubmitted.count
                     })
  end

  # グループの全申請詳細取得（矢印切替用）
  def get_health_center_submission_status_show_for_admin_view
    group = Group.preload(
      :health_center_submission_statuses,
      :food_products,
      :employees,
      :venue_map,
      :rental_orders,
      :power_orders,
      :fire_equipment_orders,
      { food_products: :purchase_lists },
      { food_products: :cooking_process_order },
      { health_center_submission_statuses: :comments }
    ).find(params[:group_id])

    submissions = build_submissions_data(group)

    render json: fmt(ok, {
                       group: group,
                       submissions: submissions
                     })
  end

  # user画面用の申請ステータス取得
  def get_health_center_submission_status_for_user
    group = current_user_group(params[:group_id])
    return render_user_not_found unless group

    render json: fmt(ok, {
                       submissions: HealthCenterSubmissionStatus.default_submissions_for(group)
                     })
  end

  #---更新（PATCH）

  # ステータス変更
  def update_health_center_submission_status
    @submission_status = HealthCenterSubmissionStatus.find(params[:id])
    save_submission_status(@submission_status)
  end

  # user画面用ステータス変更
  def update_health_center_submission_status_for_user
    return render_invalid_user_status unless valid_user_status?(params[:status].to_s)

    @submission_status = current_user_submission_status(params[:id])
    return render_user_not_found unless @submission_status

    save_submission_status(@submission_status)
  end

  # ステータス変更（未作成ならINSERT）
  def upsert_health_center_submission_status
    return render json: fmt(unprocessable_entity, [], 'Invalid application_type') unless valid_application_type?(params[:application_type].to_s)

    @submission_status = resolve_submission_status
    return render json: fmt(not_found, [], 'health_center_submission_status not found') if params[:health_center_submission_status_id].present? && @submission_status.nil?
    return render json: fmt(unprocessable_entity, [], 'group_id and application_type are required') if @submission_status.nil?

    save_submission_status(@submission_status)
  end

  # user画面用ステータス変更（未作成ならINSERT）
  def upsert_health_center_submission_status_for_user
    return render json: fmt(unprocessable_entity, [], 'Invalid application_type') unless valid_application_type?(params[:application_type].to_s)
    return render_invalid_user_status unless valid_user_status?(params[:status].to_s)

    group = current_user_group(params[:group_id])
    return render_user_not_found unless group

    @submission_status = resolve_submission_status(group_id: group.id)
    return render json: fmt(not_found, [], 'health_center_submission_status not found') if params[:health_center_submission_status_id].present? && @submission_status.nil?
    return render json: fmt(unprocessable_entity, [], 'group_id and application_type are required') if @submission_status.nil?

    save_submission_status(@submission_status)
  end

  #---作成（POST）

  # メモ（コメント）保存
  def create_health_center_submission_status_comment
    return render json: fmt(unprocessable_entity, [], 'Invalid application_type') unless valid_application_type?(params[:application_type].to_s)

    @submission_status = resolve_submission_status(default_status: HealthCenterSubmissionStatus::DEFAULT_STATUS)
    return render json: fmt(not_found, [], 'health_center_submission_status not found') if params[:health_center_submission_status_id].present? && @submission_status.nil?
    return render json: fmt(unprocessable_entity, [], 'group_id and application_type are required') if @submission_status.nil?

    begin
      @submission_status.save! if @submission_status.new_record?
    rescue ActiveRecord::RecordNotUnique
      @submission_status = resolve_submission_status(default_status: HealthCenterSubmissionStatus::DEFAULT_STATUS)
    end

    @comment = @submission_status.comments.build(
      body: params[:body],
      mail_delivery_status: :not_send
    )
    if @comment.save
      render json: fmt(created, {
                         id: @comment.id,
                         body: @comment.body,
                         mail_delivery_status: @comment.mail_delivery_status,
                         created_at: @comment.created_at,
                         commentable_type: @comment.commentable_type,
                         commentable_id: @comment.commentable_id
                       })
    else
      render json: fmt(unprocessable_entity, [], @comment.errors.full_messages.join(', '))
    end
  end

  # メモを保存し、保存済みメモの本文をメール送信する
  def create_health_center_submission_status_comment_mail
    errors = validate_comment_mail_params
    return render json: fmt(unprocessable_entity, errors), status: :unprocessable_entity if errors.present?

    template = MessageTemplate.find_by(id: params[:message_template_id])
    return render json: fmt(not_found, [], 'message_template not found'), status: :not_found if template.nil?

    group = Group.includes(:user).find_by(id: params[:group_id])
    return render json: fmt(not_found, [], 'group not found'), status: :not_found if group.nil?
    return render json: fmt(unprocessable_entity, [], 'representative email is required'), status: :unprocessable_entity if group.user&.email.blank?

    mail_values = {
      group_name: group.name,
      user_name: group.user.name
    }
    subject = template.render_subject(mail_values)
    body = params[:body].to_s.strip
    comment_body = build_mail_comment_body(subject, body)

    comment = save_failed_mail_comment!(comment_body)
    deliver_comment_mail!(comment, to: group.user.email, subject: subject, body: body)

    render json: fmt(created, comment_response(comment)), status: :created
  rescue ActiveRecord::RecordInvalid => e
    render json: fmt(unprocessable_entity, e.record.errors.full_messages), status: :unprocessable_entity
  rescue StandardError => e
    render json: fmt({ code: 502, message: 'Mail delivery failed' }, comment_response(comment), e.message),
           status: :bad_gateway
  end

  # failed の保存済みメモを再送信する
  def resend_health_center_submission_status_comment_mail
    comment = Comment.includes(commentable: { group: :user }).find_by(id: params[:comment_id])
    return render json: fmt(not_found, [], 'comment not found'), status: :not_found if comment.nil?
    return render json: fmt(unprocessable_entity, [], 'comment is not failed'), status: :unprocessable_entity unless comment.failed?
    return render json: fmt(unprocessable_entity, [], 'comment is not a health center submission status comment'), status: :unprocessable_entity unless comment.commentable.is_a?(HealthCenterSubmissionStatus)

    group = comment.commentable.group
    return render json: fmt(unprocessable_entity, [], 'representative email is required'), status: :unprocessable_entity if group.user&.email.blank?

    subject, body = parse_mail_comment_body(comment.body)
    deliver_comment_mail!(comment, to: group.user.email, subject: subject, body: body)

    render json: fmt(ok, comment_response(comment))
  rescue StandardError => e
    render json: fmt({ code: 502, message: 'Mail delivery failed' }, comment_response(comment), e.message),
           status: :bad_gateway
  end

  # 申請状況を同期する（提出状況に基づいてステータスを自動作成）
  def sync_health_center_submission_statuses
    groups = Group.preload(
      :health_center_submission_statuses,
      :food_products,
      :employees,
      :venue_map,
      :rental_orders,
      :power_orders,
      :fire_equipment_orders,
      :un_registered_groups,
      { food_products: :purchase_lists },
      { food_products: :cooking_process_order }
    )

    sync_count = 0
    groups.each do |group|
      APPLICATION_TYPES.each do |application_type|
        existing_status = group.health_center_submission_statuses.find_by(application_type: application_type)

        # 提出データが存在するかチェック
        has_submission = check_has_submission(group, application_type)

        # ステータスを決定
        status = has_submission ? 'unapproved' : 'unsubmitted'

        if existing_status.present?
          next unless existing_status.unsubmitted? || existing_status.unapproved?
          next if existing_status.status == status

          existing_status.update!(status: status)
        else
          # 新規作成
          group.health_center_submission_statuses.create(
            application_type: application_type,
            status: status
          )
        end
        sync_count += 1
      end
    end

    render json: fmt(ok, {
                       synced_count: sync_count,
                       groups: fit_index_for_admin_view(groups)
                     })
  end

  private

  def save_submission_status(submission_status)
    return render json: fmt(unprocessable_entity, [], 'Invalid status') unless HealthCenterSubmissionStatus.statuses.key?(params[:status].to_s)

    submission_status.status = params[:status]

    if submission_status.save
      render json: fmt(ok, {
                         id: submission_status.id,
                         group_id: submission_status.group_id,
                         application_type: submission_status.application_type,
                         status: submission_status.status
                       })
    else
      render json: fmt(unprocessable_entity, [], submission_status.errors.full_messages.join(', '))
    end
  end

  def validate_comment_mail_params
    errors = []
    errors << 'group_id is required' if params[:group_id].blank?
    errors << 'application_type is required' if params[:application_type].blank?
    errors << 'Invalid application_type' if params[:application_type].present? && !valid_application_type?(params[:application_type].to_s)
    errors << 'message_template_id is required' if params[:message_template_id].blank?
    errors << 'body is required' if params[:body].to_s.strip.blank?
    errors
  end

  def require_mail_delivery_role!
    # TODO: 管理者向けAPIは別issueでロールごとの制限機能を追加し、実装後にこの暫定判定を削除する。
    return if [1, 2].include?(current_api_user&.role_id)

    render json: fmt({ code: 403, message: 'Forbidden' }, []),
           status: :forbidden
  end

  def save_failed_mail_comment!(body)
    submission_status = nil
    comment = nil

    ActiveRecord::Base.transaction do
      submission_status = resolve_submission_status(default_status: HealthCenterSubmissionStatus::DEFAULT_STATUS)
      raise ActiveRecord::RecordInvalid, HealthCenterSubmissionStatus.new if submission_status.nil?

      submission_status.save! if submission_status.new_record?
      comment = submission_status.comments.create!(
        body: body,
        mail_delivery_status: :failed
      )
    end

    comment
  rescue ActiveRecord::RecordNotUnique
    submission_status = resolve_submission_status(default_status: HealthCenterSubmissionStatus::DEFAULT_STATUS)
    submission_status.comments.create!(
      body: body,
      mail_delivery_status: :failed
    )
  end

  def deliver_comment_mail!(comment, to:, subject:, body:)
    GenericMailer.plain_text_email(
      to: to,
      subject: subject,
      body: body
    ).deliver_now!
    comment.update!(mail_delivery_status: :sent)
  end

  def build_mail_comment_body(subject, body)
    "件名: #{subject}\n\n#{body}"
  end

  def parse_mail_comment_body(comment_body)
    subject_line, body = comment_body.to_s.split("\n\n", 2)
    subject = subject_line.to_s.sub(/\A件名:\s*/, '')
    [subject, body.to_s]
  end

  def comment_response(comment)
    return {} if comment.nil?

    {
      id: comment.id,
      body: comment.body,
      mail_delivery_status: comment.mail_delivery_status,
      created_at: comment.created_at,
      commentable_type: comment.commentable_type,
      commentable_id: comment.commentable_id
    }
  end

  def resolve_submission_status(default_status: nil, group_id: nil)
    if params[:health_center_submission_status_id].present?
      HealthCenterSubmissionStatus.find_by(id: params[:health_center_submission_status_id])
    elsif params[:group_id].present? && params[:application_type].present?
      status = params[:status].presence || default_status || HealthCenterSubmissionStatus::DEFAULT_STATUS
      HealthCenterSubmissionStatus.find_or_initialize_by(
        group_id: group_id || params[:group_id],
        application_type: params[:application_type]
      ).tap do |submission_status|
        submission_status.status = status if submission_status.new_record? || params[:status].present?
      end
    end
  end

  def valid_application_type?(application_type)
    HealthCenterSubmissionStatus.application_types.key?(application_type)
  end

  def valid_user_status?(status)
    status == 'unapproved'
  end

  def current_user_group(group_id)
    return nil if group_id.blank?

    current_api_user.groups.find_by(id: group_id)
  end

  def current_user_submission_status(id)
    HealthCenterSubmissionStatus.joins(:group)
                                .where(groups: { user_id: current_api_user.id })
                                .find_by(id: id)
  end

  def render_user_not_found
    render json: fmt(not_found, [], 'health_center_submission_status not found'), status: :not_found
  end

  def render_invalid_user_status
    render json: fmt(unprocessable_entity, [], 'Invalid status'), status: :unprocessable_entity
  end

  # 一覧画面用のデータ整形
  def fit_index_for_admin_view(groups)
    groups.map do |group|
      statuses = group.health_center_submission_statuses.index_by(&:application_type)
      {
        group: group,
        group_category: group.group_category,
        fes_year: group.fes_year,
        food_product: statuses['food_product']&.status || HealthCenterSubmissionStatus::DEFAULT_STATUS,
        purchase_list: statuses['purchase_list']&.status || HealthCenterSubmissionStatus::DEFAULT_STATUS,
        cooking_process_order: statuses['cooking_process_order']&.status || HealthCenterSubmissionStatus::DEFAULT_STATUS,
        employee: statuses['employee']&.status || HealthCenterSubmissionStatus::DEFAULT_STATUS,
        venue_map: statuses['venue_map']&.status || HealthCenterSubmissionStatus::DEFAULT_STATUS,
        equipment: statuses['equipment']&.status || HealthCenterSubmissionStatus::DEFAULT_STATUS,
        power_order: statuses['power_order']&.status || HealthCenterSubmissionStatus::DEFAULT_STATUS,
        fire_equipment_order: statuses['fire_equipment_order']&.status || HealthCenterSubmissionStatus::DEFAULT_STATUS
      }
    end
  end

  # 各申請タイプの詳細データを組み立てる
  def build_submissions_data(group)
    statuses = group.health_center_submission_statuses.includes(:comments).index_by(&:application_type)

    APPLICATION_TYPES.map do |application_type|
      submission_status = statuses[application_type]
      {
        id: submission_status&.id,
        application_type: application_type,
        status: submission_status&.status || HealthCenterSubmissionStatus::DEFAULT_STATUS,
        comments: submission_status&.comments || [],
        detail: fetch_detail_for(group, application_type)
      }
    end
  end

  def fetch_detail_for(group, application_type)
    case application_type
    when 'food_product'
      group.food_products
    when 'purchase_list'
      group.food_products.flat_map(&:purchase_lists)
    when 'cooking_process_order'
      group.food_products.filter_map(&:cooking_process_order)
    when 'employee'
      group.employees
    when 'venue_map'
      group.venue_map
    when 'equipment'
      group.rental_orders
    when 'power_order'
      group.power_orders
    when 'fire_equipment_order'
      group.fire_equipment_orders
    end
  end

  def require_group_id
    return render json: fmt(unprocessable_entity, [], 'group_id is required') if params[:group_id].blank?
  end

  def check_has_submission(group, application_type)
    case application_type
    when 'food_product'
      group.food_products.any?
    when 'purchase_list'
      group.food_products.any? && group.food_products.flat_map(&:purchase_lists).any?
    when 'cooking_process_order'
      group.food_products.any? && group.food_products.filter_map(&:cooking_process_order).any?
    when 'employee'
      group.employees.any?
    when 'venue_map'
      group.venue_map.present?
    when 'equipment'
      # 物品申請：通常の申請データか、「申請しない」回答のどちらかがあれば未確認にする
      group.rental_orders.any? || group.un_registered_groups.rental_item_order.exists?
    when 'power_order'
      group.power_orders.any? || group.un_registered_groups.power_order.exists?
    when 'fire_equipment_order'
      group.fire_equipment_orders.any? || group.un_registered_groups.fire_equipment_order.exists?
    else
      false
    end
  end
end
