import { useState } from "react";
import { FiSliders, FiLayers, FiChevronDown, FiChevronUp } from "react-icons/fi";

/**
 * SettingsSection component.
 * Allows editing global parameters: electricity kWh price, printer power, hourly wear rate,
 * and managing the filament catalog.
 * 
 * @param {object} settings - The settings values.
 * @param {function} updateSetting - Function to update a single setting.
 * @param {function} addFilament - Function to add a new filament.
 * @param {function} deleteFilament - Function to delete a filament.
 */
export default function SettingsSection({
  settings,
  updateSetting,
  addFilament,
  deleteFilament
}) {
  const [newFilament, setNewFilament] = useState({ name: "", price: "", weight: "" });
  const [isOpen, setIsOpen] = useState(false);

  const handleAddFilament = (e) => {
    e.preventDefault();
    if (!newFilament.name || !newFilament.price || !newFilament.weight) return;

    addFilament({
      name: newFilament.name,
      price: Number(newFilament.price),
      weight: Number(newFilament.weight)
    });
    setNewFilament({ name: "", price: "", weight: "" });
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex items-center justify-between border-b border-slate-850 pb-3">
        <h2 className="text-xl font-semibold text-slate-100 flex items-center gap-2">
          <FiSliders className="text-violet-450" /> Variables Globales
        </h2>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-slate-400 hover:text-slate-200 p-1 cursor-pointer transition-colors"
          type="button"
        >
          {isOpen ? <FiChevronUp /> : <FiChevronDown />}
        </button>
      </div>

      {isOpen && (
        <div className="space-y-6">
          {/* Basic Settings Form */}
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">
            Consumo Impresora (Watts)
          </label>
          <div className="relative">
            <input
              type="number"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
              value={settings.printerPower}
              onChange={(e) => updateSetting("printerPower", Number(e.target.value))}
              placeholder="e.g. 150"
            />
            <span className="absolute right-3 top-2 text-slate-500 text-sm">W</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">
            Costo Electricidad (kWh)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-slate-500 text-sm">$</span>
            <input
              type="number"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-7 pr-3 py-2 text-slate-200 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
              value={settings.electricityCost}
              onChange={(e) => updateSetting("electricityCost", Number(e.target.value))}
              placeholder="e.g. 45"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">
            Tasa Desgaste Impresora (/hr)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-slate-500 text-sm">$</span>
            <input
              type="number"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-7 pr-3 py-2 text-slate-200 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
              value={settings.printerWearRate}
              onChange={(e) => updateSetting("printerWearRate", Number(e.target.value))}
              placeholder="e.g. 80"
            />
          </div>
        </div>
      </div>

      {/* Filament Catalog section */}
      <div className="pt-4 border-t border-slate-800">
        <h3 className="text-lg font-medium text-slate-200 mb-3 flex items-center gap-2">
          <FiLayers className="text-violet-450" /> Catálogo de Filamentos
        </h3>

        {/* Add Filament Form */}
        <form onSubmit={handleAddFilament} className="grid grid-cols-1 gap-3 mb-4">
          <input
            type="text"
            placeholder="Nombre (e.g. PLA Rojo)"
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
            value={newFilament.name}
            onChange={(e) => setNewFilament({ ...newFilament, name: e.target.value })}
            required
          />
          <div className="relative">
            <span className="absolute left-3 top-2 text-slate-500 text-sm">$</span>
            <input
              type="number"
              placeholder="Precio"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-7 pr-3 py-2 text-slate-200 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
              value={newFilament.price}
              onChange={(e) => setNewFilament({ ...newFilament, price: e.target.value })}
              required
            />
          </div>
          <div className="relative">
            <input
              type="number"
              placeholder="Peso"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
              value={newFilament.weight}
              onChange={(e) => setNewFilament({ ...newFilament, weight: e.target.value })}
              required
            />
            <span className="absolute right-3 top-2 text-slate-500 text-sm">g</span>
          </div>
          <button
            type="submit"
            className="w-full bg-violet-600 hover:bg-violet-500 text-white font-medium rounded-lg px-4 py-2 transition-colors cursor-pointer"
          >
            Agregar
          </button>
        </form>

        {/* Filament List */}
        <div className="overflow-x-auto rounded-lg border border-slate-800">
          <table className="min-w-full divide-y divide-slate-800 text-sm text-left">
            <thead className="bg-slate-950 text-slate-400">
              <tr>
                <th className="px-4 py-3 font-medium">Filamento</th>
                <th className="px-4 py-3 font-medium">Precio</th>
                <th className="px-4 py-3 font-medium">Peso (Carrete)</th>
                <th className="px-4 py-3 font-medium">Precio / Gramo</th>
                <th className="px-4 py-3 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-350">
              {settings.filaments.map((f) => (
                <tr key={f.id} className="hover:bg-slate-850/30">
                  <td className="px-4 py-3 font-medium text-slate-200">{f.name}</td>
                  <td className="px-4 py-3">${f.price.toLocaleString("es-AR")}</td>
                  <td className="px-4 py-3">{f.weight}g</td>
                  <td className="px-4 py-3">
                    ${(f.price / f.weight).toFixed(2)}/g
                  </td>
                  <td className="px-4 py-3 text-right">
                    {settings.filaments.length > 1 ? (
                      <button
                        onClick={() => deleteFilament(f.id)}
                        className="text-red-400 hover:text-red-300 font-medium transition-colors cursor-pointer"
                        type="button"
                      >
                        Eliminar
                      </button>
                    ) : (
                      <span className="text-slate-600 text-xs">Mínimo 1</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
        </div>
      )}
    </div>
  );
}
