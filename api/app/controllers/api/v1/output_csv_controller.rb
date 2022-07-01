class Api::V1::OutputCsvController < ApplicationController
  require 'csv'
  
  def output_groups_csv
    if params[:fes_year_id].to_i == 0
      # 全件選択
      @groups = Group.all
      filename_year = "全"
    else
      @groups = Group.where(fes_year_id: params[:fes_year_id])
      filename_year = FesYear.find(params[:fes_year_id]).year_num
    end
    bom = "\uFEFF"
    csv_data = CSV.generate(bom) do |csv|
      column_name = %w(参加団体名 企画名 活動内容 代表者 カテゴリー 開催年)
      csv << column_name
      @groups.each do |group|
        # データが存在しない場合はスキップする
        if group.nil?
          next
        end
        column_values = [
          group.name,
          group.project_name,
          group.activity,
          group.user.name,
          group.user.email,
          group.group_category.name,
          group.fes_year.year_num
        ]
        csv << column_values
      end
    end
    send_data(csv_data, filename: "参加団体申請_#{filename_year}年度.csv")
  end


  def output_sub_reps_csv
    if params[:fes_year_id].to_id == 0
      @sub_reps = Group.preload(:sub_rep).map{ |group| group.sub_rep }
      filename_year = "全"
    else
      @sub_reps = Group.where(fes_year_id:params[:fes_year_id]).preload(:sub_rep).map{ |group| group.sub_rep }
      filename_year = FesYear.find(params[:fes_year_id]).year_num
    end
    bom = "\uFEFF"
    csv_data = CSV.generate(bom) do |csv|
      column_name = %w(参加団体名 カテゴリー 名前 学科 学年 学籍番号 メールアドレス 電話番号 開催年)
      csv << column_name
      @sub_reps.each do |sub_rep|
        # データが存在しない場合はスキップする
        if sub_rep.nil?
          next
        end
        column_values = [
          sub_rep.group.name,
          sub_rep.group.group_category.name,
          sub_rep.name,
          sub_rep.department.name,
          sub_rep.grade.name,
          sub_rep.student_id,
          sub_rep.email,
          sub_rep.tel,
          sub_rep.group.fes_year.year_num
        ]
        csv << column_values
      end
    end
    send_data(csv_data, filename: "副代表_#{filename_year}年度.csv")
  end

  def output_rental_orders_csv
    if params[:fes_year_id].to_i == 0
      @rental_orders = Group.preload(:rental_orders).map{ |group| group.rental_orders }
      filename_year = "全"
    else
      @rental_orders = Group.where(fes_year_id:params[:fes_year_id]).preload(:rental_orders).map{ |group| group.rental_orders }
      filename_year = FesYear.find(params[:fes_year_id]).year_num
    end
    bom = "\uFEFF"
    csv_data = CSV.generate(bom) do |csv|
      column_name = %w(参加団体名 代表者 メールアドレス カテゴリー 物品名 数 開催年)
      csv << column_name
      @rental_orders.each do |group|
        # データが存在しない場合はスキップする
        if group.nil?
          next
        end
        group.each do |rental_order|
          # データが存在しない場合はスキップする
          if rental_order.nil?
            next
          end
          column_values = [
            rental_order.group.name,
            rental_order.group.user.name,
            rental_order.group.user.email,
            rental_order.group.group_category.name,
            rental_order.rental_item.name,
            rental_order.num,
            rental_order.group.fes_year.year_num
          ]  
          csv << column_values
        end
      end
    end
    send_data(csv_data, filename: "物品申請_#{filename_year}年度.csv")
  end

  def  output_power_orders_csv
    if params[:fes_year_id].to_i == 0
      @power_orders = Group.preload(:power_orders).map{ |group| group.power_orders }
      filename_year = "全"
    else
      @power_orders = Group.where(fes_year_id:params[:fes_year_id]).preload(:power_orders).map{ |group| group.power_orders }
      filename_year = FesYear.find(params[:fes_year_id]).year_num
    end
    bom = "\uFEFF"
    csv_data = CSV.generate(bom) do |csv|
      column_name = %w(参加団体名 代表者 メールアドレス カテゴリー 製品 URL 電力 メーカー 型番)
      csv << column_name
      @power_orders.each do |group|
        # データが存在しない場合はスキップする
        if group.nil?
          next
        end
        group.each do |power_order|
          # データが存在しない場合はスキップする
          if power_order.nil?
            next
          end
          column_values = [
            power_order.group.name,
            power_order.group.user.name,
            power_order.group.user.email,
            power_order.group.group_category.name,
            power_order.item,
            power_order.item_url,
            power_order.power,
            power_order.manufacturer,
            power_order.model
          ]
          csv << column_values
        end
      end
    end
    send_data(csv_data, filename: "電力申請_#{filename_year}年度.csv")
  end

  def output_place_orders_csv
    if params[:fes_year_id].to_i == 0
      @place_orders = Group.preload(:place_order).map{ |group| group.place_order } 
      filename_year = "全"
    else
      @place_orders = Group.where(fes_year_id:params[:fes_year_id]).preload(:place_order).map{ |group| group.place_order } 
      filename_year = FesYear.find(params[:fes_year_id]).year_num
    end
    bom = "\uFEFF"
    csv_data = CSV.generate(bom) do |csv|
      column_name = %w(参加団体名 代表者 メールアドレス カテゴリー 第1希望 第2希望 第3希望 備考)
      csv << column_name
      @place_orders.each do |place_order|
        # データが存在しない場合はスキップする
        if place_order.nil?
          next
        end
        column_values = [
          place_order.group.name,
          place_order.group.user.name,
          place_order.group.user.email,
          place_order.group.group_category.name,
          Place.find(place_order.first).name,
          Place.find(place_order.second).name,
          Place.find(place_order.third).name,
          place_order.remark
        ]
        csv << column_values
      end
    end
    send_data(csv_data, filename: "会場申請_#{filename_year}年度.csv")
  end

  def output_stage_orders_csv
    if params[:fes_year_id].to_i == 0
      @stage_orders = Group.preload(:stage_orders).map{ |group| group.stage_orders }
      filename_year = "全"
    else
      @stage_orders = Group.where(fes_year_id:params[:fes_year_id]).preload(:stage_orders).map{ |group| group.stage_orders }
      filename_year = FesYear.find(params[:fes_year_id]).year_num
    end
    bom = "\uFEFF"
    csv_data = CSV.generate(bom) do |csv|
      column_name = %w(参加団体名 カテゴリー 天気 日付 曜日 何日目  第1希望 第2希望 使用時間 準備時間 片付け時間 準備開始時刻 演目開始時刻 演目終了時刻 片付け終了時刻)
      csv << column_name
      @stage_orders.each do |group|
          # データが存在しない場合はスキップする
          if group.nil?
            next
          end
        group.each do |stage_order|
          # データが存在しない場合はスキップする
          if stage_order.nil?
            next
          end
          column_values = [
            stage_order.group.name,
            stage_order.group.group_category.name,
            stage_order.is_sunny ? "晴れ" : "雨",
            stage_order.fes_date.date,
            stage_order.fes_date.day,
            stage_order.fes_date.days_num,
            Stage.find(stage_order.stage_first).name,
            Stage.find(stage_order.stage_second).name,
            stage_order.use_time_interval,
            stage_order.prepare_time_interval,
            stage_order.cleanup_time_interval,
            stage_order.prepare_start_time,
            stage_order.performance_start_time,
            stage_order.performance_end_time,
            stage_order.cleanup_end_time
          ]
          csv << column_values
        end
      end
    end
    send_data(csv_data, filename: "ステージ申請_#{filename_year}年度.csv")
  end

  def output_stage_common_options_csv
    if params[:fes_year_id].to_i == 0
      @stage_common_options = Group.preload(:stage_common_option).map{ |group| group.stage_common_option }
      filename_year = "全"
    else
      @stage_common_options = Group.where(fes_year_id:params[:fes_year_id]).preload(:stage_common_option).map{ |group| group.stage_common_option }
      filename_year = FesYear.find(params[:fes_year_id]).year_num
    end
    bom = "\uFEFF"
    csv_data = CSV.generate(bom) do |csv|
      column_name = %w(参加団体名 所持機器の使用 音楽の使用 撮影許可 大きな音 内容)
      csv << column_name
      @stage_common_options.each do |stage_common_option|
        # データが存在しない場合はスキップする
        if stage_common_option.nil?
          next
        end
        column_values = [
          stage_common_option.group.name,
          stage_common_option.own_equipment ? "使用する" : "使用しない",
          stage_common_option.bgm ? "使用する" : "使用しない",
          stage_common_option.camera_permission ? "許可する" : "許可しない",
          stage_common_option.loud_sound ? "出す" : "出さない",
          stage_common_option.stage_content
        ]
        csv << column_values
      end
    end
    send_data(csv_data, filename:"ステージオプション申請_#{filename_year}年度.csv")
  end

  def output_employees_csv
    if params[:fes_year_id].to_i == 0
      @employees = Group.preload(:employees).map{ |group| group.employees }
      filename_year = "全"
    else
      @employees = Group.where(fes_year_id:params[:fes_year_id]).preload(:employees).map{ |group| group.employees }
      filename_year = FesYear.find(params[:fes_year_id]).year_num
    end
    bom = "\uFEFF"
    csv_data = CSV.generate(bom) do |csv|
      column_name = %w(参加団体名 名前 学籍番号)
      csv << column_name
      @employees.each do |group|
        # データが存在しない場合はスキップする
        if group.nil?
          next
        end
        group.each do |employee|
          # データが存在しない場合はスキップする
          if employee.nil?
            next
          end
          column_values = [
            employee.group.name,
            employee.name,
            employee.student_id
          ]
          csv << column_values
        end
      end
    end
    send_data(csv_data, filename:"従業員申請_#{filename_year}年度.csv")
  end

  def output_food_products_csv
    if params[:fes_year_id].to_i == 0
      @food_products = Group.preload(:food_products).map{ |group| group.food_products }
      filename_year = "全"
    else
      @food_products = Group.where(fes_year_id:params[:fes_year_id]).preload(:food_products).map{ |group| group.food_products }
      filename_year = FesYear.find(params[:fes_year_id]).year_num
    end
    bom = "\uFEFF"
    csv_data = CSV.generate(bom) do |csv|
      column_name = %w(参加団体名 名前 1日目の個数 2日目の個数 調理の有無)
      csv << column_name
      @food_products.each do |group|
        # データが存在しない場合はスキップする
        if group.nil?
          next
        end
        group.each do |food_product|
          # データが存在しない場合はスキップする
          if food_product.nil?
            next
          end
          column_values = [
            food_product.group.name,
            food_product.name,
            food_product.first_day_num,
            food_product.second_day_num,
            food_product.is_cooking ? "する" : "しない"
          ]
          csv << column_values
        end
      end
    end
    send_data(csv_data, filename:"販売食品申請_#{filename_year}年度.csv")
  end

  def output_purchase_lists_csv
    if params[:fes_year_id].to_i == 0
      @purchase_lists = FoodProduct.preload(:purchase_lists).map{ |food_product| food_product.purchase_lists }
      filename_year = "全"
    else
      @purchase_lists = FoodProduct.preload(:purchase_lists).map{ |food_product| food_product.purchase_lists if food_product.group.fes_year_id == params[:fes_year_id] }
      filename_year = FesYear.find(params[:fes_year_id]).year_num
    end
    bom = "\uFEFF"
    csv_data = CSV.generate(bom) do |csv|
      column_name = %w(参加団体名 販売食品 購入品 なまもの 購入店 購入日 曜日 何日目)
      csv << column_name
      @purchase_lists.each do |food_product|
        # データが存在しない場合はスキップする
        if food_product.nil?
          next
        end
        food_product.each do |purchase_list|
          # データが存在しない場合はスキップする
          if purchase_list.nil?
            next
          end
          column_values = [
            purchase_list.food_product.group.name,
            purchase_list.food_product.name,
            purchase_list.items,
            purchase_list.is_fresh ? "はい" : "いいえ",
            purchase_list.shop.name,
            purchase_list.fes_date.date,
            purchase_list.fes_date.day,
            purchase_list.fes_date.days_num
          ]
          csv << column_values
        end
      end
    end
    send_data(csv_data, filename:"購入品申請_#{filename_year}年度.csv")
  end

  def output_users_csv
    if params[:fes_year_id].to_i == 0
      @users = Group.preload(:user).map{ |group| group.user } 
      filename_year = "全"
    else
      @users = Group.where(fes_year_id:params[:fes_year_id]).preload(:user).map{ |group| group.user } 
      filename_year = FesYear.find(params[:fes_year_id]).year_num
    end
    bom = "\uFEFF"
    csv_data = CSV.generate(bom) do |csv|
      column_name = %w(名前 学科 学年 学籍番号 メールアドレス 電話番号)
      csv << column_name
      @users.each do |user|
        # データが存在しない場合はスキップする
        if user.nil?
          next
        end
        column_values = [
          user.name,
          user.user_detail.department.name,
          user.user_detail.grade.name,
          user.user_detail.student_id,
          user.email,
          user.user_detail.tel
        ]
        csv << column_values
      end
    end
    send_data(csv_data, filename:"代表者_#{filename_year}年度.csv")
  end

end
