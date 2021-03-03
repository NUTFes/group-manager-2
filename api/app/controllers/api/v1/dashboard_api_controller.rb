class Api::V1::DashboardApiController < ApplicationController
    def get_dashboard_info
        groups = Group.all
        groups_length = groups.length
        cate_1_length = groups.where(group_category:1).length
        cate_2_length = groups.where(group_category:2).length
        cate_3_length = groups.where(group_category:3).length
        cate_4_length = groups.where(group_category:4).length
        cate_5_length = groups.where(group_category:5).length
        cate_6_length = groups.where(group_category:6).length
        group_data = {
            groups_length: groups_length,
            cate_1_length: cate_1_length,
            cate_2_length: cate_2_length,
            cate_3_length: cate_3_length,
            cate_4_length: cate_4_length,
            cate_5_length: cate_5_length,
            cate_6_length: cate_6_length
        } 

        render json: group_data
    end
end