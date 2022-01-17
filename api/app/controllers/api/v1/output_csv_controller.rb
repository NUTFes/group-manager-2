class Api::V1::OutputCsvController < ApplicationController
  require 'csv'
  
  def output_groups_csv
    @groups = Group.all
    bom = "\uFEFF"
    csv_data = CSV.generate(bom) do |csv|
      column_name = %w(name, project_name, activity, user_id, group_category_id, fes_year_id)
      csv << column_name
      @groups.each do |group|
        column_values = [
          group.name,
          group.project_name,
          group.activity,
          group.user_id,
          group.group_category_id,
          group.fes_year_id
        ]
        csv << column_values
      end
    end
    send_data(csv_data, filename: "参加団体一覧.csv")
  end

end
