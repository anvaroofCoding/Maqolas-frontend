export type RealtimeTag = {
  type: string;
  id?: string;
};

export type RealtimeInvalidatePayload = {
  tags: RealtimeTag[];
};

export type PlatformStatsPayload = {
  onlineNow: number;
  totalUsers: number;
};
