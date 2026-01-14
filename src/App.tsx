import { useState, useMemo, useEffect } from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import './App.css';
// ActionModalは components フォルダにある想定です
import { ActionModal } from './components/ActionModal';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

type ExpData = {
  body: number;
  looks: number;
  mind: number;
  intel: number;
  disc: number;
};

// Lv = √ (EXP / 5) 
const calculateLevel = (exp: number) => {
  const level = Math.floor(Math.sqrt(exp / 5));
  return level > 999 ? 999 : level;
};

// === 称号判定 (変更なし) ===
const determineTitle = (stats: ExpData) => {
  const levels = {
    body: calculateLevel(stats.body),
    looks: calculateLevel(stats.looks),
    mind: calculateLevel(stats.mind),
    intel: calculateLevel(stats.intel),
    disc: calculateLevel(stats.disc),
  };
  const vals = Object.values(levels);
  const avg = vals.reduce((a, x) => a + x, 0) / 5;
  const max = Math.max(...vals);

  const GOD_LV = 800;
  const S_LV = 100;

  if (avg >= GOD_LV) return { en: "THE ONE", jp: "- 全能の神 -" };
  if (avg >= 500) return { en: "GIGACHAD", jp: "- 完全無欠 -" };

  if (max >= S_LV) {
    if (levels.body >= S_LV) return { en: "TITAN", jp: "- 巨人神 -" };
    if (levels.looks >= S_LV) return { en: "ICON", jp: "- 時代の象徴 -" };
    if (levels.mind >= S_LV) return { en: "SAINT", jp: "- 聖人 -" };
    if (levels.intel >= S_LV) return { en: "ORACLE", jp: "- 予言者 -" };
    if (levels.disc >= S_LV) return { en: "EXECUTOR", jp: "- 執行者 -" };
  }
  if (avg >= 30) return { en: "ROOKIE", jp: "- 挑戦者 -" };
  return { en: "NOVICE", jp: "- 原石 -" };
};

function App() {
  const [exp, setExp] = useState<ExpData>(() => {
    const saved = localStorage.getItem("the-man-exp");
    if (saved) return JSON.parse(saved);
    return { body: 50, looks: 0, mind: 0, intel: 0, disc: 0 };
  });

  useEffect(() => {
    localStorage.setItem("the-man-exp", JSON.stringify(exp));
  }, [exp]);

  // モーダルの開閉管理
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [activeCategory, setActiveCategory] = useState<'body' | 'looks' | 'intel' | 'mind' | 'disc'>('body');

  // レベル計算
  const currentLevels = useMemo(() => ({
    body: calculateLevel(exp.body),
    looks: calculateLevel(exp.looks),
    mind: calculateLevel(exp.mind),
    intel: calculateLevel(exp.intel),
    disc: calculateLevel(exp.disc),
  }), [exp]);

  const title = useMemo(() => determineTitle(exp), [exp]);
  const avatarUrl = `https://placehold.co/200x200/000000/d4af37?text=${title.en.replace(' ', '+')}&font=playfair-display`;

  // ▼ 引数の型修正： 'intel' を追加しました！
  const handleComplete = (category: 'body' | 'looks' | 'intel' | 'mind' | 'disc', earnedExp: number, message: string) => {
    setExp(prev => ({
      ...prev,
      [category]: prev[category] + earnedExp
    }));
    alert(message);
    setIsModalOpen(false);
  };

  const handleReset = () => {
    if (window.confirm("【警告】\n現在のステータスを全てリセットします。\n本当によろしいですか？")) {
      const initialData = { body: 0, looks: 0, mind: 0, intel: 0, disc: 0 };
      setExp(initialData);
      localStorage.removeItem("the-man-exp");
      alert("データを初期化しました。");
    }
  };

  const chartData = {
    labels: ['BODY', 'LOOKS', 'MIND', 'INTEL', 'DISC'],
    datasets: [{
      label: 'Level',
      data: Object.values(currentLevels),
      backgroundColor: 'rgba(212, 175, 55, 0.2)',
      borderColor: '#d4af37',
      borderWidth: 2,
      pointBackgroundColor: '#000',
      pointBorderColor: '#d4af37',
    }],
  };

  const chartOptions = {
    scales: {
      r: {
        min: 0, max: 100, // 必要に応じて上限調整
        grid: { color: '#333' },
        angleLines: { color: '#333' },
        pointLabels: { color: '#d4af37', font: { family: "'Cinzel', serif" } },
        ticks: { display: false }
      }
    },
    plugins: { legend: { display: false } },
    maintainAspectRatio: false
  };

  return (
    <>
      <header>
        <div className="app-logo">THE MAN</div>
      </header>

      <div className="container">
        <div className="rank-section">
          <div className="avatar-container">
            <img src={avatarUrl} alt="Avatar" className="avatar-image" />
          </div>
          <div className="rank-label">CURRENT TITLE</div>
          <div className="rank-title">{title.en}</div>
          <div className="rank-sub">{title.jp}</div>
        </div>

        <div className="card">
          <div className="corner tl"></div><div className="corner tr"></div>
          <div className="corner bl"></div><div className="corner br"></div>

          <div className="chart-box">
            <Radar data={chartData} options={chartOptions} />
          </div>

          <div className="xp-container">
            <div className="xp-info">
              <span>INTEL LEVEL</span>
              <span style={{ color: 'var(--gold-main)', fontSize: '1.2rem' }}>Lv.{currentLevels.intel}</span>
            </div>
            <div className="xp-bar-bg">
              <div className="xp-bar-fill" style={{ width: `100%` }}></div>
            </div>
            <div style={{ textAlign: 'right', fontSize: '0.8rem', color: '#666', marginTop: '5px' }}>
              Total EXP: {exp.intel}
            </div>
          </div>
        </div>

        {/* アクションボタンエリア */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '10px',
          marginBottom: '30px',
          flexWrap: 'wrap' /* ← これを追加！スマホで2行〜3行に綺麗に並びます */
        }}>
          <button
            className="action-btn"
            onClick={() => { setActiveCategory('body'); setIsModalOpen(true); }}
          >
            ⚔️ TRAIN BODY
          </button>

          <button
            className="action-btn"
            style={{ filter: 'hue-rotate(180deg)' }}
            onClick={() => { setActiveCategory('looks'); setIsModalOpen(true); }}
          >
            ✨ REFINE LOOKS
          </button>

          {/* ▼ 追加: INTELボタン */}
          <button
            className="action-btn"
            style={{ filter: 'hue-rotate(90deg)' }}
            onClick={() => { setActiveCategory('intel'); setIsModalOpen(true); }}
          >
            🧠 BOOST INTEL
          </button>

          <button
            className="action-btn"
            style={{ filter: 'hue-rotate(270deg)' }} /* 紫色になります */
            onClick={() => { setActiveCategory('mind'); setIsModalOpen(true); }}
          >
            🧘 CALM MIND
          </button>

          <button
            className="action-btn"
            style={{ filter: 'hue-rotate(330deg) saturate(1.5)' }} /* 鮮やかな赤色 */
            onClick={() => { setActiveCategory('disc'); setIsModalOpen(true); }}
          >
            🛡️ KEEP DISC
          </button>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <button className="reset-btn" onClick={handleReset}>
          ⚠ DATA RESET
        </button>
      </div>

      <ActionModal
        isOpen={isModalOpen}
        category={activeCategory}
        onClose={() => setIsModalOpen(false)}
        onComplete={handleComplete}
      />
    </>
  );
}

export default App;