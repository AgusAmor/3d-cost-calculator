import { useState } from "react";
import { FiDisc, FiTrash2, FiChevronDown, FiChevronUp, FiEdit2, FiCheck } from "react-icons/fi";
import { formatCurrency, formatDuration } from "../utils/formatters";

export default function PlateHeader({
  plate,
  breakdown,
  isOpen,
  setIsOpen,
  onUpdate,
  onDelete,
  canDelete,
  readOnly,
}) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(plate.name);

  const handleNameSave = () => {
    if (tempName.trim()) {
      onUpdate({ name: tempName.trim() });
    }
    setIsEditingName(false);
  };

  return (
    <div
      className="flex items-center justify-between px-5 py-4 bg-slate-950/60 border-b border-slate-850 cursor-pointer group hover:bg-slate-950/80 transition-colors"
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <FiDisc className="text-violet-400 text-lg shrink-0 animate-spin-slow" />

        {isEditingName ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              className="bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-sm text-slate-100 focus:outline-none focus:border-violet-500"
              value={tempName}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => setTempName(e.target.value)}
              onBlur={handleNameSave}
              onKeyDown={(e) => e.key === "Enter" && handleNameSave()}
              autoFocus
              disabled={readOnly}
            />
            {!readOnly && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNameSave();
                }}
                className="text-emerald-400 hover:text-emerald-300 p-1"
                type="button"
              >
                <FiCheck />
              </button>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2 max-w-full">
            <span className="font-semibold text-slate-200 truncate">
              {plate.name}
            </span>
            <div
              className={`transition-all duration-300 overflow-hidden flex items-center ${
                !readOnly ? "max-w-8 opacity-100 scale-100" : "max-w-0 opacity-0 scale-50"
              }`}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditingName(true);
                }}
                className="text-slate-500 hover:text-slate-350 transition-colors p-1"
                type="button"
                title="Editar nombre"
              >
                <FiEdit2 className="text-xs" />
              </button>
            </div>
          </div>
        )}

        {/* Quick Subtotal summary when collapsed */}
        {!isOpen && (
          <span className="text-xs text-slate-400 font-mono hidden sm:inline ml-4">
            ({formatDuration(breakdown.minutes)} | {plate.filamentGrams}g |{" "}
            {formatCurrency(breakdown.timeCost + breakdown.filamentCost)})
          </span>
        )}
      </div>

      <div
        className={`flex items-center transition-all duration-300 ${
          !readOnly && canDelete ? "gap-3" : "gap-0"
        }`}
      >
        <div
          className={`transition-all duration-300 overflow-hidden flex items-center ${
            !readOnly && canDelete ? "max-w-8 opacity-100 scale-100" : "max-w-0 opacity-0 scale-50"
          }`}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="text-slate-500 hover:text-red-400 p-1 rounded transition-colors cursor-pointer"
            type="button"
            title="Eliminar placa de impresión"
          >
            <FiTrash2 className="text-sm" />
          </button>
        </div>
        <div
          className={`text-slate-400 group-hover:text-slate-200 p-1 transition-colors ${
            !readOnly && canDelete ? "" : "ml-3"
          }`}
        >
          {isOpen ? <FiChevronUp /> : <FiChevronDown />}
        </div>
      </div>
    </div>
  );
}
