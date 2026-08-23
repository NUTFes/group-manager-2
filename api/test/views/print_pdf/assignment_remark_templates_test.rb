# frozen_string_literal: true

require 'test_helper'

class AssignmentRemarkTemplatesTest < ActiveSupport::TestCase
  self.fixture_table_names = []

  test 'rental items list outputs the assignment remark in the existing remarks cell' do
    template = Rails.root.join('app/views/print_pdf/output_rental_items_list.pdf.erb').read

    assert_includes template, '<td><%= assign_rental_item.remark %></td>'
  end

  test 'all groups info adds a remark heading and assignment value' do
    template = Rails.root.join('app/views/print_pdf/output_all_groups_info.pdf.erb').read

    assert_includes template, '<th>備考</th>'
    assert_includes template, '<td><%= item.remark %></td>'
  end
end
