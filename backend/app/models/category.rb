class Category < ApplicationRecord
  has_many :expenses, dependent: :destroy

  validates :name, presence: true, uniqueness: { case_sensitive: false }

  before_validation do
    self.name = name.to_s.strip
  end
end
