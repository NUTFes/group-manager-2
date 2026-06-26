# frozen_string_literal: true

require 'test_helper'

class StageOrderTest < ActiveSupport::TestCase
  test "to_info_h returns hash with stage order details when all associations exist" do
    group = Group.new(name: "Test Group")
    stage1 = Stage.new(name: "Main Stage")
    stage2 = Stage.new(name: "Sub Stage")
    
    stage_order = StageOrder.new(
      is_sunny: true,
      use_time_interval: "30分",
      prepare_time_interval: "10分",
      cleanup_time_interval: "5分",
      prepare_start_time: "10:00",
      performance_start_time: "10:10",
      performance_end_time: "10:40",
      cleanup_end_time: "10:45"
    )
    
    stage_order.stub(:group, group) do
      stage_order.stub(:first_stage_obj, stage1) do
        stage_order.stub(:second_stage_obj, stage2) do
          info = stage_order.to_info_h
          
          assert_not_nil info
          assert_equal "Test Group", info[:group_name]
          assert_equal true, info[:is_sunny]
          assert_equal "Main Stage", info[:stage_first]
          assert_equal "Sub Stage", info[:stage_second]
          assert_equal "30分", info[:use_time_interval]
          assert_equal "10:00", info[:prepare_start_time]
        end
      end
    end
  end

  test "to_info_h returns nil if group is missing" do
    stage1 = Stage.new(name: "Main Stage")
    stage2 = Stage.new(name: "Sub Stage")
    
    stage_order = StageOrder.new(is_sunny: true)
    
    stage_order.stub(:group, nil) do
      stage_order.stub(:first_stage_obj, stage1) do
        stage_order.stub(:second_stage_obj, stage2) do
          assert_nil stage_order.to_info_h
        end
      end
    end
  end

  test "to_info_h returns nil if stage_first is missing" do
    group = Group.new(name: "Test Group")
    stage2 = Stage.new(name: "Sub Stage")
    
    stage_order = StageOrder.new(is_sunny: true)
    
    stage_order.stub(:group, group) do
      stage_order.stub(:first_stage_obj, nil) do
        stage_order.stub(:second_stage_obj, stage2) do
          assert_nil stage_order.to_info_h
        end
      end
    end
  end
end
