import { FiDisc } from "react-icons/fi";
import { formatCurrency } from "../../../utils/formatters";

/**
 * FilamentSection component.
 * Manages selecting a filament from the catalog and inputting filament grams used.
 * Renders the filament cost based on weight, price, and the 10% scrap factor.
 * 
 * @param {object} project - Current project state.
 * @param {object} results - Calculations derived from useCalculator.
 * @param {object} settings - Settings configuration catalog.
 * @param {function} updateProjectField - Callback to edit project state fields.
 */
export default function FilamentSection({
  project,
  results,
  settings,
  updateProjectField
}) {
  const selectedFilament = settings.filaments.find(
    (f) => f.id === project.selectedFilamentId
  ) || settings.filaments[0];

  const handleFilamentChange = (e) => {
    updateProjectField("selectedFilamentId", e.target.value);
  };

  const handleGramsChange = (val) => {
    updateProjectField("filamentGrams", Number(val));
  };

  // Raw cost without scrap for visual breakdown
  const pricePerGram = selectedFilament ? selectedFilament.price / selectedFilament.weight : 0;
  const rawCost = (project.filamentGrams || 0) * pricePerGram;

  return (
    <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      <h2 className="text-xl font-semibold text-slate-100 flex items-center gap-2 border-b border-slate-850 pb-3">
        <FiDisc className="text-violet-400 animate-spin-slow" /> Costo de Filamento
      </h2>

      <div className="space-y-4">
        {/* Filament dropdown select */}
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">
            Seleccionar Filamento
          </label>
          <select
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 cursor-pointer"
            value={project.selectedFilamentId || (settings.filaments[0]?.id || "")}
            onChange={handleFilamentChange}
          >
            {settings.filaments.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name} (${f.price.toLocaleString("es-AR")} / {f.weight}g)
              </option>
            ))}
          </select>
        </div>

        {/* Grams input */}
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">
            Gramos Utilizados
          </label>
          <div className="relative">
            <input
              type="number"
              min="0"
              step="0.1"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
              value={project.filamentGrams || ""}
              onChange={(e) => handleGramsChange(e.target.value)}
              placeholder="e.g. 150"
            />
            <span className="absolute right-3 top-2 text-slate-500 text-sm">g</span>
          </div>
        </div>

        {/* Breakdown explanation */}
        {selectedFilament && (
          <div className="text-xs text-slate-400 space-y-1 bg-slate-950/20 p-3 rounded-lg border border-slate-850/40">
            <div className="flex justify-between">
              <span>Costo por gramo:</span>
              <span className="font-mono text-slate-300">
                {formatCurrency(pricePerGram)} /g
              </span>
            </div>
            <div className="flex justify-between">
              <span>Peso carrete base:</span>
              <span className="font-mono text-slate-300">
                {selectedFilament.weight} g
              </span>
            </div>
            <div className="flex justify-between border-t border-slate-800/80 pt-1 mt-1 text-slate-300">
              <span>Costo Material Neto:</span>
              <span className="font-mono">
                {formatCurrency(rawCost)}
              </span>
            </div>
          </div>
        )}

        {/* Final Filament Cost Card */}
        <div className="flex justify-between items-center bg-violet-950/20 border border-violet-900/30 rounded-xl p-4">
          <div>
            <div className="text-sm font-medium text-violet-300">Costo de Material</div>
            <div className="text-xs text-violet-400/80">* Incluye 10% de Scrap</div>
          </div>
          <div className="text-2xl font-bold text-violet-400 font-mono">
            {formatCurrency(results.filamentCost)}
          </div>
        </div>
      </div>
    </div>
  );
}
