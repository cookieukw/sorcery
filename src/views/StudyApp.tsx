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
import { motion, Variants } from "framer-motion";

const StudyApp: React.FC = () => {
  const settings = useLiveQuery(() => db.settings.get(1));
  const darkMode = settings?.darkMode ?? false;

  const toggleDarkPalette = (shouldAdd: boolean) => {
    document.documentElement.classList.toggle("ion-palette-dark", shouldAdd);
    document.documentElement.classList.toggle("ion-palette-light", !shouldAdd);
  };

  useEffect(() => {
    // Apenas aplica o darkMode das configurações ou, se não houver, da preferência do sistema
    if (settings === undefined) return; // Ainda carregando configurações
    
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
    
    // Se o usuário ainda não tiver nenhuma configuração salva (ex: primeiro acesso), usa o preferDark
    // Mas como o db popula com darkMode: false, vamos apenas usar o estado darkMode.
    toggleDarkPalette(darkMode);
    
  }, [settings, darkMode]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants: Variants = {
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
