# frozen_string_literal: true

class UnRegisteredGroupsController < ApplicationController
  before_action :set_un_registered_group, only: %i[show update destroy]

  # GET /un_registered_groups
  # GET /un_registered_groups?group_id=1
  def index
    @un_registered_groups = params[:group_id].present? ? UnRegisteredGroup.where(group_id: params[:group_id]) : UnRegisteredGroup.all
    render json: fmt(:ok, @un_registered_groups)
  end

  # GET /un_registered_groups/:id
  def show
    render json: fmt(:ok, @un_registered_group)
  end

  # POST /un_registered_groups
  def create
    @un_registered_group = UnRegisteredGroup.new(un_registered_group_params)

    if @un_registered_group.save
      render json: fmt(:ok, @un_registered_group), status: :created
    else
      render json: fmt(:unprocessable_entity, @un_registered_group.errors), status: :unprocessable_entity
    end
  end

  # PUT /un_registered_groups/:id
  def update
    if @un_registered_group.update(un_registered_group_params)
      render json: fmt(:ok, @un_registered_group)
    else
      render json: fmt(:unprocessable_entity, @un_registered_group.errors), status: :unprocessable_entity
    end
  end

  # DELETE /un_registered_groups/:id
  def destroy
    @un_registered_group.destroy
    head :no_content
  end

  # GET /un_registered_groups/group
  def group
    group_id = params[:group_id]
    order_type = params[:order_type]

    if group_id.present? && order_type.present?
      if UnRegisteredGroup.exists?(group_id: group_id, order_type: order_type)
        @un_registered_groups = UnRegisteredGroup.where(group_id: group_id, order_type: order_type)
        render json: fmt(:ok, @un_registered_groups)
      else
        render json: fmt(not_found, [], "Not found un_registered_group = #{group_id} and order_type = #{order_type}")
      end
    else
      render json: fmt(:bad_request, { error: 'group_id and order_type are required' }), status: :bad_request
    end
  end

  private

  def set_un_registered_group
    @un_registered_group = UnRegisteredGroup.find(params[:id])
  end

  def un_registered_group_params
    params.require(:un_registered_group).permit(:group_id, :order_type)
  end
end
