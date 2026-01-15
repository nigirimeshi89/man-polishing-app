// src/components/LoadingScreen.tsx
import { useEffect, useState } from 'react';
import { quotes } from '../quotes';
import '../App.css';

type Props = {
    onFinish: () => void; // ロードが終わったことを親に伝える関数
};

export const LoadingScreen = ({ onFinish }: Props) => {
    const [quote, setQuote] = useState({ text: "", author: "" });
    const [isFading, setIsFading] = useState(false);

    useEffect(() => {
        // 1. ランダムに名言をセット
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        setQuote(randomQuote);

        // 2. 表示時間（2.5秒後にフェードアウト開始）
        const timer1 = setTimeout(() => {
            setIsFading(true);
        }, 2500);

        // 3. フェードアウト完了後（3秒後）に完全に消す
        const timer2 = setTimeout(() => {
            onFinish();
        }, 3000);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, [onFinish]);

    return (
        <div className={`loading-overlay ${isFading ? 'fade-out' : ''}`}>
            <div className="loading-content">
                <h1 className="loading-logo">THE MAN</h1>

                <div className="quote-container">
                    <p className="quote-text">“ {quote.text} ”</p>
                    <p className="quote-author">- {quote.author}</p>
                </div>
            </div>
        </div>
    );
};