import { FiSave, FiPrinter, FiRefreshCw } from "react-icons/fi";

export default function CurrentBudgetSummary({
  results,
  saveToHistory,
  handleExport,
  resetProject,
}) {
  // Compute percentages for the custom visual bar chart
  const { filamentCost, timeCost, laborCost, profit, finalPrice } = results;
  const totalVal = finalPrice || 1; // prevent divide-by-zero

  const filamentPct = (filamentCost / totalVal) * 100;
  const timePct = (timeCost / totalVal) * 100;
  const laborPct = (laborCost / totalVal) * 100; // Left for future use
  const profitPct = (profit / totalVal) * 100;

  return (
    <>
      <h2 className="text-xl font-semibold text-slate-100 flex items-center gap-2 border-b border-slate-850 pb-3">
        Resumen y Acciones
      </h2>

      {/* Visual Bar Chart */}
      <div className="space-y-3">
        <span className="block text-sm font-medium text-slate-400">
          Distribución del Precio
        </span>
        <div className="h-6 w-full bg-slate-950 rounded-full overflow-hidden flex border border-slate-800">
          {filamentPct > 0 && (
            <div
              style={{ width: `${filamentPct}%` }}
              className="bg-violet-500 hover:opacity-90 transition-all duration-300 relative group"
              title={`Filamento: ${filamentPct.toFixed(1)}%`}
            />
          )}
          {timePct > 0 && (
            <div
              style={{ width: `${timePct}%` }}
              className="bg-sky-500 hover:opacity-90 transition-all duration-300"
              title={`Tiempo: ${timePct.toFixed(1)}%`}
            />
          )}
          {profitPct > 0 && (
            <div
              style={{ width: `${profitPct}%` }}
              className="bg-emerald-500 hover:opacity-90 transition-all duration-300"
              title={`Ganancia: ${profitPct.toFixed(1)}%`}
            />
          )}
        </div>

        {/* Legend */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="flex items-center gap-2 text-slate-350">
            <span className="w-3 h-3 bg-violet-500 rounded-sm inline-block" />
            <span>Filamento ({filamentPct.toFixed(1)}%)</span>
          </div>
          <div className="flex items-center gap-2 text-slate-350">
            <span className="w-3 h-3 bg-sky-500 rounded-sm inline-block" />
            <span>Tiempo ({timePct.toFixed(1)}%)</span>
          </div>

          <div className="flex items-center gap-2 text-slate-350">
            <span className="w-3 h-3 bg-emerald-500 rounded-sm inline-block" />
            <span>Ganancia ({profitPct.toFixed(1)}%)</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-800">
        <button
          onClick={saveToHistory}
          className="bg-violet-600 hover:bg-violet-500 text-white font-medium rounded-xl p-3 transition-colors flex flex-col items-center justify-center gap-2 cursor-pointer h-full"
          type="button"
        >
          <FiSave className="text-xl shrink-0" />
          <span className="text-center leading-tight text-sm">
            Guardar Cotización
          </span>
        </button>
        <button
          onClick={handleExport}
          className="bg-slate-800 hover:bg-slate-700 text-slate-100 font-medium rounded-xl p-3 transition-colors flex flex-col items-center justify-center gap-2 cursor-pointer h-full"
          type="button"
        >
          <FiPrinter className="text-xl shrink-0" />
          <span className="text-center leading-tight text-sm">
            Exportar PDF
          </span>
        </button>
        <button
          onClick={resetProject}
          className="bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 font-medium rounded-xl p-3 transition-colors flex flex-col items-center justify-center gap-2 cursor-pointer h-full"
          type="button"
        >
          <FiRefreshCw className="text-xl shrink-0" />
          <span className="text-center leading-tight text-sm">
            Nueva Cotización
          </span>
        </button>
      </div>
    </>
  );
}
