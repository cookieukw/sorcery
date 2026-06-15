import React, { useRef } from 'react';
import { 
    IonIcon, 
    IonButton, 
    IonText 
} from "@ionic/react";
import { 
    PieChart, 
    Pie, 
    Cell, 
    ResponsiveContainer, 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    Tooltip
} from 'recharts';
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../classes/db";
import { statsChartOutline, downloadOutline } from 'ionicons/icons';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const StudyStats: React.FC = () => {
    const subjects = useLiveQuery(() => db.subjects.toArray()) ?? [];
    const statsRef = useRef<HTMLDivElement>(null);

    const data = subjects.map(s => {
        const studied = s.selectedSquares.filter(sq => sq).length;
        const total = s.selectedSquares.length;
        return {
            name: s.name,
            concluido: studied,
            restante: total - studied,
            total: total
        };
    });

    const totalStudied = data.reduce((acc, curr) => acc + curr.concluido, 0);
    const totalRemaining = data.reduce((acc, curr) => acc + curr.restante, 0);
    const totalHours = totalStudied + totalRemaining;
    const completionPercentage = totalHours > 0 ? Math.round((totalStudied / totalHours) * 100) : 0;

    const pieData = [
        { name: 'Concluído', value: totalStudied, color: '#6e45e2' },
        { name: 'Pendente', value: totalRemaining, color: 'rgba(255,255,255,0.05)' }
    ];

    const exportToPDF = async () => {
        if (!statsRef.current) return;
        
        const canvas = await html2canvas(statsRef.current, {
            backgroundColor: '#0f0c29', // Match cosmic-bg
            scale: 2
        });
        
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('sorcery-resumo-estudos.pdf');
    };

    return (
        <div className="glass-card" ref={statsRef}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <IonIcon icon={statsChartOutline} style={{ fontSize: '1.5rem', color: 'var(--magic-purple-light)' }} />
                    <h2 style={{ margin: 0, fontSize: '1.2rem' }}>Resumo & Estatísticas</h2>
                </div>
                <IonButton fill="clear" onClick={exportToPDF} title="Exportar PDF">
                    <IonIcon icon={downloadOutline} slot="icon-only" />
                </IonButton>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ height: '200px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                                ))}
                            </Pie>
                            <Tooltip 
                                contentStyle={{ background: '#1c1c1d', border: 'none', borderRadius: '8px', color: '#fff' }}
                                itemStyle={{ color: '#fff' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                    <div style={{ position: 'relative', top: '-125px', textAlign: 'center' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{completionPercentage}%</div>
                        <div style={{ fontSize: '0.7rem', opacity: 0.6 }}>CONCLUÍDO</div>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1rem' }}>
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px' }}>
                        <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>Total de Horas</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{totalHours}h</div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px' }}>
                        <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>Horas Estudadas</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--magic-purple-light)' }}>{totalStudied}h</div>
                    </div>
                </div>
            </div>

            <h3 style={{ fontSize: '1rem', marginBottom: '1rem', opacity: 0.8 }}>Progresso por Matéria</h3>
            <div style={{ height: '300px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} layout="vertical" margin={{ left: 20, right: 20 }}>
                        <XAxis type="number" hide />
                        <YAxis 
                            dataKey="name" 
                            type="category" 
                            width={80} 
                            tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }} 
                        />
                        <Tooltip 
                            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                            contentStyle={{ background: '#1c1c1d', border: 'none', borderRadius: '8px' }}
                        />
                        <Bar 
                            dataKey="concluido" 
                            stackId="a" 
                            fill="var(--magic-purple)" 
                            radius={[0, 4, 4, 0]} 
                            barSize={12}
                        />
                        <Bar 
                            dataKey="restante" 
                            stackId="a" 
                            fill="rgba(255,255,255,0.05)" 
                            radius={[0, 4, 4, 0]} 
                            barSize={12}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(110, 69, 226, 0.1)', borderRadius: '12px', border: '1px solid rgba(110, 69, 226, 0.2)' }}>
                <IonText style={{ fontSize: '0.9rem' }}>
                    <strong>🧙‍♂️ Dica do Mago:</strong> 
                    {completionPercentage < 30 ? " O início é sempre a parte mais difícil da jornada. Continue firme!" : 
                     completionPercentage < 70 ? " Você está no meio do caminho! Sua disciplina está dando frutos." : 
                     completionPercentage < 100 ? " Quase lá! Sinta o poder do conhecimento fluindo." : 
                     " Ciclo concluído! Você dominou todas as magias desta semana."}
                </IonText>
            </div>
        </div>
    );
};

export default StudyStats;
