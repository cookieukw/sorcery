// views/StudyApp.tsx
import { useEffect } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import {
  IonApp,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
} from "@ionic/react";
import { db } from "../classes/db";
import SubjectsList from "../components/SubjectList";
import StudySettings from "../components/StudySettings";
import StudyPlanner from "../components/StudyPlanner";
import StudyStats from "../components/StudyStats";
import AdBanner from "../components/AdBanner";
import { motion } from "framer-motion";

const StudyApp: React.FC = () => {
  const settings = useLiveQuery(() => db.settings.get(1));
  const darkMode = settings?.darkMode ?? false;

  const toggleDarkPalette = (shouldAdd: boolean) => {
    document.documentElement.classList.toggle("ion-palette-dark", shouldAdd);
  };

  useEffect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
    toggleDarkPalette(prefersDark.matches);

    const setDarkThemeFromMediaQuery = (mediaQuery: MediaQueryListEvent) => {
      toggleDarkPalette(mediaQuery.matches);
    };

    prefersDark.addEventListener("change", setDarkThemeFromMediaQuery);
    toggleDarkPalette(darkMode);
    return () => {
      prefersDark.removeEventListener("change", setDarkThemeFromMediaQuery);
    };
  }, [darkMode]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <IonApp>
      <IonHeader className="ion-no-border">
        <IonToolbar>
          <IonTitle>SORCERY</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent>
        <div className="container">
          <motion.div 
            variants={containerVariants} 
            initial="hidden" 
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <StudySettings />
            </motion.div>

            <motion.div variants={itemVariants}>
              <StudyStats />
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <SubjectsList />
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <StudyPlanner
                hoursPerDay={settings?.hoursPerDay ?? 5}
                daysPerWeek={settings?.daysPerWeek ?? 5}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <AdBanner />
            </motion.div>
          </motion.div>
        </div>
      </IonContent>
    </IonApp>
  );
};

export default StudyApp;
