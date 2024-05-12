class ContactPerson < ApplicationRecord
    has_many :groups, dependent: :destroy
end
