// views/StudyApp.tsx
import { useEffect } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import {
    IonApp,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent
} from "@ionic/react";
import { db } from "../classes/db";
import SubjectsList from "../components/SubjectList";
import StudySettings from "../components/StudySettings";
import StudyPlanner from "../components/StudyPlanner";
import { motion } from "framer-motion";

const StudyApp: React.FC = () => {
    const settings = useLiveQuery(() => db.settings.get(1));
    const darkMode = settings?.darkMode ?? false;

    const toggleDarkPalette = (shouldAdd: boolean) => {
        document.documentElement.classList.toggle(
            "ion-palette-dark",
            shouldAdd
        );
    };

    useEffect(() => {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
        toggleDarkPalette(prefersDark.matches);

        const setDarkThemeFromMediaQuery = (
            mediaQuery: MediaQueryListEvent
        ) => {
            toggleDarkPalette(mediaQuery.matches);
        };

        prefersDark.addEventListener("change", setDarkThemeFromMediaQuery);
        // Aplica o tema conforme a configuração armazenada, se existir
        toggleDarkPalette(darkMode);
        return () => {
            prefersDark.removeEventListener(
                "change",
                setDarkThemeFromMediaQuery
            );
        };
    }, [darkMode, settings]);

    // Variantes para animação com framer-motion
    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { staggerChildren: 0.15 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } }
    };

    return (
        <IonApp>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Sorcery:Planejador de ciclo de estudos</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                {/* Área com animação de entrada para os componentes */}
                <motion.div
                    variants={containerVariants}
                    style={{ padding: "1rem" }}
                >
                    <StudySettings />
                    <motion.div variants={itemVariants}>
                        <SubjectsList />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <StudyPlanner
                            hoursPerDay={settings?.hoursPerDay ?? 5}
                            daysPerWeek={settings?.daysPerWeek ?? 5}
                        />
                    </motion.div>
                </motion.div>
            </IonContent>
        </IonApp>
    );
};

export default StudyApp;
