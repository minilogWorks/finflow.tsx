import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Category } from "../../types";
import CategoryCard from "./CategoryCard";
import "./CategoriesView.css";
import { StorageService } from "../../services/StorageService";
import api from "../../utils/api";
import { AxiosError } from "axios";

interface CategoriesViewProps {
  categories: Category[];
}

const CategoriesView: React.FC<CategoriesViewProps> = () => {
  const categories = StorageService.getCategories();
  const [activeTab, setActiveTab] = useState<
    "all" | "expense" | "income" | "custom"
  >("all");

  useEffect(() => {
    const getCategories = async () => {
      const url = `api/categories/`;
      try {
        const res = await api.get(url);
        if (res.status === 200) {
          const categories = res.data;
          console.log({ categories });
          // setCategory(category);
        }
      } catch (err) {
        const error = err as AxiosError;
        const errorMessage = error.response?.data
          ? (error.response.data as { detail: string }).detail
          : "";

        console.error("Get Categories API Error\n", errorMessage);
      }
    };

    const getCategoryById = async (categoryId: number) => {
      const url = `api/categories/${categoryId}/`;
      try {
        const res = await api.get(url);
        if (res.status === 200) {
          const category = res.data;
          console.log({ category });
          // setCategory(category);
        }
      } catch (err) {
        const error = err as AxiosError;
        const errorMessage = error.response?.data
          ? (error.response.data as { detail: string }).detail
          : "";

        console.error("Get Category By Id API Error\n", errorMessage);
      }
    };

    const getTransactionById = async (transactionId: number) => {
      try {
        const res = await api.get(`api/transactions/${transactionId}/`);
        if (res.status === 200) {
          const transaction = res.data;
          console.log(transaction);
        }
      } catch (err) {
        const error = err as AxiosError;
        const errorMessage = error.response?.data
          ? (error.response.data as { detail: string }).detail
          : "";

        console.error("Get Transactions By ID API Error\n", errorMessage);
      }
    };

    getCategories();
    getCategoryById(1);
    getTransactionById(1);
  }, []);

  const expenseCategories = categories.filter((c) => c.type === "expense");
  const incomeCategories = categories.filter((c) => c.type === "income");
  const customCategories = categories.filter((c) => c.isCustom);

  const getFilteredCategories = () => {
    switch (activeTab) {
      case "expense":
        return expenseCategories;
      case "income":
        return incomeCategories;
      case "custom":
        return customCategories;
      default:
        return categories;
    }
  };

  return (
    <div className="categories-view">
      <div className="view-header">
        <h2>Categories</h2>
        <button className="btn-primary">
          <Plus size={18} />
          Add Category
        </button>
      </div>

      <div className="category-tabs">
        {(["all", "expense", "income", "custom"] as const).map((tab) => (
          <button
            key={tab}
            className={`category-tab ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "all" && "All Categories"}
            {tab === "expense" && `Expenses (${expenseCategories.length})`}
            {tab === "income" && `Income (${incomeCategories.length})`}
            {tab === "custom" && `Custom (${customCategories.length})`}
          </button>
        ))}
      </div>

      <div className="categories-grid">
        {getFilteredCategories().map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
};

export default CategoriesView;
