/**
 * Form component for adding/editing expenses
 */

import React, { useEffect, useState } from "react";
import { ExpenseFormData } from "../types";
import { TextField, SelectBox, Button, Modal } from "../vibes";
import { useExpenseForm } from "../hooks/useExpenseForm";
import { fetchCategories, createCategory } from "../services/api";

interface ExpenseFormProps {
  initialData?: Partial<ExpenseFormData>;
  onSubmit: (data: ExpenseFormData) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
}

export function ExpenseForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = "Add Expense",
}: ExpenseFormProps) {
  const { formData, errors, isSubmitting, handleChange, handleSubmit } =
    useExpenseForm({
      initialData,
      onSubmit,
    });
  const [categoryOptions, setCategoryOptions] = useState<
    Array<{ value: string; label: string }>
  >([]);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryError, setNewCategoryError] = useState("");
  const [isCategoryLoading, setIsCategoryLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categories = await fetchCategories();
        const options = categories.map((category) => ({
          value: category.name,
          label: category.name,
        }));
        setCategoryOptions(options);
      } catch (error) {
        console.error("Failed to load categories", error);
      } finally {
        setIsCategoryLoading(false);
      }
    };

    loadCategories();
  }, []);

  const handleCreateCategory = async () => {
    const trimmedName = newCategoryName.trim();

    if (!trimmedName) {
      setNewCategoryError("Category name is required");
      return;
    }

    try {
      const created = await createCategory(trimmedName);
      setCategoryOptions((prev) => [
        ...prev,
        { value: created.name, label: created.name },
      ]);
      handleChange("category", created.name);
      setNewCategoryName("");
      setNewCategoryError("");
      setIsAddCategoryModalOpen(false);
    } catch (error) {
      setNewCategoryError(
        error instanceof Error ? error.message : "Unable to create category",
      );
    }
  };

  const formStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  };

  const buttonGroupStyle: React.CSSProperties = {
    display: "flex",
    gap: "0.5rem",
    marginTop: "0.5rem",
  };

  return (
    <>
      <form onSubmit={handleSubmit} style={formStyle}>
      <TextField
        label="Amount"
        type="number"
        step="0.01"
        placeholder="0.00"
        value={formData.amount}
        onChange={(e) => handleChange("amount", e.target.value)}
        error={errors.amount}
        fullWidth
        required
      />

      <TextField
        label="Description"
        type="text"
        placeholder="Enter description"
        value={formData.description}
        onChange={(e) => handleChange("description", e.target.value)}
        error={errors.description}
        fullWidth
        required
      />

      <div style={{ display: "flex", gap: "0.5rem", alignItems: "flex-end" }}>
        <div style={{ flex: 1 }}>
          <SelectBox
            label="Category"
            options={categoryOptions}
            value={formData.category}
            onChange={(e) => handleChange("category", e.target.value)}
            error={errors.category}
            fullWidth
            required
          />
        </div>
        <Button
          type="button"
          variant="secondary"
          onClick={() => setIsAddCategoryModalOpen(true)}
        >
          Add Category
        </Button>
      </div>

      <TextField
        label="Date"
        type="date"
        value={formData.date}
        onChange={(e) => handleChange("date", e.target.value)}
        error={errors.date}
        fullWidth
        required
      />

      <div style={buttonGroupStyle}>
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
          fullWidth
        >
          {isSubmitting ? "Submitting..." : submitLabel}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
      </div>

      <Modal
        isOpen={isAddCategoryModalOpen}
        onClose={() => {
          setIsAddCategoryModalOpen(false);
          setNewCategoryName("");
          setNewCategoryError("");
        }}
        title="Add Category"
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <TextField
            label="Category name"
            value={newCategoryName}
            onChange={(e) => {
              setNewCategoryName(e.target.value);
              if (newCategoryError) setNewCategoryError("");
            }}
            placeholder="e.g. Groceries"
            error={newCategoryError}
            fullWidth
          />
          <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsAddCategoryModalOpen(false);
                setNewCategoryName("");
                setNewCategoryError("");
              }}
            >
              Cancel
            </Button>
            <Button type="button" variant="primary" onClick={handleCreateCategory}>
              Save Category
            </Button>
          </div>
        </div>
      </Modal>
      </form>
    </>
  );
}
