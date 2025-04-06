# frozen_string_literal: true

class ApplicationController < ActionController::API
  include DeviseTokenAuth::Concerns::SetUserByToken

  # status
  def ok
    { code: 200, message: 'Success' }
  end

  def created
    { code: 201, message: 'Created' }
  end

  def not_found
    { code: 404, message: 'Not Found' }
  end

  def internal_server_error
    { code: 500, message: 'Internal Server Error' }
  end

  def undefined
    { code: 999, message: 'Undefined' }
  end

  # 出力するAPIのフォーマット
  def fmt(status = undefined, data = [], option = '')
    # メッセージを追加したいときに使う
    status.store('option', option) if option != ''
    { status: status, data: data }
    # return { status: status, path: request.fullpath, data: data } // fullpathいるかな？
  end
end
