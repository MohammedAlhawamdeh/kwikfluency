"use client";

import { useState } from "react";
import { CreditCard, Banknote, Wallet, DollarSign } from "lucide-react";
import Check from "../components/icons/Check";

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState<"credit" | "paypal">(
    "credit"
  );
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "GB",
    cardNumber: "",
    expiry: "",
    cvc: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
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
                      paymentMethod === "credit" ? "active" : ""
                    }`}
                    onClick={() => setPaymentMethod("credit")}
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
                  {paymentMethod === "credit" && (
                    <>
                      <div className="form-group">
                        <label htmlFor="cardNumber" className="form-label">
                          Card Number *
                        </label>
                        <input
                          type="text"
                          id="cardNumber"
                          name="cardNumber"
                          className="form-input"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          required
                          placeholder="1234 5678 9012 3456"
                        />
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="expiry" className="form-label">
                            Expiry Date *
                          </label>
                          <input
                            type="text"
                            id="expiry"
                            name="expiry"
                            className="form-input"
                            value={formData.expiry}
                            onChange={handleInputChange}
                            required
                            placeholder="MM/YY"
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="cvc" className="form-label">
                            CVC *
                          </label>
                          <input
                            type="text"
                            id="cvc"
                            name="cvc"
                            className="form-input"
                            value={formData.cvc}
                            onChange={handleInputChange}
                            required
                            placeholder="123"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {paymentMethod === "paypal" && (
                    <div
                      style={{
                        padding: "2rem",
                        textAlign: "center",
                        background: "var(--bg-surface)",
                        borderRadius: "var(--radius)",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                      }}
                    >
                      <p
                        style={{
                          color: "var(--auth-muted)",
                          marginBottom: "1rem",
                        }}
                      >
                        You will be redirected to PayPal to complete your
                        payment securely.
                      </p>
                    </div>
                  )}
                </div>
              </section>

              {/* Complete Order Button */}
              <button type="submit" className="complete-order-btn">
                Complete Order - £49.00
              </button>

              {/* Security Logos */}
<div className="security-logos flex gap-4 items-center mt-4">
  {[
    { Icon: CreditCard, color: "#2563eb" },    // blue
    { Icon: Banknote, color: "#22c55e" },      // green
    { Icon: Wallet, color: "#f59e42" },        // orange
    { Icon: DollarSign, color: "#eab308" },    // yellow
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
