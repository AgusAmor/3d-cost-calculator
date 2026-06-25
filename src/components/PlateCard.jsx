import { useState } from "react";
import {
  FiClock,
  FiDisc,
  FiTrash2,
  FiChevronDown,
  FiChevronUp,
  FiEdit2,
  FiCheck,
} from "react-icons/fi";
import {
  formatCurrency,
  formatDuration,
  parseDecimalInput,
} from "../utils/formatters";

/**
 * PlateCard component.
 * Unifies print time and filament settings for a single print bed/tray.
 * Supports renaming, collapsing, deleting, and displays individual plate costs.
 *
 * @param {object} plate - The raw plate inputs (hoursDecimal, selectedFilamentId, filamentGrams, etc.).
 * @param {object} breakdown - Calculated results for this plate (minutes, timeCost, filamentCost, etc.).
 * @param {object} settings - Global settings options (filament catalog, etc.).
 * @param {function} onUpdate - Callback to update plate values.
 * @param {function} onDelete - Callback to delete this plate.
 * @param {boolean} canDelete - If true, show the delete button.
 */
export default function PlateCard({
  plate,
  breakdown,
  settings,
  onUpdate,
  onDelete,
  canDelete,
  readOnly = false,
}) {
  const [isOpen, setIsOpen] = useState(true);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(plate.name);

  const handleNameSave = () => {
    if (tempName.trim()) {
      onUpdate({ name: tempName.trim() });
    }
    setIsEditingName(false);
  };

  const handleTimeChange = (val) => {
    onUpdate({ hoursDecimal: val });
  };

  const handleGramsChange = (val) => {
    onUpdate({ filamentGrams: val });
  };

  const handleFilamentChange = (e) => {
    onUpdate({ selectedFilamentId: e.target.value });
  };

  // Find the selected filament price per gram for explanation info
  const selectedFilament =
    settings.filaments.find((f) => f.id === plate.selectedFilamentId) ||
    settings.filaments[0];
  const pricePerGram = selectedFilament
    ? selectedFilament.price / selectedFilament.weight
    : 0;

  return (
    <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl overflow-hidden shadow-lg transition-all duration-300">
      {/* Card Title Header Bar */}
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
                  onClick={(e) => { e.stopPropagation(); handleNameSave(); }}
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
              {!readOnly && (
                <button
                  onClick={(e) => { e.stopPropagation(); setIsEditingName(true); }}
                  className="text-slate-500 hover:text-slate-350 transition-colors p-1"
                  type="button"
                  title="Editar nombre"
                >
                  <FiEdit2 className="text-xs" />
                </button>
              )}
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

        <div className="flex items-center gap-3">
          {canDelete && !readOnly && (
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
              className="text-slate-500 hover:text-red-400 p-1 rounded transition-colors cursor-pointer"
              type="button"
              title="Eliminar placa de impresión"
            >
              <FiTrash2 className="text-sm" />
            </button>
          )}
          <div className="text-slate-400 group-hover:text-slate-200 p-1 transition-colors">
            {isOpen ? <FiChevronUp /> : <FiChevronDown />}
          </div>
        </div>
      </div>

      {/* Expandable Body */}
      {isOpen && (
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. Time / Duration Settings */}
            <div className="space-y-3 bg-slate-950/30 p-4 rounded-xl border border-slate-850/60">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
                <FiClock className="text-sky-400" /> Tiempo de Impresión
              </div>

              <div>
                <label className="block text-xs text-slate-500 mb-1">
                  Horas en Decimal
                </label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="decimal"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-violet-500"
                    value={plate.hoursDecimal || ""}
                    onChange={(e) =>
                      handleTimeChange(parseDecimalInput(e.target.value))
                    }
                    placeholder="ej: 2.49 (2hs 49m)"
                    disabled={readOnly}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-mono pointer-events-none">
                    HD
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">
                  Duración: {formatDuration(breakdown.minutes)}
                </span>
                <span className="text-sky-400 font-mono font-semibold">
                  {formatCurrency(breakdown.timeCost)}
                </span>
              </div>
            </div>

            {/* 2. Filament Settings */}
            <div className="space-y-3 bg-slate-950/30 p-4 rounded-xl border border-slate-850/60">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
                <FiDisc className="text-violet-400" /> Material
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">
                    Filamento
                  </label>
                  <select
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-violet-500 cursor-pointer"
                    value={
                      plate.selectedFilamentId ||
                      settings.filaments[0]?.id ||
                      ""
                    }
                    onChange={handleFilamentChange}
                    disabled={readOnly}
                  >
                    {settings.filaments.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-slate-500 mb-1">
                    Gramos
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      inputMode="decimal"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-violet-500"
                      value={plate.filamentGrams || ""}
                      onChange={(e) =>
                        handleGramsChange(parseDecimalInput(e.target.value))
                      }
                      placeholder="ej: 39.11"
                      disabled={readOnly}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs pointer-events-none">
                      g
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">
                  Precio/g: {formatCurrency(pricePerGram)}
                </span>
                <span className="text-violet-400 font-mono font-semibold">
                  {formatCurrency(breakdown.filamentCost)}
                </span>
              </div>
            </div>
          </div>

          {/* Subtotal bar at footer of card */}
          <div className="flex justify-between items-center bg-violet-900/20 border border-violet-800/40 rounded-xl p-4 mt-4">
            <span className="text-sm font-medium text-violet-200">
              Subtotal Placa de Impresión{" "}
              <span className="hidden sm:inline text-xs text-violet-300/60 font-normal">
                (Tiempo + Material + Scrap)
              </span>
              :
            </span>
            <span className="font-mono font-bold text-lg text-violet-300">
              {formatCurrency(breakdown.timeCost + breakdown.filamentCost)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
