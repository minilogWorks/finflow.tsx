import { Category } from "../types";
import api from "../utils/api";
import { getCategoryColor, getCategoryIcon } from "../utils/formatters";

export const getAllCategories = async (): Promise<Category[]> => {
  const response = await api.get("api/categories/");
  return response.data.map(
    (category: { id: number; name: string; is_custom: boolean }) => {
      const { is_custom, name, ...rest } = category;
      return {
        ...rest,
        name,
        isCustom: is_custom,
        icon: getCategoryIcon(name),
        color: getCategoryColor(name),
      };
    }
  );
};

export const getCategoryById = async (id: number): Promise<Category> => {
  const response = await api.get(`api/categories/${id}/`);
  const { is_custom, ...rest } = response.data as {
    id: number;
    name: string;
    is_custom: boolean;
  };
  return {
    ...rest,
    isCustom: is_custom,
  };
};
