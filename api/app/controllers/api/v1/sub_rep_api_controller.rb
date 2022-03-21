class Api::V1::SubRepApiController < ApplicationController
  
  # あいまい検索機能
  def get_search_sub_reps
    word = params[:word]
    @sub_reps = SubRep.where("name like ? or email like ?", "%#{word}%", "%#{word}%")
    if @sub_reps.count == 0
      render json: fmt(not_found, [], "Not found sub_reps")
    else
      render json: fmt(ok, @sub_reps)
    end
  end

end
