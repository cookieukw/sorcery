// components/SubjectsList.tsx
import { useState } from "react";
import {
    IonItem,
    IonLabel,
    IonButton,
    IonInput,
    IonIcon,
    IonText,
    IonSpinner
} from "@ionic/react";
import { star, starOutline, addOutline, trashOutline, helpCircleOutline } from "ionicons/icons";
import { useReward } from "react-rewards";
import { db } from "../classes/db";
import { useLiveQuery } from "dexie-react-hooks";
import { motion, AnimatePresence } from "framer-motion";

const SubjectsList: React.FC = () => {
    const [name, setName] = useState("");
    const [difficulty, setDifficulty] = useState(3);
    const [isLoading, setIsLoading] = useState(false);
    const [showHelp, setShowHelp] = useState(false);

    const subjects = useLiveQuery(() => db.subjects.toArray()) || [];

    const { reward: trash } = useReward("trash", "emoji", { emoji: ["🗑"] });
    const { reward: square } = useReward("square", "emoji", { emoji: ["✨", "🔮", "📚"] });

    const addSubject = async () => {
        const trimmedName = name.trim();
        if (trimmedName === "") return;
        setIsLoading(true);
        try {
            await db.subjects.add({
                name: trimmedName,
                difficulty,
                selectedSquares: []
            });
            square();
            setName("");
            setDifficulty(3);
        } catch (error) {
            console.error("Erro ao adicionar matéria:", error);
        }
        setIsLoading(false);
    };

    const removeSubject = async (id: number) => {
        trash();
        await db.subjects.delete(id);
    };

    const updateSubject = async (id: number, newDifficulty: number) => {
        await db.subjects.update(id, { difficulty: newDifficulty });
    };

    return (
        <div className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ margin: 0, fontSize: '1.2rem' }}>Matérias do Ciclo</h2>
                <IonIcon 
                    icon={helpCircleOutline} 
                    style={{ fontSize: '1.5rem', cursor: 'pointer', opacity: 0.6 }} 
                    onClick={() => setShowHelp(!showHelp)}
                />
            </div>

            <AnimatePresence>
                {showHelp && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        style={{ overflow: 'hidden', marginBottom: '1.5rem' }}
                    >
                        <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', fontSize: '0.9rem' }}>
                            <p>✨ <strong>Dificuldade:</strong> Quanto maior a dificuldade, mais horas o sistema dedicará a esta matéria no ciclo.</p>
                            <p>🔮 <strong>Ciclo:</strong> Marque os quadrados conforme for estudando. Ao completar todos, reinicie o ciclo.</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                <IonItem lines="none" style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                    <IonInput
                        placeholder="Nome da matéria (ex: Matemática)"
                        value={name}
                        onIonInput={e => setName(e.detail.value!)}
                    />
                </IonItem>
                
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <IonLabel style={{ fontSize: '0.9rem', opacity: 0.8 }}>Peso:</IonLabel>
                        <div style={{ display: 'flex', gap: '4px' }}>
                            {[1, 2, 3, 4, 5].map((i) => (
                                <IonIcon
                                    key={i}
                                    icon={i <= difficulty ? star : starOutline}
                                    className={`difficulty-star ${i <= difficulty ? 'active' : 'inactive'}`}
                                    onClick={() => setDifficulty(i)}
                                />
                            ))}
                        </div>
                    </div>
                    
                    <IonButton className="btn-magic" onClick={addSubject} disabled={isLoading || !name.trim()}>
                        {isLoading ? <IonSpinner name="crescent" /> : <><IonIcon icon={addOutline} slot="start" /> Adicionar</>}
                    </IonButton>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <AnimatePresence>
                    {subjects.map(subject => (
                        <motion.div
                            key={subject.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'space-between',
                                padding: '1rem',
                                background: 'rgba(255,255,255,0.02)',
                                borderRadius: '12px',
                                border: '1px solid rgba(255,255,255,0.05)'
                            }}
                        >
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 600, marginBottom: '4px' }}>{subject.name}</div>
                                <div style={{ display: 'flex', gap: '2px' }}>
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <IonIcon
                                            key={i}
                                            icon={i <= subject.difficulty ? star : starOutline}
                                            style={{ 
                                                fontSize: '0.9rem', 
                                                color: i <= subject.difficulty ? '#ffd700' : 'rgba(255,255,255,0.1)',
                                                cursor: 'pointer'
                                            }}
                                            onClick={() => updateSubject(subject.id!, i)}
                                        />
                                    ))}
                                </div>
                            </div>
                            
                            <IonButton 
                                fill="clear" 
                                color="danger" 
                                onClick={() => removeSubject(subject.id!)}
                                style={{ '--padding-start': '8px', '--padding-end': '8px' }}
                            >
                                <IonIcon icon={trashOutline} />
                            </IonButton>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
            
            <span id="square" style={{ position: 'fixed', left: '50%', top: '50%' }} />
            <span id="trash" style={{ position: 'fixed', left: '50%', top: '50%' }} />
        </div>
    );
};

export default SubjectsList;
