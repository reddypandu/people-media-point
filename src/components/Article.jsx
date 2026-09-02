import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { Clock, Share2, ArrowRight } from "lucide-react";
import TranslatedText from "./TranslatedText";

const Article = ({ originalArticle }) => {
  const { language, translateContent } = useLanguage();
  const [translatedArticle, setTranslatedArticle] = useState(originalArticle);
  const [isTranslating, setIsTranslating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const translate = async () => {
      if (language === "te") {
        setTranslatedArticle(originalArticle);
        return;
      }

      setIsTranslating(true);
      try {
        const [title, content, category] = await Promise.all([
          translateContent(originalArticle.title),
          translateContent(originalArticle.content),
          translateContent(
            originalArticle.categories?.name ||
              originalArticle.category ||
              "News",
          ),
        ]);

        setTranslatedArticle({
          ...originalArticle,
          title,
          content,
          category,
        });
      } catch (error) {
        console.error("Failed to translate article:", error);
      } finally {
        setIsTranslating(false);
      }
    };

    translate();
  }, [language, originalArticle, translateContent]);

  const handleReadMore = () => {
    navigate(`/article/${originalArticle.id}`);
  };

  const handleShare = (e) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator
        .share({
          title: originalArticle.title,
          url: window.location.origin + `/article/${originalArticle.id}`,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(
        window.location.origin + `/article/${originalArticle.id}`,
      );
      alert("Article link copied to clipboard!");
    }
  };

  const categoryName =
    translatedArticle.categories?.name || translatedArticle.category || "News";

  return (
    <article className="v6-article-card" onClick={handleReadMore}>
      <div className="card-image-box">
        <img
          src={
            translatedArticle.image_url ||
            "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80"
          }
          alt={translatedArticle.title}
          className="card-img"
        />
        <span className="card-cat-badge">{categoryName}</span>
      </div>

      <div className="card-body">
        <h3 className="card-title">
          {isTranslating ? (
            <span className="skeleton-line" />
          ) : (
            translatedArticle.title
          )}
        </h3>

        <div className="card-footer-meta">
          <span className="meta-author">
            <Clock size={12} />
            {new Date(
              translatedArticle.created_at || Date.now(),
            ).toLocaleDateString()}
          </span>

          <button
            className="card-share-btn"
            onClick={handleShare}
            title="Share Article"
          >
            <Share2 size={14} />
          </button>
        </div>

        <div className="card-action-bar">
          <span className="read-link">
            {language === "te"
              ? "పూర్తి వార్త"
              : language === "hi"
                ? "पूरी खबर"
                : "Read Full Story"}
            <ArrowRight size={12} />
          </span>
        </div>
      </div>

      <style jsx>{`
        .v6-article-card {
          background: #ffffff;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 3px 12px rgba(0, 0, 0, 0.06);
          border: 1px solid #e2e8f0;
          transition: all 0.3s ease;
          cursor: pointer;
          display: flex;
          flex-direction: column;
        }

        .v6-article-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 25px rgba(91, 30, 161, 0.12);
          border-color: #d32f2f;
        }

        .card-image-box {
          position: relative;
          width: 100%;
          height: 180px;
          overflow: hidden;
          background: #0a192f;
        }

        .card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .v6-article-card:hover .card-img {
          transform: scale(1.08);
        }

        .card-cat-badge {
          position: absolute;
          bottom: 10px;
          left: 10px;
          background: #d32f2f;
          color: white;
          font-size: 0.7rem;
          font-weight: 800;
          padding: 3px 10px;
          border-radius: 4px;
          text-transform: uppercase;
          box-shadow: 0 2px 6px rgba(91, 30, 161, 0.35);
        }

        .card-body {
          padding: 1rem;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .card-title {
          font-size: 1rem;
          font-weight: 700;
          color: #0a192f;
          line-height: 1.45;
          margin-bottom: 0.8rem;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          flex: 1;
        }

        .card-footer-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 0.8rem;
          border-top: 1px dashed #e2e8f0;
          color: #64748b;
          font-size: 0.78rem;
        }

        .meta-author {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .card-share-btn {
          background: transparent;
          border: none;
          color: #64748b;
          cursor: pointer;
          padding: 4px;
          border-radius: 50%;
          transition:
            color 0.2s,
            background 0.2s;
        }

        .card-share-btn:hover {
          color: #d32f2f;
          background: #f3e8ff;
        }

        .card-action-bar {
          margin-top: 0.6rem;
        }

        .read-link {
          font-size: 0.8rem;
          font-weight: 700;
          color: #d32f2f;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        .skeleton-line {
          display: block;
          height: 1rem;
          background: #e2e8f0;
          border-radius: 4px;
          animation: pulse 1.5s infinite;
        }
      `}</style>
    </article>
  );
};

export default Article;
