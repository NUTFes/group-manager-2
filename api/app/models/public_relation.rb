# frozen_string_literal: true

class PublicRelation < ApplicationRecord
  belongs_to :group

  def as_json(options = {})
    options = (options || {}).dup
    options[:except] = Array(options[:except]) + [:imgur_deletehash]
    super
  end

  def to_info_h
    {
      id: id,
      group_id: group_id,
      picture_name: picture_name,
      picture_path: picture_path,
      blurb: blurb,
      is_announcement_requested: is_announcement_requested,
      created_at: created_at,
      updated_at: updated_at
    }
  end
end
