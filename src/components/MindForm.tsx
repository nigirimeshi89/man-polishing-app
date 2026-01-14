// src/components/MindForm.tsx
import { useState } from 'react';

type Props = {
    onComplete: (exp: number, message: string) => void;
    onCancel: () => void;
};

export const MindForm = ({ onComplete, onCancel }: Props) => {
    const [tab, setTab] = useState('zen'); // zen, recovery, life

    // 入力用State
    const [meditationMin, setMeditationMin] = useState(0); // 瞑想(分)

    const [checks, setChecks] = useState({
        sauna: false,
        bath: false,
        journal: false,
        nature: false,
    });

    const [musicMin, setMusicMin] = useState(0); // 楽器・音楽(分)
    const [detoxHour, setDetoxHour] = useState(0); // デジタルデトックス(時間)

    const handleSubmit = () => {
        let earnedExp = 0;
        let msgParts = [];

        // ZENタブ
        if (tab === 'zen') {
            if (meditationMin > 0) {
                // 1分 = 1 XP
                earnedExp += meditationMin;
                msgParts.push(`瞑想 ${meditationMin}分`);
            }
        }

        // RECOVERYタブ
        if (tab === 'recovery') {
            if (checks.sauna) { earnedExp += 50; msgParts.push("サウナ"); }
            if (checks.bath) { earnedExp += 20; msgParts.push("入浴"); }
            if (checks.journal) { earnedExp += 20; msgParts.push("ジャーナリング"); }
            if (checks.nature) { earnedExp += 30; msgParts.push("自然に触れた"); }
        }

        // LIFEタブ
        if (tab === 'life') {
            if (musicMin > 0) {
                // 楽器演奏: 1分 = 1 XP (楽しみながら回復！)
                earnedExp += musicMin;
                msgParts.push(`音楽・趣味 ${musicMin}分`);
            }
            if (detoxHour > 0) {
                // デジタルデトックス: 1時間 = 30 XP
                const xp = detoxHour * 30;
                earnedExp += xp;
                msgParts.push(`脱スマホ ${detoxHour}時間`);
            }
        }

        if (earnedExp > 0) {
            onComplete(earnedExp, `メンタル回復！ (${msgParts.join(' + ')}) +${earnedExp} XP`);
        } else {
            alert("入力値がありません！");
        }
    };

    return (
        <>
            <div className="tab-group">
                <button className={tab === 'zen' ? 'active' : ''} onClick={() => setTab('zen')}>ZEN</button>
                <button className={tab === 'recovery' ? 'active' : ''} onClick={() => setTab('recovery')}>RECOVERY</button>
                <button className={tab === 'life' ? 'active' : ''} onClick={() => setTab('life')}>LIFE</button>
            </div>

            <div className="input-area">
                {tab === 'zen' && (
                    <>
                        <p className="hint">マインドフルネス・瞑想</p>
                        <label>🧘 瞑想した時間 (1min = 1XP)</label>
                        <input type="number" value={meditationMin} onChange={e => setMeditationMin(Number(e.target.value))} placeholder="例: 15" />
                        <p className="hint">獲得予定: {meditationMin} XP</p>
                    </>
                )}

                {tab === 'recovery' && (
                    <div className="checklist-container">
                        <p className="hint">リフレッシュ活動</p>
                        <label className="checkbox-row">
                            <input type="checkbox" checked={checks.sauna} onChange={e => setChecks({ ...checks, sauna: e.target.checked })} />
                            🧖‍♂️ サウナで整う (+50)
                        </label>
                        <label className="checkbox-row">
                            <input type="checkbox" checked={checks.bath} onChange={e => setChecks({ ...checks, bath: e.target.checked })} />
                            🛁 湯船に浸かる (+20)
                        </label>
                        <label className="checkbox-row">
                            <input type="checkbox" checked={checks.journal} onChange={e => setChecks({ ...checks, journal: e.target.checked })} />
                            📔 日記・ジャーナリング (+20)
                        </label>
                        <label className="checkbox-row">
                            <input type="checkbox" checked={checks.nature} onChange={e => setChecks({ ...checks, nature: e.target.checked })} />
                            🌲 散歩・自然に触れる (+30)
                        </label>
                    </div>
                )}

                {tab === 'life' && (
                    <>
                        <p className="hint">趣味とデジタルデトックス</p>

                        <label>🎸 楽器演奏・趣味 (1min = 1XP)</label>
                        <input type="number" value={musicMin} onChange={e => setMusicMin(Number(e.target.value))} placeholder="例: 30" />

                        <label>📵 スマホ断ち (1hour = 30XP)</label>
                        <input type="number" value={detoxHour} onChange={e => setDetoxHour(Number(e.target.value))} placeholder="例: 2" />

                        <p className="hint">
                            獲得予定: {musicMin + (detoxHour * 30)} XP
                        </p>
                    </>
                )}
            </div>

            <div className="modal-actions">
                <button className="cancel-btn" onClick={onCancel}>CANCEL</button>
                <button className="confirm-btn" onClick={handleSubmit}>COMPLETE</button>
            </div>
        </>
    );
};