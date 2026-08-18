import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import TranslatedText from './TranslatedText';
import { Shield, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer-rtv">
      <div className="container">
        <div className="footer-grid">
          {/* Col 1: Brand Info */}
          <div className="footer-col brand-col">
            <Link to="/" className="footer-logo-link">
              <img src={logo} alt="People Media Point" className="footer-logo-img" />
            </Link>
            <p className="footer-brand-desc">
              <TranslatedText>
                People Media Point is your trusted 24x7 Telugu news destination bringing real-time breaking news, politics, district updates, cinema buzz, and sports.
              </TranslatedText>
            </p>
            <div className="footer-social-icons">
              <a
                href="https://www.youtube.com/@peoplemediapoint"
                target="_blank"
                rel="noopener noreferrer"
                className="social-btn youtube"
                title="YouTube"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                </svg>
              </a>
              <a
                href="https://www.instagram.com/peoplemediapoint/"
                target="_blank"
                rel="noopener noreferrer"
                className="social-btn instagram"
                title="Instagram"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a
                href="https://www.facebook.com/p/People-Media-Point-61567337791194/"
                target="_blank"
                rel="noopener noreferrer"
                className="social-btn facebook"
                title="Facebook"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div className="footer-col">
            <h4 className="footer-heading">
              <span className="heading-line"></span>
              <TranslatedText>Categories</TranslatedText>
            </h4>
            <ul className="footer-links-list">
              <li><Link to="/latest-news"><TranslatedText>Latest News</TranslatedText></Link></li>
              <li><Link to="/telangana"><TranslatedText>Telangana News</TranslatedText></Link></li>
              <li><Link to="/andhra-pradesh"><TranslatedText>Andhra Pradesh</TranslatedText></Link></li>
              <li><Link to="/politics"><TranslatedText>Politics</TranslatedText></Link></li>
              <li><Link to="/movie"><TranslatedText>Cinema Buzz</TranslatedText></Link></li>
              <li><Link to="/crime"><TranslatedText>Crime Radar</TranslatedText></Link></li>
              <li><Link to="/sports"><TranslatedText>Sports</TranslatedText></Link></li>
              <li><Link to="/technology"><TranslatedText>Technology</TranslatedText></Link></li>
            </ul>
          </div>

          {/* Col 3: Quick Links & Company */}
          <div className="footer-col">
            <h4 className="footer-heading">
              <span className="heading-line"></span>
              <TranslatedText>Quick Links</TranslatedText>
            </h4>
            <ul className="footer-links-list">
              <li><Link to="/about"><TranslatedText>About Us</TranslatedText></Link></li>
              <li><Link to="/contact"><TranslatedText>Contact Us</TranslatedText></Link></li>
              <li><Link to="/privacy"><TranslatedText>Privacy Policy</TranslatedText></Link></li>
              <li><Link to="/terms"><TranslatedText>Terms of Service</TranslatedText></Link></li>
              <li><Link to="/admin" className="highlight-admin"><Shield size={13} /> <TranslatedText>Admin Portal</TranslatedText></Link></li>
            </ul>
          </div>

          {/* Col 4: Contact Info */}
          <div className="footer-col">
            <h4 className="footer-heading">
              <span className="heading-line"></span>
              <TranslatedText>Contact Info</TranslatedText>
            </h4>
            <ul className="footer-links-list" style={{ gap: '0.8rem' }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.85rem', lineHeight: '1.4' }}>
                <MapPin size={16} style={{ flexShrink: 0, marginTop: '2px', color: '#D32F2F' }} />
                <span>Eureka court complex, B9, 3rd floor, beside image hospital, Ameerpet, hyderabad.</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                <Phone size={14} style={{ color: '#D32F2F' }} />
                <span>+918886166565</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                <Mail size={14} style={{ color: '#D32F2F' }} />
                <span>psrnewschannel@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom-bar">
          <p>© 2026 People Media Point. <TranslatedText>All rights reserved.</TranslatedText></p>
          <div className="footer-legal-mini">
            <Link to="/privacy"><TranslatedText>Privacy</TranslatedText></Link>
            <span>•</span>
            <Link to="/terms"><TranslatedText>Terms</TranslatedText></Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .footer-rtv {
          background: #0A192F;
          color: #94A3B8;
          padding: 3.5rem 0 1.5rem;
          border-top: 4px solid #D32F2F;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr 1.2fr;
          gap: 2.5rem;
          margin-bottom: 2.5rem;
        }

        .brand-col {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .footer-logo-img {
          height: 82px;
          width: auto;
          object-fit: contain;
        }

        .footer-brand-desc {
          font-size: 0.85rem;
          line-height: 1.6;
          color: #CBD5E1;
        }

        .footer-social-icons {
          display: flex;
          gap: 10px;
          margin-top: 0.5rem;
        }

        .social-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(255,255,255,0.08);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.25s;
          text-decoration: none;
        }

        .social-btn.youtube:hover { background: #FF0000; color: white; transform: translateY(-2px); }
        .social-btn.instagram:hover { background: #E1306C; color: white; transform: translateY(-2px); }
        .social-btn.facebook:hover { background: #1877F2; color: white; transform: translateY(-2px); }

        .footer-heading {
          color: #FFFFFF;
          font-size: 1rem;
          font-weight: 800;
          margin-bottom: 1.2rem;
          display: flex;
          align-items: center;
          gap: 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .heading-line {
          width: 4px;
          height: 16px;
          background: #D32F2F;
          border-radius: 2px;
          display: inline-block;
        }

        .footer-links-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        .footer-links-list a {
          color: #94A3B8;
          text-decoration: none;
          font-size: 0.88rem;
          font-weight: 500;
          transition: color 0.2s, padding-left 0.2s;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        .footer-links-list a:hover {
          color: #FFFFFF;
          padding-left: 4px;
        }

        .highlight-admin {
          color: #F59E0B !important;
          font-weight: 700 !important;
        }

        .footer-service-text {
          font-size: 0.85rem;
          line-height: 1.5;
          margin-bottom: 1rem;
          color: #94A3B8;
        }

        .footer-epaper-btn {
          background: #D32F2F;
          color: white;
          text-decoration: none;
          padding: 10px 16px;
          border-radius: 6px;
          font-weight: 700;
          font-size: 0.85rem;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: background 0.2s;
        }

        .footer-epaper-btn:hover {
          background: #B71C1C;
        }

        .footer-bottom-bar {
          border-top: 1px solid rgba(255,255,255,0.08);
          padding-top: 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.8rem;
          color: #64748B;
        }

        .footer-legal-mini {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .footer-legal-mini a {
          color: #64748B;
          text-decoration: none;
          transition: color 0.2s;
        }

        .footer-legal-mini a:hover {
          color: white;
        }

        /* Fully Responsive Mobile Breakpoints */
        @media (max-width: 992px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
          }
        }

        @media (max-width: 576px) {
          .footer-rtv {
            padding: 2.5rem 0 1.2rem;
          }

          .footer-grid {
            grid-template-columns: 1fr;
            gap: 1.8rem;
          }

          .footer-logo-img {
            height: 60px;
          }

          .footer-bottom-bar {
            flex-direction: column;
            gap: 10px;
            text-align: center;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
