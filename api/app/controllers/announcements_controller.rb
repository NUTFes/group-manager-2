class AnnouncementsController < ApplicationController
  before_action :set_announcement, only: [:show, :update, :destroy]

  # GET /announcements
  # GET /announcements.json
  def index
    @announcements = Announcement.all
    render json: fmt(ok, @announcements)
  end

  # GET /announcements/1
  # GET /announcements/1.json
  def show
    render json: fmt(ok, @announcement)
  end

  # POST /announcements
  # POST /announcements.json
  def create
    @announcement = Announcement.create(announcement_params)
    render json: fmt(created, @announcement)
  end

  # PATCH/PUT /announcements/1
  # PATCH/PUT /announcements/1.json
  def update
    @announcement.update(announcement_params)
    render json: fmt(created, @announcement, "Updated announcement id = "+params[:id])
  end

  # DELETE /announcements/1
  # DELETE /announcements/1.json
  def destroy
    @announcement.destroy
    render json: fmt(ok, [], "Deleted announcement = "+params[:id])
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_announcement
      if Announcement.exists?(params[:id])
        @announcement = Announcement.find(params[:id])
      else
        render json: fmt(not_found, [], "Not found announcement = "+params[:id])
      end
    end

    # Only allow a list of trusted parameters through.
    def announcement_params
      params.permit(:group_id, :message, :status, :id)
    end
end
