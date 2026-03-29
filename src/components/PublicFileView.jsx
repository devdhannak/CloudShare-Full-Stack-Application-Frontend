import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiEndpoints } from "../util/apiEndpoints";
import toast from "react-hot-toast";
import {
  Copy,
  Share2,
  Download,
  FileText,
  FileImage,
  FileVideo,
  FileAudio,
  File,
  X,
  Check,
  AlertCircle,
  Loader2,
} from "lucide-react";

// ── helpers ──────────────────────────────────────────────────────────────────

const getFileCategory = (mimeType = "", name = "") => {
  if (!mimeType && name) {
    const ext = name.split(".").pop().toLowerCase();
    const map = {
      pdf: "pdf",
      png: "image",
      jpg: "image",
      jpeg: "image",
      gif: "image",
      webp: "image",
      svg: "image",
      mp4: "video",
      webm: "video",
      mov: "video",
      mp3: "audio",
      wav: "audio",
      ogg: "audio",
      txt: "text",
      md: "text",
      csv: "text",
      json: "text",
      xml: "text",
    };
    return map[ext] ?? "other";
  }
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("video/")) return "video";
  if (mimeType.startsWith("audio/")) return "audio";
  if (mimeType === "application/pdf") return "pdf";
  if (mimeType.startsWith("text/")) return "text";
  return "other";
};

const FileIcon = ({ category, size = 48 }) => {
  const props = { size, strokeWidth: 1.5 };
  const icons = {
    image: <FileImage {...props} className="text-violet-400" />,
    video: <FileVideo {...props} className="text-rose-400" />,
    audio: <FileAudio {...props} className="text-amber-400" />,
    pdf: <FileText {...props} className="text-red-400" />,
    text: <FileText {...props} className="text-sky-400" />,
    other: <File {...props} className="text-slate-400" />,
  };
  return icons[category] ?? icons.other;
};

const formatBytes = (bytes = 0) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
  return `${(bytes / 1024 ** 3).toFixed(1)} GB`;
};

// ── sub-components ────────────────────────────────────────────────────────────

const ShareModal = ({ link, onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    toast.success("Link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Share2 size={18} className="text-blue-500" />
            Share this file
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <p className="text-sm text-gray-500">
          Anyone with this link can view and download the file.
        </p>

        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
          <span className="flex-1 text-sm text-gray-700 truncate">{link}</span>
          <button
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              copied
                ? "bg-green-100 text-green-600"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── file preview ──────────────────────────────────────────────────────────────

const FilePreview = ({ file, fileUrl }) => {
  const category = getFileCategory(file.mimeType, file.name);

  const containerClass =
    "w-full rounded-2xl overflow-hidden bg-gray-900 flex items-center justify-center";

  if (category === "image") {
    return (
      <div className={`${containerClass} max-h-[70vh]`}>
        <img
          src={fileUrl}
          alt={file.name}
          className="max-w-full max-h-[70vh] object-contain"
        />
      </div>
    );
  }

  if (category === "video") {
    return (
      <div className={containerClass}>
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video controls className="w-full max-h-[70vh]" src={fileUrl}>
          Your browser does not support video playback.
        </video>
      </div>
    );
  }

  if (category === "audio") {
    return (
      <div className="w-full rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 flex flex-col items-center justify-center gap-6 p-12">
        <FileAudio size={64} strokeWidth={1} className="text-amber-400" />
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <audio controls className="w-full max-w-sm" src={fileUrl}>
          Your browser does not support audio playback.
        </audio>
      </div>
    );
  }

  if (category === "pdf") {
    return (
      <div
        className="w-full rounded-2xl overflow-hidden border border-gray-200 bg-gray-100"
        style={{ height: "75vh" }}
      >
        <iframe
          src={`${fileUrl}#toolbar=1`}
          className="w-full h-full"
          title={file.name}
        />
      </div>
    );
  }

  if (category === "text") {
    return (
      <div
        className="w-full rounded-2xl overflow-hidden border border-gray-200 bg-gray-100"
        style={{ height: "75vh" }}
      >
        <iframe src={fileUrl} className="w-full h-full" title={file.name} />
      </div>
    );
  }

  // Fallback — unsupported preview
  return (
    <div className="w-full rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-4 p-16 text-center">
      <FileIcon category={category} size={64} />
      <div>
        <p className="text-gray-700 font-medium">Preview not available</p>
        <p className="text-sm text-gray-400 mt-1">
          Download the file to open it on your device.
        </p>
      </div>
    </div>
  );
};

// ── main component ────────────────────────────────────────────────────────────

const PublicFileView = () => {
  const [file, setFile] = useState(null);
  const { fileId } = useParams();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const { getToken } = useAuth();

  // Derived: build a public URL for previewing the file if your API supports it
  const filePreviewUrl = file ? apiEndpoints.DOWNLOAD_FILE(fileId) : null;

  useEffect(() => {
    const getFile = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(apiEndpoints.PUBLIC_FILE_VIEW(fileId));
        setFile(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching file:", err);
        setError(
          "Could not retrieve file. The link may be invalid or the file may have been removed.",
        );
      } finally {
        setIsLoading(false);
      }
    };
    getFile();
  }, [fileId, getToken]);

  // ── BUG FIX: `new Blob[response.data]()` → `new Blob([response.data])`
  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const response = await axios.get(apiEndpoints.DOWNLOAD_FILE(fileId), {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", file.name);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Download started!");
    } catch (err) {
      console.error("Download failed:", err);
      toast.error("Sorry, the file could not be downloaded.");
    } finally {
      setIsDownloading(false);
    }
  };

  // ── loading state ──────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50 gap-3">
        <Loader2 size={32} className="text-blue-500 animate-spin" />
        <p className="text-gray-500 text-sm">Loading file…</p>
      </div>
    );
  }

  // ── error state ────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 p-4">
        <div className="text-center p-10 bg-white rounded-2xl shadow-lg max-w-sm w-full space-y-3">
          <div className="flex justify-center">
            <AlertCircle size={40} className="text-red-400" />
          </div>
          <h2 className="text-lg font-semibold text-gray-800">
            File unavailable
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed">{error}</p>
        </div>
      </div>
    );
  }

  if (!file) return null;

  const category = getFileCategory(file.mimeType, file.name);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* ── header ── */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-gray-100 px-4 py-3">
        <div className="container mx-auto max-w-4xl flex justify-between items-center">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <Share2 size={20} className="text-blue-600" />
            <span className="font-bold text-gray-800 text-lg">CloudShare</span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShareModalOpen(true)}
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-medium transition-colors"
            >
              <Copy size={15} />
              <span className="hidden sm:inline">Copy link</span>
            </button>
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-xl text-sm font-medium transition-colors"
            >
              {isDownloading ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Download size={15} />
              )}
              {isDownloading ? "Downloading…" : "Download"}
            </button>
          </div>
        </div>
      </header>

      {/* ── main ── */}
      <main className="container mx-auto max-w-4xl px-4 py-8 space-y-6">
        {/* File meta card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
          <div className="flex-shrink-0">
            <FileIcon category={category} size={44} />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-semibold text-gray-900 truncate">
              {file.name}
            </h1>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs text-gray-400">
              {file.size != null && <span>{formatBytes(file.size)}</span>}
              {file.mimeType && <span>{file.mimeType}</span>}
              {file.createdAt && (
                <span>
                  Shared{" "}
                  {new Date(file.createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* File preview */}
        <FilePreview file={file} fileUrl={filePreviewUrl} />
      </main>

      {/* ── share modal ── */}
      {shareModalOpen && (
        <ShareModal
          link={window.location.href}
          onClose={() => setShareModalOpen(false)}
        />
      )}
    </div>
  );
};

export default PublicFileView;
