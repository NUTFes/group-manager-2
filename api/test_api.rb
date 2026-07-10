group = Group.first
controller = FireEquipmentOrdersController.new
request = ActionDispatch::TestRequest.create
request.env['REQUEST_METHOD'] = 'PATCH'
controller.request = request
controller.params = ActionController::Parameters.new({
  group_id: group.id,
  use_fire_equipment: false
})
controller.instance_variable_set(:@_current_api_user, group.user)
controller.send(:submit)
File.write("test_output.txt", controller.response.body)
