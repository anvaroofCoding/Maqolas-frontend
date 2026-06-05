export interface PromoBanner {
  id: string;
  title?: string;
  imageUrl: string;
  linkUrl: string;
  isActive: boolean;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface BannersResponse {
  banners: PromoBanner[];
}

export interface CreateBannerPayload {
  title?: string;
  linkUrl: string;
  isActive?: boolean;
  sortOrder?: number;
  image: File;
}

export interface UpdateBannerPayload {
  id: string;
  title?: string;
  linkUrl?: string;
  isActive?: boolean;
  sortOrder?: number;
  image?: File;
}
