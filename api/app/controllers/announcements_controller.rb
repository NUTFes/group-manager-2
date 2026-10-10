# frozen_string_literal: true

class AnnouncementsController < ApplicationController
  before_action :set_announcement, only: %i[show update destroy]

  # GET /announcements
  # GET /announcements.json
  def index
    @announcements = current_user_group_scope(Announcement)
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
    group = current_api_user_group!(announcement_params[:group_id])
    return unless group

    @announcement = Announcement.create(announcement_params.merge(group_id: group.id))
    render json: fmt(created, @announcement)
  end

  # PATCH/PUT /announcements/1
  # PATCH/PUT /announcements/1.json
  def update
    attrs = announcement_params
    return if attrs[:group_id].present? && !current_api_user_group!(attrs[:group_id])

    @announcement.update(attrs)
    render json: fmt(created, @announcement, "Updated announcement id = #{params[:id]}")
  end

  # DELETE /announcements/1
  # DELETE /announcements/1.json
  def destroy
    @announcement.destroy
    render json: fmt(ok, [], "Deleted announcement = #{params[:id]}")
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_announcement
    @announcement = current_user_group_record!(Announcement, params[:id])
  end

  # Only allow a list of trusted parameters through.
  def announcement_params
    params.permit(:group_id, :message, :status, :id)
  end
end
