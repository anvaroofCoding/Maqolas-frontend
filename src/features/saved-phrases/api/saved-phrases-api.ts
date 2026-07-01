import { baseApi } from "@/lib/store/api/base-api";
import type {
  CreateSavedPhrasePayload,
  SavedPhrase,
  SavedPhrasesResponse,
} from "@/features/saved-phrases/types";

type ListQuery = {
  page?: number;
  limit?: number;
};

export const savedPhrasesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listSavedPhrases: builder.query<SavedPhrasesResponse, ListQuery | void>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params?.page) searchParams.set("page", String(params.page));
        if (params?.limit) searchParams.set("limit", String(params.limit));
        const query = searchParams.toString();
        return `/saved-phrases${query ? `?${query}` : ""}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.phrases.map((phrase) => ({
                type: "SavedPhrase" as const,
                id: phrase.id,
              })),
              { type: "SavedPhrase", id: "LIST" },
            ]
          : [{ type: "SavedPhrase", id: "LIST" }],
    }),
    createSavedPhrase: builder.mutation<SavedPhrase, CreateSavedPhrasePayload>({
      query: (body) => ({
        url: "/saved-phrases",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "SavedPhrase", id: "LIST" }],
    }),
    deleteSavedPhrase: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/saved-phrases/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "SavedPhrase", id },
        { type: "SavedPhrase", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useListSavedPhrasesQuery,
  useCreateSavedPhraseMutation,
  useDeleteSavedPhraseMutation,
} = savedPhrasesApi;
