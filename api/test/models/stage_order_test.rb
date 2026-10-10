# frozen_string_literal: true

require 'test_helper'

class StageOrderTest < ActiveSupport::TestCase
  test 'to_info_h returns stage order and association details' do
    stage_order = stage_orders(:one)

    info = stage_order.to_info_h

    assert_equal stage_order.id, info[:id]
    assert_equal groups(:one).id, info[:group_id]
    assert_equal fes_dates(:one).id, info[:fes_date_id]
    assert_equal fes_years(:one).year_num, info[:year]
    assert_equal stages(:one).name, info[:stage_first_name]
    assert_equal stages(:one).name, info[:stage_second_name]
    assert_equal stage_order.use_time_interval, info[:use_time_interval]
    assert_equal stage_order.prepare_start_time, info[:prepare_start_time]
  end

  test 'to_info_h returns nil first stage name when first stage is missing' do
    stage_order = stage_orders(:one)
    stage_order.stage_first = nil

    assert_nil stage_order.to_info_h[:stage_first_name]
  end

  test 'to_info_h returns nil second stage name when second stage is missing' do
    stage_order = stage_orders(:one)
    stage_order.stage_second = nil

    assert_nil stage_order.to_info_h[:stage_second_name]
  end
end
