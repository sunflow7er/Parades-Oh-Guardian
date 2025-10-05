import React from 'react';
import { X, Maximize2 } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, icon: Icon, fullWidth = false }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-2xl shadow-2xl border-4 border-green-800 max-h-[90vh] overflow-y-auto minecraft-modal ${
        fullWidth ? 'w-[95vw] max-w-none' : 'w-full max-w-4xl'
      }`}>
        {/* Minecraft-style header */}
        <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-lime-600 text-white p-6 rounded-t-xl border-b-4 border-green-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {Icon && <Icon className="w-8 h-8 text-green-100" />}
              <h2 className="text-3xl font-bold text-shadow-lg">{title}</h2>
              <span className="text-2xl">🟩</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="w-12 h-12 bg-green-800 hover:bg-green-900 rounded-lg flex items-center justify-center transition-all border-2 border-green-700 shadow-lg hover:shadow-xl"
                title="Close Window"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Modal content */}
        <div className="p-6 bg-gradient-to-br from-green-50 to-lime-50 border-4 border-dashed border-green-200 rounded-b-xl minecraft-content">
          {children}
        </div>

        {/* Minecraft-style footer */}
        <div className="bg-green-800 p-4 rounded-b-xl flex items-center justify-between text-green-100 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-green-400 rounded-sm animate-pulse"></span>
            <span>NASA Weather Mining Station</span>
          </div>
          <div className="flex items-center gap-2">
            <Maximize2 className="w-4 h-4" />
            <span>Full Screen Mode Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;