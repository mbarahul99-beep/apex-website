import React, { useState, useEffect } from 'react';
import '../css/admin.css';
import { dbService } from '../services/dbService';
import { isDefault } from '../services/firebase';
import { 
  IconBook, 
  IconStar, 
  IconEdit, 
  IconPlus, 
  IconTrash, 
  IconExternalLink, 
  IconClose, 
  getLogoSrc,
  getUnitValue 
} from './icons';
function AdminPanel({ navigate, onUpdateSettings }) {
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

  const handleGoogleLogin = async () => {
    try {
      const success = await dbService.loginWithGoogle();
      if (success) {
        setIsLogged(true);
        setLoginError('');
      }
    } catch (err) {
      setLoginError(err.message || 'Google Sign-In failed.');
    }
  };

  if (!isLogged) {
    return (
      <div className="admin-login-container">
        <div className="admin-login-card">
          <div className="admin-login-header">
            <span className="admin-login-title">APEX ADMIN SYSTEM</span>
          </div>
          {loginError && <div className="admin-login-error">{loginError}</div>}
          
          {!isDefault && (
            <>
              <button 
                type="button"
                className="admin-btn secondary"
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '10px', 
                  backgroundColor: '#fff', 
                  color: '#1f2937', 
                  border: '1px solid #d1d5db',
                  fontWeight: '600',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  marginBottom: '15px'
                }}
                onClick={handleGoogleLogin}
              >
                <svg style={{ width: '18px', height: '18px' }} viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.9h6.6c-.3 1.55-1.18 2.87-2.5 3.75v3.1h4c2.33-2.15 3.65-5.32 3.65-8.68z" />
                  <path fill="#34A853" d="M12 24c3.24 0 5.97-1.07 7.96-2.92l-4-3.1c-1.12.75-2.55 1.2-3.96 1.2-3.05 0-5.63-2.06-6.55-4.83H1.3l-4 3.1A11.96 11.96 0 0012 24z" />
                  <path fill="#FBBC05" d="M5.45 14.35A7.16 7.16 0 015 12c0-.82.15-1.62.4-2.38V6.52H1.3A11.94 11.94 0 000 12c0 2.12.55 4.12 1.5 5.85l3.95-3.5z" />
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.6 4.6 1.8l3.43-3.43C17.95 1.19 15.24 0 12 0A11.96 11.96 0 001.3 6.52l4.15 3.23c.92-2.77 3.5-4.83 6.55-4.83z" />
                </svg>
                Sign in with Google
              </button>
              <div style={{ display: 'flex', alignItems: 'center', margin: '15px 0', color: '#9ca3af' }}>
                <hr style={{ flex: 1, borderColor: '#e5e7eb', borderStyle: 'solid', borderWidth: '1px 0 0 0' }} />
                <span style={{ padding: '0 10px', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>or use password</span>
                <hr style={{ flex: 1, borderColor: '#e5e7eb', borderStyle: 'solid', borderWidth: '1px 0 0 0' }} />
              </div>
            </>
          )}
          
          <form onSubmit={handleLogin}>
            <div className="admin-input-group">
              <label>{isDefault ? "Admin Username" : "Admin Email"}</label>
              <input 
                type={isDefault ? "text" : "email"} 
                value={username} 
                onChange={e => setUsername(e.target.value)}
                placeholder={isDefault ? "Enter username (admin)" : "Enter admin email address"}
                required 
              />
            </div>
            <div className="admin-input-group">
              <label>Admin Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)}
                placeholder={isDefault ? "Enter password (apex2026)" : "Enter account password"}
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
          {/* Kalam tab removed */}
          <div className={`admin-nav-item ${activeTab === 'courses' ? 'active' : ''}`} onClick={() => setActiveTab('courses')}>
            <IconBook />
            Courses Manager
          </div>
          <div className={`admin-nav-item ${activeTab === 'results' ? 'active' : ''}`} onClick={() => setActiveTab('results')}>
            <IconStar />
            Results Manager
          </div>
          <div className={`admin-nav-item ${activeTab === 'alumni' ? 'active' : ''}`} onClick={() => setActiveTab('alumni')}>
            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342M12 2.25V9.75m0-7.25c.01-.2.03-.4.07-.6M12 9.75c.01.2.03.4.07.6" /></svg>
            Alumni Network
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
              <span style={{ fontSize: '1.25rem' }}>âš ï¸</span>
              <div style={{ fontSize: '0.85rem', color: '#92400e', lineHeight: '1.4' }}>
                <strong>Database is disconnected (using local browser storage).</strong> To save your updates permanently and sync across all devices, paste your Firebase config in <code>src/services/firebaseConfig.js</code> in your code repository.
              </div>
            </div>
          ) : (
            <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #dcfce7', padding: '12px 18px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <span style={{ fontSize: '1.25rem' }}>ðŸ”¥</span>
              <div style={{ fontSize: '0.85rem', color: '#166534', lineHeight: '1.4' }}>
                <strong>Connected to Firebase Firestore.</strong> Your data is synchronized in real-time and saved permanently in your Google Cloud account.
              </div>
            </div>
          )}
          {activeTab === 'overview' && <AdminOverview setActiveTab={setActiveTab} onUpdateSettings={onUpdateSettings} />}
          {activeTab === 'sliders' && <AdminSliders />}
          {/* Kalam tab removed */}
          {activeTab === 'courses' && <AdminCourses />}
          {activeTab === 'results' && <AdminResults />}
          {activeTab === 'alumni' && <AdminAlumni />}
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
function AdminOverview({ setActiveTab, onUpdateSettings }) {
  const [stats, setStats] = useState({ courses: 0, enquiries: 0, pages: 0, posts: 0, alumni: 0 });

  useEffect(() => {
    setStats({
      courses: dbService.getCourses().length,
      enquiries: dbService.getEnquiries().length,
      pages: dbService.getPages().length,
      posts: dbService.getPosts().length,
      alumni: dbService.getAlumni().length
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
        <div className="admin-stat-card" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('alumni')}>
          <div className="admin-stat-icon-wrap" style={{ backgroundColor: '#f0fdf4', color: '#16a34a' }}>
            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ width: 24, height: 24 }}><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342M12 2.25V9.75m0-7.25c.01-.2.03-.4.07-.6M12 9.75c.01.2.03.4.07.6" /></svg>
          </div>
          <div className="admin-stat-info">
            <span className="admin-stat-val">{stats.alumni}</span>
            <span className="admin-stat-lbl">Alumni Network</span>
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
        
        <SettingsForm onUpdateSettings={onUpdateSettings} />
      </div>
    </div>
  );
}

// ---------------- ADMIN SETTINGS FORM ----------------
function SettingsForm({ onUpdateSettings }) {
  const [settings, setSettings] = useState(dbService.getSettings());
  const [success, setSuccess] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const updated = { 
      ...settings, 
      [name]: type === 'checkbox' ? checked : value 
    };
    setSettings(updated);
    if (name === 'logoHeight' || name === 'logoWidth') {
      dbService.saveSettings(updated).catch(err => console.warn("Slider save error:", err));
      if (onUpdateSettings) onUpdateSettings(updated);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveError(null);
    try {
      const payload = {
        ...settings,
        logoUrl: settings.logoUrl || settings.logoNameUrl || '/logo_full.png',
        logoNameUrl: settings.logoUrl || settings.logoNameUrl || '/logo_full.png'
      };
      const saved = await dbService.saveSettings(payload);
      if (onUpdateSettings) onUpdateSettings(saved);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 3500);
    } catch (err) {
      console.error("Save settings error:", err);
      setSaveError(err.message || 'Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {success && (
        <div style={{ backgroundColor: '#f0fdf4', color: 'var(--accent-green)', padding: '12px', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', marginBottom: '15px', fontWeight: 600, border: '1px solid #bbf7d0' }}>
          âœ“ System Settings & Header Logo Saved Successfully!
        </div>
      )}
      {saveError && (
        <div style={{ backgroundColor: '#fef2f2', color: '#dc2626', padding: '12px', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', marginBottom: '15px', fontWeight: 600, border: '1px solid #fecaca' }}>
          âš ï¸ {saveError}
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
      
      {/* SINGLE BRANDING LOGO & SCROLLABLE ADJUSTMENTS */}
      <h4 style={{ margin: '20px 0 10px 0', borderBottom: '1px solid var(--border-light)', paddingBottom: '8px', color: 'var(--navy-blue)', fontSize: '0.95rem', fontWeight: 700 }}>Header Logo & Size Adjustments</h4>
      <p style={{ fontSize: '0.82rem', color: 'var(--light-gray)', marginBottom: '15px' }}>
        Upload your main institutional logo and use the scrollable sliders below to fine-tune logo width and height for crisp, pixel-perfect display.
      </p>

      <div className="admin-card" style={{ padding: '18px', backgroundColor: '#ffffff', borderRadius: 'var(--radius-lg)', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div>
            <h5 style={{ margin: 0, color: 'var(--navy-blue)', fontSize: '0.9rem', fontWeight: 700 }}>Direct Logo File Upload</h5>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Upload new logo image directly from your computer or enter custom URL</span>
          </div>
          <button 
            type="button" 
            className="admin-btn secondary"
            style={{ padding: '4px 10px', fontSize: '0.75rem' }}
            onClick={async () => {
              const resetObj = { ...settings, logoUrl: '/logo_full.png', logoNameUrl: '/logo_full.png' };
              setSettings(resetObj);
              if (onUpdateSettings) onUpdateSettings(resetObj);
              await dbService.saveSettings(resetObj).catch(() => {});
              setSuccess(true);
              setTimeout(() => setSuccess(false), 3000);
            }}
            title="Reset to default high-res logo"
          >
            â†º Reset Default Logo
          </button>
        </div>

        <LogoUploadCompress 
          value={settings.logoUrl} 
          onChange={async (val) => {
            const updated = { ...settings, logoUrl: val, logoNameUrl: val };
            setSettings(updated);
            if (onUpdateSettings) onUpdateSettings(updated);
            try {
              await dbService.saveSettings(updated);
              setSuccess(true);
              setTimeout(() => setSuccess(false), 3500);
            } catch (err) {
              console.error("Auto-save logo error:", err);
              setSaveError("Failed to save logo to database: " + (err.message || err));
            }
          }} 
          label="Click to Choose & Upload New Logo Image" 
        />

        <div style={{ marginTop: '12px' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Or Custom Logo URL Path:</label>
          <input 
            type="text" 
            name="logoUrl" 
            value={settings.logoUrl || ''} 
            onChange={(e) => {
              const val = e.target.value;
              setSettings(prev => ({ ...prev, logoUrl: val, logoNameUrl: val }));
            }} 
            placeholder="e.g. /logo_full.png" 
            style={{ fontSize: '0.82rem', padding: '6px 10px', marginTop: '4px' }}
          />
        </div>
      </div>

      <div className="admin-card" style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: 'var(--radius-lg)', border: '1px solid #e2e8f0', margin: '15px 0 20px 0' }}>
        <h5 style={{ margin: '0 0 12px 0', color: 'var(--navy-blue)', fontSize: '0.88rem', fontWeight: 700 }}>Scrollable Size Adjustments</h5>
        <div className="admin-form-row" style={{ gap: '20px' }}>
          {/* Height Range Slider */}
          <div className="admin-input-group" style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ margin: 0 }}>Logo Display Height</label>
              <span className="status-badge new" style={{ fontFamily: 'monospace', fontWeight: 700 }}>
                {parseInt(settings.logoHeight || '34', 10) || 34}px
              </span>
            </div>
            <input 
              type="range" 
              min="15" 
              max="120" 
              step="1"
              value={parseInt(settings.logoHeight || '34', 10) || 34} 
              onChange={(e) => {
                const val = e.target.value + 'px';
                setSettings(prev => {
                  const updated = { ...prev, logoHeight: val };
                  dbService.saveSettings(updated);
                  if (onUpdateSettings) onUpdateSettings(updated);
                  return updated;
                });
              }}
              style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--accent-red)' }}
            />
            <span style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '4px' }}>
              Scroll / drag slider to adjust logo height (15px to 120px)
            </span>
          </div>

          {/* Width Range Slider */}
          <div className="admin-input-group" style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ margin: 0 }}>Logo Max Display Width</label>
              <span className="status-badge new" style={{ fontFamily: 'monospace', fontWeight: 700 }}>
                {parseInt(settings.logoWidth || '260', 10) || 260}px
              </span>
            </div>
            <input 
              type="range" 
              min="80" 
              max="600" 
              step="5"
              value={parseInt(settings.logoWidth || '260', 10) || 260} 
              onChange={(e) => {
                const val = e.target.value + 'px';
                setSettings(prev => {
                  const updated = { ...prev, logoWidth: val };
                  dbService.saveSettings(updated);
                  if (onUpdateSettings) onUpdateSettings(updated);
                  return updated;
                });
              }}
              style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--navy-blue)' }}
            />
            <span style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '4px' }}>
              Scroll / drag slider to adjust logo max-width (100px to 600px)
            </span>
          </div>
        </div>

        {/* Live Realtime Header Preview (Desktop & Mobile) */}
        <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid #e2e8f0' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '10px', color: 'var(--navy-blue)' }}>
            Live Realtime Header Logo Previews (Desktop & Mobile):
          </span>
          
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            {/* Desktop Preview */}
            <div style={{ flex: 2, minWidth: '260px' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '4px' }}>
                Desktop Header Preview ({getUnitValue(settings.logoHeight, '56px')})
              </span>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                backgroundColor: '#06101e', 
                padding: '12px 20px', 
                border: '1px solid #cbd5e1', 
                borderRadius: 'var(--radius-md)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                overflowX: 'auto'
              }}>
                <img 
                  src={getLogoSrc(settings.logoUrl || settings.logoNameUrl || '/logo_full.png')} 
                  alt="Desktop Logo Preview" 
                  style={{ 
                    height: getUnitValue(settings.logoHeight, '56px'), 
                    maxWidth: getUnitValue(settings.logoWidth, '360px'), 
                    width: 'auto', 
                    objectFit: 'contain',
                    imageRendering: '-webkit-optimize-contrast',
                    display: 'block'
                  }} 
                />
              </div>
            </div>

            {/* Mobile Preview */}
            <div style={{ flex: 1, minWidth: '220px' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '4px' }}>
                Mobile Screen Preview (~{Math.round((parseInt(settings.logoHeight || '56', 10) || 56) * 0.82)}px)
              </span>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                backgroundColor: '#06101e', 
                padding: '8px 12px', 
                border: '1px solid #cbd5e1', 
                borderRadius: 'var(--radius-md)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                overflowX: 'auto'
              }}>
                <img 
                  src={getLogoSrc(settings.logoUrl || settings.logoNameUrl || '/logo_full.png')} 
                  alt="Mobile Logo Preview" 
                  style={{ 
                    height: `calc(${getUnitValue(settings.logoHeight, '56px')} * 0.82)`, 
                    maxWidth: getUnitValue(settings.logoWidth, '360px'), 
                    width: 'auto', 
                    objectFit: 'contain',
                    imageRendering: '-webkit-optimize-contrast',
                    display: 'block'
                  }} 
                />
              </div>
            </div>
          </div>
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
      <div className="admin-input-group">
        <label>Authorized Google Sign-in Admin Emails (Comma separated)</label>
        <input 
          type="text" 
          name="allowedAdminEmails" 
          value={settings.allowedAdminEmails || ''} 
          onChange={handleChange} 
          placeholder="e.g. instituteapex12@gmail.com, mbarahul99@gmail.com" 
        />
        <span style={{ fontSize: '0.72rem', color: '#666', marginTop: '4px', display: 'block' }}>
          When signing in via Google, only these emails will be authorized to access the dashboard.
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

      {/* HOMEPAGE SECTIONS CONFIGURATION */}
      <h4 style={{ margin: '20px 0 10px 0', borderBottom: '1px solid var(--border-light)', paddingBottom: '8px', color: 'var(--navy-blue)', fontSize: '0.95rem', fontWeight: 700 }}>Homepage Sections Display Control</h4>
      <p style={{ fontSize: '0.8rem', color: 'var(--light-gray)', marginBottom: '15px' }}>Enable or disable visibility of individual sections on your home page.</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '15px', margin: '15px 0 25px 0', backgroundColor: '#f8fafc', padding: '15px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input type="checkbox" name="showSliders" id="showSliders" checked={!!settings.showSliders} onChange={handleChange} style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
          <label htmlFor="showSliders" style={{ fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>Banner Image Slider</label>
        </div>
        {/* Kalam Mentor Banner toggle removed */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input type="checkbox" name="showInfoCard" id="showInfoCard" checked={!!settings.showInfoCard} onChange={handleChange} style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
          <label htmlFor="showInfoCard" style={{ fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>24/7 Study Partner Info Card</label>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input type="checkbox" name="showFeaturedCourses" id="showFeaturedCourses" checked={!!settings.showFeaturedCourses} onChange={handleChange} style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
          <label htmlFor="showFeaturedCourses" style={{ fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>Featured Programs Courses</label>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input type="checkbox" name="showToppers" id="showToppers" checked={!!settings.showToppers} onChange={handleChange} style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
          <label htmlFor="showToppers" style={{ fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>Toppers Excellent Results</label>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input type="checkbox" name="showAlumni" id="showAlumni" checked={!!settings.showAlumni} onChange={handleChange} style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
          <label htmlFor="showAlumni" style={{ fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>Alumni Network Section</label>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input type="checkbox" name="showQuickLinks" id="showQuickLinks" checked={!!settings.showQuickLinks} onChange={handleChange} style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
          <label htmlFor="showQuickLinks" style={{ fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>Quick Links (Do More)</label>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input type="checkbox" name="showBlogs" id="showBlogs" checked={!!settings.showBlogs} onChange={handleChange} style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
          <label htmlFor="showBlogs" style={{ fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>Blogs & News Announcements</label>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input type="checkbox" name="showTestimonials" id="showTestimonials" checked={!!settings.showTestimonials} onChange={handleChange} style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
          <label htmlFor="showTestimonials" style={{ fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>Video Testimonials Reviews</label>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input type="checkbox" name="showEnquiryInline" id="showEnquiryInline" checked={!!settings.showEnquiryInline} onChange={handleChange} style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
          <label htmlFor="showEnquiryInline" style={{ fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>Contact Enquiry Inline Form</label>
        </div>
      </div>
      <button type="submit" className="admin-btn" style={{ padding: '10px 24px' }} disabled={isSaving}>
        {isSaving ? 'Saving to Database...' : 'Save Settings'}
      </button>
    </form>
  );
}

// ---------------- ADMIN SLIDERS SUB-VIEW ----------------
function AdminSliders() {
  const [sliders, setSliders] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editUrl, setEditUrl] = useState('');
  const [editMobileUrl, setEditMobileUrl] = useState('');
  const [editActive, setEditActive] = useState(true);

  useEffect(() => {
    setSliders(dbService.getSliders());
  }, []);

  const handleEdit = (slide) => {
    setEditingId(slide.id);
    setEditUrl(slide.imageUrl);
    setEditMobileUrl(slide.mobileImageUrl || '');
    setEditActive(slide.active);
  };

  const handleSave = async (id) => {
    if (!editUrl) return;
    const updated = sliders.map(s => {
      if (s.id === id) {
        return { ...s, imageUrl: editUrl, mobileImageUrl: editMobileUrl, active: editActive };
      }
      return s;
    });
    await dbService.saveSliders(updated);
    setSliders(updated);
    setEditingId(null);
  };

  const handleMoveSlide = async (currentIndex, targetIndex) => {
    if (targetIndex < 0 || targetIndex >= sliders.length || currentIndex === targetIndex) return;
    const updated = [...sliders];
    const [movedSlide] = updated.splice(currentIndex, 1);
    updated.splice(targetIndex, 0, movedSlide);
    
    // Re-index orderIndex
    const reindexed = updated.map((slide, idx) => ({
      ...slide,
      orderIndex: idx
    }));
    
    await dbService.saveSliders(reindexed);
    setSliders(reindexed);
  };

  const handleAddSlide = async () => {
    if (sliders.length >= 10) {
      alert("Maximum limit of 10 sliders reached!");
      return;
    }
    const newSlide = {
      id: 's_' + Date.now(),
      imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800',
      mobileImageUrl: '',
      orderIndex: sliders.length,
      active: true
    };
    const updated = [...sliders, newSlide];
    await dbService.saveSliders(updated);
    setSliders(updated);
  };

  const handleDeleteSlide = async (id) => {
    if (window.confirm("Are you sure you want to delete this banner slide?")) {
      await dbService.deleteSlider(id);
      setSliders(prev => prev.filter(s => s.id !== id));
    }
  };

  return (
    <div className="admin-card fade-in">
      <div className="admin-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="admin-card-title">Homepage Banner Carousel (Max 10 Images)</span>
        <button className="admin-btn" style={{ padding: '8px 16px', fontSize: '0.8rem' }} onClick={handleAddSlide}>+ Add New Slide</button>
      </div>
      <p style={{ fontSize: '0.82rem', color: 'var(--light-gray)', marginBottom: '20px' }}>Manage separate desktop and mobile banners to fit different screens cleanly. Change position using position selector or Up/Down buttons.</p>
      
      <div className="admin-sliders-grid">
        {sliders.map((slide, idx) => (
          <div className="admin-slider-card" key={slide.id}>
            <div className="admin-slider-card-thumb" style={{ display: 'flex', gap: '5px', height: '100px', backgroundColor: '#f3f4f6', padding: '5px', borderRadius: 'var(--radius-md)' }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--light-gray)' }}>Desktop</span>
                <img src={slide.imageUrl} alt={`Slide ${idx + 1}`} style={{ height: '70px', width: '100%', objectFit: 'cover', borderRadius: '4px' }} />
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--light-gray)' }}>Mobile</span>
                <img src={slide.mobileImageUrl || slide.imageUrl} alt={`Slide ${idx + 1}`} style={{ height: '70px', width: '100%', objectFit: 'cover', borderRadius: '4px' }} />
              </div>
              <span className="admin-slider-card-badge" style={{ zIndex: 5 }}>Slot {idx + 1}</span>
            </div>
            <div className="admin-slider-card-content">
              {editingId === slide.id ? (
                <>
                  <div className="admin-input-group" style={{ marginBottom: '8px' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700 }}>Desktop Image (Widescreen 1920x540)</label>
                    <input 
                      type="text" 
                      value={editUrl} 
                      onChange={e => setEditUrl(e.target.value)} 
                      style={{ padding: '6px', fontSize: '0.78rem' }}
                    />
                    <ImageUploadCompress 
                      value={editUrl} 
                      onChange={setEditUrl} 
                      label="Upload Desktop Banner (High Quality)" 
                      maxWidth={2048}
                      maxHeight={800}
                      quality={0.92}
                      preserveOriginal={true}
                    />
                  </div>
                  <div className="admin-input-group" style={{ marginBottom: '8px' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700 }}>Mobile Image (Tall 1080x950 / Square)</label>
                    <input 
                      type="text" 
                      value={editMobileUrl} 
                      onChange={e => setEditMobileUrl(e.target.value)} 
                      style={{ padding: '6px', fontSize: '0.78rem' }}
                    />
                    <ImageUploadCompress 
                      value={editMobileUrl} 
                      onChange={setEditMobileUrl} 
                      label="Upload Mobile Banner (High Quality)" 
                      maxWidth={1200}
                      maxHeight={1200}
                      quality={0.90}
                      preserveOriginal={true}
                    />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', margin: '8px 0' }}>
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
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.78rem', color: slide.active ? 'var(--accent-green)' : '#ef4444', fontWeight: 600 }}>
                      {slide.active ? 'â— Showing' : 'â—‹ Hidden'}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--navy-dark)', fontWeight: 600 }}>Slot:</span>
                      <select 
                        value={idx} 
                        onChange={e => handleMoveSlide(idx, parseInt(e.target.value))}
                        style={{ padding: '2px 4px', fontSize: '0.72rem', borderRadius: '4px', border: '1px solid #cbd5e1', fontWeight: 700, backgroundColor: '#fff', cursor: 'pointer' }}
                      >
                        {sliders.map((_, i) => (
                          <option key={i} value={i}>Slot {i + 1}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '4px', marginTop: '6px' }}>
                    <button 
                      className="admin-btn secondary" 
                      style={{ padding: '4px 8px', fontSize: '0.72rem' }} 
                      disabled={idx === 0} 
                      onClick={() => handleMoveSlide(idx, idx - 1)}
                      title="Move Up"
                    >
                      â–² Up
                    </button>
                    <button 
                      className="admin-btn secondary" 
                      style={{ padding: '4px 8px', fontSize: '0.72rem' }} 
                      disabled={idx === sliders.length - 1} 
                      onClick={() => handleMoveSlide(idx, idx + 1)}
                      title="Move Down"
                    >
                      â–¼ Down
                    </button>
                    <button className="admin-btn secondary" style={{ flex: 1, padding: '4px 6px', fontSize: '0.72rem' }} onClick={() => handleEdit(slide)}>
                      Edit
                    </button>
                    <button className="admin-btn secondary" style={{ padding: '4px 6px', fontSize: '0.72rem', color: '#ef4444', borderColor: '#ef4444' }} onClick={() => handleDeleteSlide(slide.id)}>
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------- ADMIN COURSES SUB-VIEW ----------------
function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

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

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this course from catalog?')) {
      try {
        await dbService.deleteCourse(id);
        loadCoursesList();
      } catch (err) {
        alert('Failed to delete course: ' + (err.message || err));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await dbService.saveCourse({
        id: editingCourse ? editingCourse.id : undefined,
        title,
        category,
        target,
        boards,
        duration,
        schedule,
        fee: parseInt(fee) || 0,
        image,
        details,
        showTarget,
        showBoards,
        showDuration,
        showSchedule,
        showFee: showFee !== false,
        showImage: showImage !== false,
        showDetails
      });
      setFormOpen(false);
      loadCoursesList();
    } catch (err) {
      alert('Failed to save course: ' + (err.message || err));
    } finally {
      setIsSaving(false);
    }
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
              <input type="text" value={schedule} onChange={e => setSchedule(e.target.value)} placeholder="Mon - Fri (3 hrs) â€¢ Sat - Sun (3 hrs)" required />
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
                <input type="checkbox" id="chk-show-schedule" checked={showSchedule} onChange={e => setShowSchedule(e.target.checked)} />
                <label htmlFor="chk-show-schedule" style={{ fontSize: '0.75rem', fontWeight: 600, color: '#666', cursor: 'pointer', display: 'inline', margin: 0 }}>Show schedule on website</label>
              </div>
            </div>
          </div>

          <div className="admin-form-row">
            <div className="admin-input-group" style={{ flex: 1 }}>
              <label>Course Card Cover Image URL / Upload</label>
              <input 
                type="text" 
                value={image} 
                onChange={e => {
                  setImage(e.target.value);
                  if (e.target.value) setShowImage(true);
                }} 
                placeholder="Paste image URL or click below to upload image file"
              />
              <ImageUploadCompress 
                value={image} 
                onChange={(val) => {
                  setImage(val);
                  setShowImage(true);
                }} 
                label="Click or Drag File to Upload Course Cover Image" 
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px' }}>
                <input type="checkbox" id="chk-show-image" checked={showImage} onChange={e => setShowImage(e.target.checked)} />
                <label htmlFor="chk-show-image" style={{ fontSize: '0.78rem', fontWeight: 600, color: '#475569', cursor: 'pointer', display: 'inline', margin: 0 }}>
                  Show cover image banner on course card
                </label>
              </div>

              {image && (
                <div style={{ marginTop: '12px', padding: '12px', backgroundColor: '#f8fafc', borderRadius: 'var(--radius-md)', border: '1px solid #cbd5e1' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--navy-blue)' }}>Live Course Banner Preview:</span>
                    <button 
                      type="button" 
                      className="admin-btn secondary"
                      style={{ padding: '2px 8px', fontSize: '0.72rem', color: '#ef4444', borderColor: '#ef4444' }}
                      onClick={() => setImage('')}
                    >
                      Clear Image
                    </button>
                  </div>
                  <img 
                    src={image} 
                    alt="Course Card Cover Preview" 
                    style={{ width: '100%', maxHeight: '180px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', border: '1px solid #e2e8f0' }} 
                  />
                </div>
              )}
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
            <button type="submit" className="admin-btn" disabled={isSaving}>{isSaving ? 'Saving...' : 'Save Course Offer'}</button>
            <button type="button" className="admin-btn secondary" onClick={() => setFormOpen(false)}>Cancel</button>
          </div>
        </form>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Cover Image</th>
                <th>Title</th>
                <th>Category</th>
                <th>Schedule</th>
                <th>Target Boards</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map(course => (
                <tr key={course.id}>
                  <td>
                    {course.image ? (
                      <img 
                        src={course.image} 
                        alt={course.title} 
                        style={{ width: '55px', height: '40px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #cbd5e1' }} 
                      />
                    ) : (
                      <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>No Image</span>
                    )}
                  </td>
                  <td style={{ fontWeight: 600 }}>{course.title}</td>
                  <td>
                    <span className="status-badge new">
                      {course.category === 'class-11-12' ? 'Class 11-12' : 'Class 9-10'}
                    </span>
                  </td>
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
  const [isSaving, setIsSaving] = useState(false);

  const [studentName, setStudentName] = useState('');
  const [examTypeSelect, setExamTypeSelect] = useState('JEE Main');
  const [customExamType, setCustomExamType] = useState('');
  const [achievement, setAchievement] = useState('');
  const [location, setLocation] = useState('');
  const [photo, setPhoto] = useState('');
  const [photoFit, setPhotoFit] = useState('contain');
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
    setPhotoFit(res.photoFit || 'contain');
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
    setPhotoFit('contain');
    setYear('2025');
    setFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Delete student results record?')) {
      try {
        await dbService.deleteResult(id);
        loadResultsList();
      } catch (err) {
        alert('Failed to delete result: ' + (err.message || err));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await dbService.saveResult({
        id: editingResult ? editingResult.id : undefined,
        studentName,
        examType: examTypeSelect === 'Custom' ? customExamType : examTypeSelect,
        achievement,
        location,
        photo,
        photoFit,
        year
      });
      setFormOpen(false);
      loadResultsList();
    } catch (err) {
      alert('Failed to save result: ' + (err.message || err));
    } finally {
      setIsSaving(false);
    }
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
            <div className="admin-input-group">
              <label>Photo Display Mode</label>
              <select value={photoFit} onChange={e => setPhotoFit(e.target.value)}>
                <option value="contain">Full Image (Fit / No Upper Cropping) - Recommended</option>
                <option value="cover-top">Top Focus (Show Full Head / Hair)</option>
                <option value="cover">Fill Circle (Crop to fill)</option>
              </select>
              <small style={{ color: '#64748b', fontSize: '0.78rem', marginTop: '4px', display: 'block' }}>
                "Full Image" guarantees the student's head and hair are never cropped at the top.
              </small>
            </div>
            <div className="admin-input-group" style={{ maxWidth: '140px' }}>
              <label>Academic Year *</label>
              <input type="text" value={year} onChange={e => setYear(e.target.value)} required />
            </div>
          </div>

          {photo && (
            <div style={{ margin: '15px 0', display: 'flex', alignItems: 'center', gap: '15px', background: '#fff5f8', padding: '12px 18px', borderRadius: '12px', border: '1px solid #fbcfe8' }}>
              <div className="result-photo-wrap" style={{ width: '90px', height: '90px', margin: 0, flexShrink: 0 }}>
                <img 
                  src={photo} 
                  className={`result-photo fit-${photoFit}`} 
                  alt="Live Preview" 
                />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#9d174d' }}>
                  Live Preview (Pink Circle)
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                  Verify that the student's full head, hair, and face are completely visible before saving.
                </div>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" className="admin-btn" disabled={isSaving}>{isSaving ? 'Saving...' : 'Save Record'}</button>
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
                <th>Year</th>
                <th>Rank / Score</th>
                <th>Details</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {results.map(res => (
                <tr key={res.id}>
                  <td>
                    <div className="result-photo-wrap" style={{ width: '44px', height: '44px', margin: 0, borderWidth: '2px', padding: '2px' }}>
                      <img 
                        src={res.photo} 
                        className={`result-photo ${res.photoFit ? `fit-${res.photoFit}` : 'fit-contain'}`} 
                        alt={res.studentName} 
                      />
                    </div>
                  </td>
                  <td style={{ fontWeight: 600 }}>{res.studentName}</td>
                  <td><span className="status-badge new">{res.examType}</span></td>
                  <td><strong>{res.year || '2025'}</strong></td>
                  <td style={{ color: 'var(--selection-blue)', fontWeight: 700 }}>{res.achievement}</td>
                  <td>{res.location}</td>
                  <td>
                    <div className="table-actions">
                      <button className="table-action-btn" onClick={() => handleEdit(res)} title="Edit Record"><IconEdit /></button>
                      <button className="table-action-btn delete" onClick={() => handleDelete(res.id)} title="Delete Record"><IconTrash /></button>
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

// ---------------- ADMIN ALUMNI SUB-VIEW ----------------
function AdminAlumni() {
  const [alumni, setAlumni] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editingAlumni, setEditingAlumni] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const [name, setName] = useState('');
  const [college, setCollege] = useState('');
  const [course, setCourse] = useState('');
  const [batch, setBatch] = useState('');
  const [achievement, setAchievement] = useState('');
  const [currentRole, setCurrentRole] = useState('');
  const [photo, setPhoto] = useState('');
  const [quote, setQuote] = useState('');

  const loadAlumniList = () => setAlumni(dbService.getAlumni());

  useEffect(() => {
    loadAlumniList();
  }, []);

  const handleEdit = (alm) => {
    setEditingAlumni(alm);
    setName(alm.name || '');
    setCollege(alm.college || '');
    setCourse(alm.course || '');
    setBatch(alm.batch || '');
    setAchievement(alm.achievement || '');
    setCurrentRole(alm.currentRole || '');
    setPhoto(alm.photo || '');
    setQuote(alm.quote || '');
    setFormOpen(true);
  };

  const handleCreateNew = () => {
    setEditingAlumni(null);
    setName('');
    setCollege('');
    setCourse('MBBS');
    setBatch('2023-2024');
    setAchievement('');
    setCurrentRole('');
    setPhoto('https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400');
    setQuote('');
    setFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this alumni record?')) {
      try {
        await dbService.deleteAlumni(id);
        loadAlumniList();
      } catch (err) {
        alert('Failed to delete alumni: ' + (err.message || err));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await dbService.saveAlumni({
        id: editingAlumni ? editingAlumni.id : undefined,
        name,
        college,
        course,
        batch,
        achievement,
        currentRole,
        photo,
        quote
      });
      setFormOpen(false);
      loadAlumniList();
    } catch (err) {
      alert('Failed to save alumni: ' + (err.message || err));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="admin-card fade-in">
      <div className="admin-card-header">
        <span className="admin-card-title">Manage Alumni Network</span>
        {!formOpen && (
          <button className="admin-btn" onClick={handleCreateNew}>
            <IconPlus /> Add Alumni Profile
          </button>
        )}
      </div>

      {formOpen ? (
        <form onSubmit={handleSubmit} style={{ border: '1px solid #e2e8f0', padding: '20px', borderRadius: 'var(--radius-lg)' }}>
          <h4 style={{ marginBottom: '15px' }}>{editingAlumni ? `Edit Profile: ${editingAlumni.name}` : 'Add New Alumni Profile'}</h4>
          
          <div className="admin-form-row">
            <div className="admin-input-group">
              <label>Alumni Full Name *</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Dr. Aman Sharma" required />
            </div>
            <div className="admin-input-group">
              <label>Premier College / University *</label>
              <input type="text" value={college} onChange={e => setCollege(e.target.value)} placeholder="e.g. AIIMS New Delhi / IIT Bombay" required />
            </div>
          </div>

          <div className="admin-form-row">
            <div className="admin-input-group">
              <label>Degree / Course Studied</label>
              <input type="text" value={course} onChange={e => setCourse(e.target.value)} placeholder="e.g. MBBS / B.Tech Computer Science" />
            </div>
            <div className="admin-input-group">
              <label>Apex Batch Year</label>
              <input type="text" value={batch} onChange={e => setBatch(e.target.value)} placeholder="e.g. 2021-2022" />
            </div>
          </div>

          <div className="admin-form-row">
            <div className="admin-input-group">
              <label>Entrance Exam Achievement / Rank</label>
              <input type="text" value={achievement} onChange={e => setAchievement(e.target.value)} placeholder="e.g. NEET AIR 42 / JEE Advanced AIR 89" />
            </div>
            <div className="admin-input-group">
              <label>Current Role / Designation</label>
              <input type="text" value={currentRole} onChange={e => setCurrentRole(e.target.value)} placeholder="e.g. Resident Doctor, AIIMS / Software Engineer, Google" />
            </div>
          </div>

          <div className="admin-form-row">
            <div className="admin-input-group" style={{ flex: 1 }}>
              <label>Alumni Photo URL / Upload</label>
              <input type="text" value={photo} onChange={e => setPhoto(e.target.value)} placeholder="Paste image link or upload below" />
              <ImageUploadCompress 
                value={photo} 
                onChange={setPhoto} 
                label="Click or Drag File to Upload & Compress Alumni Photo" 
              />
              {photo && (
                <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <img src={photo} alt="Preview" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #eff6ff' }} />
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Live Photo Preview</span>
                </div>
              )}
            </div>
          </div>

          <div className="admin-input-group">
            <label>Testimonial / Inspirational Quote</label>
            <textarea 
              value={quote} 
              onChange={e => setQuote(e.target.value)} 
              rows="3" 
              placeholder="e.g. Apex Institute provided the rigorous concept clarity and test series that made cracking AIIMS possible!"
            ></textarea>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
            <button type="submit" className="admin-btn" disabled={isSaving}>{isSaving ? 'Saving...' : 'Save Alumni Profile'}</button>
            <button type="button" className="admin-btn secondary" onClick={() => setFormOpen(false)}>Cancel</button>
          </div>
        </form>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Photo</th>
                <th>Name</th>
                <th>College / Institute</th>
                <th>Degree</th>
                <th>Batch</th>
                <th>Achievement</th>
                <th>Current Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {alumni.map(alm => (
                <tr key={alm.id}>
                  <td>
                    {alm.photo ? (
                      <img 
                        src={alm.photo} 
                        alt={alm.name} 
                        style={{ width: '45px', height: '45px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #cbd5e1' }} 
                      />
                    ) : (
                      <div style={{ width: '45px', height: '45px', borderRadius: '50%', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', color: '#64748b' }}>
                        ðŸ‘¤
                      </div>
                    )}
                  </td>
                  <td style={{ fontWeight: 600 }}>{alm.name}</td>
                  <td>
                    <span className="alumni-college-badge" style={{ margin: 0 }}>
                      {alm.college}
                    </span>
                  </td>
                  <td>{alm.course || '-'}</td>
                  <td>{alm.batch ? `Batch ${alm.batch}` : '-'}</td>
                  <td style={{ color: '#16a34a', fontWeight: 700 }}>{alm.achievement || '-'}</td>
                  <td>{alm.currentRole || '-'}</td>
                  <td>
                    <div className="table-actions">
                      <button className="table-action-btn" onClick={() => handleEdit(alm)} title="Edit"><IconEdit /></button>
                      <button className="table-action-btn delete" onClick={() => handleDelete(alm.id)} title="Delete"><IconTrash /></button>
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
  const [isSaving, setIsSaving] = useState(false);

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

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this custom page? It will stop ranking on google.')) {
      try {
        await dbService.deletePage(id);
        loadPagesList();
      } catch (err) {
        alert('Failed to delete page: ' + (err.message || err));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await dbService.savePage({
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
    } catch (err) {
      alert('Failed to save page: ' + (err.message || err));
    } finally {
      setIsSaving(false);
    }
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
            <button type="submit" className="admin-btn" disabled={isSaving}>{isSaving ? 'Saving...' : 'Save Custom Page'}</button>
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
  const [isSaving, setIsSaving] = useState(false);

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

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this blog post/announcement?')) {
      try {
        await dbService.deletePost(id);
        loadPostsList();
      } catch (err) {
        alert('Failed to delete post: ' + (err.message || err));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await dbService.savePost({
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
    } catch (err) {
      alert('Failed to save post: ' + (err.message || err));
    } finally {
      setIsSaving(false);
    }
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
            <button type="submit" className="admin-btn" disabled={isSaving}>{isSaving ? 'Publishing...' : 'Publish Update'}</button>
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
  const [isSaving, setIsSaving] = useState(false);
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

  const handleDelete = async (id) => {
    if (confirm('Delete this download link?')) {
      try {
        await dbService.deleteResource(id);
        loadResources();
      } catch (err) {
        alert('Failed to delete resource: ' + (err.message || err));
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!title || !linkUrl) return;
    setIsSaving(true);
    try {
      await dbService.saveResource({
        id: editingId === 'new' ? undefined : editingId,
        title,
        type,
        linkUrl
      });
      setEditingId(null);
      loadResources();
    } catch (err) {
      alert('Failed to save resource: ' + (err.message || err));
    } finally {
      setIsSaving(false);
    }
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
            <button type="submit" className="admin-btn" disabled={isSaving}>{isSaving ? 'Saving...' : 'Save Resource Link'}</button>
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
  const [isSaving, setIsSaving] = useState(false);

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

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this scholarship slab?")) {
      try {
        await dbService.deleteScholarship(id);
        loadList();
      } catch (err) {
        alert('Failed to delete scholarship: ' + (err.message || err));
      }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = {
        id: editingSlab ? editingSlab.id : undefined,
        title,
        criteria,
        discount,
        description,
        orderIndex: parseInt(orderIndex) || 0
      };
      await dbService.saveScholarship(payload);
      setFormOpen(false);
      loadList();
    } catch (err) {
      alert('Failed to save scholarship: ' + (err.message || err));
    } finally {
      setIsSaving(false);
    }
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
            <button type="submit" className="admin-btn" style={{ padding: '10px 24px' }} disabled={isSaving}>
              {isSaving ? 'Saving...' : (editingSlab ? 'Update Scholarship' : 'Create Scholarship')}
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

// ---------------- DEDICATED LOGO UPLOAD COMPONENT ----------------
function LogoUploadCompress({ value, onChange, label = "Upload & Apply New Logo File" }) {
  const [compressing, setCompressing] = useState(false);
  const [error, setError] = useState(null);
  const [imageInfo, setImageInfo] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Selected file is not a valid image.');
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
        // Optimal crisp resolution for header logos across Retina/High-DPI displays (3x device-pixel-ratio)
        const TARGET_MAX_WIDTH = 800;
        const TARGET_MAX_HEIGHT = 240;

        let curCanvas = document.createElement('canvas');
        curCanvas.width = img.width;
        curCanvas.height = img.height;
        let curCtx = curCanvas.getContext('2d');
        curCtx.imageSmoothingEnabled = true;
        curCtx.imageSmoothingQuality = 'high';
        curCtx.drawImage(img, 0, 0);

        let curWidth = img.width;
        let curHeight = img.height;

        while (curWidth * 0.5 >= TARGET_MAX_WIDTH || curHeight * 0.5 >= TARGET_MAX_HEIGHT) {
          const stepCanvas = document.createElement('canvas');
          const stepWidth = Math.floor(curWidth * 0.5);
          const stepHeight = Math.floor(curHeight * 0.5);
          stepCanvas.width = stepWidth;
          stepCanvas.height = stepHeight;
          const stepCtx = stepCanvas.getContext('2d');
          stepCtx.imageSmoothingEnabled = true;
          stepCtx.imageSmoothingQuality = 'high';
          stepCtx.drawImage(curCanvas, 0, 0, stepWidth, stepHeight);

          curCanvas = stepCanvas;
          curWidth = stepWidth;
          curHeight = stepHeight;
        }

        // Calculate final constrained dimensions while preserving aspect ratio
        let finalWidth = curWidth;
        let finalHeight = curHeight;
        const widthRatio = TARGET_MAX_WIDTH / curWidth;
        const heightRatio = TARGET_MAX_HEIGHT / curHeight;
        const scale = Math.min(1, widthRatio, heightRatio);

        finalWidth = Math.max(1, Math.round(curWidth * scale));
        finalHeight = Math.max(1, Math.round(curHeight * scale));

        const finalCanvas = document.createElement('canvas');
        finalCanvas.width = finalWidth;
        finalCanvas.height = finalHeight;
        const finalCtx = finalCanvas.getContext('2d');
        finalCtx.imageSmoothingEnabled = true;
        finalCtx.imageSmoothingQuality = 'high';
        finalCtx.drawImage(curCanvas, 0, 0, finalWidth, finalHeight);

        // High quality WebP output with alpha transparency support
        let compressedDataUrl = finalCanvas.toDataURL('image/webp', 0.90);
        if (!compressedDataUrl.startsWith('data:image/webp')) {
          compressedDataUrl = file.type === 'image/png' 
            ? finalCanvas.toDataURL('image/png') 
            : finalCanvas.toDataURL('image/jpeg', 0.90);
        }

        // Safeguard for Firestore 1MB document limit: if string is still over 300KB
        if (compressedDataUrl.length > 300000) {
          compressedDataUrl = finalCanvas.toDataURL('image/webp', 0.82);
        }
        
        const isWebPOut = compressedDataUrl.startsWith('data:image/webp');
        setImageInfo({
          origWidth: img.width,
          origHeight: img.height,
          finalWidth,
          finalHeight,
          format: isWebPOut ? 'WebP (Lossless Alpha)' : (file.type === 'image/png' ? 'PNG' : 'JPEG'),
          sizeKb: Math.round(compressedDataUrl.length * 0.75 / 1024)
        });

        onChange(compressedDataUrl);
        setCompressing(false);
      };
      img.onerror = () => {
        setError('Failed to process logo image file.');
        setCompressing(false);
      };
    };
    reader.onerror = () => {
      setError('Failed to read logo image file.');
      setCompressing(false);
    };
  };

  return (
    <div style={{ marginTop: '10px' }}>
      <label 
        htmlFor="admin-logo-file-input"
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          padding: '24px 16px', 
          border: '2px dashed var(--navy-blue)', 
          borderRadius: 'var(--radius-lg)', 
          backgroundColor: '#f8fafc', 
          cursor: 'pointer',
          transition: 'all 0.2s ease-in-out',
          textAlign: 'center'
        }}
        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f0f4f8'; }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#f8fafc'; }}
      >
        <div style={{ 
          width: '46px', 
          height: '46px', 
          borderRadius: '50%', 
          backgroundColor: 'rgba(225, 29, 72, 0.1)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          marginBottom: '10px',
          color: 'var(--accent-red)'
        }}>
          <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ width: '24px', height: '24px' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
        </div>
        <span style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--navy-dark)' }}>
          {compressing ? 'Processing & Downsampling Logo...' : label}
        </span>
        <span style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '4px' }}>
          Click or drop your logo file directly from your computer (PNG, JPG, WebP)
        </span>
        <input 
          id="admin-logo-file-input"
          type="file" 
          accept="image/*" 
          onChange={handleFileChange} 
          style={{ display: 'none' }}
        />
      </label>

      {compressing && (
        <div style={{ fontSize: '0.78rem', color: 'var(--navy-blue)', marginTop: '8px', fontWeight: 600 }}>
          â³ Resampling logo image with multi-step anti-aliasing...
        </div>
      )}

      {error && (
        <div style={{ fontSize: '0.78rem', color: '#ef4444', marginTop: '6px', fontWeight: 600 }}>
          âš ï¸ {error}
        </div>
      )}

      {imageInfo && (
        <div style={{ 
          fontSize: '0.78rem', 
          backgroundColor: '#f0fdf4', 
          color: 'var(--accent-green)', 
          padding: '10px 14px', 
          borderRadius: 'var(--radius-md)', 
          marginTop: '10px', 
          fontWeight: 600,
          border: '1px solid #bbf7d0'
        }}>
          âœ“ New Logo Applied: Original {imageInfo.origWidth}x{imageInfo.origHeight}px â†’ Optimized {imageInfo.finalWidth}x{imageInfo.finalHeight}px ({imageInfo.format})
        </div>
      )}
    </div>
  );
}

// ---------------- IMAGE UPLOAD & FRONTEND CANVAS COMPRESSION COMPONENT ----------------
// Auto-converts ALL uploaded images to WebP for 30-50% smaller file sizes
function ImageUploadCompress({ value, onChange, label='Upload Image', maxWidth=800, maxHeight=600, quality=0.85, preserveOriginal=false }) {
  const [compressing, setCompressing] = useState(false);
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { setError('Selected file is not an image.'); return; }
    setCompressing(true); setError(null); setInfo(null);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (ev) => {
      const img = new Image();
      img.src = ev.target.result;
      img.onload = () => {
        // Helper: encode canvas to WebP, fall back to JPEG if browser doesn't support WebP encode
        const encodeWebP = (canvas, q) => {
          const u = canvas.toDataURL('image/webp', q);
          return u.startsWith('data:image/webp') ? u : canvas.toDataURL('image/jpeg', q);
        };
        // Small images with preserveOriginal: still convert format to WebP
        if (preserveOriginal && img.width <= maxWidth && img.height <= maxHeight && file.size < 300000) {
          const qc = document.createElement('canvas');
          qc.width = img.width; qc.height = img.height;
          qc.getContext('2d').drawImage(img, 0, 0);
          const u = encodeWebP(qc, quality);
          onChange(u);
          setInfo({ finalWidth: img.width, finalHeight: img.height, sizeKb: Math.round(u.length * 0.75 / 1024), format: u.startsWith('data:image/webp') ? 'WebP' : 'JPEG', original: true });
          setCompressing(false);
          return;
        }
        // Multi-step downsampling to prevent aliasing on large images
        let cur = document.createElement('canvas');
        cur.width = img.width; cur.height = img.height;
        let cx = cur.getContext('2d');
        cx.imageSmoothingEnabled = true; cx.imageSmoothingQuality = 'high';
        cx.drawImage(img, 0, 0);
        let cw = img.width, ch = img.height;
        while (cw * 0.5 >= maxWidth || ch * 0.5 >= maxHeight) {
          const sc = document.createElement('canvas');
          const sw = Math.floor(cw * 0.5), sh = Math.floor(ch * 0.5);
          sc.width = sw; sc.height = sh;
          const sctx = sc.getContext('2d');
          sctx.imageSmoothingEnabled = true; sctx.imageSmoothingQuality = 'high';
          sctx.drawImage(cur, 0, 0, sw, sh);
          cur = sc; cw = sw; ch = sh;
        }
        const scale = Math.min(1, maxWidth / cw, maxHeight / ch);
        const fw = Math.max(1, Math.round(cw * scale)), fh = Math.max(1, Math.round(ch * scale));
        const fc = document.createElement('canvas');
        fc.width = fw; fc.height = fh;
        const fctx = fc.getContext('2d');
        fctx.imageSmoothingEnabled = true; fctx.imageSmoothingQuality = 'high';
        fctx.drawImage(cur, 0, 0, fw, fh);
        // Output WebP — 30-50% smaller than JPEG at same visual quality
        let out = encodeWebP(fc, quality);
        if (out.length > 400000) out = encodeWebP(fc, 0.75);
        const isWebP = out.startsWith('data:image/webp');
        setInfo({ finalWidth: fw, finalHeight: fh, sizeKb: Math.round(out.length * 0.75 / 1024), format: isWebP ? 'WebP' : 'JPEG', original: false });
        onChange(out);
        setCompressing(false);
      };
      img.onerror = () => { setError('Failed to process image.'); setCompressing(false); };
    };
    reader.onerror = () => { setError('Failed to read file.'); setCompressing(false); };
  };

  const uid = 'file-' + label.replace(/[^a-z0-9]/gi, '-').toLowerCase();
  return (
    <div style={{ marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} id={uid} />
        <label htmlFor={uid} className="admin-btn secondary" style={{ cursor: 'pointer', padding: '6px 12px', fontSize: '0.76rem', display: 'inline-flex', alignItems: 'center', margin: 0 }}>
          {compressing ? '⌛ Converting to WebP...' : '🖼️ ' + label}
        </label>
        {info && (
          <span style={{ fontSize: '0.74rem', color: 'var(--accent-green)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
            ✓ {info.format} • {info.finalWidth}×{info.finalHeight}px • {info.sizeKb} KB
          </span>
        )}
        {!info && value && value.startsWith('data:image') && (
          <span style={{ fontSize: '0.74rem', color: 'var(--accent-green)', fontWeight: 600 }}>✓ Ready</span>
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
  const [isSaving, setIsSaving] = useState(false);

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

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this student review?')) {
      try {
        await dbService.deleteTestimonial(id);
        loadList();
      } catch (err) {
        alert('Failed to delete testimonial: ' + (err.message || err));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await dbService.saveTestimonial({
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
    } catch (err) {
      alert('Failed to save testimonial: ' + (err.message || err));
    } finally {
      setIsSaving(false);
    }
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
            <button type="submit" className="admin-btn" disabled={isSaving}>{isSaving ? 'Saving...' : 'Save Review'}</button>
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
                  <td>{item.videoUrl ? 'ðŸŽ¥ Yes (YouTube)' : 'âœï¸ Text Only'}</td>
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
export default AdminPanel;

