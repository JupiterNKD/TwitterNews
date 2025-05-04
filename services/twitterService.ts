import { Tweet } from "../types/twitter";

// Extract Twitter handle from URL
export const extractHandleFromUrl = (url: string): string | null => {
  try {
    // Parse URL to extract the path which contains the handle
    const urlObj = new URL(url);

    // The path is in the format "/username" or "/username/status/123"
    const pathParts = urlObj.pathname.split("/");

    // The handle is the first non-empty part after the domain
    const handle = pathParts.filter((part) => part.length > 0)[0];

    return handle || null;
  } catch (error) {
    console.error("Error extracting handle from URL:", error);
    return null;
  }
};

// Mock function to simulate fetching tweets from Twitter API
// In a real implementation, this would make actual API calls to Twitter
export const fetchTweetsForHandle = async (
  handle: string,
  isMainAccount: boolean,
  count: number = 10,
): Promise<Tweet[]> => {
  // In a real implementation, this would be an API call to Twitter
  // For now, we'll return enhanced mock data based on the handle

  console.log(
    `Fetching tweets for handle: ${handle}, isMainAccount: ${isMainAccount}`,
  );

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Generate mock tweets based on the handle
  const mockTweets: Tweet[] = [];

  for (let i = 0; i < count; i++) {
    const isRecent = i < 3; // Make the first few tweets appear more recent
    const daysAgo = isRecent ? i : i + Math.floor(Math.random() * 10);
    const hoursAgo = Math.floor(Math.random() * 24);
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    date.setHours(date.getHours() - hoursAgo);

    let content = "";
    let mediaUrl: string[] = [];

    if (isMainAccount) {
      if (handle.toLowerCase() === "sportingcp") {
        content = [
          `Vitória importante hoje! Rumo ao título! 💚🦁 #SportingCP #DiaDeSporting`,
          `Convocatória para o próximo jogo já disponível no site oficial. #SportingCP`,
          `Parabéns ao nosso jogador pelo prêmio de melhor em campo! 🏆 #SportingCP`,
          `Ingressos para o próximo jogo já à venda. Garanta o seu! #DiaDeSporting`,
          `Treino de hoje concluído. A equipa está pronta para o desafio de amanhã! 💪 #SportingCP`,
        ][i % 5];

        if (i % 3 === 0) {
          mediaUrl = [
            `https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80`,
          ];
        }
      }
    } else {
      if (handle.toLowerCase() === "scpmodalidades") {
        content = [
          `Grande vitória da nossa equipa de futsal! 🏆 #FutsalSCP`,
          `Parabéns à equipa de basquetebol pela classificação! 🏀 #BasquetebolSCP`,
          `A nossa equipa de andebol garantiu presença na final! 🤾‍♂️ #AndebolSCP`,
          `Resultados do fim de semana das nossas modalidades. Confira! #SCPModalidades`,
          `Calendário de jogos para a próxima semana já disponível. #SCPModalidades`,
        ][i % 5];

        if (i % 2 === 0) {
          mediaUrl = [
            `https://images.unsplash.com/photo-1577471488278-16eec37ffcc2?w=600&q=80`,
          ];
        }
      }
    }

    mockTweets.push({
      id: `${handle}-${i}-${Date.now()}`,
      username: isMainAccount ? "Sporting CP" : "Sporting CP Modalidades",
      handle: `@${handle}`,
      profileImage: `https://api.dicebear.com/7.x/avataaars/svg?seed=${handle}`,
      content,
      timestamp: date.toISOString(),
      likes: Math.floor(Math.random() * 5000) + 500,
      retweets: Math.floor(Math.random() * 1000) + 100,
      comments: Math.floor(Math.random() * 500) + 50,
      media: mediaUrl.length > 0 ? mediaUrl : undefined,
      isFromMainAccount,
    });
  }

  return mockTweets;
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

    if (!mainAccountHandle || !modalidadesHandle) {
      throw new Error("Failed to extract Twitter handles from URLs");
    }

    // Fetch tweets for both accounts in parallel
    const [mainAccountTweets, modalidadesTweets] = await Promise.all([
      fetchTweetsForHandle(mainAccountHandle, true),
      fetchTweetsForHandle(modalidadesHandle, false),
    ]);

    return { mainAccountTweets, modalidadesTweets };
  } catch (error) {
    console.error("Error fetching tweets:", error);
    throw error;
  }
};
