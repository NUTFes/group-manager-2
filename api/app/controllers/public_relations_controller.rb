# frozen_string_literal: true

class PublicRelationsController < ApplicationController
  before_action :set_public_relation, only: %i[show update destroy]
  before_action :set_public_relation_by_group_id, only: [:get_by_group_id]

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
    old_picture_path = @public_relation.picture_path
    old_imgur_deletehash = @public_relation.imgur_deletehash

    updated = @public_relation.update(public_relation_params)
    ImgurImageDeleter.call_if_replaced(old_picture_path, old_imgur_deletehash, @public_relation.picture_path) if updated

    render json: fmt(created, @public_relation, "Updated public_relation id = #{params[:id]}")
  end

  def destroy
    imgur_deletehash = @public_relation.imgur_deletehash

    @public_relation.destroy
    ImgurImageDeleter.call(imgur_deletehash) if @public_relation.destroyed?

    render json: fmt(ok, [], "Deleted public_relation = #{params[:id]}")
  end

  # GET /public_relations/group_id/1
  def get_by_group_id
    render json: fmt(ok, @public_relation)
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_public_relation
    if PublicRelation.exists?(params[:id])
      @public_relation = PublicRelation.find(params[:id])
    else
      render json: fmt(not_found, [], "Not found public_relation = #{params[:id]}")
    end
  end

  # Use callbacks to share common setup or constraints between actions.
  def set_public_relation_by_group_id
    if PublicRelation.exists?(group_id: params[:group_id])
      @public_relation = PublicRelation.find_by(group_id: params[:group_id])
    else
      render json: fmt(not_found, [], "Not found public_relation with group_id = #{params[:group_id]}")
    end
  end

  # Only allow a list of trusted parameters through.
  def public_relation_params
    params.permit(
      :group_id,
      :picture_name,
      :picture_path,
      :imgur_deletehash,
      :blurb,
      :is_announcement_requested
    )
  end
end
