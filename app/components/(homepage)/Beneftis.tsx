import React from "react";
import { MessageCircle, Target, BookOpen } from "lucide-react";

const Benefits: React.FC = () => {
  const benefits = [
    {
      icon: <MessageCircle size={48} className="text-[var(--vivid-orange)]" />,
      title: "Real-Time Conversation Practice",
      description:
        "Speak with AI anytime, get instant responses, and practice natural conversations without scheduling.",
    },
    {
      icon: <Target size={48} className="text-[var(--vivid-orange)]" />,
      title: "Personalized Feedback",
      description:
        "Improve your weak points with instant corrections on pronunciation, grammar, and fluency.",
    },
    {
      icon: <BookOpen size={48} className="text-[var(--vivid-orange)]" />,
      title: "Build Vocabulary",
      description:
        "Learn and remember useful words for real-life use with contextual learning and practice.",
    },
  ];

  return (
    <section className="py-20 px-5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[var(--foreground)]">
            Why Choose AI English Practice?
          </h2>
          <p className="text-xl max-w-3xl mx-auto text-muted">
            Experience the future of language learning with personalized AI
            tutoring
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="card-theme rounded-2xl p-8 text-center hover:transform hover:scale-105 transition-all duration-200"
            >
              <div className="mb-6 flex justify-center">{benefit.icon}</div>

              <h3 className="text-xl font-bold mb-4 text-[var(--foreground)]">
                {benefit.title}
              </h3>

              <p className="leading-relaxed text-muted">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
