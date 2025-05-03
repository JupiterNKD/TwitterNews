// Twitter API response types

export interface TwitterUser {
  id: string;
  name: string;
  username: string;
  profile_image_url: string;
}

export interface TwitterMedia {
  media_key: string;
  type: string;
  url: string;
  preview_image_url?: string;
}

export interface TwitterTweet {
  id: string;
  text: string;
  created_at: string;
  public_metrics: {
    retweet_count: number;
    reply_count: number;
    like_count: number;
    quote_count: number;
  };
  attachments?: {
    media_keys: string[];
  };
}

export interface TwitterApiResponse {
  data: TwitterTweet[];
  includes?: {
    users: TwitterUser[];
    media: TwitterMedia[];
  };
  meta: {
    result_count: number;
    next_token?: string;
  };
}

// App-specific tweet model
export interface Tweet {
  id: string;
  username: string;
  handle: string;
  profileImage: string;
  content: string;
  timestamp: string;
  likes: number;
  retweets: number;
  comments: number;
  media?: string[];
  isFromMainAccount: boolean;
}
