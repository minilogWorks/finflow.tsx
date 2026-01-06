import { Category } from "../types";
import api from "../utils/api";

export const getAllCategories = async (): Promise<Category[]> => {
  const response = await api.get("api/categories/");
  return response.data;
};

export const getCategoryById = async (id: number): Promise<Category> => {
  const response = await api.get(`api/categories/${id}/`);
  return response.data;
};
