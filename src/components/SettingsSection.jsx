import { useState } from "react";
import {
  FiSliders,
  FiLayers,
  FiChevronDown,
  FiChevronUp,
  FiEye,
  FiEdit2,
  FiTrash2,
  FiPlus,
} from "react-icons/fi";
import { parseDecimalInput } from "../utils/formatters";
import FilamentModal from "./FilamentModal";
import { useConfirm } from "../context/ConfirmContext";

/**
 * SettingsSection component.
 * Allows editing global parameters: electricity kWh price, printer power, hourly wear rate,
 * and managing the filament catalog.
 *
 * @param {object} settings - The settings values.
 * @param {function} updateSetting - Function to update a single setting.
 * @param {function} addFilament - Function to add a new filament.
 * @param {function} deleteFilament - Function to delete a filament.
 */
export default function SettingsSection({
  settings,
  updateSetting,
  addFilament,
  updateFilament,
  deleteFilament,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFilament, setSelectedFilament] = useState(null);
  const [filamentModalMode, setFilamentModalMode] = useState("view");
  const [isAddingFilament, setIsAddingFilament] = useState(false);
  const { confirm } = useConfirm();

  const openFilamentModal = (filament, mode) => {
    if (mode === "add") {
      setIsAddingFilament(true);
      setSelectedFilament(null);
    } else {
      setIsAddingFilament(false);
      setSelectedFilament(filament);
    }
    setFilamentModalMode(mode);
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      <div 
        className="flex items-center justify-between border-b border-slate-850 pb-3 cursor-pointer group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2 className="text-xl font-semibold text-slate-100 flex items-center gap-2 group-hover:text-violet-300 transition-colors">
          <FiSliders className="text-violet-450" /> Configuraciones
        </h2>
        <div className="text-slate-400 group-hover:text-slate-200 p-1 transition-colors">
          {isOpen ? <FiChevronUp /> : <FiChevronDown />}
        </div>
      </div>

      {isOpen && (
        <div className="space-y-6">
          {/* Basic Settings Form */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">
                Consumo Impresora
              </label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="decimal"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                  value={settings.printerPower}
                  onChange={(e) =>
                    updateSetting(
                      "printerPower",
                      parseDecimalInput(e.target.value),
                    )
                  }
                  placeholder="ej: 150"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm pointer-events-none">
                  W
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">
                Valor Electricidad
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm pointer-events-none">
                  $
                </span>
                <input
                  type="text"
                  inputMode="decimal"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-7 pr-3 py-2 text-slate-200 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                  value={settings.electricityCost}
                  onChange={(e) =>
                    updateSetting(
                      "electricityCost",
                      parseDecimalInput(e.target.value),
                    )
                  }
                  placeholder="ej: 45"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm pointer-events-none">
                  kW/h
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">
                Tasa Desgaste
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm pointer-events-none">
                  $
                </span>
                <input
                  type="text"
                  inputMode="decimal"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-7 pr-3 py-2 text-slate-200 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                  value={settings.printerWearRate}
                  onChange={(e) =>
                    updateSetting(
                      "printerWearRate",
                      parseDecimalInput(e.target.value),
                    )
                  }
                  placeholder="ej: 80"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm pointer-events-none">
                  /hs
                </span>
              </div>
            </div>
          </div>

          {/* Filament Catalog section */}
          <div className="pt-4 border-t border-slate-800">
            <h3 className="text-lg font-medium text-slate-200 mb-3 flex items-center gap-2">
              <FiLayers className="text-violet-450" /> Catálogo de Filamentos
            </h3>

            {/* Add Filament Button */}
            <button
              type="button"
              onClick={() => openFilamentModal(null, "add")}
              className="w-full bg-slate-900 hover:bg-slate-850 border border-slate-800 border-dashed hover:border-slate-700 text-slate-300 font-medium py-3 rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer mb-4"
            >
              <FiPlus className="text-violet-400 text-lg" /> Agregar Filamento
            </button>

            {/* Filament List */}
            <div className="rounded-lg border border-slate-800 bg-slate-950/30 overflow-hidden divide-y divide-slate-800">
              {settings.filaments.map((f) => (
                <div
                  key={f.id}
                  className="flex items-center justify-between p-4 hover:bg-slate-850/50 transition-colors"
                >
                  <div className="flex flex-col gap-1">
                    <span className="font-medium text-slate-200 text-sm sm:text-base">
                      {f.name}
                    </span>
                    <div className="flex items-center gap-2 text-xs sm:text-sm">
                      <span className="font-bold text-violet-400">
                        ${f.price.toLocaleString("es-AR")}
                      </span>
                      <span className="text-slate-500">
                        ({f.weight}g)
                      </span>
                      <span className="text-slate-400 font-mono hidden sm:inline">
                        • ${(f.price / f.weight).toFixed(2)}/g
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 sm:gap-2">
                    <button
                      onClick={() => openFilamentModal(f, "view")}
                      className="p-2 text-emerald-400 hover:bg-emerald-400/10 rounded-lg transition-colors cursor-pointer"
                      title="Ver detalles"
                    >
                      <FiEye className="text-lg" />
                    </button>
                    <button
                      onClick={() => openFilamentModal(f, "edit")}
                      className="p-2 text-sky-400 hover:bg-sky-400/10 rounded-lg transition-colors cursor-pointer"
                      title="Editar filamento"
                    >
                      <FiEdit2 className="text-lg" />
                    </button>
                    {settings.filaments.length > 1 && (
                      <button
                        onClick={async () => {
                          if (
                            await confirm({
                              title: "Eliminar Filamento",
                              message: "¿Estás seguro de que deseas eliminar este filamento del catálogo?",
                            })
                          ) {
                            deleteFilament(f.id);
                          }
                        }}
                        className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors cursor-pointer"
                        title="Eliminar"
                      >
                        <FiTrash2 className="text-lg" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {(selectedFilament || isAddingFilament) && (
        <FilamentModal
          key={selectedFilament ? selectedFilament.id : "new"}
          isOpen={!!selectedFilament || isAddingFilament}
          onClose={() => {
            setSelectedFilament(null);
            setIsAddingFilament(false);
          }}
          filament={selectedFilament}
          updateFilament={updateFilament}
          addFilament={addFilament}
          deleteFilament={deleteFilament}
          canDelete={settings.filaments.length > 1}
          initialMode={filamentModalMode}
        />
      )}
    </div>
  );
}
