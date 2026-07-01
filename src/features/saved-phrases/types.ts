export type SavedPhrase = {
  id: string;
  text: string;
  articleId: string;
  articleSlug: string;
  articleTitle: string;
  createdAt: string;
};

export type SavedPhrasesResponse = {
  phrases: SavedPhrase[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type CreateSavedPhrasePayload = {
  articleId: string;
  text: string;
};
