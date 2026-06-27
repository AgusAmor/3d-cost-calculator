import { useState } from "react";
import { FiClock, FiDisc } from "react-icons/fi";
import { formatCurrency, formatDuration, parseDecimalInput } from "../../utils/formatters";
import PlateHeader from "./PlateHeader";

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
    <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-slate-300 dark:border-slate-800 rounded-2xl overflow-hidden shadow-lg">
      <PlateHeader
        plate={plate}
        breakdown={breakdown}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onUpdate={onUpdate}
        onDelete={onDelete}
        canDelete={canDelete}
        readOnly={readOnly}
      />

      {/* Expandable Body */}
      <div 
        className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
      >
        <div className="overflow-hidden">
          <div className="p-5 space-y-4 border-t border-slate-800/50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. Time / Duration Settings */}
            <div className="space-y-3 bg-slate-50/50 dark:bg-slate-950/30 p-4 rounded-xl border border-slate-200 dark:border-slate-800/60">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                <FiClock className="text-sky-400" /> Tiempo de Impresión
              </div>

              <div>
                <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">
                  Horas en Decimal
                </label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="decimal"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-1.5 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-violet-600 dark:focus:border-violet-500"
                    value={plate.hoursDecimal || ""}
                    onChange={(e) =>
                      handleTimeChange(parseDecimalInput(e.target.value))
                    }
                    placeholder="ej: 2.49 (2hs 49m)"
                    disabled={readOnly}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 text-xs font-mono pointer-events-none">
                    HD
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-600 dark:text-slate-400">
                  Duración: {formatDuration(breakdown.minutes)}
                </span>
                <span className="text-sky-400 font-mono font-semibold">
                  {formatCurrency(breakdown.timeCost)}
                </span>
              </div>
            </div>

            {/* 2. Filament Settings */}
            <div className="space-y-3 bg-slate-50/50 dark:bg-slate-950/30 p-4 rounded-xl border border-slate-200 dark:border-slate-800/60">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                <FiDisc className="text-violet-600 dark:text-violet-400" /> Material
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">
                    Filamento
                  </label>
                  <select
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg px-2 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-violet-600 dark:focus:border-violet-500 cursor-pointer"
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
                  <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">
                    Gramos
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      inputMode="decimal"
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-violet-600 dark:focus:border-violet-500"
                      value={plate.filamentGrams || ""}
                      onChange={(e) =>
                        handleGramsChange(parseDecimalInput(e.target.value))
                      }
                      placeholder="ej: 39.11"
                      disabled={readOnly}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 text-xs pointer-events-none">
                      g
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-600 dark:text-slate-400">
                  Precio/g: {formatCurrency(pricePerGram)}
                </span>
                <span className="text-violet-600 dark:text-violet-400 font-mono font-semibold">
                  {formatCurrency(breakdown.filamentCost)}
                </span>
              </div>
            </div>
          </div>

          {/* Subtotal bar at footer of card */}
          <div className="flex justify-between items-center bg-violet-100 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800/40 rounded-xl p-4 mt-4">
            <span className="text-sm font-medium text-violet-900 dark:text-violet-200">
              Subtotal Placa de Impresión{" "}
              <span className="hidden sm:inline text-xs text-violet-700/80 dark:text-violet-300/60 font-normal">
                (Tiempo + Material + Scrap)
              </span>
              :
            </span>
            <span className="font-mono font-bold text-lg text-violet-800 dark:text-violet-300">
              {formatCurrency(breakdown.timeCost + breakdown.filamentCost)}
            </span>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
