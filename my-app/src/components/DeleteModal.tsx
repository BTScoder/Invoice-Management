type DeleteModalProps = {
  invoiceId: string;
  onCancel: () => void;
  onConfirm: () => void;
};

function DeleteModal({ invoiceId, onCancel, onConfirm }: DeleteModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white dark:bg-dark-bg2 p-8 shadow-2xl">
        <h2 className="text-2xl font-bold dark:text-white">Delete Invoice</h2>

        <p className="mt-4 text-sm leading-6 text-gray-500 dark:text-light-text">
          Are you sure you want to delete invoice{" "}
          <span className="font-bold">{invoiceId}</span>? This action cannot be
          undone.
        </p>

        <div className="mt-8 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full bg-gray-100 px-6 py-3 text-sm font-bold text-gray-600"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="rounded-full bg-red-500 px-6 py-3 text-sm font-bold text-white"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteModal;
