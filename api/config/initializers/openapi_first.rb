Rails.application.config.middleware.insert_before(0, OpenapiFirst::Router, spec: Rails.root.join('openapi/openapi.yaml'))
Rails.application.config.middleware.use(OpenapiFirst::RequestValidation)
# Response validation is off by default. To enable later:
# Rails.application.config.middleware.use(OpenapiFirst::ResponseValidation)
