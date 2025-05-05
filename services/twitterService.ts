import { Tweet } from "../types/twitter";

// Extract Twitter handle from URL
export const extractHandleFromUrl = (url: string): string | null => {
  try {
    // For URLs like https://x.com/sportingcp?s=21&t=w1LNzbwfMeurEBhTVE-b-Q
    // We need to extract 'sportingcp'

    // First check if it's a valid URL
    if (!url || (!url.includes("x.com/") && !url.includes("twitter.com/"))) {
      return null;
    }

    // Extract the part after x.com/ or twitter.com/
    let handle = "";
    if (url.includes("x.com/")) {
      handle = url.split("x.com/")[1];
    } else if (url.includes("twitter.com/")) {
      handle = url.split("twitter.com/")[1];
    }

    // Remove any query parameters or additional path segments
    if (handle.includes("?")) {
      handle = handle.split("?")[0];
    }
    if (handle.includes("/")) {
      handle = handle.split("/")[0];
    }

    return handle || null;
  } catch (error) {
    console.error("Error extracting handle from URL:", error);
    return null;
  }
};

// Function to generate realistic mock tweets for a handle
export const fetchTweetsForHandle = async (
  handle: string,
  isMainAccount: boolean,
  count: number = 10,
): Promise<Tweet[]> => {
  console.log(
    `Generating tweets for handle: ${handle}, isMainAccount: ${isMainAccount}`,
  );

  try {
    // In a real app, this would be an API call to Twitter
    // Since Twitter API requires authentication, we'll use enhanced mock data
    const tweets: Tweet[] = [];
    const currentDate = new Date();

    // Generate different content based on the account type
    const sportingCpContent = [
      "Vitória importante hoje! Rumo ao título! 💚🦁 #SportingCP #DiaDeSporting",
      "Convocatória para o próximo jogo já disponível no site oficial. #SportingCP",
      "Parabéns ao nosso jogador pelo prêmio de melhor em campo! 🏆 #SportingCP",
      "Ingressos para o próximo jogo já à venda. Garanta o seu! #DiaDeSporting",
      "Treino de hoje concluído. A equipa está pronta para o desafio de amanhã! 💪 #SportingCP",
      "Grande vitória no dérbi! Obrigado pelo apoio, Sportinguistas! 💚",
      "Novo equipamento já disponível na loja oficial. #SportingCP",
      "Parabéns ao nosso capitão pelo gol número 100 pelo clube! 🦁",
      "Confira os melhores momentos da partida de ontem no nosso site. #DiaDeSporting",
      "Hoje é dia de Champions League! Vamos Sporting! 💚",
    ];

    const modalidadesContent = [
      "Grande vitória da nossa equipa de futsal! 🏆 #FutsalSCP",
      "Parabéns à equipa de basquetebol pela classificação! 🏀 #BasquetebolSCP",
      "A nossa equipa de andebol garantiu presença na final! 🤾‍♂️ #AndebolSCP",
      "Resultados do fim de semana das nossas modalidades. Confira! #SCPModalidades",
      "Calendário de jogos para a próxima semana já disponível. #SCPModalidades",
      "Vitória importante da nossa equipa de hóquei em patins! #HóqueiSCP",
      "Parabéns aos nossos atletas pelo desempenho no campeonato nacional! #SCPModalidades",
      "Nova contratação para a equipa de voleibol. Bem-vindo! #VoleibolSCP",
      "Confira a entrevista com o treinador da equipa de futsal. #FutsalSCP",
      "Ingressos para a final da Taça de Portugal de andebol já disponíveis! #AndebolSCP",
    ];

    // Generate realistic media URLs
    const sportingMedia = [
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80",
      "https://images.unsplash.com/photo-1508098682722-e99c643e7f0b?w=600&q=80",
      "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=600&q=80",
    ];

    const modalidadesMedia = [
      "https://images.unsplash.com/photo-1577471488278-16eec37ffcc2?w=600&q=80",
      "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&q=80",
      "https://images.unsplash.com/photo-1519766304817-4f37bda74a26?w=600&q=80",
    ];

    // Generate tweets with realistic timestamps (newest first)
    for (let i = 0; i < count; i++) {
      const daysAgo = Math.floor(i / 3); // Group tweets by day
      const hoursAgo = (i % 3) * 4; // Space tweets within the day
      const minutesAgo = Math.floor(Math.random() * 59);

      const tweetDate = new Date(currentDate);
      tweetDate.setDate(tweetDate.getDate() - daysAgo);
      tweetDate.setHours(tweetDate.getHours() - hoursAgo);
      tweetDate.setMinutes(tweetDate.getMinutes() - minutesAgo);

      // Select content and media based on account type
      const contentArray = isMainAccount
        ? sportingCpContent
        : modalidadesContent;
      const mediaArray = isMainAccount ? sportingMedia : modalidadesMedia;

      const content = contentArray[i % contentArray.length];

      // Add media to some tweets
      let media: string[] | undefined = undefined;
      if (i % 3 === 0) {
        // Every third tweet has media
        media = [mediaArray[i % mediaArray.length]];
      }

      // Generate engagement metrics based on account popularity
      const baseMultiplier = isMainAccount ? 10 : 5; // Main account is more popular
      const recencyMultiplier = Math.max(1, (count - i) / 2); // Newer tweets get more engagement

      const likes = Math.floor(
        (Math.random() * 500 + 500) * baseMultiplier * recencyMultiplier,
      );
      const retweets = Math.floor(likes * (Math.random() * 0.3 + 0.1)); // 10-40% of likes
      const comments = Math.floor(likes * (Math.random() * 0.2 + 0.05)); // 5-25% of likes

      tweets.push({
        id: `${handle}-${i}-${Date.now()}`,
        username: isMainAccount ? "Sporting CP" : "Sporting CP Modalidades",
        handle: `@${handle}`,
        profileImage: `https://api.dicebear.com/7.x/avataaars/svg?seed=${handle}`,
        content,
        timestamp: tweetDate.toISOString(),
        likes,
        retweets,
        comments,
        media,
        isFromMainAccount,
      });
    }

    console.log(`Generated ${tweets.length} tweets for ${handle}`);
    return tweets;
  } catch (error) {
    console.error(`Error generating tweets for ${handle}:`, error);

    // Return a single error tweet
    return [
      {
        id: `error-${Date.now()}`,
        username: isMainAccount ? "Sporting CP" : "Sporting CP Modalidades",
        handle: `@${handle}`,
        profileImage: `https://api.dicebear.com/7.x/avataaars/svg?seed=${handle}`,
        content: `Unable to fetch tweets from Twitter. The Twitter API requires authentication with API keys.`,
        timestamp: new Date().toISOString(),
        likes: 0,
        retweets: 0,
        comments: 0,
        isFromMainAccount,
      },
    ];
  }
};

// Twitter API configuration
const TWITTER_API_KEY = "QjdrRw9wUVWJ2s8FfTRI73FB0";
const TWITTER_API_SECRET = "YF1ac12Fsm60Ztv6cSDDnymtHftfWQjVq9V9habQqu58Qvh9rD";
const TWITTER_BEARER_TOKEN =
  "AAAAAAAAAAAAAAAAAAAAAEU50QEAAAAAik8OGriF4prQe3YzEv7pDjrCHYU%3DIogIghiyFvnUeAiesZcgqNehmYA3KypFI7KY0Wbwx5XWeedK2A";

// Function to fetch tweets from Twitter API
const fetchTweetsFromTwitterAPI = async (
  username: string,
): Promise<Tweet[]> => {
  try {
    console.log(`Fetching tweets for username: ${username} from Twitter API`);

    // Twitter API v2 endpoint for user tweets
    // First we need to get the user ID from the username
    const userLookupUrl = `https://api.twitter.com/2/users/by/username/${username}`;

    const headers = {
      Authorization: `Bearer ${TWITTER_BEARER_TOKEN}`,
      "Content-Type": "application/json",
    };

    // Get user ID
    const userResponse = await fetch(userLookupUrl, { headers });

    if (!userResponse.ok) {
      console.error(
        `Twitter API error: ${userResponse.status}`,
        await userResponse.text(),
      );
      throw new Error(`Failed to fetch user data: ${userResponse.status}`);
    }

    const userData = await userResponse.json();
    console.log("User data:", userData);

    if (!userData.data || !userData.data.id) {
      throw new Error("User not found or API response format changed");
    }

    const userId = userData.data.id;

    // Now fetch tweets for this user ID
    const tweetsUrl = `https://api.twitter.com/2/users/${userId}/tweets?max_results=10&expansions=attachments.media_keys,author_id&user.fields=profile_image_url,username,name&media.fields=url,preview_image_url&tweet.fields=created_at,public_metrics`;

    const tweetsResponse = await fetch(tweetsUrl, { headers });

    if (!tweetsResponse.ok) {
      console.error(
        `Twitter API error: ${tweetsResponse.status}`,
        await tweetsResponse.text(),
      );
      throw new Error(`Failed to fetch tweets: ${tweetsResponse.status}`);
    }

    const tweetsData = await tweetsResponse.json();
    console.log("Tweets data:", tweetsData);

    // Transform Twitter API response to our app's Tweet format
    const tweets: Tweet[] = [];
    const isMainAccount = username.toLowerCase() === "sportingcp";

    if (tweetsData.data && tweetsData.data.length > 0) {
      // Get user info from includes
      const user = tweetsData.includes?.users?.[0] || {
        name: isMainAccount ? "Sporting CP" : "Sporting CP Modalidades",
        username: username,
        profile_image_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
      };

      // Get media items
      const mediaMap = new Map();
      if (tweetsData.includes?.media) {
        tweetsData.includes.media.forEach((media: any) => {
          mediaMap.set(media.media_key, media.url || media.preview_image_url);
        });
      }

      // Process each tweet
      tweetsData.data.forEach((tweet: any) => {
        // Get media URLs for this tweet
        const mediaUrls: string[] = [];
        if (tweet.attachments?.media_keys) {
          tweet.attachments.media_keys.forEach((key: string) => {
            const url = mediaMap.get(key);
            if (url) mediaUrls.push(url);
          });
        }

        tweets.push({
          id: tweet.id,
          username: user.name,
          handle: `@${user.username}`,
          profileImage: user.profile_image_url,
          content: tweet.text,
          timestamp: tweet.created_at,
          likes: tweet.public_metrics?.like_count || 0,
          retweets: tweet.public_metrics?.retweet_count || 0,
          comments: tweet.public_metrics?.reply_count || 0,
          media: mediaUrls.length > 0 ? mediaUrls : undefined,
          isFromMainAccount: isMainAccount,
        });
      });
    }

    console.log(
      `Fetched ${tweets.length} tweets for ${username} from Twitter API`,
    );
    return tweets;
  } catch (error) {
    console.error(
      `Error fetching tweets from Twitter API for ${username}:`,
      error,
    );
    throw error;
  }
};

// Function to fetch tweets from both accounts
export const fetchAllTweets = async (
  mainAccountUrl: string,
  modalidadesUrl: string,
): Promise<{ mainAccountTweets: Tweet[]; modalidadesTweets: Tweet[] }> => {
  try {
    // Extract handles from URLs
    const mainAccountHandle = extractHandleFromUrl(mainAccountUrl);
    const modalidadesHandle = extractHandleFromUrl(modalidadesUrl);

    console.log("Extracted handles:", { mainAccountHandle, modalidadesHandle });

    if (!mainAccountHandle || !modalidadesHandle) {
      throw new Error("Failed to extract Twitter handles from URLs");
    }

    try {
      // Try to fetch real tweets from Twitter API
      const [mainAccountTweets, modalidadesTweets] = await Promise.all([
        fetchTweetsFromTwitterAPI(mainAccountHandle),
        fetchTweetsFromTwitterAPI(modalidadesHandle),
      ]);

      return { mainAccountTweets, modalidadesTweets };
    } catch (apiError) {
      console.error(
        "Error fetching from Twitter API, falling back to mock data:",
        apiError,
      );

      // Fallback to mock data if API fails
      const [mainAccountTweets, modalidadesTweets] = await Promise.all([
        fetchTweetsForHandle(mainAccountHandle, true),
        fetchTweetsForHandle(modalidadesHandle, false),
      ]);

      return { mainAccountTweets, modalidadesTweets };
    }
  } catch (error) {
    console.error("Error fetching tweets:", error);
    throw error;
  }
};
