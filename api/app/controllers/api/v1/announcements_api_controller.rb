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

    def get_refinement_announcements

        fes_year_id = params[:fes_year_id].to_i
        # 指定なし
        if fes_year_id == 0
          @announcements = Announcement.all
          #fes_year_id指定
        else
          @announcements = Announcement.preload(:group).map{ |announcements| announcements if announcements.group.fes_year_id == fes_year_id }.compact
        end
      if @announcements.count == 0
        render json: fmt(not_found, [], "Not found announcements")
      else
        render json: fmt(ok, fit_announcement_index_for_admin_view(@announcements))
      end
    end

    #あいまい検索
    def get_search_announcements
      word = params[:word]
      @announcements = Announcement.all.map{ |announcement| announcement if announcement.group.name.include?(word)  }.compact
      if @announcements.count == 0
        render json: fmt(not_found, [], "Not found announcements")
      else
        render json: fmt(ok, fit_announcements_index_for_admin_view(@announcements))
      end
    end
  end
