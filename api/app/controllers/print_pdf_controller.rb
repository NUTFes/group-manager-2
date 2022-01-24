class PrintPdfController < ApplicationController
  include ActionController::MimeResponds

  # 物品貸し出し書類出力
  def output_rental_items_pdf
    if Group.exists?(params[:group_id])
      @group = Group.find(params[:group_id])
      print_pdf("output_rental_items", "output_rental_items_pdf", "物品貸出書類_物品持ち出し表(各団体向け)_#{format("%02d", @group.id)}.#{@group.name}", 'Not Landscape')
    # groupが存在しなければNot FoundのHTMLを出力
    else
      render file: "#{Rails.root}/app/views/print_pdf/not_found.html", layout: false, content_type: 'text/html'
    end
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
    output_groups_with_categories("output_rental_items_list", "output_rental_items_list_pdf", "貸出物品リスト", "Landscape")
  end

  # 販売食品リスト
  def output_food_products_pdf
    output_groups_in_group_category_1("output_food_products", "output_food_products_pdf", "販売食品リスト", "Landscape")
  end

  # 連絡先リスト
  def output_contacts_pdf
    output_groups_with_categories("output_contact", "output_contact_pdf", "連絡先リスト", "Not Landscape")
  end

  # 食品販売
  def output_groups_in_group_category_1(template_name, style_name, output_file_name, type)
    if Group.where(fes_year_id: params[:fes_year_id]).exists?
      @groups = Group.where(fes_year_id: params[:fes_year_id]).where(group_category_id: 1)
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
          disposition: "inline", # ダウンロードせず表示する
          type: "application/pdf"

      end
    end
  end

end

