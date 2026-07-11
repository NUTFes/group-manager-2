# frozen_string_literal: true

require 'test_helper'
require 'minitest/mock'

class VenueMapsControllerTest < ActionDispatch::IntegrationTest
  self.fixture_table_names = %w[groups]

  setup do
    HealthCenterSubmissionStatus.delete_all
    VenueMap.delete_all
    @venue_map = VenueMap.create!(
      group_id: groups(:one).id,
      picture_name: 'venue_map.png',
      picture_path: 'https://i.imgur.com/venue-map.png'
    )
  end

  test 'should get index without imgur_deletehash' do
    @venue_map.update!(imgur_deletehash: 'index-deletehash')

    get venue_maps_url, as: :json

    assert_response :success
    assert_equal 200, response.parsed_body['status']['code']
    response.parsed_body['data'].each do |venue_map|
      assert_not venue_map.key?('imgur_deletehash')
    end
  end

  test 'should create venue_map with imgur_deletehash' do
    assert_difference('VenueMap.count') do
      post venue_maps_url,
           params: {
             group_id: groups(:two).id,
             picture_name: 'new_venue_map.png',
             picture_path: 'https://i.imgur.com/new-venue-map.png',
             imgur_deletehash: 'new-venue-map-deletehash'
           },
           as: :json
    end

    assert_response :success
    assert_equal 201, response.parsed_body['status']['code']
    assert_equal 'new-venue-map-deletehash', VenueMap.order(:id).last.imgur_deletehash
  end

  test 'should show venue_map without imgur_deletehash' do
    @venue_map.update!(imgur_deletehash: 'show-deletehash')

    get venue_map_url(@venue_map), as: :json

    assert_response :success
    assert_equal 200, response.parsed_body['status']['code']
    assert_not response.parsed_body['data'].key?('imgur_deletehash')
  end

  test 'should update venue_map with new imgur_deletehash' do
    patch venue_map_url(@venue_map),
          params: {
            group_id: @venue_map.group_id,
            picture_name: 'updated_venue_map.png',
            picture_path: 'https://i.imgur.com/updated-venue-map.png',
            imgur_deletehash: 'updated-venue-map-deletehash'
          },
          as: :json

    assert_response :success
    assert_equal 201, response.parsed_body['status']['code']
    assert_equal 'updated-venue-map-deletehash', @venue_map.reload.imgur_deletehash
  end

  test 'should delete old imgur image when venue_map picture_path changes' do
    @venue_map.update!(
      picture_path: 'https://i.imgur.com/old-venue-map.png',
      imgur_deletehash: 'old-venue-map-deletehash'
    )
    deletehashes = []

    ImgurImageDeleter.stub(:call, lambda { |deletehash|
      deletehashes << deletehash
      true
    }) do
      patch venue_map_url(@venue_map),
            params: {
              group_id: @venue_map.group_id,
              picture_name: @venue_map.picture_name,
              picture_path: 'https://i.imgur.com/new-venue-map.png',
              imgur_deletehash: 'new-venue-map-deletehash'
            },
            as: :json
    end

    assert_response :success
    assert_equal ['old-venue-map-deletehash'], deletehashes
  end

  test 'should destroy venue_map and delete imgur image' do
    @venue_map.update!(imgur_deletehash: 'destroy-venue-map-deletehash')
    deletehashes = []

    assert_difference('VenueMap.count', -1) do
      ImgurImageDeleter.stub(:call, lambda { |deletehash|
        deletehashes << deletehash
        true
      }) do
        delete venue_map_url(@venue_map), as: :json
      end
    end

    assert_response :success
    assert_equal 200, response.parsed_body['status']['code']
    assert_equal ['destroy-venue-map-deletehash'], deletehashes
  end

  test 'should destroy venue_map with nil imgur_deletehash' do
    @venue_map.update!(imgur_deletehash: nil)

    assert_difference('VenueMap.count', -1) do
      delete venue_map_url(@venue_map), as: :json
    end

    assert_response :success
    assert_equal 200, response.parsed_body['status']['code']
  end
end
