import { useState, useEffect } from "react";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { useAuth } from "../context/AuthContext";

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
  const { user } = useAuth();
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loadingSettings, setLoadingSettings] = useState(true);

  // Escuchar configuración desde Firestore
  useEffect(() => {
    if (!user) return;
    
    const docRef = doc(db, "users", user.uid, "config", "settings");
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setSettings(docSnap.data());
      } else {
        // Si no existe el documento para el nuevo usuario, guardamos los valores por defecto
        setDoc(docRef, DEFAULT_SETTINGS).catch(console.error);
        setSettings(DEFAULT_SETTINGS);
      }
      setLoadingSettings(false);
    }, (error) => {
      console.error("Error al escuchar configuraciones:", error);
      setLoadingSettings(false);
    });

    return () => unsubscribe();
  }, [user]);

  // Helper para guardar en Firestore (optimista)
  const saveSettingsToFirestore = (newSettings) => {
    setSettings(newSettings); // Optimistic UI update
    if (user) {
      const docRef = doc(db, "users", user.uid, "config", "settings");
      setDoc(docRef, newSettings, { merge: true }).catch(err => 
        console.error("Error saving settings to Firestore:", err)
      );
    }
  };

  // Update a single setting parameter
  const updateSetting = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    saveSettingsToFirestore(newSettings);
  };

  // Add a new filament type to the catalog list
  const addFilament = (filament) => {
    const newSettings = {
      ...settings,
      filaments: [...settings.filaments, { ...filament, id: Date.now().toString() }]
    };
    saveSettingsToFirestore(newSettings);
  };

  // Update an existing filament in the list
  const updateFilament = (id, updatedFields) => {
    const newSettings = {
      ...settings,
      filaments: settings.filaments.map((f) => (f.id === id ? { ...f, ...updatedFields } : f))
    };
    saveSettingsToFirestore(newSettings);
  };

  // Delete a filament from the catalog list
  const deleteFilament = (id) => {
    const newSettings = {
      ...settings,
      filaments: settings.filaments.filter((f) => f.id !== id)
    };
    saveSettingsToFirestore(newSettings);
  };

  return {
    settings,
    loadingSettings,
    updateSetting,
    addFilament,
    updateFilament,
    deleteFilament
  };
}
