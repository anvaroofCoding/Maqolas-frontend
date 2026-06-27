import { baseApi } from "@/lib/store/api/base-api";
import type { CategoriesResponse } from "@/features/categories/types";

export const categoriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listCategories: builder.query<CategoriesResponse, void>({
      query: () => "/categories",
      providesTags: [{ type: "Category", id: "LIST" }],
      keepUnusedDataFor: 300,
    }),
  }),
});

export const { useListCategoriesQuery } = categoriesApi;
