import React, { useState } from "react";
import { X, Calendar, Tag, Search } from "lucide-react";
import { Category } from "../../types";
import "./FilterModal.css";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onApplyFilters: (filters: FilterState) => void;
}

interface FilterState {
  month: string;
  year: string;
  categoryId: string;
  description: string;
}

const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  categories,
  onApplyFilters,
}) => {
  const [filters, setFilters] = useState<FilterState>({
    month: "",
    year: "",
    categoryId: "",
    description: "",
  });

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  const months = [
    { value: "", label: "All Months" },
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApplyFilters(filters);
    onClose();
  };

  const handleClear = () => {
    setFilters({
      month: "",
      year: "",
      categoryId: "",
      description: "",
    });
    onApplyFilters({
      month: "",
      year: "",
      categoryId: "",
      description: "",
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="filter-modal-overlay" onClick={onClose}>
      <div className="filter-modal" onClick={(e) => e.stopPropagation()}>
        <div className="filter-modal-header">
          <h3>Filter Transactions</h3>
          <button className="btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="filter-form">
          <div className="filter-group">
            <label htmlFor="description">
              <Search size={16} />
              Description
            </label>
            <input
              type="text"
              id="description"
              name="description"
              placeholder="Search in description..."
              value={filters.description}
              onChange={handleChange}
            />
          </div>

          <div className="filter-row">
            <div className="filter-group">
              <label htmlFor="month">
                <Calendar size={16} />
                Month
              </label>
              <select
                id="month"
                name="month"
                value={filters.month}
                onChange={handleChange}
              >
                {months.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="year">Year</label>
              <select
                id="year"
                name="year"
                value={filters.year}
                onChange={handleChange}
              >
                <option value="">All Years</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="filter-group">
            <label htmlFor="category">
              <Tag size={16} />
              Category
            </label>
            <select
              id="categoryId"
              name="categoryId"
              value={filters.categoryId}
              onChange={handleChange}
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={handleClear}
            >
              Clear Filters
            </button>
            <button type="submit" className="btn-primary">
              Apply Filters
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FilterModal;
