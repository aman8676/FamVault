import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Users, FileText, ArrowRight, CheckCircle } from "lucide-react";
import { useTheme } from "../../Context/ThemeContext";

const Hero = () => {
  const { isDark } = useTheme();

  const features = ["Secure Storage", "Family Sharing", "PIN Protection"];

  const documents = [
    { name: "Property Deed.pdf", category: "Property", color: "bg-blue-500" },
    {
      name: "Health Insurance.pdf",
      category: "Insurance",
      color: "bg-green-500",
    },
    { name: "Passport - John.pdf", category: "ID", color: "bg-orange-500" },
  ];

  return (
    <div className={`min-h-screen w-full relative ${isDark ? "bg-black" : "bg-gradient-to-b from-gray-50 to-white"}`}>
      {/* Background glow - dark mode */}
      {isDark && (
        <div
          className="absolute inset-0 z-0"
          style={{
            background:
              "radial-gradient(70% 55% at 50% 50%, #2a5d77 0%, #184058 18%, #0f2a43 34%, #0a1b30 50%, #071226 66%, #040d1c 80%, #020814 92%, #01040d 97%, #000309 100%)",
          }}
        />
      )}
      {/* Background glow - light mode */}
      {!isDark && (
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-teal-100/60 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-100/60 rounded-full blur-[120px]" />
        </div>
      )}

      <section
        id="hero"
        className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden"
      >
        <div className="relative w-full max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center lg:text-left"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className={`inline-flex items-center gap-2 px-4 py-2 backdrop-blur-md rounded-full text-lg font-medium mb-6 border ${
                  isDark
                    ? "bg-white/10 text-white border-white/20"
                    : "bg-white/80 text-gray-800 border-gray-200 shadow-sm"
                }`}
              >
                <Shield className={`w-6 h-6 ${isDark ? "text-teal-400" : "text-teal-600"}`} />
                <p>Secure Document Management</p>
              </motion.div>

              <h1
                className={`text-5xl lg:text-6xl font-bold leading-tight mb-6 ${
                  isDark ? "text-gray-300" : "text-gray-900"
                }`}
              >
                Your Family's
                <span
                  className={`block mt-1 ${
                    isDark
                      ? "text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-400"
                      : "text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-600"
                  }`}
                >
                  Documents, Secured
                </span>
              </h1>

              <p
                className={`text-xl leading-relaxed max-w-lg mx-auto lg:mx-0 mb-8 ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Store, organize, and share important documents with your family.
                Protected with military-grade encryption.
              </p>

              {/* Feature Chips */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-5 mb-8">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className={`flex items-center gap-2 text-lg ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>{feature}</span>
                  </motion.div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Link to="/auth">
                  <motion.span
                    className="group px-6 py-3 bg-gradient-to-r from-teal-500 to-blue-600 text-white font-medium rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-teal-500/20 hover:shadow-teal-500/40"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Get Started Free
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </motion.span>
                </Link>
                <motion.a
                  href="#how-it-works"
                  className={`px-6 py-3 font-medium rounded-lg border transition-all flex items-center justify-center ${
                    isDark
                      ? "bg-white/5 text-white border-white/20 hover:bg-white/10"
                      : "bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  How It Works
                </motion.a>
              </div>
            </motion.div>

            {/* Right Content - Visual */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative">
                {/* Main Card */}
                <div
                  className={`rounded-2xl shadow-xl border p-6 ${
                    isDark
                      ? "bg-slate-900/80 backdrop-blur-sm border-white/10 shadow-black/40"
                      : "bg-white border-gray-200 shadow-gray-200/60"
                  }`}
                >
                  {/* Family Header */}
                  <div
                    className={`flex items-center gap-3 mb-6 pb-4 border-b ${
                      isDark ? "border-white/10" : "border-gray-100"
                    }`}
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-teal-500 rounded-xl flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3
                        className={`font-semibold ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}
                      >
                        Agarwal Family
                      </h3>
                      <p
                        className={`text-sm ${
                          isDark ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        4 members
                      </p>
                    </div>
                  </div>

                  {/* Document List */}
                  <div className="space-y-3">
                    {documents.map((doc, index) => (
                      <motion.div
                        key={doc.name}
                        initial={{ opacity: 0, x: 15 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className={`flex items-center gap-3 p-3 rounded-lg transition-colors cursor-pointer ${
                          isDark
                            ? "bg-white/5 hover:bg-white/10"
                            : "bg-gray-50 hover:bg-gray-100"
                        }`}
                      >
                        <div
                          className={`w-10 h-10 ${doc.color} rounded-lg flex items-center justify-center`}
                        >
                          <FileText className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className={`font-medium text-sm truncate ${
                              isDark ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {doc.name}
                          </p>
                          <p
                            className={`text-xs ${
                              isDark ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            {doc.category}
                          </p>
                        </div>
                        <Shield className="w-4 h-4 text-green-500" />
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Floating Badge */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 3,
                    ease: "easeInOut",
                  }}
                  className="absolute -top-4 -right-4 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg"
                >
                  <div className="flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5" />
                    Encrypted
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;
