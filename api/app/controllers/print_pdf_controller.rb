class PrintPdfController < ApplicationController
  include ActionController::MimeResponds

  def output_rental_items_pdf
    @group = Group.find(params[:group_id])
    print_pdf("output_rental_items", "output_rental_items_pdf", "物品貸出書類_物品持ち出し表(各団体向け)_#{format("%02d", @group.id)}.#{@group.name}")
  end

  def print_pdf(template_name, style_name, output_file_name)
    respond_to do |format|
      format.pdf do
        html = render_to_string template: "print_pdf/#{template_name}"
        pdf = PDFKit.new(html, page_size: 'A4', encoding: "UTF-8")
        pdf.stylesheets << "#{Rails.root}/app/views/print_pdf/#{style_name}.css"

        send_data pdf.to_pdf,
          filename: "#{output_file_name}.pdf",
          type: "application/pdf",
          disposition: "inline"
      end
    end
  end

end

