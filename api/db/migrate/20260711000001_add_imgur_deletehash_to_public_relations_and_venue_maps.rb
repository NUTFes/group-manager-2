# frozen_string_literal: true

class AddImgurDeletehashToPublicRelationsAndVenueMaps < ActiveRecord::Migration[6.1]
  def change
    add_column :public_relations, :imgur_deletehash, :string
    add_column :venue_maps, :imgur_deletehash, :string
  end
end
