# frozen_string_literal: true

class Api::V1::PurchaseListsApiController < Api::V1::StaffController
  def get_purchase_list_index_for_admin_view
    @purchase_lists = PurchaseList.with_groups_and_info
    render json: fmt(ok, @purchase_lists)
  end

  def get_purchase_list_show_for_admin_view
    @purchase_list = PurchaseList.with_group_and_info(params[:id])
    render json: fmt(ok, @purchase_list)
  end

  def fit_purchase_list_index_for_admin_view(purchase_lists)
    purchase_lists.map do |purchase_list|
      {
        purchase_list: purchase_list,
        purchase_list_info: purchase_list.to_info_h,
        group: purchase_list.food_product.group
      }
    end
  end

  def get_refinement_purchase_lists
    fes_year_id = params[:fes_year_id].to_i
    is_fresh = params[:is_fresh].to_i
    is_fresh_list = [nil, true, false]

    # 指定なし
    @purchase_lists = if fes_year_id == 0 && is_fresh == 0
                        PurchaseList.all
                      # fes_year_idだけ指定
                      elsif fes_year_id != 0 && is_fresh == 0
                        PurchaseList.preload(:food_product).select { |purchase_list| purchase_list.food_product.group.fes_year_id == fes_year_id }
                      # is_freshだけ指定
                      elsif fes_year_id == 0 && is_fresh != 0
                        PurchaseList.where(is_fresh: is_fresh_list[is_fresh])
                      # 両方指定
                      else
                        PurchaseList.where(is_fresh: is_fresh_list[is_fresh]).preload(:food_product).select { |purchase_list| purchase_list.food_product.group.fes_year_id == fes_year_id }
                      end

    if @purchase_lists.none?
      render json: fmt(not_found, [], 'Not found purchase_lists')
    else
      render json: fmt(ok, fit_purchase_list_index_for_admin_view(@purchase_lists))
    end
  end

  # あいまい検索
  def get_search_purchase_lists
    word = params[:word]
    @purchase_lists = PurchaseList.preload(:food_product).select { |purchase_list| purchase_list.items.include?(word) || purchase_list.food_product.name.include?(word) || purchase_list.food_product.group.name.include?(word) }
    if @purchase_lists.none?
      render json: fmt(not_found, [], 'Not found purchase_lists')
    else
      render json: fmt(ok, fit_purchase_list_index_for_admin_view(@purchase_lists))
    end
  end
end
