import { useState } from "react";
import { Search } from "./Search";
import { Tabs } from "./Tabs";
import darkLogo from "../assets/logo-white.svg";

export function Header({ children, defaultTab }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="modern-header">
      <div className="header-container">
        {/* Logo Section */}
        <div className="header-logo-section" onClick={() => window.location.href = '/home'}>
          <div className="logo-wrapper">
            <img src={darkLogo} height={50} width={50} alt="Solidify Logo " className="header-logo" />
            <div className="logo-glow"></div>
          </div>
          {/* <div className="brand-text-wrapper">
            <span className="header-brand-name">Solidify</span>
            <span className="brand-tagline">Net Zero Journey</span>
          </div> */}
        </div>

        {/* Search Bar - Desktop */}
        <div className="header-search-desktop">
          <Search />
        </div>

        {/* Navigation Tabs */}
        <div className="header-nav-section">
          <Tabs defaultTab={defaultTab} />
        </div>

        {/* Profile Section */}
        <div className="header-profile-section">
          {children}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className="material-symbols-outlined">
            {isMobileMenuOpen ? "close" : "menu"}
          </span>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu">
          <div className="mobile-search">
            <Search />
          </div>
          <div className="mobile-tabs">
            <Tabs defaultTab={defaultTab} />
          </div>
        </div>
      )}
    </header>
  );
}
