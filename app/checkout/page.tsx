"use client";

import { useState } from "react";
import { CreditCard, Banknote, Wallet, DollarSign } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import Check from "../components/icons/Check";

// Initialize Stripe
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

// Card Element styling
const cardElementOptions = {
  style: {
    base: {
      fontSize: "16px",
      color: "#000000", // Ensure text is black/dark
      fontFamily: "system-ui, -apple-system, sans-serif",
      fontSmoothing: "antialiased",
      "::placeholder": {
        color: "#6b7280", // Gray placeholder text
      },
      ":focus": {
        color: "#000000",
      },
    },
    invalid: {
      color: "#ef4444", // Red for invalid input
      iconColor: "#ef4444",
    },
    complete: {
      color: "#059669", // Green when complete
      iconColor: "#059669",
    },
  },
  hidePostalCode: true,
};

// PayPal configuration
const paypalOptions = {
  clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "",
  currency: "GBP",
  intent: "capture" as const,
};

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "paypal">(
    "stripe"
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "GB",
  });

  const createPayPalOrder = (data: any, actions: any) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: "49.00",
            currency_code: "GBP",
          },
          description: "English Speaking Practice - Full Plan",
        },
      ],
      payer: {
        name: {
          given_name: formData.firstName,
          surname: formData.lastName,
        },
        email_address: formData.email,
      },
    });
  };

  const onPayPalApprove = async (data: any, actions: any) => {
    setIsProcessing(true);
    try {
      const order = await actions.order.capture();
      console.log("PayPal payment successful:", order);
      setPaymentSuccess(true);
    } catch (error) {
      console.error("PayPal capture error:", error);
      setPaymentError("Payment capture failed. Please try again.");
    }
    setIsProcessing(false);
  };

  const onPayPalError = (err: any) => {
    console.error("PayPal error:", err);
    setPaymentError("PayPal payment failed. Please try again.");
    setIsProcessing(false);
  };

  const onPayPalCancel = (data: any) => {
    console.log("PayPal payment cancelled:", data);
    setPaymentError("Payment was cancelled.");
    setIsProcessing(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (paymentMethod === "stripe") {
      if (!stripe || !elements) {
        setPaymentError("Stripe has not loaded yet. Please try again.");
        return;
      }
      await handleStripePayment();
    }
    // For PayPal, the payment is handled by the PayPal buttons
  };

  const handleStripePayment = async () => {
    setIsProcessing(true);
    setPaymentError(null);

    try {
      // Create payment intent
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: 4900, // £49.00 in pence
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error:", response.status, errorText);
        setPaymentError(
          `Server error: ${response.status}. Please check your Stripe configuration.`
        );
        setIsProcessing(false);
        return;
      }

      const { clientSecret, error } = await response.json();

      if (error) {
        console.error("Payment Intent Error:", error);
        setPaymentError(error);
        setIsProcessing(false);
        return;
      }

      // Confirm payment with Stripe
      const cardElement = elements!.getElement(CardElement);

      const { error: confirmError, paymentIntent } =
        await stripe!.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement!,
            billing_details: {
              name: `${formData.firstName} ${formData.lastName}`,
              email: formData.email,
              phone: formData.phone,
            },
          },
        });

      if (confirmError) {
        setPaymentError(confirmError.message || "Payment failed");
      } else if (paymentIntent.status === "succeeded") {
        setPaymentSuccess(true);
        console.log("Payment succeeded:", paymentIntent);
      }
    } catch (error) {
      setPaymentError("An unexpected error occurred. Please try again.");
      console.error("Payment error:", error);
    }

    setIsProcessing(false);
  };

  const benefits = [
    "Unlimited AI Lessons (per plan limits)",
    "Priority Support",
    "Vocabulary Builder Access (coming soon)",
    "1 Private Lesson with a Tutor",
    "Personalized Feedback",
  ];

  const countries = [
    { code: "GB", name: "United Kingdom" },
    { code: "US", name: "United States" },
    { code: "CA", name: "Canada" },
    { code: "AU", name: "Australia" },
    { code: "DE", name: "Germany" },
    { code: "FR", name: "France" },
    { code: "ES", name: "Spain" },
    { code: "IT", name: "Italy" },
  ];

  if (paymentSuccess) {
    return (
      <main className="checkout-container">
        <div className="checkout-grid">
          <div className="col-span-full text-center py-12">
            <div
              className="card-theme"
              style={{ borderRadius: "var(--radius)", padding: "3rem" }}
            >
              <div className="text-6xl mb-4">🎉</div>
              <h1 className="text-3xl font-bold mb-4 text-green-600">
                Payment Successful!
              </h1>
              <p className="text-lg mb-6">
                Thank you for your purchase. You&apos;ll receive a confirmation
                email shortly.
              </p>
              <button
                onClick={() => (window.location.href = "/dashboard")}
                className="complete-order-btn"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="checkout-container">
      <div className="checkout-grid">
        {/* Left Column - Order Summary */}
        <div className="order-summary">
          <div
            className="card-theme"
            style={{ borderRadius: "var(--radius)", padding: "1.5rem" }}
          >
            <h1
              style={{
                fontSize: "1.5rem",
                fontWeight: "700",
                marginBottom: "1rem",
                color: "var(--foreground)",
              }}
            >
              English Speaking Practice – Full Plan
            </h1>

            {/* Product Image */}
            <div className="product-image">🗣️</div>

            {/* Order Summary */}
            <div
              style={{
                borderBottom: "1px solid var(--auth-border)",
                paddingBottom: "1rem",
                marginBottom: "1rem",
              }}
            >
              <h3
                style={{
                  fontSize: "1.125rem",
                  fontWeight: "600",
                  marginBottom: "1rem",
                  color: "var(--foreground)",
                }}
              >
                Order Summary
              </h3>

              <div className="price-row">
                <span>Full Plan Access</span>
                <span className="price-original">£199.00</span>
              </div>

              <div className="price-row">
                <span>Launch Discount (75% off)</span>
                <span className="price-discount">-£150.00</span>
              </div>

              <div
                className="price-row"
                style={{
                  borderTop: "1px solid var(--auth-border)",
                  paddingTop: "1rem",
                  marginTop: "1rem",
                }}
              >
                <span style={{ fontWeight: "600" }}>Total</span>
                <span className="price-final">£49.00</span>
              </div>
            </div>

            {/* Guarantee */}
            <div style={{ marginBottom: "1.5rem" }}>
              <h3
                style={{
                  fontSize: "1.125rem",
                  fontWeight: "600",
                  marginBottom: "0.5rem",
                  color: "var(--foreground)",
                }}
              >
                30-Day Money-Back Guarantee
              </h3>
              <p
                style={{
                  color: "var(--auth-muted)",
                  fontSize: "0.875rem",
                  lineHeight: "1.5",
                }}
              >
                Try English Speaking Practice risk-free. If you&apos;re not
                completely satisfied within 30 days, we&apos;ll refund your
                purchase completely.
              </p>
            </div>

            {/* Benefits */}
            <div>
              <h3
                style={{
                  fontSize: "1.125rem",
                  fontWeight: "600",
                  marginBottom: "1rem",
                  color: "var(--foreground)",
                }}
              >
                What&apos;s Included
              </h3>
              <ul className="benefits-list">
                {benefits.map((benefit, index) => (
                  <li key={index}>
                    <Check />
                    <span style={{ fontSize: "0.875rem" }}>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column - Checkout Form */}
        <div>
          <div
            className="card-theme"
            style={{ borderRadius: "var(--radius)", padding: "2rem" }}
          >
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "700",
                marginBottom: "2rem",
                color: "var(--foreground)",
              }}
            >
              Complete Your Order
            </h2>

            <form onSubmit={handleSubmit}>
              {/* Contact Information */}
              <section style={{ marginBottom: "2rem" }}>
                <h3
                  style={{
                    fontSize: "1.125rem",
                    fontWeight: "600",
                    marginBottom: "1rem",
                    color: "var(--foreground)",
                  }}
                >
                  Contact Information
                </h3>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName" className="form-label">
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      className="form-input"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      placeholder="John"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="lastName" className="form-label">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      className="form-input"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      placeholder="Smith"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-input"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="john.smith@example.com"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="phone" className="form-label">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      className="form-input"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+44 7123 456789"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="country" className="form-label">
                      Country *
                    </label>
                    <select
                      id="country"
                      name="country"
                      className="form-input"
                      value={formData.country}
                      onChange={handleInputChange}
                      required
                    >
                      {countries.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </section>

              {/* Payment Information */}
              <section style={{ marginBottom: "2rem" }}>
                <h3
                  style={{
                    fontSize: "1.125rem",
                    fontWeight: "600",
                    marginBottom: "1rem",
                    color: "var(--foreground)",
                  }}
                >
                  Payment Information
                </h3>

                {/* Payment Method Tabs */}
                <div className="payment-tabs">
                  <button
                    type="button"
                    className={`payment-tab ${
                      paymentMethod === "stripe" ? "active" : ""
                    }`}
                    onClick={() => setPaymentMethod("stripe")}
                  >
                    Credit Card
                  </button>
                  <button
                    type="button"
                    className={`payment-tab ${
                      paymentMethod === "paypal" ? "active" : ""
                    }`}
                    onClick={() => setPaymentMethod("paypal")}
                  >
                    PayPal
                  </button>
                </div>

                <div style={{ minHeight: 220 }}>
                  {paymentMethod === "stripe" && (
                    <div className="form-group" style={{ marginTop: "1rem" }}>
                      <label className="form-label">Card Details *</label>
                      <div
                        style={{
                          padding: "16px",
                          border: "1px solid #d1d5db",
                          borderRadius: "6px",
                          backgroundColor: "#ffffff",
                          minHeight: "44px",
                          fontSize: "16px",
                          position: "relative",
                        }}
                      >
                        <CardElement
                          options={cardElementOptions}
                          onReady={() => {
                            console.log("CardElement [ready]");
                          }}
                          onChange={(event) => {
                            console.log("CardElement [change]", event);
                            if (event.error) {
                              setPaymentError(event.error.message);
                            } else {
                              setPaymentError(null);
                            }
                          }}
                        />
                      </div>
                      <p
                        style={{
                          fontSize: "0.75rem",
                          color: "var(--auth-muted)",
                          marginTop: "0.5rem",
                        }}
                      >
                        Your payment information is encrypted and secure.
                      </p>
                    </div>
                  )}

                  {paymentMethod === "paypal" && (
                    <div style={{ marginTop: "1rem" }}>
                      <p
                        style={{
                          fontSize: "0.875rem",
                          color: "var(--auth-muted)",
                          marginBottom: "1rem",
                          textAlign: "center",
                        }}
                      >
                        Click the PayPal button below to complete your payment
                        securely
                      </p>
                      <div style={{ minHeight: "150px" }}>
                        <PayPalButtons
                          createOrder={createPayPalOrder}
                          onApprove={onPayPalApprove}
                          onError={onPayPalError}
                          onCancel={onPayPalCancel}
                          disabled={isProcessing}
                          style={{
                            layout: "vertical",
                            color: "blue",
                            shape: "rect",
                            label: "paypal",
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Payment Error */}
                {paymentError && (
                  <div
                    style={{
                      background: "#fee2e2",
                      border: "1px solid #fecaca",
                      color: "#dc2626",
                      padding: "0.75rem",
                      borderRadius: "var(--radius)",
                      marginTop: "1rem",
                      fontSize: "0.875rem",
                    }}
                  >
                    {paymentError}
                  </div>
                )}
              </section>

              {/* Complete Order Button - Only show for Stripe */}
              {paymentMethod === "stripe" && (
                <button
                  type="submit"
                  className="complete-order-btn"
                  disabled={isProcessing || !stripe}
                  style={{
                    opacity: isProcessing || !stripe ? 0.6 : 1,
                    cursor: isProcessing || !stripe ? "not-allowed" : "pointer",
                  }}
                >
                  {isProcessing ? "Processing..." : "Complete Order - £49.00"}
                </button>
              )}

              {/* Note for PayPal */}
              {paymentMethod === "paypal" && (
                <div
                  style={{
                    textAlign: "center",
                    padding: "1rem",
                    background: "#f0f9ff",
                    borderRadius: "var(--radius)",
                    border: "1px solid #0ea5e9",
                    color: "#0c4a6e",
                    fontSize: "0.875rem",
                  }}
                >
                  Complete your contact information above, then use the PayPal
                  button to pay.
                </div>
              )}

              {/* Security Logos */}
              <div className="security-logos flex gap-4 items-center mt-4">
                {[
                  { Icon: CreditCard, color: "#2563eb" },
                  { Icon: Banknote, color: "#22c55e" },
                  { Icon: Wallet, color: "#f59e42" },
                  { Icon: DollarSign, color: "#eab308" },
                ].map(({ Icon, color }, idx) => (
                  <span
                    key={idx}
                    className="rounded-lg border border-theme bg-surface p-2 flex items-center justify-center transition hover:scale-105"
                    style={{ width: 40, height: 40 }}
                  >
                    <Icon size={24} style={{ color }} />
                  </span>
                ))}
              </div>

              {/* Fine Print */}
              <p className="fine-print">
                By completing this purchase, you agree to our{" "}
                <a href="/terms" className="auth-link">
                  Terms & Conditions
                </a>{" "}
                and{" "}
                <a href="/privacy" className="auth-link">
                  Privacy Policy
                </a>
                . Your payment information is encrypted and secure.
              </p>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

// Main component with both Stripe and PayPal providers
export default function CheckoutPage() {
  return (
    <PayPalScriptProvider options={paypalOptions}>
      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>
    </PayPalScriptProvider>
  );
}
