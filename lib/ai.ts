/**
 * Stub AI conversation function.
 *
 * Replace the body of `conversation()` with your own AI API call
 * (e.g. OpenAI, Anthropic, Google Gemini, etc.).
 *
 * The function is called with an array of chat messages and optional model
 * options, and must return `{ data: string }` where `data` is the raw text
 * content from the model (plain text or JSON string).
 */

export interface ConversationMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ConversationOptions {
  model?: string;
  temperature?: number;
  response_format?: { type: string };
}

/** Some integrations pass through a raw provider payload; callers normalize to text. */
export interface LegacyChatCompletionShape {
  content?: string;
  choices?: Array<{ message?: { content?: string } }>;
}

export type ConversationResponseData = string | LegacyChatCompletionShape;

export interface ConversationResponse {
  /** Plain model text, or a legacy chat-completion-shaped object. */
  data: ConversationResponseData;
}

/**
 * Send a chat conversation to an AI model.
 *
 * **This is a placeholder.** It logs the request and returns an empty-ish
 * JSON stub so callers don't crash. Wire it up to a real model before use.
 *
 * @example
 * // OpenAI drop-in replacement:
 * import OpenAI from 'openai';
 * const openai = new OpenAI();
 *
 * export async function conversation(
 *   messages: ConversationMessage[],
 *   options: ConversationOptions = {}
 * ): Promise<ConversationResponse> {
 *   const response = await openai.chat.completions.create({
 *     model: options.model ?? 'gpt-4o-mini',
 *     temperature: options.temperature ?? 0.7,
 *     response_format: options.response_format as any,
 *     messages,
 *   });
 *   return { data: response.choices[0].message.content ?? '' };
 * }
 */
export async function conversation(
  messages: ConversationMessage[],
  options: ConversationOptions = {}
): Promise<ConversationResponse> {
  console.log('[ai] conversation called — replace this stub with a real AI API');
  console.log('[ai] messages:', JSON.stringify(messages, null, 2));
  console.log('[ai] options:', options);

  // Placeholder: callers expect a JSON string in `data`.
  // Return the minimal structure each caller can survive on.
  const placeholder = JSON.stringify({
    _stub: true,
    message: 'Replace the conversation() function in lib/ai.ts with your own AI API.',
    pois: [],           // poiService.ts expects this when discovering POIs
    neighborhoods: [],  // zillowApi.ts expects this when discovering neighborhoods
  });

  console.log('[ai] returning placeholder response:', placeholder);
  return { data: placeholder };
}
