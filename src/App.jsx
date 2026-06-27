import { useState } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { FiPrinter, FiPlus, FiEdit2, FiCheck, FiBox } from "react-icons/fi";
import useSettings from "./hooks/useSettings";
import useCalculator from "./hooks/useCalculator";
import SettingsSection from "./components/layout/SettingsSection";
import PlateCard from "./components/plates/PlateCard";
import ProfitSection from "./components/layout/ProfitSection";
import SummarySection from "./components/layout/SummarySection";
import PrintableBudget from "./components/layout/PrintableBudget";

/**
 * Main Calculator Page component.
 * Acts as the centralized coordinator, binding settings state, print calculator logic,
 * modular input/display panels, and printable PDF layouts.
 */
export default function App() {
  const [isEditingProjectName, setIsEditingProjectName] = useState(false);
  const [tempProjectName, setTempProjectName] = useState("");
  const [platesRef] = useAutoAnimate();

  const { settings, updateSetting, addFilament, updateFilament, deleteFilament } =
    useSettings();

  const {
    project,
    results,
    history,
    updateProjectField,
    addPlate,
    removePlate,
    updatePlate,
    resetProject,
    saveToHistory,
    updateHistoryItem,
    deleteFromHistory,
  } = useCalculator(settings);

  // Handle launching browser PDF export / print mode
  const handleExport = () => {
    window.print();
  };

  const startEditingProject = () => {
    setTempProjectName(project.projectName);
    setIsEditingProjectName(true);
  };

  const handleProjectNameSave = () => {
    if (tempProjectName.trim()) {
      updateProjectField("projectName", tempProjectName.trim());
    }
    setIsEditingProjectName(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-violet-600 selection:text-white pb-12">
      {/* Interactive Main Dashboard View (Hidden during printing) */}
      <div className="print:hidden max-w-350 mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Header */}
        <header className="flex flex-col sm:flex-row items-center justify-between border-b border-slate-200 dark:border-slate-900 pb-6 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-violet-100 dark:bg-violet-600/10 border border-violet-300 dark:border-violet-500/20 rounded-2xl">
              <FiPrinter className="text-violet-600 dark:text-violet-400 text-3xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-slate-900 dark:from-white via-slate-800 dark:via-slate-200 to-slate-600 dark:to-slate-400">
                Calculadora de Costos 3D
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Automatización y presupuestos inteligentes para impresión 3D
              </p>
            </div>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 text-right">
            <span>Versión 1.0.0 (MVP)</span>
          </div>
        </header>

        {/* Dashboard Layout */}
        <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Form Sections */}
          <div className="lg:col-span-2 space-y-6">

            {/* Project Name Editor */}
            <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-slate-300 dark:border-slate-800 rounded-2xl px-5 py-4 shadow-lg flex items-center gap-3">
              <FiBox className="text-violet-600 dark:text-violet-400 text-xl shrink-0" />
              {isEditingProjectName ? (
                <div className="flex items-center gap-2 w-full max-w-sm">
                  <input
                    type="text"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-400 dark:border-slate-700 rounded px-3 py-1 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-violet-600 dark:focus:border-violet-500"
                    value={tempProjectName}
                    onChange={(e) => setTempProjectName(e.target.value)}
                    onBlur={handleProjectNameSave}
                    onKeyDown={(e) => e.key === "Enter" && handleProjectNameSave()}
                    autoFocus
                  />
                  <button
                    onClick={handleProjectNameSave}
                    className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors cursor-pointer"
                  >
                    <FiCheck className="text-lg" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                    {project.projectName}
                  </h2>
                  <button
                    onClick={startEditingProject}
                    className="text-slate-500 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors mt-0.5 cursor-pointer"
                    title="Editar nombre del proyecto"
                  >
                    <FiEdit2 className="text-sm" />
                  </button>
                </div>
              )}
            </div>

            {/* List of Trays (Placas de Impresión) */}
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
                  />
                );
              })}

              <button
                type="button"
                onClick={addPlate}
                className="w-full bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-800 border-dashed hover:border-slate-400 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300 font-medium py-3 rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <FiPlus className="text-violet-600 dark:text-violet-400 text-lg" /> Agregar Placa de Impresión
              </button>
            </div>

            {/* 3. Profit margin inputs */}
            <ProfitSection
              project={project}
              results={results}
              updateProjectField={updateProjectField}
            />
          </div>

          {/* Right Column: Visual Summary and History */}
          <div className="space-y-6">
            <SummarySection
              project={project}
              results={results}
              history={history}
              saveToHistory={saveToHistory}
              updateHistoryItem={updateHistoryItem}
              deleteFromHistory={deleteFromHistory}
              resetProject={resetProject}
              handleExport={handleExport}
              settings={settings}
            />

            {/* 4. Global Variables catalog section */}
            <SettingsSection
              settings={settings}
              updateSetting={updateSetting}
              addFilament={addFilament}
              updateFilament={updateFilament}
              deleteFilament={deleteFilament}
            />
          </div>
        </main>
      </div>

      {/* A4 Printable Quotation Sheet (Visible ONLY during print layout) */}
      <PrintableBudget
        project={project}
        results={results}
        settings={settings}
      />
    </div>
  );
}
