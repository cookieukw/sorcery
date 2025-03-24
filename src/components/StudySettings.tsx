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
import { useState } from "react";
import { debounce } from "lodash";

const StudySettings: React.FC = () => {
    const settings = useLiveQuery(() => db.settings.get(1));

    // Estados locais para evitar atualização a cada digitação
    const [hoursPerDay, setHoursPerDay] = useState<number>(
        settings?.hoursPerDay ?? 5
    );
    const [daysPerWeek, setDaysPerWeek] = useState<number>(
        settings?.daysPerWeek ?? 5
    );

    // Função para atualizar com debounce
    const updateSettings = debounce(
        async (changes: Partial<typeof settings>) => {
            await db.settings.update(1, changes);
        },
        500
    ); // Espera 500ms antes de salvar

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
                        value={hoursPerDay}
                        onIonChange={e => {
                            const value = Math.max(0, Number(e.detail.value));
                            setHoursPerDay(value);
                            updateSettings({ hoursPerDay: value });
                        }}
                    />
                </IonItem>

                <IonItem>
                    <IonLabel>Dias por Semana:</IonLabel>
                    <IonInput
                        type="number"
                        value={daysPerWeek}
                        onIonChange={e => {
                            const value = Math.min(
                                7,
                                Math.max(1, Number(e.detail.value))
                            );
                            setDaysPerWeek(value);
                            updateSettings({ daysPerWeek: value });
                        }}
                    />
                </IonItem>

                {/* Exibição do total de horas semanais corrigido */}
                <IonText color="medium">
                    <p style={{ textAlign: "center" }}>
                        Total de horas semanais: {hoursPerDay * daysPerWeek}
                    </p>
                </IonText>
            </IonCardContent>
        </IonCard>
    );
};

export default StudySettings;
