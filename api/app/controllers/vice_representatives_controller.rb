class ViceRepresentativesController < ApplicationController
    before_action :set_vice_representative_by_group_id, only: [:get_by_group_id]
  
    def get_by_group_id
      render json: fmt(ok, @vice_representative)
    end
  
    def create
      vr = ViceRepresentative.new(vice_representative_params)
      if vr.save
        render json: fmt(ok, vr), status: :created
      else
        render json: fmt(unprocessable_entity, [], vr.errors.full_messages.join(', ')), status: :unprocessable_entity
      end
    end
  
    def update
      vr = ViceRepresentative.find_by(id: params[:id])
      if vr&.update(vice_representative_params)
        render json: fmt(ok, vr)
      else
        render json: fmt(unprocessable_entity, [], vr&.errors&.full_messages&.join(', ') || "Not found"), status: :unprocessable_entity
      end
    end
  
    private
  
    def set_vice_representative_by_group_id
      if ViceRepresentative.exists?(group_id: params[:group_id])
        @vice_representative = ViceRepresentative.find_by(group_id: params[:group_id])
      else
        render json: fmt(not_found, [], "Not found vice_representative = #{params[:group_id]}"), status: :not_found
      end
    end
  
    def vice_representative_params
      params.permit(:group_id, :is_group, :name, :number, :grade, :field, :address)
    end
  end
  