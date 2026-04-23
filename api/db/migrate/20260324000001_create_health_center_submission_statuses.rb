class CreateHealthCenterSubmissionStatuses < ActiveRecord::Migration[6.1]
  def change
    create_table :health_center_submission_statuses do |t|
      t.references :group, null: false, foreign_key: true
      t.integer :application_type, null: false
      t.integer :status, null: false, default: 0

      t.timestamps
    end

    add_index :health_center_submission_statuses,
              %i[group_id application_type],
              unique: true,
              name: 'index_health_center_submission_statuses_on_group_and_type'
  end
end
