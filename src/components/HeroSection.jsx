import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import { ChevronLeft, ChevronRight, Play, Clock, Flame } from "lucide-react";
import TranslatedText from "./TranslatedText";
import { MOCK_ARTICLES } from "../constants/articlesData";
import SidebarAd from "./SidebarAd";

const HeroSection = () => {
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [whatsappLink] = useState("https://wa.me/918886166565"); // Replace with your actual WhatsApp link
  const navigate = useNavigate();

  useEffect(() => {
    fetchHeroData();
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [slides.length]);

  const fetchHeroData = async () => {
    try {
      const { data: sliderArticles, error } = await supabase
        .from("articles")
        .select("*")
        .or(`is_expiring.eq.false,expires_at.gt.${new Date().toISOString()}`)
        .order("created_at", { ascending: false })
        .limit(6);

      if (!error && sliderArticles) {
        // Keep the hero empty when every article has expired.
        setSlides(sliderArticles);
      } else {
        setSlides(MOCK_ARTICLES);
      }
    } catch (e) {
      setSlides(MOCK_ARTICLES);
    }
  };

  const getEmbedUrl = (url) => {
    if (!url) return "";
    let videoId = "";

    if (url.includes("youtube.com/watch?v=")) {
      videoId = url.split("v=")[1]?.split("&")[0];
    } else if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1]?.split("?")[0];
    } else if (url.includes("youtube.com/embed/")) {
      return url;
    } else if (url.includes("youtube.com/shorts/")) {
      videoId = url.split("shorts/")[1]?.split("?")[0];
    }

    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

  const nextSlide = (e) => {
    if (e) e.stopPropagation();
    if (slides.length > 0)
      setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = (e) => {
    if (e) e.stopPropagation();
    if (slides.length > 0)
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleSlideClick = (id) => {
    navigate(`/article/${id}`);
  };

  const currentArticle = slides[currentSlide] || null;
  const sideArticles = slides
    .filter((_, idx) => idx !== currentSlide)
    .slice(0, 4);

  return (
    <div className="v6-hero-wrapper">
      <div className="container">
        <div className="v6-hero-grid">
          {/* Main Hero News Slider Card */}
          <div className="hero-main-slider">
            {slides.length > 0 && currentArticle ? (
              <div
                className="slider-card"
                onClick={() => handleSlideClick(currentArticle.id)}
              >
                <div className="slide-image-box">
                  <img
                    src={
                      currentArticle.image_url ||
                      "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80"
                    }
                    alt={currentArticle.title}
                    className="slide-img"
                  />
                  <div className="slide-overlay-gradient"></div>

                  <div className="slide-badge-top">
                    <span className="flame-icon">
                      <Flame size={14} />
                    </span>
                    <TranslatedText>TOP STORY</TranslatedText>
                  </div>

                  {/* <div className="slider-nav-arrows">
                    <button className="slider-arrow prev" onClick={prevSlide} aria-label="Previous News">
                      <ChevronLeft size={20} />
                    </button>
                    <button className="slider-arrow next" onClick={nextSlide} aria-label="Next News">
                      <ChevronRight size={20} />
                    </button>
                  </div> */}
                </div>

                <div className="slide-info-card">
                  <div className="slide-category-meta">
                    <span className="category-pill">
                      <TranslatedText>
                        {currentArticle.categories?.name ||
                          currentArticle.category ||
                          "Breaking"}
                      </TranslatedText>
                    </span>
                    <span className="meta-time">
                      <Clock size={12} />
                      {new Date(
                        currentArticle.created_at || Date.now(),
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <h2 className="slide-title">
                    <TranslatedText>{currentArticle.title}</TranslatedText>
                  </h2>
                  <p className="slide-excerpt">
                    <TranslatedText>
                      {currentArticle.content?.substring(0, 130) + "..."}
                    </TranslatedText>
                  </p>
                </div>
              </div>
            ) : null}

            {/* Slider Dots */}
            <div className="slider-dots-container">
              {slides.map((_, index) => (
                <button
                  key={index}
                  className={`dot-btn ${index === currentSlide ? "active" : ""}`}
                  onClick={() => setCurrentSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Right Sidebar Column - Bulletins & Video */}
          <div className="hero-side-column">
            <SidebarAd />
            {/* V6 Bulletins Box */}
            <div className="bulletin-box">
              <div className="bulletin-header">
                <h3>
                  ⚡ <TranslatedText>Top Headlines</TranslatedText>
                </h3>
                <span className="bulletin-badge">LIVE</span>
              </div>

              <div className="bulletin-list">
                {sideArticles.map((art) => (
                  <div
                    key={art.id}
                    className="bulletin-item"
                    onClick={() => handleSlideClick(art.id)}
                  >
                    <div className="bulletin-thumb">
                      <img src={art.image_url} alt="" />
                    </div>
                    <div className="bulletin-content">
                      <span className="bulletin-cat">
                        <TranslatedText>
                          {art.categories?.name || art.category || "News"}
                        </TranslatedText>
                      </span>
                      <h4>
                        <TranslatedText>{art.title}</TranslatedText>
                      </h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Video News Card */}
            {currentArticle?.video_url && (
              <div className="hero-video-card">
                <div className="video-card-header">
                  <Play size={16} fill="#D32F2F" color="#D32F2F" />
                  <span>
                    <TranslatedText>Video News Bulletin</TranslatedText>
                  </span>
                </div>
                <div className="video-frame-wrapper">
                  <iframe
                    src={getEmbedUrl(currentArticle.video_url)}
                    title="News Video"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            )}

            {/* Join WhatsApp Channel Banner */}
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="whatsapp-promo-card"
              style={{
                background: "linear-gradient(135deg, #128C7E 0%, #075E54 100%)",
                borderRadius: "12px",
                padding: "1.2rem",
                color: "white",
                textDecoration: "none",
                display: "block",
                boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                transition: "transform 0.2s",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.transform = "translateY(-2px)")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.transform = "translateY(0)")
              }
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "8px",
                }}
              >
                <span style={{ fontSize: "1.5rem" }}>💬</span>
                <strong>
                  <TranslatedText>Join WhatsApp Channel</TranslatedText>
                </strong>
              </div>
              <p style={{ fontSize: "0.8rem", opacity: 0.9, lineHeight: 1.4 }}>
                <TranslatedText>
                  Get the latest real-time Telugu news updates directly sent to
                  your mobile phone!
                </TranslatedText>
              </p>
            </a>
          </div>
        </div>
      </div>

      <style jsx>{`
        .v6-hero-wrapper {
          padding: 1.5rem 0;
          background: #f4f6f9;
          max-width: 1000px;
          margin: 0 auto;
        }

        .v6-hero-grid {
          display: grid;
          grid-template-columns: 1.6fr 0.8fr;
          gap: 1.5rem;
        }

        .hero-main-slider {
          display: flex;
          flex-direction: column;
        }

        .slider-card {
          background: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          cursor: pointer;
          transition:
            transform 0.3s,
            box-shadow 0.3s;
          display: flex;
          flex-direction: column;
        }

        .slider-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
        }

        .slide-image-box {
          position: relative;
          width: 100%;
          height: 340px;
          overflow: hidden;
          background: #000;
        }

        .slide-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          transition: transform 0.6s ease;
        }

        .slider-card:hover .slide-img {
          transform: scale(1.04);
        }

        .slide-overlay-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(10, 25, 47, 0.95) 0%,
            rgba(10, 25, 47, 0.2) 60%,
            transparent 100%
          );
        }

        .slide-badge-top {
          position: absolute;
          top: 16px;
          left: 16px;
          background: #d32f2f;
          color: white;
          padding: 6px 14px;
          border-radius: 4px;
          font-weight: 800;
          font-size: 0.75rem;
          display: flex;
          align-items: center;
          gap: 6px;
          letter-spacing: 0.5px;
          box-shadow: 0 2px 8px rgba(211, 47, 47, 0.4);
        }

        .slider-nav-arrows {
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          transform: translateY(-50%);
          display: flex;
          justify-content: space-between;
          padding: 0 12px;
          pointer-events: none;
        }

        .slider-arrow {
          pointer-events: auto;
          background: rgba(10, 25, 47, 0.7);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.2);
          width: 38px;
          height: 38px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition:
            background 0.2s,
            transform 0.2s;
        }

        .slider-arrow:hover {
          background: #d32f2f;
          transform: scale(1.1);
        }

        .slide-info-card {
          padding: 1.5rem;
        }

        .slide-category-meta {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 8px;
        }

        .category-pill {
          background: #e2e8f0;
          color: #0a192f;
          font-weight: 700;
          font-size: 0.75rem;
          padding: 4px 10px;
          border-radius: 4px;
          text-transform: uppercase;
        }

        .meta-time {
          color: #64748b;
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .slide-title {
          font-size: 1.45rem;
          font-weight: 800;
          color: #0a192f;
          line-height: 1.4;
          margin-bottom: 8px;
        }

        .slide-excerpt {
          color: #475569;
          font-size: 0.95rem;
          line-height: 1.5;
        }

        .slider-dots-container {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-top: 12px;
        }

        .dot-btn {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          border: none;
          background: #cbd5e1;
          cursor: pointer;
          transition: all 0.3s;
        }

        .dot-btn.active {
          background: #d32f2f;
          width: 24px;
          border-radius: 6px;
        }

        /* Right Side Column */
        .hero-side-column {
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }

        .bulletin-box {
          background: #ffffff;
          border-radius: 12px;
          padding: 1.2rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border-top: 4px solid #d32f2f;
        }

        .bulletin-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 0.8rem;
          border-bottom: 1px solid #e2e8f0;
          margin-bottom: 0.8rem;
        }

        .bulletin-header h3 {
          font-size: 1.05rem;
          font-weight: 800;
          color: #0a192f;
          margin: 0;
        }

        .bulletin-badge {
          background: #fef2f2;
          color: #d32f2f;
          font-weight: 800;
          font-size: 0.7rem;
          padding: 2px 8px;
          border-radius: 4px;
          border: 1px solid #fecaca;
        }

        .bulletin-list {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
        }

        .bulletin-item {
          display: flex;
          gap: 12px;
          cursor: pointer;
          padding: 6px;
          border-radius: 6px;
          transition: background 0.2s;
        }

        .bulletin-item:hover {
          background: #f8fafc;
        }

        .bulletin-thumb {
          width: 70px;
          height: 52px;
          border-radius: 6px;
          overflow: hidden;
          flex-shrink: 0;
        }

        .bulletin-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .bulletin-content {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .bulletin-cat {
          font-size: 0.7rem;
          font-weight: 700;
          color: #d32f2f;
          text-transform: uppercase;
        }

        .bulletin-content h4 {
          font-size: 0.85rem;
          font-weight: 700;
          color: #1e293b;
          line-height: 1.35;
          margin: 2px 0 0 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .hero-video-card {
          background: #0a192f;
          border-radius: 12px;
          overflow: hidden;
          color: white;
          padding: 12px;
        }

        .video-card-header {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 700;
          font-size: 0.85rem;
          margin-bottom: 8px;
        }

        .video-frame-wrapper {
          position: relative;
          width: 100%;
          padding-top: 56.25%;
          border-radius: 8px;
          overflow: hidden;
          background: #000;
        }

        .video-frame-wrapper iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: none;
        }

        .epaper-promo-card {
          background: linear-gradient(135deg, #0a192f 0%, #1e293b 100%);
          border-radius: 12px;
          padding: 1rem;
          color: white;
          position: relative;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .epaper-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #d32f2f;
          color: white;
          font-size: 0.7rem;
          font-weight: 800;
          padding: 3px 8px;
          border-radius: 4px;
          margin-bottom: 8px;
          text-transform: uppercase;
        }

        .epaper-banner-link {
          display: flex;
          justify-content: space-between;
          align-items: center;
          text-decoration: none;
          color: white;
          gap: 12px;
        }

        .epaper-info strong {
          display: block;
          font-size: 0.95rem;
          color: #ffffff;
        }

        .epaper-info p {
          font-size: 0.75rem;
          color: #94a3b8;
          margin-top: 2px;
        }

        .download-btn-pill {
          background: #d32f2f;
          color: white;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 6px 12px;
          border-radius: 20px;
          white-space: nowrap;
          transition: background 0.2s;
        }

        .epaper-banner-link:hover .download-btn-pill {
          background: #b71c1c;
        }

        @media (max-width: 992px) {
          .v6-hero-grid {
            grid-template-columns: 1fr;
          }
          .slide-image-box {
            height: 250px;
          }
          .slide-title {
            font-size: 1.2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default HeroSection;
