class Api::V1::PrintApiController < ApplicationController
  
  # 従業員リスト
  def get_print_employees
    @group = Group.find(1)
    render json: @group
  end

  # 販売食品リスト
  def get_print_products
    @group = Group.find(1)
    render json: @group
  end

  # 貸出物品リスト
  def get_print_items
    print_list = []
    group1_list = []
    group2_list = []
    group3_list = []
    group4_list = []
    group5_list = []
    group6_list = []
    @group_1 = Group.where(group_category_id: 1)
    for group in @group_1
      assign_rental_item_list = []
      for assign_rental_item in group.assign_rental_items
        assign_rental_item_list << {
          name: assign_rental_item.rental_item.name,
          place: assign_rental_item.stocker_place.name,
          num: assign_rental_item.num
        }
      end
      group1_list << {
        group: group,
        assign_rental_item: assign_rental_item_list
      }
    end
    @group_2 = Group.where(group_category_id: 2)
    for group in @group_2
      assign_rental_item_list = []
      for assign_rental_item in group.assign_rental_items
        assign_rental_item_list << {
          name: assign_rental_item.rental_item.name,
          place: assign_rental_item.stocker_place.name,
          num: assign_rental_item.num
        }
      end
      group2_list << {
        group: group,
        assign_rental_item: assign_rental_item_list
      }
    end
    @group_3 = Group.where(group_category_id: 3)
    for group in @group_3
      assign_rental_item_list = []
      for assign_rental_item in group.assign_rental_items
        assign_rental_item_list << {
          name: assign_rental_item.rental_item.name,
          place: assign_rental_item.stocker_place.name,
          num: assign_rental_item.num
        }
      end
      group3_list << {
        group: group,
        assign_rental_item: assign_rental_item_list
      }
    end
    @group_4 = Group.where(group_category_id: 4)
    for group in @group_4
      assign_rental_item_list = []
      for assign_rental_item in group.assign_rental_items
        assign_rental_item_list << {
          name: assign_rental_item.rental_item.name,
          place: assign_rental_item.stocker_place.name,
          num: assign_rental_item.num
        }
      end
      group4_list << {
        group: group,
        assign_rental_item: assign_rental_item_list
      }
    end
    @group_5 = Group.where(group_category_id: 5)
    for group in @group_5
      assign_rental_item_list = []
      for assign_rental_item in group.assign_rental_items
        assign_rental_item_list << {
          name: assign_rental_item.rental_item.name,
          place: assign_rental_item.stocker_place.name,
          num: assign_rental_item.num
        }
      end
      group5_list << {
        group: group,
        assign_rental_item: assign_rental_item_list
      }
    end
    @group_6 = Group.where(group_category_id: 6)
    for group in @group_6
      assign_rental_item_list = []
      for assign_rental_item in group.assign_rental_items
        assign_rental_item_list << {
          name: assign_rental_item.rental_item.name,
          place: assign_rental_item.stocker_place.name,
          num: assign_rental_item.num
        }
      end
      group6_list << {
        group: group,
        assign_rental_item: assign_rental_item_list
      }
    end
    print_list = {
      group_1: group1_list,
      group_2: group2_list,
      group_3: group3_list,
      group_4: group4_list,
      group_5: group5_list,
      group_6: group6_list,
    }
    render json: print_list
  end

  # 使用電力リスト
  def get_print_powers
    @group = Group.find(1)
    render json: @group
  end

  # 連絡先リスト
  def get_print_address
    print_list = []
    group_1_list = []
    group_2_list = []
    group_3_list = []
    group_4_list = []
    group_5_list = []
    group_6_list = []
    # 模擬店(食品販売)
    @group_1 = Group.where(group_category_id: 1)
    for group in @group_1
      group_1_list << {
        group: group,
        user_name: group.user.name,
        user_tel: group.user.user_detail.tel,
        sub_rep_name: group.sub_rep.name,
        sub_rep_tel: group.sub_rep.tel
      }
    end
    # 模擬店(物品販売)
    @group_2 = Group.where(group_category_id: 2)
    for group in @group_2
      group_2_list << {
        group: group,
        user_name: group.user.name,
        user_tel: group.user.user_detail.tel,
        sub_rep_name: group.sub_rep.name,
        sub_rep_tel: group.sub_rep.tel
      }
    end
    # ステージ企画
    @group_3 = Group.where(group_category_id: 3)
    for group in @group_3
      group_3_list << {
        group: group,
        user_name: group.user.name,
        user_tel: group.user.user_detail.tel,
        sub_rep_name: group.sub_rep.name,
        sub_rep_tel: group.sub_rep.tel
      }
    end
    # 展示・体験
    @group_4 = Group.where(group_category_id: 4)
    for group in @group_4
      group_4_list << {
        group: group,
        user_name: group.user.name,
        user_tel: group.user.user_detail.tel,
        sub_rep_name: group.sub_rep.name,
        sub_rep_tel: group.sub_rep.tel
      }
    end
    # 研究室公開
    @group_5 = Group.where(group_category_id: 5)
    for group in @group_5
      group_5_list << {
        group: group,
        user_name: group.user.name,
        user_tel: group.user.user_detail.tel,
        sub_rep_name: group.sub_rep.name,
        sub_rep_tel: group.sub_rep.tel
      }
    end
    # その他
    @group_6 = Group.where(group_category_id: 6)
    for group in @group_6
      group_6_list << {
        group: group,
        user_name: group.user.name,
        user_tel: group.user.user_detail.tel,
        sub_rep_name: group.sub_rep.name,
        sub_rep_tel: group.sub_rep.tel
      }
    end
    print_list = {
      group_1: group_1_list,
      group_2: group_2_list,
      group_3: group_3_list,
      group_4: group_4_list,
      group_5: group_5_list,
      group_6: group_6_list,
    }
    render json: print_list
  end

end
