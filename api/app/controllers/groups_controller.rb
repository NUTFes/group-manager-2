class GroupsController < ApplicationController
  before_action :set_group, only: [:show, :update, :destroy]

  # GET /groups
  # GET /groups.json
  def index
    @groups = Group.all
    render json: fmt(ok, @groups)
  end

  # GET /groups/1
  # GET /groups/1.json
  def show
    render json: fmt(ok, @group)
  end

  # POST /groups
  # POST /groups.json
  def create
    @group = Group.create(group_params)
    render json: fmt(created, @group)

    require 'slack-notifier'
    # slack Incomming Webhookの設定
    webhockurl = ""
    channel = "times-b1-ikarashi"
    username = "notibot"

    # 通知内容
    attachment = {
      color: "good",
      type: "mrkdwn",
      text: "
      
      参加団体「#{@group.name}」が追加されました
      ーーーーーーーーーーーーーーーー
      代表者：#{@group.user.name}
      参加形式：#{@group.group_category.name}
      企画名：#{@group.project_name}
      概要：#{@group.activity}
      ーーーーーーーーーーーーーーーー
  
      "

    }

    notifier = Slack::Notifier.new  webhockurl, CHANNEL: channel, USERNAME: username
    notifier.ping '', attachments: [ attachment ]    
  end

  # PATCH/PUT /groups/1
  # PATCH/PUT /groups/1.json
  def update
    @group.update(group_params)
    render json: fmt(created, @group, "Updated group id = "+params[:id])

    require 'slack-notifier'
    # slack Incomming Webhookの設定
    webhockurl = ""
    channel = "times-b1-ikarashi"
    username = "notibot"

    # 通知内容
    attachment = {
      color: "warning",
      type: "mrkdwn",
      text: "

      #{@group.name}が編集されました
      ーーーーーーーーーーーーーーーー
      代表者：#{@group.user.name}
      参加形式：#{@group.group_category.name}
      企画名：#{@group.project_name}
      概要：#{@group.activity}
      ーーーーーーーーーーーーーーーー

      "
    }

    notifier = Slack::Notifier.new  webhockurl, CHANNEL: channel, USERNAME: username
    notifier.ping '', attachments: [ attachment ]    
  end

  # DELETE /groups/1
  # DELETE /groups/1.json
  def destroy
    @group.destroy
    render json: fmt(ok, [], "Deleted group id = "+params[:id])
    
    require 'slack-notifier'
    # slack Incomming Webhookの設定
    webhockurl = ""
    channel = "times-b1-ikarashi"
    username = "notibot"
    # 通知内容
    attachment = {
      color: "danger",
      type: "mrkdwn",
      text: "#{@group.name}が削除されました
      ーーーーーーーーーーーーーーーー
      代表者：#{@group.user.name}
      参加形式：#{@group.group_category.name}
      企画名：#{@group.project_name}
      概要：#{@group.activity}
      ーーーーーーーーーーーーーーーー

      "
    }

    notifier = Slack::Notifier.new  webhockurl, CHANNEL: channel, USERNAME: username
    notifier.ping '', attachments: [ attachment ]    
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_group
      # groupのIDのgroupが存在するかを確認
      if Group.exists?(params[:id])
        @group = Group.find(params[:id])
      else
        # なければnot found
        render json: fmt(not_found, [], "Not found group id = "+params[:id])
      end
    end

    # Only allow a list of trusted parameters through.
    def group_params
      params.permit(:name, :project_name, :activity, :user_id, :group_category_id, :fes_year_id)
    end
end