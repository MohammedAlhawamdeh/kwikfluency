import React from "react";
import { ArrowRight } from "lucide-react";

const CTA: React.FC = () => {
  return (
    <section className="py-20 px-5 bg-[var(--vivid-orange)]">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white leading-tight">
          Start Your Journey to Confident English Speaking Today
        </h2>

        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
          Join thousands of learners who have already improved their English
          speaking skills with our AI tutoring platform.
        </p>

        <button className="bg-white text-[var(--vivid-orange)] text-xl px-12 py-4 rounded-xl font-bold transition-all duration-200 flex items-center gap-3 mx-auto hover:transform hover:scale-105 shadow-lg">
          Join Now
          <ArrowRight size={24} />
        </button>

        <p className="text-white/80 mt-6 text-lg">
          Cancel anytime during trial.
        </p>
      </div>
    </section>
  );
};

export default CTA;
