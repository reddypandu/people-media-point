import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../supabase";
import TranslatedText from "./TranslatedText";
import SEO from "./SEO";
import SidebarAd from "./SidebarAd";
import { Calendar, User, ChevronLeft, Clock3, ArrowRight } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const ArticleDetail = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const { language, translateContent } = useLanguage();
  const [translatedContent, setTranslatedContent] = useState("");

  useEffect(() => {
    fetchArticle();
  }, [id]);

  useEffect(() => {
    const translateBody = async () => {
      if (!article) return;
      if (language === "te") {
        setTranslatedContent(article.content);
        return;
      }
      try {
        const result = await translateContent(article.content);
        setTranslatedContent(result);
      } catch (error) {
        setTranslatedContent(article.content);
      }
    };

    translateBody();
  }, [article, language, translateContent]);

  const fetchArticle = async () => {
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("articles")
        .select("*, categories(name, slug), districts(name)")
        .eq("id", id)
        .or(`is_expiring.eq.false,expires_at.gt.${new Date().toISOString()}`)
        .single();

      if (error || !data) {
        setArticle(null);
        setRelatedArticles([]);
        return;
      }

      setArticle(data);
      await fetchRelatedArticles(data);
    } catch (e) {
      setArticle(null);
      setRelatedArticles([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedArticles = async (currentArticle) => {
    try {
      const { data, error } = await supabase
        .from("articles")
        .select("*, categories(name, slug), districts(name)")
        .neq("id", currentArticle.id)
        .or(`is_expiring.eq.false,expires_at.gt.${new Date().toISOString()}`)
        .order("created_at", { ascending: false })
        .limit(8);

      if (error || !data) {
        setRelatedArticles([]);
        return;
      }

      let filtered = [...data];

      if (currentArticle.category_id) {
        const sameCategory = data.filter(
          (item) => item.category_id === currentArticle.category_id,
        );
        if (sameCategory.length > 0) {
          filtered = sameCategory;
        }
      }

      setRelatedArticles(filtered.slice(0, 5));
    } catch (e) {
      setRelatedArticles([]);
    }
  };

  const getEmbedUrl = (url) => {
    if (!url) return "";
    let videoId = "";
    if (url.includes("youtube.com/watch?v="))
      videoId = url.split("v=")[1]?.split("&")[0];
    else if (url.includes("youtu.be/"))
      videoId = url.split("youtu.be/")[1]?.split("?")[0];
    else if (url.includes("youtube.com/embed/")) return url;
    else if (url.includes("youtube.com/shorts/"))
      videoId = url.split("shorts/")[1]?.split("?")[0];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

  if (loading)
    return (
      <div className="container">
        <TranslatedText>Loading article...</TranslatedText>
      </div>
    );
  if (!article)
    return (
      <div className="container">
        <TranslatedText>Article not found.</TranslatedText>
      </div>
    );

  const contentSnippet = article.content
    ? article.content.substring(0, 150) + "..."
    : "";

  return (
    <div className="news-detail-page">
      <SEO
        title={article.title}
        description={contentSnippet}
        type="article"
        image={article.image_url}
      />

      <div className="container detail-shell">
        <Link to="/" className="back-link">
          <ChevronLeft size={18} />
          <span>Back to News</span>
        </Link>

        <div className="detail-layout">
          <article className="story-panel">
            <header className="article-header">
              <div className="article-category-tag">
                <TranslatedText>
                  {article.categories?.name || "News"}
                </TranslatedText>
                {article.districts?.name && (
                  <>
                    <span className="dot-separator">•</span>
                    <TranslatedText>{article.districts.name}</TranslatedText>
                  </>
                )}
              </div>

              <h1>
                <TranslatedText>{article.title}</TranslatedText>
              </h1>

              <div className="article-meta-info">
                <div className="meta-item">
                  <User size={15} />
                  <span>{article.author || "Admin"}</span>
                </div>
                <div className="meta-item">
                  <Calendar size={15} />
                  <span>
                    {new Date(article.created_at).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="meta-item">
                  <Clock3 size={15} />
                  <span>Updated</span>
                </div>
              </div>
            </header>

            {article.image_url && (
              <div className="article-main-image">
                <img src={article.image_url} alt={article.title} />
              </div>
            )}

            {article.video_url && (
              <div className="article-video-embed">
                <iframe
                  src={getEmbedUrl(article.video_url)}
                  title="News Video"
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
              </div>
            )}

            <div className="article-body-content">
              <div
                dangerouslySetInnerHTML={{
                  __html: translatedContent || article.content,
                }}
              />
            </div>

            {article.whatsapp_link && (
              <div className="article-footer-promo">
                <a
                  href={article.whatsapp_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="whatsapp-footer-btn"
                >
                  Join our WhatsApp Channel for more updates
                </a>
              </div>
            )}
          </article>

          <aside className="sidebar-panel">
            <div className="ad-panel-wrap">
              <SidebarAd />
            </div>

            <div className="side-box">
              <div className="side-box-header">
                <span className="side-bar-indicator"></span>
                <h3>Latest Headlines</h3>
              </div>

              <ul className="headline-list">
                {relatedArticles.map((item) => (
                  <li key={item.id}>
                    <Link to={`/article/${item.id}`}>
                      <span className="tiny-tag">
                        {item.categories?.name || "News"}
                      </span>
                      <span className="headline-text">{item.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>

        {relatedArticles.length > 0 && (
          <section className="more-stories-section">
            <div className="section-title-row">
              <span className="section-bar"></span>
              <h2>More News</h2>
            </div>

            <div className="more-news-grid">
              {relatedArticles.map((item) => (
                <Link
                  key={item.id}
                  to={`/article/${item.id}`}
                  className="mini-story-card"
                >
                  <div className="mini-story-thumb">
                    <img
                      src={
                        item.image_url ||
                        "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80"
                      }
                      alt={item.title}
                    />
                  </div>
                  <div className="mini-story-body">
                    <span className="mini-tag">
                      {item.categories?.name || "News"}
                    </span>
                    <h3>{item.title}</h3>
                    <div className="mini-meta">
                      <span>
                        {new Date(item.created_at).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                      <ArrowRight size={14} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      <style jsx>{`
        .news-detail-page {
          background: #f8fafc;
          padding: 2rem 0 3rem;
        }

        .detail-shell {
          max-width: 1200px;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          color: #d32f2f;
          text-decoration: none;
          font-weight: 700;
          margin-bottom: 1.5rem;
        }

        .detail-layout {
          display: grid;
          grid-template-columns: minmax(0, 2.1fr) minmax(280px, 0.9fr);
          gap: 1.5rem;
          align-items: start;
        }

        .story-panel,
        .side-box,
        .more-stories-section {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          box-shadow: 0 8px 24px rgba(15, 23, 42, 0.04);
        }

        .story-panel {
          padding: 1.5rem;
        }

        .article-header {
          margin-bottom: 1.4rem;
        }

        .article-category-tag {
          display: inline-flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.4rem;
          color: #b91c1c;
          font-size: 0.76rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 0.9rem;
        }

        .dot-separator {
          opacity: 0.7;
        }

        .article-header h1 {
          font-size: clamp(2rem, 2.5vw, 3rem);
          line-height: 1.15;
          color: #0f172a;
          margin: 0 0 1rem;
          font-weight: 800;
        }

        .article-meta-info {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          flex-wrap: wrap;
          padding: 0.85rem 0;
          border-top: 1px solid #e2e8f0;
          border-bottom: 1px solid #e2e8f0;
          color: #475569;
          font-size: 0.85rem;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.45rem;
        }

        .article-main-image {
          margin: 1.5rem 0;
          border-radius: 14px;
          overflow: hidden;
          background: #e2e8f0;
        }

        .article-main-image img {
          display: block;
          width: 100%;
          height: auto;
        }

        .article-video-embed {
          margin: 1.5rem 0;
          aspect-ratio: 16/9;
          border-radius: 14px;
          overflow: hidden;
        }

        .article-video-embed iframe {
          width: 100%;
          height: 100%;
          border: 0;
        }

        .article-body-content {
          color: #1f2937;
          font-size: 1.15rem;
          line-height: 1.9;
        }

        .article-body-content p {
          margin: 0 0 1.3rem;
        }

        .article-body-content img {
          max-width: 100%;
          border-radius: 12px;
          margin: 1rem 0;
        }

        .article-body-content strong {
          color: #0f172a;
        }

        .article-footer-promo {
          margin-top: 2rem;
        }

        .whatsapp-footer-btn {
          display: inline-block;
          background: linear-gradient(135deg, #25d366, #16a34a);
          color: #fff;
          padding: 0.9rem 1.2rem;
          border-radius: 999px;
          text-decoration: none;
          font-weight: 700;
        }

        .sidebar-panel {
          position: sticky;
          top: 94px;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .ad-panel-wrap {
          width: 100%;
        }

        .side-box {
          padding: 1rem;
        }

        .side-box-header {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          margin-bottom: 1rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid #e2e8f0;
        }

        .side-bar-indicator {
          width: 8px;
          height: 24px;
          background: linear-gradient(180deg, #d32f2f, #d32f2f);
          border-radius: 999px;
          display: inline-block;
        }

        .side-box-header h3 {
          font-size: 1rem;
          color: #0f172a;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .headline-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
        }

        .headline-list li a {
          display: block;
          padding: 0.8rem 0.2rem;
          border-bottom: 1px dashed #e2e8f0;
          text-decoration: none;
          color: #0f172a;
        }

        .headline-list li:last-child a {
          border-bottom: none;
        }

        .tiny-tag {
          display: inline-block;
          font-size: 0.62rem;
          color: #d32f2f;
          font-weight: 800;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-bottom: 0.35rem;
        }

        .headline-text {
          display: block;
          font-weight: 700;
          line-height: 1.5;
          color: #111827;
        }

        .more-stories-section {
          margin-top: 1.5rem;
          padding: 1.25rem;
        }

        .section-title-row {
          display: flex;
          align-items: center;
          gap: 0.55rem;
          margin-bottom: 1rem;
        }

        .section-bar {
          width: 6px;
          height: 24px;
          background: #ef4444;
          border-radius: 999px;
          display: inline-block;
        }

        .section-title-row h2 {
          font-size: 1.4rem;
          color: #0f172a;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .more-news-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 1rem;
        }

        .mini-story-card {
          display: flex;
          flex-direction: column;
          text-decoration: none;
          color: inherit;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          overflow: hidden;
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .mini-story-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 20px rgba(15, 23, 42, 0.08);
        }

        .mini-story-thumb {
          height: 150px;
          overflow: hidden;
          background: #cbd5e1;
        }

        .mini-story-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .mini-story-body {
          padding: 0.8rem;
        }

        .mini-tag {
          display: inline-block;
          color: #d32f2f;
          font-size: 0.65rem;
          font-weight: 800;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-bottom: 0.45rem;
        }

        .mini-story-body h3 {
          font-size: 1rem;
          line-height: 1.45;
          color: #0f172a;
          margin-bottom: 0.6rem;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .mini-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.75rem;
          color: #64748b;
        }

        @media (max-width: 980px) {
          .detail-layout {
            grid-template-columns: 1fr;
          }

          .sidebar-panel {
            position: static;
          }
        }

        @media (max-width: 768px) {
          .news-detail-page {
            padding-top: 1rem;
          }

          .story-panel,
          .side-box,
          .more-stories-section {
            border-radius: 12px;
          }

          .story-panel {
            padding: 1rem;
          }

          .article-meta-info {
            gap: 0.75rem;
            flex-direction: column;
            align-items: flex-start;
          }

          .more-news-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 520px) {
          .more-news-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default ArticleDetail;
