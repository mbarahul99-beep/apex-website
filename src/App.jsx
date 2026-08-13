import React, { useState, useEffect } from 'react';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { dbService } from './services/dbService';
import { isDefault } from './services/firebase';
import './css/main.css';
import './css/admin.css';

// SVG Icons as React Components
const IconPhone = () => <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.387a12.035 12.035 0 01-7.108-7.108c-.155-.44.01-1.09.387-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.11-1.008H4.5a2.25 2.25 0 00-2.25 2.25v1.372z" /></svg>;
const IconHome = () => <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>;
const IconBook = () => <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18c-2.305 0-4.408.867-6 2.292m0-14.25v14.25" /></svg>;
const IconShare = () => <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186l.965.543m-.965-.543a2.25 2.25 0 011.696-2.203m0 0l.967.544M11.686 9.25a2.25 2.25 0 103.098-3.098m-3.098 3.098l-.967-.544m0 0a2.25 2.25 0 00-1.696 2.203m0 0l-.965-.543m0 0a2.25 2.25 0 01-1.696 2.203" /></svg>;
const IconChevronRight = () => <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>;
const IconPlay = () => <svg fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>;
const IconClose = () => <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>;
const IconMenu = () => <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>;
const IconPlus = () => <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>;
const IconEdit = () => <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>;
const IconTrash = () => <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>;
const IconExternalLink = () => <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>;
const IconCheck = () => <svg fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>;
const IconStar = () => <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499c.195-.561.97-.561 1.165 0l2.22 6.47a.75.75 0 00.713.518h6.82c.594 0 .84.766.36 1.137l-5.518 4.01a.75.75 0 00-.273.84l2.22 6.47c.196.56-.445 1.028-.941.666l-5.518-4.01a.75.75 0 00-.882 0l-5.518 4.01c-.496.362-1.137-.166-.941-.666l2.22-6.47a.75.75 0 00-.273-.84l-5.518-4.01c-.48-.37-.234-1.137.36-1.137h6.82a.75.75 0 00.713-.518l2.22-6.47z" /></svg>;
const IconUser = () => <svg fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [settings, setSettings] = useState(dbService.getSettings());
  const [isInitializing, setIsInitializing] = useState(true);
  
  // Modals state
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const [selectedCourseForEnquiry, setSelectedCourseForEnquiry] = useState(null);
  const [videoModalUrl, setVideoModalUrl] = useState(null);
  const [selectedCourseDetails, setSelectedCourseDetails] = useState(null);

  // Initialize database preloads at startup
  useEffect(() => {
    dbService.init().then(() => {
      setSettings(dbService.getSettings());
      setIsInitializing(false);
    });
  }, []);

  // Sync with browser navigation
  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
      if (window.location.pathname.startsWith('/admin')) {
        document.body.classList.add('admin-mode');
      } else {
        document.body.classList.remove('admin-mode');
      }
    };
    
    window.addEventListener('popstate', handleLocationChange);
    handleLocationChange();
    
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  const navigate = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    if (path.startsWith('/admin')) {
      document.body.classList.add('admin-mode');
    } else {
      document.body.classList.remove('admin-mode');
    }
    window.scrollTo(0, 0);
  };

  const openEnquiry = (course = null) => {
    setSelectedCourseForEnquiry(course);
    setEnquiryModalOpen(true);
  };

  // Route router logic
  let viewComponent;
  let isStudentView = true;

  if (currentPath === '/' || currentPath === '/home') {
    viewComponent = (
      <HomeView 
        settings={settings} 
        navigate={navigate} 
        openEnquiry={openEnquiry} 
        setVideoModalUrl={setVideoModalUrl}
        setSelectedCourseDetails={setSelectedCourseDetails}
      />
    );
  } else if (currentPath === '/courses') {
    viewComponent = (
      <CoursesListView 
        navigate={navigate} 
        openEnquiry={openEnquiry}
        setSelectedCourseDetails={setSelectedCourseDetails}
      />
    );
  } else if (currentPath === '/online-prep' || currentPath === '/student-portal') {
    viewComponent = (
      <OnlinePrepView 
        navigate={navigate} 
        openEnquiry={openEnquiry}
      />
    );
  } else if (currentPath === '/scholarships') {
    viewComponent = (
      <ScholarshipView 
        navigate={navigate} 
        openEnquiry={openEnquiry}
      />
    );
  } else if (currentPath === '/results') {
    viewComponent = (
      <AllResultsView 
        navigate={navigate} 
      />
    );
  } else if (currentPath === '/blogs') {
    viewComponent = (
      <AllBlogsView 
        navigate={navigate} 
      />
    );
  } else if (currentPath.startsWith('/pages/')) {
    const slug = currentPath.substring(7);
    viewComponent = <DynamicPageView slug={slug} navigate={navigate} />;
  } else if (currentPath.startsWith('/posts/')) {
    const slug = currentPath.substring(7);
    viewComponent = <DynamicPostView slug={slug} navigate={navigate} />;
  } else if (currentPath.startsWith('/admin')) {
    isStudentView = false;
    viewComponent = <AdminPanel navigate={navigate} />;
  } else {
    viewComponent = (
      <HomeView 
        settings={settings} 
        navigate={navigate} 
        openEnquiry={openEnquiry} 
        setVideoModalUrl={setVideoModalUrl}
        setSelectedCourseDetails={setSelectedCourseDetails}
      />
    );
  }
  if (isInitializing) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0a192f', color: '#fff', fontFamily: 'sans-serif' }}>
        <img src="/logo.png" alt="APEX" style={{ height: '70px', marginBottom: '20px', animation: 'pulse 1.5s infinite ease-in-out' }} onError={e => e.target.style.display = 'none'} />
        <div className="spinner" style={{ border: '3px solid rgba(255,255,255,0.1)', width: '40px', height: '40px', borderRadius: '50%', borderLeftColor: '#0070f3', animation: 'spin 1s linear infinite' }}></div>
        <p style={{ marginTop: '15px', fontSize: '0.9rem', color: '#8892b0' }}>Connecting securely to database...</p>
        <style>{`
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          @keyframes pulse { 0%, 100% { opacity: 0.6; transform: scale(0.95); } 50% { opacity: 1; transform: scale(1); } }
        `}</style>
      </div>
    );
  }

  return (
    <HelmetProvider>
      <div className="app-root-wrapper">
        {isStudentView ? (
          <StudentLayout 
            settings={settings} 
            navigate={navigate} 
            currentPath={currentPath}
            openEnquiry={openEnquiry}
          >
            {viewComponent}
          </StudentLayout>
        ) : (
          viewComponent
        )}

        {videoModalUrl && (
          <div className="modal-backdrop" onClick={() => setVideoModalUrl(null)}>
            <div className="modal-content" style={{ maxWidth: '600px', width: '95%' }} onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <span className="modal-title">Student success testimonial video</span>
                <button className="modal-close" onClick={() => setVideoModalUrl(null)}><IconClose /></button>
              </div>
              <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                <iframe
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                  src={videoModalUrl}
                  title="Testimonial Player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        )}

        {enquiryModalOpen && (
          <EnquiryModal 
            selectedCourse={selectedCourseForEnquiry} 
            onClose={() => setEnquiryModalOpen(false)}
          />
        )}

        {selectedCourseDetails && (
          <div className="modal-backdrop" onClick={() => setSelectedCourseDetails(null)}>
            <div className="modal-content" style={{ maxWidth: '550px', width: '95%' }} onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <span className="modal-title">{selectedCourseDetails.title} Curriculum Details</span>
                <button className="modal-close" onClick={() => setSelectedCourseDetails(null)}><IconClose /></button>
              </div>
              <div className="modal-body" style={{ padding: '20px', maxHeight: '75vh', overflowY: 'auto' }}>
                {selectedCourseDetails.showImage !== false && selectedCourseDetails.image && (
                  <img 
                    src={selectedCourseDetails.image} 
                    alt={selectedCourseDetails.title} 
                    style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: 'var(--radius-md)', marginBottom: '15px' }} 
                  />
                )}
                
                <h3 style={{ color: 'var(--navy-dark)', fontFamily: 'var(--font-family)', fontSize: '1.2rem', marginBottom: '12px', fontWeight: 700 }}>
                  {selectedCourseDetails.title}
                </h3>
                
                {selectedCourseDetails.showDetails !== false && selectedCourseDetails.details && (
                  <p style={{ fontSize: '0.9rem', color: 'var(--dark-gray)', lineHeight: '1.6', marginBottom: '20px' }}>
                    {selectedCourseDetails.details}
                  </p>
                )}

                <div style={{ backgroundColor: '#f8fafc', padding: '15px', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                  {selectedCourseDetails.showTarget !== false && selectedCourseDetails.target && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                      <span style={{ fontWeight: 600, color: 'var(--light-gray)' }}>Target Group:</span>
                      <span style={{ color: 'var(--navy-dark)', fontWeight: 500 }}>{selectedCourseDetails.target}</span>
                    </div>
                  )}
                  {selectedCourseDetails.showBoards !== false && selectedCourseDetails.boards && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                      <span style={{ fontWeight: 600, color: 'var(--light-gray)' }}>Board Prep:</span>
                      <span style={{ color: 'var(--navy-dark)', fontWeight: 500 }}>{selectedCourseDetails.boards}</span>
                    </div>
                  )}
                  {selectedCourseDetails.showDuration !== false && selectedCourseDetails.duration && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                      <span style={{ fontWeight: 600, color: 'var(--light-gray)' }}>Course Duration:</span>
                      <span style={{ color: 'var(--navy-dark)', fontWeight: 500 }}>{selectedCourseDetails.duration}</span>
                    </div>
                  )}
                  {selectedCourseDetails.showSchedule !== false && selectedCourseDetails.schedule && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                      <span style={{ fontWeight: 600, color: 'var(--light-gray)' }}>Weekly Schedule:</span>
                      <span style={{ color: 'var(--navy-dark)', fontWeight: 500 }}>{selectedCourseDetails.schedule}</span>
                    </div>
                  )}
                  {selectedCourseDetails.showFee !== false && selectedCourseDetails.fee && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', borderTop: '1px solid #e2e8f0', paddingTop: '8px', marginTop: '4px' }}>
                      <span style={{ fontWeight: 700, color: 'var(--navy-dark)' }}>Registration Fee:</span>
                      <span style={{ color: 'var(--primary-blue)', fontWeight: 800 }}>₹ {selectedCourseDetails.fee.toLocaleString()}</span>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button 
                    className="courses-action-btn"
                    style={{ flex: 1, padding: '12px', fontSize: '0.9rem', width: '100%' }}
                    onClick={() => {
                      openEnquiry(selectedCourseDetails);
                      setSelectedCourseDetails(null);
                    }}
                  >
                    Enquire / Enroll Now
                  </button>
                  <button 
                    className="courses-action-btn secondary"
                    style={{ padding: '12px 20px', fontSize: '0.9rem', width: 'auto', backgroundColor: '#e2e8f0', color: 'var(--dark-gray)', border: 'none' }}
                    onClick={() => setSelectedCourseDetails(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </HelmetProvider>
  );
}

// ---------------- STUDENT LAYOUT WRAPPER ----------------
function StudentLayout({ children, settings, navigate, currentPath, openEnquiry }) {
  const [scrollTopVisible, setScrollTopVisible] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [customPages, setCustomPages] = useState([]);

  useEffect(() => {
    setCustomPages(dbService.getPages());
  }, [currentPath]);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setScrollTopVisible(true);
      } else {
        setScrollTopVisible(false);
      }
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const handleWhatsApp = () => {
    const formattedPhone = settings.phone.replace(/[^0-9]/g, '');
    const url = `https://wa.me/91${formattedPhone}?text=${encodeURIComponent(settings.whatsappText)}`;
    window.open(url, '_blank');
  };

  const handleCall = () => {
    window.open(`tel:${settings.phone}`, '_self');
  };

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-container">
      <Helmet>
        <title>{settings.instituteName} - IIT-JEE & NEET Coaching</title>
        <meta name="description" content={settings.tagline + ' located at ' + settings.address} />
        <meta name="keywords" content="apex institute jind, iit-jee coaching, neet preparation, foundations tuitions, cbse board classes, hbse haryana coaching" />
        <link rel="canonical" href={window.location.origin + currentPath} />
      </Helmet>

      {/* Navigation Header */}
      <header className="header">
        <div className="header-inner">
          <div className="header-left" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
            {settings.logoUrl && (
              <img 
                src={settings.logoUrl} 
                className="header-logo-icon" 
                alt="Logo Icon" 
                fetchPriority="high"
                loading="eager"
                style={{ 
                  height: settings.logoIconHeight || '44px',
                  width: 'auto',
                  objectFit: 'contain'
                }} 
                onError={(e) => { e.target.style.display = 'none'; }} 
              />
            )}
            {settings.logoNameUrl && (
              <img 
                src={settings.logoNameUrl} 
                className="header-logo-text" 
                alt={settings.instituteName} 
                fetchPriority="high"
                loading="eager"
                style={{ 
                  width: settings.logoWidth || '180px',
                  height: settings.logoHeight || '45px',
                  objectFit: 'contain'
                }} 
                onError={(e) => { e.target.style.display = 'none'; }} 
              />
            )}
          </div>
          
          <div className="header-right">
            {/* Desktop Navigation Links */}
            <nav className="desktop-nav">
              <span className={`desktop-nav-link ${currentPath === '/' || currentPath === '/home' ? 'active' : ''}`} onClick={() => navigate('/')}>Home</span>
              <span className={`desktop-nav-link ${currentPath === '/courses' ? 'active' : ''}`} onClick={() => navigate('/courses')}>Courses</span>
              <span className={`desktop-nav-link ${currentPath === '/scholarships' ? 'active' : ''}`} onClick={() => navigate('/scholarships')}>Scholarships</span>
              <span className={`desktop-nav-link ${currentPath === '/online-prep' || currentPath === '/student-portal' ? 'active' : ''}`} onClick={() => navigate('/online-prep')}>Online Prep</span>
              <span className={`desktop-nav-link ${currentPath === '/blogs' ? 'active' : ''}`} onClick={() => navigate('/blogs')}>Blogs</span>
              <span className={`desktop-nav-link ${currentPath === '/pages/about-apex-jind' ? 'active' : ''}`} onClick={() => navigate('/pages/about-apex-jind')}>About Us</span>
              
              {customPages.filter(p => p.slug !== 'about-apex-jind').length > 0 && (
                <div className="nav-dropdown-wrapper" style={{ position: 'relative', display: 'inline-block' }}>
                  <span className="desktop-nav-link" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    Pages
                    <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ width: '12px', height: '12px' }}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                  </span>
                  <div className="nav-dropdown-menu">
                    {customPages.filter(p => p.slug !== 'about-apex-jind').map(page => (
                      <a 
                        key={page.id} 
                        onClick={() => navigate(`/pages/${page.slug}`)}
                        style={{ 
                          display: 'block', 
                          padding: '8px 16px', 
                          fontSize: '0.88rem', 
                          color: 'var(--navy-dark)', 
                          cursor: 'pointer', 
                          whiteSpace: 'nowrap', 
                          transition: 'background 0.2s',
                          fontFamily: 'var(--font-family)',
                          fontWeight: 500
                        }}
                        className="nav-dropdown-item"
                      >
                        {page.title}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </nav>
            
            <button className="header-btn" onClick={handleCall}>
              <IconPhone />
            </button>
            <button 
              className="header-btn" 
              onClick={() => window.open(settings.examPortalUrl || 'https://app.instituteapex.in?app=student', '_blank')} 
              title="Student Exam Portal"
            >
              <IconUser />
            </button>
            {/* Hamburger Menu Toggle (Mobile Only) */}
            <button 
              className="header-btn mobile-menu-toggle-btn" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              title="Toggle Menu"
            >
              {mobileMenuOpen ? <IconClose /> : <IconMenu />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation Overlay */}
      {mobileMenuOpen && (
        <div className="mobile-drawer-overlay" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-drawer" onClick={e => e.stopPropagation()}>
            <div className="mobile-drawer-header">
              <span style={{ fontWeight: 800, color: 'var(--navy-blue)', fontSize: '1.1rem' }}>APEX PORTAL</span>
              <button className="close-drawer-btn" onClick={() => setMobileMenuOpen(false)}>×</button>
            </div>
            <nav className="mobile-drawer-nav">
              <span className={`mobile-nav-link ${currentPath === '/' || currentPath === '/home' ? 'active' : ''}`} onClick={() => { navigate('/'); setMobileMenuOpen(false); }}>Home</span>
              <span className={`mobile-nav-link ${currentPath === '/courses' ? 'active' : ''}`} onClick={() => { navigate('/courses'); setMobileMenuOpen(false); }}>Courses</span>
              <span className={`mobile-nav-link ${currentPath === '/scholarships' ? 'active' : ''}`} onClick={() => { navigate('/scholarships'); setMobileMenuOpen(false); }}>Scholarships</span>
              <span className={`mobile-nav-link ${currentPath === '/online-prep' || currentPath === '/student-portal' ? 'active' : ''}`} onClick={() => { navigate('/online-prep'); setMobileMenuOpen(false); }}>Online Prep</span>
              <span className={`mobile-nav-link ${currentPath === '/blogs' ? 'active' : ''}`} onClick={() => { navigate('/blogs'); setMobileMenuOpen(false); }}>Blogs</span>
              <span className={`mobile-nav-link ${currentPath === '/pages/about-apex-jind' ? 'active' : ''}`} onClick={() => { navigate('/pages/about-apex-jind'); setMobileMenuOpen(false); }}>About Us</span>
              {customPages.filter(p => p.slug !== 'about-apex-jind').map(page => (
                <span 
                  key={page.id}
                  className={`mobile-nav-link ${currentPath === `/pages/${page.slug}` ? 'active' : ''}`} 
                  onClick={() => { navigate(`/pages/${page.slug}`); setMobileMenuOpen(false); }}
                >
                  {page.title}
                </span>
              ))}
            </nav>
            <div className="mobile-drawer-footer">
              <button 
                className="courses-action-btn" 
                style={{ width: '100%', padding: '12px', fontSize: '0.9rem', fontWeight: 700 }} 
                onClick={() => { window.open(settings.examPortalUrl || 'https://app.instituteapex.in?app=student', '_blank'); setMobileMenuOpen(false); }}
              >
                Launch Exam Portal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Content */}
      <main className="main-content">
        {children}
      </main>

      {/* Professional Footer */}
      <footer className="footer-premium">
        <div className="student-content-wrap">
          <div className="footer-grid">
            <div className="footer-col">
              <div className="footer-logo-title" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
                <img src="/logo.png" alt="APEX Logo" onError={(e) => e.target.style.display = 'none'} />
                <span>APEX INSTITUTE</span>
              </div>
              <p className="footer-desc">
                Jind's premium classroom tutoring center providing highly structured coaching for NEET (Medical), IIT-JEE (Engineering) and Junior Foundations (Class 9th-10th, NTSE & Olympiads).
              </p>
            </div>
            
            <div className="footer-col">
              <span className="footer-col-title">Quick Links</span>
              <ul className="footer-links-list">
                <li className="footer-link-item"><a onClick={() => navigate('/')}>Home</a></li>
                <li className="footer-link-item"><a onClick={() => navigate('/courses')}>All Courses</a></li>
                <li className="footer-link-item"><a onClick={() => navigate('/pages/about-apex-jind')}>About Us</a></li>
                {customPages.filter(p => p.slug !== 'about-apex-jind').map(page => (
                  <li className="footer-link-item" key={page.id}>
                    <a onClick={() => navigate(`/pages/${page.slug}`)}>{page.title}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-col">
              <span className="footer-col-title">Coaching Programs</span>
              <ul className="footer-links-list">
                <li className="footer-link-item"><a onClick={() => navigate('/courses')}>NEET medical prep</a></li>
                <li className="footer-link-item"><a onClick={() => navigate('/courses')}>IIT-JEE prep tuition</a></li>
                <li className="footer-link-item"><a onClick={() => navigate('/courses')}>Olympiads foundations</a></li>
                <li className="footer-link-item"><a onClick={() => navigate('/courses')}>Class 9th & 10th tuitions</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <span className="footer-col-title">Contact Address</span>
              <div className="footer-links-list">
                <div className="footer-contact-item">
                  <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                  <div>{settings.address}</div>
                </div>
                <div className="footer-contact-item">
                  <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.387a12.035 12.035 0 01-7.108-7.108c-.155-.44.01-1.09.387-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.11-1.008H4.5a2.25 2.25 0 00-2.25 2.25v1.372z" /></svg>
                  <div>Mob: {settings.phone}<br/>Tel: {settings.telephone}</div>
                </div>
                <div className="footer-contact-item">
                  <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                  <div>{settings.email}</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom" style={{ justifyContent: 'center' }}>
            <span className="footer-copyright" style={{ textAlign: 'center' }}>
              © {new Date().getFullYear()} {settings.instituteName}. All Rights Reserved. Designed professionally.
            </span>
          </div>
        </div>
      </footer>

      {/* Floating Action Overlay stack */}
      <div className="floating-actions">
        {scrollTopVisible && (
          <button className="floating-btn scroll-top" onClick={handleScrollTop} style={{ width: '40px', height: '40px' }}>
            <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: 16, height: 16 }}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" /></svg>
          </button>
        )}
        <button className="floating-btn whatsapp" onClick={handleWhatsApp} title="Chat on WhatsApp" style={{ width: '44px', height: '44px' }}>
          <svg fill="currentColor" viewBox="0 0 24 24" style={{ width: 22, height: 22 }}><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.517 2.266 2.27 3.51 5.284 3.508 8.489-.005 6.66-5.343 11.999-11.957 11.999-2.005-.001-3.973-.504-5.714-1.463L0 24zm6.59-4.846c1.6.95 3.197 1.451 4.82 1.452 5.518 0 10.006-4.486 10.01-10.002.002-2.673-1.037-5.186-2.927-7.079-1.889-1.89-4.4-2.932-7.08-2.933-5.524 0-10.014 4.487-10.018 10.004-.002 1.699.444 3.361 1.293 4.81l-.963 3.518 3.606-.945zm11.367-7.795c-.3-.15-1.772-.875-2.046-.975-.276-.1-.476-.15-.676.15-.2.3-.776.975-.95 1.175-.175.2-.35.225-.65.075-.3-.15-1.267-.467-2.414-1.492-.893-.797-1.497-1.782-1.672-2.082-.175-.3-.018-.462.13-.61.135-.133.3-.35.45-.525.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.676-1.63-1.026-2.47-.3-.72-.6-1.125-.676-1.125-.175 0-.35-.025-.525-.025-.175 0-.476.075-.726.35-.25.275-.95.925-.95 2.25s.965 2.6 1.1 2.775c.135.175 1.9 2.9 4.6 4.075.642.28 1.144.446 1.534.57.645.205 1.233.176 1.7.106.52-.078 1.772-.725 2.022-1.425.25-.7.25-1.3.175-1.425-.075-.125-.275-.2-.575-.35z"/></svg>
        </button>
      </div>

      {/* Sticky Bottom Navigation Footer (Mobile Only) */}
      <nav className="bottom-nav">
        <div className={`bottom-nav-item ${currentPath === '/' || currentPath === '/home' ? 'active' : ''}`} onClick={() => navigate('/')}>
          <IconHome />
          <span>Home</span>
        </div>
        <div className={`bottom-nav-item ${currentPath === '/courses' ? 'active' : ''}`} onClick={() => navigate('/courses')}>
          <IconBook />
          <span>Courses</span>
        </div>
      </nav>
    </div>
  );
}

// ---------------- HOME VIEW ----------------
function HomeView({ settings, navigate, openEnquiry, setVideoModalUrl, setSelectedCourseDetails }) {
  const [sliders, setSliders] = useState([]);
  const [courses, setCourses] = useState([]);
  const [kalam, setKalam] = useState({});
  const [resources, setResources] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [results, setResults] = useState([]); // Results state
  const [posts, setPosts] = useState([]); // Posts state
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Results active filter
  const [activeResultTab, setActiveResultTab] = useState('all');

  useEffect(() => {
    setSliders(dbService.getSliders().filter(s => s.active));
    setCourses(dbService.getCourses());
    setKalam(dbService.getKalam());
    setResources(dbService.getResources());
    setTestimonials(dbService.getTestimonials());
    setResults(dbService.getResults());
    setPosts(dbService.getPosts());
  }, []);

  // Slide rotation
  useEffect(() => {
    if (sliders.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % sliders.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [sliders]);

  const handleNextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % sliders.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + sliders.length) % sliders.length);
  };

  const previewCourses = courses.slice(0, 3);
  
  // Filter results/toppers
  const filteredResults = activeResultTab === 'all' 
    ? results 
    : results.filter(r => r.examType === activeResultTab);

  return (
    <div className="fade-in student-content-wrap">
      {/* 10-Image Banner Slideshow Section */}
      {sliders.length > 0 && (
        <section className="slider-container" style={{ borderRadius: 'var(--radius-lg)', marginTop: '20px', boxShadow: 'var(--shadow-md)' }}>
          <div 
            className="slider-wrapper" 
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {sliders.map((slide, idx) => (
              <div className="slide" key={slide.id || idx}>
                <img src={slide.imageUrl} alt={`Apex Banner Slide ${idx + 1}`} />
              </div>
            ))}
          </div>
          
          {sliders.length > 1 && (
            <>
              <button className="slider-arrow left" onClick={handlePrevSlide}>‹</button>
              <button className="slider-arrow right" onClick={handleNextSlide}>›</button>
              
              <div className="slider-dots">
                {sliders.map((_, idx) => (
                  <span 
                    key={idx}
                    className={`slider-dot ${idx === currentSlide ? 'active' : ''}`}
                    onClick={() => setCurrentSlide(idx)}
                  />
                ))}
              </div>
            </>
          )}
        </section>
      )}

      {/* APJ Abdul Kalam Banner Section */}
      {kalam && kalam.imageUrl && (
        <section className="kalam-banner-section" style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
          <img 
            src={kalam.imageUrl} 
            alt="Dr. APJ Abdul Kalam - Our Mentor" 
            fetchPriority="high"
            loading="eager"
            style={{ width: '100%', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', objectFit: 'contain' }} 
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        </section>
      )}

      {/* Large Banner Intro */}
      <section className="hero-title-section" style={{ borderBottom: 'none' }}>
        <h1 className="hero-heading">
          India's Best Coaching for<br />
          <span>NEET, JEE & FOUNDATIONS</span>
        </h1>
        <p className="hero-subheading">{settings.tagline}</p>
      </section>

      {/* Value Proposition Info Card */}
      <section className="info-section" style={{ borderRadius: 'var(--radius-lg)', borderBottom: 'none', marginBottom: '20px' }}>
        <div className="info-card">
          <div className="info-card-text-wrap">
            <span className="info-card-title">24/7 Academic Study Partner</span>
            <p className="info-card-text">Access standard practice test banks, offline subjective OMR grading, and personalized analytics for a complete competitive edge.</p>
          </div>
          <div className="info-card-image-wrap">
            <img src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=600" className="info-card-image" alt="Apex Study Partner Portal Mockup" />
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section style={{ borderBottom: '8px solid var(--border-light)', paddingBottom: '30px' }}>
        <div className="section-header">
          <h2 className="section-title">Featured Programs</h2>
          <p className="section-subtitle">Explore classes tailored for CBSE, HBSE, and ICSE boards</p>
        </div>

        <div className="courses-container">
          {previewCourses.map(course => (
            <div className="course-card" key={course.id}>
              {course.showImage !== false && (
                <div className="course-banner">
                  <img src={course.image} alt={course.title} />
                  <div className="course-banner-overlay">
                    <button className="course-detail-btn" onClick={() => setSelectedCourseDetails(course)}>View details</button>
                  </div>
                </div>
              )}
              <div className="course-info">
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
                  <span className="testimonial-rank" style={{ backgroundColor: 'var(--navy-blue)', color: '#fff' }}>
                    {course.category === 'class-11-12' ? 'Class 11-12' : 'Class 9-10'}
                  </span>
                  {course.showTarget !== false && course.target && (
                    <span className="testimonial-rank">
                      {course.target}
                    </span>
                  )}
                </div>
                
                <h3 className="course-title" style={{ cursor: 'pointer' }} onClick={() => setSelectedCourseDetails(course)}>{course.title}</h3>
                
                <div className="course-meta-list">
                  {course.showSchedule !== false && course.schedule && (
                    <div className="course-meta-item">
                      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      <span>{course.schedule}</span>
                    </div>
                  )}
                  {course.showBoards !== false && course.boards && (
                    <div className="course-meta-item">
                      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342M12 2.25V9.75m0-7.25c.01-.2.03-.4.07-.6M12 9.75c.01.2.03.4.07.6" /></svg>
                      <span>{course.boards}</span>
                    </div>
                  )}
                  {course.showDuration !== false && course.duration && (
                    <div className="course-meta-item">
                      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      <span>Duration: {course.duration}</span>
                    </div>
                  )}
                </div>

                <hr className="course-divider" />

                <div className="course-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {course.showFee !== false && course.fee ? (
                    <div>
                      <span className="course-price-label">Registration:</span>
                      <div className="course-price-val">₹ {course.fee.toLocaleString()}</div>
                    </div>
                  ) : (
                    <div></div>
                  )}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="enrol-btn secondary" style={{ padding: '8px 12px', fontSize: '0.8rem', backgroundColor: '#e2e8f0', color: 'var(--navy-dark)', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: 600 }} onClick={() => setSelectedCourseDetails(course)}>View Details</button>
                    <button className="enrol-btn" style={{ padding: '8px 12px', fontSize: '0.8rem' }} onClick={() => openEnquiry(course)}>Enrol now</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button 
          className="admin-btn secondary" 
          style={{ width: '100%', padding: '14px', borderRadius: 'var(--radius-lg)', fontWeight: 700 }}
          onClick={() => navigate('/courses')}
        >
          View All Courses Catalog
        </button>
      </section>

      {/* Our Excellent Results Section */}
      {results.length > 0 && (
        <section className="results-section">
          <div className="section-header">
            <h2 className="section-title">Our Excellent Results</h2>
            <p className="section-subtitle">Outstanding ranks and achievements secured by our students</p>
          </div>

          {/* Results Filters pills */}
          <div className="filters-wrapper">
            <button className={`filter-pill ${activeResultTab === 'all' ? 'active' : ''}`} onClick={() => setActiveResultTab('all')}>All Ranks</button>
            {Array.from(new Set(results.map(r => r.examType).filter(Boolean))).map(cat => (
              <button 
                key={cat} 
                className={`filter-pill ${activeResultTab === cat ? 'active' : ''}`} 
                onClick={() => setActiveResultTab(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="results-grid">
            {filteredResults.slice(0, 8).map(res => (
              <div className="result-card" key={res.id}>
                <div className="result-photo-wrap">
                  <img src={res.photo} className="result-photo" alt={res.studentName} />
                </div>
                <span className="result-name">{res.studentName}</span>
                <span className="result-achievement">{res.achievement}</span>
                <span className="result-meta">{res.location}</span>
              </div>
            ))}
          </div>

          {filteredResults.length > 8 && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
              <button 
                className="courses-action-btn" 
                onClick={() => navigate('/results')}
                style={{ padding: '12px 30px', fontWeight: 700 }}
              >
                View More Results
              </button>
            </div>
          )}
        </section>
      )}

      {/* Do More quick links */}
      <section className="quick-links-section">
        <div className="section-header">
          <h2 className="section-title">Do More with APEX</h2>
          <p className="section-subtitle">Access student answer keys, syllabus sheets, and dynamic announcements</p>
        </div>

        <div className="links-list">
          {resources.map(res => (
            <div className="link-card" key={res.id} onClick={() => openEnquiry(null)}>
              <div className="link-content">
                <div className="link-icon-wrap">
                  <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                </div>
                <span className="link-title">{res.title}</span>
              </div>
              <div className="link-arrow">
                <IconChevronRight />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Latest News & Announcements Section */}
      {posts.length > 0 && (
        <section className="news-section student-content-wrap" style={{ padding: '40px 0', borderBottom: '1px solid var(--border-light)' }}>
          <div className="section-header">
            <h2 className="section-title">Latest News & Announcements</h2>
            <p className="section-subtitle">Stay updated with key exam alerts, academic guides, and updates from APEX</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginTop: '20px' }}>
            {posts.slice(0, 5).map(post => {
              const cleanExcerpt = post.content
                ? post.content.replace(/<[^>]*>/g, '').substring(0, 120) + '...'
                : '';
              
              const showImages = !!settings.showBlogImagesOnHome;
              
              return (
                <div 
                  key={post.id} 
                  className="info-card" 
                  style={{ 
                    flexDirection: 'column', 
                    padding: '0', 
                    overflow: 'hidden', 
                    borderRadius: 'var(--radius-lg)', 
                    border: '1px solid var(--border-light)', 
                    boxShadow: 'var(--shadow-sm)',
                    backgroundColor: '#fff'
                  }}
                >
                  {showImages && post.coverImage && (
                    <div style={{ height: '180px', width: '100%', overflow: 'hidden' }}>
                      <img 
                        src={post.coverImage} 
                        alt={post.title} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                    </div>
                  )}
                  <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                      {post.category && (
                        <span className="status-badge new" style={{ fontSize: '0.7rem', padding: '3px 8px' }}>
                          {post.category}
                        </span>
                      )}
                      {post.publishDate && (
                        <span style={{ fontSize: '0.75rem', color: '#666', fontWeight: 600 }}>
                          {post.publishDate}
                        </span>
                      )}
                    </div>
                    
                    <h3 style={{ 
                      fontSize: '1.1rem', 
                      color: 'var(--navy-blue)', 
                      margin: '0 0 10px 0', 
                      fontWeight: 700,
                      lineHeight: 1.4
                    }}>
                      {post.title}
                    </h3>
                    
                    <p style={{ 
                      fontSize: '0.85rem', 
                      color: 'var(--light-gray)', 
                      margin: '0 0 15px 0', 
                      lineHeight: 1.5,
                      flex: 1
                    }}>
                      {cleanExcerpt}
                    </p>
                    
                    <button 
                      className="enrol-btn" 
                      style={{ 
                        padding: '8px 16px', 
                        fontSize: '0.8rem', 
                        alignSelf: 'flex-start',
                        backgroundColor: 'transparent',
                        color: 'var(--navy-blue)',
                        border: '1px solid var(--navy-blue)',
                        fontWeight: 700
                      }}
                      onClick={() => navigate(`/posts/${post.slug}`)}
                    >
                      Read Full Guide →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {posts.length > 5 && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
              <button 
                className="courses-action-btn" 
                onClick={() => navigate('/blogs')}
                style={{ padding: '12px 30px', fontWeight: 700 }}
              >
                View All Blogs
              </button>
            </div>
          )}
        </section>
      )}

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="testimonials-section">
          <div className="section-header">
            <h2 className="section-title">What Students Say</h2>
            <p className="section-subtitle">Read success reviews from our toppers</p>
          </div>

          <div className="testimonials-scroll">
            {testimonials.map(item => (
              <div className="testimonial-card" key={item.id}>
                <div className="testimonial-top">
                  <div className="testimonial-student">
                    <span className="testimonial-name">{item.studentName}</span>
                    <span className="testimonial-exam">{item.examType}</span>
                    <span className="testimonial-rank">{item.rankBadge}</span>
                  </div>
                  <div className="testimonial-photo-wrap">
                    <img src={item.photo} className="testimonial-photo" alt={item.studentName} />
                    {item.videoUrl && (
                      <div className="video-play-overlay" onClick={() => setVideoModalUrl(item.videoUrl)}>
                        <IconPlay />
                      </div>
                    )}
                  </div>
                </div>
                <p className="testimonial-text">"{item.textReview}"</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Enquiry Form */}
      <section className="contact-section">
        <div className="contact-section-inner" style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: '500px' }}>
            <EnquiryInlineForm />
          </div>
        </div>
      </section>
    </div>
  );
}

// ---------------- COURSES LIST VIEW ----------------
function CoursesListView({ navigate, openEnquiry, setSelectedCourseDetails }) {
  const [courses, setCourses] = useState([]);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    setCourses(dbService.getCourses());
  }, []);

  const filteredCourses = activeTab === 'all' 
    ? courses 
    : courses.filter(c => c.category === activeTab);

  return (
    <div className="fade-in student-content-wrap" style={{ marginTop: '20px' }}>
      <Helmet>
        <title>IIT-JEE & NEET Coaching Courses - APEX Institute</title>
        <meta name="description" content="Explore NEET medical preparation, IIT-JEE engineering tuitions, and junior foundations classes in Jind, Haryana." />
        <meta name="keywords" content="medical coaching jind, engineering classes, foundations class 9, cbse syllabus haryana" />
      </Helmet>

      <div className="section-header">
        <h2 className="section-title">Our Coaching Courses</h2>
        <p className="section-subtitle">Excellence in Medical, Engineering, and Foundation examinations</p>
      </div>

      {/* Course Filter Pills */}
      <div className="filters-wrapper">
        <button 
          className={`filter-pill ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All Classes
        </button>
        <button 
          className={`filter-pill ${activeTab === 'class-9-10' ? 'active' : ''}`}
          onClick={() => setActiveTab('class-9-10')}
        >
          Class 9th & 10th
        </button>
        <button 
          className={`filter-pill ${activeTab === 'class-11-12' ? 'active' : ''}`}
          onClick={() => setActiveTab('class-11-12')}
        >
          Class 11th & 12th
        </button>
      </div>

      <div className="courses-container" style={{ borderBottom: 'none' }}>
        {filteredCourses.map(course => (
          <div className="course-card" key={course.id}>
            {course.showImage !== false && (
              <div className="course-banner">
                <img src={course.image} alt={course.title} />
                <div className="course-banner-overlay">
                  <button className="course-detail-btn" onClick={() => setSelectedCourseDetails(course)}>View Curriculum</button>
                </div>
              </div>
            )}
            <div className="course-info">
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
                <span className="testimonial-rank" style={{ backgroundColor: 'var(--navy-blue)', color: '#fff' }}>
                  {course.category === 'class-11-12' ? 'Class 11-12' : 'Class 9-10'}
                </span>
                {course.showTarget !== false && course.target && (
                  <span className="testimonial-rank">
                    {course.target}
                  </span>
                )}
              </div>
              
              <h3 className="course-title" style={{ cursor: 'pointer' }} onClick={() => setSelectedCourseDetails(course)}>{course.title}</h3>
              
              {course.showDetails !== false && course.details && (
                <p style={{ fontSize: '0.85rem', color: 'var(--light-gray)', marginBottom: '16px', lineHeight: 1.45 }}>
                  {course.details}
                </p>
              )}
              
              <div className="course-meta-list">
                {course.showSchedule !== false && course.schedule && (
                  <div className="course-meta-item">
                    <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span>{course.schedule}</span>
                  </div>
                )}
                {course.showDuration !== false && course.duration && (
                  <div className="course-meta-item">
                    <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                    <span>Duration: {course.duration}</span>
                  </div>
                )}
                {course.showBoards !== false && course.boards && (
                  <div className="course-meta-item">
                    <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342M12 2.25V9.75m0-7.25c.01-.2.03-.4.07-.6M12 9.75c.01.2.03.4.07.6" /></svg>
                    <span>{course.boards}</span>
                  </div>
                )}
              </div>

              <hr className="course-divider" />

              <div className="course-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {course.showFee !== false && course.fee ? (
                  <div>
                    <span className="course-price-label">Fee Details:</span>
                    <div className="course-price-val">₹ {course.fee.toLocaleString()}</div>
                  </div>
                ) : (
                  <div></div>
                )}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="enrol-btn secondary" style={{ padding: '8px 12px', fontSize: '0.8rem', backgroundColor: '#e2e8f0', color: 'var(--navy-dark)', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: 600 }} onClick={() => setSelectedCourseDetails(course)}>View Details</button>
                  <button className="enrol-btn" style={{ padding: '8px 12px', fontSize: '0.8rem' }} onClick={() => openEnquiry(course)}>Enrol now</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------- ONLINE PREP VIEW ----------------
function OnlinePrepView({ navigate, openEnquiry }) {
  return (
    <div className="fade-in student-content-wrap" style={{ marginTop: '20px' }}>
      <Helmet>
        <title>Online Prep - APEX Institute</title>
        <meta name="description" content="Access online mock test series, CBT mode, and detailed performance analysis reports for IIT-JEE and NEET prep." />
      </Helmet>

      <div className="section-header">
        <h2 className="section-title">APEX Online Prep Portal</h2>
        <p className="section-subtitle">Excellence driven by smart assessments and comprehensive diagnostics</p>
      </div>

      {/* Offline Classroom Notice */}
      <div className="alert-notice-box" style={{ 
        backgroundColor: '#fffbeb', 
        borderLeft: '4px solid #d97706', 
        padding: '16px', 
        borderRadius: 'var(--radius-md)', 
        marginBottom: '30px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <span style={{ fontSize: '1.5rem' }}>📝</span>
          <div>
            <h4 style={{ margin: '0 0 4px 0', color: '#92400e', fontWeight: 700 }}>Important Academic Notice</h4>
            <p style={{ margin: 0, fontSize: '0.88rem', color: '#b45309', lineHeight: 1.5 }}>
              While practice test worksheets and performance reports are fully digitalized, <strong>all weekly interactive lectures will be conducted offline at the branch only</strong>. This ensures personalized attention and direct interaction with the senior faculty.
            </p>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        
        {/* Card 1: Online Mock Exams */}
        <div className="info-card" style={{ flexDirection: 'column', padding: '24px', alignItems: 'flex-start', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ backgroundColor: 'rgba(28, 56, 121, 0.1)', color: 'var(--navy-blue)', padding: '12px', borderRadius: '50%', marginBottom: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '28px', height: '28px' }}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.03 0 1.9.693 2.166 1.638m-7.377 2.24a.75.75 0 011.08-.024l2.25 2.25a.75.75 0 001.14-.03l3.75-5.25" /></svg>
          </div>
          <h3 style={{ fontSize: '1.2rem', color: 'var(--navy-blue)', margin: '0 0 8px 0', fontWeight: 700 }}>Online Mock Exams</h3>
          <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--light-gray)', lineHeight: 1.5 }}>
            Take practice exams modeled exactly on NTA NEET and IIT-JEE patterns. Features full-screen wizard locking, section navigation (Physics, Chemistry, Maths/Biology), timer countdowns, and tab-blur cheating prevention warnings.
          </p>
        </div>

        {/* Card 2: Performance Analytics & Reports */}
        <div className="info-card" style={{ flexDirection: 'column', padding: '24px', alignItems: 'flex-start', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ backgroundColor: 'rgba(217, 119, 6, 0.1)', color: '#d97706', padding: '12px', borderRadius: '50%', marginBottom: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '28px', height: '28px' }}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" /><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" /></svg>
          </div>
          <h3 style={{ fontSize: '1.2rem', color: '#d97706', margin: '0 0 8px 0', fontWeight: 700 }}>Performance Reports</h3>
          <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--light-gray)', lineHeight: 1.5 }}>
            Access automatic diagnostic cards. Review score trends, subject-wise accuracy percentage, section strength dashboards, and difficulty classification splits (Easy, Moderate, Difficult questions).
          </p>
        </div>

      </div>
    </div>
  );
}

// ---------------- SCHOLARSHIP VIEW ----------------
function ScholarshipView({ navigate, openEnquiry }) {
  const [scholarships, setScholarships] = useState([]);

  useEffect(() => {
    setScholarships(dbService.getScholarships());
  }, []);

  return (
    <div className="fade-in student-content-wrap" style={{ marginTop: '20px' }}>
      <Helmet>
        <title>Merit Scholarships - APEX Institute</title>
        <meta name="description" content="View scholarship fee waivers provided for NEET and IIT-JEE coaching based on board exam scores and qualifying ranks." />
      </Helmet>

      <div className="section-header">
        <h2 className="section-title">Merit-Based Scholarships</h2>
        <p className="section-subtitle">Supporting outstanding academic achievers in their path to medical and engineering excellence</p>
      </div>

      {/* Slabs Grid */}
      <div className="courses-container" style={{ borderBottom: 'none', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        {scholarships.map((slab) => (
          <div className="course-card" key={slab.id} style={{ display: 'flex', flexDirection: 'column', height: '100%', border: '1px solid var(--border-light)', overflow: 'hidden' }}>
            <div style={{ 
              backgroundColor: 'var(--navy-blue)', 
              color: '#fff', 
              padding: '24px 20px', 
              textAlign: 'center',
              borderTopLeftRadius: 'var(--radius-lg)',
              borderTopRightRadius: 'var(--radius-lg)'
            }}>
              <span className="testimonial-rank" style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: '#fff', fontSize: '0.72rem', display: 'inline-block', marginBottom: '10px' }}>
                Waiver Slab
              </span>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, margin: '5px 0' }}>{slab.discount}</div>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)' }}>on Program Tuition Fees</p>
            </div>
            
            <div className="course-info" style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, padding: '20px' }}>
              <h3 className="course-title" style={{ fontSize: '1.1rem', margin: '0 0 10px 0', minHeight: '44px', display: 'flex', alignItems: 'center' }}>
                {slab.title}
              </h3>
              
              <div style={{ display: 'flex', gap: '8px', fontSize: '0.82rem', color: 'var(--navy-blue)', fontWeight: 700, backgroundColor: '#f0f4f8', padding: '10px', borderRadius: 'var(--radius-sm)', marginBottom: '15px' }}>
                <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>🏆</span>
                <div>
                  <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--light-gray)', fontWeight: 600 }}>Criteria:</div>
                  <div style={{ marginTop: '2px' }}>{slab.criteria}</div>
                </div>
              </div>

              <p style={{ fontSize: '0.85rem', color: 'var(--light-gray)', lineHeight: 1.5, margin: '0 0 20px 0', flexGrow: 1 }}>
                {slab.description}
              </p>

              <button 
                className="enrol-btn" 
                style={{ width: '100%', padding: '12px' }}
                onClick={() => openEnquiry({ title: `Scholarship: ${slab.title} (${slab.discount})` })}
              >
                Apply for Scholarship
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Meritorious Track Record notice */}
      <div className="info-card" style={{ padding: '24px', display: 'flex', gap: '15px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)', marginBottom: '30px' }}>
        <div style={{ fontSize: '2rem' }}>💡</div>
        <div>
          <h4 style={{ margin: '0 0 6px 0', color: 'var(--navy-blue)', fontWeight: 700 }}>Applying with Merit Documents</h4>
          <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--light-gray)', lineHeight: 1.55 }}>
            To avail of waivers, students must present original boards report sheets, qualifying exam registration cards, or rank documentation during checkout at the APEX administration office. Waivers are calculated strictly on tuition parameters.
          </p>
        </div>
      </div>
    </div>
  );
}

// ---------------- DYNAMIC CUSTOM PAGE VIEW ----------------
function DynamicPageView({ slug, navigate }) {
  const [page, setPage] = useState(null);

  useEffect(() => {
    const loaded = dbService.getPageBySlug(slug);
    setPage(loaded);
  }, [slug]);

  if (!page) {
    return (
      <div className="dynamic-page-wrap student-content-wrap fade-in" style={{ textAlign: 'center', padding: '100px var(--spacing-md)' }}>
        <h2 className="dynamic-page-title">Page Not Found</h2>
        <p style={{ color: 'var(--light-gray)', marginBottom: '25px' }}>The requested custom page could not be located.</p>
        <button className="enrol-btn" onClick={() => navigate('/')}>Go to Home</button>
      </div>
    );
  }

  return (
    <div className="dynamic-page-wrap student-content-wrap fade-in">
      <Helmet>
        <title>{page.metaTitle || page.title}</title>
        <meta name="description" content={page.metaDescription} />
        {page.keywords && <meta name="keywords" content={page.keywords} />}
      </Helmet>

      <h1 className="dynamic-page-title">{page.title}</h1>
      <div className="dynamic-page-meta">
        <span>Last updated: {new Date(page.lastUpdated).toLocaleDateString()}</span>
      </div>
      <div 
        className="dynamic-page-body" 
        dangerouslySetInnerHTML={{ __html: page.content }}
      />
      
      <button 
        className="admin-btn secondary" 
        style={{ width: '100%', marginTop: '40px', padding: '14px', fontWeight: 600 }}
        onClick={() => navigate('/')}
      >
        Back to Home Page
      </button>
    </div>
  );
}

// ---------------- DYNAMIC POST / BLOG VIEW ----------------
function DynamicPostView({ slug, navigate }) {
  const [post, setPost] = useState(null);

  useEffect(() => {
    const loaded = dbService.getPostBySlug(slug);
    setPost(loaded);
  }, [slug]);

  if (!post) {
    return (
      <div className="dynamic-page-wrap student-content-wrap fade-in" style={{ textAlign: 'center', padding: '100px var(--spacing-md)' }}>
        <h2 className="dynamic-page-title">Post Not Found</h2>
        <p style={{ color: 'var(--light-gray)', marginBottom: '25px' }}>The blog post or news update does not exist.</p>
        <button className="enrol-btn" onClick={() => navigate('/')}>Go to Home</button>
      </div>
    );
  }

  return (
    <div className="dynamic-page-wrap student-content-wrap fade-in">
      <Helmet>
        <title>{post.metaTitle || post.title}</title>
        <meta name="description" content={post.metaDescription} />
        {post.keywords && <meta name="keywords" content={post.keywords} />}
      </Helmet>

      <span className="testimonial-rank" style={{ marginBottom: '12px' }}>{post.category}</span>
      <h1 className="dynamic-page-title">{post.title}</h1>
      <div className="dynamic-page-meta">
        <span>Published on: {post.publishDate}</span>
      </div>
      {post.coverImage && (
        <img 
          src={post.coverImage} 
          alt={post.title} 
          style={{ width: '100%', borderRadius: 'var(--radius-lg)', marginBottom: '25px', objectFit: 'cover', maxHeight: '350px' }} 
        />
      )}
      <div 
        className="dynamic-page-body" 
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
      
      <button 
        className="admin-btn secondary" 
        style={{ width: '100%', marginTop: '40px', padding: '14px', fontWeight: 600 }}
        onClick={() => navigate('/')}
      >
        Back to Home Page
      </button>
    </div>
  );
}

// ---------------- MODAL FORM COMPONENT ----------------
function EnquiryModal({ selectedCourse, onClose }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [courseId, setCourseId] = useState(selectedCourse ? selectedCourse.id : '');
  const [submitted, setSubmitted] = useState(false);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    setCourses(dbService.getCourses());
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !phone || !courseId) {
      alert('Please fill out Name, Phone, and Course fields.');
      return;
    }
    dbService.addEnquiry({
      studentName: name,
      phone,
      parentPhone,
      courseId
    });
    setSubmitted(true);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">
            {selectedCourse ? `Enrol: ${selectedCourse.title}` : 'Enquire and Register'}
          </span>
          <button className="modal-close" onClick={onClose}><IconClose /></button>
        </div>
        <div className="modal-body">
          {submitted ? (
            <div className="form-success-message">
              <div className="form-success-icon"><IconCheck /></div>
              <h3 style={{ fontFamily: 'var(--font-family)', color: 'var(--navy-blue)' }}>Enquiry Sent Successfully!</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--light-gray)' }}>Our admissions team will call you shortly on the provided mobile number.</p>
              <button className="form-submit-btn" onClick={onClose}>Close Form</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Student's Full Name *</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  placeholder="Enter full name"
                  required 
                />
              </div>
              <div className="form-group">
                <label>Contact Mobile Number *</label>
                <input 
                  type="tel" 
                  value={phone} 
                  onChange={e => setPhone(e.target.value)} 
                  placeholder="Enter 10 digit number"
                  required 
                />
              </div>
              <div className="form-group">
                <label>Parent's Phone Number</label>
                <input 
                  type="tel" 
                  value={parentPhone} 
                  onChange={e => setParentPhone(e.target.value)} 
                  placeholder="Enter parent phone number (optional)"
                />
              </div>
              <div className="form-group">
                <label>Target Coaching Program *</label>
                <select 
                  value={courseId} 
                  onChange={e => setCourseId(e.target.value)}
                  required
                >
                  <option value="">Select a Course</option>
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>
              <button type="submit" className="form-submit-btn">Submit Registration</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------- INLINE ENQUIRY FORM ----------------
function EnquiryInlineForm() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [courseId, setCourseId] = useState('');
  const [courses, setCourses] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setCourses(dbService.getCourses());
  }, []);

  const handleInlineSubmit = (e) => {
    e.preventDefault();
    if (!name || !phone || !courseId) {
      alert('Please fill out all mandatory fields.');
      return;
    }
    dbService.addEnquiry({
      studentName: name,
      phone,
      parentPhone: '',
      courseId
    });
    setSubmitted(true);
    setName('');
    setPhone('');
    setCourseId('');
  };

  return (
    <div className="info-card" style={{ height: '100%', justifyContent: 'center' }}>
      <span className="info-card-title">Quick Admissions Enquiry</span>
      {submitted ? (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div className="form-success-icon" style={{ margin: '0 auto 15px' }}><IconCheck /></div>
          <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--navy-blue)' }}>Enquiry Sent! We will call you soon.</span>
        </div>
      ) : (
        <form onSubmit={handleInlineSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
          <input 
            type="text" 
            placeholder="Student Name *" 
            value={name} 
            onChange={e => setName(e.target.value)}
            style={{ width: '100%', padding: '11px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-gray)', fontSize: '0.85rem' }}
            required
          />
          <input 
            type="tel" 
            placeholder="Phone Number *" 
            value={phone} 
            onChange={e => setPhone(e.target.value)}
            style={{ width: '100%', padding: '11px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-gray)', fontSize: '0.85rem' }}
            required
          />
          <select 
            value={courseId} 
            onChange={e => setCourseId(e.target.value)}
            style={{ width: '100%', padding: '11px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-gray)', fontSize: '0.85rem', background: '#fff' }}
            required
          >
            <option value="">Select Target Course *</option>
            {courses.map(c => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
          <button type="submit" className="form-submit-btn" style={{ padding: '11px', marginTop: '5px' }}>Submit Request</button>
        </form>
      )}
    </div>
  );
}

// =========================================================================
// ========================== ADMINISTRATIVE PANEL =========================
// =========================================================================
function AdminPanel({ navigate }) {
  const [isLogged, setIsLogged] = useState(dbService.isLoggedIn());
  const [activeTab, setActiveTab] = useState('overview');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const success = await dbService.login(username, password);
      if (success) {
        setIsLogged(true);
        setLoginError('');
      } else {
        setLoginError('Invalid Administrator credentials.');
      }
    } catch (err) {
      setLoginError(err.message || 'Login failed. Please check credentials or network.');
    }
  };

  const handleLogout = async () => {
    await dbService.logout();
    setIsLogged(false);
    navigate('/');
  };

  if (!isLogged) {
    return (
      <div className="admin-login-container">
        <div className="admin-login-card">
          <div className="admin-login-header">
            <span className="admin-login-title">APEX ADMIN SYSTEM</span>
          </div>
          {loginError && <div className="admin-login-error">{loginError}</div>}
          <form onSubmit={handleLogin}>
            <div className="admin-input-group">
              <label>Admin Username</label>
              <input 
                type="text" 
                value={username} 
                onChange={e => setUsername(e.target.value)}
                placeholder="Enter username (admin)"
                required 
              />
            </div>
            <div className="admin-input-group">
              <label>Admin Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter password (apex2026)"
                required 
              />
            </div>
            <button type="submit" className="form-submit-btn" style={{ padding: '12px' }}>Access Dashboard</button>
          </form>
          <button 
            className="admin-btn secondary" 
            style={{ width: '100%', marginTop: '12px', padding: '10px' }}
            onClick={() => navigate('/')}
          >
            Return to Site
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      {/* Sidebar Navigation */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <span className="admin-sidebar-title">APEX ADMISSIONS</span>
        </div>
        <nav className="admin-sidebar-nav">
          <div className={`admin-nav-item ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" /><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" /></svg>
            Overview
          </div>
          <div className={`admin-nav-item ${activeTab === 'sliders' ? 'active' : ''}`} onClick={() => setActiveTab('sliders')}>
            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
            Banner Sliders (10)
          </div>
          <div className={`admin-nav-item ${activeTab === 'kalam' ? 'active' : ''}`} onClick={() => setActiveTab('kalam')}>
            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" /></svg>
            Kalam Quote
          </div>
          <div className={`admin-nav-item ${activeTab === 'courses' ? 'active' : ''}`} onClick={() => setActiveTab('courses')}>
            <IconBook />
            Courses Manager
          </div>
          <div className={`admin-nav-item ${activeTab === 'results' ? 'active' : ''}`} onClick={() => setActiveTab('results')}>
            <IconStar />
            Results Manager
          </div>
          <div className={`admin-nav-item ${activeTab === 'pages' ? 'active' : ''}`} onClick={() => setActiveTab('pages')}>
            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
            Custom Pages
          </div>
          <div className={`admin-nav-item ${activeTab === 'posts' ? 'active' : ''}`} onClick={() => setActiveTab('posts')}>
            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" /></svg>
            Blogs & News
          </div>
          <div className={`admin-nav-item ${activeTab === 'resources' ? 'active' : ''}`} onClick={() => setActiveTab('resources')}>
            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" /></svg>
            Quick Links
          </div>
          <div className={`admin-nav-item ${activeTab === 'enquiries' ? 'active' : ''}`} onClick={() => setActiveTab('enquiries')}>
            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.109A11.386 11.386 0 0110.089 20c-2.302 0-4.474-.685-6.3-1.857v-.11c0-2.277 3.09-4.133 6.9-4.133 1.87 0 3.585.441 4.823 1.158v.006c.866.498 1.488 1.343 1.488 2.328v.11z" /></svg>
            Leads / Enquiries
          </div>
          <div className={`admin-nav-item ${activeTab === 'scholarships' ? 'active' : ''}`} onClick={() => setActiveTab('scholarships')}>
            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" /></svg>
            Scholarships CRUD
          </div>
          <div className={`admin-nav-item ${activeTab === 'testimonials' ? 'active' : ''}`} onClick={() => setActiveTab('testimonials')}>
            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L6 12zm0 0h7.5" /></svg>
            Video Testimonials
          </div>
        </nav>
        <div className="admin-sidebar-footer">
          <button className="admin-logout-btn" onClick={handleLogout}>Logout Panel</button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main">
        <header className="admin-header">
          <span className="admin-header-title">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Dashboard
          </span>
          <div className="admin-header-user">
            Logged as Administrator
          </div>
        </header>

        <div className="admin-content">
          {isDefault ? (
            <div style={{ backgroundColor: '#fffbeb', border: '1px solid #fef3c7', padding: '12px 18px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <span style={{ fontSize: '1.25rem' }}>⚠️</span>
              <div style={{ fontSize: '0.85rem', color: '#92400e', lineHeight: '1.4' }}>
                <strong>Database is disconnected (using local browser storage).</strong> To save your updates permanently and sync across all devices, paste your Firebase config in <code>src/services/firebaseConfig.js</code> in your code repository.
              </div>
            </div>
          ) : (
            <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #dcfce7', padding: '12px 18px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <span style={{ fontSize: '1.25rem' }}>🔥</span>
              <div style={{ fontSize: '0.85rem', color: '#166534', lineHeight: '1.4' }}>
                <strong>Connected to Firebase Firestore.</strong> Your data is synchronized in real-time and saved permanently in your Google Cloud account.
              </div>
            </div>
          )}
          {activeTab === 'overview' && <AdminOverview setActiveTab={setActiveTab} />}
          {activeTab === 'sliders' && <AdminSliders />}
          {activeTab === 'kalam' && <AdminKalam />}
          {activeTab === 'courses' && <AdminCourses />}
          {activeTab === 'results' && <AdminResults />}
          {activeTab === 'pages' && <AdminPages />}
          {activeTab === 'posts' && <AdminPosts />}
          {activeTab === 'resources' && <AdminResources />}
          {activeTab === 'enquiries' && <AdminEnquiries />}
          {activeTab === 'scholarships' && <AdminScholarships />}
          {activeTab === 'testimonials' && <AdminTestimonials />}
        </div>
      </main>
    </div>
  );
}

// ---------------- ADMIN OVERVIEW SUB-VIEW ----------------
function AdminOverview({ setActiveTab }) {
  const [stats, setStats] = useState({ courses: 0, enquiries: 0, pages: 0, posts: 0 });

  useEffect(() => {
    setStats({
      courses: dbService.getCourses().length,
      enquiries: dbService.getEnquiries().length,
      pages: dbService.getPages().length,
      posts: dbService.getPosts().length
    });
  }, []);

  return (
    <div className="fade-in">
      <div className="admin-grid-stats">
        <div className="admin-stat-card">
          <div className="admin-stat-icon-wrap"><IconBook /></div>
          <div className="admin-stat-info">
            <span className="admin-stat-val">{stats.courses}</span>
            <span className="admin-stat-lbl">Active Courses</span>
          </div>
        </div>
        <div className="admin-stat-card" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('enquiries')}>
          <div className="admin-stat-icon-wrap blue">
            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ width: 24, height: 24 }}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-9-3.75h.008v.008H6V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM6 10.5h.008v.008H6V10.5zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM6 14.25h.008v.008H6v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM4.125 18h11.75A1.875 1.875 0 0017.75 16.125V6.75A1.875 1.875 0 0015.875 4.875H4.125A1.875 1.875 0 002.25 6.75v9.375C2.25 17.125 3.088 18 4.125 18z" /></svg>
          </div>
          <div className="admin-stat-info">
            <span className="admin-stat-val">{stats.enquiries}</span>
            <span className="admin-stat-lbl">Leads Collected</span>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon-wrap purple"><IconEdit /></div>
          <div className="admin-stat-info">
            <span className="admin-stat-val">{stats.pages + stats.posts}</span>
            <span className="admin-stat-lbl">Custom Pages & Blogs</span>
          </div>
        </div>
      </div>

      <div className="admin-card">
        <h3 className="admin-card-title" style={{ marginBottom: '14px' }}>Brochure Configuration Settings</h3>
        <p style={{ fontSize: '0.82rem', color: 'var(--light-gray)', marginBottom: '20px' }}>These settings reflect in headers, contact boxes, and WhatsApp dynamic redirections.</p>
        
        <SettingsForm />
      </div>
    </div>
  );
}

// ---------------- ADMIN SETTINGS FORM ----------------
function SettingsForm() {
  const [settings, setSettings] = useState(dbService.getSettings());
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dbService.saveSettings(settings);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      window.location.reload();
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit}>
      {success && (
        <div style={{ backgroundColor: '#f0fdf4', color: 'var(--accent-green)', padding: '10px', borderRadius: 'var(--radius-md)', fontSize: '0.82rem', marginBottom: '15px', fontWeight: 600 }}>
          System Settings Saved Successfully! (Header will reload...)
        </div>
      )}
      <div className="admin-form-row">
        <div className="admin-input-group">
          <label>Institute Name</label>
          <input type="text" name="instituteName" value={settings.instituteName} onChange={handleChange} required />
        </div>
        <div className="admin-input-group">
          <label>Tagline / Subjects</label>
          <input type="text" name="tagline" value={settings.tagline} onChange={handleChange} required />
        </div>
      </div>
      
      {/* BRANDING LOGO SIZING AND LINKS CUSTOMIZATION */}
      <h4 style={{ margin: '20px 0 10px 0', borderBottom: '1px solid var(--border-light)', paddingBottom: '8px', color: 'var(--navy-blue)', fontSize: '0.95rem', fontWeight: 700 }}>Header Branding Customizer</h4>
      <div className="admin-form-row">
        <div className="admin-input-group">
          <label>Logo Icon URL / Source</label>
          <input type="text" name="logoUrl" value={settings.logoUrl || ''} onChange={handleChange} placeholder="e.g. /logo.png" />
          <ImageUploadCompress 
            value={settings.logoUrl} 
            onChange={(val) => setSettings(prev => ({ ...prev, logoUrl: val }))} 
            label="Or Upload and Compress Logo Icon" 
          />
        </div>
        <div className="admin-input-group">
          <label>Logo Icon Height (e.g. 44px)</label>
          <input type="text" name="logoIconHeight" value={settings.logoIconHeight || '44px'} onChange={handleChange} placeholder="e.g. 44px" />
        </div>
      </div>
      <div className="admin-form-row">
        <div className="admin-input-group">
          <label>Logo Name Text Image URL / Source</label>
          <input type="text" name="logoNameUrl" value={settings.logoNameUrl || ''} onChange={handleChange} placeholder="e.g. /logo_name.png" />
          <ImageUploadCompress 
            value={settings.logoNameUrl} 
            onChange={(val) => setSettings(prev => ({ ...prev, logoNameUrl: val }))} 
            label="Or Upload and Compress Logo Text Image" 
          />
        </div>
        <div className="admin-input-group">
          <label>Logo Name Image Width (e.g. 180px)</label>
          <input type="text" name="logoWidth" value={settings.logoWidth || '180px'} onChange={handleChange} placeholder="e.g. 180px" />
        </div>
        <div className="admin-input-group">
          <label>Logo Name Image Height (e.g. 45px)</label>
          <input type="text" name="logoHeight" value={settings.logoHeight || '45px'} onChange={handleChange} placeholder="e.g. 45px" />
        </div>
      </div>

      <div className="admin-input-group" style={{ backgroundColor: '#f0f4f8', padding: '15px', borderRadius: 'var(--radius-md)', marginBottom: '20px' }}>
        <span style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '8px', color: 'var(--navy-blue)' }}>Live Header Branding Preview:</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#fff', padding: '10px', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)' }}>
          {settings.logoUrl && (
            <img src={settings.logoUrl} alt="Preview Icon" style={{ height: settings.logoIconHeight || '44px', width: 'auto', objectFit: 'contain' }} />
          )}
          {settings.logoNameUrl && (
            <img src={settings.logoNameUrl} alt="Preview Name" style={{ width: settings.logoWidth || '180px', height: settings.logoHeight || '45px', objectFit: 'contain' }} />
          )}
        </div>
      </div>

      <div className="admin-input-group">
        <label>Full Physical Address (from Brochure)</label>
        <textarea name="address" value={settings.address} onChange={handleChange} rows="2" required></textarea>
      </div>
      <div className="admin-form-row">
        <div className="admin-input-group">
          <label>Mobile Number (for Calls & WhatsApp)</label>
          <input type="text" name="phone" value={settings.phone} onChange={handleChange} required />
        </div>
        <div className="admin-input-group">
          <label>Landline Phone</label>
          <input type="text" name="telephone" value={settings.telephone} onChange={handleChange} />
        </div>
      </div>
      <div className="admin-form-row">
        <div className="admin-input-group">
          <label>Official Email</label>
          <input type="email" name="email" value={settings.email} onChange={handleChange} required />
        </div>
        <div className="admin-input-group">
          <label>WhatsApp Default Text Message</label>
          <input type="text" name="whatsappText" value={settings.whatsappText} onChange={handleChange} />
        </div>
      </div>
      <div className="admin-input-group">
        <label>Student Exam Portal Live Link</label>
        <input type="text" name="examPortalUrl" value={settings.examPortalUrl || ''} onChange={handleChange} placeholder="e.g. https://app.instituteapex.in?app=student" />
        <span style={{ fontSize: '0.72rem', color: '#666', marginTop: '4px', display: 'block' }}>
          This links the student header icon directly to your live registered exam portal.
        </span>
      </div>
      <div className="admin-input-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '10px', marginTop: '10px', marginBottom: '20px' }}>
        <input 
          type="checkbox" 
          name="showBlogImagesOnHome" 
          id="showBlogImagesOnHome" 
          checked={!!settings.showBlogImagesOnHome} 
          onChange={handleChange} 
          style={{ width: '18px', height: '18px', cursor: 'pointer' }}
        />
        <label htmlFor="showBlogImagesOnHome" style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.88rem', margin: 0 }}>
          Show Blog Cover Images on Homepage
        </label>
      </div>
      <button type="submit" className="admin-btn" style={{ padding: '10px 24px' }}>Save Settings</button>
    </form>
  );
}

// ---------------- ADMIN SLIDERS SUB-VIEW ----------------
function AdminSliders() {
  const [sliders, setSliders] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editUrl, setEditUrl] = useState('');
  const [editActive, setEditActive] = useState(true);

  useEffect(() => {
    setSliders(dbService.getSliders());
  }, []);

  const handleEdit = (slide) => {
    setEditingId(slide.id);
    setEditUrl(slide.imageUrl);
    setEditActive(slide.active);
  };

  const handleSave = (id) => {
    if (!editUrl) return;
    const updated = sliders.map(s => {
      if (s.id === id) {
        return { ...s, imageUrl: editUrl, active: editActive };
      }
      return s;
    });
    dbService.saveSliders(updated);
    setSliders(updated);
    setEditingId(null);
  };

  return (
    <div className="admin-card fade-in">
      <div className="admin-card-header">
        <span className="admin-card-title">Homepage Banner Carousel (Max 10 Images)</span>
      </div>
      <p style={{ fontSize: '0.82rem', color: 'var(--light-gray)', marginBottom: '20px' }}>Manage the banner slides that rotate just below the student navigation header.</p>
      
      <div className="admin-sliders-grid">
        {sliders.map((slide, idx) => (
          <div className="admin-slider-card" key={slide.id}>
            <div className="admin-slider-card-thumb">
              <img src={slide.imageUrl} alt={`Slide ${idx + 1}`} />
              <span className="admin-slider-card-badge">Slot {idx + 1}</span>
            </div>
            <div className="admin-slider-card-content">
              {editingId === slide.id ? (
                <>
                  <div className="admin-input-group" style={{ marginBottom: 0 }}>
                    <label>Image Source URL</label>
                    <input 
                      type="text" 
                      value={editUrl} 
                      onChange={e => setEditUrl(e.target.value)} 
                      style={{ padding: '6px', fontSize: '0.78rem' }}
                    />
                    <ImageUploadCompress 
                      value={editUrl} 
                      onChange={setEditUrl} 
                      label="Or Upload and Compress File" 
                    />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}>
                    <input 
                      type="checkbox" 
                      id={`chk-${slide.id}`} 
                      checked={editActive} 
                      onChange={e => setEditActive(e.target.checked)} 
                    />
                    <label htmlFor={`chk-${slide.id}`}>Show banner slide</label>
                  </div>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <button className="admin-btn" style={{ padding: '4px 8px', fontSize: '0.72rem' }} onClick={() => handleSave(slide.id)}>Save</button>
                    <button className="admin-btn secondary" style={{ padding: '4px 8px', fontSize: '0.72rem' }} onClick={() => setEditingId(null)}>Cancel</button>
                  </div>
                </>
              ) : (
                <>
                  <span style={{ fontSize: '0.78rem', color: slide.active ? 'var(--accent-green)' : '#ef4444', fontWeight: 600 }}>
                    {slide.active ? '● Showing' : '○ Hidden'}
                  </span>
                  <button className="admin-btn secondary" style={{ width: '100%', padding: '6px' }} onClick={() => handleEdit(slide)}>
                    Edit Slide URL
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------- ADMIN KALAM SUB-VIEW ----------------
function AdminKalam() {
  const [kalam, setKalam] = useState({ imageUrl: '' });
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setKalam(dbService.getKalam() || { imageUrl: '' });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setKalam(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dbService.saveKalam(kalam);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="admin-card fade-in" style={{ maxWidth: '600px' }}>
      <div className="admin-card-header">
        <span className="admin-card-title">APJ Abdul Kalam Banner Configuration</span>
      </div>
      {success && (
        <div style={{ backgroundColor: '#f0fdf4', color: 'var(--accent-green)', padding: '10px', borderRadius: 'var(--radius-md)', fontSize: '0.82rem', marginBottom: '15px', fontWeight: 600 }}>
          Kalam Section updated!
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="admin-input-group">
          <label>Kalam Banner Image URL / Path</label>
          <input type="text" name="imageUrl" value={kalam.imageUrl} onChange={handleChange} required />
          <ImageUploadCompress 
            value={kalam.imageUrl} 
            onChange={(val) => setKalam(prev => ({ ...prev, imageUrl: val }))} 
            label="Or Upload and Compress File" 
          />
          <span style={{ fontSize: '0.75rem', color: '#666', marginTop: '4px', display: 'block' }}>
            Set a URL or a local path. Default is <code>/kalam.jpg</code> (copied from the brochure).
          </span>
        </div>
        {kalam.imageUrl && (
          <div style={{ marginTop: '15px', marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.82rem' }}>Preview Banner:</label>
            <img src={kalam.imageUrl} alt="Kalam Banner Preview" style={{ width: '100%', maxHeight: '200px', objectFit: 'contain', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)' }} />
          </div>
        )}
        <button type="submit" className="admin-btn" style={{ padding: '10px 24px' }}>Save Updates</button>
      </form>
    </div>
  );
}

// ---------------- ADMIN COURSES SUB-VIEW ----------------
function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('class-11-12');
  const [target, setTarget] = useState('');
  const [boards, setBoards] = useState('');
  const [duration, setDuration] = useState('');
  const [schedule, setSchedule] = useState('');
  const [fee, setFee] = useState('');
  const [image, setImage] = useState('');
  const [details, setDetails] = useState('');

  // Individual visibility toggles
  const [showTarget, setShowTarget] = useState(true);
  const [showBoards, setShowBoards] = useState(true);
  const [showDuration, setShowDuration] = useState(true);
  const [showSchedule, setShowSchedule] = useState(true);
  const [showFee, setShowFee] = useState(true);
  const [showImage, setShowImage] = useState(true);
  const [showDetails, setShowDetails] = useState(true);

  const loadCoursesList = () => {
    setCourses(dbService.getCourses());
  };

  useEffect(() => {
    loadCoursesList();
  }, []);

  const handleEdit = (course) => {
    setEditingCourse(course);
    setTitle(course.title);
    setCategory(course.category);
    setTarget(course.target);
    setBoards(course.boards);
    setDuration(course.duration);
    setSchedule(course.schedule);
    setFee(course.fee);
    setImage(course.image);
    setDetails(course.details);
    
    // Default to true if property is undefined
    setShowTarget(course.showTarget !== false);
    setShowBoards(course.showBoards !== false);
    setShowDuration(course.showDuration !== false);
    setShowSchedule(course.showSchedule !== false);
    setShowFee(course.showFee !== false);
    setShowImage(course.showImage !== false);
    setShowDetails(course.showDetails !== false);
    setFormOpen(true);
  };

  const handleCreateNew = () => {
    setEditingCourse(null);
    setTitle('');
    setCategory('class-11-12');
    setTarget('');
    setBoards('');
    setDuration('');
    setSchedule('');
    setFee('');
    setImage('https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=600');
    setDetails('');
    
    setShowTarget(true);
    setShowBoards(true);
    setShowDuration(true);
    setShowSchedule(true);
    setShowFee(true);
    setShowImage(true);
    setShowDetails(true);
    setFormOpen(true);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this course from catalog?')) {
      dbService.deleteCourse(id);
      loadCoursesList();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dbService.saveCourse({
      id: editingCourse ? editingCourse.id : undefined,
      title,
      category,
      target,
      boards,
      duration,
      schedule,
      fee: Number(fee),
      image,
      details,
      showTarget,
      showBoards,
      showDuration,
      showSchedule,
      showFee,
      showImage,
      showDetails
    });
    setFormOpen(false);
    loadCoursesList();
  };

  return (
    <div className="admin-card fade-in">
      <div className="admin-card-header">
        <span className="admin-card-title">Manage Institute Courses</span>
        {!formOpen && (
          <button className="admin-btn" onClick={handleCreateNew}>
            <IconPlus /> Add Course
          </button>
        )}
      </div>

      {formOpen ? (
        <form onSubmit={handleSubmit} style={{ border: '1px solid #e2e8f0', padding: '20px', borderRadius: 'var(--radius-lg)' }}>
          <h4 style={{ marginBottom: '15px', color: 'var(--navy-dark)', fontFamily: 'var(--font-family)' }}>
            {editingCourse ? `Edit: ${editingCourse.title}` : 'Create New Course Offering'}
          </h4>
          <div className="admin-form-row">
            <div className="admin-input-group">
              <label>Course Title *</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} required />
            </div>
            <div className="admin-input-group">
              <label>Academic Tab Category *</label>
              <select value={category} onChange={e => setCategory(e.target.value)}>
                <option value="class-9-10">Class 9th & 10th (Foundations)</option>
                <option value="class-11-12">Class 11th & 12th (NEET/JEE)</option>
              </select>
            </div>
          </div>
          <div className="admin-form-row">
            <div className="admin-input-group">
              <label>Target Audience Label (e.g. 11th studying) *</label>
              <input type="text" value={target} onChange={e => setTarget(e.target.value)} placeholder="For Class 11th Studying" required />
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
                <input type="checkbox" id="chk-show-target" checked={showTarget} onChange={e => setShowTarget(e.target.checked)} />
                <label htmlFor="chk-show-target" style={{ fontSize: '0.75rem', fontWeight: 600, color: '#666', cursor: 'pointer', display: 'inline', margin: 0 }}>Show target on website</label>
              </div>
            </div>
            <div className="admin-input-group">
              <label>Board Coverage (e.g. CBSE & HBSE) *</label>
              <input type="text" value={boards} onChange={e => setBoards(e.target.value)} placeholder="CBSE, ICSE & HBSE Board Students" required />
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
                <input type="checkbox" id="chk-show-boards" checked={showBoards} onChange={e => setShowBoards(e.target.checked)} />
                <label htmlFor="chk-show-boards" style={{ fontSize: '0.75rem', fontWeight: 600, color: '#666', cursor: 'pointer', display: 'inline', margin: 0 }}>Show boards on website</label>
              </div>
            </div>
          </div>
          <div className="admin-form-row">
            <div className="admin-input-group">
              <label>Course Duration *</label>
              <input type="text" value={duration} onChange={e => setDuration(e.target.value)} placeholder="1 Year / 2 Year Course" required />
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
                <input type="checkbox" id="chk-show-duration" checked={showDuration} onChange={e => setShowDuration(e.target.checked)} />
                <label htmlFor="chk-show-duration" style={{ fontSize: '0.75rem', fontWeight: 600, color: '#666', cursor: 'pointer', display: 'inline', margin: 0 }}>Show duration on website</label>
              </div>
            </div>
            <div className="admin-input-group">
              <label>Class Weekly Schedule *</label>
              <input type="text" value={schedule} onChange={e => setSchedule(e.target.value)} placeholder="Mon - Fri (3 hrs) • Sat - Sun (3 hrs)" required />
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
                <input type="checkbox" id="chk-show-schedule" checked={showSchedule} onChange={e => setShowSchedule(e.target.checked)} />
                <label htmlFor="chk-show-schedule" style={{ fontSize: '0.75rem', fontWeight: 600, color: '#666', cursor: 'pointer', display: 'inline', margin: 0 }}>Show schedule on website</label>
              </div>
            </div>
          </div>
          <div className="admin-form-row">
            <div className="admin-input-group">
              <label>Registration Fee (INR) *</label>
              <input type="number" value={fee} onChange={e => setFee(e.target.value)} required />
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
                <input type="checkbox" id="chk-show-fee" checked={showFee} onChange={e => setShowFee(e.target.checked)} />
                <label htmlFor="chk-show-fee" style={{ fontSize: '0.75rem', fontWeight: 600, color: '#666', cursor: 'pointer', display: 'inline', margin: 0 }}>Show fee on website</label>
              </div>
            </div>
            <div className="admin-input-group">
              <label>Cover Image Source URL</label>
              <input type="text" value={image} onChange={e => setImage(e.target.value)} />
              <ImageUploadCompress 
                value={image} 
                onChange={setImage} 
                label="Or Upload and Compress File" 
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
                <input type="checkbox" id="chk-show-image" checked={showImage} onChange={e => setShowImage(e.target.checked)} />
                <label htmlFor="chk-show-image" style={{ fontSize: '0.75rem', fontWeight: 600, color: '#666', cursor: 'pointer', display: 'inline', margin: 0 }}>Show cover image on website</label>
              </div>
            </div>
          </div>
          <div className="admin-input-group">
            <label>Course Details / Description *</label>
            <textarea value={details} onChange={e => setDetails(e.target.value)} rows="3" required></textarea>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
              <input type="checkbox" id="chk-show-details" checked={showDetails} onChange={e => setShowDetails(e.target.checked)} />
              <label htmlFor="chk-show-details" style={{ fontSize: '0.75rem', fontWeight: 600, color: '#666', cursor: 'pointer', display: 'inline', margin: 0 }}>Show description text on website</label>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button type="submit" className="admin-btn">Save Course Offer</button>
            <button type="button" className="admin-btn secondary" onClick={() => setFormOpen(false)}>Cancel</button>
          </div>
        </form>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Fee (INR)</th>
                <th>Schedule</th>
                <th>Target Boards</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map(course => (
                <tr key={course.id}>
                  <td style={{ fontWeight: 600 }}>{course.title}</td>
                  <td>
                    <span className="status-badge new">
                      {course.category === 'class-11-12' ? 'Class 11-12' : 'Class 9-10'}
                    </span>
                  </td>
                  <td>₹ {course.fee.toLocaleString()}</td>
                  <td>{course.schedule}</td>
                  <td>{course.boards}</td>
                  <td>
                    <div className="table-actions">
                      <button className="table-action-btn" onClick={() => handleEdit(course)}><IconEdit /></button>
                      <button className="table-action-btn delete" onClick={() => handleDelete(course.id)}><IconTrash /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ---------------- ADMIN RESULTS / TOPPERS SUB-VIEW ----------------
function AdminResults() {
  const [results, setResults] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editingResult, setEditingResult] = useState(null);

  const [studentName, setStudentName] = useState('');
  const [examTypeSelect, setExamTypeSelect] = useState('JEE Main');
  const [customExamType, setCustomExamType] = useState('');
  const [achievement, setAchievement] = useState('');
  const [location, setLocation] = useState('');
  const [photo, setPhoto] = useState('');
  const [year, setYear] = useState('2025');

  const loadResultsList = () => setResults(dbService.getResults());

  useEffect(() => {
    loadResultsList();
  }, []);

  const handleEdit = (res) => {
    setEditingResult(res);
    setStudentName(res.studentName);
    
    const PREDEFINED = ['JEE Main', 'NEET', 'Olympiads', 'GUJ-CET'];
    if (PREDEFINED.includes(res.examType)) {
      setExamTypeSelect(res.examType);
      setCustomExamType('');
    } else {
      setExamTypeSelect('Custom');
      setCustomExamType(res.examType || '');
    }
    
    setAchievement(res.achievement);
    setLocation(res.location);
    setPhoto(res.photo);
    setYear(res.year || '2025');
    setFormOpen(true);
  };

  const handleCreateNew = () => {
    setEditingResult(null);
    setStudentName('');
    setExamTypeSelect('JEE Main');
    setCustomExamType('');
    setAchievement('');
    setLocation('State Haryana');
    setPhoto('https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200');
    setYear('2025');
    setFormOpen(true);
  };

  const handleDelete = (id) => {
    if (confirm('Delete student results record?')) {
      dbService.deleteResult(id);
      loadResultsList();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dbService.saveResult({
      id: editingResult ? editingResult.id : undefined,
      studentName,
      examType: examTypeSelect === 'Custom' ? customExamType : examTypeSelect,
      achievement,
      location,
      photo,
      year
    });
    setFormOpen(false);
    loadResultsList();
  };

  const defaultPresets = ['JEE Main', 'NEET', 'Olympiads', 'GUJ-CET'];
  const savedCategories = Array.from(new Set(results.map(r => r.examType).filter(Boolean)));
  const allCategories = Array.from(new Set([...defaultPresets, ...savedCategories]));

  return (
    <div className="admin-card fade-in">
      <div className="admin-card-header">
        <span className="admin-card-title">Manage Student Results / Toppers</span>
        {!formOpen && (
          <button className="admin-btn" onClick={handleCreateNew}>
            <IconPlus /> Add Record
          </button>
        )}
      </div>

      {formOpen ? (
        <form onSubmit={handleSubmit} style={{ border: '1px solid #e2e8f0', padding: '20px', borderRadius: 'var(--radius-lg)' }}>
          <h4 style={{ marginBottom: '15px' }}>{editingResult ? 'Edit Record' : 'Add Topper Achievement'}</h4>
          <div className="admin-form-row">
            <div className="admin-input-group">
              <label>Student Name *</label>
              <input type="text" value={studentName} onChange={e => setStudentName(e.target.value)} required />
            </div>
            <div className="admin-input-group">
              <label>Exam Category *</label>
              <select value={examTypeSelect} onChange={e => setExamTypeSelect(e.target.value)}>
                {allCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
                <option value="Custom">Custom...</option>
              </select>
              {examTypeSelect === 'Custom' && (
                <input 
                  type="text" 
                  value={customExamType} 
                  onChange={e => setCustomExamType(e.target.value)} 
                  placeholder="Type custom exam category (e.g. Board Exams, NTSE)..." 
                  style={{ marginTop: '10px' }}
                  required 
                />
              )}
            </div>
          </div>
          <div className="admin-form-row">
            <div className="admin-input-group">
              <label>Achievement (e.g. Percentile 99.99%ile, AIR 45) *</label>
              <input type="text" value={achievement} onChange={e => setAchievement(e.target.value)} required />
            </div>
            <div className="admin-input-group">
              <label>Subtext Details (e.g. State Haryana, Marks 715/720) *</label>
              <input type="text" value={location} onChange={e => setLocation(e.target.value)} required />
            </div>
          </div>
          <div className="admin-form-row">
            <div className="admin-input-group">
              <label>Student Photo URL</label>
              <input type="text" value={photo} onChange={e => setPhoto(e.target.value)} />
              <ImageUploadCompress 
                value={photo} 
                onChange={setPhoto} 
                label="Or Upload and Compress File" 
              />
            </div>
            <div className="admin-input-group" style={{ maxWidth: '150px' }}>
              <label>Academic Year *</label>
              <input type="text" value={year} onChange={e => setYear(e.target.value)} required />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" className="admin-btn">Save Record</button>
            <button type="button" className="admin-btn secondary" onClick={() => setFormOpen(false)}>Cancel</button>
          </div>
        </form>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Exam Category</th>
                <th>Year</th>
                <th>Rank / Score</th>
                <th>Details</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {results.map(res => (
                <tr key={res.id}>
                  <td style={{ fontWeight: 600 }}>{res.studentName}</td>
                  <td><span className="status-badge new">{res.examType}</span></td>
                  <td><strong>{res.year || '2025'}</strong></td>
                  <td style={{ color: 'var(--selection-blue)', fontWeight: 700 }}>{res.achievement}</td>
                  <td>{res.location}</td>
                  <td>
                    <div className="table-actions">
                      <button className="table-action-btn" onClick={() => handleEdit(res)}><IconEdit /></button>
                      <button className="table-action-btn delete" onClick={() => handleDelete(res.id)}><IconTrash /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ---------------- ADMIN PAGES SUB-VIEW ----------------
function AdminPages() {
  const [pages, setPages] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editingPage, setEditingPage] = useState(null);

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [keywords, setKeywords] = useState('');

  const loadPagesList = () => setPages(dbService.getPages());

  useEffect(() => {
    loadPagesList();
  }, []);

  const handleTitleChange = (val) => {
    setTitle(val);
    if (!editingPage) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }
  };

  const handleEdit = (page) => {
    setEditingPage(page);
    setTitle(page.title);
    setSlug(page.slug);
    setContent(page.content);
    setMetaTitle(page.metaTitle);
    setMetaDescription(page.metaDescription);
    setKeywords(page.keywords);
    setFormOpen(true);
  };

  const handleCreateNew = () => {
    setEditingPage(null);
    setTitle('');
    setSlug('');
    setContent('');
    setMetaTitle('');
    setMetaDescription('');
    setKeywords('');
    setFormOpen(true);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this custom page? It will stop ranking on google.')) {
      dbService.deletePage(id);
      loadPagesList();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dbService.savePage({
      id: editingPage ? editingPage.id : undefined,
      title,
      slug,
      content,
      metaTitle,
      metaDescription,
      keywords
    });
    setFormOpen(false);
    loadPagesList();
  };

  return (
    <div className="admin-card fade-in">
      <div className="admin-card-header">
        <span className="admin-card-title">Manage Dynamic Custom Pages</span>
        {!formOpen && (
          <button className="admin-btn" onClick={handleCreateNew}>
            <IconPlus /> Add Custom Page
          </button>
        )}
      </div>

      {formOpen ? (
        <form onSubmit={handleSubmit} style={{ border: '1px solid #e2e8f0', padding: '20px', borderRadius: 'var(--radius-lg)' }}>
          <h4 style={{ marginBottom: '15px', color: 'var(--navy-dark)', fontFamily: 'var(--font-family)' }}>
            {editingPage ? `Edit Page: ${editingPage.title}` : 'Create Dynamic Institutional Page'}
          </h4>
          <div className="admin-form-row">
            <div className="admin-input-group">
              <label>Page Header Title *</label>
              <input type="text" value={title} onChange={e => handleTitleChange(e.target.value)} required />
            </div>
            <div className="admin-input-group">
              <label>Custom URL Slug (Edit separately for short SEO URL) *</label>
              <input 
                type="text" 
                value={slug} 
                onChange={e => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, ''))} 
                placeholder="e.g. chemistry-syllabus-update" 
                required 
              />
            </div>
          </div>

          <div className="admin-card" style={{ padding: '15px', backgroundColor: '#f8fafc', marginBottom: '15px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--navy-dark)', display: 'block', marginBottom: '10px' }}>Google SEO Ranking Attributes</span>
            <div className="admin-form-row">
              <div className="admin-input-group">
                <label>Meta Search Title</label>
                <input type="text" value={metaTitle} onChange={e => setMetaTitle(e.target.value)} placeholder="Apex Jind - custom page keywords" />
              </div>
              <div className="admin-input-group">
                <label>Meta Search Keywords (comma-separated)</label>
                <input type="text" value={keywords} onChange={e => setKeywords(e.target.value)} placeholder="neet coaching jind, physics tuition, apex" />
              </div>
            </div>
            <div className="admin-input-group" style={{ marginBottom: 0 }}>
              <label>Meta Search Description (Google Snippet Description)</label>
              <input type="text" value={metaDescription} onChange={e => setMetaDescription(e.target.value)} placeholder="Brief summaries of this page displaying in google search listings." />
            </div>
          </div>

          <div className="admin-input-group">
            <label>HTML Content Body (supports HTML tags like &lt;p&gt;, &lt;h2&gt;, &lt;ul&gt;)</label>
            <textarea value={content} onChange={e => setContent(e.target.value)} rows="8" required></textarea>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" className="admin-btn">Save Custom Page</button>
            <button type="button" className="admin-btn secondary" onClick={() => setFormOpen(false)}>Cancel</button>
          </div>
        </form>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Page Title</th>
                <th>URL Slug Path</th>
                <th>SEO Keywords</th>
                <th>Last Updated</th>
                <th>Link</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pages.map(page => (
                <tr key={page.id}>
                  <td style={{ fontWeight: 600 }}>{page.title}</td>
                  <td><code>/pages/{page.slug}</code></td>
                  <td>{page.keywords || 'None'}</td>
                  <td>{new Date(page.lastUpdated).toLocaleDateString()}</td>
                  <td>
                    <a href={`/pages/${page.slug}`} target="_blank" rel="noreferrer" style={{ color: 'var(--primary-blue)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                      Open <IconExternalLink />
                    </a>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button className="table-action-btn" onClick={() => handleEdit(page)}><IconEdit /></button>
                      <button className="table-action-btn delete" onClick={() => handleDelete(page.id)}><IconTrash /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ---------------- ADMIN BLOG POSTS SUB-VIEW ----------------
function AdminPosts() {
  const [posts, setPosts] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [keywords, setKeywords] = useState('');
  const [categorySelect, setCategorySelect] = useState('JEE');
  const [customCategory, setCustomCategory] = useState('');

  const loadPostsList = () => setPosts(dbService.getPosts());

  useEffect(() => {
    loadPostsList();
  }, []);

  const handleTitleChange = (val) => {
    setTitle(val);
    if (!editingPost) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setTitle(post.title);
    setSlug(post.slug);
    setContent(post.content);
    setCoverImage(post.coverImage);
    setMetaTitle(post.metaTitle);
    setMetaDescription(post.metaDescription);
    setKeywords(post.keywords);
    
    const PREDEFINED = ['JEE', 'NEET', 'Olympiads', 'Announcements', 'Academic Guides', 'Admission Alerts'];
    if (PREDEFINED.includes(post.category)) {
      setCategorySelect(post.category);
      setCustomCategory('');
    } else {
      setCategorySelect('Custom');
      setCustomCategory(post.category || '');
    }
    
    setFormOpen(true);
  };

  const handleCreateNew = () => {
    setEditingPost(null);
    setTitle('');
    setSlug('');
    setContent('');
    setCoverImage('https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=600');
    setMetaTitle('');
    setMetaDescription('');
    setKeywords('');
    setCategorySelect('JEE');
    setCustomCategory('');
    setFormOpen(true);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this blog post/announcement?')) {
      dbService.deletePost(id);
      loadPostsList();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dbService.savePost({
      id: editingPost ? editingPost.id : undefined,
      title,
      slug,
      content,
      coverImage,
      metaTitle,
      metaDescription,
      keywords,
      category: categorySelect === 'Custom' ? customCategory : categorySelect
    });
    setFormOpen(false);
    loadPostsList();
  };

  const defaultBlogPresets = ['JEE', 'NEET', 'Olympiads', 'Announcements', 'Academic Guides', 'Admission Alerts'];
  const savedBlogCategories = Array.from(new Set(posts.map(p => p.category).filter(Boolean)));
  const allBlogCategories = Array.from(new Set([...defaultBlogPresets, ...savedBlogCategories]));

  return (
    <div className="admin-card fade-in">
      <div className="admin-card-header">
        <span className="admin-card-title">Manage News Blogs & Announcements</span>
        {!formOpen && (
          <button className="admin-btn" onClick={handleCreateNew}>
            <IconPlus /> Add Announcement
          </button>
        )}
      </div>

      {formOpen ? (
        <form onSubmit={handleSubmit} style={{ border: '1px solid #e2e8f0', padding: '20px', borderRadius: 'var(--radius-lg)' }}>
          <h4 style={{ marginBottom: '15px', color: 'var(--navy-dark)', fontFamily: 'var(--font-family)' }}>
            {editingPost ? `Edit Post: ${editingPost.title}` : 'Write Dynamic Blog Post/Update'}
          </h4>
          <div className="admin-form-row">
            <div className="admin-input-group">
              <label>Article Title *</label>
              <input type="text" value={title} onChange={e => handleTitleChange(e.target.value)} required />
            </div>
            <div className="admin-input-group">
              <label>URL Slug Path *</label>
              <input 
                type="text" 
                value={slug} 
                onChange={e => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, ''))} 
                required 
              />
            </div>
          </div>
          <div className="admin-form-row">
            <div className="admin-input-group">
              <label>Category Label *</label>
              <select value={categorySelect} onChange={e => setCategorySelect(e.target.value)}>
                {allBlogCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
                <option value="Custom">Custom...</option>
              </select>
              {categorySelect === 'Custom' && (
                <input 
                  type="text" 
                  value={customCategory} 
                  onChange={e => setCustomCategory(e.target.value)} 
                  placeholder="Type custom category name..." 
                  style={{ marginTop: '10px' }}
                  required 
                />
              )}
            </div>
            <div className="admin-input-group">
              <label>Cover Image Source URL</label>
              <input type="text" value={coverImage} onChange={e => setCoverImage(e.target.value)} />
              <ImageUploadCompress 
                value={coverImage} 
                onChange={setCoverImage} 
                label="Or Upload and Compress File" 
              />
            </div>
          </div>

          <div className="admin-card" style={{ padding: '15px', backgroundColor: '#f8fafc', marginBottom: '15px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--navy-dark)', display: 'block', marginBottom: '10px' }}>Google SEO Ranking Attributes</span>
            <div className="admin-form-row">
              <div className="admin-input-group">
                <label>Meta Search Title</label>
                <input type="text" value={metaTitle} onChange={e => setMetaTitle(e.target.value)} placeholder="Write custom title keywords" />
              </div>
              <div className="admin-input-group">
                <label>Meta Search Keywords (comma-separated)</label>
                <input type="text" value={keywords} onChange={e => setKeywords(e.target.value)} placeholder="boards prep, jee main exam" />
              </div>
            </div>
            <div className="admin-input-group" style={{ marginBottom: 0 }}>
              <label>Meta Search Description (Google Snippet Description)</label>
              <input type="text" value={metaDescription} onChange={e => setMetaDescription(e.target.value)} />
            </div>
          </div>

          <div className="admin-input-group">
            <label>HTML Content Body *</label>
            <textarea value={content} onChange={e => setContent(e.target.value)} rows="8" required></textarea>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" className="admin-btn">Publish Update</button>
            <button type="button" className="admin-btn secondary" onClick={() => setFormOpen(false)}>Cancel</button>
          </div>
        </form>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Slug Path</th>
                <th>Category</th>
                <th>Publish Date</th>
                <th>Link</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map(post => (
                <tr key={post.id}>
                  <td style={{ fontWeight: 600 }}>{post.title}</td>
                  <td><code>/posts/{post.slug}</code></td>
                  <td>
                    <span className="status-badge new">{post.category}</span>
                  </td>
                  <td>{post.publishDate}</td>
                  <td>
                    <a href={`/posts/${post.slug}`} target="_blank" rel="noreferrer" style={{ color: 'var(--primary-blue)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                      Open <IconExternalLink />
                    </a>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button className="table-action-btn" onClick={() => handleEdit(post)}><IconEdit /></button>
                      <button className="table-action-btn delete" onClick={() => handleDelete(post.id)}><IconTrash /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ---------------- ADMIN QUICK LINKS SUB-VIEW ----------------
function AdminResources() {
  const [resources, setResources] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState('');
  const [type, setType] = useState('answer-key');
  const [linkUrl, setLinkUrl] = useState('');

  const loadResources = () => setResources(dbService.getResources());

  useEffect(() => {
    loadResources();
  }, []);

  const handleEdit = (res) => {
    setEditingId(res.id);
    setTitle(res.title);
    setType(res.type);
    setLinkUrl(res.linkUrl);
  };

  const handleCreateNew = () => {
    setEditingId('new');
    setTitle('');
    setType('answer-key');
    setLinkUrl('#');
  };

  const handleDelete = (id) => {
    if (confirm('Delete this download link?')) {
      dbService.deleteResource(id);
      loadResources();
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!title || !linkUrl) return;
    dbService.saveResource({
      id: editingId === 'new' ? undefined : editingId,
      title,
      type,
      linkUrl
    });
    setEditingId(null);
    loadResources();
  };

  return (
    <div className="admin-card fade-in">
      <div className="admin-card-header">
        <span className="admin-card-title">Manage Quick Download Links</span>
        {!editingId && (
          <button className="admin-btn" onClick={handleCreateNew}>
            <IconPlus /> Add Link
          </button>
        )}
      </div>

      {editingId ? (
        <form onSubmit={handleSave} style={{ border: '1px solid #e2e8f0', padding: '15px', borderRadius: 'var(--radius-lg)', marginBottom: '20px' }}>
          <h4 style={{ marginBottom: '12px' }}>{editingId === 'new' ? 'Add Quick Resource' : 'Edit Link Details'}</h4>
          <div className="admin-form-row">
            <div className="admin-input-group">
              <label>Resource / File Title</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. JEE Main 2026 Paper Key" required />
            </div>
            <div className="admin-input-group">
              <label>Link Type</label>
              <select value={type} onChange={e => setType(e.target.value)}>
                <option value="answer-key">Answer Key & Solution</option>
                <option value="admit-card">Admit Card Alerts</option>
                <option value="news">News & Events</option>
              </select>
            </div>
          </div>
          <div className="admin-input-group">
            <label>Link Target URL</label>
            <input type="text" value={linkUrl} onChange={e => setLinkUrl(e.target.value)} required />
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="submit" className="admin-btn">Save Resource Link</button>
            <button type="button" className="admin-btn secondary" onClick={() => setEditingId(null)}>Cancel</button>
          </div>
        </form>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Resource Category</th>
                <th>Target Action URL</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {resources.map(res => (
                <tr key={res.id}>
                  <td style={{ fontWeight: 600 }}>{res.title}</td>
                  <td>
                    <span className="status-badge new" style={{ textTransform: 'capitalize' }}>
                      {res.type.replace('-', ' ')}
                    </span>
                  </td>
                  <td><code>{res.linkUrl}</code></td>
                  <td>
                    <div className="table-actions">
                      <button className="table-action-btn" onClick={() => handleEdit(res)}><IconEdit /></button>
                      <button className="table-action-btn delete" onClick={() => handleDelete(res.id)}><IconTrash /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ---------------- ADMIN LEAD ENQUIRIES SUB-VIEW ----------------
function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [courses, setCourses] = useState([]);

  const loadEnquiriesList = () => {
    setEnquiries(dbService.getEnquiries());
  };

  useEffect(() => {
    loadEnquiriesList();
    setCourses(dbService.getCourses());
  }, []);

  const handleToggleStatus = (id, currentStatus) => {
    const nextStatus = currentStatus === 'New' ? 'Contacted' : 'New';
    dbService.updateEnquiryStatus(id, nextStatus);
    loadEnquiriesList();
  };

  const handleDelete = (id) => {
    if (confirm('Remove this lead from records?')) {
      dbService.deleteEnquiry(id);
      loadEnquiriesList();
    }
  };

  const getCourseTitle = (cid) => {
    const course = courses.find(c => c.id === cid);
    return course ? course.title : 'General Enquiry';
  };

  return (
    <div className="admin-card fade-in">
      <div className="admin-card-header">
        <span className="admin-card-title">Student Admissions Leads Tracking</span>
      </div>
      <p style={{ fontSize: '0.82rem', color: 'var(--light-gray)', marginBottom: '20px' }}>These leads are generated from the student callback forms, OMR enquiry forms, and inline quick contact boxes.</p>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Mobile</th>
              <th>Parent Mobile</th>
              <th>Target Course</th>
              <th>Timestamp</th>
              <th>Admissions Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {enquiries.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: 'var(--light-gray)' }}>
                  No lead enquiries submitted yet.
                </td>
              </tr>
            ) : (
              enquiries.map(enq => (
                <tr key={enq.id}>
                  <td style={{ fontWeight: 600 }}>{enq.studentName}</td>
                  <td><a href={`tel:${enq.phone}`} style={{ color: 'var(--primary-blue)', fontWeight: 600 }}>{enq.phone}</a></td>
                  <td>{enq.parentPhone || 'Not provided'}</td>
                  <td><span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--navy-dark)' }}>{getCourseTitle(enq.courseId)}</span></td>
                  <td>{new Date(enq.timestamp).toLocaleString()}</td>
                  <td>
                    <button 
                      className={`status-badge ${enq.status === 'New' ? 'new' : 'contacted'}`}
                      style={{ border: 'none', cursor: 'pointer' }}
                      onClick={() => handleToggleStatus(enq.id, enq.status)}
                      title="Click to toggle status"
                    >
                      {enq.status} (Toggle)
                    </button>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button className="table-action-btn delete" onClick={() => handleDelete(enq.id)}><IconTrash /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------------- ADMIN SCHOLARSHIPS SUB-VIEW ----------------
function AdminScholarships() {
  const [scholarships, setScholarships] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editingSlab, setEditingSlab] = useState(null);

  const [title, setTitle] = useState('');
  const [criteria, setCriteria] = useState('');
  const [discount, setDiscount] = useState('');
  const [description, setDescription] = useState('');
  const [orderIndex, setOrderIndex] = useState(0);

  const loadList = () => {
    setScholarships(dbService.getScholarships());
  };

  useEffect(() => {
    loadList();
  }, []);

  const handleEdit = (slab) => {
    setEditingSlab(slab);
    setTitle(slab.title);
    setCriteria(slab.criteria);
    setDiscount(slab.discount);
    setDescription(slab.description);
    setOrderIndex(slab.orderIndex || 0);
    setFormOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this scholarship slab?")) {
      dbService.deleteScholarship(id);
      loadList();
    }
  };

  const handleOpenNew = () => {
    setEditingSlab(null);
    setTitle('');
    setCriteria('');
    setDiscount('');
    setDescription('');
    setOrderIndex(scholarships.length);
    setFormOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      id: editingSlab ? editingSlab.id : undefined,
      title,
      criteria,
      discount,
      description,
      orderIndex: parseInt(orderIndex) || 0
    };
    dbService.saveScholarship(payload);
    setFormOpen(false);
    loadList();
  };

  return (
    <div className="fade-in">
      <div className="admin-section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', color: 'var(--navy-blue)', margin: '0 0 4px 0', fontWeight: 800 }}>Scholarships Manager</h2>
          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--light-gray)' }}>Configure tuition fee waiver tiers based on student achievements and board marks</p>
        </div>
        <button className="admin-btn" style={{ padding: '8px 16px' }} onClick={handleOpenNew}>
          Add New Slab +
        </button>
      </div>

      {formOpen && (
        <div className="admin-card" style={{ marginBottom: '30px', border: '2px solid var(--primary-blue)' }}>
          <div className="admin-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="admin-card-title">{editingSlab ? 'Edit Scholarship Slab' : 'Add New Scholarship Slab'}</span>
            <button className="admin-btn secondary" style={{ padding: '4px 10px', fontSize: '0.75rem' }} onClick={() => setFormOpen(false)}>Cancel</button>
          </div>
          <form onSubmit={handleSubmit} style={{ marginTop: '15px' }}>
            <div className="admin-form-row">
              <div className="admin-input-group">
                <label>Scholarship Name / Title</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Board Examination Excellence" required />
              </div>
              <div className="admin-input-group">
                <label>Waiver Discount (e.g. 50% Tuition Waiver)</label>
                <input type="text" value={discount} onChange={e => setDiscount(e.target.value)} placeholder="e.g. 50% Tuition Fee Waiver" required />
              </div>
            </div>
            <div className="admin-form-row">
              <div className="admin-input-group">
                <label>Merit Criteria</label>
                <input type="text" value={criteria} onChange={e => setCriteria(e.target.value)} placeholder="e.g. >= 95% in CBSE/HBSE Class 10th or 12th" required />
              </div>
              <div className="admin-input-group" style={{ maxWidth: '150px' }}>
                <label>Sort Order Index</label>
                <input type="number" value={orderIndex} onChange={e => setOrderIndex(e.target.value)} required />
              </div>
            </div>
            <div className="admin-input-group">
              <label>Slab Description / Terms</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} rows="3" placeholder="Provide detailed guidelines about required documents or eligibility criteria..." required></textarea>
            </div>
            <button type="submit" className="admin-btn" style={{ padding: '10px 24px' }}>
              {editingSlab ? 'Update Scholarship' : 'Create Scholarship'}
            </button>
          </form>
        </div>
      )}

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Scholarship Title</th>
              <th>Waiver Discount</th>
              <th>Criteria Details</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {scholarships.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: 'var(--light-gray)' }}>
                  No scholarship slabs configured. Click "Add New Slab" to create one.
                </td>
              </tr>
            ) : (
              scholarships.map(slab => (
                <tr key={slab.id}>
                  <td style={{ fontWeight: 600 }}>{slab.orderIndex}</td>
                  <td style={{ fontWeight: 700, color: 'var(--navy-blue)' }}>{slab.title}</td>
                  <td><span className="status-badge contacted" style={{ fontSize: '0.8rem', fontWeight: 700 }}>{slab.discount}</span></td>
                  <td style={{ fontSize: '0.82rem' }}>{slab.criteria}</td>
                  <td>
                    <div className="table-actions">
                      <button className="table-action-btn edit" onClick={() => handleEdit(slab)}><IconEdit /></button>
                      <button className="table-action-btn delete" onClick={() => handleDelete(slab.id)}><IconTrash /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------------- ALL RESULTS VIEW (YEARWISE) ----------------
function AllResultsView({ navigate }) {
  const [results, setResults] = useState([]);
  const [expandedYears, setExpandedYears] = useState({});

  useEffect(() => {
    setResults(dbService.getResults());
  }, []);

  // Group results by academic year
  const grouped = results.reduce((acc, res) => {
    const yr = res.year || '2025';
    if (!acc[yr]) acc[yr] = [];
    acc[yr].push(res);
    return acc;
  }, {});

  // Sort years in descending order (newest first)
  const sortedYears = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  const toggleExpandYear = (yr) => {
    setExpandedYears(prev => ({
      ...prev,
      [yr]: !prev[yr]
    }));
  };

  return (
    <div className="fade-in student-content-wrap" style={{ marginTop: '20px', paddingBottom: '50px' }}>
      <Helmet>
        <title>Student Achievements & Results - APEX Institute</title>
        <meta name="description" content="Explore year-wise ranks and outstanding achievements of APEX students in NEET, IIT-JEE, and national Olympiads." />
      </Helmet>

      <div className="section-header" style={{ marginBottom: '40px' }}>
        <h2 className="section-title">Academic Achievements Gallery</h2>
        <p className="section-subtitle">Year-by-year honors list of our toppers who excelled in national exams</p>
      </div>

      {sortedYears.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--light-gray)' }}>
          No topper records found. Check back later!
        </div>
      ) : (
        sortedYears.map(yr => {
          const isExpanded = !!expandedYears[yr];
          const studentsToRender = isExpanded ? grouped[yr] : grouped[yr].slice(0, 8);

          return (
            <div key={yr} style={{ marginBottom: '50px' }}>
              <div style={{ 
                borderBottom: '2px solid var(--border-light)', 
                paddingBottom: '10px', 
                marginBottom: '25px',
                display: 'flex',
                alignItems: 'center',
                gap: '15px'
              }}>
                <h3 style={{ fontSize: '1.5rem', color: 'var(--navy-blue)', margin: 0, fontWeight: 800 }}>
                  Academic Year {yr}
                </h3>
                <span className="status-badge contacted" style={{ fontSize: '0.8rem', padding: '4px 10px', fontWeight: 700 }}>
                  {grouped[yr].length} Achievers
                </span>
              </div>

              <div className="results-grid">
                {studentsToRender.map(res => (
                  <div className="result-card" key={res.id}>
                    <div className="result-photo-wrap">
                      <img src={res.photo} className="result-photo" alt={res.studentName} />
                    </div>
                    <span className="result-name">{res.studentName}</span>
                    <span className="result-achievement">{res.achievement}</span>
                    <span className="result-meta">{res.location}</span>
                    <div style={{ marginTop: '8px', fontSize: '0.75rem', color: '#666', fontWeight: 600 }}>
                      Category: {res.examType}
                    </div>
                  </div>
                ))}
              </div>

              {grouped[yr].length > 8 && (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '25px' }}>
                  <button 
                    className="courses-action-btn" 
                    onClick={() => toggleExpandYear(yr)}
                    style={{ padding: '10px 24px', fontSize: '0.9rem', fontWeight: 700 }}
                  >
                    {isExpanded ? 'View Less' : `View More (Show all ${grouped[yr].length} students)`}
                  </button>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

// ---------------- ALL BLOGS VIEW ----------------
function AllBlogsView({ navigate }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    setPosts(dbService.getPosts());
  }, []);

  return (
    <div className="fade-in student-content-wrap" style={{ marginTop: '20px', paddingBottom: '50px' }}>
      <Helmet>
        <title>Latest News, Blogs & Exam Alerts - APEX Institute</title>
        <meta name="description" content="Stay updated with the latest exam alerts, prep strategies, and academic guides for IIT-JEE and NEET from APEX experts." />
      </Helmet>

      <div className="section-header" style={{ marginBottom: '40px' }}>
        <h2 className="section-title">Latest News & Blog Guides</h2>
        <p className="section-subtitle">Academic tips, exam alerts, and guides written by our senior educators</p>
      </div>

      {posts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--light-gray)' }}>
          No articles or guides published yet. Check back soon!
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
          {posts.map(post => {
            const cleanExcerpt = post.content
              ? post.content.replace(/<[^>]*>/g, '').substring(0, 160) + '...'
              : '';

            return (
              <div 
                key={post.id} 
                className="info-card" 
                style={{ 
                  flexDirection: 'column', 
                  padding: '0', 
                  overflow: 'hidden', 
                  borderRadius: 'var(--radius-lg)', 
                  border: '1px solid var(--border-light)', 
                  boxShadow: 'var(--shadow-sm)',
                  backgroundColor: '#fff',
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}
              >
                {post.coverImage && (
                  <div style={{ height: '200px', width: '100%', overflow: 'hidden' }}>
                    <img 
                      src={post.coverImage} 
                      alt={post.title} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  </div>
                )}
                <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                    {post.category && (
                      <span className="status-badge new" style={{ fontSize: '0.7rem', padding: '3px 8px' }}>
                        {post.category}
                      </span>
                    )}
                    {post.publishDate && (
                      <span style={{ fontSize: '0.75rem', color: '#666', fontWeight: 600 }}>
                        {post.publishDate}
                      </span>
                    )}
                  </div>
                  
                  <h3 style={{ 
                    fontSize: '1.25rem', 
                    color: 'var(--navy-blue)', 
                    margin: '0 0 12px 0', 
                    fontWeight: 700,
                    lineHeight: 1.4
                  }}>
                    {post.title}
                  </h3>
                  
                  <p style={{ 
                    fontSize: '0.88rem', 
                    color: 'var(--light-gray)', 
                    margin: '0 0 20px 0', 
                    lineHeight: 1.6,
                    flex: 1
                  }}>
                    {cleanExcerpt}
                  </p>
                  
                  <button 
                    className="courses-action-btn" 
                    style={{ 
                      padding: '10px 20px', 
                      fontSize: '0.85rem', 
                      alignSelf: 'flex-start',
                      width: 'auto'
                    }}
                    onClick={() => navigate(`/posts/${post.slug}`)}
                  >
                    Read Full Post
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ---------------- IMAGE UPLOAD & FRONTEND CANVAS COMPRESSION COMPONENT ----------------
function ImageUploadCompress({ value, onChange, label = "Upload Image" }) {
  const [compressing, setCompressing] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Selected file is not an image.');
      return;
    }

    setCompressing(true);
    setError(null);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1000;
        const MAX_HEIGHT = 1000;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.70);
        onChange(compressedDataUrl);
        setCompressing(false);
      };
      img.onerror = () => {
        setError('Failed to process image file.');
        setCompressing(false);
      };
    };
    reader.onerror = () => {
      setError('Failed to read image file.');
      setCompressing(false);
    };
  };

  return (
    <div style={{ marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleFileChange} 
          style={{ display: 'none' }} 
          id={`file-compress-${label.replace(/\s+/g, '-').toLowerCase()}`} 
        />
        <label 
          htmlFor={`file-compress-${label.replace(/\s+/g, '-').toLowerCase()}`} 
          className="admin-btn secondary" 
          style={{ cursor: 'pointer', padding: '6px 12px', fontSize: '0.76rem', display: 'inline-flex', alignItems: 'center', margin: 0 }}
        >
          {compressing ? '⌛ Compressing Image...' : label}
        </label>
        {value && value.startsWith('data:image') && (
          <span style={{ fontSize: '0.74rem', color: 'var(--accent-green)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
            ✓ Compressed (Ready)
          </span>
        )}
      </div>
      {error && <span style={{ fontSize: '0.72rem', color: '#ef4444', fontWeight: 500 }}>{error}</span>}
    </div>
  );
}

// ---------------- ADMIN TESTIMONIALS (STUDENT VIDEO REVIEWS) SUB-VIEW ----------------
function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);

  const [studentName, setStudentName] = useState('');
  const [examType, setExamType] = useState('JEE');
  const [rankBadge, setRankBadge] = useState('');
  const [photo, setPhoto] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [textReview, setTextReview] = useState('');

  const loadList = () => setTestimonials(dbService.getTestimonials());

  useEffect(() => {
    loadList();
  }, []);

  const handleEdit = (item) => {
    setEditingTestimonial(item);
    setStudentName(item.studentName || '');
    setExamType(item.examType || 'JEE');
    setRankBadge(item.rankBadge || '');
    setPhoto(item.photo || '');
    setVideoUrl(item.videoUrl || '');
    setTextReview(item.textReview || '');
    setFormOpen(true);
  };

  const handleCreateNew = () => {
    setEditingTestimonial(null);
    setStudentName('');
    setExamType('JEE');
    setRankBadge('');
    setPhoto('https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150');
    setVideoUrl('');
    setTextReview('');
    setFormOpen(true);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this student review?')) {
      dbService.deleteTestimonial(id);
      loadList();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dbService.saveTestimonial({
      id: editingTestimonial ? editingTestimonial.id : undefined,
      studentName,
      examType,
      rankBadge,
      photo,
      videoUrl,
      textReview
    });
    setFormOpen(false);
    loadList();
  };

  return (
    <div className="admin-card fade-in">
      <div className="admin-card-header">
        <span className="admin-card-title">Manage Toppers Student Video Reviews & Textimonials</span>
        {!formOpen && (
          <button className="admin-btn" onClick={handleCreateNew}>
            <IconPlus /> Add Review / Testimonial
          </button>
        )}
      </div>

      {formOpen ? (
        <form onSubmit={handleSubmit} style={{ border: '1px solid #e2e8f0', padding: '20px', borderRadius: 'var(--radius-lg)' }}>
          <h4 style={{ marginBottom: '15px' }}>{editingTestimonial ? 'Edit Student Review' : 'Create Student Review'}</h4>
          
          <div className="admin-form-row">
            <div className="admin-input-group">
              <label>Student Name *</label>
              <input type="text" value={studentName} onChange={e => setStudentName(e.target.value)} required />
            </div>
            <div className="admin-input-group">
              <label>Exam / Stream Type *</label>
              <input type="text" value={examType} onChange={e => setExamType(e.target.value)} placeholder="e.g. JEE Main, NEET Topper" required />
            </div>
          </div>

          <div className="admin-form-row">
            <div className="admin-input-group">
              <label>Rank / Achievement Badge (e.g. AIR 128, CBSE 98%) *</label>
              <input type="text" value={rankBadge} onChange={e => setRankBadge(e.target.value)} required />
            </div>
            <div className="admin-input-group">
              <label>YouTube Video Embed URL (Optional for video review)</label>
              <input type="text" value={videoUrl} onChange={e => setVideoUrl(e.target.value)} placeholder="e.g. https://www.youtube.com/embed/XXXXXX" />
              <span style={{ fontSize: '0.7rem', color: '#666', marginTop: '4px', display: 'block' }}>
                Must be an embed URL (with <code>/embed/</code> in it) for the video player to load.
              </span>
            </div>
          </div>

          <div className="admin-form-row">
            <div className="admin-input-group">
              <label>Student Profile Image URL</label>
              <input type="text" value={photo} onChange={e => setPhoto(e.target.value)} />
              <ImageUploadCompress 
                value={photo} 
                onChange={setPhoto} 
                label="Or Upload and Compress Student Photo File" 
              />
            </div>
            <div className="admin-input-group">
              {photo && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label>Photo Preview:</label>
                  <img src={photo} alt="Student Preview" style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }} />
                </div>
              )}
            </div>
          </div>

          <div className="admin-input-group">
            <label>Text Review / Testimonial Write-up *</label>
            <textarea value={textReview} onChange={e => setTextReview(e.target.value)} rows={4} required placeholder="Write student experience story here..." />
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" className="admin-btn">Save Review</button>
            <button type="button" className="admin-btn secondary" onClick={() => setFormOpen(false)}>Cancel</button>
          </div>
        </form>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Photo</th>
                <th>Student Name</th>
                <th>Exam Category</th>
                <th>Rank Badge</th>
                <th>Video</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {testimonials.map(item => (
                <tr key={item.id}>
                  <td>
                    <img src={item.photo} alt={item.studentName} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                  </td>
                  <td style={{ fontWeight: 600, color: 'var(--navy-dark)' }}>{item.studentName}</td>
                  <td>{item.examType}</td>
                  <td>
                    <span className="status-badge new">{item.rankBadge}</span>
                  </td>
                  <td>{item.videoUrl ? '🎥 Yes (YouTube)' : '✍️ Text Only'}</td>
                  <td>
                    <div className="table-actions">
                      <button className="table-action-btn" onClick={() => handleEdit(item)} title="Edit Record">
                        <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>
                      </button>
                      <button className="table-action-btn delete" onClick={() => handleDelete(item.id)} title="Delete Record">
                        <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {testimonials.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '20px', color: 'var(--light-gray)' }}>
                    No student reviews found. Click "Add Review" to create your first topper success story!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
