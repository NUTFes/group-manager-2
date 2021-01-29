class GroupsController < ApplicationController
  before_action :set_group, only: [:show, :update, :destroy]

  # GET /groups
  # GET /groups.json
  def index
    @groups = Group.all
    render json: @groups
  end

  # GET /groups/1
  # GET /groups/1.json
  def show
    render json: @group
  end

  # POST /groups
  # POST /groups.json
  def create
    @group = Group.new(group_params)
    @group.save
    render json: @group
  end

  # PATCH/PUT /groups/1
  # PATCH/PUT /groups/1.json
  def update
    @group.update(group_params)
    render json: @group
  end

  # DELETE /groups/1
  # DELETE /groups/1.json
  def destroy
    @group.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_group
      @group = Group.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def group_params
      params.permit(:name, :project_name, :activity, :user_id, :group_category_id, :fes_year_id)
    end
end
