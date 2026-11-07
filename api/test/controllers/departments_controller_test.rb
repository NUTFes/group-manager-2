# frozen_string_literal: true

require 'test_helper'

class DepartmentsControllerTest < ActionDispatch::IntegrationTest
  self.fixture_table_names = []

  test 'index returns ja and en names ordered by id without authentication' do
    second = Department.create!(id: 2, name: '機械工学分野 2', name_en: nil)
    first = Department.create!(id: 1, name: '機械工学分野', name_en: 'Mechanical Engineering')

    get '/departments'

    assert_response :success
    data = response.parsed_body['data']
    assert_equal([first.id, second.id], data.pluck('id'))
    assert_equal '機械工学分野', data.first['name']
    assert_equal 'Mechanical Engineering', data.first['name_en']
    assert_nil data.last['name_en']
  end
end
