# frozen_string_literal: true

require 'test_helper'
require 'minitest/mock'

class PublicRelationsControllerTest < ActionDispatch::IntegrationTest
  self.fixture_table_names = %w[groups]

  setup do
    create_participant!
    PublicRelation.delete_all
    @public_relation = PublicRelation.create!(
      group_id: groups(:one).id,
      picture_name: 'public_relation.png',
      picture_path: 'https://i.imgur.com/public-relation.png',
      blurb: 'fixture blurb',
      is_announcement_requested: false
    )
  end

  test 'should get index without imgur_deletehash' do
    @public_relation.update!(imgur_deletehash: 'index-deletehash')

    get public_relations_url, headers: auth_headers, as: :json

    assert_response :success
    assert_equal 200, response.parsed_body['status']['code']
    response.parsed_body['data'].each do |public_relation|
      assert_not public_relation.key?('imgur_deletehash')
    end
  end

  test 'should create public_relation with imgur_deletehash' do
    assert_difference('PublicRelation.count') do
      post public_relations_url,
           params: {
             group_id: groups(:one).id,
             picture_name: 'new_public_relation.png',
             picture_path: 'https://i.imgur.com/new-public-relation.png',
             imgur_deletehash: 'new-public-relation-deletehash',
             blurb: 'new blurb',
             is_announcement_requested: true
           },
           headers: auth_headers,
           as: :json
    end

    assert_response :success
    assert_equal 201, response.parsed_body['status']['code']
    assert_equal 'new-public-relation-deletehash', PublicRelation.order(:id).last.imgur_deletehash
  end

  test 'should show public_relation without imgur_deletehash' do
    @public_relation.update!(imgur_deletehash: 'show-deletehash')

    get public_relation_url(@public_relation), headers: auth_headers, as: :json

    assert_response :success
    assert_equal 200, response.parsed_body['status']['code']
    assert_not response.parsed_body['data'].key?('imgur_deletehash')
  end

  test 'should update public_relation with new imgur_deletehash' do
    ImgurImageDeleter.stub(:call, ->(_deletehash) { true }) do
      patch public_relation_url(@public_relation),
            params: {
              group_id: @public_relation.group_id,
              picture_name: 'updated_public_relation.png',
              picture_path: 'https://i.imgur.com/updated-public-relation.png',
              imgur_deletehash: 'updated-public-relation-deletehash',
              blurb: 'updated blurb',
              is_announcement_requested: false
            },
            headers: auth_headers,
            as: :json
    end

    assert_response :success
    assert_equal 200, response.parsed_body['status']['code']
    assert_equal 'updated-public-relation-deletehash', @public_relation.reload.imgur_deletehash
  end

  test 'should delete old imgur image when public_relation picture_path changes' do
    @public_relation.update!(
      picture_path: 'https://i.imgur.com/old-public-relation.png',
      imgur_deletehash: 'old-public-relation-deletehash'
    )
    deletehashes = []

    ImgurImageDeleter.stub(:call, lambda { |deletehash|
      deletehashes << deletehash
      true
    }) do
      patch public_relation_url(@public_relation),
            params: {
              group_id: @public_relation.group_id,
              picture_name: @public_relation.picture_name,
              picture_path: 'https://i.imgur.com/new-public-relation.png',
              imgur_deletehash: 'new-public-relation-deletehash',
              blurb: @public_relation.blurb,
              is_announcement_requested: @public_relation.is_announcement_requested
            },
            headers: auth_headers,
            as: :json
    end

    assert_response :success
    assert_equal ['old-public-relation-deletehash'], deletehashes
  end

  test 'should destroy public_relation and delete imgur image' do
    @public_relation.update!(imgur_deletehash: 'destroy-public-relation-deletehash')
    deletehashes = []

    assert_difference('PublicRelation.count', -1) do
      ImgurImageDeleter.stub(:call, lambda { |deletehash|
        deletehashes << deletehash
        true
      }) do
        delete public_relation_url(@public_relation), headers: auth_headers, as: :json
      end
    end

    assert_response :success
    assert_equal 200, response.parsed_body['status']['code']
    assert_equal ['destroy-public-relation-deletehash'], deletehashes
  end

  test 'should destroy public_relation with nil imgur_deletehash' do
    @public_relation.update!(imgur_deletehash: nil)

    assert_difference('PublicRelation.count', -1) do
      delete public_relation_url(@public_relation), headers: auth_headers, as: :json
    end

    assert_response :success
    assert_equal 200, response.parsed_body['status']['code']
  end

  private

  def create_participant!
    Role.find_or_create_by!(id: 3) { |role| role.name = 'participant' }
    @participant = User.find_or_initialize_by(id: 1)
    @participant.update!(
      name: 'public-relation-test', email: 'public-relation-test@example.com',
      uid: 'public-relation-test@example.com', provider: 'email', role_id: 3,
      password: 'password', password_confirmation: 'password'
    )
  end

  def auth_headers
    @participant.create_new_auth_token
  end
end
