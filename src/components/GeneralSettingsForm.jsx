import { parseDecimalInput } from "../utils/formatters";

export default function GeneralSettingsForm({ settings, updateSetting }) {
  return (
    <div className="grid grid-cols-1 gap-4">
      <div>
        <label className="block text-sm font-medium text-slate-400 mb-1">
          Consumo Impresora
        </label>
        <div className="relative">
          <input
            type="text"
            inputMode="decimal"
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
            value={settings.printerPower}
            onChange={(e) =>
              updateSetting("printerPower", parseDecimalInput(e.target.value))
            }
            placeholder="ej: 150"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm pointer-events-none">
            W
          </span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-400 mb-1">
          Valor Electricidad
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm pointer-events-none">
            $
          </span>
          <input
            type="text"
            inputMode="decimal"
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-7 pr-3 py-2 text-slate-200 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
            value={settings.electricityCost}
            onChange={(e) =>
              updateSetting("electricityCost", parseDecimalInput(e.target.value))
            }
            placeholder="ej: 45"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm pointer-events-none">
            kW/h
          </span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-400 mb-1">
          Tasa Desgaste
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm pointer-events-none">
            $
          </span>
          <input
            type="text"
            inputMode="decimal"
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-7 pr-3 py-2 text-slate-200 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
            value={settings.printerWearRate}
            onChange={(e) =>
              updateSetting("printerWearRate", parseDecimalInput(e.target.value))
            }
            placeholder="ej: 80"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm pointer-events-none">
            /hs
          </span>
        </div>
      </div>
    </div>
  );
}
