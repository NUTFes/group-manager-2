Rails.application.routes.draw do
  resources :memos
  resources :news
  resources :purchase_lists
  resources :food_products
  resources :assign_rental_items
  resources :rentable_items
  resources :rental_items
  resources :rental_item_allow_lists
  resources :stocker_items
  resources :stocker_places
  resources :rental_orders
  resources :rental_items
  resources :assign_stages
  resources :stage_orders
  resources :stages
  resources :employees
  resources :sub_reps
  resources :power_orders
  resources :place_allow_lists
  resources :places
  resources :assign_group_places
  resources :place_orders
  resources :stage_common_options
  resources :groups
  resources :group_categories
  resources :user_details
  resources :shops
  resources :fes_years
  namespace 'api' do
    namespace 'v1' do
      # ユーザー周りのAPI
      get "users/index" => "users#index"
      get "users/show" => "users#show"
      get "users/show_user_detail/:id" => "users#show_user_detail"
      get "users/get_user_detail" => "users#get_user_detail"
      # 副代表周り
      get "get_sub_rep_details/:id" => "sub_rep_api#get_sub_rep_details"
      # 現在のユーザーについて
      get "current_user/show" => "current_user_api#show"
      get "current_user/groups" => "current_user_api#get_groups"
      get "current_user/groups/places" => "current_user_api#get_groups_place_allow_list"
      get "current_user/regist_info" => "current_user_api#get_regist_info"
      # 物品周り 
      get "get_stocker_item_for_stocker_place/:id" => "items_api#get_stocker_item_for_stocker_place"
      get "get_item_name" => "items_api#get_item_name"
      get "get_assign_rental_item_for_stocker_place/:stocker_place_id" => "items_api#get_assign_rental_item_for_stocker_place"
      # 参加団体周り
      get "get_group_name" => "groups_api#get_group_name"
      get "get_group_from_project_name/:id" => "groups_api#get_group_from_project_name"
      # ステージオプション周り
      get "get_stage_common_options_with_group/" => "stage_common_options_api#get_stage_common_options_with_group"
      get "get_stage_common_options_with_group/:id" => "stage_common_options_api#get_stage_common_option_with_group"
      # ステージ申請周り
      get "get_stage_orders_details" => "stage_orders_api#get_stage_orders_details"
      get "get_stage_order_details/:id" => "stage_orders_api#get_stage_order_details"
      # 使用会場周り
      get "get_place_allow_lists" => "place_allow_lists_api#get_place_allow_lists"
      get "get_place_allow_list/:id" => "place_allow_lists_api#get_place_allow_list"
      # 会場申請周り
      get "get_place_orders" => "place_orders_api#get_place_orders"
      get "get_place_order/:id" => "place_orders_api#get_place_order"
      # 電力申請周り
      get "get_power_orders" => "power_orders_api#get_power_orders"
      get "get_power_order/:id" => "power_orders_api#get_power_order"
      # 使用可能物品周り
      get "get_rental_item_allow_lists" => "rental_item_allow_lists_api#get_rental_item_allow_lists"
      get "get_rental_item_allow_list/:id" => "rental_item_allow_lists_api#get_rental_item_allow_list"
      # 在庫物品周り
      get "get_stocker_items" => "stocker_items_api#get_stocker_items"
      get "get_stocker_item/:id" => "stocker_items_api#get_stocker_item"
    end
  end
  namespace :api do
    mount_devise_token_auth_for 'User', at: 'auth', controllers: {
      registrations: 'api/auth/registrations'
    }
  end
end
