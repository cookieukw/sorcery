import  { useState } from 'react';
import {
  IonCard, IonCardContent, IonItem, IonLabel, IonButton, IonInput, IonIcon,
} from '@ionic/react';
import { star, starOutline } from 'ionicons/icons';
import { db } from '../classes/db';
import { useLiveQuery } from 'dexie-react-hooks';

const SubjectsList: React.FC = () => {
  const [name, setName] = useState('');
  const [difficulty, setDifficulty] = useState(3);

  const subjects = useLiveQuery(() => db.subjects.toArray()) || [];

  const handleDifficultyChange = (value: number) => {
    setDifficulty(value);
  };

  const addSubject = async () => {
    if (name.trim()) {
      const newSubject: any = { name, difficulty };
      await db.subjects.add(newSubject);
      setName('');
      setDifficulty(3);
    }
  };

  const removeSubject = async (id: number) => {
    await db.subjects.delete(id);
  };

  const updateSubject = async (id: number, newDifficulty: number) => {
    await db.subjects.update(id, { difficulty: newDifficulty });
  };

  return (
    <IonCard>
      <IonCardContent>
        <IonItem>
          <IonInput
            placeholder="Adicionar Matéria"
            value={name}
            onIonChange={(e) => setName(e.detail.value!)}
          />
          <div style={{ display: 'flex', alignItems: 'center', marginRight: '8px' }}>
            {[...Array(5)].map((_, i) => (
              <IonIcon
                key={i}
                icon={i < difficulty ? star : starOutline}
                style={{ cursor: 'pointer', color: '#FFD700', fontSize: '1.4em' }}
                onClick={() => handleDifficultyChange(i + 1)}
              />
            ))}
          </div>
          <IonButton onClick={addSubject}>
            Adicionar
          </IonButton>
        </IonItem>
        {subjects.map((subject) => (
          <IonItem key={subject.id}>
            <IonLabel>{subject.name}</IonLabel>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {[...Array(5)].map((_, i) => (
                <IonIcon
                  key={i}
                  icon={i < subject.difficulty ? star : starOutline}
                  style={{ color: '#FFD700', fontSize: '1.2em' }}
                  onClick={() => updateSubject(subject.id!, i + 1)}
                />
              ))}
            </div>
            <IonButton color="danger" onClick={() => removeSubject(subject.id!)}>
              Remover
            </IonButton>
          </IonItem>
        ))}
      </IonCardContent>
    </IonCard>
  );
};

export default SubjectsList;
