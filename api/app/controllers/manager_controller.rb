# frozen_string_literal: true

class ManagerController < StaffController
  before_action :require_manager!
end
