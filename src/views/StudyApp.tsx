import { useState } from "react";
import {
  IonApp,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
} from "@ionic/react";
import SubjectsList from "../components/SubjectList";
import StudySettings from "../components/StudySettings";
import StudyPlanner from "../components/StudyPlanner";
import AdSense from "../components/AdSense";

const StudyApp: React.FC = () => {
  const [hoursPerDay, setHoursPerDay] = useState(1);
  const [daysPerWeek, setDaysPerWeek] = useState(5);

  return (
    <IonApp>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Planejador de ciclo de estudos</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <AdSense />
        <StudySettings
          hoursPerDay={hoursPerDay}
          setHoursPerDay={setHoursPerDay}
          daysPerWeek={daysPerWeek}
          setDaysPerWeek={setDaysPerWeek}
        />
        <SubjectsList />
        <StudyPlanner hoursPerDay={hoursPerDay} daysPerWeek={daysPerWeek} />
        <AdSense />
      </IonContent>
    </IonApp>
  );
};

export default StudyApp;
