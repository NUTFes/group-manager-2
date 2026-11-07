# frozen_string_literal: true

require 'test_helper'

class GradeTest < ActiveSupport::TestCase
  test 'display_name returns name_en for en locale' do
    record = Grade.new(name: 'B1（学部1年）', name_en: 'B1 (1st year undergraduate)')

    assert_equal 'B1 (1st year undergraduate)', record.display_name(locale: :en)
  end

  test 'display_name returns name for ja locale' do
    record = Grade.new(name: 'B1（学部1年）', name_en: 'B1 (1st year undergraduate)')

    assert_equal 'B1（学部1年）', record.display_name(locale: :ja)
    assert_equal 'B1（学部1年）', record.display_name
  end

  test 'display_name falls back to name when name_en is blank' do
    record = Grade.new(name: 'B1（学部1年）', name_en: '')

    assert_equal 'B1（学部1年）', record.display_name(locale: :en)
  end

  test 'display_name returns empty string when both names are blank' do
    record = Grade.new

    assert_equal '', record.display_name(locale: :en)
  end
end
