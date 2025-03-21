
import { useState, useEffect } from 'react';
import { SiteSettings } from '@/types/siteSettings';
import { defaultSettings } from './useSettingsDefaults';

export const useSettingsStorage = () => {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings as SiteSettings);

  // Charger les paramètres au démarrage
  useEffect(() => {
    try {
      // Récupérer les paramètres principaux
      const storedSettings = localStorage.getItem('siteSettings');
      let parsedSettings = storedSettings ? JSON.parse(storedSettings) : defaultSettings;
      
      // Vérifier si les images sont stockées séparément et les récupérer
      const storedLogo = localStorage.getItem('site_logo');
      if (storedLogo) {
        parsedSettings.logo = storedLogo;
        console.log("Logo chargé depuis le stockage séparé");
      }
      
      const storedFavicon = localStorage.getItem('site_favicon');
      if (storedFavicon) {
        parsedSettings.favicon = storedFavicon;
        console.log("Favicon chargé depuis le stockage séparé");
      }
      
      // S'assurer que le mode sombre est toujours désactivé
      parsedSettings.darkMode = false;
      
      setSettings(parsedSettings as SiteSettings);
      console.log("Paramètres chargés avec succès", parsedSettings);
    } catch (error) {
      console.error("Erreur lors du chargement des paramètres:", error);
      setSettings({...defaultSettings, darkMode: false} as SiteSettings);
    }
  }, []);

  // Sauvegarder les paramètres à chaque modification
  useEffect(() => {
    try {
      // Sauvegarder immédiatement le logo et favicon
      if (settings.logo && settings.logo.startsWith('data:')) {
        localStorage.setItem('site_logo', settings.logo);
        console.log("Logo sauvegardé séparément");
      }
      
      if (settings.favicon && settings.favicon.startsWith('data:')) {
        localStorage.setItem('site_favicon', settings.favicon);
        console.log("Favicon sauvegardé séparément");
      }
      
      // Créer une copie des paramètres pour éviter de stocker les grandes data URLs directement
      const settingsToStore = { ...settings, darkMode: false };
      
      // Ne pas stocker les grandes data URLs dans l'objet principal
      if (settingsToStore.logo && settingsToStore.logo.startsWith('data:')) {
        // Remplacer par un indicateur dans l'objet principal
        settingsToStore.logo = 'stored_separately';
      }
      
      if (settingsToStore.favicon && settingsToStore.favicon.startsWith('data:')) {
        // Remplacer par un indicateur dans l'objet principal
        settingsToStore.favicon = 'stored_separately';
      }
      
      localStorage.setItem('siteSettings', JSON.stringify(settingsToStore));
      console.log("Paramètres sauvegardés avec succès");
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des paramètres:", error);
    }
  }, [settings]);

  const updateSettings = (newSettings: Partial<SiteSettings>) => {
    setSettings((prevSettings) => {
      // S'assurer que le mode sombre reste désactivé
      const updatedSettings = {
        ...prevSettings,
        ...newSettings,
        darkMode: false
      };
      console.log("Paramètres mis à jour:", updatedSettings);
      return updatedSettings;
    });
  };

  const resetSettings = () => {
    // Supprimer également les images stockées séparément
    localStorage.removeItem('site_logo');
    localStorage.removeItem('site_favicon');
    
    setSettings({...defaultSettings, darkMode: false} as SiteSettings);
    console.log("Paramètres réinitialisés");
  };

  return {
    settings,
    updateSettings,
    resetSettings
  };
};
