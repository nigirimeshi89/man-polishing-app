// src/components/IntelForm.tsx
import { useState } from 'react';

type Props = {
    onComplete: (exp: number, message: string) => void;
    onCancel: () => void;
};

export const IntelForm = ({ onComplete, onCancel }: Props) => {
    const [tab, setTab] = useState('study'); // study, read, info

    // 入力用State
    const [progMin, setProgMin] = useState(0);  // プログラミング(分)
    const [toeicMin, setToeicMin] = useState(0); // TOEIC(分)
    const [certMin, setCertMin] = useState(0);   // 資格(分)

    const [pages, setPages] = useState(0);      // 読書(ページ数)

    const [news, setNews] = useState({ it: false, general: false });

    const handleSubmit = () => {
        let earnedExp = 0;
        let msgParts = [];

        // STUDYタブ（時間ベース）
        if (tab === 'study') {
            if (progMin > 0) {
                // プログラミング: 分 × 1 XP
                const xp = progMin * 1;
                earnedExp += xp;
                msgParts.push(`開発 ${progMin}分`);
            }
            if (toeicMin > 0) {
                // TOEIC: 分 × 0.5 XP (端数切り捨て)
                const xp = Math.floor(toeicMin * 0.5);
                earnedExp += xp;
                msgParts.push(`TOEIC ${toeicMin}分`);
            }
            if (certMin > 0) {
                // 資格: 分 × 0.5 XP
                const xp = Math.floor(certMin * 0.5);
                earnedExp += xp;
                msgParts.push(`資格学習 ${certMin}分`);
            }
        }

        // READタブ（ページ数ベース）
        if (tab === 'read') {
            if (pages > 0) {
                // 読書: ページ × 1 XP
                const xp = pages * 1;
                earnedExp += xp;
                msgParts.push(`読書 ${pages}ページ`);
            }
        }

        // INFOタブ（チェックボックス）
        if (tab === 'info') {
            if (news.it) {
                earnedExp += 10;
                msgParts.push("ITニュース");
            }
            if (news.general) {
                earnedExp += 5;
                msgParts.push("一般ニュース");
            }
        }

        if (earnedExp > 0) {
            onComplete(earnedExp, `知性強化完了！ (${msgParts.join(' + ')}) +${earnedExp} XP`);
        } else {
            alert("入力値がありません！");
        }
    };

    return (
        <>
            <div className="tab-group">
                <button className={tab === 'study' ? 'active' : ''} onClick={() => setTab('study')}>STUDY</button>
                <button className={tab === 'read' ? 'active' : ''} onClick={() => setTab('read')}>READ</button>
                <button className={tab === 'info' ? 'active' : ''} onClick={() => setTab('info')}>INFO</button>
            </div>

            <div className="input-area">
                {tab === 'study' && (
                    <>
                        <p className="hint">学習時間を入力 (分)</p>

                        <label>💻 プログラミング (1min = 1XP)</label>
                        <input type="number" value={progMin} onChange={e => setProgMin(Number(e.target.value))} placeholder="例: 60" />

                        <label>🔤 TOEIC学習 (1min = 0.5XP)</label>
                        <input type="number" value={toeicMin} onChange={e => setToeicMin(Number(e.target.value))} placeholder="例: 30" />

                        <label>📝 資格勉強 (1min = 0.5XP)</label>
                        <input type="number" value={certMin} onChange={e => setCertMin(Number(e.target.value))} placeholder="例: 30" />

                        <p className="hint">
                            獲得予定: {Math.floor(progMin + (toeicMin * 0.5) + (certMin * 0.5))} XP
                        </p>
                    </>
                )}

                {tab === 'read' && (
                    <>
                        <p className="hint">読んだ量を入力</p>
                        <label>📚 読書ページ数 (1page = 1XP)</label>
                        <input type="number" value={pages} onChange={e => setPages(Number(e.target.value))} />
                        <p className="hint">獲得予定: {pages} XP</p>
                    </>
                )}

                {tab === 'info' && (
                    <div className="checklist-container">
                        <p className="hint">情報収集チェック</p>
                        <label className="checkbox-row">
                            <input type="checkbox" checked={news.it} onChange={e => setNews({ ...news, it: e.target.checked })} />
                            ITニュース/技術記事 (+10)
                        </label>
                        <label className="checkbox-row">
                            <input type="checkbox" checked={news.general} onChange={e => setNews({ ...news, general: e.target.checked })} />
                            一般ニュース/時事 (+5)
                        </label>
                    </div>
                )}
            </div>

            <div className="modal-actions">
                <button className="cancel-btn" onClick={onCancel}>CANCEL</button>
                <button className="confirm-btn" onClick={handleSubmit}>COMPLETE</button>
            </div>
        </>
    );
};