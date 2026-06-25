import { useState } from "react";
import { FiSliders, FiChevronDown, FiChevronUp } from "react-icons/fi";
import GeneralSettingsForm from "../settings/GeneralSettingsForm";
import FilamentCatalog from "../settings/FilamentCatalog";

/**
 * SettingsSection component.
 * Acts as an accordion container for global settings and the filament catalog.
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
  updateFilament,
  deleteFilament,
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-xl">
      <div
        className="flex items-center justify-between border-b border-slate-850 pb-3 cursor-pointer group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2 className="text-xl font-semibold text-slate-100 flex items-center gap-2 group-hover:text-violet-300 transition-colors">
          <FiSliders className="text-violet-450" /> Configuraciones
        </h2>
        <div className="text-slate-400 group-hover:text-slate-200 p-1 transition-colors">
          {isOpen ? <FiChevronUp /> : <FiChevronDown />}
        </div>
      </div>

      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen
            ? "grid-rows-[1fr] opacity-100 mt-6"
            : "grid-rows-[0fr] opacity-0 mt-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="space-y-6">
            <GeneralSettingsForm
              settings={settings}
              updateSetting={updateSetting}
            />

            <FilamentCatalog
              settings={settings}
              addFilament={addFilament}
              updateFilament={updateFilament}
              deleteFilament={deleteFilament}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
