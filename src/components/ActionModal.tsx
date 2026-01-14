// src/components/ActionModal.tsx
import '../App.css';
import { BodyForm } from './BodyForm';
import { LooksForm } from './LooksForm';
import { IntelForm } from './IntelForm';
import { MindForm } from './MindForm';
import { DiscForm } from './DiscForm';

type ActionModalProps = {
    isOpen: boolean;
    onClose: () => void;
    category: 'body' | 'looks' | 'intel' | 'mind' | 'disc'; // ▼ 'intel', 'mind', and 'disc' を追加！
    onComplete: (category: 'body' | 'looks' | 'intel' | 'mind' | 'disc', exp: number, message: string) => void; // ▼ ここも！
};

export const ActionModal = ({ isOpen, onClose, category, onComplete }: ActionModalProps) => {
    if (!isOpen) return null;

    const handleComplete = (exp: number, msg: string) => {
        onComplete(category, exp, msg);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3 className="modal-title">
                    {category === 'body' && 'BODY QUEST'}
                    {category === 'looks' && 'LOOKS QUEST'}
                    {category === 'intel' && 'INTEL QUEST'}
                    {category === 'mind' && 'MIND QUEST'}
                    {category === 'disc' && 'DISC QUEST'}
                </h3>

                {category === 'body' && <BodyForm onComplete={handleComplete} onCancel={onClose} />}
                {category === 'looks' && <LooksForm onComplete={handleComplete} onCancel={onClose} />}
                {category === 'intel' && <IntelForm onComplete={handleComplete} onCancel={onClose} />}
                {category === 'mind' && <MindForm onComplete={handleComplete} onCancel={onClose} />}
                {category === 'disc' && <DiscForm onComplete={handleComplete} onCancel={onClose} />}
            </div>
        </div>
    );
};