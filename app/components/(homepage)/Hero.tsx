import React from "react";
import { Play, MessageCircle } from "lucide-react";

const Hero: React.FC = () => {
  return (
    <section className="min-h-screen flex items-center py-20 px-5 bg-surface">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center w-full">
        <div className="text-center lg:text-left">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-[var(--foreground)]">
            Practice English Speaking{" "}
            <span className="text-[var(--vivid-orange)]">
              Anytime, Anywhere
            </span>{" "}
            — With AI
          </h1>

          <p className="text-xl md:text-2xl mb-8 leading-relaxed text-muted">
            Improve fluency and confidence by speaking with an AI tutor
            that&apos;s always ready.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <button className="btn-primary text-lg px-8 py-4 rounded-xl font-semibold">
              Start Your First Lesson
            </button>

            <button className="btn-secondary text-lg px-8 py-4 rounded-xl font-semibold flex items-center justify-center gap-2">
              <Play size={20} />
              See How It Works
            </button>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <div className="relative w-full max-w-md h-80 rounded-2xl flex items-center justify-center card-theme">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center bg-[var(--vivid-orange)]">
                <MessageCircle size={40} color="white" />
              </div>
              <p className="text-lg font-semibold text-[var(--foreground)]">
                AI Speaking Practice
              </p>
              <p className="text-sm mt-2 text-muted">
                Interactive conversation simulation
              </p>
            </div>

            {/* Floating elements */}
            <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full animate-pulse bg-[var(--vivid-orange)]"></div>
            <div
              className="absolute -bottom-2 -left-2 w-4 h-4 rounded-full animate-pulse bg-[var(--vivid-orange)]"
              style={{ animationDelay: "1s" }}
            ></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
