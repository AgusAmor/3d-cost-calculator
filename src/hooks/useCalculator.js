import { useState, useMemo } from "react";
import useLocalStorage from "./useLocalStorage";

const INITIAL_PROJECT_STATE = {
  projectName: "Impresión 3D Nueva",
  selectedFilamentId: "",
  filamentGrams: 0,
  hoursDecimal: 0,
  profitMultiplier: 6,   // Default profit multiplier (6x markup)
  laborRatePerHour: 0,   // Hourly rate for labor/monitoring (default to 0 as it's not in the base sheet)
  otherCosts: 0          // Flat rate for shipping, paint, or other consumables
};

/**
 * Hook to manage a single 3D print calculation job.
 * Implements the formula conversions for time (decimal hours),
 * filament cost (with 10% scrap), and margins.
 * 
 * @param {object} settings - Settings object from useSettings.
 */
export default function useCalculator(settings) {
  const [project, setProject] = useState(INITIAL_PROJECT_STATE);
  const [history, setHistory] = useLocalStorage("3d_calc_history_v2", []);

  // Update a specific field of the current project state
  const updateProjectField = (key, value) => {
    setProject((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  // Convert decimal hours (e.g., 2.22 = 2h 22m) to total minutes
  const totalMinutes = useMemo(() => {
    const hd = Number(project.hoursDecimal) || 0;
    const hoursInt = Math.floor(hd);
    const minsPart = Math.round((hd - hoursInt) * 100);
    return hoursInt * 60 + minsPart;
  }, [project.hoursDecimal]);

  // Compute all costs and sales prices reactively
  const results = useMemo(() => {
    // 1. Time Cost calculation
    const decimalHours = totalMinutes / 60;
    const powerKW = (settings.printerPower || 0) / 1000;
    const powerCostPerHour = powerKW * (settings.electricityCost || 0);
    const hourlyRate = powerCostPerHour + (settings.printerWearRate || 0);
    
    // Total time cost includes the 10% scrap multiplier (1.1)
    const timeCost = decimalHours * hourlyRate * 1.1;

    // 2. Filament Cost calculation
    const selectedFilament = settings.filaments.find(
      (f) => f.id === project.selectedFilamentId
    ) || settings.filaments[0]; // fallback to first filament if none selected
    
    const pricePerGram = selectedFilament 
      ? selectedFilament.price / selectedFilament.weight 
      : 0;
    
    // Total filament cost includes 10% scrap multiplier (1.1)
    const filamentCost = (project.filamentGrams || 0) * pricePerGram * 1.1;

    // 3. Labor Fee calculation
    const laborCost = decimalHours * (project.laborRatePerHour || 0);

    // 4. Totals and Pricing
    const other = Number(project.otherCosts) || 0;
    const productionCost = timeCost + filamentCost + other;
    
    // Profit multiplier is applied to the total production cost + labor cost
    const totalBase = productionCost + laborCost;
    const finalPrice = totalBase * (project.profitMultiplier || 1);
    const profit = finalPrice - totalBase;

    return {
      totalMinutes,
      decimalHours,
      timeCost,
      filamentCost,
      laborCost,
      productionCost,
      profit,
      finalPrice,
      selectedFilamentName: selectedFilament ? selectedFilament.name : "N/A"
    };
  }, [project, totalMinutes, settings]);

  // Reset calculator to initial state
  const resetProject = () => {
    setProject({
      ...INITIAL_PROJECT_STATE,
      selectedFilamentId: settings.filaments[0]?.id || ""
    });
  };

  // Save the current calculation to history
  const saveToHistory = () => {
    const newRecord = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(),
      projectName: project.projectName,
      details: { ...project },
      results: { ...results }
    };
    setHistory((prev) => [newRecord, ...prev]);
  };

  // Delete a saved calculation from history
  const deleteFromHistory = (id) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  return {
    project,
    results,
    history,
    updateProjectField,
    resetProject,
    saveToHistory,
    deleteFromHistory
  };
}
