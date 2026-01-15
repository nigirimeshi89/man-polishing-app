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
import { ActionModal } from './components/ActionModal';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

type ExpData = {
  body: number;
  looks: number;
  mind: number;
  intel: number;
  disc: number;
};

// Lv = √ (EXP / 5) (上限1000)
const calculateLevel = (exp: number) => {
  const level = Math.floor(Math.sqrt(exp / 5));
  return level > 1000 ? 1000 : level;
};

// 画像のパスを動的に生成する関数
const getAvatarPath = (titleEn: string) => {
  // スペースをアンダーバーに置換 (例: "THE ONE" → "THE_ONE")
  const fileName = titleEn.replace(/ /g, '_');
  return new URL(`./assets/avatars/${fileName}.png`, import.meta.url).href;
};

// === 称号判定ロジック (Lv.1000スケール対応版) ===
const determineTitle = (stats: ExpData) => {
  const levels = {
    body: calculateLevel(stats.body),
    looks: calculateLevel(stats.looks),
    mind: calculateLevel(stats.mind),
    intel: calculateLevel(stats.intel),
    disc: calculateLevel(stats.disc),
  };

  const vals = Object.values(levels);
  const minLv = Math.min(...vals);

  // === 閾値設定 (MAX Lv.1000) ===
  const RANK_S = 900;
  const RANK_A = 750;
  const RANK_B = 500;

  // --- 5. 神クラス (5つ全てのレベルで判定) ---
  if (minLv >= RANK_S) return { en: "THE ONE", jp: "- 全能の神 -" };
  if (minLv >= RANK_A) return { en: "GIGACHAD", jp: "- 完全無欠 -" };
  if (minLv >= RANK_B) return { en: "LEGEND", jp: "- 生ける伝説 -" };

  // --- 複合クラス判定用 ---
  const sRankKeys = (Object.keys(levels) as (keyof ExpData)[]).filter(
    key => levels[key] >= RANK_S
  );
  const sCount = sRankKeys.length;

  // --- 4. 準神クラス (4つがランクS) ---
  if (sCount === 4) {
    const missing = (Object.keys(levels) as (keyof ExpData)[]).find(
      key => levels[key] < RANK_S
    );

    switch (missing) {
      case 'mind': return { en: "GLASS ACE", jp: "- 悲劇の天才 -" };
      case 'intel': return { en: "BERSERKER", jp: "- 破壊神 -" };
      case 'looks': return { en: "PHANTOM", jp: "- 影の支配者 -" };
      case 'body': return { en: "MASTERMIND", jp: "- 黒幕 -" };
      case 'disc': return { en: "JOKER", jp: "- 道化師 -" };
    }
  }

  // --- 3. 超人クラス (3つがランクS) ---
  if (sCount === 3) {
    const missing = (Object.keys(levels) as (keyof ExpData)[]).filter(
      key => levels[key] < RANK_S
    );
    const missingKey = missing.sort().join('-');

    switch (missingKey) {
      case 'disc-intel': return { en: "HERO", jp: "- 英雄 -" };
      case 'disc-mind': return { en: "PRINCE", jp: "- 王子 -" };
      case 'intel-mind': return { en: "ADONIS", jp: "- 美の神 -" };
      case 'disc-looks': return { en: "SHOGUN", jp: "- 将軍 -" };
      case 'intel-looks': return { en: "WARLORD", jp: "- 覇王 -" };
      case 'looks-mind': return { en: "CYBORG", jp: "- 人造人間 -" };
      case 'body-disc': return { en: "MENTALIST", jp: "- 心理操作官 -" };
      case 'body-intel': return { en: "PARAGON", jp: "- 模範 -" };
      case 'body-mind': return { en: "ARISTOCRAT", jp: "- 上級国民 -" };
      case 'body-looks': return { en: "SAGE", jp: "- 賢者 -" };
    }
  }

  // --- 2. 実力者クラス (2つがランクS) ---
  if (sCount === 2) {
    const activeKey = sRankKeys.sort().join('-');

    switch (activeKey) {
      case 'body-looks': return { en: "STAR", jp: "- 銀幕の英雄 -" };
      case 'body-mind': return { en: "SAMURAI", jp: "- 武士 -" };
      case 'body-intel': return { en: "COMMANDER", jp: "- 指揮官 -" };
      case 'body-disc': return { en: "SWAT", jp: "- 特殊部隊 -" };
      case 'intel-looks': return { en: "INFLUENCER", jp: "- 扇動者 -" };
      case 'disc-looks': return { en: "AGENT", jp: "- 工作員 -" };
      case 'looks-mind': return { en: "NOBLE", jp: "- 貴族 -" };
      case 'disc-intel': return { en: "TYCOON", jp: "- 大富豪 -" };
      case 'intel-mind': return { en: "PHILOSOPHER", jp: "- 哲学者 -" };
      case 'disc-mind': return { en: "MONK", jp: "- 僧侶 -" };
    }
  }

  // --- 1. 単独クラス判定 ---
  const bestKey = (Object.keys(levels) as (keyof ExpData)[]).reduce((a, b) =>
    levels[a] > levels[b] ? a : b
  );
  const bestLv = levels[bestKey];

  if (bestKey === 'body') {
    if (bestLv >= RANK_S) return { en: "TITAN", jp: "- 巨人神 -" };
    if (bestLv >= RANK_A) return { en: "GLADIATOR", jp: "- 剣闘士 -" };
    if (bestLv >= RANK_B) return { en: "BOUNCER", jp: "- 用心棒 -" };
  }
  if (bestKey === 'looks') {
    if (bestLv >= RANK_S) return { en: "ICON", jp: "- 時代の象徴 -" };
    if (bestLv >= RANK_A) return { en: "TOP MODEL", jp: "- トップモデル -" };
    if (bestLv >= RANK_B) return { en: "DANDY", jp: "- 伊達男 -" };
  }
  if (bestKey === 'mind') {
    if (bestLv >= RANK_S) return { en: "SAINT", jp: "- 聖人 -" };
    if (bestLv >= RANK_A) return { en: "GURU", jp: "- 導師 -" };
    if (bestLv >= RANK_B) return { en: "SEEKER", jp: "- 求道者 -" };
  }
  if (bestKey === 'intel') {
    if (bestLv >= RANK_S) return { en: "ORACLE", jp: "- 予言者 -" };
    if (bestLv >= RANK_A) return { en: "STRATEGIST", jp: "- 軍師 -" };
    if (bestLv >= RANK_B) return { en: "ANALYST", jp: "- 分析官 -" };
  }
  if (bestKey === 'disc') {
    if (bestLv >= RANK_S) return { en: "EXECUTOR", jp: "- 執行者 -" };
    if (bestLv >= RANK_A) return { en: "MACHINE", jp: "- 精密機械 -" };
    if (bestLv >= RANK_B) return { en: "SOLDIER", jp: "- 兵士 -" };
  }

  return { en: "NOVICE", jp: "- 原石 -" };
};

function App() {
  const [exp, setExp] = useState<ExpData>(() => {
    const saved = localStorage.getItem("the-man-exp");
    if (saved) return JSON.parse(saved);
    return { body: 0, looks: 0, mind: 0, intel: 0, disc: 0 };
  });

  useEffect(() => {
    localStorage.setItem("the-man-exp", JSON.stringify(exp));
  }, [exp]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'body' | 'looks' | 'intel' | 'mind' | 'disc'>('body');

  const currentLevels = useMemo(() => ({
    body: calculateLevel(exp.body),
    looks: calculateLevel(exp.looks),
    mind: calculateLevel(exp.mind),
    intel: calculateLevel(exp.intel),
    disc: calculateLevel(exp.disc),
  }), [exp]);

  const title = useMemo(() => determineTitle(exp), [exp]);

  // 画像パスの取得 (エラーハンドリングなしのシンプル版)
  const avatarUrl = getAvatarPath(title.en);

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
        min: 0,
        max: 1000,
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
            <img src={avatarUrl} alt={title.en} className="avatar-image" />
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
              <span>TOTAL LV</span>
              <span style={{ color: 'var(--gold-main)', fontSize: '1.2rem' }}>
                Lv.{Object.values(currentLevels).reduce((a, b) => a + b, 0)}
              </span>
            </div>
            <div className="xp-bar-bg">
              <div className="xp-bar-fill" style={{ width: `100%` }}></div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '30px', flexWrap: 'wrap' }}>
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

          <button
            className="action-btn"
            style={{ filter: 'hue-rotate(90deg)' }}
            onClick={() => { setActiveCategory('intel'); setIsModalOpen(true); }}
          >
            🧠 BOOST INTEL
          </button>

          <button
            className="action-btn"
            style={{ filter: 'hue-rotate(270deg)' }}
            onClick={() => { setActiveCategory('mind'); setIsModalOpen(true); }}
          >
            🧘 CALM MIND
          </button>

          <button
            className="action-btn"
            style={{ filter: 'hue-rotate(330deg) saturate(1.5)' }}
            onClick={() => { setActiveCategory('disc'); setIsModalOpen(true); }}
          >
            🛡️ KEEP DISC
          </button>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '100px' }}>
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