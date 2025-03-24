// components/StudySettings.tsx
import {
    IonCard,
    IonCardContent,
    IonItem,
    IonLabel,
    IonInput,
    IonText,
    IonToggle
} from "@ionic/react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../classes/db";

const StudySettings: React.FC = () => {
    const settings = useLiveQuery(() => db.settings.get(1));

    const updateSettings = async (changes:any) => {
        await db.settings.update(1, changes);
    };

    if (!settings) return null;

    return (
        <IonCard>
            <IonCardContent>
                {/* Toggle do Tema - Agora sincronizado com o Dexie */}
                <IonItem>
                    <IonLabel>Modo Escuro</IonLabel>
                    <IonToggle
                        checked={settings?.darkMode}
                        onIonChange={e =>
                            updateSettings({ darkMode: e.detail.checked })
                        }
                    />
                </IonItem>

                {/* Restante das configurações */}
                <IonItem>
                    <IonLabel>Horas por Dia:</IonLabel>
                    <IonInput
                        type="number"
                        value={settings.hoursPerDay}
                        onIonChange={e =>
                            updateSettings({
                                hoursPerDay: Math.max(0, Number(e.detail.value))
                            })
                        }
                    />
                </IonItem>

                <IonItem>
                    <IonLabel>Dias por Semana:</IonLabel>
                    <IonInput
                        type="number"
                        value={settings.daysPerWeek}
                        onIonChange={e =>
                            updateSettings({
                                daysPerWeek: Math.min(
                                    7,
                                    Math.max(1, Number(e.detail.value))
                                )
                            })
                        }
                    />
                </IonItem>

                <IonText color="medium">
                    <p style={{ textAlign: "center" }}>
                        Total de horas semanais:{" "}
                        {settings.hoursPerDay * settings.daysPerWeek}
                    </p>
                </IonText>
            </IonCardContent>
        </IonCard>
    );
};

export default StudySettings;
