# Group Manager API アクセス権限一覧

> 生成日: 2026-07-26
>
> 正本: `api/config/api_access_control.yml` と Rails routes
>
> 対象: Rails内部、Action Mailbox、Active Storage、Devise Token Auth内部を除く業務APIと、
> 未認証で利用できる認証フロー

## 基本方針

- 業務APIに未認証で利用できるPublic区分は設けない。
- ロールは `user`（role_id 3）、`staff`（role_id 2）、`manager`（role_id 1）の3種類。
- 上位ロールは下位区分のAPIも利用できる。
- user区分の団体依存APIは、ログインユーザーが所有する団体内だけ参照・変更できる。
- 未分類の業務ルートはデフォルト拒否する。

## 権限サマリ

| 区分 | 認証 | 利用可能ロール | controller action数 | HTTPルート数 | 拒否・秘匿 |
|---|---|---|---:|---:|---|
| 未認証で利用できる認証フロー | 不要 | 未ログインを含む全利用者 | 8 | 9 | 各認証APIのバリデーションに従う |
| user権限API | 必要 | user / staff / manager | 141 | 159 | 未認証401、団体所有権不一致404 |
| staff権限API | 必要 | staff / manager | 226 | 248 | 未認証401、userは403 |
| manager権限API | 必要 | manager | 7 | 7 | 未認証401、user・staffは403 |

## HTTPステータスの意味

| ステータス | 意味 |
|---:|---|
| 401 Unauthorized | ログインしていない、または認証トークンが無効 |
| 403 Forbidden | ログイン済みだが必要なロールを持っていない |
| 404 Not Found | user区分で別団体のIDを指定したため、存在を秘匿 |

## 未認証で利用できる認証フロー

- 認証: 不要
- 利用可能: 未ログインを含む全利用者
- 拒否・秘匿: 各認証APIのバリデーションに従う

| Method | Path | Controller#Action |
|---|---|---|
| `POST` | `/api/auth` | `api/auth/registrations#create` |
| `PATCH` | `/api/auth/password` | `devise_token_auth/passwords#update` |
| `POST` | `/api/auth/password` | `devise_token_auth/passwords#create` |
| `PUT` | `/api/auth/password` | `devise_token_auth/passwords#update` |
| `GET` | `/api/auth/password/edit` | `devise_token_auth/passwords#edit` |
| `GET` | `/api/auth/password/new` | `devise_token_auth/passwords#new` |
| `GET` | `/api/auth/sessions` | `api/auth/sessions#index` |
| `GET` | `/api/auth/sign_in` | `devise_token_auth/sessions#new` |
| `POST` | `/api/auth/sign_in` | `devise_token_auth/sessions#create` |


## user権限API

- 認証: 必要
- 利用可能: user / staff / manager
- 拒否・秘匿: 未認証401、団体所有権不一致404

| Method | Path | Controller#Action |
|---|---|---|
| `GET` | `/announcements` | `announcements#index` |
| `POST` | `/announcements` | `announcements#create` |
| `DELETE` | `/announcements/:id` | `announcements#destroy` |
| `GET` | `/announcements/:id` | `announcements#show` |
| `PATCH` | `/announcements/:id` | `announcements#update` |
| `PUT` | `/announcements/:id` | `announcements#update` |
| `GET` | `/api/v1/current_user` | `api/v1/current_user_api#get_current_user_with_user_detail` |
| `GET` | `/api/v1/current_user/current_regist_info` | `api/v1/current_user_api#current_regist_info` |
| `POST` | `/api/v1/current_user/edit_user_info` | `api/v1/current_user_api#edit_user_info` |
| `GET` | `/api/v1/current_user/get_user_detail_raw` | `api/v1/current_user_api#get_user_detail_raw` |
| `GET` | `/api/v1/current_user/is_login` | `api/v1/current_user_api#is_login` |
| `POST` | `/api/v1/current_user/password_reset` | `api/v1/current_user_api#password_reset` |
| `GET` | `/api/v1/get_all_rentable_items` | `api/v1/rental_items_api#get_all_rentable_items` |
| `GET` | `/api/v1/get_current_fes_dates` | `api/v1/fes_dates_api#get_current_fes_dates` |
| `GET` | `/api/v1/get_food_products_by_group_id/:group_id` | `api/v1/food_products_api#get_food_products_by_group_id` |
| `GET` | `/api/v1/get_inside_shop_rentable_items` | `api/v1/rental_items_api#get_inside_shop_rentable_items` |
| `GET` | `/api/v1/get_outside_shop_rentable_items` | `api/v1/rental_items_api#get_outside_shop_rentable_items` |
| `GET` | `/api/v1/get_stage_rentable_items` | `api/v1/rental_items_api#get_stage_rentable_items` |
| `GET` | `/api/v1/users/show` | `api/v1/users#show` |
| `GET` | `/check_all_registered/:group_id` | `check_all_registered#show` |
| `GET` | `/contact_persons` | `contact_persons#index` |
| `POST` | `/contact_persons` | `contact_persons#create` |
| `DELETE` | `/contact_persons/:id` | `contact_persons#destroy` |
| `GET` | `/contact_persons/:id` | `contact_persons#show` |
| `PATCH` | `/contact_persons/:id` | `contact_persons#update` |
| `PUT` | `/contact_persons/:id` | `contact_persons#update` |
| `GET` | `/cooking_process_orders` | `cooking_process_orders#index` |
| `POST` | `/cooking_process_orders` | `cooking_process_orders#create` |
| `DELETE` | `/cooking_process_orders/:id` | `cooking_process_orders#destroy` |
| `GET` | `/cooking_process_orders/:id` | `cooking_process_orders#show` |
| `PATCH` | `/cooking_process_orders/:id` | `cooking_process_orders#update` |
| `PUT` | `/cooking_process_orders/:id` | `cooking_process_orders#update` |
| `GET` | `/cooking_process_orders/group/:group_id` | `cooking_process_orders#get_by_group_id` |
| `POST` | `/cooking_process_orders/upsert` | `cooking_process_orders#upsert` |
| `GET` | `/current_user` | `users#get_current_user` |
| `GET` | `/employees` | `employees#index` |
| `POST` | `/employees` | `employees#create` |
| `DELETE` | `/employees/:id` | `employees#destroy` |
| `GET` | `/employees/:id` | `employees#show` |
| `PATCH` | `/employees/:id` | `employees#update` |
| `PUT` | `/employees/:id` | `employees#update` |
| `GET` | `/employees/group/:group_id` | `employees#get_by_group` |
| `POST` | `/employees/upsert` | `employees#upsert` |
| `GET` | `/fes_dates` | `fes_dates#index` |
| `GET` | `/fes_dates/:id` | `fes_dates#show` |
| `GET` | `/fes_years` | `fes_years#index` |
| `GET` | `/fes_years/:id` | `fes_years#show` |
| `GET` | `/fire_equipment_orders` | `fire_equipment_orders#index` |
| `GET` | `/fire_equipment_orders/:id` | `fire_equipment_orders#show` |
| `GET` | `/fire_equipment_orders/group/:group_id` | `fire_equipment_orders#get_by_group_id` |
| `PATCH` | `/fire_equipment_orders/submit` | `fire_equipment_orders#submit` |
| `PUT` | `/fire_equipment_orders/submit` | `fire_equipment_orders#submit` |
| `GET` | `/food_products` | `food_products#index` |
| `POST` | `/food_products` | `food_products#create` |
| `DELETE` | `/food_products/:id` | `food_products#destroy` |
| `GET` | `/food_products/:id` | `food_products#show` |
| `PATCH` | `/food_products/:id` | `food_products#update` |
| `PUT` | `/food_products/:id` | `food_products#update` |
| `GET` | `/food_products/group/:group_id` | `food_products#group_food_products` |
| `POST` | `/food_products/upsert` | `food_products#upsert` |
| `GET` | `/group_categories` | `group_categories#index` |
| `GET` | `/group_categories/:id` | `group_categories#show` |
| `POST` | `/groups` | `groups#create` |
| `GET` | `/groups/:id` | `groups#show` |
| `PATCH` | `/groups/:id` | `groups#update` |
| `PUT` | `/groups/:id` | `groups#update` |
| `GET` | `/groups/user/:user_id` | `groups#get_user_group_id_and_group_category_id` |
| `GET` | `/health_center_submission_statuses` | `health_center_submission_statuses#index` |
| `POST` | `/health_center_submission_statuses` | `health_center_submission_statuses#create` |
| `PATCH` | `/health_center_submission_statuses/:id` | `health_center_submission_statuses#update` |
| `PUT` | `/health_center_submission_statuses/:id` | `health_center_submission_statuses#update` |
| `GET` | `/news` | `news#index` |
| `GET` | `/news/:id` | `news#show` |
| `GET` | `/place_orders` | `place_orders#index` |
| `POST` | `/place_orders` | `place_orders#create` |
| `DELETE` | `/place_orders/:id` | `place_orders#destroy` |
| `GET` | `/place_orders/:id` | `place_orders#show` |
| `PATCH` | `/place_orders/:id` | `place_orders#update` |
| `PUT` | `/place_orders/:id` | `place_orders#update` |
| `GET` | `/place_orders/group/:group_id` | `place_orders#get_by_group_id` |
| `GET` | `/places` | `places#index` |
| `GET` | `/places/:id` | `places#show` |
| `GET` | `/power_orders` | `power_orders#index` |
| `GET` | `/power_orders/:id` | `power_orders#show` |
| `GET` | `/power_orders/group/:group_id` | `power_orders#get_by_group_id` |
| `PUT` | `/power_orders/submit` | `power_orders#submit` |
| `GET` | `/public_relations` | `public_relations#index` |
| `POST` | `/public_relations` | `public_relations#create` |
| `DELETE` | `/public_relations/:id` | `public_relations#destroy` |
| `GET` | `/public_relations/:id` | `public_relations#show` |
| `PATCH` | `/public_relations/:id` | `public_relations#update` |
| `PUT` | `/public_relations/:id` | `public_relations#update` |
| `GET` | `/public_relations/group/:group_id` | `public_relations#get_by_group_id` |
| `GET` | `/purchase_lists` | `purchase_lists#index` |
| `POST` | `/purchase_lists` | `purchase_lists#create` |
| `DELETE` | `/purchase_lists/:id` | `purchase_lists#destroy` |
| `GET` | `/purchase_lists/:id` | `purchase_lists#show` |
| `PATCH` | `/purchase_lists/:id` | `purchase_lists#update` |
| `PUT` | `/purchase_lists/:id` | `purchase_lists#update` |
| `GET` | `/purchase_lists/food_product` | `purchase_lists#get_by_food_product_id` |
| `POST` | `/purchase_lists/upsert` | `purchase_lists#upsert_all` |
| `GET` | `/rainy/stages` | `stages#show_rainy` |
| `GET` | `/rental_items` | `rental_items#index` |
| `GET` | `/rental_items/:id` | `rental_items#show` |
| `GET` | `/rental_orders` | `rental_orders#index` |
| `POST` | `/rental_orders` | `rental_orders#create` |
| `DELETE` | `/rental_orders/:id` | `rental_orders#destroy` |
| `GET` | `/rental_orders/:id` | `rental_orders#show` |
| `PATCH` | `/rental_orders/:id` | `rental_orders#update` |
| `PUT` | `/rental_orders/:id` | `rental_orders#update` |
| `GET` | `/rental_orders/group/:group_id` | `rental_orders#get_by_group_id` |
| `GET` | `/shops` | `shops#index` |
| `GET` | `/shops/:id` | `shops#show` |
| `GET` | `/stage_common_options` | `stage_common_options#index` |
| `POST` | `/stage_common_options` | `stage_common_options#create` |
| `DELETE` | `/stage_common_options/:id` | `stage_common_options#destroy` |
| `GET` | `/stage_common_options/:id` | `stage_common_options#show` |
| `PATCH` | `/stage_common_options/:id` | `stage_common_options#update` |
| `PUT` | `/stage_common_options/:id` | `stage_common_options#update` |
| `GET` | `/stage_common_options/group/:group_id` | `stage_common_options#get_by_group_id` |
| `GET` | `/stage_orders` | `stage_orders#index` |
| `POST` | `/stage_orders` | `stage_orders#create` |
| `DELETE` | `/stage_orders/:id` | `stage_orders#destroy` |
| `GET` | `/stage_orders/:id` | `stage_orders#show` |
| `PATCH` | `/stage_orders/:id` | `stage_orders#update` |
| `PUT` | `/stage_orders/:id` | `stage_orders#update` |
| `GET` | `/stage_orders/group/:group_id` | `stage_orders#get_by_group_id` |
| `GET` | `/stages` | `stages#index` |
| `GET` | `/stages/:id` | `stages#show` |
| `GET` | `/sub_reps` | `sub_reps#index` |
| `POST` | `/sub_reps` | `sub_reps#create` |
| `DELETE` | `/sub_reps/:id` | `sub_reps#destroy` |
| `GET` | `/sub_reps/:id` | `sub_reps#show` |
| `PATCH` | `/sub_reps/:id` | `sub_reps#update` |
| `PUT` | `/sub_reps/:id` | `sub_reps#update` |
| `GET` | `/sub_reps/group/:group_id` | `sub_reps#get_by_group_id` |
| `GET` | `/sunny/stages` | `stages#show_sunny` |
| `GET` | `/un_registered_groups` | `un_registered_groups#index` |
| `POST` | `/un_registered_groups` | `un_registered_groups#create` |
| `DELETE` | `/un_registered_groups/:id` | `un_registered_groups#destroy` |
| `GET` | `/un_registered_groups/:id` | `un_registered_groups#show` |
| `PATCH` | `/un_registered_groups/:id` | `un_registered_groups#update` |
| `PUT` | `/un_registered_groups/:id` | `un_registered_groups#update` |
| `GET` | `/un_registered_groups/group` | `un_registered_groups#group` |
| `GET` | `/user_details` | `user_details#index` |
| `POST` | `/user_details` | `user_details#create` |
| `DELETE` | `/user_details/:id` | `user_details#destroy` |
| `GET` | `/user_details/:id` | `user_details#show` |
| `PATCH` | `/user_details/:id` | `user_details#update` |
| `PUT` | `/user_details/:id` | `user_details#update` |
| `GET` | `/user_page_settings` | `user_page_settings#index` |
| `GET` | `/user_page_settings/:id` | `user_page_settings#show` |
| `GET` | `/venue_maps` | `venue_maps#index` |
| `POST` | `/venue_maps` | `venue_maps#create` |
| `DELETE` | `/venue_maps/:id` | `venue_maps#destroy` |
| `GET` | `/venue_maps/:id` | `venue_maps#show` |
| `PATCH` | `/venue_maps/:id` | `venue_maps#update` |
| `PUT` | `/venue_maps/:id` | `venue_maps#update` |
| `GET` | `/venue_maps/group/:group_id` | `venue_maps#get_by_group_id` |


## staff権限API

- 認証: 必要
- 利用可能: staff / manager
- 拒否・秘匿: 未認証401、userは403

| Method | Path | Controller#Action |
|---|---|---|
| `POST` | `/api/v1/create_health_center_submission_status_comment` | `api/v1/health_center_submission_statuses_api#create_health_center_submission_status_comment` |
| `POST` | `/api/v1/create_health_center_submission_status_comment_mail` | `api/v1/health_center_submission_statuses_api#create_health_center_submission_status_comment_mail` |
| `GET` | `/api/v1/dashboard` | `api/v1/dashboard_api#get_dashboard_info` |
| `GET` | `/api/v1/fire_equipment_orders` | `api/v1/fire_equipment_orders#index` |
| `POST` | `/api/v1/fire_equipment_orders` | `api/v1/fire_equipment_orders#create` |
| `DELETE` | `/api/v1/fire_equipment_orders/:id` | `api/v1/fire_equipment_orders#destroy` |
| `GET` | `/api/v1/fire_equipment_orders/:id` | `api/v1/fire_equipment_orders#show` |
| `PATCH` | `/api/v1/fire_equipment_orders/:id` | `api/v1/fire_equipment_orders#update` |
| `PUT` | `/api/v1/fire_equipment_orders/:id` | `api/v1/fire_equipment_orders#update` |
| `GET` | `/api/v1/get_announcement_for_admin_view/:id` | `api/v1/announcements_api#get_announcement_for_admin_view` |
| `GET` | `/api/v1/get_announcement_index_for_admin_view` | `api/v1/announcements_api#get_announcement_index_for_admin_view` |
| `GET` | `/api/v1/get_announcement_show_for_admin_view/:id` | `api/v1/announcements_api#get_announcement_show_for_admin_view` |
| `GET` | `/api/v1/get_announcements_csv` | `api/v1/output_csv#output_announcements_csv` |
| `GET` | `/api/v1/get_assign_rental_items_csv/:fes_year_id` | `api/v1/output_csv#output_assign_rental_items_csv` |
| `GET` | `/api/v1/get_cooking_process_order_by_food_product_id/:food_product_id` | `api/v1/cooking_process_orders_api#get_cooking_process_order_by_food_product_id` |
| `GET` | `/api/v1/get_cooking_process_order_for_admin_view/:id` | `api/v1/cooking_process_orders_api#get_cooking_process_order_for_admin_view` |
| `GET` | `/api/v1/get_cooking_process_orders_csv` | `api/v1/output_csv#output_cooking_process_orders_csv` |
| `GET` | `/api/v1/get_employee_index_for_admin_view` | `api/v1/employees_api#get_employee_index_for_admin_view` |
| `GET` | `/api/v1/get_employee_show_for_admin_view/:id` | `api/v1/employees_api#get_employee_show_for_admin_view` |
| `GET` | `/api/v1/get_employees_csv/:fes_year_id` | `api/v1/output_csv#output_employees_csv` |
| `GET` | `/api/v1/get_fire_equipment_orders_csv/:fes_year_id` | `api/v1/output_csv#output_fire_equipment_orders_csv` |
| `GET` | `/api/v1/get_food_product_index_for_admin_view` | `api/v1/food_products_api#get_food_product_index_for_admin_view` |
| `GET` | `/api/v1/get_food_product_show_for_admin_view/:id` | `api/v1/food_products_api#get_food_product_show_for_admin_view` |
| `GET` | `/api/v1/get_food_products_csv/:fes_year_id` | `api/v1/output_csv#output_food_products_csv` |
| `GET` | `/api/v1/get_food_products_have_no_cooking_process_order` | `api/v1/food_products_api#get_food_products_have_no_cooking_process_order` |
| `GET` | `/api/v1/get_group_for_admin_view/:id` | `api/v1/groups_api#get_group_for_admin_view` |
| `GET` | `/api/v1/get_group_index_for_admin_view` | `api/v1/groups_api#get_group_index_for_admin_view` |
| `GET` | `/api/v1/get_group_show_for_admin_view/:id` | `api/v1/groups_api#get_group_show_for_admin_view` |
| `GET` | `/api/v1/get_groups_csv/:fes_year_id` | `api/v1/output_csv#output_groups_csv` |
| `GET` | `/api/v1/get_groups_for_fire_equipment_order` | `api/v1/groups_api#get_groups_for_fire_equipment_order` |
| `GET` | `/api/v1/get_groups_have_no_announcement` | `api/v1/groups_api#get_groups_have_no_announcement` |
| `GET` | `/api/v1/get_groups_have_no_cooking_process_order` | `api/v1/groups_api#get_groups_have_no_cooking_process_order` |
| `GET` | `/api/v1/get_groups_have_no_public_relation` | `api/v1/groups_api#get_groups_have_no_public_relation` |
| `GET` | `/api/v1/get_groups_have_no_venue_map` | `api/v1/groups_api#get_groups_have_no_venue_map` |
| `GET` | `/api/v1/get_groups_refinemented_by_current_fes_year` | `api/v1/groups_api#get_groups_refinemented_by_current_fes_year` |
| `GET` | `/api/v1/get_health_center_submission_status_counts/:group_id` | `api/v1/health_center_submission_statuses_api#get_health_center_submission_status_counts` |
| `GET` | `/api/v1/get_health_center_submission_status_index_for_admin_view` | `api/v1/health_center_submission_statuses_api#get_health_center_submission_status_index_for_admin_view` |
| `GET` | `/api/v1/get_health_center_submission_status_show_for_admin_view/:group_id` | `api/v1/health_center_submission_statuses_api#get_health_center_submission_status_show_for_admin_view` |
| `GET` | `/api/v1/get_order_info_for_admin_view/:id` | `api/v1/order_infos_api#get_order_info_for_admin_view` |
| `GET` | `/api/v1/get_order_status_check_for_admin_view/:id` | `api/v1/order_status_check_api#get_order_status_check_for_admin_view` |
| `GET` | `/api/v1/get_place_order_index_for_admin_view` | `api/v1/place_orders_api#get_place_order_index_for_admin_view` |
| `GET` | `/api/v1/get_place_order_show_for_admin_view/:id` | `api/v1/place_orders_api#get_place_order_show_for_admin_view` |
| `GET` | `/api/v1/get_place_orders_csv/:fes_year_id` | `api/v1/output_csv#output_place_orders_csv` |
| `GET` | `/api/v1/get_power_order_index_for_admin_view` | `api/v1/power_orders_api#get_power_order_index_for_admin_view` |
| `GET` | `/api/v1/get_power_order_show_for_admin_view/:id` | `api/v1/power_orders_api#get_power_order_show_for_admin_view` |
| `GET` | `/api/v1/get_power_orders_csv/:fes_year_id` | `api/v1/output_csv#output_power_orders_csv` |
| `GET` | `/api/v1/get_public_relation_for_admin_view/:id` | `api/v1/public_relations_api#get_public_relation_for_admin_view` |
| `GET` | `/api/v1/get_public_relations_csv/:fes_year_id` | `api/v1/output_csv#output_public_relations_csv` |
| `GET` | `/api/v1/get_purchase_list_index_for_admin_view` | `api/v1/purchase_lists_api#get_purchase_list_index_for_admin_view` |
| `GET` | `/api/v1/get_purchase_list_show_for_admin_view/:id` | `api/v1/purchase_lists_api#get_purchase_list_show_for_admin_view` |
| `GET` | `/api/v1/get_purchase_lists_csv/:fes_year_id` | `api/v1/output_csv#output_purchase_lists_csv` |
| `POST` | `/api/v1/get_refinement_announcements` | `api/v1/announcements_api#get_refinement_announcements` |
| `POST` | `/api/v1/get_refinement_assign_rental_item` | `api/v1/assign_rental_items_api#get_refinement_assign_rental_item` |
| `POST` | `/api/v1/get_refinement_cooking_process_orders` | `api/v1/cooking_process_orders_api#get_refinement_cooking_process_orders` |
| `POST` | `/api/v1/get_refinement_employees` | `api/v1/employees_api#get_refinement_employees` |
| `GET` | `/api/v1/get_refinement_fes_date_by_fes_year/:fes_year_id` | `api/v1/fes_dates_api#get_refinement_fes_date_by_fes_year` |
| `POST` | `/api/v1/get_refinement_food_products` | `api/v1/food_products_api#get_refinement_food_products` |
| `POST` | `/api/v1/get_refinement_groups` | `api/v1/groups_api#get_refinement_groups` |
| `POST` | `/api/v1/get_refinement_order_infos` | `api/v1/order_infos_api#get_refinement_order_infos` |
| `POST` | `/api/v1/get_refinement_order_status_check` | `api/v1/order_status_check_api#get_refinement_order_status_check` |
| `POST` | `/api/v1/get_refinement_place_orders` | `api/v1/place_orders_api#get_refinement_place_orders` |
| `POST` | `/api/v1/get_refinement_power_orders` | `api/v1/power_orders_api#get_refinement_power_orders` |
| `POST` | `/api/v1/get_refinement_public_relations` | `api/v1/public_relations_api#get_refinement_public_relations` |
| `POST` | `/api/v1/get_refinement_purchase_lists` | `api/v1/purchase_lists_api#get_refinement_purchase_lists` |
| `POST` | `/api/v1/get_refinement_rental_orders` | `api/v1/rental_orders_api#get_refinement_rental_orders` |
| `POST` | `/api/v1/get_refinement_representatives` | `api/v1/representatives_api#get_refinement_represantatives` |
| `POST` | `/api/v1/get_refinement_stage_common_options` | `api/v1/stage_common_options_api#get_refinement_stage_common_options` |
| `POST` | `/api/v1/get_refinement_stage_orders` | `api/v1/stage_orders_api#get_refinement_stage_orders` |
| `POST` | `/api/v1/get_refinement_stocker_item` | `api/v1/assign_rental_items_api#get_refinement_stocker_item` |
| `POST` | `/api/v1/get_refinement_users` | `api/v1/users#get_refinement_users` |
| `POST` | `/api/v1/get_refinement_venue_maps` | `api/v1/venue_maps_api#get_refinement_venue_maps` |
| `GET` | `/api/v1/get_rentable_items` | `api/v1/rental_items_api#get_rentable_items` |
| `GET` | `/api/v1/get_rental_order_index_for_admin_view` | `api/v1/rental_orders_api#get_rental_order_index_for_admin_view` |
| `GET` | `/api/v1/get_rental_order_show_for_admin_view/:id` | `api/v1/rental_orders_api#get_rental_order_show_for_admin_view` |
| `GET` | `/api/v1/get_rental_orders_csv/:fes_year_id` | `api/v1/output_csv#output_rental_orders_csv` |
| `GET` | `/api/v1/get_representative_index_for_admin_view` | `api/v1/users#get_representative_index_for_admin_view` |
| `GET` | `/api/v1/get_representative_show_for_admin_view/:id` | `api/v1/users#get_representative_show_for_admin_view` |
| `POST` | `/api/v1/get_search_announcements` | `api/v1/announcements_api#get_search_announcements` |
| `POST` | `/api/v1/get_search_cooking_process_orders` | `api/v1/cooking_process_orders_api#get_search_cooking_process_orders` |
| `POST` | `/api/v1/get_search_employees` | `api/v1/employees_api#get_search_employees` |
| `POST` | `/api/v1/get_search_food_products` | `api/v1/food_products_api#get_search_food_products` |
| `POST` | `/api/v1/get_search_groups` | `api/v1/groups_api#get_search_groups` |
| `POST` | `/api/v1/get_search_order_infos` | `api/v1/order_infos_api#get_search_order_infos` |
| `POST` | `/api/v1/get_search_order_status_check` | `api/v1/order_status_check_api#get_search_order_status_check` |
| `POST` | `/api/v1/get_search_place_orders` | `api/v1/place_orders_api#get_search_place_orders` |
| `POST` | `/api/v1/get_search_power_orders` | `api/v1/power_orders_api#get_search_power_orders` |
| `POST` | `/api/v1/get_search_public_relations` | `api/v1/public_relations_api#get_search_public_relations` |
| `POST` | `/api/v1/get_search_purchase_lists` | `api/v1/purchase_lists_api#get_search_purchase_lists` |
| `POST` | `/api/v1/get_search_rental_orders` | `api/v1/rental_orders_api#get_search_rental_orders` |
| `POST` | `/api/v1/get_search_representatives` | `api/v1/representatives_api#get_search_representatives` |
| `POST` | `/api/v1/get_search_stage_common_options` | `api/v1/stage_common_options_api#get_search_stage_common_options` |
| `POST` | `/api/v1/get_search_stage_orders` | `api/v1/stage_orders_api#get_search_stage_orders` |
| `POST` | `/api/v1/get_search_sub_reps` | `api/v1/sub_rep_api#get_search_sub_reps` |
| `POST` | `/api/v1/get_search_users` | `api/v1/users#get_search_users` |
| `POST` | `/api/v1/get_search_venue_maps` | `api/v1/venue_maps_api#get_search_venue_maps` |
| `GET` | `/api/v1/get_shop_rentable_items` | `api/v1/rental_items_api#get_shop_rentable_items` |
| `GET` | `/api/v1/get_stage_common_option_index_for_admin_view` | `api/v1/stage_common_options_api#get_stage_common_option_index_for_admin_view` |
| `GET` | `/api/v1/get_stage_common_option_show_for_admin_view/:id` | `api/v1/stage_common_options_api#get_stage_common_option_show_for_admin_view` |
| `GET` | `/api/v1/get_stage_common_options_csv/:fes_year_id` | `api/v1/output_csv#output_stage_common_options_csv` |
| `GET` | `/api/v1/get_stage_order_index_for_admin_view` | `api/v1/stage_orders_api#get_stage_order_index_for_admin_view` |
| `GET` | `/api/v1/get_stage_order_show_for_admin_view/:id` | `api/v1/stage_orders_api#get_stage_order_show_for_admin_view` |
| `GET` | `/api/v1/get_stage_orders_csv/:fes_year_id` | `api/v1/output_csv#output_stage_orders_csv` |
| `GET` | `/api/v1/get_sub_reps_csv/:fes_year_id` | `api/v1/output_csv#output_sub_reps_csv` |
| `GET` | `/api/v1/get_user_index_for_admin_view` | `api/v1/users#get_user_index_for_admin_view` |
| `GET` | `/api/v1/get_user_show_for_admin_view/:id` | `api/v1/users#get_user_show_for_admin_view` |
| `GET` | `/api/v1/get_users_csv/:fes_year_id` | `api/v1/output_csv#output_users_csv` |
| `GET` | `/api/v1/get_venue_map_for_admin_view/:id` | `api/v1/venue_maps_api#get_venue_map_for_admin_view` |
| `GET` | `/api/v1/group_mail_comments` | `api/v1/group_mail_comments_api#index` |
| `POST` | `/api/v1/health_center_submission_statuses` | `api/v1/health_center_submission_statuses#create` |
| `POST` | `/api/v1/mail_deliveries` | `api/v1/mail_deliveries#create` |
| `GET` | `/api/v1/message_templates` | `api/v1/message_templates#index` |
| `POST` | `/api/v1/message_templates` | `api/v1/message_templates#create` |
| `GET` | `/api/v1/message_templates/:id` | `api/v1/message_templates#show` |
| `PATCH` | `/api/v1/message_templates/:id` | `api/v1/message_templates#update` |
| `PUT` | `/api/v1/message_templates/:id` | `api/v1/message_templates#update` |
| `GET` | `/api/v1/message_templates/:id/copy_source` | `api/v1/message_templates#copy_source` |
| `POST` | `/api/v1/order_status_check_comment_mails` | `api/v1/order_status_check_comment_mails#create` |
| `POST` | `/api/v1/order_status_check_comment_mails/:id/resend` | `api/v1/order_status_check_comment_mails#resend` |
| `POST` | `/api/v1/power_orders` | `api/v1/power_orders#create` |
| `DELETE` | `/api/v1/power_orders/:id` | `api/v1/power_orders#destroy` |
| `PATCH` | `/api/v1/power_orders/:id` | `api/v1/power_orders#update` |
| `PUT` | `/api/v1/power_orders/:id` | `api/v1/power_orders#update` |
| `POST` | `/api/v1/resend_health_center_submission_status_comment_mail/:comment_id` | `api/v1/health_center_submission_statuses_api#resend_health_center_submission_status_comment_mail` |
| `POST` | `/api/v1/sync_health_center_submission_statuses` | `api/v1/health_center_submission_statuses_api#sync_health_center_submission_statuses` |
| `PATCH` | `/api/v1/update_health_center_submission_status/:id` | `api/v1/health_center_submission_statuses_api#update_health_center_submission_status` |
| `POST` | `/api/v1/upsert_health_center_submission_status` | `api/v1/health_center_submission_statuses_api#upsert_health_center_submission_status` |
| `GET` | `/assign_group_places` | `assign_group_places#index` |
| `POST` | `/assign_group_places` | `assign_group_places#create` |
| `DELETE` | `/assign_group_places/:id` | `assign_group_places#destroy` |
| `GET` | `/assign_group_places/:id` | `assign_group_places#show` |
| `PATCH` | `/assign_group_places/:id` | `assign_group_places#update` |
| `PUT` | `/assign_group_places/:id` | `assign_group_places#update` |
| `GET` | `/assign_rental_items` | `assign_rental_items#index` |
| `POST` | `/assign_rental_items` | `assign_rental_items#create` |
| `DELETE` | `/assign_rental_items/:id` | `assign_rental_items#destroy` |
| `GET` | `/assign_rental_items/:id` | `assign_rental_items#show` |
| `PATCH` | `/assign_rental_items/:id` | `assign_rental_items#update` |
| `PUT` | `/assign_rental_items/:id` | `assign_rental_items#update` |
| `GET` | `/assign_stages` | `assign_stages#index` |
| `POST` | `/assign_stages` | `assign_stages#create` |
| `DELETE` | `/assign_stages/:id` | `assign_stages#destroy` |
| `GET` | `/assign_stages/:id` | `assign_stages#show` |
| `PATCH` | `/assign_stages/:id` | `assign_stages#update` |
| `PUT` | `/assign_stages/:id` | `assign_stages#update` |
| `POST` | `/fes_dates` | `fes_dates#create` |
| `DELETE` | `/fes_dates/:id` | `fes_dates#destroy` |
| `PATCH` | `/fes_dates/:id` | `fes_dates#update` |
| `PUT` | `/fes_dates/:id` | `fes_dates#update` |
| `POST` | `/fes_years` | `fes_years#create` |
| `DELETE` | `/fes_years/:id` | `fes_years#destroy` |
| `PATCH` | `/fes_years/:id` | `fes_years#update` |
| `PUT` | `/fes_years/:id` | `fes_years#update` |
| `POST` | `/group_categories` | `group_categories#create` |
| `DELETE` | `/group_categories/:id` | `group_categories#destroy` |
| `PATCH` | `/group_categories/:id` | `group_categories#update` |
| `PUT` | `/group_categories/:id` | `group_categories#update` |
| `GET` | `/group_identification` | `group_identification#index` |
| `POST` | `/group_identification` | `group_identification#create` |
| `DELETE` | `/group_identification/:id` | `group_identification#destroy` |
| `PUT` | `/group_identification/:id` | `group_identification#update` |
| `GET` | `/groups` | `groups#index` |
| `GET` | `/memos` | `memos#index` |
| `POST` | `/memos` | `memos#create` |
| `DELETE` | `/memos/:id` | `memos#destroy` |
| `GET` | `/memos/:id` | `memos#show` |
| `PATCH` | `/memos/:id` | `memos#update` |
| `PUT` | `/memos/:id` | `memos#update` |
| `POST` | `/news` | `news#create` |
| `DELETE` | `/news/:id` | `news#destroy` |
| `PATCH` | `/news/:id` | `news#update` |
| `PUT` | `/news/:id` | `news#update` |
| `GET` | `/place_allow_lists` | `place_allow_lists#index` |
| `POST` | `/place_allow_lists` | `place_allow_lists#create` |
| `DELETE` | `/place_allow_lists/:id` | `place_allow_lists#destroy` |
| `GET` | `/place_allow_lists/:id` | `place_allow_lists#show` |
| `PATCH` | `/place_allow_lists/:id` | `place_allow_lists#update` |
| `PUT` | `/place_allow_lists/:id` | `place_allow_lists#update` |
| `GET` | `/place_categories` | `place_categories#index` |
| `POST` | `/place_categories` | `place_categories#create` |
| `DELETE` | `/place_categories/:id` | `place_categories#destroy` |
| `GET` | `/place_categories/:id` | `place_categories#show` |
| `PATCH` | `/place_categories/:id` | `place_categories#update` |
| `PUT` | `/place_categories/:id` | `place_categories#update` |
| `GET` | `/place_numbers` | `place_number#index` |
| `POST` | `/place_numbers` | `place_number#create` |
| `DELETE` | `/place_numbers/:id` | `place_number#destroy` |
| `PUT` | `/place_numbers/:id` | `place_number#update` |
| `POST` | `/places` | `places#create` |
| `DELETE` | `/places/:id` | `places#destroy` |
| `PATCH` | `/places/:id` | `places#update` |
| `PUT` | `/places/:id` | `places#update` |
| `GET` | `/print_pdf/all_groups_info/:fes_year_id/output` | `print_pdf#output_all_groups_info_pdf` |
| `GET` | `/print_pdf/contacts/:fes_year_id/output` | `print_pdf#output_contacts_pdf` |
| `GET` | `/print_pdf/employees/:fes_year_id/output` | `print_pdf#output_employees_pdf` |
| `GET` | `/print_pdf/food_products/:fes_year_id/output` | `print_pdf#output_food_products_pdf` |
| `GET` | `/print_pdf/group/:group_id/output` | `print_pdf#output_rental_items_pdf` |
| `GET` | `/print_pdf/group_all/:fes_year_id/output` | `print_pdf#output_all_groups_rental_items_pdf` |
| `GET` | `/print_pdf/group_info/:group_id/output` | `print_pdf#output_group_info_pdf` |
| `GET` | `/print_pdf/health_office_documents/:fes_year_id/output` | `print_pdf#output_health_office_documents_pdf` |
| `GET` | `/print_pdf/power/:fes_year_id/output` | `print_pdf#output_powers_pdf` |
| `GET` | `/print_pdf/rental_items_list/:fes_year_id/output` | `print_pdf#output_rental_items_list_pdf` |
| `GET` | `/rentable_items` | `rentable_items#index` |
| `POST` | `/rentable_items` | `rentable_items#create` |
| `DELETE` | `/rentable_items/:id` | `rentable_items#destroy` |
| `GET` | `/rentable_items/:id` | `rentable_items#show` |
| `PATCH` | `/rentable_items/:id` | `rentable_items#update` |
| `PUT` | `/rentable_items/:id` | `rentable_items#update` |
| `GET` | `/rental_item_allow_lists` | `rental_item_allow_lists#index` |
| `POST` | `/rental_item_allow_lists` | `rental_item_allow_lists#create` |
| `DELETE` | `/rental_item_allow_lists/:id` | `rental_item_allow_lists#destroy` |
| `GET` | `/rental_item_allow_lists/:id` | `rental_item_allow_lists#show` |
| `PATCH` | `/rental_item_allow_lists/:id` | `rental_item_allow_lists#update` |
| `PUT` | `/rental_item_allow_lists/:id` | `rental_item_allow_lists#update` |
| `POST` | `/rental_items` | `rental_items#create` |
| `DELETE` | `/rental_items/:id` | `rental_items#destroy` |
| `PATCH` | `/rental_items/:id` | `rental_items#update` |
| `PUT` | `/rental_items/:id` | `rental_items#update` |
| `POST` | `/rental_items/translate` | `rental_items#translate` |
| `POST` | `/shops` | `shops#create` |
| `DELETE` | `/shops/:id` | `shops#destroy` |
| `PATCH` | `/shops/:id` | `shops#update` |
| `PUT` | `/shops/:id` | `shops#update` |
| `GET` | `/stage_numbers` | `stage_number#index` |
| `POST` | `/stage_numbers` | `stage_number#create` |
| `DELETE` | `/stage_numbers/:id` | `stage_number#destroy` |
| `PUT` | `/stage_numbers/:id` | `stage_number#update` |
| `POST` | `/stages` | `stages#create` |
| `DELETE` | `/stages/:id` | `stages#destroy` |
| `PATCH` | `/stages/:id` | `stages#update` |
| `PUT` | `/stages/:id` | `stages#update` |
| `GET` | `/stocker_items` | `stocker_items#index` |
| `POST` | `/stocker_items` | `stocker_items#create` |
| `DELETE` | `/stocker_items/:id` | `stocker_items#destroy` |
| `GET` | `/stocker_items/:id` | `stocker_items#show` |
| `PATCH` | `/stocker_items/:id` | `stocker_items#update` |
| `PUT` | `/stocker_items/:id` | `stocker_items#update` |
| `GET` | `/stocker_places` | `stocker_places#index` |
| `POST` | `/stocker_places` | `stocker_places#create` |
| `DELETE` | `/stocker_places/:id` | `stocker_places#destroy` |
| `GET` | `/stocker_places/:id` | `stocker_places#show` |
| `PATCH` | `/stocker_places/:id` | `stocker_places#update` |
| `PUT` | `/stocker_places/:id` | `stocker_places#update` |
| `POST` | `/user_page_settings` | `user_page_settings#create` |
| `DELETE` | `/user_page_settings/:id` | `user_page_settings#destroy` |
| `PATCH` | `/user_page_settings/:id` | `user_page_settings#update` |
| `PUT` | `/user_page_settings/:id` | `user_page_settings#update` |
| `GET` | `/users` | `users#index` |
| `GET` | `/users/:id` | `users#show` |


## manager権限API

- 認証: 必要
- 利用可能: manager
- 拒否・秘匿: 未認証401、user・staffは403

| Method | Path | Controller#Action |
|---|---|---|
| `GET` | `/api/v1/update_user/:id/:role_id` | `api/v1/users#update` |
| `POST` | `/api/v1/users/edit_user_info` | `api/v1/users#edit_user_info` |
| `POST` | `/api/v1/users/reset_password` | `api/v1/users#reset_password` |
| `DELETE` | `/groups/:id` | `groups#destroy` |
| `DELETE` | `/users/:id` | `users#destroy` |
| `PUT` | `/users/:id` | `users#update` |
| `POST` | `/users/simply_user_create` | `users#simply_user_create` |


## 更新方法

アクセス区分を変更した場合は `api/config/api_access_control.yml` を更新し、次のコマンドで再生成する。

```bash
make api-access-docs
```
