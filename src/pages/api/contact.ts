/**
 * Contact Form API Endpoint
 * Handles form submission with Botpoison verification
 * Compatible with Cloudflare Workers/Pages
 */

import type { APIRoute } from "astro";

export const prerender = false;

interface BotpoisonVerifyResponse {
  ok: boolean;
  message?: string;
}

interface ContactFormData {
  fullName: string;
  email: string;
  message?: string;
  consent: boolean;
  _botpoison: string;
  _botpoison_error?: string;
  _honeypot?: string;
}

export const POST: APIRoute = async ({ request, locals }) => {
  // Sur Cloudflare Pages avec SSR, import.meta.env n'est pas toujours accessible
  // dans les API routes — on utilise context.locals.runtime.env en priorité.
  const cfEnv = (locals as { runtime?: { env?: Record<string, string> } })?.runtime?.env ?? {};
  const getEnv = (key: string): string | undefined => cfEnv[key] ?? import.meta.env[key];
  try {
    const body = (await request.json()) as ContactFormData;

    // Honeypot spam check
    if (body._honeypot) {
      return new Response(JSON.stringify({ error: "Invalid submission" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Validate required fields
    if (!body.fullName || !body.email || !body.consent) {
      return new Response(JSON.stringify({ error: "Champs requis manquants" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Botpoison verification
    if (body._botpoison === "SERVICE_UNAVAILABLE") {
      console.warn("Form submitted without Botpoison - service unavailable");
    } else if (!body._botpoison) {
      return new Response(JSON.stringify({ error: "Vérification anti-bot manquante" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      const secretKey = getEnv("BOTPOISON_SECRET_KEY");

      if (!secretKey) {
        console.error("BOTPOISON_SECRET_KEY not configured");
        return new Response(JSON.stringify({ error: "Configuration serveur incorrecte" }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }

      try {
        const botpoisonResponse = await fetch("https://api.botpoison.com/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            secretKey,
            solution: body._botpoison,
          }),
        });

        const botpoisonData: BotpoisonVerifyResponse = await botpoisonResponse.json();

        if (!botpoisonData.ok) {
          console.error("Botpoison verification failed:", botpoisonData.message);
          return new Response(
            JSON.stringify({
              error: "Vérification anti-bot échouée",
              details: botpoisonData.message,
            }),
            {
              status: 403,
              headers: { "Content-Type": "application/json" },
            }
          );
        }
      } catch (verifyError) {
        console.error("Botpoison verification error:", verifyError);
        console.warn("Allowing submission despite verification error");
      }
    }

    // Submit to Formspark
    const formsparkId = getEnv("PUBLIC_FORMSPARK_FORM_ID");
    if (!formsparkId) {
      console.error("PUBLIC_FORMSPARK_FORM_ID not configured");
      return new Response(JSON.stringify({ error: "Configuration formulaire incorrecte" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const formsparkPayload: Record<string, string | boolean> = {
      fullName: body.fullName,
      email: body.email,
      message: body.message || "",
      consent: body.consent,
    };

    if (body._botpoison === "SERVICE_UNAVAILABLE") {
      formsparkPayload._note = "Submitted without bot protection (service unavailable)";
    }

    const formsparkResponse = await fetch(`https://submit-form.com/${formsparkId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(formsparkPayload),
    });

    if (!formsparkResponse.ok) {
      const errorText = await formsparkResponse.text();
      console.error("Formspark submission failed:", formsparkResponse.status, errorText);
      return new Response(
        JSON.stringify({
          error: "Échec de l'envoi du formulaire",
          status: formsparkResponse.status,
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Message envoyé avec succès",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Contact form API error:", error);
    return new Response(
      JSON.stringify({
        error: "Erreur serveur interne",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
