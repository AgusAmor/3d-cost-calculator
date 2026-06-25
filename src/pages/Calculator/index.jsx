import { FiPrinter, FiPlus } from "react-icons/fi";
import useSettings from "../../hooks/useSettings";
import useCalculator from "../../hooks/useCalculator";
import SettingsSection from "./components/SettingsSection";
import PlateCard from "./components/PlateCard";
import ProfitSection from "./components/ProfitSection";
import SummarySection from "./components/SummarySection";
import PrintableBudget from "./components/PrintableBudget";

/**
 * Main Calculator Page component.
 * Acts as the centralized coordinator, binding settings state, print calculator logic,
 * modular input/display panels, and printable PDF layouts.
 */
export default function CalculatorPage() {
  const {
    settings,
    updateSetting,
    addFilament,
    deleteFilament
  } = useSettings();

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
    deleteFromHistory
  } = useCalculator(settings);

  // Handle launching browser PDF export / print mode
  const handleExport = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-violet-600 selection:text-white pb-12">
      {/* Interactive Main Dashboard View (Hidden during printing) */}
      <div className="print:hidden max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Header */}
        <header className="flex flex-col sm:flex-row items-center justify-between border-b border-slate-900 pb-6 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-violet-600/10 border border-violet-500/20 rounded-2xl">
              <FiPrinter className="text-violet-400 text-3xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-white via-slate-200 to-slate-400">
                Calculadora de Costos 3D
              </h1>
              <p className="text-sm text-slate-400">Automatización y presupuestos inteligentes para impresión 3D</p>
            </div>
          </div>
          <div className="text-xs text-slate-500 text-right">
            <span>Versión 1.0.0 (MVP)</span>
          </div>
        </header>

        {/* Dashboard Layout */}
        <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Form Sections */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* List of Trays (Bandejas) */}
            <div className="space-y-4">
              {project.plates.map((plate) => {
                const breakdown = results.platesBreakdown.find((b) => b.id === plate.id) || {
                  minutes: 0,
                  decimalHours: 0,
                  timeCost: 0,
                  filamentCost: 0,
                  selectedFilamentName: "N/A"
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
                className="w-full bg-slate-900 hover:bg-slate-850 border border-slate-800 border-dashed hover:border-slate-700 text-slate-300 font-medium py-3 rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <FiPlus className="text-violet-400 text-lg" /> Agregar Bandeja (Placa de Impresión)
              </button>
            </div>

            {/* 3. Profit margin inputs */}
            <ProfitSection
              project={project}
              results={results}
              updateProjectField={updateProjectField}
            />
            
            {/* 4. Global Variables catalog section */}
            <SettingsSection
              settings={settings}
              updateSetting={updateSetting}
              addFilament={addFilament}
              deleteFilament={deleteFilament}
            />
          </div>

          {/* Right Column: Visual Summary and History */}
          <div className="space-y-6">
            <SummarySection
              project={project}
              results={results}
              history={history}
              saveToHistory={saveToHistory}
              deleteFromHistory={deleteFromHistory}
              resetProject={resetProject}
              handleExport={handleExport}
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
