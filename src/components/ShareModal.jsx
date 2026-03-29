import { Copy } from "lucide-react";
import { useState } from "react";

export default function ShareModal({ isOpen, onClose, link, title }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(link);
    setCopied(true);

    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/30 backdrop-blur-md">
      <div className="bg-white w-full max-w-md rounded-xl shadow-xl p-6 relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 text-lg"
          >
            ✕
          </button>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-500 mb-4">
          Share this link with others to give them access to this file:
        </p>

        {/* Link Box */}
        <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50">
          <input
            type="text"
            value={link}
            readOnly
            className="flex-1 bg-transparent outline-none text-sm text-gray-700"
          />

          <button
            onClick={handleCopy}
            className="ml-2 p-2 rounded-md hover:bg-gray-200 transition"
          >
            <Copy size={16} />
          </button>
        </div>
        {copied ? (
          <p className="text-xs text-green-400 mt-2">
            Link copied successfully!
          </p>
        ) : null}
        <p className="text-xs text-gray-400 mt-2">
          Anyone with this link can access this file.
        </p>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
          >
            Close
          </button>

          <button
            onClick={handleCopy}
            className="px-5 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700 transition"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>
    </div>
  );
}
