# frozen_string_literal: true

class Api::V1::OrderStatusCheckApiController < ApplicationController
  before_action :require_mail_delivery_role!, only: %i[
    create_order_status_check_comment_mail
    resend_order_status_check_comment_mail
  ]

  def get_order_status_check_for_admin_view
    @groups = Group.with_order_status_check(params[:id])
    render json: fmt(ok, @groups)
  end

  # admin_pageのviewの形に整える
  def fit_group_index_for_admin_view(groups)
    groups.map do |group|
      {
        group: group,
        user: group.user&.id,
        group_category: group.group_category&.id,
        fes_year: group.fes_year&.id,
        sub_rep: group.sub_rep&.id,
        place_order: group.place_order&.id,
        stage_orders: group.stage_orders.none? ? nil : group.stage_orders[0].id,
        stage_common_option: group.stage_common_option&.id,
        power_orders: group.power_orders.none? ? nil : group.power_orders[0].id,
        rental_orders: group.rental_orders.none? ? nil : group.rental_orders[0].id,
        employees: group.employees.none? ? nil : group.employees[0].id,
        food_product: group.food_products.empty? ? nil : true,
        purchase_list: if group.food_products.empty?
                         nil
                       else
                         group.food_products.any? { |food_product| !food_product.purchase_lists.empty? } ? true : nil
                       end,
        public_relation: group.public_relation&.id,
        venue_map: group.venue_map&.id,
        announcement: group.announcement&.status,
        cooking_process_order: group.cooking_process_order&.id,
        fire_equipment_order: group.fire_equipment_orders.none? ? nil : group.fire_equipment_orders[0].id,
        health_center_submission_statuses: group.health_center_submission_statuses.to_h { |s| [s.application_type, s.status] }
      }
    end
  end

  # 絞り込み機能
  def get_refinement_order_status_check
    fes_year_id = params[:fes_year_id].to_i
    group_category_id = params[:group_category_id].to_i
    is_international = params[:is_international].to_i
    is_external = params[:is_external].to_i # 0: 指定なし(ALL) 1: true 2: false

    @groups = Group.with_order_status_check_relations
    @groups = @groups.where(fes_year_id: fes_year_id) unless fes_year_id == 0
    @groups = @groups.where(group_category_id: group_category_id) unless group_category_id == 0
    @groups = @groups.where(is_international: is_international == 1) unless is_international == 0
    @groups = @groups.where(is_external: is_external == 1) unless is_external == 0

    if @groups.none?
      render json: fmt(not_found, [], 'Not found groups')
    else
      render json: fmt(ok, fit_group_index_for_admin_view(@groups))
    end
  end

  # あいまい検索機能
  def get_search_order_status_check
    word = params[:word]
    @groups = Group.with_order_status_check_relations.where('name LIKE ?', "%#{word}%")

    if @groups.none?
      render json: fmt(not_found, [], 'Not found groups')
    else
      render json: fmt(ok, fit_group_index_for_admin_view(@groups))
    end
  end

  # メモを保存し、保存済みメモの本文をメール送信する
  def create_order_status_check_comment_mail
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

    comment = save_failed_mail_comment!(group, comment_body)
    deliver_comment_mail!(comment, to: group.user.email, subject: "【申請状況について】#{subject}", body: body)

    render json: fmt(created, comment_response(comment)), status: :created
  rescue ActiveRecord::RecordInvalid => e
    render json: fmt(unprocessable_entity, e.record.errors.full_messages), status: :unprocessable_entity
  rescue StandardError => e
    render json: fmt({ code: 502, message: 'Mail delivery failed' }, comment_response(comment), e.message),
           status: :bad_gateway
  end

  # failed の保存済みメモを再送信する
  def resend_order_status_check_comment_mail
    comment = Comment.includes(commentable: :user).find_by(id: params[:comment_id])
    return render json: fmt(not_found, [], 'comment not found'), status: :not_found if comment.nil?
    return render json: fmt(unprocessable_entity, [], 'comment is not failed'), status: :unprocessable_entity unless comment.failed?
    return render json: fmt(unprocessable_entity, [], 'comment is not an order status check comment'), status: :unprocessable_entity unless comment.commentable.is_a?(Group)

    subject, body = parse_mail_comment_body(comment.body)
    group = comment.commentable

    begin
      deliver_comment_mail!(comment, to: group.user.email, subject: "【申請状況について】#{subject}", body: body)
      render json: fmt(ok, comment_response(comment))
    rescue StandardError => e
      render json: fmt({ code: 502, message: 'Mail delivery failed' }, comment_response(comment), e.message),
             status: :bad_gateway
    end
  end

  private

  def validate_comment_mail_params
    errors = []
    errors << 'group_id is required' if params[:group_id].blank?
    errors << 'message_template_id is required' if params[:message_template_id].blank?
    errors << 'body is required' if params[:body].to_s.strip.blank?
    errors
  end

  def require_mail_delivery_role!
    return if [1, 2].include?(current_api_user&.role_id)

    render json: fmt({ code: 403, message: 'Forbidden' }, []),
           status: :forbidden
  end

  def save_failed_mail_comment!(group, body)
    group.comments.create!(
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
end
