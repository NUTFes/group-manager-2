class PrintPdfController < ApplicationController
  include ActionController::MimeResponds

  # 物品貸し出し書類出力
  def output_rental_items_pdf
    output_groups("output_rental_items", "output_rental_items_pdf", "物品貸出表", "Not Landscape")
  end

  # 物品貸し出し書類をまとめて出力
  def output_all_groups_rental_items_pdf
    @groups = Group.where(fes_year_id: params[:fes_year_id]).order(:group_category_id)
    print_pdf("output_all_groups_rental_items", "output_rental_items_pdf", "物品貸出表", "Not Landscape")
  end

  # 参加団体情報リスト
  def output_group_info_pdf
    output_groups("output_group_info", "output_group_info_pdf", "参加団体情報", "Not Landscape")
  end

  # 参加団体情報リストをまとめて出力
  def output_all_groups_info_pdf
    @groups = Group.where(fes_year_id: params[:fes_year_id])
    print_pdf("output_all_groups_info", "output_rental_items_pdf", "参加団体情報リストまとめ", "Not Landscape")
  end

  # 使用電力リスト出力
  def output_powers_pdf
    output_groups_with_categories("output_powers", "output_powers_pdf", "使用電力リスト", "Landscape")
  end

  # 従業員リスト
  def output_employees_pdf
    output_groups_in_group_category_1("output_employees", "output_employees_pdf", "従業員リスト", "Not Landscape")
  end

  # 貸出物品リスト
  def output_rental_items_list_pdf
    output_groups_with_categories("output_rental_items_list", "output_rental_items_list_pdf", "貸出物品リストまとめ", "Landscape")
  end

  # 販売品リスト
  def output_food_products_pdf
    output_groups_in_group_category_1("output_food_products", "output_food_products_pdf", "販売品リスト", "Landscape")
  end

  # 連絡先リスト
  def output_contacts_pdf
    output_groups_with_categories("output_contact", "output_contact_pdf", "連絡先リスト", "Not Landscape")
  end

  # 保健所提出書類（調理計画・従事者）の出力
  def output_health_office_documents_pdf
    output_groups_of_health_office_document("output_health_office_documents", "output_health_office_documents_pdf", "保健所提出書類（調理計画・従事者）", "Not Landscape")
  end

  # 全参加団体用
  def output_groups(template_name, style_name, output_file_name, type)
    if Group.exists?(params[:group_id])
      @group = Group.find(params[:group_id])
      print_pdf(template_name, style_name, "#{output_file_name}_#{format("%02d", @group.id)}.#{@group.name}", type)
    # groupが存在しなければNot FoundのHTMLを出力
    else
      render file: "#{Rails.root}/app/views/print_pdf/not_found.html", layout: false, content_type: 'text/html'
    end
  end

  # 食品販売
  def output_groups_in_group_category_1(template_name, style_name, output_file_name, type)
    if Group.where(fes_year_id: params[:fes_year_id]).exists?
      @groups = Group.where(fes_year_id: params[:fes_year_id]).where(group_category_id: 1)
      puts @groups
      print_pdf(template_name, style_name, output_file_name, type)
    else
      render file: "#{Rails.root}/app/views/print_pdf/not_found.html", layout: false, content_type: 'text/html'
    end
  end

  # 保健所提出書類（調理計画・従事者）
  def output_groups_of_health_office_document(template_name, style_name, output_file_name, type)
    if Group.where(fes_year_id: params[:fes_year_id]).exists?
      @groups = Group.where(fes_year_id: params[:fes_year_id]).where(group_category_id: 1)
      @fes_dates = FesDate.all
      print_pdf(template_name, style_name, output_file_name, type)
    else
      render file: "#{Rails.root}/app/views/print_pdf/not_found.html", layout: false, content_type: 'text/html'
    end
  end

  # カテゴリ分けされたもの
  def output_groups_with_categories(template_name, style_name, output_file_name, type)
    if Group.where(fes_year_id: params[:fes_year_id]).exists?
      @groups = Group.where(fes_year_id: params[:fes_year_id])
      @catgories = []
      for i in 1..6 do
        group = Group.where(fes_year_id: params[:fes_year_id]).where(group_category_id: i)
        @catgories << group
      end
      print_pdf(template_name, style_name, output_file_name, type)
    else
      render file: "#{Rails.root}/app/views/print_pdf/not_found.html", layout: false, content_type: 'text/html'
    end
  end

  # 印刷
  def print_pdf(template_name, style_name, output_file_name, type)
    respond_to do |format|
      format.pdf do
        html = render_to_string template: "print_pdf/#{template_name}"
        if type == 'Landscape'
          pdf = PDFKit.new(html,
                           page_size: 'A4',
                           encoding: "UTF-8",
                           orientation: 'Landscape',
                           margin_top: '0.2in',
                           margin_left: '0.2in',
                           margin_right: '0.2in',
                           margin_bottom: '0.2in'
                          )
        else
          pdf = PDFKit.new(html, page_size: 'A4', encoding: "UTF-8")
        end
        pdf.stylesheets << "#{Rails.root}/app/views/print_pdf/#{style_name}.css"

        send_data pdf.to_pdf,
          filename: "#{output_file_name}.pdf",
          # disposition: "inline", # ダウンロードせず表示する
          type: "application/pdf"

      end
    end
  end

end

