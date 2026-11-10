# frozen_string_literal: true

class Api::V1::PlaceAllowListsApiController < ApplicationController
  before_action :authenticate_api_user!
end
