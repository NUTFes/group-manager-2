class Api::V1::SubRepApiController < ApplicationController

  def get_sub_rep_details
    # 副代表の詳細を取得する
    sub_rep = SubRep.find(params[:id])
    grade = sub_rep.grade.name
    department = sub_rep.department.name
    sub_rep_details = {
      sub_rep: sub_rep,
      grade: grade,
      department: department
    }
    render json: sub_rep_details
  end
end
