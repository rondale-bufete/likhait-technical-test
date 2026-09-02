import React, { useState, useEffect } from "react";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services/api";
import { Modal, Button, TextField } from "../vibes";
import { COLORS } from "../constants/colors";

interface Category {
  id: number;
  name: string;
}

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Edit modal state
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingName, setEditingName] = useState("");
  const [editError, setEditError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Delete confirmation state
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Add category modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [addError, setAddError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // Load categories on mount
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchCategories();
      setCategories(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (category: Category) => {
    setEditingCategory(category);
    setEditingName(category.name);
    setEditError(null);
  };

  const handleSaveEdit = async () => {
    const trimmedName = editingName.trim();

    if (!trimmedName) {
      setEditError("Category name is required");
      return;
    }

    try {
      setIsSaving(true);
      setEditError(null);
      await updateCategory(editingCategory!.id, trimmedName);
      setEditingCategory(null);
      setEditingName("");
      await loadCategories();
    } catch (err) {
      setEditError(
        err instanceof Error ? err.message : "Failed to update category"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteClick = (category: Category) => {
    setDeletingCategory(category);
    setDeleteError(null);
  };

  const handleConfirmDelete = async () => {
    try {
      setIsDeleting(true);
      setDeleteError(null);
      await deleteCategory(deletingCategory!.id);
      setDeletingCategory(null);
      await loadCategories();
    } catch (err) {
      setDeleteError(
        err instanceof Error ? err.message : "Failed to delete category"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAddCategory = async () => {
    const trimmedName = newCategoryName.trim();

    if (!trimmedName) {
      setAddError("Category name is required");
      return;
    }

    try {
      setIsAdding(true);
      setAddError(null);
      await createCategory(trimmedName);
      setNewCategoryName("");
      setIsAddModalOpen(false);
      await loadCategories();
    } catch (err) {
      setAddError(
        err instanceof Error ? err.message : "Failed to add category"
      );
    } finally {
      setIsAdding(false);
    }
  };

  const pageStyle: React.CSSProperties = {
    padding: "48px 64px",
    minHeight: "100vh",
    background: COLORS.secondary.s01,
  };

  const titleStyle: React.CSSProperties = {
    fontSize: "40px",
    fontWeight: 700,
    color: COLORS.secondary.s10,
    margin: 0,
    marginBottom: "8px",
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: "16px",
    color: COLORS.secondary.s07,
    marginBottom: "24px",
  };

  const errorStyle: React.CSSProperties = {
    padding: "12px 16px",
    background: "#fee",
    border: `1px solid #fcc`,
    borderRadius: "8px",
    color: "#c00",
    marginBottom: "24px",
    fontSize: "14px",
  };

  const loadingStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "48px",
    fontSize: "16px",
    color: COLORS.secondary.s08,
  };

  const tableStyle: React.CSSProperties = {
    width: "100%",
    borderCollapse: "collapse",
    border: `1px solid ${COLORS.secondary.s04}`,
    borderRadius: "8px",
    overflow: "hidden",
    background: "white",
  };

  const theadStyle: React.CSSProperties = {
    background: COLORS.secondary.s02,
    borderBottom: `1px solid ${COLORS.secondary.s04}`,
  };

  const thStyle: React.CSSProperties = {
    padding: "16px",
    textAlign: "left",
    fontWeight: 600,
    color: COLORS.secondary.s09,
    fontSize: "14px",
  };

  const tbodyRowStyle: React.CSSProperties = {
    borderBottom: `1px solid ${COLORS.secondary.s04}`,
    transition: "background 0.2s",
  };

  const tdStyle: React.CSSProperties = {
    padding: "16px",
    color: COLORS.secondary.s10,
    fontSize: "14px",
  };

  const actionsStyle: React.CSSProperties = {
    display: "flex",
    gap: "8px",
    justifyContent: "flex-end",
  };

  const emptyStateStyle: React.CSSProperties = {
    textAlign: "center",
    padding: "48px 24px",
    color: COLORS.secondary.s08,
    fontSize: "16px",
  };

  const headerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "32px",
  };

  if (loading) {
    return (
      <div style={pageStyle}>
        <h1 style={titleStyle}>Categories</h1>
        <div style={loadingStyle}>Loading categories...</div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <div>
          <h1 style={titleStyle}>Categories</h1>
          <p style={subtitleStyle}>Manage your expense categories</p>
        </div>
        <Button variant="primary" onClick={() => setIsAddModalOpen(true)}>
          Add Category
        </Button>
      </div>

      {error && <div style={errorStyle}>{error}</div>}

      {categories.length === 0 ? (
        <div style={emptyStateStyle}>
          <p>No categories yet. Create your first category from the expense form.</p>
        </div>
      ) : (
        <table style={tableStyle}>
          <thead style={theadStyle}>
            <tr>
              <th style={thStyle}>Name</th>
              <th style={{ ...thStyle, textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id} style={tbodyRowStyle}>
                <td style={tdStyle}>{category.name}</td>
                <td style={{ ...tdStyle, textAlign: "right" }}>
                  <div style={actionsStyle}>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => handleEditClick(category)}
                    >
                      Edit
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => handleDeleteClick(category)}
                      style={{
                        background: "#fee",
                        color: "#c00",
                        border: "1px solid #fcc",
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Edit Modal */}
      <Modal
        isOpen={editingCategory !== null}
        onClose={() => {
          setEditingCategory(null);
          setEditingName("");
          setEditError(null);
        }}
        title="Edit Category"
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <TextField
            label="Category name"
            value={editingName}
            onChange={(e) => {
              setEditingName(e.target.value);
              if (editError) setEditError(null);
            }}
            placeholder="e.g. Groceries"
            error={editError || ""}
            fullWidth
          />
          <div
            style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}
          >
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setEditingCategory(null);
                setEditingName("");
                setEditError(null);
              }}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={handleSaveEdit}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deletingCategory !== null}
        onClose={() => {
          setDeletingCategory(null);
          setDeleteError(null);
        }}
        title="Delete Category"
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <p>
            Are you sure you want to delete <strong>{deletingCategory?.name}</strong>?
          </p>
          {deleteError && (
            <div
              style={{
                padding: "12px 16px",
                background: "#fee",
                border: "1px solid #fcc",
                borderRadius: "4px",
                color: "#c00",
                fontSize: "14px",
              }}
            >
              {deleteError}
            </div>
          )}
          <div
            style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}
          >
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setDeletingCategory(null);
                setDeleteError(null);
              }}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              style={{
                background: "#fee",
                color: "#c00",
                border: "1px solid #fcc",
              }}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Add Category Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setNewCategoryName("");
          setAddError(null);
        }}
        title="Add Category"
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <TextField
            label="Category name"
            value={newCategoryName}
            onChange={(e) => {
              setNewCategoryName(e.target.value);
              if (addError) setAddError(null);
            }}
            placeholder="e.g. Groceries"
            error={addError || ""}
            fullWidth
          />
          <div
            style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}
          >
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsAddModalOpen(false);
                setNewCategoryName("");
                setAddError(null);
              }}
              disabled={isAdding}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={handleAddCategory}
              disabled={isAdding}
            >
              {isAdding ? "Adding..." : "Add Category"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CategoriesPage;
