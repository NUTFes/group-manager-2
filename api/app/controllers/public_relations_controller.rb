class PublicRelationsController < ApplicationController
  before_action :set_public_relation, only: %i[ show update destroy ]

  # GET /public_relations
  # GET /public_relations.json
  def index
    @public_relations = PublicRelation.all
  end

  # GET /public_relations/1
  # GET /public_relations/1.json
  def show
  end

  # POST /public_relations
  # POST /public_relations.json
  def create
    @public_relation = PublicRelation.new(public_relation_params)

    if @public_relation.save
      render :show, status: :created, location: @public_relation
    else
      render json: @public_relation.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /public_relations/1
  # PATCH/PUT /public_relations/1.json
  def update
    if @public_relation.update(public_relation_params)
      render :show, status: :ok, location: @public_relation
    else
      render json: @public_relation.errors, status: :unprocessable_entity
    end
  end

  # DELETE /public_relations/1
  # DELETE /public_relations/1.json
  def destroy
    @public_relation.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_public_relation
      @public_relation = PublicRelation.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def public_relation_params
      params.permit(:group_id, :picture_path, :blurb)
    end
end
