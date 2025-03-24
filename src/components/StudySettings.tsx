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
import { useEffect, useState } from "react";
import { debounce } from "lodash";
import {UpdateSpec} from "dexie"
// Definição do tipo Settings
interface Settings {
    id: number;
    darkMode: boolean;
    hoursPerDay: number;
    daysPerWeek: number;
}

const StudySettings: React.FC = () => {
    const settings = useLiveQuery(() => db.settings.get(1));

    // Estados locais para evitar atualização a cada digitação
    const [hoursPerDay, setHoursPerDay] = useState<number>(5);
    const [daysPerWeek, setDaysPerWeek] = useState<number>(5);
    const [darkMode, setDarkMode] = useState<boolean>(false);

    // Atualiza estados locais quando os dados são carregados
    useEffect(() => {
        if (settings) {
            setHoursPerDay(settings.hoursPerDay ?? 5);
            setDaysPerWeek(settings.daysPerWeek ?? 5);
            setDarkMode(settings.darkMode ?? false);
        }
    }, [settings]);

    // Função para atualizar com debounce
    const updateSettings = debounce(async (changes: Partial<Settings>) => {
        if (!settings) return; // Evita erro se settings for undefin(ed
        await db.settings.update(settings.id, changes as UpdateSpec<Settings>);
    }, 500); // Espera 500ms antes de salvar

    return (
        <IonCard>
            <IonCardContent>
                {/* Toggle do Tema - Agora sincronizado com o Dexie */}
                <IonItem>
                    <IonLabel>Modo Escuro</IonLabel>
                    <IonToggle
                        checked={darkMode}
                        onIonChange={e => {
                            const newValue = e.detail.checked;
                            setDarkMode(newValue);
                            updateSettings({ darkMode: newValue });
                        }}
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
