// components/StudyPlanner.tsx
import {
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardContent,
  IonLabel,
  IonItem,
} from "@ionic/react";
import { db, Subject } from "../classes/db";
import { useLiveQuery } from "dexie-react-hooks";
import { AnimatePresence, motion } from "framer-motion";
import AdBanner from "./AdBanner";

interface StudyPlannerProps {
  hoursPerDay: number;
  daysPerWeek: number;
}

const StudyPlanner: React.FC<StudyPlannerProps> = ({
  hoursPerDay,
  daysPerWeek,
}) => {
  const subjects = useLiveQuery(() => db.subjects.toArray()) ?? [];

  const calculateStudyPlan = () => {
    const totalHoursPerWeek = hoursPerDay * daysPerWeek;
    const totalDifficulty = subjects.reduce((acc, s) => acc + s.difficulty, 0);

    return subjects.map((subject) => {
      const hours = Math.round(
        (totalHoursPerWeek / totalDifficulty) * subject.difficulty
      );
      // Garante que o array tenha exatamente 'hours' elementos
      const squares = Array(hours).fill(false);

      return {
        ...subject,
        // Se já houver selectedSquares, atualiza para o tamanho correto, senão usa os novos
        selectedSquares: subject.selectedSquares
          ? [...subject.selectedSquares, ...squares].slice(0, hours)
          : squares,
      };
    });
  };

  const toggleSquareSelection = async (
    subject: Subject,
    squareIndex: number
  ) => {
    const updatedSquares = [...subject.selectedSquares!];
    updatedSquares[squareIndex] = !updatedSquares[squareIndex];
    subject.selectedSquares = updatedSquares;
    await db.subjects.update(subject.id!, {
      selectedSquares: updatedSquares,
    });
  };

  // Variantes para animação dos itens (exemplo)
  const squareVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0 },
  };

  return (
    <IonGrid>
      <AnimatePresence>
        <IonRow>
          {calculateStudyPlan().map((subject) => {
            // Conta quantos quadrados estão marcados (estudados)
            const studied = subject.selectedSquares!.filter((s) => s).length;
            const total = subject.selectedSquares!.length;
            return (
              <IonCol size="12" key={subject.id!}>
                <IonCard>
                  <IonCardContent>
                    <IonLabel>
                      <strong>{subject.name}</strong>
                    </IonLabel>
                    <div
                      style={{
                        display: "flex",
                        gap: "6px",
                        flexWrap: "wrap",
                        marginTop: "8px",
                      }}
                    >
                      <AnimatePresence>
                        {subject.selectedSquares!.map(
                          (isSelected, squareIndex) => (
                            <motion.div
                              key={squareIndex}
                              variants={squareVariants}
                              initial="hidden"
                              animate="visible"
                              exit="exit"
                              transition={{
                                duration: 0.3,
                              }}
                              style={{
                                width: "24px",
                                height: "24px",
                                backgroundColor: isSelected
                                  ? "#4caf50"
                                  : "lightgray",
                                borderRadius: "4px",
                                cursor: "pointer",
                              }}
                              onClick={() =>
                                toggleSquareSelection(subject, squareIndex)
                              }
                            />
                          )
                        )}
                      </AnimatePresence>
                      <AdBanner />
                    </div>
                    <IonItem
                      style={{
                        marginTop: "8px",
                        fontSize: "0.9em",
                      }}
                    >
                      {studied} / {total} horas estudadas
                    </IonItem>
                    <AdBanner />
                  </IonCardContent>
                </IonCard>
              </IonCol>
            );
          })}
        </IonRow>
      </AnimatePresence>
    </IonGrid>
  );
};

export default StudyPlanner;
