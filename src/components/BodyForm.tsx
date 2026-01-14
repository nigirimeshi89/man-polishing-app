import { useState } from 'react';
// App.cssは親で読み込まれているので効きますが、明示的にimportしてもOK

type Props = {
    onComplete: (exp: number, message: string) => void;
    onCancel: () => void;
};

export const BodyForm = ({ onComplete, onCancel }: Props) => {
    const [tab, setTab] = useState('gym'); // gym, home, run, sleep

    // 入力State
    const [weight, setWeight] = useState(0);
    const [reps, setReps] = useState(0);
    const [runTime, setRunTime] = useState(0);
    const [sleepHours, setSleepHours] = useState(7);
    const [wakeTarget, setWakeTarget] = useState("07:00");
    const [wakeActual, setWakeActual] = useState("07:00");

    const handleSubmit = () => {
        let earnedExp = 0;
        let msg = "";

        if (tab === 'gym') {
            earnedExp = Math.floor((weight * reps) / 5);
            msg = `ジムトレ完了！ +${earnedExp} XP`;
        } else if (tab === 'home') {
            earnedExp = Math.floor(reps * 1);
            msg = `家トレ完了！ +${earnedExp} XP`;
        } else if (tab === 'run') {
            earnedExp = runTime * 3;
            if (runTime >= 30) earnedExp += 50;
            msg = `ランニング完了！ +${earnedExp} XP`;
        } else if (tab === 'sleep') {
            if (sleepHours >= 7 && sleepHours <= 9) earnedExp += 100;
            else if (sleepHours >= 5) earnedExp += 50;
            else earnedExp += 10;

            const t = parseInt(wakeTarget.replace(':', ''));
            const a = parseInt(wakeActual.replace(':', ''));
            if (Math.abs(t - a) <= 5) {
                earnedExp += 50;
                msg = `完璧な睡眠＆起床！ +${earnedExp} XP`;
            } else {
                msg = `睡眠記録完了 +${earnedExp} XP`;
            }
        }

        if (earnedExp > 0) {
            onComplete(earnedExp, msg);
        } else {
            alert("入力値が足りないか、計算結果が0です！");
        }
    };

    return (
        <>
            <div className="tab-group">
                <button className={tab === 'gym' ? 'active' : ''} onClick={() => setTab('gym')}>GYM</button>
                <button className={tab === 'home' ? 'active' : ''} onClick={() => setTab('home')}>HOME</button>
                <button className={tab === 'run' ? 'active' : ''} onClick={() => setTab('run')}>RUN</button>
                <button className={tab === 'sleep' ? 'active' : ''} onClick={() => setTab('sleep')}>SLEEP</button>
            </div>

            <div className="input-area">
                {tab === 'gym' && (
                    <>
                        <p className="hint">高負荷トレーニング</p>
                        <label>Weight (kg)</label>
                        <input type="number" value={weight} onChange={e => setWeight(Number(e.target.value))} />
                        <label>Reps (回数)</label>
                        <input type="number" value={reps} onChange={e => setReps(Number(e.target.value))} />
                        <p className="hint">獲得: {Math.floor((weight * reps) / 5)} XP</p>
                    </>
                )}
                {tab === 'home' && (
                    <>
                        <p className="hint">自重トレーニング</p>
                        <label>Reps (回数)</label>
                        <input type="number" value={reps} onChange={e => setReps(Number(e.target.value))} />
                        <p className="hint">獲得: {reps} XP</p>
                    </>
                )}
                {tab === 'run' && (
                    <>
                        <p className="hint">有酸素運動</p>
                        <label>Time (分)</label>
                        <input type="number" value={runTime} onChange={e => setRunTime(Number(e.target.value))} />
                        <p className="hint">獲得: {runTime * 3 + (runTime >= 30 ? 50 : 0)} XP</p>
                    </>
                )}
                {tab === 'sleep' && (
                    <>
                        <p className="hint">回復と規律</p>
                        <label>睡眠時間 (h)</label>
                        <input type="number" value={sleepHours} onChange={e => setSleepHours(Number(e.target.value))} />
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <div>
                                <label>目標起床</label>
                                <input type="time" value={wakeTarget} onChange={e => setWakeTarget(e.target.value)} />
                            </div>
                            <div>
                                <label>実際</label>
                                <input type="time" value={wakeActual} onChange={e => setWakeActual(e.target.value)} />
                            </div>
                        </div>
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