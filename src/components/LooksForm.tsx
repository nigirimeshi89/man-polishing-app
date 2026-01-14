import { useState } from 'react';

type Props = {
    onComplete: (exp: number, message: string) => void;
    onCancel: () => void;
};

export const LooksForm = ({ onComplete, onCancel }: Props) => {
    const [tab, setTab] = useState('daily'); // daily, special

    // 入力State
    const [dailyChecks, setDailyChecks] = useState({
        skinCare: false,
        sunscreen: false,
        hairSet: false,
        shave: false,
        iron: false,
    });
    const [specialAction, setSpecialAction] = useState('barber');

    const handleSubmit = () => {
        let earnedExp = 0;
        let msg = "";

        if (tab === 'daily') {
            if (dailyChecks.skinCare) earnedExp += 5;
            if (dailyChecks.sunscreen) earnedExp += 10;
            if (dailyChecks.hairSet) earnedExp += 5;
            if (dailyChecks.shave) earnedExp += 5;
            if (dailyChecks.iron) earnedExp += 10;

            if (earnedExp === 0) {
                alert("項目をチェックしてください！");
                return;
            }
            msg = `身だしなみ完了！ +${earnedExp} XP`;
        } else if (tab === 'special') {
            switch (specialAction) {
                case 'barber': earnedExp = 100; msg = "美容室に行きました！ +100 XP"; break;
                case 'eyebrows': earnedExp = 30; msg = "眉毛を整えました！ +30 XP"; break;
                case 'clothes': earnedExp = 50; msg = "新しい服を購入！ +50 XP"; break;
                case 'teeth': earnedExp = 50; msg = "歯のメンテナンス完了！ +50 XP"; break;
            }
        }

        if (earnedExp > 0) {
            onComplete(earnedExp, msg);
        }
    };

    return (
        <>
            <div className="tab-group">
                <button className={tab === 'daily' ? 'active' : ''} onClick={() => setTab('daily')}>DAILY</button>
                <button className={tab === 'special' ? 'active' : ''} onClick={() => setTab('special')}>SPECIAL</button>
            </div>

            <div className="input-area">
                {tab === 'daily' && (
                    <div className="checklist-container">
                        <p className="hint">今日のケアをチェック</p>
                        <label className="checkbox-row">
                            <input type="checkbox" checked={dailyChecks.skinCare} onChange={e => setDailyChecks({ ...dailyChecks, skinCare: e.target.checked })} />
                            洗顔・スキンケア (+5)
                        </label>
                        <label className="checkbox-row">
                            <input type="checkbox" checked={dailyChecks.sunscreen} onChange={e => setDailyChecks({ ...dailyChecks, sunscreen: e.target.checked })} />
                            日焼け止め (+10)
                        </label>
                        <label className="checkbox-row">
                            <input type="checkbox" checked={dailyChecks.hairSet} onChange={e => setDailyChecks({ ...dailyChecks, hairSet: e.target.checked })} />
                            ヘアセット (+5)
                        </label>
                        <label className="checkbox-row">
                            <input type="checkbox" checked={dailyChecks.shave} onChange={e => setDailyChecks({ ...dailyChecks, shave: e.target.checked })} />
                            髭・ムダ毛処理 (+5)
                        </label>
                        <label className="checkbox-row">
                            <input type="checkbox" checked={dailyChecks.iron} onChange={e => setDailyChecks({ ...dailyChecks, iron: e.target.checked })} />
                            服のアイロンがけ (+10)
                        </label>
                    </div>
                )}
                {tab === 'special' && (
                    <>
                        <p className="hint">スペシャルメンテナンス</p>
                        <label>イベント選択</label>
                        <select
                            value={specialAction}
                            onChange={e => setSpecialAction(e.target.value)}
                            style={{ width: '100%', padding: '10px', background: '#000', color: '#fff', border: '1px solid #444', marginBottom: '20px' }}
                        >
                            <option value="barber">美容室・理容室 (+100 XP)</option>
                            <option value="eyebrows">眉毛サロン/手入れ (+30 XP)</option>
                            <option value="clothes">新しい服を購入 (+50 XP)</option>
                            <option value="teeth">ホワイトニング/歯科 (+50 XP)</option>
                        </select>
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