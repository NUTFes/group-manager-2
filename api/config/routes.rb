Rails.application.routes.draw do
  resources :employees
  resources :sub_reps
  resources :power_orders
  resources :place_allow_lists
  resources :assign_group_places
  resources :place_orders
  resources :stage_common_options
  resources :groups
  resources :user_details
  namespace 'api' do
    namespace 'v1' do
      # resources :users
      get "users/index" => "users#index"
      get "users/show" => "users#show"
      get "users/get_user_detail" => "users#get_user_detail"
      get "current_user/groups" => "current_user_api#get_groups"
    end
  end
  namespace :api do
    mount_devise_token_auth_for 'User', at: 'auth', controllers: {
      registrations: 'api/auth/registrations'
    }
  end
end
