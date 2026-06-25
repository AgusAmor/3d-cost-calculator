import { FiClock } from "react-icons/fi";
import { formatCurrency, formatDuration } from "../../../utils/formatters";

/**
 * TimeSection component.
 * Handles input for printing duration using the decimal hours format (e.g. 2.22 = 2h 22m),
 * and renders the calculations for operating duration costs including electricity and printer wear.
 * 
 * @param {object} project - The project input fields.
 * @param {object} results - Calculations derived from useCalculator.
 * @param {object} settings - Global settings parameters.
 * @param {function} updateProjectField - Function to update project inputs.
 */
export default function TimeSection({
  project,
  results,
  settings,
  updateProjectField
}) {
  const handleTimeChange = (val) => {
    // Keep as string or float depending on input to allow decimal points typing
    updateProjectField("hoursDecimal", val);
  };

  // Calculate the hourly operating rate before scrap for explanation display
  const powerCostPerHour = ((settings.printerPower || 0) / 1000) * (settings.electricityCost || 0);
  const hourlyRateBeforeScrap = powerCostPerHour + (settings.printerWearRate || 0);

  return (
    <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      <h2 className="text-xl font-semibold text-slate-100 flex items-center gap-2 border-b border-slate-850 pb-3">
        <FiClock className="text-sky-400" /> Tiempo de Impresión
      </h2>

      <div className="space-y-4">
        {/* Time Decimal Input */}
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">
            Horas (Formato Decimal Excel)
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.01"
              min="0"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
              value={project.hoursDecimal}
              onChange={(e) => handleTimeChange(e.target.value)}
              placeholder="e.g. 2.22 (2hs 22min)"
            />
            <span className="absolute right-3 top-2 text-slate-500 text-sm">HD</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            * Escribe la parte decimal representando minutos directos (e.g. 1.45 equivale a 1 hora y 45 minutos).
          </p>
        </div>

        {/* Calculated Time breakdown */}
        <div className="grid grid-cols-2 gap-4 bg-slate-950/40 p-4 rounded-xl border border-slate-850">
          <div>
            <div className="text-xs text-slate-500 uppercase font-semibold">Minutos Totales</div>
            <div className="text-lg font-mono font-medium text-slate-350">{results.totalMinutes} m</div>
          </div>
          <div>
            <div className="text-xs text-slate-500 uppercase font-semibold">Duración Formateada</div>
            <div className="text-lg font-mono font-medium text-emerald-400">
              {formatDuration(results.totalMinutes)}
            </div>
          </div>
        </div>

        {/* Breakdown explanation */}
        <div className="text-xs text-slate-400 space-y-1 bg-slate-950/20 p-3 rounded-lg border border-slate-850/40">
          <div className="flex justify-between">
            <span>Electricidad por hora:</span>
            <span className="font-mono text-slate-300">
              {formatCurrency(powerCostPerHour)} /h
            </span>
          </div>
          <div className="flex justify-between">
            <span>Desgaste por hora:</span>
            <span className="font-mono text-slate-300">
              {formatCurrency(settings.printerWearRate)} /h
            </span>
          </div>
          <div className="flex justify-between border-t border-slate-800/80 pt-1 mt-1 text-slate-300">
            <span>Costo Operativo Base:</span>
            <span className="font-mono">
              {formatCurrency(hourlyRateBeforeScrap)} /h
            </span>
          </div>
        </div>

        {/* Final Time Cost Card */}
        <div className="flex justify-between items-center bg-violet-950/20 border border-violet-900/30 rounded-xl p-4">
          <div>
            <div className="text-sm font-medium text-violet-300">Costo de Tiempo</div>
            <div className="text-xs text-violet-400/80">* Incluye 10% de Scrap</div>
          </div>
          <div className="text-2xl font-bold text-violet-400 font-mono">
            {formatCurrency(results.timeCost)}
          </div>
        </div>
      </div>
    </div>
  );
}
