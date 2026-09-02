class Api::CategoriesController < ApplicationController
  def index
    categories = Category.order(:name)
    render json: categories
  end

  def create
    category = Category.new(category_params)

    if category.save
      render json: category, status: :created
    else
      render json: { errors: category.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    category = Category.find(params[:id])
    
    if category.update(category_params)
      render json: category
    else
      render json: { errors: category.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    category = Category.find(params[:id])

    if category.expenses.any?
      expense_count = category.expenses.count
      render json: { errors: ["Cannot delete category with #{expense_count} expenses"] }, status: :unprocessable_entity
    else
      category.destroy
      render status: :no_content
    end
  end

  private

  def category_params
    params.require(:category).permit(:name)
  end
end
