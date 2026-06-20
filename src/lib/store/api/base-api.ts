import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "@/lib/store/api/base-query-with-reauth";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Article",
    "ArticleRequest",
    "Category",
    "User",
    "UserProfile",
    "Admin",
    "Comment",
    "Banner",
    "Notification",
    "WelcomePromo",
    "WelcomePromoComment",
    "AiArticle",
    "AuthUser",
  ],
  endpoints: () => ({}),
});
