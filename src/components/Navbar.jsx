import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Clock, Calendar, Tv, User, Menu, X } from "lucide-react";
import {
  TELANGANA_DISTRICTS,
  ANDHRA_PRADESH_DISTRICTS,
  MORE_CATEGORIES,
} from "../constants/districtData";
import logo from "../assets/logo.png";
import LanguageSelector from "./LanguageSelector";
import TranslatedText from "./TranslatedText";
import BreakingTicker from "./BreakingTicker";
import { supabase } from "../supabase";
import QR from "../assets/people-media-qr.png";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [dateTime, setDateTime] = useState(new Date());
  const location = useLocation();

  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setActiveDropdown(null);
  }, [location]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleDropdown = (name) => {
    if (activeDropdown === name) setActiveDropdown(null);
    else setActiveDropdown(name);
  };

  const formatDate = () => {
    const options = {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    const currentLang = localStorage.getItem("app_language") || "te";
    const langMap = { te: "te-IN", hi: "hi-IN", en: "en-US" };
    return dateTime.toLocaleDateString(
      langMap[currentLang] || "te-IN",
      options,
    );
  };

  const formatTime = () => {
    const options = { hour: "2-digit", minute: "2-digit", second: "2-digit" };
    const currentLang = localStorage.getItem("app_language") || "te";
    const langMap = { te: "te-IN", hi: "hi-IN", en: "en-US" };
    return dateTime.toLocaleTimeString(
      langMap[currentLang] || "te-IN",
      options,
    );
  };

  const navItems = [
    { name: "LATEST NEWS", path: "/latest-news", type: "link" },
    { name: "TELANGANA", type: "dropdown", data: TELANGANA_DISTRICTS },
    {
      name: "ANDHRA PRADESH",
      type: "dropdown",
      data: ANDHRA_PRADESH_DISTRICTS,
    },
    { name: "POLITICS", path: "/politics", type: "link" },
    { name: "MOVIE", path: "/movie", type: "link" },
    { name: "CRIME", path: "/crime", type: "link" },
    { name: "NATIONAL", path: "/national", type: "link" },
    { name: "INTERNATIONAL", path: "/international", type: "link" },
    { name: "SPORTS", path: "/sports", type: "link" },
    { name: "BUSINESS", path: "/business", type: "link" },
    { name: "TECHNOLOGY", path: "/technology", type: "link" },
    { name: "VIDEOS", path: "/videos", type: "link" },
    { name: "MORE", type: "dropdown", data: MORE_CATEGORIES },
  ];

  return (
    <header className="header-master">
      {/* Top Bar (Date, Time, Live TV, E-Paper, Admin Login) */}

      {/* Breaking News Marquee Ticker */}
      <BreakingTicker />
      {/* Main Brand Logo Header Row */}
      <div className="nav-main-header">
        <div className="container nav-header-container">
          <div className="brand-subtitle">
            <span className="live-bullet"></span>
            <TranslatedText>24x7 Telugu News Portal</TranslatedText>
          </div>
          <Link to="/" className="brand-logo-link">
            <img
              src={logo}
              alt="People Media Point"
              className="brand-logo-img"
            />
          </Link>
          <div className="header-right-promo">
            <Link
              to="https://www.youtube.com/@peoplemediapoint/"
              className="live-tv-qr"
              target="_blank"
            >
              <img
                src={QR}
                alt="Scan to watch People Media Point Live TV"
                width={100}
                height={100}
              />
              {/* <span>Scan to watch</span> */}
            </Link>
            <div className="header-utilities">
              <a
                href="https://www.youtube.com/@peoplemediapoint/live"
                target="_blank"
                rel="noopener noreferrer"
                className="live-tv-banner"
              >
                <Tv size={16} color="#D32F2F" />
                <div className="live-tv-text">
                  <span className="live-tv-label">LIVE TV</span>
                  {/* <span className="live-tv-sub"><TranslatedText>Watch Stream</TranslatedText></span> */}
                </div>
              </a>
              <Link
                to="/admin"
                className="top-action-btn admin-link-btn"
                aria-label="Admin login"
              >
                <User size={15} />
                {/* <span>Admin</span> */}
              </Link>
              <div>
                <div className="utility-actions">
                  {/* <div className="header-datetime">
                    <span>
                      <Calendar size={13} />
                      {formatDate()}
                    </span>
                    <span>
                      <Clock size={13} />
                      {formatTime()}
                    </span>
                  </div> */}
                  <LanguageSelector />
                </div>
              </div>
            </div>
          </div>

          <button
            className="hamburger-rtv"
            onClick={toggleMenu}
            aria-label="Toggle navigation"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <div className="nav-top-bar legacy-header-controls">
            <div className="container top-bar-content">
              <div className="top-left-info">
                <div className="date-time-item">
                  <Calendar size={13} />
                  <span>{formatDate()}</span>
                </div>
                <div className="date-time-divider">|</div>
                <div className="date-time-item">
                  <Clock size={13} />
                  <span>{formatTime()}</span>
                </div>
              </div>

              <div className="top-right-actions">
                <Link to="/admin" className="top-action-btn admin-link-btn">
                  <User size={13} />
                  <TranslatedText></TranslatedText>
                </Link>

                <LanguageSelector />
              </div>
              <button
                className="hamburger-rtv"
                onClick={toggleMenu}
                aria-label="Toggle Menu"
              >
                {isMenuOpen ? "✕" : "☰"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Category Navigation Bar */}
      <nav className="nav-category-bar">
        <div className="container category-bar-container">
          <div
            className={`nav-links-wrapper ${isMenuOpen ? "mobile-open" : ""}`}
          >
            <ul className="nav-links-list">
              <li className="nav-home-item">
                <Link to="/" className="nav-item home-link">
                  🏠 <TranslatedText>HOME</TranslatedText>
                </Link>
              </li>

              {navItems.map((item) => (
                <li
                  key={item.name}
                  className={item.type === "dropdown" ? "has-dropdown" : ""}
                >
                  {item.type === "link" ? (
                    <Link to={item.path} className="nav-item">
                      <TranslatedText>{item.name}</TranslatedText>
                    </Link>
                  ) : (
                    <div className="dropdown-wrapper">
                      <button
                        className="nav-item dropdown-toggle"
                        onClick={() => handleDropdown(item.name)}
                      >
                        <TranslatedText>{item.name}</TranslatedText>
                        <span className="arrow-down">▼</span>
                      </button>
                      <ul
                        className={`dropdown-menu ${activeDropdown === item.name ? "show" : ""}`}
                      >
                        {item.data.map((subItem) => (
                          <li key={subItem}>
                            <Link
                              to={`/${item.name.toLowerCase().replace(/\s+/g, "-")}/${subItem.toLowerCase().replace(/\s+/g, "-")}`}
                            >
                              <TranslatedText>{subItem}</TranslatedText>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
