# frozen_string_literal: true

class Api::V1::RentalItemAllowListsApiController < ApplicationController
  before_action :authenticate_api_user!
end
