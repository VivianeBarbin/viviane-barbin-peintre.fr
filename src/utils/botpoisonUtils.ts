/**
 * Botpoison Browser Utilities
 * Client-side bot protection using official Botpoison library
 *
 * @see https://botpoison.com/documentation
 */

import PoisonBrowser from '@botpoison/browser'

/**
 * Get a Botpoison challenge solution
 * Uses the official Botpoison browser library for proper challenge/solution handling
 *
 * @returns {Promise<string>} The solution token to be sent to the server
 * @throws {Error} If challenge generation fails
 */
export async function getBotpoisonSolution(): Promise<string> {
  const publicKey = import.meta.env.PUBLIC_BOTPOISON_PUBLIC_KEY

  if (!publicKey) {
    throw new Error('Bot protection not configured')
  }

  const botpoison = new PoisonBrowser({ publicKey })
  const { solution } = await botpoison.challenge()

  return solution
}

/**
 * Verify if Botpoison is properly configured
 * Useful for development/debugging
 *
 * @returns {boolean} True if public key is configured
 */
export function isBotpoisonConfigured(): boolean {
  return !!import.meta.env.PUBLIC_BOTPOISON_PUBLIC_KEY
}
