import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useUI } from '../services/UIContext.tsx';
import { Student } from '../types.ts';
import { DashboardIcon, UserIcon, UsersIcon, ClipboardIcon, XIcon, ChevronRightIcon } from './icons/Icons.tsx';
import Button from './form/Button.tsx';

// --- MOCK DATA ---
const mockStudents: Student[] = [
  { id: 1, name: 'Ayşe Yılmaz', group: 'Sınıf 3-A', avatar: '👧',
    assignments: [
      { id: 101, name: 'Toplama Alıştırması', module: 'Dört İşlem', dueDate: '2024-10-25', status: 'tamamlandı', score: 95 },
      { id: 102, name: 'Kesir Problemleri', module: 'Kesirler', dueDate: '2024-10-28', status: 'tamamlandı', score: 70 },
      { id: 103, name: 'Saat Okuma', module: 'Zaman Ölçme', dueDate: '2024-11-02', status: 'beklemede' }
    ],
    performance: { 'arithmetic': 92, 'fractions': 75, 'place-value': 88, 'geometry': 60, 'time': 80 }
  },
  { id: 2, name: 'Ali Vural', group: 'Sınıf 3-B', avatar: '👦',
    assignments: [
      { id: 101, name: 'Toplama Alıştırması', module: 'Dört İşlem', dueDate: '2024-10-25', status: 'tamamlandı', score: 80 },
      { id: 104, name: 'Geometri Şekilleri', module: 'Geometri', dueDate: '2024-11-01', status: 'geç', score: 55 }
    ],
    performance: { 'arithmetic': 85, 'fractions': 60, 'place-value': 75, 'geometry': 55, 'time': 70 }
  },
  { id: 3, name: 'Fatma Kaya', group: 'Sınıf 3-A', avatar: '👩',
    assignments: [
      { id: 102, name: 'Kesir Problemleri', module: 'Kesirler', dueDate: '2024-10-28', status: 'tamamlandı', score: 85 },
      { id: 103, name: 'Saat Okuma', module: 'Zaman Ölçme', dueDate: '2024-11-02', status: 'beklemede' }
    ],
    performance: { 'arithmetic': 95, 'fractions': 90, 'place-value': 92, 'geometry': 85, 'time': 88 }
  }
];

// --- SUB-COMPONENTS ---

// FIX: Updated the type for the `icon` prop to `React.FC<React.SVGProps<SVGSVGElement>>` to allow passing standard SVG attributes like `className`.
const NavItem: React.FC<{ icon: React.FC<React.SVGProps<SVGSVGElement>>; label: string; isActive: boolean; onClick: () => void }> = ({ icon: Icon, label, isActive, onClick }) => (
    <button onClick={onClick} className={`teacher-panel-nav-item ${isActive ? 'active' : ''}`}>
        <Icon className="w-5 h-5 flex-shrink-0" />
        <span className="flex-grow">{label}</span>
    </button>
);

const PerformanceBarChart: React.FC<{ data: { label: string; value: number }[] }> = ({ data }) => (
    <div className="w-full h-48 flex items-end gap-2 px-2 border-l border-b border-stone-200 dark:border-stone-700">
        {data.map(({ label, value }) => (
            <div key={label} className="flex-1 flex flex-col items-center gap-1">
                <div className="relative flex-1 w-full flex items-end">
                    <div style={{ height: `${value}%` }} className="w-full bg-primary/70 hover:bg-primary rounded-t-md transition-all"></div>
                </div>
                <span className="text-xs text-stone-500">{label}</span>
            </div>
        ))}
    </div>
);

const PerformanceRadarChart: React.FC<{ data: { [key: string]: number } }> = ({ data }) => {
    const labels = Object.keys(data);
    const size = 200;
    const center = size / 2;
    const radius = size * 0.4;

    const points = labels.map((label, i) => {
        const angle = (i / labels.length) * 2 * Math.PI - Math.PI / 2;
        const value = data[label] || 0;
        const r = (value / 100) * radius;
        const x = center + r * Math.cos(angle);
        const y = center + r * Math.sin(angle);
        return `${x},${y}`;
    }).join(' ');

    const axisLabels = labels.map((label, i) => {
        const angle = (i / labels.length) * 2 * Math.PI - Math.PI / 2;
        const r = radius + 15;
        const x = center + r * Math.cos(angle);
        const y = center + r * Math.sin(angle);
        return <text key={label} x={x} y={y} fontSize="10" fill="currentColor" textAnchor="middle" dominantBaseline="middle">{label}</text>;
    });
    
    return (
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-xs mx-auto">
            <g className="text-stone-300 dark:text-stone-600">
                {labels.map((_, i) => (
                    <line key={i} x1={center} y1={center} x2={center + radius * Math.cos((i / labels.length) * 2 * Math.PI - Math.PI / 2)} y2={center + radius * Math.sin((i / labels.length) * 2 * Math.PI - Math.PI / 2)} stroke="currentColor" strokeWidth="0.5" />
                ))}
            </g>
            <polygon points={points} fill="rgba(var(--theme-color-primary-rgb), 0.3)" stroke="rgb(var(--theme-color-primary-rgb))" strokeWidth="1.5" />
            <g className="text-stone-600 dark:text-stone-300">{axisLabels}</g>
        </svg>
    );
};


// --- MAIN PANEL COMPONENT ---

interface TeacherPanelProps {
    isVisible: boolean;
    onClose: () => void;
}

const TeacherPanel: React.FC<TeacherPanelProps> = ({ isVisible, onClose }) => {
    const { setAppMode } = useUI();
    const [activeView, setActiveView] = useState<'dashboard' | 'students' | 'groups' | 'assignments'>('dashboard');
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const panelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isVisible) panelRef.current?.focus();
    }, [isVisible]);
    
    const handleCreateAssignment = () => {
        setAppMode('assignmentCreation');
        onClose();
    };

    const StatusBadge: React.FC<{ status: 'tamamlandı' | 'beklemede' | 'geç' }> = ({ status }) => {
        const styles = {
            tamamlandı: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
            beklemede: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
            geç: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
        };
        return <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${styles[status]}`}>{status}</span>;
    };

    const renderContent = () => {
        if (selectedStudent) {
            return (
                <div>
                     <button onClick={() => setSelectedStudent(null)} className="text-sm font-medium mb-4 flex items-center gap-1 text-stone-500 hover:text-primary">&larr; Tüm Öğrenciler</button>
                    <div className="flex items-center gap-4 mb-6">
                        <span className="text-4xl">{selectedStudent.avatar}</span>
                        <div>
                            <h3 className="text-xl font-bold">{selectedStudent.name}</h3>
                            <p className="text-stone-500">{selectedStudent.group}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="teacher-panel-card">
                            <h4 className="font-semibold mb-3">Performans Analizi</h4>
                            <PerformanceRadarChart data={selectedStudent.performance} />
                        </div>
                         <div className="teacher-panel-card">
                            <h4 className="font-semibold mb-3">Ödev Geçmişi</h4>
                             <table className="w-full teacher-panel-table">
                                <tbody>
                                    {selectedStudent.assignments.map(a => (
                                        <tr key={a.id}>
                                            <td>{a.name}<br/><small className="text-stone-500">{a.module}</small></td>
                                            <td className="text-center"><StatusBadge status={a.status} /></td>
                                            <td className="text-right font-semibold">{a.score ? `${a.score}` : '-'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                             </table>
                        </div>
                    </div>
                </div>
            );
        }

        switch (activeView) {
            case 'students':
                return (
                    <div>
                        <h3 className="text-xl font-bold mb-4">Öğrenciler</h3>
                        <div className="teacher-panel-card">
                            <table className="w-full text-left teacher-panel-table">
                                <thead>
                                    <tr><th>İsim</th><th>Grup</th><th>Eylemler</th></tr>
                                </thead>
                                <tbody>
                                    {mockStudents.map(s => (
                                        <tr key={s.id}>
                                            <td className="font-medium flex items-center gap-3"><span className="text-2xl">{s.avatar}</span> {s.name}</td>
                                            <td>{s.group}</td>
                                            <td><button onClick={() => setSelectedStudent(s)} className="text-primary hover:underline text-sm font-semibold flex items-center">Detayları Gör <ChevronRightIcon className="w-4 h-4"/></button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'dashboard':
            default:
                return (
                    <div>
                        <h3 className="text-xl font-bold mb-4">Genel Bakış</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div className="teacher-panel-card">
                                <h4 className="text-sm font-semibold text-stone-500 mb-1">Toplam Öğrenci</h4>
                                <p className="text-3xl font-bold">{mockStudents.length}</p>
                            </div>
                            <div className="teacher-panel-card">
                                <h4 className="text-sm font-semibold text-stone-500 mb-1">Aktif Ödevler</h4>
                                <p className="text-3xl font-bold">5</p>
                            </div>
                            <div className="teacher-panel-card">
                                <h4 className="text-sm font-semibold text-stone-500 mb-1">Ortalama Başarı</h4>
                                <p className="text-3xl font-bold text-green-600">82%</p>
                            </div>
                        </div>
                        <div className="teacher-panel-card">
                            <h4 className="font-semibold mb-3">Konulara Göre Sınıf Performansı</h4>
                            <PerformanceBarChart data={[
                                {label: '4 İşlem', value: 90}, {label: 'Kesirler', value: 75},
                                {label: 'Basamak D.', value: 85}, {label: 'Geometri', value: 65},
                                {label: 'Zaman', value: 80}, {label: 'Ölçüler', value: 78}
                            ]} />
                        </div>
                    </div>
                );
        }
    };

    return (
        <div
            className={`print:hidden fixed inset-0 z-40 flex items-center justify-center transition-opacity duration-300 ${isVisible ? 'bg-black/50' : 'bg-transparent pointer-events-none'}`}
            onClick={onClose}
            aria-modal="true" role="dialog"
        >
            <div
                ref={panelRef}
                className={`bg-stone-50 dark:bg-stone-900 w-full h-full flex flex-col transition-all duration-300 ease-in-out ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`}
                onClick={(e) => e.stopPropagation()}
                tabIndex={-1}
            >
                <header className="flex justify-between items-center p-4 border-b border-stone-200 dark:border-stone-700 flex-shrink-0 bg-white dark:bg-stone-800">
                    <h2 className="text-xl font-bold flex items-center gap-3"><DashboardIcon/> Öğretmen Paneli</h2>
                    <Button onClick={handleCreateAssignment}>
                        <ClipboardIcon className="w-5 h-5"/> Yeni Ödev Oluştur
                    </Button>
                    <button onClick={onClose} className="p-2 -mr-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-700" aria-label="Kapat"><XIcon /></button>
                </header>
                
                <div className="flex flex-grow overflow-hidden">
                    <aside className="w-56 border-r border-stone-200 dark:border-stone-700 p-3 bg-white dark:bg-stone-800">
                        <nav className="flex flex-col gap-1">
                            <NavItem icon={DashboardIcon} label="Genel Bakış" isActive={activeView === 'dashboard'} onClick={() => { setActiveView('dashboard'); setSelectedStudent(null); }} />
                            <NavItem icon={UserIcon} label="Öğrenciler" isActive={activeView === 'students'} onClick={() => { setActiveView('students'); setSelectedStudent(null); }} />
                            <NavItem icon={UsersIcon} label="Gruplar" isActive={activeView === 'groups'} onClick={() => { setActiveView('groups'); setSelectedStudent(null); }} />
                            <NavItem icon={ClipboardIcon} label="Ödevler" isActive={activeView === 'assignments'} onClick={() => { setActiveView('assignments'); setSelectedStudent(null); }} />
                        </nav>
                    </aside>
                    <main className="flex-1 p-6 overflow-y-auto">
                        {renderContent()}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default TeacherPanel;