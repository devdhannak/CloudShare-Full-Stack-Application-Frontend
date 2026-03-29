import React from "react";

const ConfirmationDialog = ({
  isOpen,
  deleteFile,
  handleDelete,
  setDeleteFile,
}) => {
  console.log(deleteFile);

  return (
    <div>
      {/* Open Modal Button */}

      <dialog
        onClick={isOpen && document.getElementById("my_modal_3").showModal()}
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
                onClick={() => {
                  (handleDelete(deleteFile), setDeleteFile({}));
                }}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition shadow"
              >
                Delete
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default ConfirmationDialog;
