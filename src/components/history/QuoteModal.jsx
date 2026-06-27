import { useState } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import Modal from "../ui/Modal";
import useCalculator from "../../hooks/useCalculator";
import PlateCard from "../plates/PlateCard";
import ProfitSection from "../layout/ProfitSection";
import { FiEdit2, FiSave, FiTrash2, FiPlus } from "react-icons/fi";
import { useConfirm } from "../../context/ConfirmContext";

export default function QuoteModal({
  isOpen,
  onClose,
  item,
  settings,
  updateHistoryItem,
  deleteFromHistory,
  initialMode = "view",
}) {
  const [mode, setMode] = useState(initialMode);
  const [platesRef] = useAutoAnimate();
  const [footerRef] = useAutoAnimate();
  const { confirm } = useConfirm();

  // Initialize a standalone calculator for this modal
  const {
    project,
    results,
    updateProjectField,
    addPlate,
    removePlate,
    updatePlate,
  } = useCalculator(settings, item?.details, true); // true = skipHistory

  if (!item) return null;

  const isReadOnly = mode === "view";

  const handleSave = () => {
    updateHistoryItem(item.id, project, results);
    onClose();
  };

  const handleDelete = async () => {
    if (
      await confirm({
        title: "Eliminar Cotización",
        message:
          "¿Estás seguro de que deseas eliminar esta cotización del historial?",
      })
    ) {
      deleteFromHistory(item.id);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex flex-col">
          <span>
            {isReadOnly
              ? `Cotización: ${project.projectName}`
              : `Editando: ${project.projectName}`}
          </span>
          <span className="text-xs text-slate-600 dark:text-slate-400 font-normal mt-1">
            {item.date}
          </span>
        </div>
      }
      footer={
        <div
          className="flex flex-col sm:flex-row justify-end gap-3 w-full"
          ref={footerRef}
        >
          {!isReadOnly && (
            <div className="flex flex-row gap-3 w-full sm:w-auto sm:mr-auto">
              <button
                onClick={handleDelete}
                className="flex-1 sm:flex-none bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-900/50 hover:text-red-300 rounded-lg font-medium py-2 px-5 flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <FiTrash2 /> Eliminar
              </button>

              <button
                onClick={() => setMode("view")}
                className="flex-1 sm:flex-none text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 py-2 px-5 cursor-pointer transition-colors"
              >
                Cancelar
              </button>
            </div>
          )}
          <button
            onClick={() => (isReadOnly ? setMode("edit") : handleSave())}
            className={`${
              isReadOnly
                ? "bg-violet-600 hover:bg-violet-500"
                : "bg-emerald-600 hover:bg-emerald-500"
            } text-white px-5 py-2 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto`}
          >
            {isReadOnly ? (
              <>
                <FiEdit2 /> Habilitar Edición
              </>
            ) : (
              <>
                <FiSave /> Guardar Cambios
              </>
            )}
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Render plates */}
        <div className="space-y-4" ref={platesRef}>
          {project.plates.map((plate) => {
            const breakdown = results.platesBreakdown.find(
              (b) => b.id === plate.id,
            ) || {
              minutes: 0,
              decimalHours: 0,
              timeCost: 0,
              filamentCost: 0,
              selectedFilamentName: "N/A",
            };
            return (
              <PlateCard
                key={plate.id}
                plate={plate}
                breakdown={breakdown}
                settings={settings}
                onUpdate={(fields) => updatePlate(plate.id, fields)}
                onDelete={() => removePlate(plate.id)}
                canDelete={project.plates.length > 1}
                readOnly={isReadOnly}
              />
            );
          })}

          <div
            className={`transition-all duration-300 overflow-hidden ${
              !isReadOnly ? "max-h-20 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <button
              type="button"
              onClick={addPlate}
              className="w-full bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-800 border-dashed hover:border-slate-400 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300 font-medium py-3 rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <FiPlus className="text-violet-600 dark:text-violet-400 text-lg" /> Agregar Placa
            </button>
          </div>
        </div>

        <ProfitSection
          project={project}
          updateProjectField={updateProjectField}
          results={results}
          readOnly={isReadOnly}
        />
      </div>
    </Modal>
  );
}
