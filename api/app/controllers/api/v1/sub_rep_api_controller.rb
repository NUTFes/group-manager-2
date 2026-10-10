# frozen_string_literal: true

class Api::V1::SubRepApiController < Api::V1::StaffController
  # あいまい検索機能
  def get_search_sub_reps
    word = params[:word]
    @sub_reps = SubRep.where('name like ? or email like ?', "%#{word}%", "%#{word}%")
    if @sub_reps.none?
      render json: fmt(not_found, [], 'Not found sub_reps')
    else
      render json: fmt(ok, @sub_reps)
    end
  end
end
