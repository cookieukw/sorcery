// components/StudyPlanner.tsx
import {
  IonLabel,
  IonIcon,
  IonText,
} from "@ionic/react";
import { db, Subject } from "../classes/db";
import { useLiveQuery } from "dexie-react-hooks";
import { AnimatePresence, motion } from "framer-motion";
import { checkmarkCircleOutline, schoolOutline } from "ionicons/icons";

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

    if (totalDifficulty === 0) return [];

    return subjects.map((subject) => {
      const hours = Math.round(
        (totalHoursPerWeek / totalDifficulty) * subject.difficulty
      );
      const squares = Array(hours).fill(false);

      return {
        ...subject,
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
    await db.subjects.update(subject.id!, {
      selectedSquares: updatedSquares,
    });
  };

  const plan = calculateStudyPlan();

  return (
    <div className="glass-card">
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
        <IonIcon icon={schoolOutline} style={{ fontSize: '1.5rem', color: 'var(--magic-purple-light)' }} />
        <h2 style={{ margin: 0, fontSize: '1.2rem' }}>Plano de Estudos</h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <AnimatePresence>
          {plan.map((subject) => {
            const studied = subject.selectedSquares!.filter((s) => s).length;
            const total = subject.selectedSquares!.length;
            const progress = (studied / total) * 100;

            return (
              <motion.div 
                key={subject.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  padding: '1.2rem',
                  background: 'var(--glass-bg)',
                  borderRadius: '16px',
                  border: '1px solid var(--glass-border)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <IonLabel style={{ fontSize: '1.1rem', fontWeight: 600 }}>{subject.name}</IonLabel>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <IonText color="medium" style={{ fontSize: '0.85rem' }}>{studied}/{total}h</IonText>
                    {studied === total && <IonIcon icon={checkmarkCircleOutline} color="success" />}
                  </div>
                </div>

                <div style={{ 
                  height: '4px', 
                  background: 'var(--glass-bg)', 
                  borderRadius: '2px', 
                  marginBottom: '1rem',
                  overflow: 'hidden'
                }}>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    style={{ 
                      height: '100%', 
                      background: 'var(--magic-purple)',
                      boxShadow: '0 0 10px rgba(59, 130, 246, 0.4)'
                    }} 
                  />
                </div>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {subject.selectedSquares!.map((isSelected, squareIndex) => (
                    <div
                      key={squareIndex}
                      className={`hour-square ${isSelected ? 'selected' : ''}`}
                      onClick={() => toggleSquareSelection(subject, squareIndex)}
                    />
                  ))}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default StudyPlanner;
