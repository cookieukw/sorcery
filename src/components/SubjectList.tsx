// components/SubjectsList.tsx
import { useState } from "react";
import {
    IonCard,
    IonCardContent,
    IonItem,
    IonLabel,
    IonButton,
    IonInput,
    IonIcon,
    IonCardHeader,
    IonCardTitle,
    IonText,
    IonSpinner
} from "@ionic/react";
import { close, closeCircle } from "ionicons/icons";
import { useReward } from "react-rewards";
import { db } from "../classes/db";
import { useLiveQuery } from "dexie-react-hooks";
import { motion, AnimatePresence } from "framer-motion";

const SubjectsList: React.FC = () => {
    const [name, setName] = useState("");
    const [difficulty, setDifficulty] = useState(3);
    const [isLoading, setIsLoading] = useState(false);

    const subjects = useLiveQuery(() => db.subjects.toArray()) || [];

    // Rewards para feedback visual
    const { reward: trash } = useReward("trash", "emoji", {
        emoji: ["🗑"]
    });
    const { reward: square } = useReward("square", "emoji", {
        emoji: ["🟩", "🟦", "🟧", "🟥", "🟪", "🟫", "🟨"]
    });
    const { reward: change } = useReward("change", "emoji", {
        emoji: ["❌️"]
    });

    const handleDifficultyChange = (value: number) => {
        change();
        setDifficulty(value);
    };

    const addSubject = async () => {
        console.log("Valor do name antes de adicionar:", name);
        const trimmedName = name.trim();
        if (trimmedName === "") {
            console.log("Nome está vazio, não adiciona.");
            return;
        }
        setIsLoading(true);
        try {
            const newSubject = {
                name: trimmedName,
                difficulty,
                selectedSquares: [] // Inicializa o array vazio
            };
            await db.subjects.add(newSubject);
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
        change();
        await db.subjects.update(id, { difficulty: newDifficulty });
    };

    // Variantes para animação dos itens
    const listItemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 20 }
    };

    return (
        <IonCard>
            <IonCard>
                <IonCardHeader>
                    <IonCardTitle>Como funciona: </IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                    <IonText>
                        Cada{" "}
                        <IonIcon
                            style={{
                                cursor: "pointer",
                                color: "red",
                                fontSize: "1.4em",
                                verticalAlign: "middle"
                            }}
                            icon={closeCircle}
                        />{" "}
                        representa um nível de dificuldade. Quanto maior sua
                        dificuldade em uma matéria, mais horas serão estudadas.
                    </IonText>
                    <IonText>
                        <br />
                        Cada{" "}
                        <div
                            style={{
                                width: "24px",
                                height: "24px",
                                backgroundColor: "lightgray",
                                borderRadius: "4px",
                                margin: "0 8px",
                                display: "inline-block"
                            }}
                        />
                        representa uma hora a ser estudada por semana. Marque
                        todas antes de recomeçar o ciclo e depois vá desmarcando
                        para o novo ciclo.
                    </IonText>
                    <IonText>
                        <br />
                        Cada{" "}
                        <div
                            style={{
                                width: "24px",
                                height: "24px",
                                backgroundColor: "green",
                                borderRadius: "4px",
                                margin: "0 8px",
                                display: "inline-block"
                            }}
                        />{" "}
                        representa uma hora que ja foi estudada. É possível
                        marcar e desmarca-las
                    </IonText>
                </IonCardContent>
            </IonCard>

            <IonCardContent>
                {/* Layout reorganizado: input numa linha e abaixo a dificuldade com botão */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "1rem"
                    }}
                >
                    <IonItem>
                        <IonInput
                            placeholder="Adicionar Matéria"
                            value={name}
                            onIonInput={e => setName(e.detail.value!)}
                        />
                    </IonItem>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between"
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <IonLabel style={{ marginRight: "8px" }}>
                                Dificuldade:
                            </IonLabel>
                            {[...Array(5)].map((_, i) => (
                                <IonIcon
                                    key={i}
                                    icon={i < difficulty ? closeCircle : close}
                                    style={{
                                        cursor: "pointer",
                                        color: "red",
                                        fontSize: "1.4em",
                                        marginRight: "4px"
                                    }}
                                    onClick={() =>
                                        handleDifficultyChange(i + 1)
                                    }
                                />
                            ))}
                        </div>
                        <IonButton onClick={addSubject} type="button">
                            {isLoading ? (
                                <IonSpinner name="crescent" />
                            ) : (
                                "Adicionar"
                            )}
                        </IonButton>
                    </div>
                </div>

                <AnimatePresence>
                    {subjects.map(subject => (
                        <motion.div
                            key={subject.id}
                            variants={listItemVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            <IonItem>
                                <IonLabel>{subject.name}</IonLabel>
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center"
                                    }}
                                >
                                    {[...Array(5)].map((_, i) => (
                                        <IonIcon
                                            key={i}
                                            icon={
                                                i < subject.difficulty
                                                    ? closeCircle
                                                    : close
                                            }
                                            style={{
                                                color: "red",
                                                fontSize: "1.2em"
                                            }}
                                            onClick={() =>
                                                updateSubject(
                                                    subject.id!,
                                                    i + 1
                                                )
                                            }
                                        />
                                    ))}
                                </div>
                                <IonButton
                                    color="danger"
                                    onClick={() => removeSubject(subject.id!)}
                                >
                                    Remover
                                </IonButton>
                            </IonItem>
                        </motion.div>
                    ))}
                </AnimatePresence>
                <span id="change" />
                <span id="trash" />
            </IonCardContent>
        </IonCard>
    );
};

export default SubjectsList;
