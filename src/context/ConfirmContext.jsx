import { useState, createContext, useContext } from "react";
import ConfirmModal from "../components/ui/ConfirmModal";

const ConfirmContext = createContext();

export const useConfirm = () => useContext(ConfirmContext);

export function ConfirmProvider({ children }) {
  const [config, setConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    confirmText: "Eliminar",
    cancelText: "Cancelar",
    onConfirm: null,
    onCancel: null,
  });

  const confirm = ({ title, message, confirmText = "Eliminar", cancelText = "Cancelar" }) => {
    return new Promise((resolve) => {
      setConfig({
        isOpen: true,
        title,
        message,
        confirmText,
        cancelText,
        onConfirm: () => {
          setConfig((c) => ({ ...c, isOpen: false }));
          resolve(true);
        },
        onCancel: () => {
          setConfig((c) => ({ ...c, isOpen: false }));
          resolve(false);
        },
      });
    });
  };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      <ConfirmModal
        isOpen={config.isOpen}
        onClose={config.onCancel}
        onConfirm={config.onConfirm}
        title={config.title}
        message={config.message}
        confirmText={config.confirmText}
        cancelText={config.cancelText}
      />
    </ConfirmContext.Provider>
  );
}
