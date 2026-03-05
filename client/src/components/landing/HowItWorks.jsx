import { Link } from "react-router-dom";
import { motion, useAnimationFrame, useMotionValue } from "framer-motion";
import {
  UserPlus,
  Users,
  Upload,
  Share2,
  CheckCircle,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import { useRef, useState } from "react";
import { useTheme } from "../../Context/ThemeContext";

/* Infinite Horizontal Loop */
const InfiniteTrack = ({ children, speed = 40, isDark }) => {
  const trackRef = useRef(null);
  const x = useMotionValue(0);
  const [paused, setPaused] = useState(false);

  useAnimationFrame((_, delta) => {
    if (paused) return;
    const track = trackRef.current;
    if (!track) return;
    const halfWidth = track.scrollWidth / 2;
    let next = x.get() - (delta / 1000) * speed;
    if (Math.abs(next) >= halfWidth) next = 0;
    x.set(next);
  });

  return (
    <div
      className="overflow-hidden relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className={`absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none bg-gradient-to-r ${
          isDark ? "from-[#080c14]" : "from-gray-50"
        } to-transparent`}
      />
      <div
        className={`absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none bg-gradient-to-l ${
          isDark ? "from-[#080c14]" : "from-gray-50"
        } to-transparent`}
      />

      <motion.div
        ref={trackRef}
        style={{ x }}
        className="flex gap-5 w-max py-4"
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
};

/* Step Card */
const StepCard = ({ step, isLast, isDark }) => {
  const Icon = step.icon;
  return (
    <div className="flex items-center gap-5 flex-shrink-0">
      <motion.div
        className={`group relative w-380px rounded-2xl border transition-all duration-300 p-6 flex flex-col gap-4 overflow-hidden cursor-default ${
          isDark
            ? "bg-gradient-to-b from-white/[0.07] to-white/[0.03] border-white/10 hover:border-white/20"
            : "bg-white border-gray-200 hover:border-gray-300 shadow-sm"
        }`}
        whileHover={{ scale: 1.03, y: -4 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        {/* Ambient blob */}
        <div
          className={`absolute -top-8 -right-8 w-28 h-28 rounded-full blur-2xl transition-opacity duration-500 ${step.blob} ${
            isDark
              ? "opacity-10 group-hover:opacity-20"
              : "opacity-5 group-hover:opacity-10"
          }`}
        />

        <div className="flex items-start justify-between">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${
              isDark ? "ring-1 ring-white/10" : "ring-1 ring-black/5"
            } ${step.iconBg}`}
          >
            <Icon className="w-6 h-6 text-white" strokeWidth={1.8} />
          </div>
          <span
            className={`text-3xl font-black tracking-tighter transition-opacity duration-300 ${
              isDark
                ? `${step.numColor} opacity-30 group-hover:opacity-50`
                : `${step.numColorLight || step.numColor} opacity-20 group-hover:opacity-40`
            }`}
          >
            {step.step}
          </span>
        </div>

        <div>
          <h3
            className={`font-semibold text-base leading-snug mb-1.5 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {step.title}
          </h3>
          <p
            className={`text-sm leading-relaxed font-light ${
              isDark ? "text-white/45" : "text-gray-500"
            }`}
          >
            {step.description}
          </p>
        </div>

        <div
          className={`absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-500 ease-out rounded-b-2xl ${step.accent}`}
        />
      </motion.div>

      {!isLast && (
        <div
          className={`flex items-center gap-1 flex-shrink-0 ${
            isDark ? "text-white/20" : "text-gray-300"
          }`}
        >
          <ChevronRight className="w-5 h-5" />
          <ChevronRight className="w-5 h-5 -ml-3" />
        </div>
      )}
    </div>
  );
};

/* HowItWorks */
const HowItWorks = () => {
  const { isDark } = useTheme();

  const steps = [
    {
      step: "01",
      icon: UserPlus,
      title: "Create Account",
      description:
        "Sign up in seconds with your email. No credit card required.",
      iconBg: "bg-blue-500/80",
      blob: "bg-blue-500",
      accent: "bg-gradient-to-r from-blue-500 to-blue-400",
      numColor: "text-blue-400",
      numColorLight: "text-blue-500",
    },
    {
      step: "02",
      icon: Users,
      title: "Create Family Vault",
      description:
        "Set up your secure vault and protect it with a custom PIN.",
      iconBg: "bg-teal-500/80",
      blob: "bg-teal-500",
      accent: "bg-gradient-to-r from-teal-500 to-teal-400",
      numColor: "text-teal-400",
      numColorLight: "text-teal-500",
    },
    {
      step: "03",
      icon: Upload,
      title: "Upload Documents",
      description:
        "Upload, categorize and organize all your important files.",
      iconBg: "bg-green-500/80",
      blob: "bg-green-500",
      accent: "bg-gradient-to-r from-green-500 to-green-400",
      numColor: "text-green-400",
      numColorLight: "text-green-500",
    },
    {
      step: "04",
      icon: Share2,
      title: "Invite & Share",
      description:
        "Invite family members via email and share documents instantly.",
      iconBg: "bg-orange-500/80",
      blob: "bg-orange-500",
      accent: "bg-gradient-to-r from-orange-500 to-orange-400",
      numColor: "text-orange-400",
      numColorLight: "text-orange-500",
    },
  ];

  return (
    <section
      id="how-it-works"
      className={`relative py-24 overflow-hidden transition-colors duration-300 ${
        isDark ? "bg-[#080c14]" : "bg-gray-50"
      }`}
    >
      {/* Background grid */}
      <div
        className={`absolute inset-0 ${isDark ? "opacity-[0.04]" : "opacity-[0.4]"}`}
        style={{
          backgroundImage: isDark
            ? "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)"
            : "linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      {/* Ambient glow */}
      <div
        className={`absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full blur-[120px] pointer-events-none ${
          isDark ? "bg-teal-600/8" : "bg-teal-200/30"
        }`}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <span
            className={`inline-block text-xs font-semibold tracking-[0.2em] uppercase mb-4 px-4 py-1.5 rounded-full border ${
              isDark
                ? "text-teal-400 border-teal-400/20 bg-teal-400/5"
                : "text-teal-600 border-teal-200 bg-teal-50"
            }`}
          >
            How It Works
          </span>
          <h2
            className={`text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-5 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Get started in{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-400">
              4 simple steps
            </span>
          </h2>
          <p
            className={`text-lg max-w-xl mx-auto leading-relaxed font-light ${
              isDark ? "text-white/45" : "text-gray-500"
            }`}
          >
            Setting up your family document vault is quick, easy, and takes less
            than 2 minutes.
          </p>
        </motion.div>
      </div>

      {/* Infinite horizontal loop */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <InfiniteTrack speed={38} isDark={isDark}>
          {steps.map((step, i) => (
            <StepCard
              key={`${step.step}-a-${i}`}
              step={step}
              isLast={i === steps.length - 1}
              isDark={isDark}
            />
          ))}
        </InfiniteTrack>
      </motion.div>

      <p
        className={`text-center text-sm mt-4 mb-16 tracking-widest uppercase ${
          isDark ? "text-white/20" : "text-gray-400"
        }`}
      >
        Hover to pause
      </p>

      {/* CTA Section */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className={`relative rounded-2xl overflow-hidden border ${
            isDark ? "border-white/10" : "border-gray-200"
          }`}
        >
          <div
            className={`absolute inset-0 ${
              isDark
                ? "bg-gradient-to-br from-white/[0.06] via-white/[0.03] to-transparent backdrop-blur-sm"
                : "bg-gradient-to-br from-gray-50 to-white"
            }`}
          />
          <div
            className={`absolute -top-20 -left-20 w-72 h-72 rounded-full blur-3xl pointer-events-none ${
              isDark ? "bg-blue-500/10" : "bg-blue-100/40"
            }`}
          />
          <div
            className={`absolute -bottom-20 -right-20 w-72 h-72 rounded-full blur-3xl pointer-events-none ${
              isDark ? "bg-teal-500/10" : "bg-teal-100/40"
            }`}
          />

          <div className="relative z-10 grid lg:grid-cols-2 gap-8 items-center p-8 lg:p-12">
            <div>
              <h3
                className={`text-2xl lg:text-3xl font-bold mb-3 tracking-tight ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Ready to get started?
              </h3>
              <p
                className={`mb-6 leading-relaxed ${
                  isDark ? "text-white/45" : "text-gray-500"
                }`}
              >
                Secure your family's important documents today. No setup
                complexity, no hassle.
              </p>
              <ul className="space-y-2.5 mb-8">
                {[
                  "No credit card required",
                  "Free 14-day trial",
                  "Cancel anytime",
                ].map((item) => (
                  <li
                    key={item}
                    className={`flex items-center gap-2.5 text-sm ${
                      isDark ? "text-white/60" : "text-gray-600"
                    }`}
                  >
                    <CheckCircle className="w-4 h-4 text-teal-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/auth">
                <motion.span
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-shadow cursor-pointer text-sm"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Start Free Trial
                  <ArrowRight className="w-4 h-4" />
                </motion.span>
              </Link>
            </div>

            {/* Right mock UI */}
            <div className="hidden lg:block">
              <div
                className={`rounded-xl p-5 ${
                  isDark
                    ? "bg-white/[0.05] border border-white/10"
                    : "bg-gray-50 border border-gray-200"
                }`}
              >
                <div className="flex items-center gap-1.5 mb-4">
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${
                      isDark ? "bg-white/20" : "bg-gray-300"
                    }`}
                  />
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${
                      isDark ? "bg-white/20" : "bg-gray-300"
                    }`}
                  />
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${
                      isDark ? "bg-white/20" : "bg-gray-300"
                    }`}
                  />
                </div>
                <div className="space-y-2.5">
                  {[
                    { label: "Passport", color: "bg-blue-500/60", w: "w-3/4" },
                    {
                      label: "Insurance",
                      color: "bg-teal-500/60",
                      w: "w-2/3",
                    },
                    {
                      label: "Property",
                      color: "bg-green-500/60",
                      w: "w-4/5",
                    },
                  ].map((row) => (
                    <div
                      key={row.label}
                      className={`flex items-center gap-3 p-3 rounded-lg border ${
                        isDark
                          ? "bg-white/[0.05] border-white/[0.06]"
                          : "bg-white border-gray-100"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-lg ${row.color} flex-shrink-0`}
                      />
                      <div className="flex-1 space-y-1.5">
                        <div
                          className={`h-2.5 rounded-full ${row.w} ${
                            isDark ? "bg-white/30" : "bg-gray-200"
                          }`}
                        />
                        <div
                          className={`h-2 rounded-full w-1/2 ${
                            isDark ? "bg-white/15" : "bg-gray-100"
                          }`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
