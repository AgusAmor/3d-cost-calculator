import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FiX } from "react-icons/fi";

export default function Modal({ isOpen, onClose, title, children, footer, maxWidth = "max-w-4xl" }) {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      // Small delay to allow DOM to render before adding visible classes for animation
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsVisible(true);
        });
      });
    } else {
      setIsVisible(false);
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300); // 300ms matches the CSS transition duration
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleEscape);
    } else {
      document.body.style.overflow = "unset";
      document.removeEventListener("keydown", handleEscape);
    }
    
    return () => {
      document.body.style.overflow = "unset";
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!shouldRender) return null;

  return createPortal(
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 transition-all duration-300 ${isVisible ? 'bg-slate-950/80 backdrop-blur-md opacity-100' : 'bg-transparent backdrop-blur-none opacity-0'}`}
    >
      <div 
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      ></div>
      
      <div className={`relative w-full ${maxWidth} max-h-[90vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'}`}>
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
          <h2 className="text-xl font-semibold text-slate-100">{title}</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors p-1 rounded-lg hover:bg-slate-800"
            title="Cerrar"
          >
            <FiX className="text-2xl" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
          {children}
        </div>

        {/* Footer - Fixed at bottom */}
        {footer && (
          <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/80 backdrop-blur-sm shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
