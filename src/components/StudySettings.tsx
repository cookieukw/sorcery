import {
    IonItem,
    IonLabel,
    IonInput,
    IonText,
    IonToggle,
    IonIcon,
    IonButton,
    IonAlert
} from "@ionic/react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../classes/db";
import { useEffect, useState } from "react";
import { debounce } from "lodash";
import { UpdateSpec } from "dexie";
import { 
    moonOutline, 
    sunnyOutline, 
    timeOutline, 
    calendarOutline, 
    trashOutline, 
    refreshOutline,
    alertCircleOutline
} from "ionicons/icons";

interface Settings {
    id: number;
    darkMode: boolean;
    hoursPerDay: number;
    daysPerWeek: number;
}

const StudySettings: React.FC = () => {
    const settings = useLiveQuery(() => db.settings.get(1));

    const [hoursPerDay, setHoursPerDay] = useState<number>(5);
    const [daysPerWeek, setDaysPerWeek] = useState<number>(5);
    const [darkMode, setDarkMode] = useState<boolean>(false);
    const [showAlert, setShowAlert] = useState<{ show: boolean, type: 'progress' | 'all' }>({ show: false, type: 'progress' });

    useEffect(() => {
        if (settings) {
            setHoursPerDay(settings.hoursPerDay ?? 5);
            setDaysPerWeek(settings.daysPerWeek ?? 5);
            setDarkMode(settings.darkMode ?? false);
        }
    }, [settings]);

    const updateSettings = debounce(async (changes: Partial<Settings>) => {
        if (!settings) return;
        await db.settings.update(settings.id, changes as UpdateSpec<Settings>);
    }, 500);

    const resetProgress = async () => {
        const subjects = await db.subjects.toArray();
        for (const subject of subjects) {
            await db.subjects.update(subject.id!, {
                selectedSquares: subject.selectedSquares.map(() => false)
            });
        }
    };

    const resetAll = async () => {
        await db.subjects.clear();
        await db.settings.update(1, {
            hoursPerDay: 5,
            daysPerWeek: 5
        });
    };

    return (
        <div className="glass-card">
            <h2 style={{ marginTop: 0, marginBottom: '1.5rem', fontSize: '1.2rem' }}>Configurações do Ciclo</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="setting-item">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <IonIcon icon={timeOutline} style={{ color: 'var(--magic-purple-light)' }} />
                        <IonLabel style={{ fontSize: '0.9rem', opacity: 0.8 }}>Horas por Dia</IonLabel>
                    </div>
                    <IonInput
                        type="number"
                        value={hoursPerDay}
                        onIonChange={e => {
                            const value = Math.max(0, Number(e.detail.value));
                            setHoursPerDay(value);
                            updateSettings({ hoursPerDay: value });
                        }}
                    />
                </div>

                <div className="setting-item">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <IonIcon icon={calendarOutline} style={{ color: 'var(--magic-purple-light)' }} />
                        <IonLabel style={{ fontSize: '0.9rem', opacity: 0.8 }}>Dias por Semana</IonLabel>
                    </div>
                    <IonInput
                        type="number"
                        value={daysPerWeek}
                        onIonChange={e => {
                            const value = Math.min(7, Math.max(1, Number(e.detail.value)));
                            setDaysPerWeek(value);
                            updateSettings({ daysPerWeek: value });
                        }}
                    />
                </div>
            </div>

            <IonItem lines="none" style={{ marginTop: '1rem' }}>
                <IonIcon 
                    icon={darkMode ? moonOutline : sunnyOutline} 
                    slot="start" 
                    style={{ color: 'var(--magic-purple-light)' }} 
                />
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

            <div style={{ 
                marginTop: '1.5rem', 
                padding: '1rem', 
                background: 'var(--glass-bg)', 
                borderRadius: '12px',
                textAlign: 'center'
            }}>
                <IonText style={{ fontSize: '0.9rem', opacity: 0.7 }}>
                    Carga horária total
                </IonText>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--magic-purple-light)' }}>
                    {hoursPerDay * daysPerWeek}h <span style={{ fontSize: '1rem', fontWeight: 400, opacity: 0.6 }}>/semana</span>
                </div>
            </div>

            {/* Danger Zone */}
            <div style={{ marginTop: '2rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem', color: '#ff4961' }}>
                    <IonIcon icon={alertCircleOutline} />
                    <h3 style={{ margin: 0, fontSize: '1rem', color: '#ff4961', background: 'none', WebkitTextFillColor: 'initial' }}>Zona de Perigo</h3>
                </div>
                
                <div style={{ display: 'flex', gap: '10px' }}>
                    <IonButton 
                        fill="outline" 
                        color="warning" 
                        expand="block" 
                        style={{ flex: 1, fontSize: '0.8rem' }}
                        onClick={() => setShowAlert({ show: true, type: 'progress' })}
                    >
                        <IonIcon icon={refreshOutline} slot="start" />
                        Zerar Ciclo
                    </IonButton>
                    <IonButton 
                        fill="outline" 
                        color="danger" 
                        expand="block" 
                        style={{ flex: 1, fontSize: '0.8rem' }}
                        onClick={() => setShowAlert({ show: true, type: 'all' })}
                    >
                        <IonIcon icon={trashOutline} slot="start" />
                        Resetar Tudo
                    </IonButton>
                </div>
            </div>

            <IonAlert
                isOpen={showAlert.show}
                onDidDismiss={() => setShowAlert({ ...showAlert, show: false })}
                header={showAlert.type === 'progress' ? 'Zerar Progresso?' : 'Resetar Tudo?'}
                message={
                    showAlert.type === 'progress' 
                    ? 'Isso limpará todos os quadrados marcados, mas manterá suas matérias.' 
                    : 'Isso apagará todas as matérias e voltará as configurações ao padrão.'
                }
                buttons={[
                    { text: 'Cancelar', role: 'cancel' },
                    { 
                        text: 'Confirmar', 
                        handler: () => {
                            if (showAlert.type === 'progress') resetProgress();
                            else resetAll();
                        }
                    }
                ]}
            />
        </div>
    );
};

export default StudySettings;
