import { FiTrendingUp } from "react-icons/fi";
import { formatCurrency } from "../../../utils/formatters";

/**
 * ProfitSection component.
 * Manages calculations for business profitability: labor rates, custom markups, and other costs.
 * 
 * @param {object} project - Current project state.
 * @param {object} results - Calculations derived from useCalculator.
 * @param {function} updateProjectField - Callback to edit project state fields.
 */
export default function ProfitSection({
  project,
  results,
  updateProjectField
}) {
  return (
    <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      <h2 className="text-xl font-semibold text-slate-100 flex items-center gap-2 border-b border-slate-850 pb-3">
        <FiTrendingUp className="text-emerald-400" /> Cálculo de Ganancia y Nombre
      </h2>

      <div className="space-y-4">
        {/* Project Name Input */}
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">
            Nombre del Proyecto / Pieza
          </label>
          <input
            type="text"
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
            value={project.projectName}
            onChange={(e) => updateProjectField("projectName", e.target.value)}
            placeholder="e.g. Engranaje reductor, Maceta"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Labor Hourly Rate */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">
              Tarifa Mano de Obra (/hr)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-slate-500 text-sm">$</span>
              <input
                type="number"
                min="0"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-7 pr-3 py-2 text-slate-200 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                value={project.laborRatePerHour || ""}
                onChange={(e) => updateProjectField("laborRatePerHour", Number(e.target.value))}
                placeholder="e.g. 100"
              />
            </div>
          </div>

          {/* Profit Multiplier */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">
              Multiplicador de Ganancia
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-slate-500 text-sm">x</span>
              <input
                type="number"
                min="1"
                step="0.1"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-7 pr-3 py-2 text-slate-200 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                value={project.profitMultiplier || ""}
                onChange={(e) => updateProjectField("profitMultiplier", Number(e.target.value))}
                placeholder="e.g. 6"
              />
            </div>
          </div>

          {/* Other Costs */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">
              Otros Insumos / Extras
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-slate-500 text-sm">$</span>
              <input
                type="number"
                min="0"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-7 pr-3 py-2 text-slate-200 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                value={project.otherCosts || ""}
                onChange={(e) => updateProjectField("otherCosts", Number(e.target.value))}
                placeholder="e.g. Caja de empaque, laca"
              />
            </div>
          </div>
        </div>

        {/* Dynamic breakdown */}
        <div className="text-xs text-slate-400 space-y-1 bg-slate-950/20 p-3 rounded-lg border border-slate-850/40">
          <div className="flex justify-between">
            <span>Costo de Producción (Filamento + Tiempo + Insumos):</span>
            <span className="font-mono text-slate-350">{formatCurrency(results.productionCost)}</span>
          </div>
          <div className="flex justify-between">
            <span>Mano de Obra Calculada ({(results.totalDecimalHours || 0).toFixed(2)}hs * ${project.laborRatePerHour || 0}/hr):</span>
            <span className="font-mono text-slate-350">{formatCurrency(results.laborCost)}</span>
          </div>
          <div className="flex justify-between">
            <span>Ganancia Multiplicadora (x{project.profitMultiplier}):</span>
            <span className="font-mono text-emerald-400 font-semibold">+{formatCurrency(results.profit)}</span>
          </div>
        </div>

        {/* Suggested Price Card */}
        <div className="flex justify-between items-center bg-emerald-950/20 border border-emerald-900/30 rounded-xl p-4">
          <div>
            <div className="text-sm font-medium text-emerald-300">Precio Final Sugerido</div>
            <div className="text-xs text-emerald-400/80">* Producción + Mano de Obra + Ganancia</div>
          </div>
          <div className="text-2xl font-bold text-emerald-400 font-mono">
            {formatCurrency(results.finalPrice)}
          </div>
        </div>
      </div>
    </div>
  );
}
