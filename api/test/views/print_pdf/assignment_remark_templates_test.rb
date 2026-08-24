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

    assert_includes template, '<table class="items all-groups-info-items">'
    assert_includes template, '<col class="remark-column">'
    assert_includes template, '<th>備考</th>'
    assert_includes template, '<td><%= item.remark %></td>'
  end

  test 'all groups info rental items columns have widths totaling one hundred percent' do
    stylesheet = Rails.root.join('app/views/print_pdf/output_rental_items_pdf.css').read
    widths = stylesheet.scan(/\.all-groups-info-items .+? \{\s+width: ([\d.]+)%;\s+\}/).flatten.map(&:to_f)

    assert_equal 4, widths.length
    assert_in_delta 100, widths.sum
  end
end
