import React from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ open, onClose, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      {/* Modal content */}
      <div className="relative z-10 bg-[#23262F] rounded-xl shadow-2xl p-6 min-w-[320px] max-w-full mx-2 animate-fade-in">
        {children}
      </div>
    </div>
  );
};

export default Modal;
