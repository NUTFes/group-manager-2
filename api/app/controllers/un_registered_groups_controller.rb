class UnRegisteredGroupsController < ApplicationController
  before_action :set_un_registered_group, only: %i[show update destroy]

  # GET /un_registered_groups
  def index
    @un_registered_groups = UnRegisteredGroup.all
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
    render json: fmt(:no_content, nil), status: :no_content
  end

  private

  def set_un_registered_group
    @un_registered_group = UnRegisteredGroup.find(params[:id])
  end

  def un_registered_group_params
    params.require(:un_registered_group).permit(:group_id, :order_type)
  end
end
