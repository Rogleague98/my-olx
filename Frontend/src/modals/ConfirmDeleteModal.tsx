import React from 'react';

type ConfirmDeleteModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName?: string;
  anchorRect?: DOMRect | null;
};

export default function ConfirmDeleteModal({ open, onClose, onConfirm, itemName, anchorRect }: ConfirmDeleteModalProps) {
  if (!open) return null;
  let style = { position: 'fixed', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', zIndex: 100 };
  if (anchorRect) {
    style = {
      position: 'fixed',
      left: anchorRect.left + anchorRect.width / 2,
      top: anchorRect.top + anchorRect.height / 2,
      transform: 'translate(-50%, -50%)',
      zIndex: 100
    };
  }
  return (
    <div className="fixed inset-0 bg-white/10 backdrop-blur-sm z-50 animate-fade-in">
      <div
        className="bg-gradient-to-br from-[#101624] via-[#1a2236] to-[#0a0e17] backdrop-blur-xl border-2 border-[#4f8cff] rounded-2xl shadow-2xl p-8 w-full max-w-sm transition-all duration-300"
        style={style}
      >
        <h2 className="text-xl font-extrabold mb-4 text-white">Confirm Delete</h2>
        <p className="mb-6 text-white">Are you sure you want to delete <span className="font-bold text-amber-500">{itemName || 'this item'}</span>?</p>
        <div className="flex justify-end gap-3">
          <button className="px-5 py-2 rounded-full bg-white/80 border border-[#4f8cff] text-[#2563EB] font-bold shadow hover:shadow-blue-200/60 hover:scale-105 transition-all duration-300" onClick={onClose}>Cancel</button>
          <button className="px-5 py-2 rounded-full bg-gradient-to-r from-[#3578e5] to-amber-400 text-white font-bold shadow hover:shadow-amber-200/60 hover:scale-105 transition-all duration-300" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
} 