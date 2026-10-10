# frozen_string_literal: true

class Api::V1::StaffController < Api::V1::AuthenticatedController
  before_action :require_staff_or_above!
end
