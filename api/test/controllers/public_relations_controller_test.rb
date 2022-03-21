require "test_helper"

class PublicRelationsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @public_relation = public_relations(:one)
  end

  test "should get index" do
    get public_relations_url, as: :json
    assert_response :success
  end

  test "should create public_relation" do
    assert_difference('PublicRelation.count') do
      post public_relations_url, params: { public_relation: { blurb: @public_relation.blurb, group_id: @public_relation.group_id, picture_path: @public_relation.picture_path } }, as: :json
    end

    assert_response 201
  end

  test "should show public_relation" do
    get public_relation_url(@public_relation), as: :json
    assert_response :success
  end

  test "should update public_relation" do
    patch public_relation_url(@public_relation), params: { public_relation: { blurb: @public_relation.blurb, group_id: @public_relation.group_id, picture_path: @public_relation.picture_path } }, as: :json
    assert_response 200
  end

  test "should destroy public_relation" do
    assert_difference('PublicRelation.count', -1) do
      delete public_relation_url(@public_relation), as: :json
    end

    assert_response 204
  end
end
