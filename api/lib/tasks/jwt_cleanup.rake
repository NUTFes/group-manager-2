# lib/tasks/jwt_cleanup.rake
namespace :jwt do
  desc 'Remove expired JWT denylist entries'
  task cleanup: :environment do
    JwtDenylist.where('exp < ?', Time.current).delete_all
  end
end
