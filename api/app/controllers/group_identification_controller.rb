class GroupIdentificationController < ApplicationController
  before_action :set_group_identification, only: [:update, :destroy]

  def index
    if params[:fes_year_id] == "0"
      @groups = Group.where.not(group_category_id: 3)
    else
      @groups = Group.where(fes_year_id: params[:fes_year_id]).where.not(group_category_id: 3)
    end
    @group_identifications = @groups.map{
      |group|
      {
        "id": group.group_identification.nil? ? nil : group.group_identification.id,
        "group_id": group.id,
        "name": group.name,
        "number": group.number.nil? ? nil : group.number,
        "place": group.place.nil? ? nil : group.place,
        "created_at": group.group_identification.nil? ? nil : group.group_identification.created_at,
        "updated_at": group.group_identification.nil? ? nil : group.group_identification.updated_at
        
      }
    }
    render json: fmt(ok, @group_identifications)
  end

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
