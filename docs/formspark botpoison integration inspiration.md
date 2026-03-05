/home/bap/dev/00_Projets_Pro/darkness.litt/src/utils/botpoisonUtils.ts

```
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
```

/home/bap/dev/00_Projets_Pro/darkness.litt/src/components/Forms/ContactForm.astro

```
---
import { themeConfig } from '@/config'

const { highlight } = themeConfig.color.light
---

<div class="mx-left max-w-full rounded-lg p-6">
  <form id="contact-form" action="/api/contact/" novalidate style={`--highlight-color: ${highlight}`}>
    <div class="mb-4">
      <label for="full-name" class="mb-2 block font-form">
        Nom <span class="text-warning">*</span>
      </label>
      <input
        class="form-input w-full border-0 border-b-1 bg-transparent py-2 pr-3 transition-colors disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none"
        id="full-name"
        type="text"
        name="fullName"
        placeholder="Char René"
        required
      />
      <span class="mt-1 hidden text-sm text-warning" data-error="full-name"></span>
    </div>

    <div class="mb-4">
      <label for="email" class="mb-2 block font-form">
        E-mail <span class="text-warning">*</span>
      </label>
      <input
        class="form-input w-full border-0 border-b-1 bg-transparent py-2 pr-3 transition-colors disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none"
        id="email"
        type="email"
        name="email"
        placeholder="rchar@poesie.fr"
        required
      />
      <span class="mt-1 hidden text-sm text-warning" data-error="email"></span>
    </div>

    <div class="mb-4">
      <label for="message" class="mb-2 block font-form">
        Message
      </label>
      <textarea
        class="form-input w-full resize-none border-0 border-b-1 bg-transparent py-2 pr-3 transition-colors disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none"
        id="message"
        name="message"
        rows="4"
        placeholder="Écrivez-moi"
      ></textarea>
      <span class="mt-1 hidden text-sm text-warning" data-error="message"></span>
    </div>

    <div class="mb-4">
      <label for="newsletter-consent" class="flex cursor-pointer items-center gap-2 border-0 pb-3">
        <input
          class="form-checkbox"
          id="newsletter-consent"
          type="checkbox"
          name="newsletterConsent"
        />
        <span class="align-text-bottom text-xs font-form">
          Je souhaite recevoir la newsletter
        </span>
      </label>
      <span class="mt-1 hidden text-sm text-warning" data-error="newsletter-consent"></span>
    </div>

    <div class="mb-4">
      <label for="consent" class="flex cursor-pointer items-center gap-2 border-0 pb-3">
        <input
          class="form-checkbox"
          id="consent"
          type="checkbox"
          name="consent"
          required
        />
        <span class="align-text-bottom text-xs font-form">
          J'accepte que mes données soient conservées pour traiter ma demande <span class="text-warning">*</span>
        </span>
      </label>
      <span class="mt-1 hidden text-sm text-warning" data-error="consent"></span>
    </div>

    <div class="mb-4">
      <button
        type="submit"
        class="highlight-hover border-0 bg-transparent px-1 pb-.2 pt-2 text-left font-bold font-form font-italic transition-colors after:bottom-0.35em focus:outline-none"
      >
        Envoyer
      </button>
    </div>

    <div
      id="form-error"
      class="mt-4 hidden border border-red-200 bg-red-50 p-4 text-warning"
      role="alert"
    >
      <p class="font-semibold">⚠ Une erreur est survenue</p>
      <p class="text-sm" id="error-message">Veuillez réessayer plus tard.</p>
    </div>

    <div
      id="form-success"
      class="mt-4 hidden border border-green-200 bg-green-50 p-4 text-tip"
      role="alert"
    >
      <p class="font-semibold">✓ Message envoyé avec succès</p>
      <p class="text-sm">Nous vous répondrons dans les plus brefs délais.</p>
    </div>
  </form>
</div>

<style>
  /* Form inputs focus state */
  .form-input:focus {
    border-color: var(--highlight-color);
  }

  /* Checkbox styling */
  .form-checkbox {
    appearance: none;
    width: 1rem;
    height: 1rem;
    border: 1px solid currentColor;
    border-radius: 0;
    background-color: transparent;
    cursor: pointer;
    transition: all 150ms ease-out;
  }

  .form-checkbox:hover:not(:disabled) {
    border-color: var(--highlight-color);
  }

  .form-checkbox:checked {
    background-color: var(--highlight-color);
    border-color: var(--highlight-color);
    background-image: url("../../assets/icons/copy-check.svg");
    background-repeat: no-repeat;
    background-position: center;
    background-size: 76%;
  }

  .form-checkbox:focus-visible {
    outline: 2px solid var(--highlight-color);
    outline-offset: 2px;
  }

  .form-checkbox:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>

<script>
import { getBotpoisonSolution } from '@/utils/botpoisonUtils'

const form = document.getElementById('contact-form') as HTMLFormElement
const formError = document.getElementById('form-error') as HTMLDivElement
const errorMessage = document.getElementById('error-message') as HTMLParagraphElement
const formSuccess = document.getElementById('form-success') as HTMLDivElement
const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement

// Validation helper functions
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/
  return emailRegex.test(email)
}

function showError(fieldId: string, message: string) {
  const errorSpan = form.querySelector(`[data-error="${fieldId}"]`) as HTMLSpanElement
  if (errorSpan) {
    errorSpan.textContent = message
    errorSpan.classList.remove('hidden')
  }
}

function hideError(fieldId: string) {
  const errorSpan = form.querySelector(`[data-error="${fieldId}"]`) as HTMLSpanElement
  if (errorSpan) {
    errorSpan.classList.add('hidden')
  }
}

function hideAllErrors() {
  const errorSpans = form.querySelectorAll('[data-error]')
  errorSpans.forEach(span => span.classList.add('hidden'))
}

function showFormError(message: string) {
  errorMessage.textContent = message
  formError.classList.remove('hidden')
  formSuccess.classList.add('hidden')
}

function showFormSuccess() {
  formSuccess.classList.remove('hidden')
  formError.classList.add('hidden')
}

function hideFormMessages() {
  formError.classList.add('hidden')
  formSuccess.classList.add('hidden')
}

function validateForm(): boolean {
  hideAllErrors()
  hideFormMessages()
  let isValid = true

  // Validate full name
  const fullName = (form.querySelector('#full-name') as HTMLInputElement).value.trim()
  if (!fullName) {
    showError('full-name', 'Le nom est requis')
    isValid = false
  }

  // Validate email
  const email = (form.querySelector('#email') as HTMLInputElement).value.trim()
  if (!email) {
    showError('email', 'L\'email est requis')
    isValid = false
  }
  else if (!validateEmail(email)) {
    showError('email', 'L\'email n\'est pas valide')
    isValid = false
  }

  // Validate consent
  const consent = (form.querySelector('#consent') as HTMLInputElement).checked
  if (!consent) {
    showError('consent', 'Vous devez accepter la conservation de vos données')
    isValid = false
  }

  return isValid
}

// Handle form submission
form.addEventListener('submit', async (e) => {
  e.preventDefault()

  // Validate form
  if (!validateForm()) {
    return
  }

  // Disable submit button and show loading state
  submitButton.disabled = true
  const originalText = submitButton.textContent
  submitButton.textContent = 'Envoi en cours...'

  try {
    // Prepare form data
    const formData = new FormData(form)
    const data: Record<string, any> = {}

    formData.forEach((value, key) => {
      if (key === 'consent' || key === 'newsletterConsent') {
        data[key] = value === 'on'
      }
      else {
        data[key] = value
      }
    })

    // Try to get Botpoison solution with graceful fallback
    try {
      const solution = await getBotpoisonSolution()
      data._botpoison = solution
    }
    catch (error) {
      // Graceful fallback - allow submission without Botpoison
      data._botpoison = 'SERVICE_UNAVAILABLE'
      data._botpoison_error = error instanceof Error ? error.message : 'Unknown error'
    }

    // Submit form
    const response = await fetch(form.action, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        errorData.error || `HTTP error! status: ${response.status}`,
      )
    }

    // Show success message and reset form
    showFormSuccess()
    form.reset()
  }
  catch {
    showFormError(
      'Une erreur est survenue lors de l\'envoi. Veuillez réessayer plus tard.',
    )
  }
  finally {
    // Re-enable submit button
    submitButton.disabled = false
    submitButton.textContent = originalText
  }
})

// Add real-time validation for email
form.querySelector('#email')?.addEventListener('blur', (e) => {
  const email = (e.target as HTMLInputElement).value.trim()
  if (email && !validateEmail(email)) {
    showError('email', 'L\'email n\'est pas valide')
  }
  else {
    hideError('email')
  }
})
</script>

```

/home/bap/dev/00_Projets_Pro/darkness.litt/src/pages/api/contact.ts

```
/**
 * Contact Form API Endpoint
 * Handles form submission with Botpoison verification
 * Compatible with Cloudflare Workers/Pages
 */

import type { APIRoute } from 'astro'

export const prerender = false

interface BotpoisonVerifyResponse {
  ok: boolean
  message?: string
}

interface ContactFormData {
  fullName: string
  email: string
  message?: string
  consent: boolean
  newsletterConsent?: boolean
  _botpoison: string
  _botpoison_error?: string
  _honeypot?: string
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json() as ContactFormData

    // Honeypot spam check
    if (body._honeypot) {
      return new Response(
        JSON.stringify({ error: 'Invalid submission' }),
        {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }

    // Validate required fields
    if (!body.fullName || !body.email || !body.consent) {
      return new Response(
        JSON.stringify({ error: 'Champs requis manquants' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }

    // Botpoison verification
    if (body._botpoison === 'SERVICE_UNAVAILABLE') {
      console.warn('Form submitted without Botpoison - service unavailable')
    }
    else if (!body._botpoison) {
      return new Response(
        JSON.stringify({ error: 'Vérification anti-bot manquante' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }
    else {
      const secretKey = import.meta.env.BOTPOISON_SECRET_KEY

      if (!secretKey) {
        console.error('BOTPOISON_SECRET_KEY not configured')
        return new Response(
          JSON.stringify({ error: 'Configuration serveur incorrecte' }),
          {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          },
        )
      }

      try {
        const botpoisonResponse = await fetch('https://api.botpoison.com/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            secretKey,
            solution: body._botpoison,
          }),
        })

        const botpoisonData: BotpoisonVerifyResponse = await botpoisonResponse.json()

        if (!botpoisonData.ok) {
          console.error('Botpoison verification failed:', botpoisonData.message)
          return new Response(
            JSON.stringify({
              error: 'Vérification anti-bot échouée',
              details: botpoisonData.message,
            }),
            {
              status: 403,
              headers: { 'Content-Type': 'application/json' },
            },
          )
        }
      }
      catch (verifyError) {
        console.error('Botpoison verification error:', verifyError)
        console.warn('Allowing submission despite verification error')
      }
    }

    // Submit to Formspark
    const formsparkId = import.meta.env.PUBLIC_FORMSPARK_FORM_ID
    if (!formsparkId) {
      console.error('PUBLIC_FORMSPARK_FORM_ID not configured')
      return new Response(
        JSON.stringify({ error: 'Configuration formulaire incorrecte' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }

    const formsparkData: Record<string, string | boolean> = {
      email: body.email,
      fullName: body.fullName,
      message: body.message || '',
      consent: body.consent,
      newsletterConsent: body.newsletterConsent || false,
      _gotcha: '',
    }

    if (body._botpoison === 'SERVICE_UNAVAILABLE') {
      formsparkData._note = 'Submitted without bot protection (service unavailable)'
    }

    const formParams = new URLSearchParams()
    for (const [key, value] of Object.entries(formsparkData)) {
      formParams.append(key, String(value))
    }

    const formsparkResponse = await fetch(formsparkId, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: formParams.toString(),
      redirect: 'manual',
    })

    if (!formsparkResponse.ok) {
      const errorText = await formsparkResponse.text()
      console.error('Formspark submission failed:', formsparkResponse.status, errorText)
      return new Response(
        JSON.stringify({
          error: 'Échec de l\'envoi du formulaire',
          status: formsparkResponse.status,
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Message envoyé avec succès',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      },
    )
  }
  catch (error) {
    console.error('Contact form API error:', error)
    return new Response(
      JSON.stringify({
        error: 'Erreur serveur interne',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    )
  }
}

```

/home/bap/dev/00_Projets_Pro/darkness.litt/src/pages/api/formspark-webhook.ts

```
/**
 * Formspark Webhook Endpoint
 * Receives form submissions from Formspark and adds contacts to Brevo
 * when newsletter consent is given
 *
 * Flow:
 * 1. Contact form submits to /api/contact
 * 2. /api/contact verifies Botpoison and forwards to Formspark
 * 3. Formspark sends webhook to this endpoint
 * 4. If newsletterConsent = true, add contact to Brevo
 *
 * Compatible with Cloudflare Workers/Pages
 */

import type { APIRoute } from 'astro'

export const prerender = false

interface FormsparkWebhookData {
  email: string
  fullName?: string
  message?: string
  consent?: boolean
  newsletterConsent?: boolean | string
  [key: string]: unknown
}

interface BrevoContactPayload {
  email: string
  listIds: number[]
  updateEnabled: boolean
  attributes: {
    FIRSTNAME?: string
    [key: string]: unknown
  }
}

export const POST: APIRoute = async ({ request }) => {
  try {
    // Parse incoming Formspark webhook data
    const formData = await request.json() as FormsparkWebhookData

    // Validate that we have at least an email
    if (!formData.email) {
      console.error('Webhook received without email')
      return new Response(
        JSON.stringify({ error: 'Invalid data: email required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }

    // Check if user consented to newsletter
    // Handle both boolean and string values from form submissions
    const hasNewsletterConsent
      = formData.newsletterConsent === true
        || formData.newsletterConsent === 'true'
        || formData.newsletterConsent === 'on'

    if (!hasNewsletterConsent) {
      // No newsletter consent, just acknowledge receipt
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Webhook received, no newsletter subscription requested',
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }

    // Newsletter consent given, add to Brevo
    const brevoApiKey = import.meta.env.BREVO_API_KEY
    if (!brevoApiKey) {
      console.error('BREVO_API_KEY not configured')
      return new Response(
        JSON.stringify({
          error: 'Brevo configuration missing',
          received: true,
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }

    // Get Brevo list ID (default to 2, or configure via env var)
    const brevoListId = import.meta.env.BREVO_LIST_ID
      ? Number.parseInt(import.meta.env.BREVO_LIST_ID, 10)
      : 6

    // Prepare Brevo contact payload
    const brevoPayload: BrevoContactPayload = {
      email: formData.email,
      listIds: [brevoListId],
      updateEnabled: true,
      attributes: {},
    }

    // Add first name if available
    if (formData.fullName) {
      // Extract first name (before first space)
      const firstName = formData.fullName.split(' ')[0]
      brevoPayload.attributes.FIRSTNAME = firstName
    }

    // Submit to Brevo
    try {
      const brevoResponse = await fetch('https://api.brevo.com/v3/contacts', {
        method: 'POST',
        headers: {
          'api-key': brevoApiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(brevoPayload),
      })

      if (!brevoResponse.ok) {
        const errorText = await brevoResponse.text()
        console.error('Brevo API error:', brevoResponse.status, errorText)

        // Check if contact already exists (204 or specific error)
        if (brevoResponse.status === 204 || errorText.includes('already exists')) {
          console.warn('Contact already exists in Brevo:', formData.email)
          return new Response(
            JSON.stringify({
              success: true,
              message: 'Contact already subscribed to newsletter',
            }),
            {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
            },
          )
        }

        return new Response(
          JSON.stringify({
            error: 'Failed to add contact to newsletter',
            details: errorText,
          }),
          {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          },
        )
      }

      const brevoData = await brevoResponse.json()

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Contact added to newsletter',
          brevoId: brevoData.id,
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }
    catch (brevoError) {
      console.error('Brevo request failed:', brevoError)
      return new Response(
        JSON.stringify({
          error: 'Failed to connect to newsletter service',
          details: brevoError instanceof Error ? brevoError.message : 'Unknown error',
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }
  }
  catch (error) {
    console.error('Webhook processing error:', error)
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    )
  }
}

```
