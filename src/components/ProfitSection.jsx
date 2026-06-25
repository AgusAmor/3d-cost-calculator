import { FiTrendingUp } from "react-icons/fi";
import { formatCurrency, parseDecimalInput } from "../utils/formatters";

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
  updateProjectField,
}) {
  return (
    <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      <h2 className="text-xl font-semibold text-slate-100 flex items-center gap-2 border-b border-slate-850 pb-3">
        <FiTrendingUp className="text-emerald-400" /> Total
      </h2>

      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Profit Multiplier */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">
              Ganancia
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm pointer-events-none">
                x
              </span>
              <input
                type="text"
                inputMode="decimal"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-7 pr-3 py-2 text-slate-200 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                value={project.profitMultiplier || ""}
                onChange={(e) =>
                  updateProjectField(
                    "profitMultiplier",
                    parseDecimalInput(e.target.value),
                  )
                }
                placeholder="ej: 6"
              />
            </div>
          </div>

          {/* Other Costs */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">
              Insumos / Extras
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm pointer-events-none">
                $
              </span>
              <input
                type="text"
                inputMode="decimal"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-7 pr-3 py-2 text-slate-200 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                value={project.otherCosts || ""}
                onChange={(e) =>
                  updateProjectField(
                    "otherCosts",
                    parseDecimalInput(e.target.value),
                  )
                }
                placeholder="ej: Caja, cadena llavero, etc."
              />
            </div>
          </div>
        </div>

        {/* Dynamic breakdown */}
        <div className="text-xs text-slate-400 space-y-2 bg-slate-950/20 p-3 rounded-lg border border-slate-850/40">
          <div className="flex justify-between">
            <span>Costo de Tiempo (Energía + Desgaste + Scrap):</span>
            <span className="font-mono text-slate-350">
              {formatCurrency(results.timeCost)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Costo de Filamento (Material + Scrap):</span>
            <span className="font-mono text-slate-350">
              {formatCurrency(results.filamentCost)}
            </span>
          </div>
          {Number(project.otherCosts) > 0 && (
            <div className="flex justify-between">
              <span>Insumos / Extras:</span>
              <span className="font-mono text-slate-350">
                {formatCurrency(Number(project.otherCosts))}
              </span>
            </div>
          )}
          <div className="border-t border-slate-800/60 pt-2 flex justify-between">
            <span>Ganancia (x{project.profitMultiplier}):</span>
            <span className="font-mono text-emerald-400 font-semibold">
              +{formatCurrency(results.profit)}
            </span>
          </div>
        </div>

        {/* Suggested Price Card */}
        <div className="flex justify-between items-center bg-emerald-950/20 border border-emerald-900/30 rounded-xl p-4">
          <div>
            <div className="text-sm font-medium text-emerald-300">
              Precio Final
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-400 font-mono">
            {formatCurrency(results.finalPrice)}
          </div>
        </div>
      </div>
    </div>
  );
}
