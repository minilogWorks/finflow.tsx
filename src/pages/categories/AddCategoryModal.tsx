import React, { useState, useEffect, useMemo } from "react";
import { X, Search } from "lucide-react"; // Add Search icon
import { Category, CategoryType } from "../../types";
import { categoryIcons } from "../../utils/categoryIcons";
import "./AddCategoryModal.css";

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (category: Omit<Category, "id">) => void;
  editingCategory?: Category;
}

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingCategory,
}) => {
  const [name, setName] = useState("");
  const [type, setType] = useState<CategoryType>("expense");
  const [color, setColor] = useState("#4361ee");
  const [icon, setIcon] = useState("beaker"); // Default to lab icon now
  const [searchTerm, setSearchTerm] = useState(""); // Add search state

  useEffect(() => {
    if (editingCategory) {
      setName(editingCategory.name);
      setType(editingCategory.type);
      setColor(editingCategory.color);
      setIcon(editingCategory.icon || "beaker");
    } else {
      setName("");
      setType("expense");
      setColor("#4361ee");
      setIcon("beaker"); // Default to lab icon
      setSearchTerm("");
    }
  }, [editingCategory]);

  // Filter icons based on search term
  const filteredIcons = useMemo(() => {
    if (!searchTerm.trim()) return categoryIcons;

    const term = searchTerm.toLowerCase();
    return categoryIcons.filter(
      (iconOption) =>
        iconOption.name.toLowerCase().includes(term) ||
        iconOption.label.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const categoryData: Omit<Category, "id"> = {
      name: name.trim(),
      type,
      color,
      icon,
      isCustom: true,
    };

    onSave(categoryData);
    onClose();
  };

  if (!isOpen) return null;

  const colorOptions = [
    "#4361ee",
    "#3a0ca3",
    "#7209b7",
    "#f72585",
    "#4cc9f0",
    "#4895ef",
    "#560bad",
    "#b5179e",
    "#FF6B6B",
    "#FFD166",
    "#06D6A0",
    "#118AB2",
    "#073B4C",
    "#EF476F",
    "#00B894",
    "#00CEC9",
  ];

  const selectedIcon =
    categoryIcons.find((i) => i.name === icon) || categoryIcons[0];
  const SelectedIcon = selectedIcon.component;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>{editingCategory ? "Edit Category" : "Add New Category"}</h3>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Category Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Lab Supplies, Salary, Groceries"
              required
            />
          </div>

          <div className="form-group">
            <label>Category Type</label>
            <div className="type-options">
              <button
                type="button"
                className={`type-btn ${type === "expense" ? "active" : ""}`}
                onClick={() => setType("expense")}
              >
                Expense
              </button>
              <button
                type="button"
                className={`type-btn ${type === "income" ? "active" : ""}`}
                onClick={() => setType("income")}
              >
                Income
              </button>
            </div>
          </div>

          {/* Updated Icon Selection with Search */}
          <div className="form-group">
            <label>Icon Selection</label>

            {/* Search Bar */}
            <div className="icon-search">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search icons by name or label..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              {searchTerm && (
                <button
                  type="button"
                  className="clear-search"
                  onClick={() => setSearchTerm("")}
                >
                  Clear
                </button>
              )}
            </div>

            {/* Icon Grid with Scroll */}
            <div className="icon-grid-container">
              <div className="icon-grid">
                {filteredIcons.map((iconOption) => {
                  const IconComponent = iconOption.component;
                  return (
                    <button
                      key={iconOption.name}
                      type="button"
                      className={`icon-option ${
                        icon === iconOption.name ? "selected" : ""
                      }`}
                      onClick={() => setIcon(iconOption.name)}
                      title={`${iconOption.label} (${iconOption.name})`}
                    >
                      <IconComponent size={18} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Results Count */}
            <div className="icon-results">
              <span>
                Showing {filteredIcons.length} of {categoryIcons.length} icons
                {searchTerm && ` for "${searchTerm}"`}
              </span>
            </div>

            {/* Icon Preview */}
            <div className="selected-icon-preview">
              <div
                className="icon-preview-circle"
                style={{ backgroundColor: color }}
              >
                <SelectedIcon size={20} color="white" />
              </div>
              <div className="icon-preview-info">
                <strong>{selectedIcon.label}</strong>
                <span>{selectedIcon.name}</span>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Color</label>
            <div className="color-grid">
              {colorOptions.map((colorOption) => (
                <button
                  key={colorOption}
                  type="button"
                  className={`color-option ${
                    color === colorOption ? "selected" : ""
                  }`}
                  style={{ backgroundColor: colorOption }}
                  onClick={() => setColor(colorOption)}
                  title={colorOption}
                />
              ))}
            </div>
            <div className="color-input">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
              <span>Custom: {color}</span>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {editingCategory ? "Update Category" : "Add Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategoryModal;
