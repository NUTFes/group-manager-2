# frozen_string_literal: true

require 'test_helper'

class PrintPdfControllerTest < ActionDispatch::IntegrationTest
  self.fixture_table_names = []

  setup do
    Role.create!(id: 1, name: 'admin')
    Role.create!(id: 2, name: 'staff')
    Role.create!(id: 3, name: 'user')
    @admin = create_user!(email: 'print-pdf-admin@example.com', role_id: 1)
    @staff = create_user!(email: 'print-pdf-staff@example.com', role_id: 2)
    @general_user = create_user!(email: 'print-pdf-user@example.com', role_id: 3)
    category = GroupCategory.create!(name: '食品販売')
    @year = FesYear.create!(year_num: 2026)
    Group.create!(
      name: 'PDF発行団体',
      project_name: 'PDF発行企画',
      activity: '活動内容',
      user: @admin,
      group_category: category,
      fes_year: @year
    )
  end

  test 'admin can get all groups rental items pdf' do
    get_all_groups_rental_items_pdf(@admin)

    assert_response :success
    assert_equal 'application/pdf', response.media_type
  end

  test 'staff can get all groups rental items pdf' do
    get_all_groups_rental_items_pdf(@staff)

    assert_response :success
    assert_equal 'application/pdf', response.media_type
  end

  test 'general user cannot get all groups rental items pdf' do
    get_all_groups_rental_items_pdf(@general_user)

    assert_response :forbidden
  end

  test 'unauthenticated request cannot get all groups rental items pdf' do
    get "/print_pdf/group_all/#{@year.id}/output", params: { format: :pdf }

    assert_response :unauthorized
  end

  private

  def get_all_groups_rental_items_pdf(user)
    get "/print_pdf/group_all/#{@year.id}/output",
        params: { format: :pdf },
        headers: user.create_new_auth_token
  end

  def create_user!(email:, role_id:)
    User.create!(
      name: email.split('@').first,
      email: email,
      uid: email,
      provider: 'email',
      password: 'password',
      password_confirmation: 'password',
      role_id: role_id
    )
  end
end
