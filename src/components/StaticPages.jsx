import React, { useState } from 'react';
import TranslatedText from './TranslatedText';
import SEO from './SEO';
import { Mail, Phone, MapPin, Send, CheckCircle2, Shield, Users, Globe, Award, Tv, Newspaper, Clock } from 'lucide-react';

export const AboutUs = () => (
  <div className="static-page-wrapper">
    <SEO
      title="About Us - People Media Point"
      description="Learn about People Media Point, a dynamic and fast-growing 24x7 media organization committed to delivering credible news."
    />

    {/* Page Header Hero */}
    <div className="static-hero-banner">
      <div className="container">
        <span className="static-hero-badge">
          <Shield size={14} />
          <TranslatedText>CREDIBLE JOURNALISM SINCE 2020</TranslatedText>
        </span>
        <h1><TranslatedText>About People Media Point</TranslatedText></h1>
        <p className="hero-subtitle">
          <TranslatedText>Empowering audiences with accurate, timely, and unbiased news across print and digital media.</TranslatedText>
        </p>
      </div>
    </div>

    <div className="container static-content-body">
      {/* Company Intro Card */}
      <div className="info-card-block">
        <h2 className="section-heading">
          <span className="red-indicator"></span>
          <TranslatedText>Who We Are</TranslatedText>
        </h2>
        <p className="lead-text">
          <TranslatedText>
            People Media Point Network is a dynamic and fast-growing media organization committed to delivering credible, impactful, and audience-driven journalism across multiple platforms. Established in 2020, the company has steadily expanded its presence in both print and electronic media, building a diverse portfolio of regional and multilingual content.
          </TranslatedText>
        </p>
        <p className="body-text">
          <TranslatedText>
            In the print segment, People Media Point publishes People Media Point Daily, a newspaper focused on delivering timely, accurate, and community-relevant news to Telugu-speaking audiences nationwide.
          </TranslatedText>
        </p>
      </div>

      {/* Network & Channels Grid */}
      <div className="network-grid-section">
        <h2 className="section-heading">
          <span className="red-indicator"></span>
          <TranslatedText>Our Media Network</TranslatedText>
        </h2>
        <div className="cards-grid-4">
          <div className="network-card">
            <div className="net-icon"><Tv size={26} /></div>
            <h3><TranslatedText>People Media Point Telugu</TranslatedText></h3>
            <p><TranslatedText>24x7 Breaking news, Andhra Pradesh & Telangana district updates, politics, and cinema.</TranslatedText></p>
          </div>
          <div className="network-card">
            <div className="net-icon"><Globe size={26} /></div>
            <h3><TranslatedText>People Media Point Kannada</TranslatedText></h3>
            <p><TranslatedText>Dedicated regional coverage for Karnataka and national highlights.</TranslatedText></p>
          </div>
          <div className="network-card">
            <div className="net-icon"><Award size={26} /></div>
            <h3><TranslatedText>People Media Point Marathi</TranslatedText></h3>
            <p><TranslatedText>Reliable news reporting across Maharashtra and West India.</TranslatedText></p>
          </div>
          <div className="network-card">
            <div className="net-icon"><Newspaper size={26} /></div>
            <h3><TranslatedText>People Media Point Health</TranslatedText></h3>
            <p><TranslatedText>Expert medical advice, wellness news, and public health bulletins.</TranslatedText></p>
          </div>
        </div>
      </div>

      {/* Leadership Section */}
      <div className="leadership-section">
        <h2 className="section-heading">
          <span className="red-indicator"></span>
          <TranslatedText>Executive Leadership</TranslatedText>
        </h2>
        <div className="leaders-grid">
          <div className="leader-card">
            <div className="leader-avatar">
              <Users size={32} />
            </div>
            <h3>Anu Sharma</h3>
            <span className="leader-role"><TranslatedText>Chairman</TranslatedText></span>
            <p><TranslatedText>Provides strategic direction and drives the organization’s long-term media vision and global expansion.</TranslatedText></p>
          </div>

          <div className="leader-card">
            <div className="leader-avatar">
              <Users size={32} />
            </div>
            <h3>Shahkir Shaik</h3>
            <span className="leader-role"><TranslatedText>Director</TranslatedText></span>
            <p><TranslatedText>Oversees daily news operations, broadcast technology, and regional news bureau growth.</TranslatedText></p>
          </div>

          <div className="leader-card">
            <div className="leader-avatar">
              <Users size={32} />
            </div>
            <h3>Khizar Hayath</h3>
            <span className="leader-role"><TranslatedText>Director</TranslatedText></span>
            <p><TranslatedText>Contributes to governance, operational excellence, and audience outreach initiatives.</TranslatedText></p>
          </div>
        </div>
      </div>

      {/* Core Values Banner */}
      <div className="values-banner">
        <h3><TranslatedText>Our Core Values</TranslatedText></h3>
        <div className="values-list">
          <div className="val-item">
            <CheckCircle2 size={18} color="#D32F2F" />
            <span><TranslatedText>100% Unbiased & Verified Reporting</TranslatedText></span>
          </div>
          <div className="val-item">
            <CheckCircle2 size={18} color="#D32F2F" />
            <span><TranslatedText>24x7 Real-Time Breaking Updates</TranslatedText></span>
          </div>
          <div className="val-item">
            <CheckCircle2 size={18} color="#D32F2F" />
            <span><TranslatedText>Empowering Regional & District Voices</TranslatedText></span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const ContactUs = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 4000);
  };

  return (
    <div className="static-page-wrapper">
      <SEO
        title="Contact Us - People Media Point"
        description="Get in touch with People Media Point newsroom. Reach out via email, phone, or visit our Hyderabad office."
      />

      <div className="static-hero-banner contact-hero">
        <div className="container">
          <span className="static-hero-badge">
            <Mail size={14} />
            <TranslatedText>GET IN TOUCH WITH OUR NEWS DESK</TranslatedText>
          </span>
          <h1><TranslatedText>Contact Us</TranslatedText></h1>
          <p className="hero-subtitle">
            <TranslatedText>Have a news tip, query, or feedback? Our newsroom team is available 24/7.</TranslatedText>
          </p>
        </div>
      </div>

      <div className="container static-content-body">
        <div className="contact-main-grid">
          {/* Contact Details Column */}
          <div className="contact-info-col">
            <h2 className="section-heading">
              <span className="red-indicator"></span>
              <TranslatedText>Headquarters & Contact Info</TranslatedText>
            </h2>

            <div className="contact-cards-stack">
              <div className="contact-item-card">
                <div className="contact-icon-box"><MapPin size={22} /></div>
                <div className="contact-text-box">
                  <h4><TranslatedText>Office Address</TranslatedText></h4>
                  <p>
                    <TranslatedText>People Media Point Network, 1st Floor, Amrutha Mall, Somajiguda Circle, Rajbhavan Road, Eureka court complex, B9, 3rd floor, beside image hospital, Ameerpet, hyderabad.</TranslatedText>
                  </p>
                </div>
              </div>

              <div className="contact-item-card">
                <div className="contact-icon-box"><Phone size={22} /></div>
                <div className="contact-text-box">
                  <h4><TranslatedText>Phone & Newsroom</TranslatedText></h4>
                  <p>+918886166565</p>
                </div>
              </div>

              <div className="contact-item-card">
                <div className="contact-icon-box"><Mail size={22} /></div>
                <div className="contact-text-box">
                  <h4><TranslatedText>Email Address</TranslatedText></h4>
                  <p>psrnewschannel@gmail.com</p>
                </div>
              </div>

              <div className="contact-item-card">
                <div className="contact-icon-box"><Clock size={22} /></div>
                <div className="contact-text-box">
                  <h4><TranslatedText>Working Hours</TranslatedText></h4>
                  <p><TranslatedText>24 Hours / 7 Days Newsdesk Operations</TranslatedText></p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Form Column */}
          <div className="contact-form-col">
            <div className="form-card-wrapper">
              <h3><TranslatedText>Send Us a Direct Message</TranslatedText></h3>
              <p className="form-sub-text"><TranslatedText>Fill out the form below and our editorial desk will respond promptly.</TranslatedText></p>

              {submitted && (
                <div className="success-toast">
                  <CheckCircle2 size={20} />
                  <span><TranslatedText>Thank you! Your message has been sent to our news desk.</TranslatedText></span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="contact-form-element">
                <div className="form-row-2">
                  <div className="form-group-item">
                    <label><TranslatedText>Full Name</TranslatedText></label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Kumar"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="form-group-item">
                    <label><TranslatedText>Email Address</TranslatedText></label>
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group-item">
                  <label><TranslatedText>Subject</TranslatedText></label>
                  <input
                    type="text"
                    required
                    placeholder="News Tip / Query / Feedback"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  />
                </div>

                <div className="form-group-item">
                  <label><TranslatedText>Message</TranslatedText></label>
                  <textarea
                    rows="5"
                    required
                    placeholder="Write your message or news details here..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  ></textarea>
                </div>

                <button type="submit" className="contact-submit-btn">
                  <Send size={16} />
                  <span><TranslatedText>Send Message</TranslatedText></span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const PrivacyPolicy = () => (
  <div className="static-page-wrapper">
    <SEO title="Privacy Policy" description="People Media Point Privacy Policy. Learn how we collect, use, and protect your personal information." />

    <div className="static-hero-banner">
      <div className="container">
        <h1><TranslatedText>Privacy Policy</TranslatedText></h1>
        <p className="hero-subtitle"><TranslatedText>Your privacy is critically important to us.</TranslatedText></p>
      </div>
    </div>

    <div className="container static-content-body">
      <div className="info-card-block">
        <p className="lead-text">
          <TranslatedText>This privacy policy explains how People Media Point collects, uses, and protects your personal information when you visit our website. We do not sell your personal data to third parties.</TranslatedText>
        </p>
        <h3 className="sub-heading"><TranslatedText>1. Data Collection</TranslatedText></h3>
        <p className="body-text">
          <TranslatedText>We only collect the information necessary to provide you with news updates, newsletters, or respond to your inquiries. This includes browser cache data for user language preference (Telugu, English, Hindi).</TranslatedText>
        </p>

        <h3 className="sub-heading"><TranslatedText>2. Security</TranslatedText></h3>
        <p className="body-text">
          <TranslatedText>We utilize industry-standard encryption protocols and secure database connections to protect user data against unauthorized access.</TranslatedText>
        </p>
      </div>
    </div>
  </div>
);

export const TermsOfService = () => (
  <div className="static-page-wrapper">
    <SEO title="Terms of Service" description="People Media Point Terms of Service. Read the rules and guidelines for using our platform." />

    <div className="static-hero-banner">
      <div className="container">
        <h1><TranslatedText>Terms of Service</TranslatedText></h1>
        <p className="hero-subtitle"><TranslatedText>Guidelines and rules governing the use of People Media Point portal.</TranslatedText></p>
      </div>
    </div>

    <div className="container static-content-body">
      <div className="info-card-block">
        <p className="lead-text">
          <TranslatedText>By accessing and using People Media Point, you accept and agree to be bound by the terms and provisions of this agreement.</TranslatedText>
        </p>
        <h3 className="sub-heading"><TranslatedText>1. Intellectual Property</TranslatedText></h3>
        <p className="body-text">
          <TranslatedText>All original news articles, videos, graphics, and branding are copyright protected property of People Media Point Network.</TranslatedText>
        </p>

        <h3 className="sub-heading"><TranslatedText>2. Acceptable Use</TranslatedText></h3>
        <p className="body-text">
          <TranslatedText>Users must not misuse the portal or post unlawful content in public comments or contact submissions.</TranslatedText>
        </p>
      </div>
    </div>
  </div>
);
