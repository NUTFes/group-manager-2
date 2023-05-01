class PublicRelationsController < ApplicationController
  before_action :set_public_relation, only: %i[ show update destroy ]

  def index
    @public_relations = PublicRelation.all
    render json: fmt(ok, @public_relations)
  end

  def show
    render json: fmt(ok, @public_relation)
  end

  def create
    @public_relation = PublicRelation.create(public_relation_params)
    render json: fmt(created, @public_relation)
  end

  def update
    @public_relation.update(public_relation_params)
    render json: fmt(created, @public_relations, "Updated public_relation id = "+params[:id])
  end

  def destroy
    @public_relation.destroy
    render json: fmt(ok, [], "Deleted public_relation = "+params[:id])
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_public_relation
      if PublicRelation.exists?(params[:id])
        @public_relation = PublicRelation.find(params[:id])
      else
        render json: fmt(not_found, [], "Not found public_relation = "+params[:id])
      end
    end

    # Only allow a list of trusted parameters through.
    def public_relation_params
      params.permit(:group_id, :picture_name, :picture_path, :blurb, :announcement)
    end
end
