# frozen_string_literal: true

require 'test_helper'

class DepartmentTest < ActiveSupport::TestCase
  test 'display_name returns name_en for en locale' do
    record = Department.new(name: '機械工学分野', name_en: 'Mechanical Engineering')

    assert_equal 'Mechanical Engineering', record.display_name(locale: :en)
  end

  test 'display_name returns name for ja locale' do
    record = Department.new(name: '機械工学分野', name_en: 'Mechanical Engineering')

    assert_equal '機械工学分野', record.display_name(locale: :ja)
    assert_equal '機械工学分野', record.display_name
  end

  test 'display_name falls back to name when name_en is blank' do
    record = Department.new(name: '機械工学分野', name_en: '')

    assert_equal '機械工学分野', record.display_name(locale: :en)
  end

  test 'display_name returns empty string when both names are blank' do
    record = Department.new

    assert_equal '', record.display_name(locale: :en)
  end
end
