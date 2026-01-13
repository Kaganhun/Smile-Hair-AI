
// FIX: Import Modality for image editing.
import { GoogleGenAI, Chat, GenerateContentResponse, Part, Modality } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set. Please set it in your environment.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

let chat: Chat | null = null;

const getChatSession = (): Chat => {
  if (!chat) {
    chat = ai.chats.create({
      model: 'gemini-flash-lite-latest',
      config: {
        systemInstruction: `You are a helpful and reassuring AI assistant for YSF Hair Clinic. Your name is YSF AI Coach. Your role is to support patients recovering from a hair transplant. 
        Only answer questions related to post-operative care for hair transplants, hair health, and the recovery process. Your knowledge is limited to the first 1-2 months of recovery.
        Be calm, reassuring, and professional. Use simple, easy-to-understand language in Turkish.
        If a question is outside this scope (e.g., politics, celebrities, general knowledge), politely state that you can only help with hair transplant recovery questions.
        For any urgent or serious medical concerns like signs of infection (pus, high fever, severe pain), or allergic reactions, you MUST immediately and clearly advise the user to contact their YSF Hair Clinic consultant or a medical professional. Do not attempt to diagnose these issues.
        Start the conversation by introducing yourself in Turkish and asking how you can help.`,
      },
    });
  }
  return chat;
};

export const getChatResponseStream = async (history: { role: "user" | "model"; parts: Part[] }[], newMessage: string) => {
  const chatSession = getChatSession();
  chatSession.history = history;
  return chatSession.sendMessageStream({ message: newMessage });
};

export const analyzeImage = async (image: { mimeType: string, data: string }, prompt: string): Promise<GenerateContentResponse> => {
  const systemPrompt = `System Prompt: You are an expert AI analyzer for post-hair transplant surgery recovery at YSF Hair Clinic. Your task is to analyze the provided image of a patient's scalp and their accompanying text, and respond in Turkish.

  Your analysis should be structured as follows:
  1.  **Gözlem:** Briefly describe what you see in the image (e.g., "Ekim alanında kızarıklık ve küçük kabuklar görüyorum.").
  2.  **Değerlendirme:** Based on the visual information and assuming the photo is taken a few days post-op, assess if the condition appears to be a normal part of the healing process. Common normal signs include redness, mild swelling, and scabbing.
  3.  **Öneri:** Provide a clear, reassuring response and a course of action.
      *   If it looks normal, say something like: "Bu durum, iyileşme sürecinin normal bir parçası gibi görünüyor. Lütfen operasyon sonrası bakım talimatlarınızı dikkatle uygulamaya devam edin."
      *   If it's slightly concerning but not an emergency (e.g., slightly more scabbing than average), say: "Bu durum normal olabilir, ancak emin olmak için lütfen bölgeyi gözlemlemeye devam edin. İyileşme göstermez veya daha kötüye giderse, bu fotoğrafı danışmanınıza gönderin."
      *   If you see potential signs of a complication (e.g., yellow pus, excessive swelling, signs of infection), you MUST state: "Bu görüntüye dayanarak, profesyonel bir değerlendirme için derhal YSF Hair Clinic danışmanınızla iletişime geçmeniz şiddetle tavsiye edilir."
  4.  **Sorumluluk Reddi:** ALWAYS end with this disclaimer: "Lütfen unutmayın, ben bir yapay zeka asistanıyım ve bu tıbbi bir teşhis değildir. Ciddi endişeleriniz için mutlaka YSF Hair Clinic'teki tıbbi danışmanınızla görüşmelisiniz."`;

  const imagePart = {
    inlineData: {
      mimeType: image.mimeType,
      data: image.data,
    },
  };
  const textPart = { text: `User's question: "${prompt}"` };

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: { parts: [imagePart, textPart] },
    config: { systemInstruction: systemPrompt }
  });
  return response;
};

// FIX: Add editImage function to handle image editing requests and export it.
export const editImage = async (image: { mimeType: string, data: string }, prompt: string): Promise<string | null> => {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          inlineData: {
            data: image.data,
            mimeType: image.mimeType,
          },
        },
        {
          text: prompt,
        },
      ],
    },
    config: {
        responseModalities: [Modality.IMAGE],
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts ?? []) {
    if (part.inlineData) {
      return part.inlineData.data;
    }
  }

  return null;
};

export const getComplexResponse = async (prompt: string): Promise<string> => {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: `Kullanıcı, saç ekimi sonrası karmaşık bir soru sordu. Lütfen detaylı ve kapsamlı bir yanıt verin. Kullanıcının sorusu: "${prompt}"`,
        config: {
            thinkingConfig: { thinkingBudget: 32768 },
        },
    });
    return response.text;
};

export const getWebResponse = async (prompt: string): Promise<{ text: string; sources: any[] }> => {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `Kullanıcı, saç ekimi veya saç sağlığı ile ilgili güncel bir soru sordu. Lütfen web'de arama yaparak en doğru ve güncel bilgiyi Türkçe olarak verin. Kullanıcının sorusu: "${prompt}"`,
    config: {
      tools: [{googleSearch: {}}],
    },
  });

  const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
      uri: chunk.web?.uri,
      title: chunk.web?.title,
  })).filter(s => s.uri && s.title) || [];

  return { text: response.text, sources };
};