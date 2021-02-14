class Api::V1::GroupsApiController < ApplicationController
  def get_group_name
    groups = Group.all
    group_list = []
    for group in groups
      group_list << {
        id: group.id,
        name: group.name
      }
    end
    render json: group_list
  end
end
