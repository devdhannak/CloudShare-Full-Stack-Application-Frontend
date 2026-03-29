import React, { useRef, useState } from "react";
import { UploadCloud, X, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const UploadBox = ({
  files,
  onFileChange,
  onUpload,
  uploading,
  onRemoveFile,
  remainingCredits,
  isUploadDisabled,
}) => {
  const fileInputRef = useRef();
  const [dragging, setDragging] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = {
      target: { files: e.dataTransfer.files },
    };
    onFileChange(droppedFiles);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg">Upload Files</h2>
        <span className="text-sm text-gray-500">
          {remainingCredits} credits remaining
        </span>
      </div>

      {/* Drop Zone */}
      <div
        onClick={() => fileInputRef.current.click()}
        onDragEnter={() => setDragging(true)}
        onDragLeave={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) {
            setDragging(false);
          }
        }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleDrop(e);
          setDragging(false);
        }}
        className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-all duration-200
    ${
      dragging ? "border-blue-500 bg-blue-50 scale-[1.02]" : "border-gray-300"
    }`}
      >
        <UploadCloud className="mx-auto text-gray-400 mb-3" size={40} />
        <p className="text-gray-600">Drag and drop files here</p>
        <p className="text-sm text-gray-400">
          or click to browse ({remainingCredits} credits remaining)
        </p>

        <input
          type="file"
          multiple
          ref={fileInputRef}
          onChange={onFileChange}
          className="hidden"
        />
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-5 space-y-3">
          <p className="text-sm text-gray-600">
            Selected Files ({files.length})
          </p>

          <AnimatePresence>
            {files.map((file, index) => (
              <motion.div
                key={file.name + index}
                initial={{ opacity: 0, y: 15, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className="flex items-center justify-between border rounded-lg px-4 py-2"
              >
                <div className="flex items-center gap-3">
                  <FileText className="text-blue-500" size={18} />
                  <div>
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-gray-400">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onRemoveFile(index)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <X size={18} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Upload Button */}
      <button
        onClick={onUpload}
        disabled={isUploadDisabled || uploading}
        className={`w-full mt-6 py-3 rounded-lg text-white font-medium transition
          ${
            isUploadDisabled || uploading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
};

export default UploadBox;
