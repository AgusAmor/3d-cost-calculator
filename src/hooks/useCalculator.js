import { useState, useMemo } from "react";
import useLocalStorage from "./useLocalStorage";

const INITIAL_PROJECT_STATE = {
  projectName: "Impresión 3D Nueva",
  profitMultiplier: 6,
  laborRatePerHour: 0,
  otherCosts: 0,
  plates: [
    {
      id: "plate-1",
      name: "Placa de Impresión 1",
      hoursDecimal: 0,
      selectedFilamentId: "", // initialized dynamically
      filamentGrams: 0
    }
  ]
};

/**
 * Hook to manage a 3D print calculation job with support for multiple plates.
 * Implements conversions for time (decimal hours), filament cost (10% scrap),
 * multi-plate summation, and overall multipliers.
 * 
 * @param {object} settings - Settings object from useSettings.
 */
export default function useCalculator(
  settings,
  initialProjectState = INITIAL_PROJECT_STATE,
  skipHistory = false
) {
  const [project, setProject] = useState(initialProjectState);
  
  // Conditionally use localStorage or basic state for history
  // Since hooks can't be conditionally called, we handle the flag internally inside useLocalStorage? 
  // No, useLocalStorage doesn't support skip. Let's just use useLocalStorage and if skipHistory is true, we ignore it.
  // Actually, to prevent key collisions, we can use a dummy key if skipHistory is true.
  const historyKey = skipHistory ? "3d_calc_history_dummy" : "3d_calc_history_v3";
  const [history, setHistory] = useLocalStorage(historyKey, []);

  // Update top-level project fields (projectName, profitMultiplier, etc.)
  const updateProjectField = (key, value) => {
    setProject((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  // Add a new plate to the project
  const addPlate = () => {
    const defaultFilamentId = settings.filaments[0]?.id || "";
    setProject((prev) => {
      const nextIndex = prev.plates.length + 1;
      return {
        ...prev,
        plates: [
          ...prev.plates,
          {
            id: Date.now().toString() + Math.random().toString().slice(-4),
            name: `Placa de Impresión ${nextIndex}`,
            hoursDecimal: 0,
            selectedFilamentId: defaultFilamentId,
            filamentGrams: 0
          }
        ]
      };
    });
  };

  // Remove a plate by ID
  const removePlate = (id) => {
    setProject((prev) => {
      // Ensure at least one plate remains in the project
      if (prev.plates.length <= 1) return prev;
      return {
        ...prev,
        plates: prev.plates.filter((p) => p.id !== id)
      };
    });
  };

  // Update a specific field of a single plate
  const updatePlate = (id, updatedFields) => {
    setProject((prev) => ({
      ...prev,
      plates: prev.plates.map((p) => (p.id === id ? { ...p, ...updatedFields } : p))
    }));
  };

  // Compute all costs and prices reactively across all plates
  const results = useMemo(() => {
    let totalMinutes = 0;
    let totalTimeCost = 0;
    let totalFilamentCost = 0;

    const powerKW = (settings.printerPower || 0) / 1000;
    const powerCostPerHour = powerKW * (settings.electricityCost || 0);
    const printerHourlyRate = powerCostPerHour + (settings.printerWearRate || 0);

    // Details breakdown per plate for rendering lists and invoices
    const platesBreakdown = project.plates ? project.plates.map((plate) => {
      // Parse decimal hours to minutes
      const hd = Number(plate.hoursDecimal) || 0;
      const hoursInt = Math.floor(hd);
      const minsPart = Math.round((hd - hoursInt) * 100);
      const plateMinutes = hoursInt * 60 + minsPart;
      const decimalHours = plateMinutes / 60;

      // Time Cost for this plate (including 10% scrap)
      const timeCost = decimalHours * printerHourlyRate * 1.1;

      // Filament Cost for this plate (including 10% scrap)
      const selectedFilament = settings.filaments.find(
        (f) => f.id === plate.selectedFilamentId
      ) || settings.filaments[0];

      const pricePerGram = selectedFilament 
        ? selectedFilament.price / selectedFilament.weight 
        : 0;
      const filamentCost = (plate.filamentGrams || 0) * pricePerGram * 1.1;

      // Accumulate totals
      totalMinutes += plateMinutes;
      totalTimeCost += timeCost;
      totalFilamentCost += filamentCost;

      return {
        id: plate.id,
        name: plate.name,
        hoursDecimal: plate.hoursDecimal,
        filamentGrams: plate.filamentGrams,
        minutes: plateMinutes,
        decimalHours,
        timeCost,
        filamentCost,
        selectedFilamentName: selectedFilament ? selectedFilament.name : "N/A"
      };
    }) : [];

    const totalDecimalHours = totalMinutes / 60;
    const laborCost = totalDecimalHours * (project.laborRatePerHour || 0);
    const productionCost = totalTimeCost + totalFilamentCost;

    const totalBase = productionCost + laborCost;
    const baseWithProfit = totalBase * (project.profitMultiplier || 1);
    const profit = baseWithProfit - totalBase;

    const other = Number(project.otherCosts) || 0;
    const finalPrice = baseWithProfit + other;

    return {
      totalMinutes,
      totalDecimalHours,
      timeCost: totalTimeCost,
      filamentCost: totalFilamentCost,
      laborCost,
      productionCost,
      profit,
      finalPrice,
      platesBreakdown
    };
  }, [project.plates, project.laborRatePerHour, project.otherCosts, project.profitMultiplier, settings]);

  // Reset calculator to initial state
  const resetProject = () => {
    const defaultFilamentId = settings.filaments[0]?.id || "";
    setProject({
      ...INITIAL_PROJECT_STATE,
      plates: [
        {
          id: "plate-1",
          name: "Placa de Impresión 1",
          hoursDecimal: 0,
          selectedFilamentId: defaultFilamentId,
          filamentGrams: 0
        }
      ]
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

  // Update a specific history item
  const updateHistoryItem = (id, updatedProjectDetails, updatedResults) => {
    if (skipHistory) return;
    setHistory((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              details: { ...updatedProjectDetails },
              results: { ...updatedResults },
            }
          : item
      )
    );
  };

  // Load a saved calculation back into active edit mode
  const loadProject = (savedDetails) => {
    // Deep clone the plates just to be safe
    const parsedPlates = savedDetails.plates.map(p => ({...p}));
    setProject({ ...savedDetails, plates: parsedPlates });
  };

  return {
    project,
    results,
    history,
    updateProjectField,
    addPlate,
    removePlate,
    updatePlate,
    resetProject,
    saveToHistory,
    updateHistoryItem,
    deleteFromHistory,
    loadProject
  };
}
