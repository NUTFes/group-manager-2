Rails.application.routes.draw do

  # 識別番号割り当て
  get 'group_identification' => "group_identification#index"
  post 'group_identification' => "group_identification#create"
  put 'group_identification/:id' => "group_identification#update"
  delete 'group_identification/:id' => "group_identification#destroy"

  # 会場割り当て機能
  get 'place_numbers' => "place_number#index"
  post 'place_numbers' => "place_number#create"
  put 'place_numbers/:id' => "place_number#update"
  delete 'place_numbers/:id' => "place_number#destroy"

  # ステージ割り当て機能
  get 'stage_numbers' => "stage_number#index"
  post 'stage_numbers' => "stage_number#create"
  put 'stage_numbers/:id' => "stage_number#update"
  delete 'stage_numbers/:id' => "stage_number#destroy"

  # users
  get "/users" => "users#index"
  get "/users/:id" => "users#show"
  get "/current_user" => "users#get_current_user"
  put "/users/:id" => "users#update"
  delete "/users/:id" => "users#destroy"
  post "/users/simply_user_create" => "users#simply_user_create"

  # ステージ
  get "/sunny/stages" => "stages#show_sunny"
  get "/rainy/stages" => "stages#show_rainy"

  # CRUD (/...)
  resources :user_page_settings
  resources :memos
  resources :news
  resources :purchase_lists
  post "/purchase_lists" => "purchase_lists#create"
  resources :food_products
  resources :assign_rental_items
  resources :rentable_items
  resources :rental_items
  resources :rental_item_allow_lists
  resources :stocker_items
  resources :stocker_places
  resources :rental_orders
  resources :assign_items
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
  resources :public_relations
  resources :venue_maps
  resources :announcements
  resources :cooking_process_orders
  resources :contact_persons

  # /api/v1/...
  namespace 'api' do
    namespace 'v1' do
      #---管理者画面用---

      #---物品割当
      post "get_refinement_stocker_item" => "assign_rental_items_api#get_refinement_stocker_item"
      post "get_refinement_assign_rental_item" => "assign_rental_items_api#get_refinement_assign_rental_item"

      #---ユーザー一覧ページ
      get "get_user_index_for_admin_view" => "users#get_user_index_for_admin_view"
      get "get_user_show_for_admin_view/:id" => "users#get_user_show_for_admin_view"
      get "users/show" => "users#show"

      #---代表者一覧ページ
      get "get_representative_index_for_admin_view" => "users#get_representative_index_for_admin_view"
      get "get_representative_show_for_admin_view/:id" => "users#get_representative_show_for_admin_view"
      post "get_refinement_representatives" => "representatives_api#get_refinement_represantatives"
      post "get_search_representatives" => "representatives_api#get_search_representatives"
      #(副代表の検索)
      post "get_search_sub_reps" => "sub_rep_api#get_search_sub_reps"

      #---参加団体申請ページ
      get "get_group_index_for_admin_view" => "groups_api#get_group_index_for_admin_view"
      get "get_group_show_for_admin_view/:id" => "groups_api#get_group_show_for_admin_view"
      get "get_group_for_admin_view/:id" => "groups_api#get_group_for_admin_view"
      post "get_refinement_groups" => "groups_api#get_refinement_groups"
      post "get_search_groups" => "groups_api#get_search_groups"
      get "get_groups_refinemented_by_current_fes_year" => "groups_api#get_groups_refinemented_by_current_fes_year"

      #---電力申請ページ
      get "get_power_order_index_for_admin_view" => "power_orders_api#get_power_order_index_for_admin_view"
      get "get_power_order_show_for_admin_view/:id" => "power_orders_api#get_power_order_show_for_admin_view"
      post "get_refinement_power_orders" => "power_orders_api#get_refinement_power_orders"
      post "get_search_power_orders" => "power_orders_api#get_search_power_orders"

      #---会場申請ページ
      get "get_place_order_index_for_admin_view" => "place_orders_api#get_place_order_index_for_admin_view"
      get "get_place_order_show_for_admin_view/:id" => "place_orders_api#get_place_order_show_for_admin_view"
      post "get_refinement_place_orders" => "place_orders_api#get_refinement_place_orders"
      post "get_search_place_orders" => "place_orders_api#get_search_place_orders"

      #---物品申請ページ
      get "get_rental_order_index_for_admin_view" => "rental_orders_api#get_rental_order_index_for_admin_view"
      get "get_rental_order_show_for_admin_view/:id" => "rental_orders_api#get_rental_order_show_for_admin_view"
      post "get_refinement_rental_orders" => "rental_orders_api#get_refinement_rental_orders"
      post "get_search_rental_orders" => "rental_orders_api#get_search_rental_orders"

      #---ステージ申請ページ
      get "get_stage_order_index_for_admin_view" => "stage_orders_api#get_stage_order_index_for_admin_view"
      get "get_stage_order_show_for_admin_view/:id" => "stage_orders_api#get_stage_order_show_for_admin_view"
      post "get_refinement_stage_orders" => "stage_orders_api#get_refinement_stage_orders"
      post "get_search_stage_orders" => "stage_orders_api#get_search_stage_orders"

      #---ステージオプション申請ページ
      get "get_stage_common_option_index_for_admin_view" => "stage_common_options_api#get_stage_common_option_index_for_admin_view"
      get "get_stage_common_option_show_for_admin_view/:id" => "stage_common_options_api#get_stage_common_option_show_for_admin_view"
      post "get_refinement_stage_common_options" => "stage_common_options_api#get_refinement_stage_common_options"
      post "get_search_stage_common_options" => "stage_common_options_api#get_search_stage_common_options"

      #---従業員申請ページ
      get "get_employee_index_for_admin_view" => "employees_api#get_employee_index_for_admin_view"
      get "get_employee_show_for_admin_view/:id" => "employees_api#get_employee_show_for_admin_view"
      post "get_refinement_employees" => "employees_api#get_refinement_employees"
      post "get_search_employees" => "employees_api#get_search_employees"

      #---販売品申請ページ
      get "get_food_product_index_for_admin_view" => "food_products_api#get_food_product_index_for_admin_view"
      get "get_food_product_show_for_admin_view/:id" => "food_products_api#get_food_product_show_for_admin_view"
      post "get_refinement_food_products" => "food_products_api#get_refinement_food_products"
      post "get_search_food_products" => "food_products_api#get_search_food_products"
      get "get_food_products_by_group_id/:group_id" => "food_products_api#get_food_products_by_group_id"

      #---購入品申請ページ
      get "get_purchase_list_index_for_admin_view" => "purchase_lists_api#get_purchase_list_index_for_admin_view"
      get "get_purchase_list_show_for_admin_view/:id" => "purchase_lists_api#get_purchase_list_show_for_admin_view"
      post "get_refinement_purchase_lists" => "purchase_lists_api#get_refinement_purchase_lists"
      post "get_search_purchase_lists" => "purchase_lists_api#get_search_purchase_lists"

      #---PR画像・文申請ページ
      get "get_public_relation_for_admin_view/:id" => "public_relations_api#get_public_relation_for_admin_view"
      post "get_refinement_public_relations" => "public_relations_api#get_refinement_public_relations"
      post "get_search_public_relations" => "public_relations_api#get_search_public_relations"
      get "get_groups_have_no_public_relation" => "groups_api#get_groups_have_no_public_relation"

      #---模擬店平面図申請ページ
      get "get_venue_map_for_admin_view/:id" => "venue_maps_api#get_venue_map_for_admin_view"
      post "get_refinement_venue_maps" => "venue_maps_api#get_refinement_venue_maps"
      post "get_search_venue_maps" => "venue_maps_api#get_search_venue_maps"
      get "get_groups_have_no_venue_map" => "groups_api#get_groups_have_no_venue_map"

      #---会場アナウンス文申請
      get "get_announcement_index_for_admin_view" => "announcements_api#get_announcement_index_for_admin_view"
      get "get_announcement_show_for_admin_view/:id" => "announcements_api#get_announcement_show_for_admin_view"
      get "get_announcement_for_admin_view/:id" => "announcements_api#get_announcement_for_admin_view"
      post "get_refinement_announcements" => "announcements_api#get_refinement_announcements"
      post "get_search_announcements" => "announcements_api#get_search_announcements"
      get "get_groups_have_no_announcement" => "groups_api#get_groups_have_no_announcement"

      #---調理工程表申請
      get "get_cooking_process_order_for_admin_view/:id" => "cooking_process_orders_api#get_cooking_process_order_for_admin_view"
      post "get_refinement_cooking_process_orders" => "cooking_process_orders_api#get_refinement_cooking_process_orders"
      post "get_search_cooking_process_orders" => "cooking_process_orders_api#get_search_cooking_process_orders"
      get "get_groups_have_no_cooking_process_order" => "groups_api#get_groups_have_no_cooking_process_order"

      #---実行委員担当者申請ページ
      get "get_contact_person_index_for_admin_view" => "contact_persons_api#get_contact_person_index_for_admin_view"
      get "get_contact_person_show_for_admin_view/:id" => "contact_persons_api#get_contact_person_show_for_admin_view"
      post "get_refinement_contact_persons" => "contact_persons_api#get_refinement_contact_persons"
      post "get_search_contact_persons" => "contact_persons_api#get_search_contact_persons"

      #---申請情報ページ
      get "get_order_info_for_admin_view/:id" => "order_infos_api#get_order_info_for_admin_view"
      post "get_refinement_order_infos" => "order_infos_api#get_refinement_order_infos"
      post "get_search_order_infos" => "order_infos_api#get_search_order_infos"

      #---申請状況一覧
      get "get_order_status_check_for_admin_view/:id" => "order_status_check_api#get_order_status_check_for_admin_view"
      post "get_refinement_order_status_check" => "order_status_check_api#get_refinement_order_status_check"
      post "get_search_order_status_check" => "order_status_check_api#get_search_order_status_check"

      #---開催日
      get "get_refinement_fes_date_by_fes_year/:fes_year_id" => "fes_dates_api#get_refinement_fes_date_by_fes_year"
      get "get_current_fes_dates" => "fes_dates_api#get_current_fes_dates"

      #---貸出物品
      get "get_rentable_items" => "rental_items_api#get_rentable_items"
      get "get_shop_rentable_items" => "rental_items_api#get_shop_rentable_items"
      get "get_all_rentable_items" => "rental_items_api#get_all_rentable_items"
      get "get_inside_shop_rentable_items" => "rental_items_api#get_inside_shop_rentable_items"
      get "get_outside_shop_rentable_items" => "rental_items_api#get_outside_shop_rentable_items"
      get "get_stage_rentable_items" => "rental_items_api#get_stage_rentable_items"

      #---CSV出力
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
      get "get_assign_rental_items_csv/:fes_year_id" => "output_csv#output_assign_rental_items_csv"
      get "get_announcements_csv" => "output_csv#output_announcements_csv"
      get "get_cooking_process_orders_csv" => "output_csv#output_cooking_process_orders_csv"
      get "get_public_relations_csv/:fes_year_id" => "output_csv#output_public_relations_csv"

      # ダッシュボード
      get "dashboard" => "dashboard_api#get_dashboard_info"

      # ユーザー周りのAPI
      get "update_user/:id/:role_id" => "users#update"
      post "users/edit_user_info" => "users#edit_user_info"
      post "users/reset_password" => "users#reset_password"
      post "get_refinement_users" => "users#get_refinement_users"
      post "get_search_users" => "users#get_search_users"
      get "users/get_user_detail" => "users#get_user_detail"

      # 現在のユーザーについて
      get "current_user" => "current_user_api#get_current_user_with_user_detail"
      get "current_user/groups" => "current_user_api#get_groups"
      get "current_user/groups/places" => "current_user_api#get_groups_place_allow_list"
      get "current_user/regist_info" => "current_user_api#get_regist_info"
      get "current_user/is_login" => "current_user_api#is_login"

      ### TODO: フロントが整備されたらこのAPIを/current_user/regist_infoにして既存のものを消す
      get "current_user/current_regist_info" => "current_user_api#current_regist_info"
      ###

      get "current_user/get_user_detail_raw" => "current_user_api#get_user_detail_raw"
      post "current_user/edit_user_info" => "current_user_api#edit_user_info"
      post "current_user/password_reset" => "current_user_api#password_reset"

      # --- 新規ユーザー周りのAPI ---
      get "get_user_with_user_details" => "users_api#get_user_with_user_details"
      get "get_user_with_user_detail" => "user_api#get_user_with_user_detail"
    end
  end

  # pdf印刷
  get "print_pdf/group/:group_id/output" => "print_pdf#output_rental_items_pdf"
  get "print_pdf/group_all/:fes_year_id/output" => "print_pdf#output_all_groups_rental_items_pdf"
  get "print_pdf/power/:fes_year_id/output" => "print_pdf#output_powers_pdf"
  get "print_pdf/employees/:fes_year_id/output" => "print_pdf#output_employees_pdf"
  get "print_pdf/rental_items_list/:fes_year_id/output" => "print_pdf#output_rental_items_list_pdf"
  get "print_pdf/contacts/:fes_year_id/output" => "print_pdf#output_contacts_pdf"
  get "print_pdf/food_products/:fes_year_id/output" => "print_pdf#output_food_products_pdf"
  get "print_pdf/group_info/:group_id/output" => "print_pdf#output_group_info_pdf"
  get "print_pdf/all_groups_info/:fes_year_id/output" => "print_pdf#output_all_groups_info_pdf"
  get "print_pdf/health_office_documents/:fes_year_id/output" => "print_pdf#output_health_office_documents_pdf"

  namespace :api do
    mount_devise_token_auth_for 'User', at: 'auth', controllers: {
      registrations: 'api/auth/registrations'
    }
    namespace :auth do
      resources :sessions
    end
  end

end
