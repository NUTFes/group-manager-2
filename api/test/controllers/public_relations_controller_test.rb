# frozen_string_literal: true

require 'test_helper'

class PublicRelationsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @public_relation = public_relations(:one)
  end

  test 'should get index' do
    get public_relations_url, as: :json
    assert_response :success
  end

  test 'should create public_relation' do
    assert_difference('PublicRelation.count') do
      post public_relations_url, params: { blurb: @public_relation.blurb, group_id: @public_relation.group_id, picture_path: @public_relation.picture_path }, as: :json
    end

    assert_response :success
  end

  test 'should show public_relation' do
    get public_relation_url(@public_relation), as: :json
    assert_response :success
  end

  test 'should update public_relation' do
    patch public_relation_url(@public_relation), params: { blurb: @public_relation.blurb, group_id: @public_relation.group_id, picture_path: @public_relation.picture_path }, as: :json
    assert_response :ok
  end

  test 'should destroy public_relation' do
    assert_difference('PublicRelation.count', -1) do
      delete public_relation_url(@public_relation), as: :json
    end

    assert_response :ok
  end

  test 'should not create public_relation with invalid params' do
    assert_no_difference('PublicRelation.count') do
      post public_relations_url, params: { group_id: nil }, as: :json
    end
    assert_response :unprocessable_entity
  end

  test 'should not show public_relation with invalid id' do
    get public_relation_url(99999), as: :json
    assert_response :not_found
  end

  test 'should not update public_relation with invalid id' do
    patch public_relation_url(99999), params: { blurb: @public_relation.blurb }, as: :json
    assert_response :not_found
  end

  test 'should not destroy public_relation with invalid id' do
    assert_no_difference('PublicRelation.count') do
      delete public_relation_url(99999), as: :json
    end
    assert_response :not_found
  end
end
