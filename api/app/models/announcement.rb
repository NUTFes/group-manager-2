class Announcement < ApplicationRecord
  belongs_to :group

def self.with_groups
  @record = Announcement.preload(:group)
    .map{
      |announcement|
      {
        "announcement": announcement,
        "group": announcement.group
      }
    }
end

def self.with_group(announcement_id)
  announcement = Announcement.find(announcement_id)
  {
    "announcement": announcement,
    "group": announcement.group
  }
end

def to_info_h
  return {
    "id": self.id,
    "group_id": self.group_id,
  }
  end
end
