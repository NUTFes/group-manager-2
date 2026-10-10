# frozen_string_literal: true

class StaffController < AuthenticatedController
  before_action :require_staff_or_above!
end
