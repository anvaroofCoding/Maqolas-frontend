import { baseApi } from "@/lib/store/api/base-api";
import type {
  BannersResponse,
  CreateBannerPayload,
  PromoBanner,
  UpdateBannerPayload,
} from "@/features/banners/types";

function buildBannerFormData(payload: {
  image?: File;
  linkUrl?: string;
  title?: string;
  isActive?: boolean;
  sortOrder?: number;
}) {
  const formData = new FormData();
  if (payload.image) {
    formData.append("image", payload.image);
  }
  if (payload.linkUrl) {
    formData.append("linkUrl", payload.linkUrl);
  }
  if (payload.title !== undefined) {
    formData.append("title", payload.title);
  }
  if (payload.isActive !== undefined) {
    formData.append("isActive", String(payload.isActive));
  }
  if (payload.sortOrder !== undefined) {
    formData.append("sortOrder", String(payload.sortOrder));
  }
  return formData;
}

export const bannersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBanners: builder.query<BannersResponse, void>({
      query: () => "/banners",
      providesTags: [{ type: "Banner", id: "ACTIVE" }],
    }),
    getAdminBanners: builder.query<BannersResponse, void>({
      query: () => "/admin/banners",
      providesTags: [{ type: "Banner", id: "ADMIN" }],
    }),
    createBanner: builder.mutation<{ banner: PromoBanner }, CreateBannerPayload>(
      {
        query: (payload) => ({
          url: "/admin/banners",
          method: "POST",
          body: buildBannerFormData(payload),
        }),
        invalidatesTags: [
          { type: "Banner", id: "ADMIN" },
          { type: "Banner", id: "ACTIVE" },
        ],
      },
    ),
    updateBanner: builder.mutation<{ banner: PromoBanner }, UpdateBannerPayload>(
      {
        query: ({ id, ...payload }) => ({
          url: `/admin/banners/${id}`,
          method: "PATCH",
          body: buildBannerFormData(payload),
        }),
        invalidatesTags: [
          { type: "Banner", id: "ADMIN" },
          { type: "Banner", id: "ACTIVE" },
        ],
      },
    ),
    deleteBanner: builder.mutation<{ deleted: boolean }, string>({
      query: (id) => ({
        url: `/admin/banners/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: "Banner", id: "ADMIN" },
        { type: "Banner", id: "ACTIVE" },
      ],
    }),
  }),
});

export const {
  useGetBannersQuery,
  useGetAdminBannersQuery,
  useCreateBannerMutation,
  useUpdateBannerMutation,
  useDeleteBannerMutation,
} = bannersApi;
