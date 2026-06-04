import { baseApi } from "@/lib/store/api/base-api";

export type Article = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
};

export const articlesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getArticles: builder.query<Article[], void>({
      query: () => "/articles",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Article" as const, id })),
              { type: "Article", id: "LIST" },
            ]
          : [{ type: "Article", id: "LIST" }],
    }),
    getArticleBySlug: builder.query<Article, string>({
      query: (slug) => `/articles/${slug}`,
      providesTags: (_result, _error, slug) => [{ type: "Article", id: slug }],
    }),
  }),
});

export const { useGetArticlesQuery, useGetArticleBySlugQuery } = articlesApi;
