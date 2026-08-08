# frozen_string_literal: true

class Api::V1::HealthCenterSubmissionStatusesApiController < Api::V1::StaffController
  APPLICATION_TYPES = HealthCenterSubmissionStatus.application_types.keys.freeze

  before_action :require_group_id, only: %i[
    get_health_center_submission_status_counts
    get_health_center_submission_status_show_for_admin_view
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

  #---更新（PATCH）

  # ステータス変更
  def update_health_center_submission_status
    @submission_status = HealthCenterSubmissionStatus.find(params[:id])
    save_health_center_submission_status(@submission_status, unprocessable_http_status: :unprocessable_entity)
  end

  # 保健所提出対象フラグの変更（食販企画のみ）
  def update_health_center_submission_target
    group = Group.find_by(id: params[:group_id], group_category_id: 1)
    return render json: fmt(not_found, [], 'group not found'), status: :not_found if group.nil?

    target = params[:is_health_center_submission_target]
    unless [true, false].include?(target)
      return render json: fmt(unprocessable_entity, [], 'is_health_center_submission_target must be true or false'),
                    status: :unprocessable_entity
    end

    if group.update(is_health_center_submission_target: target)
      render json: fmt(ok, group)
    else
      render json: fmt(unprocessable_entity, [], group.errors.full_messages.join(', ')), status: :unprocessable_entity
    end
  end

  # ステータス変更（未作成ならINSERT）
  def upsert_health_center_submission_status
    return render json: fmt(unprocessable_entity, [], 'Invalid application_type') unless valid_application_type?(params[:application_type].to_s)

    return render json: fmt(unprocessable_entity, [], 'Invalid status'), status: :unprocessable_entity unless HealthCenterSubmissionStatus.statuses.key?(params[:status].to_s)

    @submission_status = resolve_submission_status
    return render json: fmt(not_found, [], 'health_center_submission_status not found') if params[:health_center_submission_status_id].present? && @submission_status.nil?
    return render json: fmt(unprocessable_entity, [], 'group_id and application_type are required') if @submission_status.nil?

    save_health_center_submission_status(@submission_status, unprocessable_http_status: :unprocessable_entity)
  end

  #---作成（POST）

  # メモ（コメント）保存
  def create_health_center_submission_status_comment
    return render json: fmt(unprocessable_entity, [], 'Invalid application_type'), status: :unprocessable_entity unless valid_application_type?(params[:application_type].to_s)
    return render json: fmt(unprocessable_entity, [], 'subject is required'), status: :unprocessable_entity if params[:subject].to_s.strip.blank?

    @submission_status = resolve_submission_status(default_status: HealthCenterSubmissionStatus::DEFAULT_STATUS)
    return render json: fmt(not_found, [], 'health_center_submission_status not found'), status: :not_found if params[:health_center_submission_status_id].present? && @submission_status.nil?
    return render json: fmt(unprocessable_entity, [], 'group_id and application_type are required'), status: :unprocessable_entity if @submission_status.nil?

    begin
      @submission_status.save! if @submission_status.new_record?
    rescue ActiveRecord::RecordNotUnique
      @submission_status = resolve_submission_status(default_status: HealthCenterSubmissionStatus::DEFAULT_STATUS)
    end

    @comment = @submission_status.comments.build(
      subject: params[:subject].to_s.strip,
      body: params[:body].to_s.strip,
      mail_delivery_status: :memo
    )
    if @comment.save
      render json: fmt(created, comment_response(@comment)), status: :created
    else
      render json: fmt(unprocessable_entity, [], @comment.errors.full_messages.join(', ')), status: :unprocessable_entity
    end
  end

  # メモを保存し、保存済みメモの本文をメール送信する
  def create_health_center_submission_status_comment_mail
    errors = validate_comment_mail_params
    return render json: fmt(unprocessable_entity, errors), status: :unprocessable_entity if errors.present?

    group = Group.includes(:user).find_by(id: params[:group_id])
    return render json: fmt(not_found, [], 'group not found'), status: :not_found if group.nil?
    return render json: fmt(unprocessable_entity, [], 'representative email is required'), status: :unprocessable_entity if group.user&.email.blank?

    subject = params[:subject].to_s.strip
    body = params[:body].to_s.strip

    comment = save_failed_mail_comment!(subject: subject, body: body)
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

    deliver_comment_mail!(comment, to: group.user.email, subject: comment.subject, body: comment.body)

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

  def validate_comment_mail_params
    errors = []
    errors << 'group_id is required' if params[:group_id].blank?
    errors << 'application_type is required' if params[:application_type].blank?
    errors << 'Invalid application_type' if params[:application_type].present? && !valid_application_type?(params[:application_type].to_s)
    errors << 'subject is required' if params[:subject].to_s.strip.blank?
    errors << 'body is required' if params[:body].to_s.strip.blank?
    errors
  end

  def save_failed_mail_comment!(subject:, body:)
    submission_status = nil
    comment = nil

    ActiveRecord::Base.transaction do
      submission_status = resolve_submission_status(default_status: HealthCenterSubmissionStatus::DEFAULT_STATUS)
      raise ActiveRecord::RecordInvalid, HealthCenterSubmissionStatus.new if submission_status.nil?

      submission_status.save! if submission_status.new_record?
      comment = submission_status.comments.create!(
        subject: subject,
        body: body,
        mail_delivery_status: :failed
      )
    end

    comment
  rescue ActiveRecord::RecordNotUnique
    submission_status = resolve_submission_status(default_status: HealthCenterSubmissionStatus::DEFAULT_STATUS)
    raise ActiveRecord::RecordInvalid, HealthCenterSubmissionStatus.new if submission_status.nil?

    submission_status.comments.create!(
      subject: subject,
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

  def comment_response(comment)
    return {} if comment.nil?

    {
      id: comment.id,
      subject: comment.subject,
      body: comment.body,
      mail_delivery_status: comment.mail_delivery_status,
      created_at: comment.created_at,
      commentable_type: comment.commentable_type,
      commentable_id: comment.commentable_id
    }
  end

  def resolve_submission_status(default_status: nil)
    if params[:health_center_submission_status_id].present?
      HealthCenterSubmissionStatus.find_by(id: params[:health_center_submission_status_id])
    elsif params[:group_id].present? && params[:application_type].present?
      status = params[:status].presence || default_status || HealthCenterSubmissionStatus::DEFAULT_STATUS
      HealthCenterSubmissionStatus.find_or_initialize_by(
        group_id: params[:group_id],
        application_type: params[:application_type]
      ).tap do |submission_status|
        submission_status.status = status if submission_status.new_record? || params[:status].present?
      end
    end
  end

  def valid_application_type?(application_type)
    HealthCenterSubmissionStatus.application_types.key?(application_type)
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
      group.rental_orders.any? || group.un_registered_groups.any?(&:rental_item_order?)
    when 'power_order'
      group.power_orders.any? || group.un_registered_groups.any?(&:power_order?)
    when 'fire_equipment_order'
      group.fire_equipment_orders.any? || group.un_registered_groups.any?(&:fire_equipment_order?)
    else
      false
    end
  end
end
