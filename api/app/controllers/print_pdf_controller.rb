class PrintPdfController < ApplicationController
  include ActionController::MimeResponds

  def groups
    @groups = Group.all
    print_pdf("groups", "groups")
  end

  def print_pdf(template_name, output_file_name)
    respond_to do |format|
      format.pdf do
        html = render_to_string template: "print_pdf/#{template_name}"
        pdf = PDFKit.new(html, page_size: 'A4', encoding: "UTF-8")

        send_data pdf.to_pdf,
          filename: "#{output_file_name}.pdf",
          type: "application/pdf"
      end
    end
  end

end

