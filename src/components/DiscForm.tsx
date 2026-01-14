// src/components/DiscForm.tsx
import { useState } from 'react';

type Props = {
    onComplete: (exp: number, message: string) => void;
    onCancel: () => void;
};

export const DiscForm = ({ onComplete, onCancel }: Props) => {
    const [tab, setTab] = useState('clean'); // clean, task, stop

    const [checks, setChecks] = useState({
        // CLEAN
        room: false,
        bed: false,
        water: false,
        trash: false,
        // TASK
        early: false,
        todo: false,
        quick: false,
        // STOP
        money: false,
        temptation: false,
        fasting: false,
    });

    const handleSubmit = () => {
        let earnedExp = 0;
        let msgParts = [];

        // CLEANタブ
        if (tab === 'clean') {
            if (checks.room) { earnedExp += 30; msgParts.push("部屋掃除"); }
            if (checks.bed) { earnedExp += 10; msgParts.push("ベッドメイク"); }
            if (checks.water) { earnedExp += 50; msgParts.push("水回り掃除"); }
            if (checks.trash) { earnedExp += 10; msgParts.push("ゴミ出し"); }
        }

        // TASKタブ
        if (tab === 'task') {
            if (checks.early) { earnedExp += 20; msgParts.push("5分前行動"); }
            if (checks.todo) { earnedExp += 50; msgParts.push("ToDo完遂"); }
            if (checks.quick) { earnedExp += 20; msgParts.push("即レス・即対応"); }
        }

        // STOPタブ
        if (tab === 'stop') {
            if (checks.money) { earnedExp += 30; msgParts.push("無駄遣いなし"); }
            if (checks.temptation) { earnedExp += 40; msgParts.push("誘惑に勝利"); }
            if (checks.fasting) { earnedExp += 50; msgParts.push("食欲抑制"); }
        }

        if (earnedExp > 0) {
            onComplete(earnedExp, `規律を守った！ (${msgParts.join(' + ')}) +${earnedExp} XP`);
        } else {
            alert("チェック項目がありません！");
        }
    };

    // チェックボックス更新用ヘルパー
    const toggle = (key: keyof typeof checks) => {
        setChecks(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <>
            <div className="tab-group">
                <button className={tab === 'clean' ? 'active' : ''} onClick={() => setTab('clean')}>CLEAN</button>
                <button className={tab === 'task' ? 'active' : ''} onClick={() => setTab('task')}>TASK</button>
                <button className={tab === 'stop' ? 'active' : ''} onClick={() => setTab('stop')}>STOP</button>
            </div>

            <div className="input-area">
                {tab === 'clean' && (
                    <div className="checklist-container">
                        <p className="hint">環境を整える</p>
                        <label className="checkbox-row">
                            <input type="checkbox" checked={checks.room} onChange={() => toggle('room')} />
                            🧹 部屋の掃除・整理整頓 (+30)
                        </label>
                        <label className="checkbox-row">
                            <input type="checkbox" checked={checks.bed} onChange={() => toggle('bed')} />
                            🛏️ ベッドメイキング (+10)
                        </label>
                        <label className="checkbox-row">
                            <input type="checkbox" checked={checks.water} onChange={() => toggle('water')} />
                            🚽 トイレ・水回り掃除 (+50)
                        </label>
                        <label className="checkbox-row">
                            <input type="checkbox" checked={checks.trash} onChange={() => toggle('trash')} />
                            🗑️ ゴミ捨て (+10)
                        </label>
                    </div>
                )}

                {tab === 'task' && (
                    <div className="checklist-container">
                        <p className="hint">行動を管理する</p>
                        <label className="checkbox-row">
                            <input type="checkbox" checked={checks.early} onChange={() => toggle('early')} />
                            ⏱️ 5分前行動・遅刻なし (+20)
                        </label>
                        <label className="checkbox-row">
                            <input type="checkbox" checked={checks.todo} onChange={() => toggle('todo')} />
                            ✅ 今日のToDoリスト完遂 (+50)
                        </label>
                        <label className="checkbox-row">
                            <input type="checkbox" checked={checks.quick} onChange={() => toggle('quick')} />
                            ⚡ 即レス・後回しにしない (+20)
                        </label>
                    </div>
                )}

                {tab === 'stop' && (
                    <div className="checklist-container">
                        <p className="hint">欲望を自制する</p>
                        <label className="checkbox-row">
                            <input type="checkbox" checked={checks.money} onChange={() => toggle('money')} />
                            💰 無駄遣いをしなかった (+30)
                        </label>
                        <label className="checkbox-row">
                            <input type="checkbox" checked={checks.temptation} onChange={() => toggle('temptation')} />
                            😈 誘惑(菓子・サボり)に勝った (+40)
                        </label>
                        <label className="checkbox-row">
                            <input type="checkbox" checked={checks.fasting} onChange={() => toggle('fasting')} />
                            🍽️ 暴飲暴食をしなかった (+50)
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