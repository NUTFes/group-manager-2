# frozen_string_literal: true

class HealthCenterSubmissionStatus < ApplicationRecord
  belongs_to :group
  has_many :comments, as: :commentable, dependent: :destroy

  DEFAULT_STATUS = 'unsubmitted'

  enum application_type: {
    food_product: 0,
    purchase_list: 1,
    cooking_process_order: 2,
    employee: 3,
    venue_map: 4,
    equipment: 5
  }

  enum status: {
    unapproved: 0,
    waiting_resubmission: 1,
    approved: 2,
    unsubmitted: 3
  }

  validates :application_type, presence: true, uniqueness: { scope: :group_id }
  validates :status, presence: true

  after_update_commit :notify_slack_if_resubmitted_to_unapproved

  APPLICATION_TYPE_JA = {
    'food_product' => '販売品申請',
    'purchase_list' => '購入品申請',
    'cooking_process_order' => '調理工程申請',
    'employee' => '従業員申請',
    'venue_map' => '模擬店平面図申請',
    'equipment' => '物品申請'
  }.freeze

  def self.ensure_for_group_and_application_type!(group_id:, application_type:, status: DEFAULT_STATUS)
    submission_status = find_or_initialize_by(group_id: group_id, application_type: application_type)
    submission_status.status = status
    submission_status.save!
    submission_status
  end

  def self.insert_default_for_group_and_application_type!(group_id:, application_type:, status: DEFAULT_STATUS)
    find_or_create_by!(group_id: group_id, application_type: application_type) do |submission_status|
      submission_status.status = status
    end
  end

  def self.default_submissions_for(group)
    statuses = group.health_center_submission_statuses.includes(:comments).index_by(&:application_type)

    application_types.keys.map do |application_type|
      submission_status = statuses[application_type]

      {
        id: submission_status&.id,
        application_type: application_type,
        status: submission_status&.status || DEFAULT_STATUS,
        comments: submission_status&.comments || [],
        detail: nil
      }
    end
  end

  private

  def notify_slack_if_resubmitted_to_unapproved
    was_resubmission = status_before_last_save == 'waiting_resubmission'
    is_unapproved_now = status == 'unapproved'

    if saved_change_to_status? && was_resubmission && is_unapproved_now
      client = Slack::Web::Client.new

      application_type_name = APPLICATION_TYPE_JA[application_type.to_s] || application_type
      group_name = group.name
      project_name = group.project_name
      group_category_name = group.group_category&.name

      message_text = <<~MSG
        「#{group_name}」が再提出されました
        ーーーーーーーーーーーーーーーー
        参加団体：#{group_name}
        企画名：#{project_name}
        参加形式：#{group_category_name}

        申請種類：#{application_type_name}

        管理者画面にログインして内容を確認し、承認してください
        ーーーーーーーーーーーーーーーー
      MSG

      begin
        client.chat_postMessage(
          token: ENV.fetch('BOT_USER_ACCESS_TOKEN', nil),
          channel: "##{ENV.fetch('CHANNEL', nil)}",
          text: message_text
        )
      rescue StandardError => e
        Rails.logger.error("Slack通知に失敗しました: #{e.message}")
      end
    end
  end
end
