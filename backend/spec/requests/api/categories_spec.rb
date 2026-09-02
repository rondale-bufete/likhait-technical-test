require 'rails_helper'

RSpec.describe "Api::Categories", type: :request do
  describe "GET /api/categories" do
    let!(:food) { Category.create!(name: "Food") }
    let!(:transport) { Category.create!(name: "Transport") }
    let!(:supplies) { Category.create!(name: "Supplies") }

    it "returns all categories" do
      get "/api/categories"

      expect(response).to have_http_status(:success)
      json = JSON.parse(response.body)
      expect(json.length).to eq(3)
      expect(json.map { |c| c["name"] }).to include("Food", "Transport", "Supplies")
    end

    it "returns categories in alphabetical order" do
      get "/api/categories"

      json = JSON.parse(response.body)
      expect(json.map { |c| c["name"] }).to eq([ "Food", "Supplies", "Transport" ])
    end
  end

  describe "POST /api/categories" do
    it "creates a new category" do
      expect {
        post "/api/categories", params: { category: { name: "Utilities" } }, as: :json
      }.to change(Category, :count).by(1)

      expect(response).to have_http_status(:created)
      json = JSON.parse(response.body)
      expect(json["name"]).to eq("Utilities")
    end

    it "returns error for duplicate category name" do
      Category.create!(name: "Food")

      post "/api/categories", params: { category: { name: "Food" } }, as: :json

      expect(response).to have_http_status(:unprocessable_entity)
      json = JSON.parse(response.body)
      expect(json["errors"]).to include(match(/already been taken/i))
    end

    it "returns error for empty category name" do
      post "/api/categories", params: { category: { name: "" } }, as: :json

      expect(response).to have_http_status(:unprocessable_entity)
      json = JSON.parse(response.body)
      expect(json["errors"]).to include(match(/can't be blank/i))
    end
  end

  describe "PUT /api/categories/:id" do
    let!(:food) { Category.create!(name: "Food") }

    it "updates a category" do
      put "/api/categories/#{food.id}", params: { category: { name: "Groceries" } }, as: :json

      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json["name"]).to eq("Groceries")
      expect(food.reload.name).to eq("Groceries")
    end

    it "returns error for duplicate category name" do
      Category.create!(name: "Transport")

      put "/api/categories/#{food.id}", params: { category: { name: "Transport" } }, as: :json

      expect(response).to have_http_status(:unprocessable_entity)
      json = JSON.parse(response.body)
      expect(json["errors"]).to include(match(/already been taken/i))
    end
  end

  describe "DELETE /api/categories/:id" do
    let!(:food) { Category.create!(name: "Food") }

    it "deletes a category with no expenses" do
      expect {
        delete "/api/categories/#{food.id}"
      }.to change(Category, :count).by(-1)

      expect(response).to have_http_status(:no_content)
    end

    it "returns error when deleting category with expenses" do
      expense = Expense.create!(
        category: food,
        description: "Apples",
        amount: 10.0,
        date: Date.today,
        payer_name: "User"
      )

      delete "/api/categories/#{food.id}"

      expect(response).to have_http_status(:unprocessable_entity)
      json = JSON.parse(response.body)
      expect(json["errors"][0]).to include("Cannot delete category with 1 expense")
      expect(Category.find_by(id: food.id)).to exist
    end
  end
end
