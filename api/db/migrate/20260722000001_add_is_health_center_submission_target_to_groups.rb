# frozen_string_literal: true

class AddIsHealthCenterSubmissionTargetToGroups < ActiveRecord::Migration[6.1]
  def change
    add_column :groups, :is_health_center_submission_target, :boolean, default: true, null: false
  end
end
