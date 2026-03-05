import { Lock, Shield, Users, FolderOpen, Cloud, Share2 } from "lucide-react";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { useTheme } from "../../Context/ThemeContext";

export default function Features() {
  const { isDark } = useTheme();

  return (
    <section
      id="features"
      className={`w-full px-6 py-20 lg:px-16 lg:py-28 transition-colors duration-300 ${
        isDark ? "bg-[#080c14]" : "bg-gray-50"
      }`}
    >
      {/* Header */}
      <div className="text-center mb-12">
        <span
          className={`inline-block text-xs font-semibold tracking-[0.2em] uppercase mb-4 px-4 py-1.5 rounded-full border ${
            isDark
              ? "text-blue-400 border-blue-400/20 bg-blue-400/5"
              : "text-blue-600 border-blue-200 bg-blue-50"
          }`}
        >
          Features
        </span>
        <h2
          className={`text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-4 ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          Everything you need
        </h2>
        <p
          className={`text-lg max-w-xl mx-auto leading-relaxed font-light ${
            isDark ? "text-white/45" : "text-gray-500"
          }`}
        >
          Securely store, organize, and share your family's important documents.
        </p>
      </div>

      {/* Grid */}
      <ul className="grid grid-cols-1 gap-5 md:grid-cols-12 md:auto-rows-[minmax(16rem,auto)] lg:gap-6">
        <GridItem
          area="md:col-span-4"
          icon={Shield}
          iconBg="bg-blue-500/80"
          title="Military-Grade Security"
          description="Documents protected with 256-bit AES encryption at rest and in transit."
          isDark={isDark}
        />
        <GridItem
          area="md:col-span-4"
          icon={Users}
          iconBg="bg-teal-500/80"
          title="Family Groups"
          description="Create secure vaults and invite family members with role-based access."
          isDark={isDark}
        />
        <GridItem
          area="md:col-span-4"
          icon={Lock}
          iconBg="bg-green-500/80"
          title="PIN Protection"
          description="Extra security with PIN-protected family vaults and biometric support."
          isDark={isDark}
        />
        <GridItem
          area="md:col-span-5"
          icon={FolderOpen}
          iconBg="bg-orange-500/80"
          title="Smart Categories"
          description="Auto-organize by type: passports, insurance, property, medical records, and more."
          isDark={isDark}
        />
        <GridItem
          area="md:col-span-4"
          icon={Cloud}
          iconBg="bg-cyan-500/80"
          title="Cloud Storage"
          description="Access documents from any device with automatic encrypted backup."
          isDark={isDark}
        />
        <GridItem
          area="md:col-span-3"
          icon={Share2}
          iconBg="bg-pink-500/80"
          title="Easy Sharing"
          description="Share documents securely with family in one click."
          isDark={isDark}
        />
      </ul>
    </section>
  );
}

const GridItem = ({ area, icon: Icon, iconBg, title, description, isDark }) => {
  return (
    <li className={`list-none ${area}`}>
      <div
        className={`relative h-full rounded-2xl border p-[1px] ${
          isDark ? "border-white/[0.08]" : "border-gray-200"
        }`}
      >
        {isDark && (
          <GlowingEffect
            spread={40}
            glow={true}
            disabled={false}
            proximity={64}
            inactiveZone={0.01}
          />
        )}
        <div
          className={`relative h-full rounded-2xl p-8 flex flex-col gap-6 overflow-hidden group ${
            isDark
              ? "bg-gradient-to-b from-white/[0.06] to-white/[0.02]"
              : "bg-white shadow-sm"
          }`}
        >
          {/* Ambient blob */}
          <div
            className={`absolute -top-10 -right-10 w-36 h-36 rounded-full blur-3xl transition-opacity duration-500 ${iconBg} ${
              isDark
                ? "opacity-[0.12] group-hover:opacity-[0.22]"
                : "opacity-[0.08] group-hover:opacity-[0.15]"
            }`}
          />

          {/* Icon */}
          <div
            className={`relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center shadow-md flex-shrink-0 ${iconBg} ${
              isDark ? "ring-1 ring-white/10" : "ring-1 ring-black/5"
            }`}
          >
            <Icon className="w-7 h-7 text-white" strokeWidth={1.7} />
          </div>

          {/* Text */}
          <div className="relative z-10 flex flex-col gap-3">
            <h3
              className={`font-semibold text-lg leading-snug tracking-tight ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {title}
            </h3>
            <p
              className={`text-base leading-relaxed font-light ${
                isDark ? "text-white/45" : "text-gray-500"
              }`}
            >
              {description}
            </p>
          </div>

          {/* Bottom accent line on hover */}
          <div
            className={`absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-500 ease-out ${iconBg}`}
          />
        </div>
      </div>
    </li>
  );
};
