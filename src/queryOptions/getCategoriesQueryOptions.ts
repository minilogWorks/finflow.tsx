import { queryOptions } from "@tanstack/react-query";
import { getAllCategories, getCategoryById } from "../api/categories";

export const getCategoriesQueryOptions = () => {
  return queryOptions({
    queryKey: ["categories"],
    queryFn: getAllCategories,
  });
};

export const getCategoryByIdQueryOptions = (id: number) => {
  return queryOptions({
    queryKey: ["categories", id],
    queryFn: () => getCategoryById(id),
  });
};
