# frozen_string_literal: true

require 'test_helper'

class AssignmentRemarkTemplatesTest < ActiveSupport::TestCase
  self.fixture_table_names = []

  test 'rental item PDF templates output the remark below the item name' do
    %w[
      output_rental_items.pdf.erb
      output_all_groups_rental_items.pdf.erb
      output_rental_items_list.pdf.erb
    ].each do |filename|
      template = Rails.root.join('app/views/print_pdf', filename).read

      assert_includes template, 'assign_rental_item.remark.present?'
      assert_includes template, 'class="item-remark"'
      assert_includes template, '<%= assign_rental_item.remark %>'
    end
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
    selectors = [
      '.all-groups-info-items .item-name-column',
      '.all-groups-info-items .pickup-location-column',
      '.all-groups-info-items .quantity-column',
      '.all-groups-info-items .remark-column'
    ]

    total_width = selectors.sum { |selector| width_for(stylesheet, selector) }
    assert_in_delta 100, total_width
  end

  test 'rental item PDF columns have widths totaling one hundred percent' do
    stylesheet = Rails.root.join('app/views/print_pdf/output_rental_items_pdf.css').read
    individual_selectors = [
      '.individual-items .item-name-column',
      '.individual-items .stock-location-column',
      '.individual-items .rental-location-column',
      '.individual-items .quantity-column',
      '.individual-items .pickup-date-column',
      '.individual-items .return-date-column',
      '.individual-items .confirmation-column'
    ]
    all_groups_selectors = [
      '.all-groups-items .item-name-column',
      '.all-groups-items .stock-location-column',
      '.all-groups-items .rental-location-column',
      '.all-groups-items .quantity-column',
      '.all-groups-items .pickup-date-column',
      '.all-groups-items .return-date-column',
      '.all-groups-items .confirmation-column',
      '.all-groups-items .confirmation-column'
    ]

    individual_total_width = individual_selectors.sum { |selector| width_for(stylesheet, selector) }
    all_groups_total_width = all_groups_selectors.sum { |selector| width_for(stylesheet, selector) }

    assert_in_delta 100, individual_total_width
    assert_in_delta 100, all_groups_total_width
  end

  private

  def width_for(stylesheet, selector)
    declaration = stylesheet.scan(/([^{}]+)\{([^{}]+)\}/).find do |selectors, _rules|
      selectors.split(',').map(&:strip).include?(selector)
    end

    assert declaration, "Missing CSS declaration for #{selector}"
    declaration.last[/width:\s*([\d.]+)%/, 1].to_f
  end
end
