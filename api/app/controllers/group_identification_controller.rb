class GroupIdentificationController < ApplicationController
  before_action :set_group_identification, only: [:update, :destroy]

  def create
    @group_identification = GroupIdentification.create(group_identification_params)
    render json: fmt(created, @group_identification)
  end

  def update
    @group_identification.update(group_identification_params)
    render json: fmt(ok, @group_identification, "Updated group_identification id = "+params[:id])
  end

  def destroy
    @group_identification.destroy
    render json: fmt(ok, [], "Deleted group_identification id = "+params[:id])
  end

  private

  def set_group_identification
    if GroupIdentification.exists?(params[:id])
      @group_identification = GroupIdentification.find(params[:id])
    else
      render json: fmt(not_found, [], "Not found group_identification = "+params[:id])
    end
  end

  def group_identification_params
    params.permit(:group_id, :number)
  end

end
