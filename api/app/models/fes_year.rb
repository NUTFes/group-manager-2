class FesYear < ApplicationRecord
    has_many :groups
    has_many :fes_dates
end
