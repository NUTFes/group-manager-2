# frozen_string_literal: true

require './config/environment'

Group.where(group_category_id: 1).preload(:employees, :sub_rep, user: :user_detail)
# We will just print the logic exactly as it is in the controller to see if it skips.
