// /api/subscribe.js
import { Resend } from "resend";
// ===== DEBUG (remover depois) =====
const rawKey = (process.env.RESEND_API_KEY || "");
console.log("RESEND_DEBUG length:", rawKey.length, "prefix:", rawKey.slice(0,3));
// ===== FIM DEBUG =====

/** @type {import('@vercel/node').VercelRequestHandler} */
export default async function handler(req, res) {
  // CORS rápido para dev
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(204).end();
  }
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  try {
    const { nome, email } = req.body || {};
    if (!nome || !email) {
      return res.status(400).json({ ok: false, error: "Nome e e-mail são obrigatórios." });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const FROM = process.env.FROM_EMAIL;   // ex: PassaBola <onboarding@resend.dev>
    const ADMIN = process.env.ADMIN_EMAIL; // seu e-mail para notificação

    // 1) Boas-vindas
    const welcome = await resend.emails.send({
      from: FROM,
      to: email,
      subject: "🎉 Bem-vindo(a) à Newsletter do PassaBola!",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;padding:24px;border:1px solid #eee;border-radius:12px">
          <h2 style="margin:0 0 12px;color:#6d28d9">Olá, ${escapeHTML(nome)} 👋</h2>
          <p style="margin:0 0 16px;color:#111">
            Obrigado por assinar! Você receberá novidades, estatísticas e tendências do futebol feminino.
          </p>
          <hr style="border:none;border-top:1px solid #eee;margin:16px 0"/>
          <p style="font-size:12px;color:#555;margin:0">Se não foi você, ignore este e-mail.</p>
        </div>
      `,
    });

    if (welcome?.error) {
      console.error("Resend welcome error:", welcome.error);
      return res.status(500).json({ ok: false, error: welcome.error.message || "Falha no envio" });
    }

    // 2) Notificação para você
    if (ADMIN) {
      const admin = await resend.emails.send({
        from: FROM,
        to: ADMIN,
        subject: "🆕 Novo cadastro na newsletter (PassaBola)",
        html: `
          <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;padding:16px;border:1px solid #eee;border-radius:12px">
            <p><strong>Nome:</strong> ${escapeHTML(nome)}</p>
            <p><strong>E-mail:</strong> ${escapeHTML(email)}</p>
            <p style="font-size:12px;color:#666">Data: ${new Date().toLocaleString("pt-BR")}</p>
          </div>
        `,
      });
      if (admin?.error) console.error("Resend admin error:", admin.error);
    }

    console.log("Resend welcome id:", welcome?.data?.id);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("API /subscribe error:", err);
    return res.status(500).json({ ok: false, error: err?.message || "Erro interno" });
  }
}

function escapeHTML(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}