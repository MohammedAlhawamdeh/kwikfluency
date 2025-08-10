// app/terms/page.tsx (or pages/terms.tsx)

import React from "react";

const TermsAndConditions: React.FC = () => {
  return (
    <main
      className="min-h-screen px-6 md:px-12 lg:px-24 py-12 font-sans"
      style={{
        fontFamily: "var(--font-sans)",
        color: "var(--text)",
        backgroundColor: "var(--bg)",
      }}
    >
      <article className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Terms &amp; Conditions</h1>

        <section className="mb-6">
          <p>
            Welcome to our English Speaking Practice with AI app. By accessing
            or using our services, you agree to comply with and be bound by
            these Terms &amp; Conditions.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Use of Service</h2>
          <p>
            You agree to use our app only for lawful purposes and in a way that
            does not infringe the rights of others or restrict their use of the
            service.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">
            Account Responsibility
          </h2>
          <p>
            You are responsible for maintaining the confidentiality of your
            account credentials and for all activities under your account.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Payments and Refunds</h2>
          <p>
            All payments are processed securely. Trial payments are
            non-refundable. For full plans, please refer to our refund policy or
            contact support for assistance.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Intellectual Property</h2>
          <p>
            All content, trademarks, and intellectual property on this app are
            owned by us or our licensors and are protected by copyright laws.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">
            Limitation of Liability
          </h2>
          <p>
            We provide our service \&quot;as is\&quot; without warranties of any
            kind. We are not liable for any damages arising from your use of the
            app.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Changes to Terms</h2>
          <p>
            We may update these Terms &amp; Conditions from time to time.
            Continued use of the service constitutes acceptance of the updated
            terms.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Contact Information</h2>
          <p>
            If you have questions about these Terms, please contact us at{" "}
            <a
              href="mailto:mohawamdehtech@gmail.com"
              className="text-accent underline"
            >
              support@kwikfluency.com
            </a>
            .
          </p>
        </section>
      </article>
    </main>
  );
};

export default TermsAndConditions;
