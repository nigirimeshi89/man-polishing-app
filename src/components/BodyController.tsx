// src/components/BodyController.tsx
import '../App.css';

type Props = {
    onSelect: (category: 'body' | 'looks' | 'intel' | 'mind' | 'disc') => void;
};

export const BodyController = ({ onSelect }: Props) => {
    return (
        <div className="body-controller-container">
            <h3 className="controller-title">SELECT TARGET</h3>

            <div className="human-graphic">
                {/* SVGで描画するサイバーな人体図 */}
                <svg viewBox="0 0 300 500" className="human-svg">
                    {/* --- 1. DISC (盾・オーラ) --- */}
                    {/* 全体を囲む六角形のバリア */}
                    <g className="body-part" onClick={() => onSelect('disc')}>
                        <path
                            d="M150 10 L280 100 L280 400 L150 490 L20 400 L20 100 Z"
                            fill="none"
                            stroke="rgba(255, 0, 0, 0.5)"
                            strokeWidth="2"
                            className="part-outline disc-aura"
                        />
                        <text x="150" y="470" textAnchor="middle" fill="#ff4444" fontSize="14">🛡️ DISC</text>
                    </g>

                    {/* --- 2. INTEL (頭脳) --- */}
                    <g className="body-part" onClick={() => onSelect('intel')}>
                        <circle cx="150" cy="80" r="35" fill="rgba(0, 255, 0, 0.1)" stroke="#00ff00" strokeWidth="2" />
                        {/* 脳みそっぽい模様 */}
                        <path d="M135 80 Q150 60 165 80" stroke="#00ff00" fill="none" />
                        <text x="150" y="40" textAnchor="middle" fill="#00ff00" fontSize="14">🧠 INTEL</text>
                    </g>

                    {/* --- 3. LOOKS (顔・鏡) --- */}
                    {/* 顔の横に浮いている鏡のようなイメージ */}
                    <g className="body-part" onClick={() => onSelect('looks')}>
                        <rect x="200" y="60" width="60" height="80" rx="5" fill="rgba(0, 255, 255, 0.1)" stroke="#00ffff" strokeWidth="2" />
                        <text x="230" y="105" textAnchor="middle" fill="#00ffff" fontSize="14">✨ LOOKS</text>
                        <line x1="185" y1="80" x2="200" y2="90" stroke="#00ffff" strokeWidth="1" />
                    </g>

                    {/* --- 4. BODY (胴体・筋肉) --- */}
                    <g className="body-part" onClick={() => onSelect('body')}>
                        {/* 肩から腹筋にかけて */}
                        <path
                            d="M110 120 L190 120 L210 160 L190 280 L110 280 L90 160 Z"
                            fill="rgba(212, 175, 55, 0.1)"
                            stroke="#d4af37"
                            strokeWidth="2"
                        />
                        {/* 腕 */}
                        <line x1="90" y1="160" x2="50" y2="250" stroke="#d4af37" strokeWidth="4" />
                        <line x1="210" y1="160" x2="250" y2="250" stroke="#d4af37" strokeWidth="4" />
                        <text x="150" y="260" textAnchor="middle" fill="#d4af37" fontSize="14">⚔️ BODY</text>
                    </g>

                    {/* --- 5. MIND (心臓) --- */}
                    <g className="body-part" onClick={() => onSelect('mind')}>
                        {/* 胸の真ん中で光るコア */}
                        <circle cx="150" cy="170" r="15" fill="rgba(160, 32, 240, 0.3)" stroke="#a020f0" strokeWidth="2">
                            <animate attributeName="r" values="15;18;15" dur="2s" repeatCount="indefinite" />
                        </circle>
                        <text x="150" y="175" textAnchor="middle" fill="#fff" fontSize="10" pointerEvents="none">❤</text>
                        <text x="190" y="180" textAnchor="middle" fill="#a020f0" fontSize="14">🧘 MIND</text>
                        <line x1="165" y1="170" x2="180" y2="170" stroke="#a020f0" strokeWidth="1" />
                    </g>

                </svg>
            </div>
            <p className="hint-text">部位をタップして強化を開始せよ</p>
        </div>
    );
};