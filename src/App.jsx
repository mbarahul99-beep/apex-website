import React, { useState, useEffect } from 'react';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { dbService } from './services/dbService';
import { isDefault } from './services/firebase';
import './css/main.css';
// admin.css is imported inside AdminPanel.jsx to keep it out of the critical path

// SVG Icons and shared utilities from standalone module
import { 
  IconPhone, 
  IconHome, 
  IconBook, 
  IconShare, 
  IconChevronLeft,
  IconChevronRight, 
  IconPlay, 
  IconClose, 
  IconMenu, 
  IconPlus, 
  IconEdit, 
  IconTrash, 
  IconExternalLink, 
  IconCheck, 
  IconStar, 
  IconUser, 
  getLogoSrc, 
  getEmbedVideoUrl 
} from './components/icons';

// Lazy-load the heavy Administrative Panel chunk
const AdminPanel = React.lazy(() => import('./components/AdminPanel'));

// Resilient Error Boundary to ensure admin dashboard never shows blank screen
class AdminErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("AdminPanel loading/rendering error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '60px 20px', maxWidth: '600px', margin: '40px auto', textAlign: 'center', background: '#fff', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <h2 style={{ color: '#dc2626', marginBottom: '12px' }}>Admin Dashboard Encountered an Error</h2>
          <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '20px' }}>
            {this.state.error?.message || 'An unexpected error occurred while loading the admin interface.'}
          </p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button 
              onClick={() => window.location.reload()} 
              style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
            >
              Reload Dashboard
            </button>
            <button 
              onClick={() => this.props.navigate('/')} 
              style={{ background: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
            >
              Back to Home
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [settings, setSettings] = useState(() => dbService.getSettings());
  
  // Modals state
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const [selectedCourseForEnquiry, setSelectedCourseForEnquiry] = useState(null);
  const [videoModalUrl, setVideoModalUrl] = useState(null);
  const [selectedCourseDetails, setSelectedCourseDetails] = useState(null);

  // Background database sync (Stale-While-Revalidate - frame 0 instant open)
  useEffect(() => {
    const unsubscribe = dbService.subscribe(() => {
      setSettings(dbService.getSettings());
    });
    dbService.init().then(() => {
      setSettings(dbService.getSettings());
    });
    return () => unsubscribe();
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
    viewComponent = (
      <AdminErrorBoundary navigate={navigate}>
        <React.Suspense fallback={
          <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
            <div style={{ textAlign: 'center' }}>
              <div className="spinner" style={{ width: '32px', height: '32px', border: '3px solid #cbd5e1', borderTopColor: '#2563eb', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 14px' }}></div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Loading Management Console...</div>
            </div>
          </div>
        }>
          <AdminPanel navigate={navigate} onUpdateSettings={setSettings} />
        </React.Suspense>
      </AdminErrorBoundary>
    );
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
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: '0 0 12px 12px' }}
                  src={getEmbedVideoUrl(videoModalUrl)}
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
                  {/* Fee system removed */}
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

// Helper to make sure custom width/height inputs have units (e.g. px)
const getUnitValue = (val, fallback) => {
  if (!val) return fallback;
  const clean = val.toString().trim();
  if (/^\d+$/.test(clean)) return clean + 'px';
  return clean;
};

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
          <div className="header-left" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }} onClick={() => navigate('/')}>
            <img 
              src={getLogoSrc(settings.logoUrl || settings.logoNameUrl || '/logo_full.png')} 
              className="header-logo-text" 
              alt={settings.instituteName || "APEX INSTITUTE"} 
              fetchPriority="high"
              loading="eager"
              style={{ 
                '--logo-width': getUnitValue(settings.logoWidth, '260px'),
                '--logo-height': getUnitValue(settings.logoHeight, '34px'),
                width: 'auto',
                height: 'var(--logo-height, 34px)',
                maxWidth: 'var(--logo-width, 260px)',
                objectFit: 'contain',
                padding: '2px 0'
              }} 
              onError={(e) => { 
                if (!e.target.src.includes('/logo_full.png')) {
                  e.target.src = '/logo_full.png?v=2';
                }
              }} 
            />
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
                <img src={getLogoSrc(settings.logoUrl || settings.logoNameUrl || '/logo.png')} alt="APEX Logo" onError={(e) => { if (!e.target.src.includes('/logo.png')) { e.target.src = '/logo.png?v=2'; } }} />
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
              &copy; {new Date().getFullYear()} {settings.instituteName}. All Rights Reserved. Designed professionally.
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

// ---------------- TESTIMONIAL CARD COMPONENT ----------------
function TestimonialCard({ item, onPlayVideo }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const text = item.textReview || '';
  const isLongText = text.length > 115;
  const displayedText = (isLongText && !isExpanded) ? text.slice(0, 115).trim() + '...' : text;
  const hasVideo = Boolean(item.videoUrl && item.videoUrl.trim());

  return (
    <div className={`testimonial-card ${hasVideo ? 'testimonial-card-with-video' : ''}`}>
      {/* Prominent Video Placeholder Container */}
      {hasVideo && (
        <div 
          className="testimonial-video-box"
          onClick={() => onPlayVideo(item.videoUrl)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onPlayVideo(item.videoUrl);
            }
          }}
          aria-label={`Watch video review from ${item.studentName}`}
        >
          {item.photo ? (
            <img 
              src={item.photo} 
              className="testimonial-video-bg" 
              alt={item.studentName} 
              loading="lazy"
            />
          ) : (
            <div className="testimonial-video-bg-placeholder">
              <span>{item.studentName?.[0] || 'A'}</span>
            </div>
          )}
          
          <div className="testimonial-video-scrim"></div>

          {/* Video Badge / Tag */}
          <div className="testimonial-video-tag">
            <span className="testimonial-video-tag-pulse"></span>
            <span>Watch Video Story</span>
          </div>

          {/* Large Center Play Button */}
          <div className="testimonial-play-btn-large">
            <div className="testimonial-play-btn-circle" title="Click to play video">
              <IconPlay />
            </div>
          </div>

          {/* Bottom Action Bar */}
          <div className="testimonial-video-bar">
            <span>Student Interview</span>
            <span className="testimonial-video-action">Play Video &#9654;</span>
          </div>
        </div>
      )}

      {/* Top Student Info */}
      <div className="testimonial-header">
        <div className="testimonial-author-wrap">
          {item.photo && (
            <img 
              src={item.photo} 
              className="testimonial-avatar" 
              alt={item.studentName} 
              loading="lazy" 
            />
          )}
          <div className="testimonial-student-info">
            <span className="testimonial-name">{item.studentName}</span>
            {item.examType && (
              <span className="testimonial-exam">{item.examType}</span>
            )}
          </div>
        </div>
        {item.rankBadge && (
          <span className="testimonial-rank-badge">{item.rankBadge}</span>
        )}
      </div>

      {/* Star Rating for Credibility */}
      <div className="testimonial-stars" aria-label="5 star rating">
        &#9733;&#9733;&#9733;&#9733;&#9733;
      </div>

      {/* Review Text Body with Extension Button */}
      <div className="testimonial-body">
        <p className="testimonial-text">
          "{displayedText}"
        </p>

        {isLongText && (
          <button 
            type="button" 
            className="testimonial-expand-btn"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            aria-expanded={isExpanded}
          >
            {isExpanded ? (
              <>Show Less <span className="btn-chevron">&#9650;</span></>
            ) : (
              <>Read Full Review <span className="btn-chevron">&#9660;</span></>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

// ---------------- HOME VIEW ----------------
function HomeView({ settings, navigate, openEnquiry, setVideoModalUrl, setSelectedCourseDetails }) {
  // Synchronous frame-0 cache initialization (instant open with no blank state)
  const [sliders, setSliders] = useState(() => dbService.getSliders().filter(s => s.active));
  const [courses, setCourses] = useState(() => dbService.getCourses());
  const [resources, setResources] = useState(() => dbService.getResources());
  const [testimonials, setTestimonials] = useState(() => dbService.getTestimonials());
  const [results, setResults] = useState(() => dbService.getResults());
  const [alumni, setAlumni] = useState(() => dbService.getAlumni());
  const [showAllAlumni, setShowAllAlumni] = useState(false);
  const [posts, setPosts] = useState(() => dbService.getPosts());
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Results active filter
  const [activeResultTab, setActiveResultTab] = useState('all');

  const refreshHomeData = () => {
    setSliders(dbService.getSliders().filter(s => s.active));
    setCourses(dbService.getCourses());
    setResources(dbService.getResources());
    setTestimonials(dbService.getTestimonials());
    setResults(dbService.getResults());
    setAlumni(dbService.getAlumni());
    setPosts(dbService.getPosts());
  };

  useEffect(() => {
    refreshHomeData();
    const unsubscribe = dbService.subscribe(() => {
      refreshHomeData();
    });
    return () => unsubscribe();
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
    <div className="fade-in">
      {/* 10-Image Banner Slideshow Section (Full Width) */}
      {settings.showSliders !== false && sliders.length > 0 && (
        <section className="slider-container" style={{ borderRadius: '0', marginTop: '0', boxShadow: 'none' }}>
          <div 
            className="slider-wrapper" 
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {sliders.map((slide, idx) => (
              <div className="slide" key={slide.id || idx}>
                <picture style={{ width: '100%', height: '100%', display: 'block' }}>
                  <source media="(max-width: 767px)" srcSet={slide.mobileImageUrl || slide.imageUrl} />
                  <img 
                    src={slide.imageUrl} 
                    alt={`Apex Banner Slide ${idx + 1}`} 
                    loading={idx === 0 ? "eager" : "lazy"}
                    fetchpriority={idx === 0 ? "high" : "auto"}
                    decoding={idx === 0 ? "sync" : "async"}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '0' }} 
                  />
                </picture>
              </div>
            ))}
          </div>
          
          {sliders.length > 1 && (
            <>
              <button 
                className="slider-arrow left" 
                onClick={handlePrevSlide}
                aria-label="Previous Slide"
              >
                <IconChevronLeft />
              </button>
              <button 
                className="slider-arrow right" 
                onClick={handleNextSlide}
                aria-label="Next Slide"
              >
                <IconChevronRight />
              </button>
              
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

      {/* Kalam Banner Section removed */}

      {/* Main homepage container wrapper */}
      <div className="student-content-wrap" style={{ marginTop: '20px' }}>
        {/* Large Banner Intro */}
      <section className="hero-title-section" style={{ borderBottom: 'none' }}>
        <h1 className="hero-heading">
          India's Best Coaching for<br />
          <span>NEET, JEE & FOUNDATIONS</span>
        </h1>
        <p className="hero-subheading">{settings.tagline}</p>
      </section>

      {/* Value Proposition Info Card */}
      {settings.showInfoCard !== false && (
        <section className="info-section" style={{ borderRadius: 'var(--radius-lg)', borderBottom: 'none', marginBottom: '20px' }}>
          <div className="info-card">
            <div className="info-card-text-wrap">
              <span className="info-card-title">24/7 Academic Study Partner</span>
              <p className="info-card-text">Access standard practice test banks, offline subjective OMR grading, and personalized analytics for a complete competitive edge.</p>
            </div>
            <div className="info-card-image-wrap">
              <img src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=600" className="info-card-image" alt="Apex Study Partner Portal Mockup" loading="lazy" decoding="async" />
            </div>
          </div>
        </section>
      )}

      {/* Featured Courses */}
      {settings.showFeaturedCourses !== false && (
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
                    <img src={course.image} alt={course.title} loading="lazy" decoding="async" />
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

                  <div className="course-footer" style={{ display: 'flex', gap: '8px', width: '100%', marginTop: '10px' }}>
                    <button className="enrol-btn secondary" style={{ flex: 1, padding: '10px', fontSize: '0.8rem', backgroundColor: '#e2e8f0', color: 'var(--navy-dark)', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: 600, textAlign: 'center' }} onClick={() => setSelectedCourseDetails(course)}>View Details</button>
                    <button className="enrol-btn" style={{ flex: 1, padding: '10px', fontSize: '0.8rem', textAlign: 'center' }} onClick={() => openEnquiry(course)}>Enrol now</button>
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
      )}

      {/* Our Excellent Results Section */}
      {settings.showToppers !== false && results.length > 0 && (
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
                  <img 
                    src={res.photo} 
                    className={`result-photo ${res.photoFit ? `fit-${res.photoFit}` : 'fit-contain'}`} 
                    alt={res.studentName} 
                    loading="lazy"
                  />
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

      {/* Our Proud Alumni Network Section */}
      {settings.showAlumni !== false && alumni.length > 0 && (
        <section className="alumni-section">
          <div className="section-header">
            <h2 className="section-title">Our Proud Alumni Network</h2>
            <p className="section-subtitle">Inspiring journeys of Apex stars studying and graduating from India's premier institutes</p>
          </div>

          <div className="alumni-grid">
            {(showAllAlumni ? alumni : alumni.slice(0, 5)).map(alm => {
              const degreeRole = [alm.course, alm.currentRole]
                .filter(Boolean)
                .filter((v, i, a) => a.indexOf(v) === i)
                .join(', ') || alm.currentRole || alm.course || '';

              return (
                <div className="alumni-card" key={alm.id}>
                  <div className="alumni-photo-wrap">
                    <img 
                      src={alm.photo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400"} 
                      className={`alumni-photo ${alm.photoFit ? `fit-${alm.photoFit}` : 'fit-contain'}`} 
                      alt={alm.name || 'Alumni'} 
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400";
                      }}
                    />
                  </div>
                  {alm.name && <span className="alumni-name">{alm.name}</span>}
                  {degreeRole && (
                    <span className="alumni-role">{degreeRole}</span>
                  )}
                  {alm.college && (
                    <span className="alumni-college">{alm.college}</span>
                  )}
                  {alm.batch && (
                    <span className="alumni-batch">{alm.batch.toString().startsWith('Batch') ? alm.batch : `Batch ${alm.batch}`}</span>
                  )}
                </div>
              );
            })}
          </div>

          {alumni.length > 5 && (
            <div className="view-more-container">
              <button 
                className="view-more-btn"
                onClick={() => setShowAllAlumni(!showAllAlumni)}
              >
                {showAllAlumni ? (
                  <>
                    Show Top 5 Alumni
                    <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: 16, height: 16 }}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" /></svg>
                  </>
                ) : (
                  <>
                    View More Alumni ({alumni.length - 5} More)
                    <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: 16, height: 16 }}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                  </>
                )}
              </button>
            </div>
          )}
        </section>
      )}

      {/* Do More quick links */}
      {settings.showQuickLinks !== false && (
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
      )}

      {/* Latest News & Announcements Section */}
      {settings.showBlogs !== false && posts.length > 0 && (
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
                        loading="lazy"
                        decoding="async"
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
                      Read Full Guide &rarr;
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
      {settings.showTestimonials !== false && testimonials.length > 0 && (
        <section className="testimonials-section">
          <div className="section-header">
            <h2 className="section-title">What Students Say</h2>
            <p className="section-subtitle">Read success reviews from our toppers</p>
          </div>

          <div className="testimonials-scroll">
            {testimonials.map(item => (
              <TestimonialCard 
                key={item.id} 
                item={item} 
                onPlayVideo={setVideoModalUrl} 
              />
            ))}
          </div>
        </section>
      )}

      {/* Enquiry Form */}
      {settings.showEnquiryInline !== false && (
        <section className="contact-section">
          <div className="contact-section-inner" style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '100%', maxWidth: '500px' }}>
              <EnquiryInlineForm />
            </div>
          </div>
        </section>
      )}
      </div>
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

              <div className="course-footer" style={{ display: 'flex', gap: '8px', width: '100%', marginTop: '10px' }}>
                <button className="enrol-btn secondary" style={{ flex: 1, padding: '10px', fontSize: '0.8rem', backgroundColor: '#e2e8f0', color: 'var(--navy-dark)', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: 600, textAlign: 'center' }} onClick={() => setSelectedCourseDetails(course)}>View Details</button>
                <button className="enrol-btn" style={{ flex: 1, padding: '10px', fontSize: '0.8rem', textAlign: 'center' }} onClick={() => openEnquiry(course)}>Enrol now</button>
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
                      <img 
                        src={res.photo} 
                        className={`result-photo ${res.photoFit ? `fit-${res.photoFit}` : 'fit-contain'}`} 
                        alt={res.studentName} 
                        loading="lazy"
                      />
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
