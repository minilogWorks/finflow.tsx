import { AddCategory, Category } from "../types";
import api from "../utils/api";

export const getAllCategories = async (): Promise<Category[]> => {
  const response = await api.get("api/categories/");
  return response.data.map(
    (category: { id: number; name: string; is_custom: boolean }) => {
      const { is_custom, ...rest } = category;
      return {
        ...rest,
        isCustom: is_custom,
      };
    }
  );
};

export const getCategoryById = async (id: number): Promise<Category> => {
  const response = await api.get(`api/categories/${id}/`);
  const { is_custom, ...rest } = response.data;
  return {
    ...rest,
    isCustom: is_custom,
  };
};

export const addCategory = async (
  newCategory: AddCategory
): Promise<Category> => {
  const response = await api.post("/api/categories/", {
    ...newCategory,
    is_custom: true,
  });
  const { is_custom, ...rest } = response.data;

  return {
    isCustom: is_custom,
    ...rest,
  };
};

export const updateCategoryById = async ({
  categoryId,
  fieldsToUpdate,
}: {
  categoryId: string;
  fieldsToUpdate: Partial<Category>;
}) => {
  const response = await api.patch(`/api/categories/${categoryId}/`, {
    ...fieldsToUpdate,
  });
  const { is_custom, ...rest } = response.data;

  return {
    isCustom: is_custom,
    ...rest,
  };
};

export const deleteCategoryById = async (categoryId: string) => {
  const response = await api.delete(`/api/categories/${categoryId}/`);

  return response.data;
};
