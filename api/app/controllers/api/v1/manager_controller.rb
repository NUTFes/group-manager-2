# frozen_string_literal: true

class Api::V1::ManagerController < Api::V1::StaffController
  before_action :require_manager!
end
