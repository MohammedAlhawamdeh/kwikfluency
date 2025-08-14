import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil", // Keep your original version
});

export async function POST(req: Request) {
  try {
    // Debug logging
    console.log("Stripe Secret Key exists:", !!process.env.STRIPE_SECRET_KEY);
    console.log(
      "Stripe Secret Key starts with sk_:",
      process.env.STRIPE_SECRET_KEY?.startsWith("sk_")
    );

    const { amount } = await req.json();
    console.log("Creating payment intent for amount:", amount);

    const paymentIntent = await stripe.paymentIntents.create({
      amount, // in cents/pence
      currency: "gbp",
      automatic_payment_methods: { enabled: true },
    });

    console.log("Payment intent created successfully:", paymentIntent.id);

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error: unknown) {
    console.error("Stripe API Error Details:", error);

    let message = "Unknown error";
    let statusCode = 500;

    if (error instanceof Error) {
      message = error.message;

      // Handle specific Stripe errors
      if (message.includes("Invalid API Key")) {
        message =
          "Invalid Stripe API Key. Please check your STRIPE_SECRET_KEY environment variable.";
        statusCode = 401;
      } else if (message.includes("No such")) {
        message = "Stripe configuration error. Please verify your API keys.";
        statusCode = 400;
      }
    }

    return NextResponse.json({ error: message }, { status: statusCode });
  }
}
