# frozen_string_literal: true

class Announcement < ApplicationRecord
  belongs_to :group

  def self.with_groups
    @record = Announcement.preload(:group)
                          .map do |announcement|
      {
        announcement: announcement,
        group: announcement.group
      }
    end
  end

  def self.with_group(announcement_id)
    announcement = Announcement.find(announcement_id)
    {
      announcement: announcement,
      group: announcement.group
    }
  end

  def to_info_h
    return {
      id: id,
      group_id: group_id,
      message: message,
      status: status
    }
  end
end
