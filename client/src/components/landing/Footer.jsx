import { Github, Twitter, Linkedin, Mail } from "lucide-react";
import { useTheme } from "../../Context/ThemeContext";

const links = {
  Product: ["Features", "Upload Documents", "Family Vault", "FAQ"],
  Company: ["About", "Contact"],
  Legal: ["Privacy Policy", "Terms of Use"],
};

const socials = [
  { icon: Twitter, href: "#" },
  { icon: Linkedin, href: "#" },
  { icon: Github, href: "#" },
  { icon: Mail, href: "mailto:docvault@kiit.ac.in" },
];

export default function Footer() {
  const { isDark } = useTheme();

  return (
    <footer
      className={`w-full px-6 md:px-16 pt-20 pb-10 border-t ${
        isDark
          ? "bg-gradient-to-b from-[#0f172a] via-[#0b1120] to-[#070b14] border-zinc-800/40"
          : "bg-gradient-to-b from-white via-gray-50 to-gray-100 border-gray-200"
      }`}
    >
      <div className="max-w-6xl mx-auto">
        {/* Main Row */}
        <div className="flex flex-col gap-14 md:flex-row md:justify-between">
          {/* Left — Brand */}
          <div className="flex flex-col gap-6 md:max-w-[240px]">
            <div>
              <h3
                className={`text-2xl font-bold tracking-tight ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Doc Vault
              </h3>
              <p
                className={`mt-3 text-base leading-relaxed ${
                  isDark ? "text-zinc-400" : "text-gray-500"
                }`}
              >
                Secure storage for your family's important documents.
              </p>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {socials.map(({ icon: Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className={`w-10 h-10 rounded-md border flex items-center justify-center transition-all duration-200 ${
                    isDark
                      ? "bg-zinc-800/80 hover:bg-zinc-700 border-zinc-700/50 hover:border-zinc-500 text-zinc-400 hover:text-white"
                      : "bg-gray-100 hover:bg-gray-200 border-gray-200 hover:border-gray-300 text-gray-500 hover:text-gray-900"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Vertical Divider — desktop only */}
          <div
            className={`hidden md:block w-px self-stretch mx-4 ${
              isDark ? "bg-zinc-800/70" : "bg-gray-200"
            }`}
          />

          {/* Right — Link Columns */}
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-10 md:pl-4">
            {Object.entries(links).map(([section, items]) => (
              <div key={section} className="flex flex-col gap-5">
                <h4
                  className={`text-sm font-semibold uppercase tracking-widest ${
                    isDark ? "text-zinc-300" : "text-gray-700"
                  }`}
                >
                  {section}
                </h4>
                <ul className="flex flex-col gap-3.5">
                  {items.map((item) => (
                    <li key={item}>
                      <a
                        href="#"
                        className={`text-base transition-colors duration-200 ${
                          isDark
                            ? "text-zinc-500 hover:text-white"
                            : "text-gray-400 hover:text-gray-900"
                        }`}
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Divider + Bottom Bar */}
        <div
          className={`border-t mt-16 pt-7 flex flex-col sm:flex-row items-center justify-between gap-3 ${
            isDark ? "border-zinc-800/50" : "border-gray-200"
          }`}
        >
          <p
            className={`text-sm text-center sm:text-left ${
              isDark ? "text-zinc-600" : "text-gray-400"
            }`}
          >
            &copy; {new Date().getFullYear()} Doc Vault &middot; KIIT
            University, Patia, Bhubaneswar — 751024
          </p>
          <a
            href="#"
            className={`text-sm transition-colors duration-200 ${
              isDark
                ? "text-zinc-600 hover:text-white"
                : "text-gray-400 hover:text-gray-900"
            }`}
          >
            Sitemap
          </a>
        </div>
      </div>
    </footer>
  );
}
