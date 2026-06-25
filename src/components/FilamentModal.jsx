import { useState, useEffect } from "react";
import Modal from "./ui/Modal";
import { FiEdit2, FiSave, FiTrash2 } from "react-icons/fi";
import { parseDecimalInput } from "../utils/formatters";
import { useConfirm } from "../context/ConfirmContext";

export default function FilamentModal({
  isOpen,
  onClose,
  filament,
  updateFilament,
  addFilament,
  deleteFilament,
  canDelete,
  initialMode = "view"
}) {
  const [mode, setMode] = useState(initialMode);
  const [formData, setFormData] = useState({ name: "", price: "", weight: "" });
  const { confirm } = useConfirm();

  useEffect(() => {
    if (initialMode === "add") {
      setFormData({ name: "", price: "", weight: "" });
      setMode("add");
    } else if (filament) {
      setFormData({
        name: filament.name,
        price: String(filament.price),
        weight: String(filament.weight)
      });
      setMode(initialMode);
    }
  }, [filament, initialMode]);

  if (!filament && initialMode !== "add") return null;

  const isReadOnly = mode === "view";
  const isAdding = mode === "add";

  const handleSave = () => {
    if (formData.name.trim() && formData.price && formData.weight) {
      const payload = {
        name: formData.name.trim(),
        price: Number(formData.price),
        weight: Number(formData.weight)
      };
      
      if (isAdding) {
        addFilament(payload);
      } else {
        updateFilament(filament.id, payload);
      }
      onClose();
    }
  };

  const handleDelete = async () => {
    if (
      await confirm({
        title: "Eliminar Filamento",
        message: "¿Estás seguro de que deseas eliminar este filamento?",
      })
    ) {
      deleteFilament(filament.id);
      onClose();
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={isAdding ? "Nuevo Filamento" : (isReadOnly ? `Filamento: ${filament.name}` : `Editando: ${filament.name}`)}
      footer={
        <div className="flex flex-col sm:flex-row justify-end gap-3">
          {isReadOnly ? (
            <button
              onClick={() => setMode("edit")}
              className="bg-violet-600 hover:bg-violet-500 text-white px-5 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
            >
              <FiEdit2 /> Habilitar Edición
            </button>
          ) : (
            <>
              {canDelete && (
                <button
                  onClick={handleDelete}
                  className="bg-red-900/30 text-red-400 hover:bg-red-900/50 hover:text-red-300 px-5 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 sm:mr-auto cursor-pointer"
                >
                  <FiTrash2 /> Eliminar
                </button>
              )}
              <button
                onClick={() => {
                  if (initialMode === "add") {
                    onClose();
                  } else {
                    setMode("view");
                  }
                }}
                className="text-slate-400 hover:text-slate-200 px-5 py-2 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <FiSave /> {isAdding ? "Agregar Filamento" : "Guardar Cambios"}
              </button>
            </>
          )}
        </div>
      }
    >
      <div className="space-y-6">
        {/* Filament Form */}
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Nombre</label>
            <input
              type="text"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              disabled={isReadOnly}
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Precio</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm pointer-events-none">$</span>
                <input
                  type="text"
                  inputMode="decimal"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-7 pr-3 py-2 text-slate-200 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseDecimalInput(e.target.value) })}
                  disabled={isReadOnly}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Peso (Gramos)</label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="decimal"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: parseDecimalInput(e.target.value) })}
                  disabled={isReadOnly}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm pointer-events-none">g</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
