class PublicRelation < ApplicationRecord
  belongs_to :group

  def to_info_h
    {
      id: id,
      group_id: group_id,
      picture_name: picture_name,
      picture_path: picture_path,
      blurb: blurb,
      created_at: created_at,
      updated_at: updated_at,
    }
  end
end
