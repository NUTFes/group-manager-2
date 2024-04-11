class Api::V1::AnnouncementsApiController < ApplicationController

    def get_announcement_index_for_admin_view
      @announcements = Announcement.with_groups
      render json: fmt(ok, @announcements)
    end

    def get_announcement_show_for_admin_view
      @announcement = Announcement.with_group(params[:id])
      render json: fmt(ok, @announcement)
    end

    def fit_announcement_index_for_admin_view(announcements)
        announcements.map{
        |announcement|
        {
          "announcement": announcement,
           "group": announcement.group
        }
      }
    end

    def get_announcement_for_admin_view
      @groups = Group.with_announcement(params[:id])
      render json: fmt(ok, @groups)
    end

    # admin_viewのannouncement/indexの形に整える
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
    def get_refinement_announcements
      fes_year_id = params[:fes_year_id].to_i
      # 両方ともALL
      if fes_year_id == 0
        @groups = Group.with_announcements
        # fes_year_idだけ指定
      elsif fes_year_id != 0
        @groups = Group.with_announcement_narrow_down_by_fes_year(fes_year_id)
      end

      if @groups.count == 0
        render json: fmt(not_found, [], "Not found groups")
      else
        render json: fmt(ok, @groups)
      end
    end

    # あいまい検索機能
    def get_search_announcements
      word = params[:word]
      @groups = Group.with_announcement_narrow_down_by_search_word(word)
      if @groups.count == 0
        render json: fmt(not_found, [], "Not found groups")
      else
        render json: fmt(ok, @groups)
      end
    end







  end
