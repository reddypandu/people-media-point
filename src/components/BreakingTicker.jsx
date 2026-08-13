import React from 'react';
import { Zap } from 'lucide-react';
import { BREAKING_NEWS_ITEMS } from '../constants/articlesData';
import TranslatedText from './TranslatedText';

const BreakingTicker = ({ customNews }) => {
  const newsList = customNews && customNews.length > 0 
    ? customNews 
    : BREAKING_NEWS_ITEMS;

  return (
    <div className="breaking-ticker-container">
      <div className="ticker-badge">
        <span className="live-pulse"></span>
        <Zap size={15} fill="currentColor" />
        <span className="badge-text"><TranslatedText>BREAKING NEWS</TranslatedText></span>
      </div>
      <div className="ticker-track-wrapper">
        <div className="ticker-track">
          {newsList.concat(newsList).map((item, idx) => (
            <span key={idx} className="ticker-item">
              <span className="ticker-bullet">•</span>
              <TranslatedText>{typeof item === 'string' ? item : item.title}</TranslatedText>
            </span>
          ))}
        </div>
      </div>

      <style jsx>{`
        .breaking-ticker-container {
          background: #0A192F;
          color: white;
          display: flex;
          align-items: center;
          height: 42px;
          overflow: hidden;
          box-shadow: inset 0 -1px 0 rgba(255,255,255,0.1);
          border-bottom: 2px solid #D32F2F;
        }

        .ticker-badge {
          background: #D32F2F;
          color: white;
          font-weight: 800;
          font-size: 0.82rem;
          padding: 0 16px;
          height: 100%;
          display: flex;
          align-items: center;
          gap: 6px;
          white-space: nowrap;
          z-index: 5;
          letter-spacing: 0.5px;
          box-shadow: 3px 0 10px rgba(0,0,0,0.3);
          position: relative;
        }

        .live-pulse {
          width: 8px;
          height: 8px;
          background: #FFFFFF;
          border-radius: 50%;
          display: inline-block;
          animation: pulse 1.2s infinite;
        }

        @keyframes pulse {
          0% { transform: scale(0.9); opacity: 1; }
          50% { transform: scale(1.4); opacity: 0.4; }
          100% { transform: scale(0.9); opacity: 1; }
        }

        .ticker-track-wrapper {
          flex: 1;
          overflow: hidden;
          white-space: nowrap;
          position: relative;
          display: flex;
          align-items: center;
        }

        .ticker-track {
          display: inline-flex;
          align-items: center;
          animation: marquee 35s linear infinite;
        }

        .ticker-track:hover {
          animation-play-state: paused;
        }

        .ticker-item {
          font-size: 0.9rem;
          font-weight: 600;
          padding: 0 24px;
          display: inline-flex;
          align-items: center;
          gap: 12px;
          color: #E2E8F0;
          cursor: pointer;
          transition: color 0.2s;
        }

        .ticker-item:hover {
          color: #FFD700;
        }

        .ticker-bullet {
          color: #D32F2F;
          font-size: 1.2rem;
        }

        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        @media (max-width: 768px) {
          .ticker-badge {
            font-size: 0.72rem;
            padding: 0 10px;
          }
          .ticker-item {
            font-size: 0.8rem;
            padding: 0 14px;
          }
        }
      `}</style>
    </div>
  );
};

export default BreakingTicker;
