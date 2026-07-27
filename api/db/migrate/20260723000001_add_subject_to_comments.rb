# frozen_string_literal: true

class AddSubjectToComments < ActiveRecord::Migration[6.1]
  class MigrationComment < ActiveRecord::Base
    self.table_name = 'comments'
  end

  def up
    add_column :comments, :subject, :string

    MigrationComment.reset_column_information
    MigrationComment.find_each do |comment|
      next if comment.body.blank?

      subject_line, rest = comment.body.split("\n\n", 2)
      next unless subject_line.to_s.start_with?('件名: ') && rest.present?

      comment.update_columns(
        subject: subject_line.sub(/\A件名:\s*/, ''),
        body: rest
      )
    end
  end

  def down
    remove_column :comments, :subject
  end
end
