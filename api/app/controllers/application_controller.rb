class ApplicationController < ActionController::API
  include DeviseTokenAuth::Concerns::SetUserByToken
  
  # status
  def ok; return { code: 200, message: 'success' } end
  def not_found; return { code: 404, message: 'Not Found' } end
  def internal_server_error; return { code: 500, message: 'Internal Server Error' } end
  def undefined; return { code: 999, message: 'undefined' } end

  # 出力するAPIのフォーマット
  def fmt(status=undefined, data=[])
    return { status: status, path: request.fullpath, data: data }
  end
end
