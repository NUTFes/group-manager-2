# frozen_string_literal: true

class Api::V1::OutputCsvController < ApplicationController
  require 'csv'
  before_action :authenticate_api_user!
  include ApplicationHelper

  def output_groups_csv
    if params[:fes_year_id].to_i == 0
      # 全件選択
      @groups = Group.all
      filename_year = '全'
    else
      @groups = Group.where(fes_year_id: params[:fes_year_id])
      filename_year = FesYear.find(params[:fes_year_id])&.year_num || params[:fes_year_id].to_s
    end
    bom = "\uFEFF"
    csv_data = CSV.generate(bom.dup) do |csv|
      column_name = %w[参加団体名 企画名 活動内容 代表者 メールアドレス カテゴリー 開催年]
      csv << column_name
      @groups.each do |group|
        # データが存在しない場合はスキップする
        next if group.nil?

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

  def output_assign_rental_items_csv
    assign_rental_items_scope = AssignRentalItem.includes(:rental_item, :stocker_place, group: :group_category)

    if params[:fes_year_id].to_i == 0
      # 全件選択
      @assign_rental_items = assign_rental_items_scope
      filename_year = '全'
    else
      @assign_rental_items = assign_rental_items_scope.where(groups: { fes_year_id: params[:fes_year_id] }).references(:groups)
      filename_year = FesYear.find(params[:fes_year_id])&.year_num || params[:fes_year_id].to_s
    end
    bom = "\uFEFF"
    csv_data = CSV.generate(bom.dup) do |csv|
      # column_name = %w(識別番号 参加団体名 カテゴリー 活動場所 使用電力 貸出物品名 借りる場所 数量 貸出日 返却日 開催年)
      column_name = %w[識別番号 参加団体名 カテゴリー 活動場所 使用電力 貸出物品名 借りる場所 数量]
      csv << column_name
      @assign_rental_items.each do |assign_rental_item|
        # データが存在しない場合はスキップする
        next if assign_rental_item.nil?

        column_values = [
          assign_rental_item.group.number,
          assign_rental_item.group.name,
          assign_rental_item.group.group_category.name,
          assign_rental_item.group.place,
          assign_rental_item.group.sum_power_orders,
          assign_rental_item.rental_item.name,
          assign_rental_item.stocker_place.name,
          assign_rental_item.num
          # assign_rental_item.group.fes_year.fes_dates.where(days_num: 0).nil? ? nil : assign_rental_item.group.fes_year.fes_dates.where(days_num: 0).first.date,
          # assign_rental_item.group.fes_year.fes_dates.where(days_num: 3).nil? ? nil : assign_rental_item.group.fes_year.fes_dates.where(days_num: 3).first.date,
          # assign_rental_item.group.fes_year.year_num
        ]
        csv << column_values
      end
    end
    send_data(csv_data, filename: "参加団体情報リストまとめ_#{filename_year}年度.csv")
  end

  def output_sub_reps_csv
    if params[:fes_year_id].to_i == 0
      @sub_reps = Group.preload(:sub_rep).map(&:sub_rep)
      filename_year = '全'
    else
      @sub_reps = Group.where(fes_year_id: params[:fes_year_id]).preload(:sub_rep).map(&:sub_rep)
      filename_year = FesYear.find(params[:fes_year_id])&.year_num || params[:fes_year_id].to_s
    end
    bom = "\uFEFF"
    csv_data = CSV.generate(bom.dup) do |csv|
      column_name = %w[参加団体名 カテゴリー 名前 学科 学年 学籍番号 メールアドレス 電話番号 開催年]
      csv << column_name
      @sub_reps.each do |sub_rep|
        # データが存在しない場合はスキップする
        next if sub_rep.nil?

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
      @rental_orders = Group.preload(:rental_orders).map(&:rental_orders)
      filename_year = '全'
    else
      @rental_orders = Group.where(fes_year_id: params[:fes_year_id]).preload(:rental_orders).map(&:rental_orders)
      filename_year = FesYear.find(params[:fes_year_id])&.year_num || params[:fes_year_id].to_s
    end
    bom = "\uFEFF"
    csv_data = CSV.generate(bom.dup) do |csv|
      column_name = %w[参加団体名 代表者 メールアドレス カテゴリー 物品名 数 開催年]
      csv << column_name
      @rental_orders.each do |group|
        # データが存在しない場合はスキップする
        next if group.nil?

        group.each do |rental_order|
          # データが存在しない場合はスキップする
          next if rental_order.nil?

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
      @power_orders = Group.preload(:power_orders).map(&:power_orders)
      filename_year = '全'
    else
      @power_orders = Group.where(fes_year_id: params[:fes_year_id]).preload(:power_orders).map(&:power_orders)
      filename_year = FesYear.find(params[:fes_year_id])&.year_num || params[:fes_year_id].to_s
    end
    bom = "\uFEFF"
    csv_data = CSV.generate(bom.dup) do |csv|
      column_name = %w[参加団体名 代表者 メールアドレス カテゴリー 製品 URL 電力 メーカー 型番]
      csv << column_name
      @power_orders.each do |group|
        # データが存在しない場合はスキップする
        next if group.nil?

        group.each do |power_order|
          # データが存在しない場合はスキップする
          next if power_order.nil?

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
      @place_orders = Group.preload(:place_order).map(&:place_order)
      filename_year = '全'
    else
      @place_orders = Group.where(fes_year_id: params[:fes_year_id]).preload(:place_order).map(&:place_order)
      filename_year = FesYear.find(params[:fes_year_id])&.year_num || params[:fes_year_id].to_s
    end
    bom = "\uFEFF"
    csv_data = CSV.generate(bom.dup) do |csv|
      column_name = %w[参加団体名 代表者 メールアドレス カテゴリー 第1希望 第2希望 第3希望 備考]
      csv << column_name
      @place_orders.each do |place_order|
        # データが存在しない場合はスキップする
        next if place_order.nil?

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
      @stage_orders = Group.preload(:stage_orders).map(&:stage_orders)
      filename_year = '全'
    else
      @stage_orders = Group.where(fes_year_id: params[:fes_year_id]).preload(:stage_orders).map(&:stage_orders)
      filename_year = FesYear.find(params[:fes_year_id])&.year_num || params[:fes_year_id].to_s
    end
    bom = "\uFEFF"
    csv_data = CSV.generate(bom.dup) do |csv|
      column_name = %w[参加団体名 カテゴリー 天気 日付 曜日 何日目 第1希望 第2希望 使用時間 準備時間 片付け時間 準備開始時刻 演目開始時刻 演目終了時刻 片付け終了時刻]
      csv << column_name
      @stage_orders.each do |group|
        # データが存在しない場合はスキップする
        next if group.nil?

        group.each do |stage_order|
          # データが存在しない場合はスキップする
          next if stage_order.nil?

          column_values = [
            stage_order.group.name,
            stage_order.group.group_category.name,
            stage_order.is_sunny ? '晴れ' : '雨',
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
      @stage_common_options = Group.preload(:stage_common_option).map(&:stage_common_option)
      filename_year = '全'
    else
      @stage_common_options = Group.where(fes_year_id: params[:fes_year_id]).preload(:stage_common_option).map(&:stage_common_option)
      filename_year = FesYear.find(params[:fes_year_id])&.year_num || params[:fes_year_id].to_s
    end
    bom = "\uFEFF"
    csv_data = CSV.generate(bom.dup) do |csv|
      column_name = %w[参加団体名 所持機器の使用 音楽の使用 撮影許可 大きな音 内容]
      csv << column_name
      @stage_common_options.each do |stage_common_option|
        # データが存在しない場合はスキップする
        next if stage_common_option.nil?

        column_values = [
          stage_common_option.group.name,
          stage_common_option.own_equipment ? '使用する' : '使用しない',
          stage_common_option.bgm ? '使用する' : '使用しない',
          stage_common_option.camera_permission ? '許可する' : '許可しない',
          stage_common_option.loud_sound ? '出す' : '出さない'
        ]
        csv << column_values
      end
    end
    send_data(csv_data, filename: "ステージオプション申請_#{filename_year}年度.csv")
  end

  def output_employees_csv
    # 対象グループの取得（食品団体のみ）
    if params[:fes_year_id].to_i == 0
      groups = Group.where(group_category_id: 1).preload(:employees, :sub_rep, user: :user_detail)
      filename_year = '全'
    else
      # 開催年かつ食品団体（食販）のみ対象
      groups = Group.where(fes_year_id: params[:fes_year_id], group_category_id: 1).preload(:employees, :sub_rep, user: :user_detail)
      filename_year = FesYear.find(params[:fes_year_id])&.year_num || params[:fes_year_id].to_s
    end

    # 全件の人物リストを収集（代表・副代表・従業員）
    persons = []
    # 同一団体内重複記録: group_id => Set of student_ids / normalized names
    group_dup_student_ids = Hash.new { |h, k| h[k] = Set.new }
    group_dup_names = Hash.new { |h, k| h[k] = Set.new }

    groups.each do |group|
      next if group.nil?

      # 代表
      rep = group.user
      rep_norm = nil
      rep_student = nil
      # グループ内既出チェック用セット
      group_seen_student_ids = Set.new
      group_seen_norm_and_id = Set.new
      if rep
        rep_norm = rep.name.to_s.gsub(/[[:space:]\u3000]+/, '')
        rep_student = rep.user_detail&.student_id
        # mark seen
        group_seen_student_ids << rep_student if rep_student.present?
        group_seen_norm_and_id << [rep_norm, rep_student] if rep_norm.present?
        persons << { group_id: group.id, group: group.name, name: rep.name.to_s, student_id: rep_student, roles: ['代'] }
      end

      # 副代表
      sub_rep = group.sub_rep
      sub_rep_norm = nil
      sub_rep_student = nil
      if sub_rep
        sub_rep_norm = sub_rep.name.to_s.gsub(/[[:space:]\u3000]+/, '')
        sub_rep_student = sub_rep.student_id
        # mark seen
        group_seen_student_ids << sub_rep_student if sub_rep_student.present?
        group_seen_norm_and_id << [sub_rep_norm, sub_rep_student] if sub_rep_norm.present?
        persons << { group_id: group.id, group: group.name, name: sub_rep.name.to_s, student_id: sub_rep_student, roles: ['副'] }
      end

      # 従業員 — 同一団体内で代表/副代表と学籍番号または正規化氏名が一致する場合はスキップ
      (group.employees || []).each do |employee|
        next if employee.nil?

        emp_name = employee.name.to_s
        emp_norm = emp_name.gsub(/[[:space:]\u3000]+/, '')
        emp_student = employee.student_id
        common_student_ids = [
          UserDetail::STUDENT_ID_EXTERNAL,
          UserDetail::STUDENT_ID_STAFF
        ]

        # 学籍番号による重複チェック対象か（存在し、かつ外部/スタッフなどの特別値ではない）
        student_id_dup_check_target = emp_student.present? && common_student_ids.exclude?(emp_student)

        # 重複判定: まず同一団体内で既に見た student_id / name と重複しているか
        if student_id_dup_check_target && group_seen_student_ids.include?(emp_student)
          group_dup_student_ids[group.id] << emp_student
          next
        elsif !student_id_dup_check_target && emp_norm.present? && group_seen_norm_and_id.include?([emp_norm, emp_student])
          group_dup_names[group.id] << [emp_norm, emp_student]
          next
        end

        # 正常な従業員は persons に追加し、グループ内の既出に追加する
        persons << { group_id: group.id, group: group.name, name: emp_name, student_id: emp_student, roles: [] }
        group_seen_student_ids << emp_student if emp_student.present?
        group_seen_norm_and_id << [emp_norm, emp_student] if emp_norm.present?
      end
    end

    # 正規化: 氏名はスペース削除、比較は小文字化。学籍番号は存在しかつ学生のみで重複判定対象とする
    persons.each do |p|
      # 半角スペースと全角スペースを削除して正規化
      p[:normalized_name] = p[:name].gsub(/[[:space:]\u3000]+/, '')
      p[:normalized_key] = p[:normalized_name].downcase
      p[:is_student] = if p[:student_id].present?
                         (user_category_label(p[:student_id]) == '学生')
                       else
                         false
                       end
    end

    # 学籍番号で集計（学生のみ）: student_id => [{group_id, group_name}]
    student_map = Hash.new { |h, k| h[k] = [] }
    persons.each do |p|
      next unless p[:is_student] && p[:student_id].present?

      student_map[p[:student_id]] << { group_id: p[:group_id], group: p[:group], roles: Array(p[:roles]) }
    end

    # 氏名で集計（学籍番号で既にまとめられた人物は除外）: normalized_key => [{group_id, group_name}]
    name_map = Hash.new { |h, k| h[k] = [] }
    persons.each do |p|
      next if p[:is_student] && p[:student_id].present? && student_map[p[:student_id]].any?

      key = p[:normalized_key]
      name_map[key] << { group_id: p[:group_id], group: p[:group], student_id: p[:student_id], roles: Array(p[:roles]) }
    end

    # 行は参加団体ID順で出力する
    persons_sorted = persons.sort_by { |p| p[:group_id] || 0 }

    # 参加団体ごとのメンバー一覧（グループ内重複チェック用）
    group_map = Hash.new { |h, k| h[k] = [] }
    persons.each do |p|
      group_map[p[:group_id]] << p
    end

    # CSV生成（列: 参加団体名, 名前, 学籍番号, 役職, 重複, 備考）
    bom = "\uFEFF"
    csv_data = CSV.generate(bom.dup) do |csv|
      column_name = %w[参加団体名 名前 学籍番号 役職 重複 備考]
      csv << column_name

      persons_sorted.each do |p|
        current_group = p[:group]
        current_group_id = p[:group_id]
        name = p[:normalized_name]
        student_id = p[:student_id].presence || ''
        roles_str = Array(p[:roles]).join(',')

        # 重複先を決定
        duplicates = []
        entries = if p[:is_student] && p[:student_id].present?
                    student_map[p[:student_id]] || []
                  else
                    name_map[p[:normalized_key]] || []
                  end
        entries.each do |e|
          next if e[:group_id] == current_group_id

          duplicates << e[:group]
        end

        duplicates_str = duplicates.sort_by do |gname|
          # sort duplicates by group id: find id from persons (slow but dataset small)
          found = persons.find { |pp| pp[:group] == gname }
          found ? found[:group_id] : 0
        end.join(',')

        # 同一団体内で同一人物が2重登録されているかチェック（スキップされた重複を group_dup_maps で判定）
        remark = ''
        if p[:is_student] && p[:student_id].present?
          remark = '同一団体内で2重登録（非表示で対応）' if group_dup_student_ids[current_group_id].include?(p[:student_id])
        elsif group_dup_names[current_group_id].include?([p[:normalized_name], p[:student_id]])
          remark = '同一団体内で2重登録（非表示で対応）'
        end

        csv << [current_group, name, student_id, roles_str, duplicates_str, remark]
      end
    end

    send_data(csv_data, filename: "従業員申請_#{filename_year}年度.csv")
  end

  def output_food_products_csv
    if params[:fes_year_id].to_i == 0
      @food_products = Group.preload(:food_products).map(&:food_products)
      filename_year = '全'
    else
      @food_products = Group.where(fes_year_id: params[:fes_year_id]).preload(:food_products).map(&:food_products)
      filename_year = FesYear.find(params[:fes_year_id])&.year_num || params[:fes_year_id].to_s
    end
    bom = "\uFEFF"
    csv_data = CSV.generate(bom.dup) do |csv|
      column_name = %w[参加団体名 名前 1日目の個数 2日目の個数 調理の有無]
      csv << column_name
      @food_products.each do |group|
        # データが存在しない場合はスキップする
        next if group.nil?

        group.each do |food_product|
          # データが存在しない場合はスキップする
          next if food_product.nil?

          column_values = [
            food_product.group.name,
            food_product.name,
            food_product.first_day_num,
            food_product.second_day_num,
            food_product.is_cooking ? 'する' : 'しない'
          ]
          csv << column_values
        end
      end
    end
    send_data(csv_data, filename: "販売品申請_#{filename_year}年度.csv")
  end

  def output_purchase_lists_csv
    if params[:fes_year_id].to_i == 0
      @purchase_lists = FoodProduct.preload(:purchase_lists).map(&:purchase_lists)
      filename_year = '全'
    else
      @purchase_lists = FoodProduct.preload(:purchase_lists).map { |food_product| food_product.purchase_lists if food_product.group.fes_year_id == params[:fes_year_id] }
      filename_year = FesYear.find(params[:fes_year_id])&.year_num || params[:fes_year_id].to_s
    end
    bom = "\uFEFF"
    csv_data = CSV.generate(bom.dup) do |csv|
      column_name = %w[参加団体名 販売品 購入品 なまもの 購入店 購入日 曜日 何日目 URL 備考]
      csv << column_name
      @purchase_lists.each do |food_product|
        # データが存在しない場合はスキップする
        next if food_product.nil?

        food_product.each do |purchase_list|
          # データが存在しない場合はスキップする
          next if purchase_list.nil?

          column_values = [
            purchase_list.food_product.group.name,
            purchase_list.food_product.name,
            purchase_list.items,
            purchase_list.is_fresh ? 'はい' : 'いいえ',
            purchase_list.shop.name,
            purchase_list.fes_date.date,
            purchase_list.fes_date.day,
            purchase_list.fes_date.days_num,
            purchase_list.url,
            purchase_list.remark
          ]
          csv << column_values
        end
      end
    end
    send_data(csv_data, filename: "購入品申請_#{filename_year}年度.csv")
  end

  def output_users_csv
    if params[:fes_year_id].to_i == 0
      @groups = Group.preload(:user, :sub_rep, user: :user_detail) # 必要な関連を事前にロード
      filename_year = '全'
    else
      @groups = Group.where(fes_year_id: params[:fes_year_id]).preload(:user, :sub_rep, user: :user_detail) # 必要な関連を事前にロード
      filename_year = FesYear.find(params[:fes_year_id])&.year_num || params[:fes_year_id].to_s
    end

    @categories = []
    (1..6).each do |i|
      group = @groups.where(group_category_id: i)
      @categories << group
    end

    bom = "\uFEFF"
    csv_data = CSV.generate(bom.dup) do |csv|
      column_name = %w[参加団体形式 団体番号 団体名 氏名 電話番号 メールアドレス 備考欄]
      csv << column_name
      @categories.each do |category|
        next unless category.exists?

        category.each do |group|
          rep = group.user
          sub_rep = group.sub_rep
          # 代表者情報を1行目に追加
          csv << [
            group.group_category.name,
            group.number,
            group.name,
            rep&.name,
            rep&.user_detail&.tel,
            rep&.email,
            '' # 備考欄は空のまま
          ]
          # 副代表者情報を2行目に追加
          csv << [
            '',
            '',
            '',
            sub_rep&.name,
            sub_rep&.tel,
            sub_rep&.email,
            '' # 備考欄は空のまま
          ]
        end
      end
    end

    send_data(csv_data, filename: "連絡先リスト_#{filename_year}年度.csv")
  end

  def output_announcements_csv
    @announcements = Announcement.all
    bom = "\uFEFF"
    csv_data = CSV.generate(bom.dup) do |csv|
      column_name = %w[参加団体名 アナウンス文]
      csv << column_name
      @announcements.each do |announcement|
        column_values = [
          announcement.group.name,
          announcement.message
        ]
        csv << column_values
      end
    end
    send_data(csv_data, filename: '会場アナウンス文.csv')
  end

  def output_cooking_process_orders_csv
    @cooking_process_orders = CookingProcessOrder.includes(:group, :food_product).all
    bom = "\uFEFF"
    csv_data = CSV.generate(bom.dup) do |csv|
      column_name = %w[参加団体名 販売品名 営業前:調理場 営業中:調理場 テント内]
      csv << column_name
      @cooking_process_orders.each do |cooking_process_order|
        column_values = [
          cooking_process_order.group.name,
          cooking_process_order.food_product.name,
          cooking_process_order.pre_open_kitchen ? '申請する' : '申請しない',
          cooking_process_order.during_open_kitchen ? '申請する' : '申請しない',
          cooking_process_order.tent_for_submission
        ]
        csv << column_values
      end
    end
    send_data(csv_data, filename: '調理工程申請.csv')
  end

  def output_public_relations_csv
    if params[:fes_year_id].to_i == 0
      @public_relations = Group.preload(:public_relation).map(&:public_relation)
      filename_year = '全'
    else
      @public_relations = Group.where(fes_year_id: params[:fes_year_id]).preload(:public_relation).map(&:public_relation)
      filename_year = FesYear.find(params[:fes_year_id])&.year_num || params[:fes_year_id].to_s
    end
    bom = "\uFEFF"
    csv_data = CSV.generate(bom.dup) do |csv|
      column_name = %w[参加団体名 PR文 URL アナウンス有無]
      csv << column_name
      @public_relations.each do |public_relation|
        next if public_relation.nil?

        column_values = [
          public_relation.group.name,
          public_relation.blurb,
          public_relation.picture_path,
          public_relation.is_announcement_requested ? '有' : '無'
        ]
        csv << column_values
      end
    end
    send_data(csv_data, filename: "参加団体PR申請_#{filename_year}年度.csv")
  end

  def output_fire_equipment_orders_csv
    if params[:fes_year_id].to_i == 0
      @fire_equipment_orders = FireEquipmentOrder.all
      filename_year = '全'
    else
      fes_year = FesYear.find(params[:fes_year_id])
      if fes_year
        @fire_equipment_orders = FireEquipmentOrder.joins(:group).where(groups: { fes_year_id: fes_year.id })
        filename_year = fes_year.year_num
      else
        @fire_equipment_orders = []
        filename_year = params[:fes_year_id].to_s
      end
    end
    bom = "\uFEFF"
    csv_data = CSV.generate(bom) do |csv|
      column_name = %w[ID 団体名 火気の名称 火気の台数 燃料 使用用途 持ち帰り 備考]
      csv << column_name
      @fire_equipment_orders.each do |order|
        next if order.nil?

        group_name = order.group&.name || ''
        column_values = [
          order.id,
          group_name,
          order.name,
          order.quantity,
          order.fuel_japanese,
          order.usage,
          order.is_takeaway ? 'はい' : 'いいえ',
          order.remark
        ]
        csv << column_values
      end
    end
    send_data(csv_data, filename: "火気使用申請_#{filename_year}年度.csv")
  end
end
