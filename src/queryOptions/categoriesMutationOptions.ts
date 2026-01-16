import { mutationOptions } from "@tanstack/react-query";
import {
  addCategory,
  updateCategoryById,
  deleteCategoryById,
} from "../api/categories";

export const addCategoryMutationOptions = () => {
  return mutationOptions({
    mutationKey: ["add-category"],
    mutationFn: addCategory,
  });
};

export const editCategoryMutationOptions = () => {
  return mutationOptions({
    mutationKey: ["edit-category"],
    mutationFn: updateCategoryById,
  });
};

export const deleteCategoryMutationOptions = () => {
  return mutationOptions({
    mutationKey: ["delete-category"],
    mutationFn: deleteCategoryById,
  });
};
