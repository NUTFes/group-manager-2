# frozen_string_literal: true

class AuthenticatedController < ApplicationController
  before_action :authenticate_api_user!
end
