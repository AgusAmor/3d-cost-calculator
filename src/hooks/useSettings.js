import useLocalStorage from "./useLocalStorage";

const DEFAULT_SETTINGS = {
  electricityCost: 120.0, // Cost per kWh ($120)
  printerPower: 120,     // Printer power consumption (120 Wh)
  printerWearRate: 150.0, // Printer wear/amortization rate per hour ($150)
  filaments: [
    { id: "1", name: "PLA Standard", price: 22500, weight: 1000 },
    { id: "2", name: "PETG Standard", price: 21000, weight: 1000 },
    { id: "3", name: "Flex (TPU)", price: 26000, weight: 1000 }
  ]
};

/**
 * Hook to manage printer settings and filament catalog, persistable in localStorage.
 * Centralizes variables like power cost, printer wear, and filament list.
 */
export default function useSettings() {
  const [settings, setSettings] = useLocalStorage("3d_calc_settings_v2", DEFAULT_SETTINGS);

  // Update a single setting parameter
  const updateSetting = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  // Add a new filament type to the catalog list
  const addFilament = (filament) => {
    setSettings((prev) => ({
      ...prev,
      filaments: [...prev.filaments, { ...filament, id: Date.now().toString() }]
    }));
  };

  // Update an existing filament in the list
  const updateFilament = (id, updatedFields) => {
    setSettings((prev) => ({
      ...prev,
      filaments: prev.filaments.map((f) => (f.id === id ? { ...f, ...updatedFields } : f))
    }));
  };

  // Delete a filament from the catalog list
  const deleteFilament = (id) => {
    setSettings((prev) => ({
      ...prev,
      filaments: prev.filaments.filter((f) => f.id !== id)
    }));
  };

  return {
    settings,
    updateSetting,
    addFilament,
    updateFilament,
    deleteFilament
  };
}
