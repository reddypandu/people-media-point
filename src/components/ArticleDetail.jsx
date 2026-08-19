import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabase';
import TranslatedText from './TranslatedText';
import SEO from './SEO';
import { Calendar, User, ChevronLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const ArticleDetail = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const { language, translateContent } = useLanguage();
  const [translatedContent, setTranslatedContent] = useState('');

  useEffect(() => {
    fetchArticle();
  }, [id]);

  useEffect(() => {
    const translateBody = async () => {
      if (!article) return;
      if (language === 'te') {
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
    const { data, error } = await supabase
      .from('articles')
      .select('*, categories(name), districts(name)')
      .eq('id', id)
      .or(`is_expiring.eq.false,expires_at.gt.${new Date().toISOString()}`)
      .single();

    if (!error) setArticle(data);
    setLoading(false);
  };

  const getEmbedUrl = (url) => {
    if (!url) return '';
    let videoId = '';
    if (url.includes('youtube.com/watch?v=')) videoId = url.split('v=')[1]?.split('&')[0];
    else if (url.includes('youtu.be/')) videoId = url.split('youtu.be/')[1]?.split('?')[0];
    else if (url.includes('youtube.com/embed/')) return url;
    else if (url.includes('youtube.com/shorts/')) videoId = url.split('shorts/')[1]?.split('?')[0];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

  if (loading) return <div className="container"><TranslatedText>Loading article...</TranslatedText></div>;
  if (!article) return <div className="container"><TranslatedText>Article not found.</TranslatedText></div>;

  const contentSnippet = article.content ? article.content.substring(0, 150) + '...' : '';

  return (
    <div className="article-detail-container">
      <SEO 
        title={article.title}
        description={contentSnippet}
        type="article"
        image={article.image_url}
      />
      <div className="container">
        <Link to="/" className="back-link">
          <ChevronLeft size={20} />
          <span>Back to News</span>
        </Link>

        <article className="full-article">
          <header className="article-header">
            <div className="article-category-tag">
              <TranslatedText>{article.categories?.name}</TranslatedText>
              {article.districts?.name && (
                <> • <TranslatedText>{article.districts.name}</TranslatedText></>
              )}
            </div>
            
            <h1><TranslatedText>{article.title}</TranslatedText></h1>
            
            <div className="article-meta-info">
              <div className="meta-item">
                <User size={16} />
                <span>{article.author}</span>
              </div>
              <div className="meta-item">
                <Calendar size={16} />
                <span>{new Date(article.created_at).toLocaleDateString()}</span>
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
            <div dangerouslySetInnerHTML={{ __html: translatedContent || article.content }} />
          </div>

          {article.whatsapp_link && (
            <div className="article-footer-promo">
              <a href={article.whatsapp_link} target="_blank" rel="noopener noreferrer" className="whatsapp-footer-btn">
                Join our WhatsApp Channel for more updates
              </a>
            </div>
          )}
        </article>
      </div>

      <style jsx>{`
        .article-detail-container {
          padding: 2rem 0;
          background: #fff;
        }
        .back-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--primary-color);
          text-decoration: none;
          margin-bottom: 2rem;
          font-weight: 600;
        }
        .full-article {
          max-width: 900px;
          margin: 0 auto;
        }
        .article-header {
          margin-bottom: 2rem;
        }
        .article-category-tag {
          color: var(--accent-red);
          font-weight: 700;
          text-transform: uppercase;
          font-size: 0.9rem;
          margin-bottom: 1rem;
        }
        .article-header h1 {
          font-size: 2.5rem;
          line-height: 1.2;
          color: var(--primary-color);
          margin-bottom: 1.5rem;
        }
        .article-meta-info {
          display: flex;
          gap: 2rem;
          color: var(--text-secondary);
          border-top: 1px solid #eee;
          border-bottom: 1px solid #eee;
          padding: 1rem 0;
        }
        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .article-main-image {
          margin-bottom: 2rem;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        .article-main-image img {
          width: 100%;
          height: auto;
          display: block;
        }
        .article-video-embed {
          margin-bottom: 2rem;
          aspect-ratio: 16/9;
          border-radius: 12px;
          overflow: hidden;
        }
        .article-video-embed iframe {
          width: 100%;
          height: 100%;
        }
        .article-body-content {
          font-size: 1.2rem;
          line-height: 1.8;
          color: #333;
        }
        .article-body-content :global(p) {
          margin-bottom: 1.5rem;
        }
        .whatsapp-footer-btn {
          display: block;
          background: #25D366;
          color: white;
          text-align: center;
          padding: 1rem;
          border-radius: 8px;
          text-decoration: none;
          font-weight: bold;
          margin-top: 3rem;
        }
        @media (max-width: 768px) {
          .article-header h1 { font-size: 1.8rem; }
          .article-meta-info { flex-direction: column; gap: 0.5rem; }
        }
      `}</style>
    </div>
  );
};

export default ArticleDetail;
