class AddDateToExpenses < ActiveRecord::Migration[7.2]
  def up
    add_column :expenses, :date, :date
    execute "UPDATE expenses SET date = DATE(created_at) WHERE date IS NULL"
    change_column_null :expenses, :date, false
    add_index :expenses, :date, name: 'idx_date'
  end

  def down
    remove_index :expenses, name: 'idx_date'
    remove_column :expenses, :date
  end
end
