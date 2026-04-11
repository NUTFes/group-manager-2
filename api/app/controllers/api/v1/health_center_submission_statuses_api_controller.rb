# frozen_string_literal: true

class Api::V1::HealthCenterSubmissionStatusesApiController < ApplicationController
  before_action :authenticate_api_user!, only: %i[
    get_health_center_submission_status_index_for_admin_view
    get_health_center_submission_status_show_for_admin_view
    update_health_center_submission_status
    get_health_center_submission_status_counts
    create_health_center_submission_status_comment
  ]

  # 1. 全グループの保健所提出ステータス一覧取得
  def get_health_center_submission_status_index_for_admin_view
    @groups = Group.preload(:health_center_submission_statuses, :group_category, :fes_year)
    render json: fmt(ok, fit_index_for_admin_view(@groups))
  end

  # 2. ステータス変更
  def update_health_center_submission_status
    @submission_status = HealthCenterSubmissionStatus.find(params[:id])
    if @submission_status.update(status: params[:status])
      render json: fmt(ok, @submission_status)
    else
      render json: fmt(unprocessable_entity, [], @submission_status.errors.full_messages.join(', '))
    end
  end

  # 3. 承認済・再提出・未確認の件数取得
  def get_health_center_submission_status_counts
    @statuses = HealthCenterSubmissionStatus.where(group_id: params[:group_id])
    render json: fmt(ok, {
                       approved: @statuses.approved.count,
                       waiting_resubmission: @statuses.waiting_resubmission.count,
                       unapproved: @statuses.unapproved.count
                     })
  end

  # 4. メモ（コメント）保存
  def create_health_center_submission_status_comment
    @submission_status = HealthCenterSubmissionStatus.find(params[:health_center_submission_status_id])
    @comment = @submission_status.comments.build(body: params[:body])
    if @comment.save
      render json: fmt(created, @comment)
    else
      render json: fmt(unprocessable_entity, [], @comment.errors.full_messages.join(', '))
    end
  end

  # 5. グループの全申請詳細取得（矢印切替用）
  def get_health_center_submission_status_show_for_admin_view
    group = Group.preload(
      :health_center_submission_statuses,
      :food_products,
      :employees,
      :venue_map,
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

  private

  # 一覧画面用のデータ整形
  def fit_index_for_admin_view(groups)
    groups.map do |group|
      statuses = group.health_center_submission_statuses.index_by(&:application_type)
      {
        group: group,
        group_category: group.group_category,
        fes_year: group.fes_year,
        food_product: statuses['food_product']&.status,
        purchase_list: statuses['purchase_list']&.status,
        cooking_process_order: statuses['cooking_process_order']&.status,
        employee: statuses['employee']&.status,
        venue_map: statuses['venue_map']&.status,
        equipment: statuses['equipment']&.status
      }
    end
  end

  # 各申請タイプの詳細データを組み立てる
  def build_submissions_data(group)
    statuses = group.health_center_submission_statuses.includes(:comments)

    statuses.map do |submission_status|
      {
        id: submission_status.id,
        application_type: submission_status.application_type,
        status: submission_status.status,
        comments: submission_status.comments,
        detail: fetch_detail_for(group, submission_status.application_type)
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
      group.fire_equipment_orders
    end
  end
end
