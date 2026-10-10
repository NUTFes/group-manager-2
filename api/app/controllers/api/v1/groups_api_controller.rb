# frozen_string_literal: true

class Api::V1::GroupsApiController < Api::V1::StaffController
  def get_group_index_for_admin_view
    @groups = Group.with_group_categories_and_fes_years
    render json: fmt(ok, @groups)
  end

  def get_group_for_admin_view
    @groups = Group.with_group_category_and_fes_year(params[:id])
    render json: fmt(ok, @groups)
  end

  def get_group_show_for_admin_view
    @groups = Group.with_order_info(params[:id])
    render json: fmt(ok, @groups)
  end

  def get_groups_have_no_public_relation
    @current_fes_year = UserPageSetting.first.fes_year
    @groups = Group.have_no_public_relation(@current_fes_year.id)
    render json: fmt(ok, @groups)
  end

  def get_groups_have_no_announcement
    @current_fes_year = UserPageSetting.first.fes_year
    @groups = Group.have_no_announcement(@current_fes_year.id)
    render json: fmt(ok, @groups)
  end

  def get_groups_have_no_cooking_process_order
    @current_fes_year = UserPageSetting.first.fes_year
    @groups = Group.have_no_cooking_process_order(@current_fes_year.id)
    render json: fmt(ok, @groups)
  end

  def get_groups_have_no_venue_map
    @current_fes_year = UserPageSetting.first.fes_year
    @groups = Group.have_no_venue_map(@current_fes_year.id)
    render json: fmt(ok, @groups)
  end

  # admin_pageのviewの形に整える
  def fit_group_index_for_admin_view(groups)
    groups.map do |group|
      {
        group: group,
        group_category: group.group_category,
        fes_year: group.fes_year
      }
    end
  end

  # fes_yearによる絞り込み
  def get_groups_refinemented_by_current_fes_year
    @current_fes_year = UserPageSetting.first.fes_year
    @group = Group.where(fes_year_id: @current_fes_year.id)
    render json: fmt(ok, @group)
  end

  # 絞り込み機能
  def get_refinement_groups
    fes_year_id = params[:fes_year_id].to_i
    group_category_id = params[:group_category_id].to_i
    committee = params[:committee].to_i
    is_international = params[:is_international].to_i
    is_external = params[:is_external].to_i # 0: 指定なし(ALL) 1: true 2: false

    @groups = Group.all
    @groups = @groups.where(fes_year_id: fes_year_id) unless fes_year_id == 0
    @groups = @groups.where(group_category_id: group_category_id) unless group_category_id == 0
    @groups = @groups.where(committee: committee == 1) unless committee == 0
    @groups = @groups.where(is_international: is_international == 1) unless is_international == 0
    @groups = @groups.where(is_external: is_external == 1) unless is_external == 0

    if @groups.none?
      render json: fmt(not_found, [], 'Not found groups')
    else
      render json: fmt(ok, fit_group_index_for_admin_view(@groups))
    end
  end

  # あいまい検索機能
  def get_search_groups
    word = params[:word]
    groups_name = Group.where('name like ?', "%#{word}%")
    groups_category = Group.where('group_category_id like ?', "%#{word}%")
    project_name = Group.where('project_name like ?', "%#{word}%")

    @groups = (groups_name + groups_category + project_name).uniq

    if @groups.none?
      render json: fmt(not_found, [], 'Not found groups')
    else
      render json: fmt(ok, fit_group_index_for_admin_view(@groups))
    end
  end

  def get_groups_for_fire_equipment_order
    fes_year_id = params[:fes_year_id]
    @groups = if fes_year_id.present? && fes_year_id.to_i != 0
                Group.where(fes_year_id: fes_year_id).order(:id)
              else
                Group.order(:id)
              end
    render json: { data: @groups }
  end

  # admin_view: staff/managerが任意団体を編集するためのエンドポイント
  # (共有の GroupsController#update は current_api_user.groups にスコープされ、
  #  自団体を持たないstaff/managerアカウントでは404になるため専用に用意する)
  def update_group_for_admin_view
    @group = Group.find_by(id: params[:id])
    return render json: fmt(not_found, [], "Not found group id = #{params[:id]}"), status: :not_found unless @group

    return render_validation_errors(@group) unless @group.update(group_params)

    render json: fmt(ok, @group, "Updated group id = #{params[:id]}")
    notify_group_updated(@group) unless Current.skip_slack_notification
  end

  private

  def group_params
    params.permit(:name, :project_name, :activity, :group_category_id, :fes_year_id, :committee, :is_international, :is_external, :uses_place_id)
  end

  # GroupsController#update と同じ通知を送り、admin_viewからの編集でも通知が途切れないようにする
  def notify_group_updated(group)
    Slack::Web::Client.new.chat_postMessage(
      token: ENV.fetch('BOT_USER_ACCESS_TOKEN', nil),
      channel: "##{ENV.fetch('CHANNEL', nil)}",
      text: "

      参加団体「#{group.name}」が編集されました
      ーーーーーーーーーーーーーーーー
      代表者：#{group.user.name}
      委員: #{group.committee}
      参加形式：#{group.group_category.name}
      企画名：#{group.project_name}
      国際：#{group.is_international}
      学外：#{group.is_external}
      概要：#{group.activity}
      ーーーーーーーーーーーーーーーー

      "
    )
  end
end
