Rails.application.routes.draw do

  # 識別番号
  post 'group_identification' => "group_identification#create"
  put 'group_identification/:id' => "group_identification#update"
  delete 'group_identification/:id' => "group_identification#destroy"

  # 会場割り当て機能
  post 'place_numbers' => "place_number#create"
  put 'place_numbers/:id' => "place_number#update"
  delete 'place_numbers/:id' => "place_number#destroy"

  # ステージ割り当て機能
  post 'stage_numbers' => "stage_number#create"
  put 'stage_numbers/:id' => "stage_number#update"
  delete 'stage_numbers/:id' => "stage_number#destroy"
  
  # users
  get "/users" => "users#index"
  get "/users/:id" => "users#show"
  get "/current_user" => "users#get_current_user"
  put "/users/:id" => "users#update"
  delete "/users/:id" => "users#destroy"

  resources :user_page_settings
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
  resources :fes_dates
  resources :fes_years
  namespace 'api' do
    namespace 'v1' do
      #---管理者画面用---
      #---参加団体申請ページ
      get "get_group_index_for_admin_view" => "groups_api#get_group_index_for_admin_view"
      get "get_group_show_for_admin_view/:id" => "groups_api#get_group_show_for_admin_view"
      #---電力申請ページ
      get "get_power_order_index_for_admin_view" => "power_orders_api#get_power_order_index_for_admin_view"
      get "get_power_order_show_for_admin_view/:id" => "power_orders_api#get_power_order_show_for_admin_view"

      get "get_groups_csv/:fes_year_id" => "output_csv#output_groups_csv"
      get "get_sub_reps_csv/:fes_year_id" => "output_csv#output_sub_reps_csv"
      get "get_rental_orders_csv/:fes_year_id" => "output_csv#output_rental_orders_csv"
      get "get_power_orders_csv/:fes_year_id" => "output_csv#output_power_orders_csv"
      get "get_place_orders_csv/:fes_year_id" => "output_csv#output_place_orders_csv"
      get "get_stage_orders_csv/:fes_year_id" => "output_csv#output_stage_orders_csv"
      get "get_stage_common_options_csv/:fes_year_id" => "output_csv#output_stage_common_options_csv"
      get "get_employees_csv/:fes_year_id" => "output_csv#output_employees_csv"
      get "get_food_products_csv/:fes_year_id" => "output_csv#output_food_products_csv"
      get "get_purchase_lists_csv/:fes_year_id" => "output_csv#output_purchase_lists_csv"
      get "get_users_csv/:fes_year_id" => "output_csv#output_users_csv"
      # ダッシュボード用API
      get "dashboard" => "dashboard_api#get_dashboard_info"
      # ユーザー周りのAPI
      get "users/index" => "users#index"
      get "users/show" => "users#show"
      get "users/show_user_detail/:id" => "users#show_user_detail"
      get "users/get_user_detail" => "users#get_user_detail"
      get "update_user/:id/:role_id" => "users#update"
      post "users/edit_user_info" => "users#edit_user_info"
      post "users/reset_password" => "users#reset_password"
      post "get_refinement_users" => "users#get_refinement_users"
      post "get_search_users" => "users#get_search_users"
      # 副代表周り
      get "get_sub_rep_details/:id" => "sub_rep_api#get_sub_rep_details"
      # 現在のユーザーについて
      get "current_user/show" => "current_user_api#show"
      get "current_user/groups" => "current_user_api#get_groups"
      get "current_user/groups/places" => "current_user_api#get_groups_place_allow_list"
      get "current_user/regist_info" => "current_user_api#get_regist_info"

      ### TODO: フロントが整備されたらこのAPIを/current_user/regist_infoにして既存のものを消す
      get "current_user/current_regist_info" => "current_user_api#current_regist_info"
      ###
      
      get "current_user/get_user_detail_raw" => "current_user_api#get_user_detail_raw"
      post "current_user/edit_user_info" => "current_user_api#edit_user_info"
      post "current_user/password_reset" => "current_user_api#password_reset"
      # --- 新規ユーザー周りのAPI --- 
      get "get_user_with_user_details" => "users_api#get_user_with_user_details"
      get "get_user_with_user_detail" => "user_api#get_user_with_user_detail"
      # 物品周り 
      get "get_stocker_item_for_stocker_place/:id" => "items_api#get_stocker_item_for_stocker_place"
      get "get_item_name" => "items_api#get_item_name"
      get "get_assign_rental_item_for_stocker_place/:stocker_place_id" => "items_api#get_assign_rental_item_for_stocker_place"
      get "get_rentable_items" => "items_api#get_rentable_items"
      # 参加団体周り
      get "get_group_name" => "groups_api#get_group_name"
      get "get_group_from_project_name/:id" => "groups_api#get_group_from_project_name"
      get "get_groups" => "groups_api#get_groups"
      get "get_group/:id" => "groups_api#get_group"
      get "get_group_detail/:id" => "groups_api#get_group_detail"
      # --- 新規参加団体周りのAPI --- 
      get "get_group_with_categories" => "groups_api#get_group_with_categories"
      get "get_group_with_category" => "groups_api#get_group_with_category"
      get "get_group_with_categories_and_fes_years" => "groups_api#get_group_with_categories_and_fes_years"
      get "get_group_with_category_and_fes_year" => "groups_api#get_group_with_category_and_fes_year"
      get "get_group_with_sub_reps" => "groups_api#get_group_with_sub_reps"
      get "get_group_with_sub_rep" => "groups_api#get_group_with_sub_rep"
      get "get_group_with_place_orders" => "groups_api#get_group_with_place_orders"
      get "get_group_with_place_order" => "groups_api#get_group_with_place_order"
      get "get_group_with_stage_orders" => "groups_api#get_group_with_stage_orders"
      get "get_group_with_stage_order" => "groups_api#get_group_with_stage_order"
      get "get_group_with_stage_common_options" => "groups_api#get_group_with_stage_common_options"
      get "get_group_with_stage_common_option" => "groups_api#get_group_with_stage_common_option"
      get "get_group_with_power_orders" => "groups_api#get_group_with_power_orders"
      get "get_group_with_power_order" => "groups_api#get_group_with_power_order"
      get "get_group_with_rental_orders" => "groups_api#get_group_with_rental_orders"
      get "get_group_with_rental_order" => "groups_api#get_group_with_rental_order"
      get "get_group_with_employees" => "groups_api#get_group_with_employees"
      get "get_group_with_employee" => "groups_api#get_group_with_employee"
      get "get_group_with_food_products" => "groups_api#get_group_with_food_products"
      get "get_group_with_food_product" => "groups_api#get_group_with_food_product"
      post "get_refinement_groups" => "groups_api#get_refinement_groups"
      post "get_search_groups" => "groups_api#get_search_groups"
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
      # 物品申請周り
      get "get_rental_orders" => "rental_orders_api#get_rental_orders"
      get "get_rental_order/:id" => "rental_orders_api#get_rental_order"
      # 割り当て物品周り
      get "get_assign_rental_items" => "assign_rental_items_api#get_assign_rental_items"
      get "get_assign_rental_item/:id" => "assign_rental_items_api#get_assign_rental_item"
      # 従業員周り
      get "get_employees" => "employees_api#get_employees"
      get "get_employee/:id" => "employees_api#get_employee"
      # 販売食品周り
      get "get_food_products" => "food_products_api#get_food_products"
      get "get_food_product/:id" => "food_products_api#get_food_product"
      get "get_food_products_from_group/:id" => "food_products_api#get_food_products_from_group"
      get "group_food_products/:group_id" => "food_products_api#get_group_food_product"
      # 購入品周り
      get "get_purchase_lists" => "purchase_lists_api#get_purchase_lists"
      get "get_purchase_list/:id" => "purchase_lists_api#get_purchase_list"
      # 開催日周り
      get "get_fes_dates" => "fes_dates_api#get_fes_dates"
      get "get_fes_date/:id" => "fes_dates_api#get_fes_date"
      get "get_current_fes_dates" => "fes_dates_api#get_current_fes_dates"
      # 印刷ページ周り
      get "get_print_employees" => "print_api#get_print_employees"
      get "get_print_products" => "print_api#get_print_products"
      get "get_print_items" => "print_api#get_print_items"
      get "get_print_powers" => "print_api#get_print_powers"
      get "get_print_address" => "print_api#get_print_address"
    end
  end

  get "print_pdf/group/:group_id/output" => "print_pdf#output_rental_items_pdf"
  get "print_pdf/power/:fes_year_id/output" => "print_pdf#output_powers_pdf"
  get "print_pdf/employees/:fes_year_id/output" => "print_pdf#output_employees_pdf"
  get "print_pdf/rental_items_list/:fes_year_id/output" => "print_pdf#output_rental_items_list_pdf"
  get "print_pdf/contacts/:fes_year_id/output" => "print_pdf#output_contacts_pdf"
  get "print_pdf/food_products/:fes_year_id/output" => "print_pdf#output_food_products_pdf"
  get "print_pdf/group_info/:group_id/output" => "print_pdf#output_group_info_pdf"

  namespace :api do
    mount_devise_token_auth_for 'User', at: 'auth', controllers: {
      registrations: 'api/auth/registrations'
    }
  end
end
