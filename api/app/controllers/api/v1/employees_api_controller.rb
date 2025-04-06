# frozen_string_literal: true

module Api
  module V1
    class EmployeesApiController < ApplicationController
      def get_employee_index_for_admin_view
        @employees = Employee.with_groups
        render json: fmt(ok, @employees)
      end

      def get_employee_show_for_admin_view
        @employee = Employee.with_group(params[:id])
        render json: fmt(ok, @employee)
      end

      def fit_employee_index_for_admin_view(employees)
        employees.map do |employee|
          {
            "employee": employee,
            "group": employee.group,
            "stool_test": employee.stool_test
          }
        end
      end

      # 絞り込み機能
      def get_refinement_employees
        fes_year_id = params[:fes_year_id].to_i
        # 指定なし
        @employees = if fes_year_id.zero?
                       Employee.all
                     # fes_year_id指定
                     else
                       Employee.preload(:group).map do |employee|
                         employee if employee.group.fes_year_id == fes_year_id
                       end.compact
                     end

        if @employees.count.zero?
          render json: fmt(not_found, [], 'Not found empolees')
        else
          render json: fmt(ok, fit_employee_index_for_admin_view(@employees))
        end
      end

      # あいまい検索
      def get_search_employees
        word = params[:word]
        @employees = Employee.all.map do |employee|
          employee if employee.group.name.include?(word) || employee.name.include?(word)
        end.compact
        if @employees.count.zero?
          render json: fmt(not_found, [], 'Not found employees')
        else
          render json: fmt(ok, fit_employee_index_for_admin_view(@employees))
        end
      end
    end
  end
end
