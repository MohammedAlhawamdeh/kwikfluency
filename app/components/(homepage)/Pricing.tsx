import React from "react";
import { Check, Star } from "lucide-react";

const Pricing: React.FC = () => {
  return (
    <section className="py-20 px-5 bg-surface">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[var(--foreground)]">
            Choose Your Learning Plan
          </h2>
          <p className="text-xl text-muted">
            Start with a trial or go all-in with our comprehensive package
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Trial Plan */}
          <div className="card-theme rounded-2xl p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-2 text-[var(--foreground)]">
                Trial
              </h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-[var(--vivid-orange)]">
                  £9.99
                </span>
              </div>
              <p className="text-lg text-muted">
                Perfect for trying out AI tutoring
              </p>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <Check
                  size={20}
                  className="text-[var(--vivid-orange)] mt-0.5 flex-shrink-0"
                />
                <span className="text-[var(--foreground)]">
                  1 AI lesson (30 minutes)
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Check
                  size={20}
                  className="text-[var(--vivid-orange)] mt-0.5 flex-shrink-0"
                />
                <span className="text-[var(--foreground)]">
                  Basic feedback and corrections
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Check
                  size={20}
                  className="text-[var(--vivid-orange)] mt-0.5 flex-shrink-0"
                />
                <span className="text-[var(--foreground)]">
                  Access for 7 days
                </span>
              </li>
            </ul>

            <button className="btn-primary w-full text-lg py-3 rounded-xl font-semibold">
              Start Trial
            </button>
          </div>

          {/* Full Plan */}
          <div className="card-theme rounded-2xl p-8 relative border-2 border-[var(--vivid-orange)] transform scale-105">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-6 py-2 rounded-full flex items-center gap-2 bg-[var(--vivid-orange)]">
              <Star size={16} color="white" />
              <span className="text-white font-semibold">Most Popular</span>
            </div>

            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-2 text-[var(--foreground)]">
                Full Plan
              </h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-[var(--vivid-orange)]">
                  £99
                </span>
              </div>
              <p className="text-lg text-muted">
                Complete English speaking mastery
              </p>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <Check
                  size={20}
                  className="text-[var(--vivid-orange)] mt-0.5 flex-shrink-0"
                />
                <span className="text-[var(--foreground)]">
                  10 AI lessons (30 minutes each)
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Check
                  size={20}
                  className="text-[var(--vivid-orange)] mt-0.5 flex-shrink-0"
                />
                <span className="text-[var(--foreground)]">
                  1 private lesson with real tutor
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Check
                  size={20}
                  className="text-[var(--vivid-orange)] mt-0.5 flex-shrink-0"
                />
                <span className="text-[var(--foreground)]">
                  Vocabulary builder tool (coming soon)
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Check
                  size={20}
                  className="text-[var(--vivid-orange)] mt-0.5 flex-shrink-0"
                />
                <span className="text-[var(--foreground)]">
                  Priority support
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Check
                  size={20}
                  className="text-[var(--vivid-orange)] mt-0.5 flex-shrink-0"
                />
                <span className="text-[var(--foreground)]">
                  Progress tracking and analytics
                </span>
              </li>
            </ul>

            <button className="btn-primary w-full text-lg py-3 rounded-xl font-semibold">
              Get Full Plan
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
