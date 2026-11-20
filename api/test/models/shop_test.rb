# frozen_string_literal: true

require 'test_helper'

class ShopTest < ActiveSupport::TestCase
  test 'next_regular_id returns the smallest missing id under 998' do
    relation = Object.new

    def relation.pluck(*)
      [1, 3, 4, 998, 999]
    end

    Shop.stub(:where, relation) do
      assert_equal 2, Shop.next_regular_id
    end
  end

  test 'next_regular_id starts from 1 when only reserved ids exist' do
    relation = Object.new

    def relation.pluck(*)
      [998, 999]
    end

    Shop.stub(:where, relation) do
      assert_equal 1, Shop.next_regular_id
    end
  end

  test 'next_regular_id raises when all regular ids are exhausted' do
    relation = Object.new

    def relation.pluck(*)
      (1..999).to_a
    end

    Shop.stub(:where, relation) do
      assert_raises(ActiveRecord::RecordNotUnique) { Shop.next_regular_id }
    end
  end
end
