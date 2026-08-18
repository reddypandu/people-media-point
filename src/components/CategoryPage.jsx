import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabase';
import Article from './Article';
import HeroSection from './HeroSection';
import TranslatedText from './TranslatedText';
import SEO from './SEO';
import { MOCK_ARTICLES } from '../constants/articlesData';

const CategoryPage = () => {
  const { categoryId, districtId } = useParams();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const displayTitle = districtId 
    ? districtId.replace(/-/g, ' ') 
    : (categoryId ? categoryId.replace(/-/g, ' ') : "Latest News");

  useEffect(() => {
    fetchArticles();
  }, [categoryId, districtId]);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      let query = supabase.from('articles').select('*, categories(name, slug), districts(name)');

      if (categoryId && categoryId !== 'home') {
        query = query.eq('categories.slug', categoryId);
      }

      if (districtId) {
        query = query.ilike('districts.name', districtId.replace(/-/g, ' '));
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        setArticles(data);
      } else {
        // Fallback filter on MOCK_ARTICLES
        if (categoryId && categoryId !== 'home') {
          const filtered = MOCK_ARTICLES.filter(a => 
            (a.category && a.category.toLowerCase() === categoryId.toLowerCase()) ||
            (a.categories?.slug && a.categories.slug.toLowerCase() === categoryId.toLowerCase())
          );
          setArticles(filtered.length > 0 ? filtered : MOCK_ARTICLES);
        } else {
          setArticles(MOCK_ARTICLES);
        }
      }
    } catch (e) {
      setArticles(MOCK_ARTICLES);
    } finally {
      setLoading(false);
    }
  };

  const isHome = !categoryId || categoryId === 'home';

  // Home Page Sectional Categorization
  const telanganaArticles = articles.filter(a => 
    a.category === 'Telangana' || a.categories?.name === 'Telangana'
  );
  const apArticles = articles.filter(a => 
    a.category === 'Andhra Pradesh' || a.categories?.name === 'Andhra Pradesh'
  );
  const movieArticles = articles.filter(a => 
    a.category === 'Movie' || a.categories?.name === 'Movie'
  );
  const otherArticles = articles;

  return (
    <div className="v6-category-wrapper">
      <SEO
        title={districtId || (categoryId ? categoryId.replace(/-/g, ' ') : "People Media Point - Telugu News")}
        description={`Read latest ${districtId || categoryId || 'Telugu'} news updates on People Media Point portal.`}
      />

      {isHome && <HeroSection />}

      <div className="container v6-page-body">
        {isHome ? (
          /* Multi-Sectional Homepage Layout (Andhra Jyothi & V6 Style) */
          loading ? (
            <div className="loading-box" role="status" aria-live="polite">
              <span className="loading-spinner" aria-hidden="true" />
              <p><TranslatedText>Loading news...</TranslatedText></p>
            </div>
          ) : (
          <div className="home-sections-container">
            {/* Telangana News Section */}
            {telanganaArticles.length > 0 && (
              <section className="v6-news-section">
                <div className="section-title-bar">
                  <h2>
                    <span className="bar-indicator"></span>
                    <TranslatedText>TELANGANA NEWS</TranslatedText>
                  </h2>
                  <Link to="/telangana" className="section-more-link"><TranslatedText>View All</TranslatedText> →</Link>
                </div>
                <div className="news-grid-4">
                  {telanganaArticles.slice(0, 4).map(art => (
                    <Article key={art.id} originalArticle={art} />
                  ))}
                </div>
              </section>
            )}

            {/* Andhra Pradesh News Section */}
            {apArticles.length > 0 && (
              <section className="v6-news-section">
                <div className="section-title-bar ap-bar">
                  <h2>
                    <span className="bar-indicator ap-indicator"></span>
                    <TranslatedText>ANDHRA PRADESH NEWS</TranslatedText>
                  </h2>
                  <Link to="/andhra-pradesh" className="section-more-link"><TranslatedText>View All</TranslatedText> →</Link>
                </div>
                <div className="news-grid-4">
                  {apArticles.slice(0, 4).map(art => (
                    <Article key={art.id} originalArticle={art} />
                  ))}
                </div>
              </section>
            )}

            {/* Tollywood Movie Buzz Section */}
            {movieArticles.length > 0 && (
              <section className="v6-news-section movie-section">
                <div className="section-title-bar movie-bar">
                  <h2>
                    <span className="bar-indicator movie-indicator"></span>
                    🎬 <TranslatedText>CINEMA & TOLLYWOOD</TranslatedText>
                  </h2>
                  <Link to="/movie" className="section-more-link"><TranslatedText>View All</TranslatedText> →</Link>
                </div>
                <div className="news-grid-4">
                  {movieArticles.slice(0, 4).map(art => (
                    <Article key={art.id} originalArticle={art} />
                  ))}
                </div>
              </section>
            )}

            {/* Main Trending Updates Grid */}
            <section className="v6-news-section">
              <div className="section-title-bar">
                <h2>
                  <span className="bar-indicator"></span>
                  <TranslatedText>TRENDING UPDATES</TranslatedText>
                </h2>
              </div>
              <div className="news-grid-4">
                {otherArticles.map(art => (
                  <Article key={art.id} originalArticle={art} />
                ))}
              </div>
            </section>
          </div>
          )
        ) : (
          /* Category / District Dedicated Page Layout */
          <div className="dedicated-category-page">
            <div className="category-header-banner">
              <h1>
                <span className="bar-indicator"></span>
                <TranslatedText>{displayTitle}</TranslatedText>
              </h1>
            </div>

            {loading ? (
              <div className="loading-box" role="status" aria-live="polite">
                <span className="loading-spinner" aria-hidden="true" />
                <p><TranslatedText>Loading news...</TranslatedText></p>
              </div>
            ) : articles.length > 0 ? (
              <div className="news-grid-4">
                {articles.map(article => (
                  <Article key={article.id} originalArticle={article} />
                ))}
              </div>
            ) : (
              <div className="no-news-box">
                <p><TranslatedText>No news articles found for this section.</TranslatedText></p>
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        .v6-category-wrapper {
          background: #F8FAFC;
          min-height: 70vh;
          padding-bottom: 3rem;
        }

        .v6-page-body {
          padding-top: 1.5rem;
        }

        .home-sections-container {
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
        }

        .v6-news-section {
          background: #FFFFFF;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 4px 15px rgba(0,0,0,0.04);
          border: 1px solid #E2E8F0;
        }

        .section-title-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 0.8rem;
          margin-bottom: 1.2rem;
          border-bottom: 2px solid #E2E8F0;
        }

        .section-title-bar h2 {
          font-size: 1.25rem;
          font-weight: 800;
          color: #0A192F;
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .bar-indicator {
          width: 5px;
          height: 22px;
          background: #D32F2F;
          border-radius: 2px;
          display: inline-block;
        }

        .bar-indicator.ap-indicator {
          background: #0284C7;
        }

        .bar-indicator.movie-indicator {
          background: #E11D48;
        }

        .section-more-link {
          color: #D32F2F;
          font-weight: 700;
          font-size: 0.85rem;
          text-decoration: none;
          transition: color 0.2s;
        }

        .section-more-link:hover {
          color: #991B1B;
          text-decoration: underline;
        }

        .news-grid-4 {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        .dedicated-category-page {
          background: #FFFFFF;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 4px 20px rgba(0,0,0,0.05);
          border: 1px solid #E2E8F0;
        }

        .category-header-banner {
          padding-bottom: 1rem;
          margin-bottom: 1.8rem;
          border-bottom: 3px solid #D32F2F;
        }

        .category-header-banner h1 {
          font-size: 1.6rem;
          font-weight: 800;
          color: #0A192F;
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 0;
          text-transform: uppercase;
        }

        .loading-box, .no-news-box {
          padding: 3rem;
          text-align: center;
          color: #64748B;
          font-size: 1.1rem;
        }

        .loading-spinner {
          display: inline-block;
          width: 30px;
          height: 30px;
          border: 3px solid #E2E8F0;
          border-top-color: #D32F2F;
          border-radius: 50%;
          animation: spin 0.75s linear infinite;
        }

        .loading-box p {
          margin: 0.8rem 0 0;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .news-grid-4 {
            grid-template-columns: 1fr;
          }
          .section-title-bar h2 {
            font-size: 1.05rem;
          }
        }
      `}</style>
    </div>
  );
};

export default CategoryPage;
