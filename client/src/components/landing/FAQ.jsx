import { useState } from "react";
import { useTheme } from "../../Context/ThemeContext";

const faqs = [
  {
    question: "How do I add family members to Doc Vault?",
    answer:
      "You must first create an account, then create a family from your dashboard. Once your family is set up, you can invite members via email or a shared invite link. Invited members will need their own account to accept the invite and access shared documents.",
  },
  {
    question: "What types of documents are supported?",
    answer: "FORMAT_BADGES",
  },
  {
    question: "How do I upload a document?",
    answer:
      "Go to your dashboard and click Upload Document. Select a file or drag and drop it into the vault. Add a label or category if needed, then save — your file is encrypted and stored instantly.",
  },
  {
    question: "Is there a file size limit?",
    answer:
      "Yes. Each file upload is limited to 10 MB. For most PDFs and scanned documents this is more than enough. Try compressing larger files before uploading.",
  },
  {
    question: "Do all family members need their own account?",
    answer:
      "Yes. Every member who wants access to the shared vault needs their own Doc Vault account. If a member is removed from the family, their access is revoked automatically.",
  },
];

const formats = [
  "PDF",
  "DOC / DOCX",
  "JPG / PNG",
  "XLS / XLSX",
  "PPT / PPTX",
  "TXT",
  "TIFF",
  "WEBP",
];

function FormatBadgesAnswer({ isDark }) {
  return (
    <div className="space-y-3">
      <p>Doc Vault supports the following file formats:</p>
      <div className="flex flex-wrap gap-2">
        {formats.map((f) => (
          <span
            key={f}
            className={`px-2.5 py-1 rounded-md text-xs border ${
              isDark
                ? "bg-zinc-800 border-zinc-700 text-zinc-300"
                : "bg-gray-100 border-gray-200 text-gray-600"
            }`}
          >
            {f}
          </span>
        ))}
      </div>
      <p>
        All formats can be viewed directly within the app — no need to download
        first.
      </p>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);
  const { isDark } = useTheme();

  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section
      id="faq"
      className={`w-full py-18 px-6 md:px-16 ${
        isDark
          ? "bg-gradient-to-b from-[#020617] to-[#0f172a]"
          : "bg-gradient-to-b from-gray-50 to-white"
      }`}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center md:items-start md:flex-row md:gap-28">
          <div className="md:w-64 flex-shrink-0 text-center md:text-left md:top-28 md:self-start md:pt-10 md:-ml-4">
            <h2
              className={`flex flex-col gap-4 text-4xl md:text-5xl font-semibold tracking-tight ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              <span>Frequently</span>
              <span>Asked</span>
              <span>Questions</span>
            </h2>
          </div>

          {/* Right — Questions */}
          <div className="flex-1 w-full mt-14 md:mt-0 md:pt-10">
            <ul className="w-full">
              {faqs.map((faq, i) => {
                const isOpen = openIndex === i;
                return (
                  <li
                    key={i}
                    className={`border-b ${
                      isDark ? "border-zinc-800/70" : "border-gray-200"
                    }`}
                  >
                    <button
                      onClick={() => toggle(i)}
                      className="w-full flex items-center justify-between gap-6 py-6 text-left group"
                    >
                      <span
                        className={`text-sm md:text-base font-medium transition-all duration-200 ${
                          isDark
                            ? isOpen
                              ? "text-white [text-shadow:0_0_14px_rgba(255,255,255,0.5)]"
                              : "text-zinc-400 group-hover:text-white group-hover:[text-shadow:0_0_8px_rgba(255,255,255,0.3)]"
                            : isOpen
                              ? "text-gray-900"
                              : "text-gray-500 group-hover:text-gray-900"
                        }`}
                      >
                        {faq.question}
                      </span>

                      <span
                        className={`flex-shrink-0 w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-300 ${
                          isDark
                            ? isOpen
                              ? "border-white/30 bg-white/10 rotate-45"
                              : "border-zinc-700 group-hover:border-zinc-500"
                            : isOpen
                              ? "border-gray-400 bg-gray-100 rotate-45"
                              : "border-gray-300 group-hover:border-gray-400"
                        }`}
                      >
                        <svg
                          className={`w-3 h-3 transition-colors ${
                            isDark
                              ? isOpen
                                ? "text-white"
                                : "text-zinc-500 group-hover:text-zinc-300"
                              : isOpen
                                ? "text-gray-700"
                                : "text-gray-400 group-hover:text-gray-600"
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                      </span>
                    </button>

                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        isOpen
                          ? "max-h-96 opacity-100 pb-6"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      <div
                        className={`text-sm md:text-base leading-relaxed ${
                          isDark ? "text-zinc-400" : "text-gray-500"
                        }`}
                      >
                        {faq.answer === "FORMAT_BADGES" ? (
                          <FormatBadgesAnswer isDark={isDark} />
                        ) : (
                          faq.answer
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
