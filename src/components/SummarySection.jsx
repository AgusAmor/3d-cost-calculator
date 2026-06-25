import {
  FiPieChart,
  FiSave,
  FiPrinter,
  FiRefreshCw,
  FiClock,
} from "react-icons/fi";
import { formatCurrency, formatDuration } from "../utils/formatters";

/**
 * SummarySection component.
 * Renders a visual breakdown (bar chart) of cost components, action buttons (Save, Clear, Export),
 * and lists past calculation history records.
 *
 * @param {object} project - Current project state.
 * @param {object} results - Calculations derived from useCalculator.
 * @param {array} history - Array of saved calculations.
 * @param {function} saveToHistory - Callback to save current project state.
 * @param {function} deleteFromHistory - Callback to delete a saved item.
 * @param {function} resetProject - Callback to reset inputs.
 * @param {function} handleExport - Callback to trigger PDF print mode.
 */
export default function SummarySection({
  project,
  results,
  history,
  saveToHistory,
  deleteFromHistory,
  resetProject,
  handleExport,
}) {
  // Compute percentages for the custom visual bar chart
  const { filamentCost, timeCost, laborCost, profit, finalPrice } = results;
  const totalVal = finalPrice || 1; // prevent divide-by-zero

  const filamentPct = (filamentCost / totalVal) * 100;
  const timePct = (timeCost / totalVal) * 100;
  const laborPct = (laborCost / totalVal) * 100;
  const profitPct = (profit / totalVal) * 100;

  return (
    <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      <h2 className="text-xl font-semibold text-slate-100 flex items-center gap-2 border-b border-slate-850 pb-3">
        <FiPieChart className="text-violet-400" /> Resumen y Acciones
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

      {/* History table */}
      <div className="pt-6 border-t border-slate-800">
        <h3 className="text-lg font-medium text-slate-200 mb-3 flex items-center gap-2">
          <FiClock className="text-slate-400" /> Historial de Cotizaciones
        </h3>

        {history.length === 0 ? (
          <div className="text-center py-6 text-slate-500 text-sm border border-dashed border-slate-800 rounded-xl">
            No tienes cotizaciones guardadas. Haz clic en "Guardar Cotización"
            para archivar.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-slate-800">
            <table className="min-w-full divide-y divide-slate-800 text-sm text-left">
              <thead className="bg-slate-950 text-slate-400">
                <tr>
                  <th className="px-4 py-3 font-medium">Fecha</th>
                  <th className="px-4 py-3 font-medium">Proyecto</th>
                  <th className="px-4 py-3 font-medium">Filamento</th>
                  <th className="px-4 py-3 font-medium">Tiempo</th>
                  <th className="px-4 py-3 font-medium">Precio Final</th>
                  <th className="px-4 py-3 font-medium text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-350">
                {history.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-850/30">
                    <td className="px-4 py-3 text-xs text-slate-500">
                      {item.date}
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-200">
                      {item.projectName}
                    </td>
                    <td className="px-4 py-3">
                      {item.details.plates
                        ? `${item.details.plates.length} ${item.details.plates.length === 1 ? "Placa de Impresión" : "Placas de Impresión"} (${item.details.plates.reduce((sum, p) => sum + Number(p.filamentGrams || 0), 0).toFixed(1)}g)`
                        : `${item.results.selectedFilamentName || "N/A"} (${item.details.filamentGrams || 0}g)`}
                    </td>
                    <td className="px-4 py-3">
                      {formatDuration(item.results.totalMinutes)}
                    </td>
                    <td className="px-4 py-3 font-bold text-emerald-400">
                      {formatCurrency(item.results.finalPrice)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => deleteFromHistory(item.id)}
                        className="text-red-400 hover:text-red-300 font-medium transition-colors cursor-pointer"
                        type="button"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
