# frozen_string_literal: true

require 'test_helper'

class FoodProductTest < ActiveSupport::TestCase
  test 'creates default health center submission status for food product' do
    assert_difference('HealthCenterSubmissionStatus.where(group: groups(:two), application_type: :food_product).count', 1) do
      FoodProduct.create!(
        group: groups(:two),
        name: '焼きそば',
        is_cooking: true,
        first_day_num: 10,
        second_day_num: 12
      )
    end

    status = HealthCenterSubmissionStatus.find_by(group: groups(:two), application_type: :food_product)
    assert_equal 'unsubmitted', status.status
  end
end
