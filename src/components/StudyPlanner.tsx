import {
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardContent,
  IonLabel,
} from "@ionic/react";
import { db, Subject } from "../classes/db";
import { useLiveQuery } from "dexie-react-hooks";

interface StudyPlannerProps {
  hoursPerDay: number;
  daysPerWeek: number;
}

const StudyPlanner: React.FC<StudyPlannerProps> = ({
  hoursPerDay,
  daysPerWeek,
}) => {
  const subjects = useLiveQuery(() => db.subjects.toArray()) || [];

  const calculateStudyPlan = () => {
    const totalDifficulty = subjects.reduce(
      (acc, subject) => acc + subject.difficulty,
      0
    );

    const totalHoursPerWeek = hoursPerDay * daysPerWeek;
    return subjects.map((subject: Subject) => {
      const hoursForSubject = Math.round(
        (totalHoursPerWeek / totalDifficulty) * subject.difficulty 
      );
      const requiredSquares = Math.max(1, hoursForSubject);
      const updatedSquares = subject.selectedSquares
        ? [
            ...subject.selectedSquares.slice(0, requiredSquares), // Preserva os selecionados até o limite
            ...Array(
              Math.max(0, requiredSquares - subject.selectedSquares.length)
            ).fill(false), // Adiciona quadrados se faltar
          ]
        : Array(requiredSquares).fill(false); // Caso não tenha `selectedSquares`, inicializa com o tamanho calculado

      return {
        ...subject,
        selectedSquares: updatedSquares,
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
    await db.subjects.update(subject.id, {
      selectedSquares: updatedSquares,
    });
  };

  return (
    <IonGrid>
      <IonRow>
        {calculateStudyPlan().map((subject) => (
          <IonCol size="12" key={subject.id}>
            
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
                  {subject.selectedSquares!.map((isSelected, squareIndex) => (
                    <div
                      key={squareIndex}
                      style={{
                        width: "24px",
                        height: "24px",
                        backgroundColor: isSelected ? "#4caf50" : "lightgray",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        toggleSquareSelection(subject, squareIndex)
                      }
                    />
                  ))}
                </div>
              </IonCardContent>
            </IonCard>
          </IonCol>
        ))}
      </IonRow>
    </IonGrid>
  );
};

export default StudyPlanner;
