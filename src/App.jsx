import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CategoryPage from './components/CategoryPage';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import AddNews from './components/AddNews';
import ArticleDetail from './components/ArticleDetail';
import { AboutUs, ContactUs, PrivacyPolicy, TermsOfService } from './components/StaticPages';
import ScrollToTop from './components/ScrollToTop';
import './index.css';

function App() {
  return (
    <HelmetProvider>
      <LanguageProvider>
        <ScrollToTop />
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<CategoryPage />} />
              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/add-news" element={<AddNews />} />
              <Route path="/article/:id" element={<ArticleDetail />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/:categoryId" element={<CategoryPage />} />
              <Route path="/:categoryId/:districtId" element={<CategoryPage />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </LanguageProvider>
    </HelmetProvider>
  );
}

export default App;
