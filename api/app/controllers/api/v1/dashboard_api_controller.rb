class Api::V1::DashboardApiController < ApplicationController
    def get_dashboard_info
        # ユーザー数
        all_user_num = User.all.length
        developer_num = User.where(role_id:1).length
        manager_num = User.where(role_id:2).length
        user_num = User.where(role_id:3).length
        groups = Group.all
        groups_length = groups.length
        cate_1_length = groups.where(group_category:1).length
        cate_2_length = groups.where(group_category:2).length
        cate_3_length = groups.where(group_category:3).length
        cate_4_length = groups.where(group_category:4).length
        cate_5_length = groups.where(group_category:5).length
        cate_6_length = groups.where(group_category:6).length
        all_length = StockerPlace.all.length
        stock_item_status_1 = StockerPlace.where(stock_item_status:1).length
        stock_item_status_2 = StockerPlace.where(stock_item_status:2).length
        stock_item_status_3 = StockerPlace.where(stock_item_status:3).length
        progress_stock_item_1 = (stock_item_status_1*100) / all_length
        progress_stock_item_2 = (stock_item_status_2*100) / all_length
        progress_stock_item_3 = (stock_item_status_3*100) / all_length
        assign_item_status_1 = StockerPlace.where(assign_item_status:1).length
        assign_item_status_2 = StockerPlace.where(assign_item_status:2).length
        assign_item_status_3 = StockerPlace.where(assign_item_status:3).length
        progress_assign_item_1 = (assign_item_status_1*100) / all_length
        progress_assign_item_2 = (assign_item_status_2*100) / all_length
        progress_assign_item_3 = (assign_item_status_3*100) / all_length
        group_data = {
            all_user_num: all_user_num,
            developer_num: developer_num,
            manager_num: manager_num,
            user_num: user_num,
            groups_length: groups_length,
            cate_1_length: cate_1_length,
            cate_2_length: cate_2_length,
            cate_3_length: cate_3_length,
            cate_4_length: cate_4_length,
            cate_5_length: cate_5_length,
            cate_6_length: cate_6_length,
            progress_stock_item_1: progress_stock_item_1,
            progress_stock_item_2: progress_stock_item_2,
            progress_stock_item_3: progress_stock_item_3,
            progress_assign_item_1: progress_assign_item_1,
            progress_assign_item_2: progress_assign_item_2,
            progress_assign_item_3: progress_assign_item_3,
        } 

        render json: group_data
    end
end
