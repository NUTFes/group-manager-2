# Be sure to restart your server when you modify this file.

# Configure sensitive parameters which will be filtered from the log file.
# secretは確定情報APIのクエリパラメータで渡るため、ログに平文で残らないようマスクする
Rails.application.config.filter_parameters += %i[password secret]
