import { baseApi } from "@/lib/store/api/base-api";
import type {
  AiArticleArchiveResponse,
  AiArticleJob,
  AiArticleQuota,
} from "@/features/ai-article/types";

export const aiArticleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAiArticleQuota: builder.query<AiArticleQuota, void>({
      query: () => "/ai/articles/quota",
      providesTags: [{ type: "AiArticle", id: "QUOTA" }],
    }),
    getActiveAiArticleJob: builder.query<{ job: AiArticleJob | null }, void>({
      query: () => "/ai/articles/active",
      providesTags: [{ type: "AiArticle", id: "ACTIVE" }],
    }),
    getAiArticleJob: builder.query<{ job: AiArticleJob }, string>({
      query: (id) => `/ai/articles/${id}`,
      providesTags: (_r, _e, id) => [{ type: "AiArticle", id }],
    }),
    listAiArticleArchive: builder.query<
      AiArticleArchiveResponse,
      { page?: number; limit?: number } | void
    >({
      query: (params) => {
        const searchParams = new URLSearchParams();
        searchParams.set("page", String(params?.page ?? 1));
        searchParams.set("limit", String(params?.limit ?? 20));
        return `/ai/articles/archive?${searchParams.toString()}`;
      },
      providesTags: [{ type: "AiArticle", id: "ARCHIVE" }],
    }),
    generateAiArticle: builder.mutation<
      { job: AiArticleJob },
      { prompt: string }
    >({
      query: (body) => ({
        url: "/ai/articles/generate",
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "AiArticle", id: "QUOTA" },
        { type: "AiArticle", id: "ACTIVE" },
        { type: "AiArticle", id: "ARCHIVE" },
        { type: "Article", id: "MINE" },
      ],
    }),
  }),
});

export const {
  useGetAiArticleQuotaQuery,
  useGetActiveAiArticleJobQuery,
  useGetAiArticleJobQuery,
  useListAiArticleArchiveQuery,
  useGenerateAiArticleMutation,
  useLazyGetAiArticleJobQuery,
} = aiArticleApi;
