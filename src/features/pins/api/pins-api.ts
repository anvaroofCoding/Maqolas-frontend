import { baseApi } from "@/lib/store/api/base-api";
import type {
  CreatePinPayload,
  PinCommentsResponse,
  PinDetailResponse,
  PinEngagementResponse,
  PinFeedResponse,
  PinSummary,
} from "@/features/pins/types";

export const PINS_FEED_PAGE_SIZE = 24;

export const pinsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listPins: builder.query<
      PinFeedResponse,
      { page?: number; limit?: number } | void
    >({
      query: (params) => {
        const page = params?.page ?? 1;
        const limit = params?.limit ?? PINS_FEED_PAGE_SIZE;
        return `/pins/feed?page=${page}&limit=${limit}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.pins.map((pin) => ({
                type: "Pin" as const,
                id: pin.id,
              })),
              { type: "Pin", id: "LIST" },
            ]
          : [{ type: "Pin", id: "LIST" }],
    }),
    getPinBySlug: builder.query<PinDetailResponse, string>({
      query: (slug) => `/pins/slug/${encodeURIComponent(slug)}`,
      providesTags: (_r, _e, slug) => [{ type: "Pin", id: `slug-${slug}` }],
    }),
    getPinEngagement: builder.query<PinEngagementResponse, string>({
      query: (pinId) => `/pins/${pinId}/engagement`,
      providesTags: (_r, _e, pinId) => [
        { type: "Pin", id: `engagement-${pinId}` },
      ],
    }),
    togglePinLike: builder.mutation<
      { liked: boolean; likeCount: number },
      string
    >({
      query: (pinId) => ({
        url: `/pins/${pinId}/like`,
        method: "POST",
      }),
      async onQueryStarted(pinId, { dispatch, queryFulfilled }) {
        const patchEngagement = dispatch(
          pinsApi.util.updateQueryData("getPinEngagement", pinId, (draft) => {
            draft.likedByMe = !draft.likedByMe;
            draft.likeCount = Math.max(
              0,
              draft.likeCount + (draft.likedByMe ? 1 : -1),
            );
          }),
        );

        try {
          const { data } = await queryFulfilled;
          dispatch(
            pinsApi.util.updateQueryData("getPinEngagement", pinId, (draft) => {
              draft.likedByMe = data.liked;
              draft.likeCount = data.likeCount;
            }),
          );
        } catch {
          patchEngagement.undo();
        }
      },
      invalidatesTags: (_r, _e, pinId) => [
        { type: "Pin", id: pinId },
        { type: "Pin", id: "LIST" },
        { type: "Pin", id: `engagement-${pinId}` },
      ],
    }),
    getPinComments: builder.query<
      PinCommentsResponse,
      { pinId: string; page?: number; limit?: number }
    >({
      query: ({ pinId, page = 1, limit = 50 }) =>
        `/pins/${pinId}/comments?page=${page}&limit=${limit}`,
      providesTags: (_r, _e, { pinId }) => [
        { type: "PinComment", id: pinId },
      ],
    }),
    createPinComment: builder.mutation<
      { comment: PinCommentsResponse["comments"][number]; commentCount: number },
      { pinId: string; content: string; parentId?: string }
    >({
      query: ({ pinId, content, parentId }) => ({
        url: `/pins/${pinId}/comments`,
        method: "POST",
        body: { content, parentId },
      }),
      invalidatesTags: (_r, _e, { pinId }) => [
        { type: "PinComment", id: pinId },
        { type: "Pin", id: pinId },
        { type: "Pin", id: `engagement-${pinId}` },
        { type: "Pin", id: "LIST" },
      ],
    }),
    deletePinComment: builder.mutation<
      { deleted: boolean; commentCount: number },
      { pinId: string; commentId: string }
    >({
      query: ({ pinId, commentId }) => ({
        url: `/pins/${pinId}/comments/${commentId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_r, _e, { pinId }) => [
        { type: "PinComment", id: pinId },
        { type: "Pin", id: pinId },
        { type: "Pin", id: `engagement-${pinId}` },
      ],
    }),
    togglePinCommentLike: builder.mutation<
      { liked: boolean; likeCount: number },
      { pinId: string; commentId: string }
    >({
      query: ({ pinId, commentId }) => ({
        url: `/pins/${pinId}/comments/${commentId}/like`,
        method: "POST",
      }),
      invalidatesTags: (_r, _e, { pinId }) => [
        { type: "PinComment", id: pinId },
      ],
    }),
    createPin: builder.mutation<{ pin: PinSummary }, CreatePinPayload>({
      query: ({ image, title, description, width, height }) => {
        const formData = new FormData();
        formData.append("image", image);
        if (title) formData.append("title", title);
        if (description) formData.append("description", description);
        if (width) formData.append("width", String(width));
        if (height) formData.append("height", String(height));

        return {
          url: "/pins",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: [{ type: "Pin", id: "LIST" }],
    }),
  }),
});

export const {
  useListPinsQuery,
  useLazyListPinsQuery,
  useGetPinBySlugQuery,
  useGetPinEngagementQuery,
  useTogglePinLikeMutation,
  useGetPinCommentsQuery,
  useCreatePinCommentMutation,
  useDeletePinCommentMutation,
  useTogglePinCommentLikeMutation,
  useCreatePinMutation,
} = pinsApi;
