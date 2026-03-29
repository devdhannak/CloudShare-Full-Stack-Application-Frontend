import React, { useContext, useEffect, useRef, useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import { useAuth } from "@clerk/clerk-react";
import { UserCreditsContext } from "../context/UserCreditsContext";
import axios from "axios";
import { apiEndpoints } from "../util/apiEndpoints";
import {
  Upload,
  X,
  FileText,
  FileImage,
  FileVideo,
  FileAudio,
  File,
  Share2,
  Trash2,
  Clock,
  CloudUpload,
  CheckCircle,
  AlertCircle,
  Info,
  Loader2,
} from "lucide-react";

// ── helpers ───────────────────────────────────────────────────────────────────

const formatBytes = (bytes = 0) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
  return `${(bytes / 1024 ** 3).toFixed(1)} GB`;
};

const getCategory = (type = "", name = "") => {
  if (type.startsWith("image/")) return "image";
  if (type.startsWith("video/")) return "video";
  if (type.startsWith("audio/")) return "audio";
  if (type === "application/pdf" || type.startsWith("text/")) return "doc";
  const ext = name.split(".").pop().toLowerCase();
  if (["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(ext))
    return "image";
  if (["mp4", "mov", "webm"].includes(ext)) return "video";
  if (["mp3", "wav", "ogg"].includes(ext)) return "audio";
  if (["pdf", "txt", "csv", "md", "json"].includes(ext)) return "doc";
  return "other";
};

const FileIcon = ({ type, name, size = 20 }) => {
  const cat = getCategory(type, name);
  const props = { size, strokeWidth: 1.8 };
  if (cat === "image")
    return <FileImage {...props} className="text-violet-500" />;
  if (cat === "video")
    return <FileVideo {...props} className="text-rose-500" />;
  if (cat === "audio")
    return <FileAudio {...props} className="text-amber-500" />;
  if (cat === "doc") return <FileText {...props} className="text-blue-500" />;
  return <File {...props} className="text-slate-400" />;
};

const timeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr);
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

// ── Upload Panel ──────────────────────────────────────────────────────────────

const UploadPanel = ({
  uploadFiles,
  onFileChange,
  onRemove,
  onUpload,
  uploading,
  remaining,
  MAX_FILES,
}) => {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const dt = e.dataTransfer;
    if (dt.files.length) {
      // simulate a change event
      onFileChange({ target: { files: dt.files } });
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-gray-800 flex items-center gap-2">
          <CloudUpload size={18} className="text-blue-500" />
          Upload Files
        </h2>
        <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">
          {remaining} of {MAX_FILES} slots left
        </span>
      </div>

      {/* Drop zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 py-8 cursor-pointer transition-colors
          ${
            dragging
              ? "border-blue-400 bg-blue-50"
              : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
          }`}
      >
        <Upload
          size={28}
          className={dragging ? "text-blue-500" : "text-gray-300"}
        />
        <p className="text-sm text-gray-500 font-medium">
          {dragging ? "Drop to add files" : "Drag & drop or click to browse"}
        </p>
        <p className="text-xs text-gray-400">
          Max {MAX_FILES} files per upload
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          onChange={onFileChange}
        />
      </div>

      {/* Queued files */}
      {uploadFiles.length > 0 && (
        <ul className="space-y-2 max-h-52 overflow-y-auto pr-1">
          {uploadFiles.map((file, i) => (
            <li
              key={i}
              className="flex items-center gap-3 bg-gray-50 rounded-xl px-3 py-2"
            >
              <FileIcon type={file.type} name={file.name} size={18} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-700 truncate">
                  {file.name}
                </p>
                <p className="text-xs text-gray-400">
                  {formatBytes(file.size)}
                </p>
              </div>
              <button
                onClick={() => onRemove(i)}
                className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0"
              >
                <X size={15} />
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Upload button */}
      <button
        onClick={onUpload}
        disabled={uploading || uploadFiles.length === 0}
        className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-xl transition-colors"
      >
        {uploading ? (
          <>
            <Loader2 size={16} className="animate-spin" /> Uploading…
          </>
        ) : (
          <>
            <Upload size={16} /> Upload{" "}
            {uploadFiles.length > 0 ? `(${uploadFiles.length})` : ""}
          </>
        )}
      </button>
    </div>
  );
};

// ── Files List ────────────────────────────────────────────────────────────────

const FilesList = ({ files, loading }) => {
  const handleShare = (fileId) => {
    const link = `${window.location.origin}/file/${fileId}`;
    navigator.clipboard.writeText(link);
    // surface a toast if you have react-hot-toast wired up
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 flex flex-col items-center justify-center gap-3 text-gray-400">
        <Loader2 size={28} className="animate-spin text-blue-400" />
        <p className="text-sm">Loading recent files…</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
      <h2 className="font-semibold text-gray-800 flex items-center gap-2">
        <Clock size={18} className="text-blue-500" />
        Recent Files
      </h2>

      {files.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
          <File size={40} strokeWidth={1} className="text-gray-200" />
          <p className="text-sm text-gray-400">No files uploaded yet.</p>
          <p className="text-xs text-gray-300">
            Files you upload will appear here.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-50">
          {files.map((file) => (
            <li
              key={file._id ?? file.id}
              className="flex items-center gap-3 py-3 group"
            >
              {/* Icon */}
              <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center">
                <FileIcon type={file.mimeType} name={file.name} size={18} />
              </div>

              {/* Meta */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">
                  {file.name}
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                  {file.size != null && <span>{formatBytes(file.size)}</span>}
                  {file.size != null && <span>·</span>}
                  <span>
                    {timeAgo(
                      file.uploadedAt ?? file.uplodedAt ?? file.createdAt,
                    )}
                  </span>
                </div>
              </div>

              {/* Actions — visible on hover */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleShare(file._id ?? file.id)}
                  title="Copy share link"
                  className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-500 transition-colors"
                >
                  <Share2 size={15} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// ── Toast / message banner ────────────────────────────────────────────────────

const MessageBanner = ({ message, type }) => {
  if (!message) return null;
  const styles = {
    error: "bg-red-50 text-red-700 border-red-100",
    success: "bg-green-50 text-green-700 border-green-100",
    info: "bg-blue-50 text-blue-600 border-blue-100",
  };
  const Icon =
    type === "error" ? AlertCircle : type === "success" ? CheckCircle : Info;
  return (
    <div
      className={`mb-6 p-4 rounded-xl border flex items-center gap-3 text-sm ${styles[type] ?? styles.info}`}
    >
      <Icon size={16} className="flex-shrink-0" />
      {message}
    </div>
  );
};

// ── Dashboard ─────────────────────────────────────────────────────────────────

const Dashboard = () => {
  const [files, setFiles] = useState([]); // fetched server files
  const [uploadFiles, setUploadFiles] = useState([]); // queued for upload
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [remainingUploads, setRemainingUploads] = useState(5);

  const { fetchUserCredits } = useContext(UserCreditsContext);
  const MAX_FILES = 5;
  const { getToken } = useAuth();

  // ── fetch recent files ──
  const fetchRecentFiles = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const res = await axios.get(apiEndpoints.FETCH_FILES, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const sorted = res.data
        .sort(
          (a, b) =>
            new Date(b.uplodedAt ?? b.uploadedAt ?? b.createdAt) -
            new Date(a.uplodedAt ?? a.uploadedAt ?? a.createdAt),
        )
        .slice(0, 5); // FIX: was slice(0.5)
      setFiles(sorted);
    } catch (err) {
      console.error("Error fetching recent files:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentFiles();
  }, [getToken]);

  // ── keep remaining count in sync ──
  useEffect(() => {
    setRemainingUploads(MAX_FILES - uploadFiles.length);
  }, [uploadFiles]);

  // ── handlers ──
  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    if (uploadFiles.length + selected.length > MAX_FILES) {
      setMessage(`You can only queue up to ${MAX_FILES} files at a time.`);
      setMessageType("error");
      return;
    }
    setUploadFiles((prev) => [...prev, ...selected]);
    setMessage("");
    setMessageType("");
  };

  const handleRemoveFile = (index) => {
    setUploadFiles((prev) => prev.filter((_, i) => i !== index));
    setMessage("");
    setMessageType("");
  };

  const handleUpload = async () => {
    // FIX: was checking `files` (server list) instead of `uploadFiles`
    if (uploadFiles.length === 0) {
      setMessage("Please select at least one file to upload.");
      setMessageType("error");
      return;
    }
    if (uploadFiles.length > MAX_FILES) {
      setMessage(
        `You can only upload a maximum of ${MAX_FILES} files at once.`,
      );
      setMessageType("error");
      return;
    }

    setUploading(true);
    setMessage("Uploading your files…");
    setMessageType("info");

    const formData = new FormData();
    uploadFiles.forEach((file) => formData.append("files", file)); // FIX: was `files`

    try {
      const token = await getToken();
      const response = await axios.post(apiEndpoints.UPLOAD_FILES, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage("Files uploaded successfully!");
      setMessageType("success");
      setUploadFiles([]); // FIX: was setFiles([]) which cleared the wrong state

      await fetchRecentFiles();
      await fetchUserCredits();
    } catch (err) {
      console.error("Upload error:", err);
      setMessage(
        err.response?.data?.message || "Upload failed. Please try again.",
      );
      setMessageType("error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <DashboardLayout activeMenu={"Dashboard"}>
      <div className="p-6 max-w-6xl mx-auto">
        {/* Page heading */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Drive</h1>
          <p className="text-gray-500 text-sm mt-1">
            Upload, manage and share your files securely.
          </p>
        </div>

        {/* Message banner */}
        <MessageBanner message={message} type={messageType} />

        {/* Two-column layout */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left — upload */}
          <div className="w-full md:w-[38%]">
            <UploadPanel
              uploadFiles={uploadFiles}
              onFileChange={handleFileChange}
              onRemove={handleRemoveFile}
              onUpload={handleUpload}
              uploading={uploading}
              remaining={remainingUploads}
              MAX_FILES={MAX_FILES}
            />
          </div>

          {/* Right — recent files */}
          <div className="flex-1">
            <FilesList files={files} loading={loading} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
