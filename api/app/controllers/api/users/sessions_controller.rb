# app/controllers/users/sessions_controller.rb
class Users::SessionsController < Devise::SessionsController
  respond_to :json

  private

  def respond_with(resource, _opts = {})
    render json: { id: resource.id, email: resource.email }, status: :ok
  end

  def respond_to_on_destroy
    head :no_content
  end
end
