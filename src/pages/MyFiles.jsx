import React, { use, useEffect, useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import {
  Copy,
  Download,
  Eye,
  File,
  FileIcon,
  FileText,
  Globe,
  Grid,
  Image,
  List,
  Lock,
  Music,
  Trash2,
  Video,
} from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import FileCard from "../components/FileCard";
import { apiEndpoints } from "../util/apiEndpoints";
import ConfirmationDialog from "../components/ConfirmationDialog";
import ShareModal from "../components/ShareModal";

const MyFiles = () => {
  const [files, setFiles] = useState([]);
  const [viewMode, setViewMode] = useState("list");
  const [deleteFile, setDeleteFile] = useState({});
  const [shareModel, setShareModel] = useState({
    isOpen: false,
    fileId: null,
    link: "",
  });

  const [openDeleteMode, setOpenDeleteModel] = useState({
    isOpen: false,
    fileId: null,
  });
  const { getToken } = useAuth();
  const navigate = useNavigate();

  // console.log(deleteFile);

  // fetch files for logged in user
  const fetchFiles = async () => {
    try {
      const token = await getToken();
      console.log(token);

      const response = await axios.get(apiEndpoints.FETCH_FILES, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        const data = Array.isArray(response.data) ? response.data : [];
        setFiles(data);
      }
      console.log(response.data);
    } catch (error) {
      console.log("Error fetching the files from server: ", error);
      toast.error("Error fetching the files from server: ", error.message);
    }
  };

  // Toggles the public/private status of file
  const togglePublic = async (fileToUpdate) => {
    try {
      const token = await getToken();
      await axios.patch(
        apiEndpoints.TOGGLE_FILE(fileToUpdate.id),
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setFiles(
        files.map((file) =>
          file.id === fileToUpdate.id
            ? { ...file, isPublic: !file.isPublic }
            : file,
        ),
      );
    } catch (error) {
      console.error("Error toggling file status: ", error);
      toast.error("Error while toggling file status: ", error.message);
    }
  };

  // handle file download
  const handleDownload = async (file) => {
    try {
      const token = await getToken();
      const response = await axios.get(apiEndpoints.DOWNLOAD_FILE(file.id), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      });

      // create a blob url and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", file.name);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url); // clean up the object url
    } catch (error) {
      console.log("Error while downloading the file: ", error);
      toast.error("Error occur while downloading file: ", error.message);
    }
  };

  // open delete  model
  const openDeleteModel = (deleteFile) => {
    setOpenDeleteModel({
      isOpen: true,
      file: deleteFile,
    });
  };

  // close the share link model
  const closeDeleteModel = () => {
    setShareModel({
      isOpen: false,
      file: {},
    });
  };

  // open share link model
  const openShareModel = (fileId) => {
    const link = `${window.location.origin}/file/${fileId}`;
    setShareModel({
      isOpen: true,
      fileId,
      link,
    });
  };

  // close the share link model
  const closeShareModel = () => {
    setShareModel({
      isOpen: false,
      fileId: null,
      link: "",
    });
  };

  // delete file
  const handleDelete = async (deletefile) => {
    try {
      const token = await getToken();
      const response = await axios.delete(
        apiEndpoints.DELETE_FILE(deletefile.id),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.status === 204) {
        setFiles(files.filter((file) => file.id !== deletefile.id));
      } else {
        toast.error("Error deleting the file");
      }
      toast.success("File deleted succesfully");
    } catch (error) {
      console.log("Error while deleting file");
      toast.error("Error while deleting the file: ", error.message);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [getToken]);

  const getFileIcon = (file) => {
    const extension = file.name.split(".").pop().toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(extension)) {
      return <Image size={24} className="text-purple-500" />;
    }
    if (["mp4", "webm", "mov", "avi", "mkv"].includes(extension)) {
      return <Video size={24} className="text-blue-500" />;
    }
    if (["mp3", "wav", "ogg", "flac", "m4a"].includes(extension)) {
      return <Music size={24} className="text-green-500" />;
    }
    if (["pdf", "doc", "docx", "txt", "rtf"].includes(extension)) {
      return <FileText size={24} className="text-amber-500" />;
    }
    return <FileIcon size={24} className="text-purple-500" />;
  };

  return (
    <DashboardLayout activeMenu={"My Files"}>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">My Files {files.length}</h2>
          <div className="flex items-center gap-3">
            <List
              onClick={() => setViewMode("list")}
              size={24}
              className={`cursor-pointer transition-colors ${
                viewMode === "list"
                  ? "text-blue-600"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            />
            <Grid
              onClick={() => setViewMode("grid")}
              size={24}
              className={`cursor-pointer transition-colors ${
                viewMode === "grid"
                  ? "text-blue-600"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            />
          </div>
        </div>
        {files.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 flex flex-col items-center justify-center">
            <File size={60} className="text-purple-300 mb-4" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              No files uploaded yet
            </h3>
            <p className="text-gray-500 text-center max-w-md mb-6">
              Start uploading files to see them listed here. you can upload
              documents, images and other files and manage them securely.
            </p>
            <button
              onClick={() => navigate("/upload")}
              className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors"
            >
              Go to Upload
            </button>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {files.map((file) => (
              <FileCard
                key={file.id}
                file={file}
                onTogglePublic={togglePublic}
                onDownload={handleDownload}
                onShareLink={openShareModel}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Uploaded
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sharing
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {files.map((file) => (
                  <tr
                    key={file.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                      <div className="flex items-center gap-2">
                        {getFileIcon(file)}
                        {file.name}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                      {(file.size / 1025).toFixed(1)}KB
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                      {new Date(file.uploadedAt).toDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => togglePublic(file)}
                          className="flex items-center gap-2 cursor-pointer group"
                        >
                          {file.isPublic ? (
                            <>
                              <Globe size={16} className="text-green-500" />
                              <span className="group-hover:underline">
                                Public
                              </span>
                            </>
                          ) : (
                            <>
                              <Lock size={16} className="text-gray-500" />
                              <span className="group-hover:underline">
                                Private
                              </span>
                            </>
                          )}
                        </button>
                        {file.isPublic && (
                          <button
                            onClick={() => openShareModel(file.id)}
                            className="flex items-center gap-2 cursor-pointer group text-blue-600"
                          >
                            <Copy size={16} />
                            <span className="group-hover:underline">
                              Share link
                            </span>
                          </button>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="flex justify-center">
                          <button
                            onClick={() => handleDownload(file)}
                            title="Download"
                            className="text-gray-500 hover:text-blue-600"
                          >
                            <Download size={18} />
                          </button>
                        </div>
                        <div className="flex justify-center">
                          <button
                            onClick={() => {
                              (document
                                .getElementById("my_modal_3")
                                .showModal(),
                                setDeleteFile(file));
                            }}
                            // onClick={() => handleDelete(file)}

                            title="Delete"
                            className="text-gray-500 hover:text-red-600"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>

                        <div className="flex justify-center">
                          {file.isPublic ? (
                            <a
                              title="View File"
                              target="_blank"
                              rel="noreferrer"
                              href={`/file/${file.id}`}
                              className="text-gray-500 hover:text-blue-600"
                            >
                              <Eye size={18} />
                            </a>
                          ) : (
                            <span className="w-[18px]"></span>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div>
          {/* Open Modal Button */}

          <dialog
            id="my_modal_3"
            className="fixed inset-0 m-auto w-full max-w-md rounded-2xl p-0 backdrop:bg-black/40"
          >
            <div className="bg-white rounded-2xl shadow-xl p-6 relative">
              {/* Close Button */}
              <form method="dialog">
                <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-lg font-bold">
                  ✕
                </button>
              </form>

              {/* Content */}
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Delete Confirmation
              </h3>

              <p className="text-gray-500 mb-6">
                Are you sure you want to delete this?
              </p>

              {/* Actions */}
              <div className="flex justify-end  gap-5">
                <form method="dialog" className="flex  gap-2">
                  <button className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition">
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(deleteFile)}
                    className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition shadow"
                  >
                    Delete
                  </button>
                </form>
              </div>
            </div>
          </dialog>
        </div>
        {/* <ConfirmationDialog
          isOpen={openDeleteMode.isOpen}
          deleteFile={deleteFile}
          handleDelete={handleDelete}
        /> */}
        <ShareModal
          setDeleteFile={setDeleteFile}
          isOpen={shareModel.isOpen}
          onClose={closeShareModel}
          link={shareModel.link}
          title="Share file"
        />
      </div>
    </DashboardLayout>
  );
};

export default MyFiles;
