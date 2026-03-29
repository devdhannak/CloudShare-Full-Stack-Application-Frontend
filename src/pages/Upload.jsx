import React, { useContext, useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import { useAuth } from "@clerk/clerk-react";
import { UserCreditsContext } from "../context/UserCreditsContext";
import { AlertCircle } from "lucide-react";
import axios from "axios";
import { apiEndpoints } from "../util/apiEndpoints";
import toast from "react-hot-toast";
import UploadBox from "../components/UploadBox";

const Upload = () => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // success or Error
  const { getToken } = useAuth();
  const { credits, setCredits } = useContext(UserCreditsContext);
  const MAX_FILES = 5;

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (files.length + selectedFiles.length > MAX_FILES) {
      setMessage(`You can only upload a maximum of ${MAX_FILES} files at once`);
      setMessageType("error");
      return;
    }

    // add the new Files into the existing files
    setFiles((prev) => [...prev, ...selectedFiles]);
    setMessage("");
    setMessageType("");
  };
  const handleRemoveFiles = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    setMessageType("");
    setMessage("");
  };
  const handleUpload = async () => {
    if (files.length === 0) {
      setMessage("please select atlest one file to upload");
      setMessageType("error");
      return;
    }

    if (files.length > MAX_FILES) {
      setMessage(`you can only upload a maximun of ${MAX_FILES} files at once`);
      setMessageType("error");
      return;
    }

    setUploading(true);
    setMessage("Uploading the files");
    setMessageType("info");

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    try {
      const token = await getToken();
      const response = await axios.post(apiEndpoints.UPLOAD_FILES, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && response.data.remainingCredits != undefined) {
        setCredits(response.data.remainingCredits);
      }

      setMessage("Files uploaded successfully");
      setMessageType("success");
      setFiles([]);
    } catch (error) {
      console.error("Error while uploading the files: ", error);
      setMessage(
        error.response?.data?.message ||
          "Error uploading the files. please try again",
      );
      setMessageType("error");
    } finally {
      setUploading(false);
    }
  };
  const isUploadDisabled =
    files.length === 0 ||
    files.length > MAX_FILES ||
    credits <= 0 ||
    files.length > credits;

  return (
    <DashboardLayout activeMenu={"Upload"}>
      <div className="p-6 ">
        {message && (
          <div
            className={`mb-6 rounded-lg flex items-center gap-3 ${messageType === "error" ? "bg-red-50 text-red-700 " : messageType === "success" ? "bg-green-50 text-green-700" : "bg-blue-50 text-blue-700"}`}
          >
            {messageType === "error" && <AlertCircle size={20} />}
            {message}
          </div>
        )}
        <UploadBox
          files={files}
          onFileChange={handleFileChange}
          onUpload={handleUpload}
          uploading={uploading}
          onRemoveFile={handleRemoveFiles}
          remainingCredits={credits}
          isUploadDisabled={isUploadDisabled}
        />
      </div>
    </DashboardLayout>
  );
};

export default Upload;
