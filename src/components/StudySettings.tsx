import  { useEffect } from 'react';
import {
  IonCard, IonCardContent, IonItem, IonLabel, IonInput, IonText,
} from '@ionic/react';
import { db } from '../classes/db';

const StudySettings: React.FC<{
  hoursPerDay: number;
  setHoursPerDay: (value: number) => void;
  daysPerWeek: number;
  setDaysPerWeek: (value: number) => void;
}> = ({ hoursPerDay, setHoursPerDay, daysPerWeek, setDaysPerWeek }) => {
  const maxHoursPerWeek = 7 * 24;

  const validateHoursPerDay = (value: number) => setHoursPerDay(Math.max(0, value));
  const validateDaysPerWeek = (value: number) => setDaysPerWeek(Math.min(7, Math.max(1, value)));

  const fetchSettings = async () => {
    const settingsFromDB = await db.settings.toArray();
    if (settingsFromDB.length > 0) {
      const { hoursPerDay, daysPerWeek } = settingsFromDB[0];
      setHoursPerDay(hoursPerDay);
      setDaysPerWeek(daysPerWeek);
    }
  };

  const saveSettings = async () => {
    await db.settings.clear();
    await db.settings.add({ hoursPerDay, daysPerWeek }); 
  };

  useEffect(() => {
    fetchSettings(); 
  }, []);

  useEffect(() => {
    saveSettings(); 
  }, [hoursPerDay, daysPerWeek]);

  return (
    <IonCard>
      <IonCardContent>
        <IonItem>
          <IonLabel>Horas por Dia:</IonLabel>
          <IonInput
            type="number"
            value={hoursPerDay}
            onIonChange={(e) => validateHoursPerDay(Number(e.detail.value))}
          />
        </IonItem>
        <IonItem>
          <IonLabel>Dias por Semana:</IonLabel>
          <IonInput
            type="number"
            value={daysPerWeek}
            onIonChange={(e) => validateDaysPerWeek(Number(e.detail.value))}
          />
        </IonItem>
        <IonText color="medium">
          <p style={{ textAlign: 'center' }}>
            Total de horas semanais: {hoursPerDay * daysPerWeek}/{maxHoursPerWeek}
          </p>
        </IonText>
      </IonCardContent>
    </IonCard>
  );
};

export default StudySettings;
