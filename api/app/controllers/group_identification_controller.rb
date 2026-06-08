# frozen_string_literal: true

class GroupIdentificationController < ApplicationController
  before_action :set_group_identification, only: %i[update destroy]

  def index
    # fes_year_idで絞り込み
    @groups = if params[:fes_year_id] == '0'
                Group.all
              else
                Group.where(fes_year_id: params[:fes_year_id])
              end

    # カテゴリで絞り込み
    @groups = @groups.where(group_category_id: params[:group_category_id]) if params[:group_category_id] != '0'

    @group_identifications = @groups.map do |group|
      {
        id: group.group_identification&.id,
        group_id: group.id,
        name: group.name,
        group_category_id: group.group_category.id,
        group_category: group.group_category.name,
        number: group.number.nil? ? nil : group.number,
        place: group.place.nil? ? nil : group.place,
        stage: group.stage.nil? ? nil : group.stage,
        created_at: group.group_identification&.created_at,
        updated_at: group.group_identification&.updated_at

      }
    end
    render json: fmt(ok, @group_identifications)
  end

  def create
    @group_identification = GroupIdentification.new(group_identification_params)
    if @group_identification.save
      render json: fmt(created, @group_identification)
    else
      render json: fmt(unprocessable_entity, @group_identification.errors), status: :unprocessable_entity
    end
  end

  def update
    @group_identification.update(group_identification_params)
    render json: fmt(ok, @group_identification, "Updated group_identification id = #{params[:id]}")
  end

  def destroy
    @group_identification.destroy
    render json: fmt(ok, [], "Deleted group_identification id = #{params[:id]}")
  end

  private

  def set_group_identification
    if GroupIdentification.exists?(params[:id])
      @group_identification = GroupIdentification.find(params[:id])
    else
      render json: fmt(not_found, [], "Not found group_identification = #{params[:id]}"), status: :not_found
    end
  end

  def group_identification_params
    params.permit(:group_id, :number)
  end
end
