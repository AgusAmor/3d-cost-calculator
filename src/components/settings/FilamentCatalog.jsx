import { useState } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { FiLayers, FiEye, FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import FilamentModal from "./FilamentModal";
import { useConfirm } from "../../context/ConfirmContext";

export default function FilamentCatalog({
  settings,
  addFilament,
  updateFilament,
  deleteFilament,
}) {
  const [filamentsRef] = useAutoAnimate();
  const [selectedFilament, setSelectedFilament] = useState(null);
  const [activeFilament, setActiveFilament] = useState(null);
  const [filamentModalMode, setFilamentModalMode] = useState("view");
  const [isAddingFilament, setIsAddingFilament] = useState(false);
  const [activeIsAdding, setActiveIsAdding] = useState(false);
  const { confirm } = useConfirm();

  const openFilamentModal = (filament, mode) => {
    if (mode === "add") {
      setIsAddingFilament(true);
      setActiveIsAdding(true);
      setSelectedFilament(null);
      setActiveFilament(null);
    } else {
      setIsAddingFilament(false);
      setActiveIsAdding(false);
      setSelectedFilament(filament);
      setActiveFilament(filament);
    }
    setFilamentModalMode(mode);
  };

  return (
    <div className="pt-4 border-t border-slate-300 dark:border-slate-800">
      <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
        <FiLayers className="text-violet-600 dark:text-violet-400" /> Catálogo de Filamentos
      </h3>

      {/* Add Filament Button */}
      <button
        type="button"
        onClick={() => openFilamentModal(null, "add")}
        className="w-full bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-800 border-dashed hover:border-slate-400 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300 font-medium py-3 rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer mb-4"
      >
        <FiPlus className="text-violet-600 dark:text-violet-400 text-lg" /> Agregar Filamento
      </button>

      {/* Filament List */}
      <div
        className="rounded-lg border border-slate-300 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 overflow-hidden divide-y divide-slate-200 dark:divide-slate-800"
        ref={filamentsRef}
      >
        {settings.filaments.map((f) => (
          <div
            key={f.id}
            className="flex items-center justify-between p-4 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors"
          >
            <div className="flex flex-col gap-1">
              <span className="font-medium text-slate-800 dark:text-slate-200 text-sm sm:text-base">
                {f.name}
              </span>
              <div className="flex items-center gap-2 text-xs sm:text-sm">
                <span className="font-bold text-violet-600 dark:text-violet-400">
                  ${f.price.toLocaleString("es-AR")}
                </span>
                <span className="text-slate-500 dark:text-slate-400">({f.weight}g)</span>
                <span className="text-slate-600 dark:text-slate-400 font-mono hidden sm:inline">
                  • ${(f.price / f.weight).toFixed(2)}/g
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => openFilamentModal(f, "view")}
                className="p-2 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-400/10 rounded-lg transition-colors cursor-pointer"
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
                        message:
                          "¿Estás seguro de que deseas eliminar este filamento del catálogo?",
                      })
                    ) {
                      deleteFilament(f.id);
                    }
                  }}
                  className="p-2 text-red-600 dark:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors cursor-pointer"
                  title="Eliminar"
                >
                  <FiTrash2 className="text-lg" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {(activeFilament || activeIsAdding) && (
        <FilamentModal
          key={activeFilament ? activeFilament.id : "new"}
          isOpen={!!selectedFilament || isAddingFilament}
          onClose={() => {
            setSelectedFilament(null);
            setIsAddingFilament(false);
          }}
          filament={activeFilament}
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
