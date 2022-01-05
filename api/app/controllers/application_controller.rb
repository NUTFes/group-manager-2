class ApplicationController < ActionController::API
  include DeviseTokenAuth::Concerns::SetUserByToken
  
  # status
  def ok; return { code: 200, message: 'Success' } end
  def created; return { code: 201, message: 'Created'} end
  def not_found; return { code: 404, message: 'Not Found' } end
  def internal_server_error; return { code: 500, message: 'Internal Server Error' } end
  def undefined; return { code: 999, message: 'Undefined' } end

  # 出力するAPIのフォーマット
  def fmt(status=undefined, data=[], option="")
    # メッセージを追加したいときに使う
    if option != ""
      status.store("option", option)
    end
    return { status: status, data: data }
    #return { status: status, path: request.fullpath, data: data } // fullpathいるかな？
  end
end
