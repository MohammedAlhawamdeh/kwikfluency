import React from "react";
import { MessageCircle } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="py-12 px-5 bg-surface">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[var(--vivid-orange)]">
            <MessageCircle size={24} color="white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[var(--foreground)]">
              AI English Practice
            </h3>
            <p className="text-sm text-muted">Your AI-powered English tutor</p>
          </div>
        </div>

        <div className="flex gap-8">
          <a
            href="/privacy"
            className="text-muted hover:text-[var(--vivid-orange)] transition-colors"
          >
            Privacy Policy
          </a>
          <a
            href="/terms"
            className="text-muted hover:text-[var(--vivid-orange)] transition-colors"
          >
            Terms & Conditions
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
