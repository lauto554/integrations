interface ErrorDialogProps {
  open: boolean;
  title?: string;
  message: string;
  onClose: () => void;
}

export default function ErrorDialog({ open, title = "Error", message, onClose }: ErrorDialogProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-[#23263a] rounded-lg shadow-xl p-6 min-w-[220px] max-w-sm flex flex-col items-center border border-red-500">
        <div className="mb-2 flex items-center gap-2">
          <svg
            className="h-6 w-6 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01M21 12A9 9 0 1 1 3 12a9 9 0 0 1 18 0z"
            />
          </svg>
          <span className="text-lg font-bold text-red-500">{title}</span>
        </div>
        <div className="text-gray-200 text-sm mb-4 text-center">{message}</div>
        <button
          className="px-4 py-1.5 rounded bg-red-600 hover:bg-red-700 text-white font-semibold text-sm shadow cursor-pointer"
          onClick={onClose}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
