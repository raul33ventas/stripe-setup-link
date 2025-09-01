import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { email } = req.body || {};
    const session = await stripe.checkout.sessions.create({
      mode: "setup",
      payment_method_types: ["sepa_debit"],
      customer_creation: "always",
      customer_email: email, // opcional
      success_url: "https://tudominio.com/success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "https://tudominio.com/cancel"
    });
    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("Error creating session:", err);
    return res.status(500).json({ error: err.message });
  }
}
