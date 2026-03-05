import { motion } from "framer-motion";
import { Shield, Lock, Eye, Server, Key, CheckCircle } from "lucide-react";
import { Meteors } from "@/components/ui/meteors.jsx";
import { useTheme } from "../../Context/ThemeContext";

const securityFeatures = [
  {
    icon: Shield,
    title: "256-bit AES Encryption",
    description:
      "Military-grade encryption — the same standard used by banks and governments worldwide.",
    color: "from-blue-500 to-blue-600",
    glow: "bg-blue-500",
    iconColor: "text-blue-400",
    iconColorLight: "text-blue-600",
    iconBg: "bg-blue-500/15 border-blue-500/30",
    iconBgLight: "bg-blue-100 border-blue-200",
  },
  {
    icon: Lock,
    title: "PIN-Protected Vaults",
    description:
      "Each family vault is shielded by a secure PIN with optional biometric authentication.",
    color: "from-teal-500 to-teal-600",
    glow: "bg-teal-500",
    iconColor: "text-teal-400",
    iconColorLight: "text-teal-600",
    iconBg: "bg-teal-500/15 border-teal-500/30",
    iconBgLight: "bg-teal-100 border-teal-200",
  },
  {
    icon: Eye,
    title: "Privacy Controls",
    description:
      "Granular visibility settings — keep documents private or share within your trusted family group.",
    color: "from-green-500 to-green-600",
    glow: "bg-green-500",
    iconColor: "text-green-400",
    iconColorLight: "text-green-600",
    iconBg: "bg-green-500/15 border-green-500/30",
    iconBgLight: "bg-green-100 border-green-200",
  },
  {
    icon: Server,
    title: "Secure Cloud Storage",
    description:
      "Enterprise-grade infrastructure with redundant backups and 99.9% uptime guarantee.",
    color: "from-cyan-500 to-cyan-600",
    glow: "bg-cyan-500",
    iconColor: "text-cyan-400",
    iconColorLight: "text-cyan-600",
    iconBg: "bg-cyan-500/15 border-cyan-500/30",
    iconBgLight: "bg-cyan-100 border-cyan-200",
  },
  {
    icon: Key,
    title: "JWT Authentication",
    description:
      "Secure token-based authentication using HTTP-only cookies — no exposure in local storage.",
    color: "from-orange-500 to-orange-600",
    glow: "bg-orange-500",
    iconColor: "text-orange-400",
    iconColorLight: "text-orange-600",
    iconBg: "bg-orange-500/15 border-orange-500/30",
    iconBgLight: "bg-orange-100 border-orange-200",
  },
  {
    icon: CheckCircle,
    title: "Regular Security Audits",
    description:
      "Third-party penetration testing and audits ensure your family data stays protected.",
    color: "from-pink-500 to-pink-600",
    glow: "bg-pink-500",
    iconColor: "text-pink-400",
    iconColorLight: "text-pink-600",
    iconBg: "bg-pink-500/15 border-pink-500/30",
    iconBgLight: "bg-pink-100 border-pink-200",
  },
];

const MeteorCard = ({ feature, index, isDark }) => {
  const Icon = feature.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.55,
        delay: index * 0.09,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="relative group"
    >
      {/* Outer glow blob — dark mode only */}
      {isDark && (
        <div
          className={`absolute inset-0 scale-[0.85] rounded-2xl blur-2xl opacity-20 group-hover:opacity-35 transition-opacity duration-500 ${feature.glow} bg-gradient-to-r ${feature.color}`}
        />
      )}

      <div
        className={`relative h-full min-h-[260px] rounded-2xl border transition-colors duration-300 overflow-hidden shadow-xl ${
          isDark
            ? "border-white/10 group-hover:border-white/20 bg-[#07111f]"
            : "border-gray-200 group-hover:border-gray-300 bg-white shadow-gray-200/60"
        }`}
      >
        {isDark && (
          <div className="absolute inset-0 pointer-events-none">
            <Meteors number={16} />
          </div>
        )}

        <div className="relative z-10 h-full flex flex-col gap-10 px-4 py-7">
          {/* Icon */}
          <div
            className={`w-[3.25rem] h-[3.25rem] rounded-xl border flex items-center justify-center flex-shrink-0 ${
              isDark ? feature.iconBg : feature.iconBgLight
            }`}
          >
            <Icon
              className={`w-6 h-6 ${isDark ? feature.iconColor : feature.iconColorLight}`}
              strokeWidth={1.8}
            />
          </div>

          {/* Text */}
          <div className="flex flex-col gap-3 mt-auto">
            <h3
              className={`font-semibold text-xl leading-snug tracking-tight ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {feature.title}
            </h3>
            <p
              className={`text-lg leading-relaxed font-light ${
                isDark ? "text-white/45" : "text-gray-500"
              }`}
            >
              {feature.description}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Security = () => {
  const { isDark } = useTheme();

  return (
    <section
      id="security"
      className="relative py-28 lg:py-36 overflow-hidden"
      style={{
        background: isDark
          ? "linear-gradient(160deg, #050d1a 0%, #091322 50%, #060f1c 100%)"
          : "linear-gradient(160deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)",
      }}
    >
      {/* Dot pattern */}
      <div
        className="absolute inset-0"
        style={{
          opacity: isDark ? 0.035 : 0.06,
          backgroundImage: isDark
            ? "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)"
            : "radial-gradient(circle, rgba(0,0,0,0.15) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Glow blobs */}
      {isDark ? (
        <>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-emerald-500/[0.06] rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/[0.05] rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/[0.05] rounded-full blur-[100px] pointer-events-none" />
        </>
      ) : (
        <>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-teal-300/[0.15] rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-300/[0.12] rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-300/[0.10] rounded-full blur-[100px] pointer-events-none" />
        </>
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <div
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-semibold tracking-[0.2em] uppercase mb-5 ${
              isDark
                ? "border-green-400/20 bg-green-400/5 text-green-400"
                : "border-green-500/30 bg-green-50 text-green-600"
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            Enterprise-Grade Security
          </div>
          <h2
            className={`text-5xl md:text-5xl font-bold tracking-tight leading-tight mb-5 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Your documents are always protected
          </h2>
          <p
            className={`text-xl max-w-xl mx-auto leading-relaxed font-light ${
              isDark ? "text-white/45" : "text-gray-500"
            }`}
          >
            Multiple layers of security working around the clock to keep your
            family's documents safe.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7 lg:gap-10">
          {securityFeatures.map((feature, index) => (
            <MeteorCard
              key={feature.title}
              feature={feature}
              index={index}
              isDark={isDark}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Security;
