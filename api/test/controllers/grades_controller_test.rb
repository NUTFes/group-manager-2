# frozen_string_literal: true

require 'test_helper'

class GradesControllerTest < ActionDispatch::IntegrationTest
  self.fixture_table_names = []

  test 'index returns ja and en names ordered by id without authentication' do
    second = Grade.create!(id: 2, name: 'B1（学部1年） 2', name_en: nil)
    first = Grade.create!(id: 1, name: 'B1（学部1年）', name_en: 'B1 (1st year undergraduate)')

    get '/grades'

    assert_response :success
    data = response.parsed_body['data']
    assert_equal [first.id, second.id], data.map { |row| row['id'] }
    assert_equal 'B1（学部1年）', data.first['name']
    assert_equal 'B1 (1st year undergraduate)', data.first['name_en']
    assert_nil data.last['name_en']
  end
end
