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
import { LoadingScreen } from './components/LoadingScreen';
import { BodyController } from './components/BodyController';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

type ExpData = {
  body: number;
  looks: number;
  mind: number;
  intel: number;
  disc: number;
};

const calculateLevel = (exp: number) => {
  const level = Math.floor(Math.sqrt(exp / 5));
  return level > 1000 ? 1000 : level;
};

const getAvatarPath = (titleEn: string) => {
  const fileName = titleEn.replace(/ /g, '_');
  return new URL(`./assets/avatars/${fileName}.png`, import.meta.url).href;
};

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
  const RANK_S = 900;
  const RANK_A = 750;
  const RANK_B = 500;

  if (minLv >= RANK_S) return { en: "THE ONE", jp: "- 全能の神 -" };
  if (minLv >= RANK_A) return { en: "GIGACHAD", jp: "- 完全無欠 -" };
  if (minLv >= RANK_B) return { en: "LEGEND", jp: "- 生ける伝説 -" };

  const sRankKeys = (Object.keys(levels) as (keyof ExpData)[]).filter(
    key => levels[key] >= RANK_S
  );
  const sCount = sRankKeys.length;

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

  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'home' | 'train'>('home');
  const [isFlipped, setIsFlipped] = useState(false); // ▼ カードの回転状態

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
  const avatarUrl = getAvatarPath(title.en);

  const handleComplete = (category: 'body' | 'looks' | 'intel' | 'mind' | 'disc', earnedExp: number, message: string) => {
    setExp(prev => ({
      ...prev,
      [category]: prev[category] + earnedExp
    }));
    alert(message);
    setIsModalOpen(false);
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
        pointLabels: {
          color: '#d4af37',
          font: { family: "'Cinzel', serif", size: 10 }
        },
        ticks: { display: false }
      }
    },
    // 裏面はリストがあるのでツールチップは不要（オフにする）
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false }
    },
    maintainAspectRatio: false
  };

  return (
    <>
      {isLoading && <LoadingScreen onFinish={() => setIsLoading(false)} />}

      <div style={{ opacity: isLoading ? 0 : 1, transition: 'opacity 1s' }}>
        <header>
          <div className="app-logo">THE MAN</div>
        </header>

        <div className="container">

          {/* === HOMEタブ: カード表示 === */}
          {activeTab === 'home' && (
            <div style={{ animation: 'fadeIn 0.5s ease', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

              {/* ▼▼▼ カードエリア ▼▼▼ */}
              <div
                className={`flip-card-container ${isFlipped ? 'flipped' : ''}`}
                onClick={() => setIsFlipped(!isFlipped)}
              >
                <div className="flip-card-inner">

                  {/* --- 表面 (IDカード風) --- */}
                  <div className="flip-card-front">
                    <div className="avatar-container" style={{ width: '180px', height: '180px' }}>
                      <img src={avatarUrl} alt={title.en} className="avatar-image" />
                    </div>

                    <div style={{ marginTop: '20px', textAlign: 'center' }}>
                      <div className="rank-label">CURRENT TITLE</div>
                      <div className="rank-title">{title.en}</div>
                      <div className="rank-sub">{title.jp}</div>
                    </div>

                    <div style={{ marginTop: 'auto', marginBottom: '20px' }}>
                      <div className="xp-info" style={{ justifyContent: 'center', gap: '10px' }}>
                        <span>TOTAL LEVEL</span>
                        <span style={{ color: 'var(--gold-main)', fontSize: '1.5rem' }}>
                          {Object.values(currentLevels).reduce((a, b) => a + b, 0)}
                        </span>
                      </div>
                    </div>

                    <div className="tap-hint">TAP CARD TO FLIP ↻</div>
                  </div>

                  {/* --- 裏面 (データ詳細) --- */}
                  <div className="flip-card-back">
                    <div style={{ width: '100%', height: '220px' }}>
                      <Radar data={chartData} options={chartOptions} />
                    </div>

                    {/* 詳細ステータスリスト */}
                    <div className="status-list">
                      <div className="status-row">
                        <span className="status-label">BODY</span>
                        <span className="status-val">Lv.{currentLevels.body} <small style={{ color: '#666' }}>(Exp.{exp.body})</small></span>
                      </div>
                      <div className="status-row">
                        <span className="status-label">LOOKS</span>
                        <span className="status-val">Lv.{currentLevels.looks} <small style={{ color: '#666' }}>(Exp.{exp.looks})</small></span>
                      </div>
                      <div className="status-row">
                        <span className="status-label">INTEL</span>
                        <span className="status-val">Lv.{currentLevels.intel} <small style={{ color: '#666' }}>(Exp.{exp.intel})</small></span>
                      </div>
                      <div className="status-row">
                        <span className="status-label">MIND</span>
                        <span className="status-val">Lv.{currentLevels.mind} <small style={{ color: '#666' }}>(Exp.{exp.mind})</small></span>
                      </div>
                      <div className="status-row">
                        <span className="status-label">DISC</span>
                        <span className="status-val">Lv.{currentLevels.disc} <small style={{ color: '#666' }}>(Exp.{exp.disc})</small></span>
                      </div>
                    </div>

                    <div className="tap-hint">TAP TO BACK ↻</div>
                  </div>

                </div>
              </div>
              {/* ▲▲▲ カードエリア終了 ▲▲▲ */}

            </div>
          )}

          {/* === TRAINタブ === */}
          {activeTab === 'train' && (
            <BodyController
              onSelect={(category) => {
                setActiveCategory(category);
                setIsModalOpen(true);
              }}
            />
          )}

        </div>

        {/* === 下部ナビゲーション === */}
        <div className="bottom-nav">
          <button
            className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => setActiveTab('home')}
          >
            <span>STATUS</span>
          </button>

          <button
            className={`nav-item ${activeTab === 'train' ? 'active' : ''}`}
            onClick={() => setActiveTab('train')}
          >
            <span>TRAIN</span>
          </button>
        </div>

        <ActionModal
          isOpen={isModalOpen}
          category={activeCategory}
          onClose={() => setIsModalOpen(false)}
          onComplete={handleComplete}
        />
      </div>
    </>
  );
}

export default App;