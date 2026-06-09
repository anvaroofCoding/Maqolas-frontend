import { baseApi } from "@/lib/store/api/base-api";
import type {
  CreateWelcomePromoPayload,
  UpdateWelcomePromoPayload,
  WelcomePromo,
  WelcomePromoCommentsResponse,
  WelcomePromoModerationCommentsResponse,
  WelcomePromoResponse,
  WelcomePromosResponse,
} from "@/features/welcome-promo/types";

function buildPromoFormData(payload: {
  image?: File;
  title?: string;
  description?: string;
  linkUrl?: string;
  linkLabel?: string;
  isActive?: boolean;
}) {
  const formData = new FormData();
  if (payload.image) {
    formData.append("image", payload.image);
  }
  if (payload.title !== undefined) {
    formData.append("title", payload.title);
  }
  if (payload.description !== undefined) {
    formData.append("description", payload.description);
  }
  if (payload.linkUrl !== undefined) {
    formData.append("linkUrl", payload.linkUrl);
  }
  if (payload.linkLabel !== undefined) {
    formData.append("linkLabel", payload.linkLabel);
  }
  if (payload.isActive !== undefined) {
    formData.append("isActive", String(payload.isActive));
  }
  return formData;
}

export const welcomePromoApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getActiveWelcomePromo: builder.query<WelcomePromoResponse, void>({
      query: () => "/welcome-promo/active",
      providesTags: [{ type: "WelcomePromo", id: "ACTIVE" }],
    }),
    getAdminWelcomePromos: builder.query<WelcomePromosResponse, void>({
      query: () => "/admin/welcome-promo",
      providesTags: [{ type: "WelcomePromo", id: "ADMIN" }],
    }),
    createWelcomePromo: builder.mutation<
      { promo: WelcomePromo },
      CreateWelcomePromoPayload
    >({
      query: (payload) => ({
        url: "/admin/welcome-promo",
        method: "POST",
        body: buildPromoFormData(payload),
      }),
      invalidatesTags: [
        { type: "WelcomePromo", id: "ADMIN" },
        { type: "WelcomePromo", id: "ACTIVE" },
      ],
    }),
    updateWelcomePromo: builder.mutation<
      { promo: WelcomePromo },
      UpdateWelcomePromoPayload
    >({
      query: ({ id, ...payload }) => ({
        url: `/admin/welcome-promo/${id}`,
        method: "PATCH",
        body: buildPromoFormData(payload),
      }),
      invalidatesTags: [
        { type: "WelcomePromo", id: "ADMIN" },
        { type: "WelcomePromo", id: "ACTIVE" },
      ],
    }),
    deleteWelcomePromo: builder.mutation<{ deleted: boolean }, string>({
      query: (id) => ({
        url: `/admin/welcome-promo/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: "WelcomePromo", id: "ADMIN" },
        { type: "WelcomePromo", id: "ACTIVE" },
      ],
    }),
    getWelcomePromoComments: builder.query<
      WelcomePromoCommentsResponse,
      { promoId: string; page?: number; limit?: number }
    >({
      query: ({ promoId, page = 1, limit = 50 }) =>
        `/welcome-promo/${promoId}/comments?page=${page}&limit=${limit}`,
      providesTags: (_result, _error, { promoId }) => [
        { type: "WelcomePromoComment", id: promoId },
      ],
    }),
    createWelcomePromoComment: builder.mutation<
      { comment: WelcomePromoCommentsResponse["comments"][0]; pending?: boolean },
      { promoId: string; content: string; parentId?: string }
    >({
      query: ({ promoId, content, parentId }) => ({
        url: `/welcome-promo/${promoId}/comments`,
        method: "POST",
        body: { content, parentId },
      }),
      invalidatesTags: (_result, _error, { promoId }) => [
        { type: "WelcomePromoComment", id: promoId },
      ],
    }),
    deleteWelcomePromoComment: builder.mutation<
      { deleted: boolean; commentCount: number },
      { promoId: string; commentId: string }
    >({
      query: ({ promoId, commentId }) => ({
        url: `/welcome-promo/${promoId}/comments/${commentId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { promoId }) => [
        { type: "WelcomePromoComment", id: promoId },
      ],
    }),
    toggleWelcomePromoCommentLike: builder.mutation<
      { liked: boolean; likeCount: number },
      { promoId: string; commentId: string }
    >({
      query: ({ promoId, commentId }) => ({
        url: `/welcome-promo/${promoId}/comments/${commentId}/like`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, { promoId }) => [
        { type: "WelcomePromoComment", id: promoId },
      ],
    }),
    getAdminWelcomePromoComments: builder.query<
      WelcomePromoModerationCommentsResponse,
      { status?: string; page?: number; limit?: number }
    >({
      query: ({ status = "pending", page = 1, limit = 20 }) =>
        `/admin/welcome-promo/comments?status=${status}&page=${page}&limit=${limit}`,
      providesTags: [{ type: "WelcomePromoComment", id: "MODERATION" }],
    }),
    approveWelcomePromoComments: builder.mutation<
      { approved: number },
      { commentIds: string[] }
    >({
      query: (body) => ({
        url: "/admin/welcome-promo/comments/approve",
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "WelcomePromoComment", id: "MODERATION" },
        { type: "WelcomePromo", id: "ACTIVE" },
      ],
    }),
    rejectWelcomePromoComments: builder.mutation<
      { rejected: number },
      { commentIds: string[]; reason?: string }
    >({
      query: (body) => ({
        url: "/admin/welcome-promo/comments/reject",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "WelcomePromoComment", id: "MODERATION" }],
    }),
    deleteWelcomePromoComments: builder.mutation<
      { deleted: number },
      { commentIds: string[] }
    >({
      query: (body) => ({
        url: "/admin/welcome-promo/comments/delete",
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "WelcomePromoComment", id: "MODERATION" },
        { type: "WelcomePromo", id: "ACTIVE" },
      ],
    }),
  }),
});

export const {
  useGetActiveWelcomePromoQuery,
  useGetAdminWelcomePromosQuery,
  useCreateWelcomePromoMutation,
  useUpdateWelcomePromoMutation,
  useDeleteWelcomePromoMutation,
  useGetWelcomePromoCommentsQuery,
  useCreateWelcomePromoCommentMutation,
  useDeleteWelcomePromoCommentMutation,
  useToggleWelcomePromoCommentLikeMutation,
  useGetAdminWelcomePromoCommentsQuery,
  useApproveWelcomePromoCommentsMutation,
  useRejectWelcomePromoCommentsMutation,
  useDeleteWelcomePromoCommentsMutation,
} = welcomePromoApi;
