import React from "react";

const PrivacyPolicy: React.FC = () => {
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
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

        <section className="mb-6">
          <p>
            Your privacy is important to us. This Privacy Policy explains how we
            collect, use, and protect your information when you use our English
            Speaking Practice with AI app.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">
            Information We Collect
          </h2>
          <p>We collect the following types of information:</p>
          <ul className="list-disc list-inside ml-5 mt-2 space-y-1">
            <li>
              Personal information you provide when creating an account (name,
              email, etc.).
            </li>
            <li>
              Usage data to improve our app and personalize your experience.
            </li>
            <li>Technical data such as IP address and device information.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">
            How We Use Your Information
          </h2>
          <p>We use your data to:</p>
          <ul className="list-disc list-inside ml-5 mt-2 space-y-1">
            <li>Provide and maintain our services.</li>
            <li>Improve the app’s functionality and user experience.</li>
            <li>Communicate with you about updates, offers, and support.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Data Security</h2>
          <p>
            We take reasonable measures to protect your data from unauthorized
            access, alteration, disclosure, or destruction.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Your Rights</h2>
          <p>You have the right to:</p>
          <ul className="list-disc list-inside ml-5 mt-2 space-y-1">
            <li>Access, update, or delete your personal information.</li>
            <li>Opt out of marketing communications.</li>
            <li>Request a copy of your data in a portable format.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Cookies and Tracking</h2>
          <p>
            We use cookies and similar tracking technologies to enhance your
            experience and analyze usage. You can manage cookie preferences via
            your browser settings.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">
            Changes to This Policy
          </h2>
          <p>
            We may update this policy occasionally. We’ll notify you of any
            significant changes by posting the new policy on this page.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact
            us at{" "}
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

export default PrivacyPolicy;
