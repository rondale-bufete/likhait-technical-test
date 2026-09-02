class Expense < ApplicationRecord
  belongs_to :category

  attribute :payer_name, :string, default: "User"
end
