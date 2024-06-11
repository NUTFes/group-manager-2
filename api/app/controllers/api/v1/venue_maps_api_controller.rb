class Api::V1::VenueMapsApiController < ApplicationController

    def get_venue_map_for_admin_view
      @groups = Group.with_venue_map(params[:id])
      render json: fmt(ok, @groups)
    end

    # admin_viewのvenue_map/indexの形に整える
    def fit_group_index_for_admin_view(groups)
      groups.map{
        |group|
        {
          "group": group,
          "group_category": group.group_category,
          "fes_year": group.fes_year
        }
      }
    end

    # 絞り込み機能
    def get_refinement_venue_maps
      fes_year_id = params[:fes_year_id].to_i
      # 両方ともALL
      if fes_year_id == 0
        @groups = Group.with_venue_maps
        # fes_year_idだけ指定
      elsif fes_year_id != 0
        @groups = Group.with_venue_map_narrow_down_by_fes_year(fes_year_id)
      end

      if @groups.count == 0
        render json: fmt(not_found, [], "Not found groups")
      else
        render json: fmt(ok, @groups)
      end
    end

    # あいまい検索機能
    def get_search_venue_maps
      word = params[:word]
      @groups = Group.with_venue_map_narrow_down_by_search_word(word)
      if @groups.count == 0
        render json: fmt(not_found, [], "Not found groups")
      else
        render json: fmt(ok, @groups)
      end
    end

  end
