# frozen_string_literal: true

class PrintPdfController < ApplicationController
  include ActionController::MimeResponds

  # 物品貸出関連の帳票（物品貸出表・貸出物品リストまとめ）が参照する関連の一覧。
  # 各アクションで Group.includes(...) に渡してプリロードする
  RENTAL_ITEM_PDF_ASSOCIATIONS = [
    :group_category,
    :power_orders,
    { fes_year: :fes_dates },
    { group_identification: { place_number: :place } },
    { assign_rental_items: %i[rental_item stocker_place rental_place] }
  ].freeze

  before_action :authenticate_api_user!

  # 物品貸し出し書類出力
  def output_rental_items_pdf
    output_groups('output_rental_items', 'output_rental_items_pdf', '物品貸出表', 'Not Landscape',
                  RENTAL_ITEM_PDF_ASSOCIATIONS)
  end

  # 物品貸し出し書類をまとめて出力
  def output_all_groups_rental_items_pdf
    @groups = Group.where(fes_year_id: params[:fes_year_id])
                   .includes(RENTAL_ITEM_PDF_ASSOCIATIONS)
                   .order(:group_category_id)
    # 今後の実装によってprint_pdfにlocaleの引数を持たせる
    locale = params[:locale].presence&.to_sym || :ja
    @pdf_locale = locale
    @groups = @groups.where(is_international: true) if locale == :en
    print_pdf('output_all_groups_rental_items', 'output_rental_items_pdf', '物品貸出表', 'Not Landscape')
  end

  # 参加団体情報リスト
  def output_group_info_pdf
    output_groups('output_group_info', 'output_group_info_pdf', '参加団体情報', 'Not Landscape')
  end

  # 参加団体情報リストをまとめて出力
  def output_all_groups_info_pdf
    @groups = Group.where(fes_year_id: params[:fes_year_id])
    print_pdf('output_all_groups_info', 'output_rental_items_pdf', '参加団体情報リストまとめ', 'Not Landscape')
  end

  # 使用電力リスト出力
  def output_powers_pdf
    output_groups_with_categories('output_powers', 'output_powers_pdf', '使用電力リスト', 'Landscape')
  end

  # 従業員リスト
  def output_employees_pdf
    output_groups_in_group_category_1('output_employees', 'output_employees_pdf', '従業員リスト', 'Not Landscape')
  end

  # 貸出物品リスト
  def output_rental_items_list_pdf
    output_groups_with_categories('output_rental_items_list', 'output_rental_items_list_pdf', '貸出物品リストまとめ',
                                  'Landscape', RENTAL_ITEM_PDF_ASSOCIATIONS)
  end

  # 販売品リスト
  def output_food_products_pdf
    output_groups_in_group_category_1('output_food_products', 'output_food_products_pdf', '販売品リスト', 'Landscape')
  end

  # 連絡先リスト
  def output_contacts_pdf
    output_groups_with_categories('output_contact', 'output_contact_pdf', '連絡先リスト', 'Not Landscape')
  end

  # 保健所提出書類（調理計画・調理工程・従事者・平面図）の出力
  def output_health_office_documents_pdf
    output_groups_of_health_office_document('output_health_office_documents', 'output_health_office_documents_pdf', '保健所提出書類（調理計画・調理工程・従事者・平面図）', 'Not Landscape')
  end

  # 全参加団体用
  def output_groups(template_name, style_name, output_file_name, type, associations = nil)
    if Group.exists?(params[:group_id])
      group_scope = associations ? Group.includes(associations) : Group
      @group = group_scope.find(params[:group_id])
      print_pdf(template_name, style_name, "#{output_file_name}_#{format('%02d', @group.id)}.#{@group.name}", type)
    # groupが存在しなければNot FoundのHTMLを出力
    else
      render file: Rails.root.join('app/views/print_pdf/not_found.html').to_s, layout: false, content_type: 'text/html'
    end
  end

  # 食品販売
  def output_groups_in_group_category_1(template_name, style_name, output_file_name, type)
    if Group.exists?(fes_year_id: params[:fes_year_id])
      @groups = Group.where(fes_year_id: params[:fes_year_id]).where(group_category_id: 1)
      Rails.logger.debug @groups
      print_pdf(template_name, style_name, output_file_name, type)
    else
      render file: Rails.root.join('app/views/print_pdf/not_found.html').to_s, layout: false, content_type: 'text/html'
    end
  end

  # 保健所提出書類（調理計画・従事者）
  def output_groups_of_health_office_document(template_name, style_name, output_file_name, type)
    @groups = Group.where(fes_year_id: params[:fes_year_id]).where(group_category_id: 1).where(is_health_center_submission_target: true)
    if @groups.exists?
      @fes_dates = FesDate.all
      print_pdf_with_header_footer(template_name, style_name, output_file_name, type)
    else
      render file: Rails.root.join('app/views/print_pdf/not_found.html').to_s, layout: false, content_type: 'text/html'
    end
  end

  # カテゴリ分けされたもの
  def output_groups_with_categories(template_name, style_name, output_file_name, type, associations = nil)
    if Group.exists?(fes_year_id: params[:fes_year_id])
      group_scope = associations ? Group.includes(associations) : Group
      @groups = group_scope.where(fes_year_id: params[:fes_year_id])
      @catgories = []
      (1..6).each do |i|
        group = group_scope.where(fes_year_id: params[:fes_year_id]).where(group_category_id: i)
        @catgories << group
      end
      print_pdf(template_name, style_name, output_file_name, type)
    else
      render file: Rails.root.join('app/views/print_pdf/not_found.html').to_s, layout: false, content_type: 'text/html'
    end
  end

  # 印刷
  def print_pdf(template_name, style_name, output_file_name, type)
    # Allow caller to specify a rendering locale separate from filter locale.
    # Use `params[:render_locale]` if provided, otherwise fall back to `params[:locale]` or :ja.
    locale = params[:render_locale].presence&.to_sym || params[:locale].presence&.to_sym || :ja

    respond_to do |format|
      format.pdf do
        html = I18n.with_locale(locale) { render_to_string template: "print_pdf/#{template_name}" }

        pdf = if type == 'Landscape'
                PDFKit.new(html,
                           page_size: 'A4',
                           encoding: 'UTF-8',
                           orientation: 'Landscape',
                           margin_top: '0.2in',
                           margin_left: '0.2in',
                           margin_right: '0.2in',
                           margin_bottom: '0.2in')
              else
                PDFKit.new(html, page_size: 'A4', encoding: 'UTF-8')
              end
        pdf.stylesheets << Rails.root.join("app/views/print_pdf/#{style_name}.css").to_s

        send_data pdf.to_pdf,
                  filename: "#{output_file_name}.pdf",
                  # disposition: "inline", # ダウンロードせず表示する
                  type: 'application/pdf'
      end
    end
  end

  # ヘッダー・フッター付き印刷（保健所提出書類用）
  def print_pdf_with_header_footer(template_name, style_name, output_file_name, type)
    respond_to do |format|
      format.pdf do
        html = render_to_string template: "print_pdf/#{template_name}"
        pdf_options = {
          page_size: 'A4',
          encoding: 'UTF-8',
          margin_top: '25mm',
          margin_bottom: '25mm',
          margin_left: '10mm',
          margin_right: '10mm',
          header_spacing: 5,
          footer_spacing: 5,
          header_left: '技大祭実行委員会　総務局',
          header_line: false,
          footer_center: '[page] / [topage]',
          footer_right: "#{Time.now.getlocal('+09:00').strftime('%Y/%-m/%-d %-H:%M')} Group Manager",
          footer_line: false,
          footer_font_size: 10,
          header_font_size: 10,
          outline: true
        }

        pdf_options[:orientation] = 'Landscape' if type == 'Landscape'
        pdf = PDFKit.new(html, pdf_options)

        pdf.stylesheets << Rails.root.join("app/views/print_pdf/#{style_name}.css").to_s

        send_data pdf.to_pdf,
                  filename: "#{output_file_name}.pdf",
                  # disposition: "inline", # ダウンロードせず表示する
                  type: 'application/pdf'
      end
    end
  end
end
