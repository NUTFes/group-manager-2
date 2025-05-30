class EmployeesController < ApplicationController
  # before_action :authenticate_api_user!, except: [:index, :show, :get_by_group]
  before_action :set_employee, only: [:show, :update, :destroy]

  # GET /employees
  # GET /employees.json
  def index
    @employees = Employee.all
    render json: fmt(ok, @employees)
  end

  # GET /employees/1
  # GET /employees/1.json
  def show
    render json: fmt(ok, @employee)
  end

  # GET /employees/group/:group_id
  def get_by_group
    @employees = Employee.where(group_id: params[:group_id])
    render json: fmt(ok, @employees)
  end

  # POST /employees
  # POST /employees.json
  def create
    @employee = Employee.create(employee_params)
    render json: fmt(created, @employee)
  end

  # POST /employees/upsert
  # POST /employees/upsert.json
  def upsert
    now     = Time.current
    records = employees_params.map do |attrs|
      common = {
        group_id:      attrs[:group_id],
        name:          attrs[:name],
        student_id:    attrs[:student_id],
        stool_test_id: attrs[:stool_test_id]
      }

      if attrs[:id].present?
        # 更新対象：ID＋updated_at
        common.merge(id: attrs[:id], updated_at: now)
      else
        # 新規作成対象：created_at＋updated_at
        common.merge(created_at: now, updated_at: now)
      end
    end

    # 一度の SQL で INSERT／UPDATE をまとめ実行
    Employee.upsert_all(
      records,
      unique_by:  :id,
      update_only: %i[group_id name student_id stool_test_id updated_at]
    )

    # 更新／挿入されたレコードを取得して返却
    processed_ids = records.map { |r| r[:id] }.compact
    processed     = Employee.where(id: processed_ids)

    render json: fmt(ok, processed)
  rescue ActiveRecord::StatementInvalid => e
    render json: fmt(unprocessable_entity, [], e.message), status: :unprocessable_entity
  end

  # PATCH/PUT /employees/1
  # PATCH/PUT /employees/1.json
  def update
    if @employee.update(employee_params)
      render json: fmt(ok, @employee, "Updated employee id = #{params[:id]}")
    else
      render json: fmt(unprocessable_entity, [], @employee.errors.full_messages.join(', ')), status: :unprocessable_entity
    end
  end

  # DELETE /employees/1
  # DELETE /employees/1.json
  def destroy
    @employee.destroy
    render json: fmt(ok, [], "Deleted employee = #{params[:id]}")
  end

  private

  def set_employee
    @employee = Employee.find_by(id: params[:id])
    return if @employee

    render json: fmt(not_found, [], "Not found employee id=#{params[:id]}"), status: :not_found
  end

  # 単一レコード用 Strong Parameters
  def employee_params
    params.permit(:group_id, :name, :student_id, :stool_test_id)
  end

  # 複数レコード用 Strong Parameters
  def employees_params
    params.require(:employees).map do |emp|
      ActionController::Parameters
        .new(emp.to_unsafe_h)
        .permit(:id, :group_id, :name, :student_id, :stool_test_id)
        .to_h.symbolize_keys
    end
  end
end


