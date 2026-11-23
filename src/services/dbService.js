import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  deleteDoc,
  updateDoc
} from "firebase/firestore";
import { db, getAuthInstance, isDefault } from "./firebase";
import snapshot from "./firestoreSnapshot.json";

// Database Service using LocalStorage with Brochure details as default seed data
const DB_KEYS = {
  SETTINGS: 'apex_settings',
  SLIDERS: 'apex_sliders',
  COURSES: 'apex_courses',
  RESOURCES: 'apex_resources',
  TESTIMONIALS: 'apex_testimonials',
  RESULTS: 'apex_results',
  ALUMNI: 'apex_alumni',
  ENQUIRIES: 'apex_enquiries',
  PAGES: 'apex_pages',
  POSTS: 'apex_posts',
  AUTH: 'apex_admin_auth',
  SCHOLARSHIPS: 'apex_scholarships'
};

// Automatic cache migration: invalidate any stale browser cache holding deleted demo data or heavy base64
const CACHE_VERSION = 'apex_live_v16';
if (typeof window !== 'undefined' && window.localStorage) {
  try {
    if (localStorage.getItem('apex_data_version') !== CACHE_VERSION) {
      Object.values(DB_KEYS).forEach(k => {
        if (k !== DB_KEYS.AUTH) {
          localStorage.removeItem(k);
        }
      });
      localStorage.setItem('apex_data_version', CACHE_VERSION);
    }
  } catch (e) {
    console.warn("Storage version check warning:", e);
  }
}

const DEFAULT_SETTINGS = {
  instituteName: "APEX INSTITUTE",
  tagline: "Institute of Medical Entrance Exams (NEET) & IIT-JEE Coaching & Tuition",
  address: "#1257, Urban Estate, Near HUDA Ground, Jind-126102 (Haryana)",
  phone: "94677-52374",
  whatsappNumber: "94677-52374",
  telephone: "01681-247700",
  email: "instituteapexjind@gmail.com",
  whatsappText: "Hello Apex Institute, I would like to enquire about your coaching courses.",
  logoUrl: "/logo_full.webp",
  logoNameUrl: "/logo_full.webp",
  logoIconHeight: "44px",
  logoWidth: "260px",
  logoHeight: "48px",
  examPortalUrl: "https://app.instituteapex.in?app=student",
  showBlogImagesOnHome: false,
  showSliders: true,
  showInfoCard: true,
  showFeaturedCourses: true,
  showToppers: true,
  showAlumni: true,
  showBlogs: true,
  showQuickLinks: true,
  showTestimonials: true,
  showEnquiryInline: true,
  geminiApiKey: "",
  aiVoiceName: "Aoede",
  aiCounselorPrompt: "You are the Senior Academic Counselor at Institute APEX, Jind (#1257, Urban Estate, Near HUDA Ground, Jind-126102, Haryana. Phone: 94677-52374, Landline: 01681-247700).\nWe offer premier coaching for: NEET (UG) for Class 11, 12, and Droppers; IIT-JEE (Main & Advanced) for Class 11 and 12; Foundation for Class 9th and 10th (Olympiads, NTSE, School Boards); and ASAT Scholarship Test with up to 90% fee waiver.\nLanguage Guidelines: If the student speaks or asks in Hindi or Hinglish, answer warmly in clear, polite Hindi. If the student speaks in English, answer in clear, professional English. Keep responses concise in 2 to 3 sentences.",
  elevenLabsApiKey: "",
  elevenLabsVoiceId: "21m00Tcm4TlvDq8ikWAM",
  enableElevenLabsVoice: false,
  allowedAdminEmails: "instituteapex12@gmail.com, instituteapexjind@gmail.com, mbarahul99@gmail.com",
  // Phase 1 SEO & Dynamic Meta Engine
  seoTitle: "Best NEET & IIT-JEE Coaching in Jind | Institute APEX (CBSE & ICSE)",
  seoDescription: "Looking for the best coaching for NEET, IIT-JEE, CBSE & ICSE in Jind? Institute APEX offers 16+ years of proven ranks, expert faculty & small batches for Class 9th-12th at Urban Estate, Jind. Call 94677-52374.",
  seoKeywords: "Best Coaching For NEET in Jind, Best NEET coaching in Jind, Best IIT Coaching in Jind, Best Coaching for 10th CBSE in Jind, Best ICSE Coaching in Jind, Best Coaching for 12th Science in Jind, ICSE tuition Jind, apex institute jind, coaching institute in jind haryana, cbse tuition jind",
  canonicalDomain: "https://instituteapex.in",
  googleSiteVerification: "",
  googleAnalyticsId: "G-FQ3CBQW6DP",
  ogImage: "/logo_full.webp",
  ...(snapshot.settings || {})
};

const DEFAULT_SLIDERS = snapshot.sliders || [];
const DEFAULT_SCHOLARSHIPS = snapshot.scholarships || [];
const DEFAULT_COURSES = snapshot.courses || [];
const DEFAULT_RESOURCES = [
  { id: "r1", title: "JEE Main Answer Key & Detailed Solutions", type: "answer-key", linkUrl: "#" },
  { id: "r2", title: "NEET 2026 Question Paper & Solution Keys", type: "answer-key", linkUrl: "#" },
  { id: "r3", title: "Haryana Board (HBSE) Class 12 Date Sheet 2027", type: "news", linkUrl: "#" },
  { id: "r4", title: "Class 10th NTSE Mock Papers & Answer Guides", type: "answer-key", linkUrl: "#" }
];
export const sortResultsDesc = (list) => {
  if (!Array.isArray(list)) return [];
  return [...list].sort((a, b) => {
    const parseYear = (val) => {
      if (!val) return 0;
      const m = String(val).match(/\d{4}/);
      return m ? parseInt(m[0], 10) : 0;
    };
    const yA = parseYear(a.year);
    const yB = parseYear(b.year);
    if (yB !== yA) return yB - yA;
    if (a.orderIndex !== undefined && b.orderIndex !== undefined && a.orderIndex !== b.orderIndex) {
      return (a.orderIndex || 0) - (b.orderIndex || 0);
    }
    return 0;
  });
};

const DEFAULT_TESTIMONIALS = snapshot.testimonials || [];
const DEFAULT_RESULTS = sortResultsDesc(snapshot.results || []);
const DEFAULT_ALUMNI = snapshot.alumni || [];

export const DEFAULT_ABOUT_DATA = {
  heroBadge: "Institute APEX Jind",
  heroTitle: "Empowering Medical & Engineering Aspirants in Jind",
  heroSubtitle: "Dedicated to academic rigor, conceptual depth, and personal mentorship since inception. Guiding students to top medical colleges (AIIMS, MAMC, PGIMS) and engineering institutes (IITs, NITs).",
  stats: [
    { num: "15+", label: "Years Mentoring" },
    { num: "Top Ranks", label: "NEET & IIT-JEE" },
    { num: "100%", label: "NCERT & Board Rigor" },
    { num: "Focused", label: "Small Batches" }
  ],
  directorSectionTag: "Leadership & Vision",
  directorSectionTitle: "Director's Message",
  directorPhoto: "/images/director.webp",
  directorRoleLabel: "Institute Director",
  directorName: "N. Dhanda",
  directorDegrees: "M.Sc. (Maths), M.A. (Eng.), B.Ed.",
  directorGreeting: "Dear Students and Parents,",
  directorParagraphs: [
    "This gives us immense pleasure to announce that with wholehearted co-operation of teaching staff, Parents & Students, we have successfully entered the 16<sup>th</sup> year under the banner of Apex Institute. Institute APEX was started in March 2011 to provide platform to those students who want to make their career in the field of Medical Science. Our goal at Apex is to impart knowledge and guidance by creating an environment that guides them for Board exams, IIT-JEE, NEET & other Medical Entrance Exams that is why in a short period of only 16 years we have become one of the leading institute in the area.",
    "Over the years, the name of APEX has become synonyms with success in PMT/NEET. Students get taught by highly acclaimed and well known faculty. Every member of APEX faculty has impeccable educational qualification and years of experience in coaching students to excel in the toughest Medical Entrance Examinations like AIIMS, AFMC, NEET & others.",
    "We feel proud on the achievements of our students. Finally I sum up by saying that our main objective is to model this establishment as a center of excellence for the students wishing to choose their career path in IIT-JEE & Medical fields."
  ],
  directorSignoffName: "Director: N. Dhanda",
  directorSignoffSub: "M.Sc. (Maths), M.A. (Eng.), B.Ed.",
  patternSectionTag: "Teaching Methodology",
  patternSectionTitle: "The Academic Pattern We Follow",
  patternSectionDesc: "Structured preparation blueprint designed to deliver dual excellence in school board results and competitive entrance ranks.",
  patterns: [
    {
      title: "The pattern we follow for Class XI",
      desc: "The syllabus of Class XI is covered keeping in view the school as well as the base for Medical Entrance Exams. Students are let off in 3<sup>rd</sup> week of January, 2026 after full syllabus test for their final examinations.",
      testSeriesTitle: "Test Series :-",
      tests: [
        "Regular tests (Subjective & objective separately) after completion of each chapter and each unit.",
        "Half syllabus test (Subjective & objective separately) in the 3<sup>rd</sup> week of August, 2025.",
        "Full syllabus Subjective test for preparation of final exams in the 3<sup>rd</sup> week of January, 2026."
      ]
    },
    {
      title: "The pattern we follow for Class XII",
      desc: "The syllabus is taught thoroughly for Board Exams, IIT-JEE, NEET and other Medical Entrance Exams. The entire syllabus is completed in the 2<sup>nd</sup> week of December, 2025.",
      testSeriesTitle: "Test Series :-",
      tests: [
        "Regular tests (Subjective & objective separately) after completion of each chapter and each unit.",
        "Half syllabus test (Subjective & objective separately) in the 3<sup>rd</sup> week of August, 2025.",
        "After completion of class XII full syllabus a special revision test series (for IIT-JEE & PMT preparation of objective test) based on class XI-XII syllabus will be conducted from 15<sup>th</sup> December, 2025 to 15<sup>th</sup> January, 2026.",
        "10 full syllabus Sample Paper Test will be held keeping in view the attemptation of board exams in the month of January & February, 2026."
      ]
    }
  ],
  weekendTag: "Weekend Advantage",
  weekendText: "Special 2 hours session on Saturday & Sunday including doubt clearing, objective test & revision of syllabus covered in 5 days regular class.",
  ctaTitle: "Learn from the Best",
  ctaDesc: "Admissions are open for upcoming batches. Meet our senior educators, explore our study materials, and take a free diagnostic scholarship test."
};

export const mergeAboutData = (custom) => {
  if (!custom || typeof custom !== 'object') {
    return JSON.parse(JSON.stringify(DEFAULT_ABOUT_DATA));
  }
  return {
    ...DEFAULT_ABOUT_DATA,
    ...custom,
    stats: Array.isArray(custom.stats) && custom.stats.length > 0 ? custom.stats : DEFAULT_ABOUT_DATA.stats,
    directorParagraphs: Array.isArray(custom.directorParagraphs) && custom.directorParagraphs.length > 0 ? custom.directorParagraphs : DEFAULT_ABOUT_DATA.directorParagraphs,
    patterns: Array.isArray(custom.patterns) && custom.patterns.length > 0 ? custom.patterns : DEFAULT_ABOUT_DATA.patterns
  };
};

const DEFAULT_PAGES = [
  {
    id: "p1",
    title: "About Apex Institute Jind",
    slug: "about-apex-jind",
    content: "<h2>Welcome to Institute APEX</h2><p>Apex Institute is Jind's leading educational setup catering to students aiming to excel in NEET, IIT-JEE, NTSE, and Olympiads. Nestled in Urban Estate, Jind, we provide unmatched guidance for Class 9th to 12th across CBSE, HBSE, and ICSE boards.</p><p>Our structured pedagogy, focus on core concepts, and regular assessment cycles ensure every student reaches their highest potential.</p>",
    aboutData: DEFAULT_ABOUT_DATA,
    metaTitle: "About Apex Institute Jind - NEET, IIT-JEE Coaching",
    metaDescription: "Learn more about Apex Institute Jind, Haryana's premium educational center for IIT-JEE, NEET entrance coaching and secondary board tuitions.",
    keywords: "apex institute jind, jee coaching jind, neet coaching jind, tuitions in jind",
    lastUpdated: new Date().toISOString()
  }
];

const DEFAULT_POSTS = [
  {
    id: "po1",
    title: "How to Balance Board Exam Preparations with JEE Main Coaching",
    slug: "balance-boards-with-jee",
    content: "<p>Balancing board exams (CBSE/HBSE) alongside rigorous JEE preparation is a frequent dilemma for Class 12 aspirants. However, with synchronized study schedules and strategic focus, students can easily excel in both examinations.</p><h3>1. Synchronize Common Syllabi</h3><p>Over 80% of Physics and Chemistry syllabus overlaps directly between CBSE Class 12 boards and JEE Main. When studying Electrostatics, Thermodynamics, or Organic Chemistry mechanisms, master the conceptual derivations required for subjective board answers while simultaneously solving objective numericals for JEE.</p><h3>2. Allocate Weekend Slots for Subjective Writing Practice</h3><p>Many students lose board marks not due to lack of knowledge, but due to poor answer presentation. Dedicate 2 hours every Sunday to write step-by-step solutions with labeled diagrams, standard SI units, and structured derivations.</p><h3>3. Timed Mock Tests & Error Log Analysis</h3><p>Take regular mock tests at APEX to refine your speed and accuracy. Review every mistake in an error notebook so you avoid repeating the same conceptual gaps on exam day.</p><h3>4. Daily Doubt Resolution</h3><p>Never let doubts accumulate. Clarify challenging concepts with your teachers immediately after class to keep your preparation smooth and confident.</p>",
    coverImage: "/images/courses/c2.webp",
    metaTitle: "Tips to Balance CBSE/HBSE Board Exams with JEE Prep",
    metaDescription: "Struggling to balance JEE Main coaching with CBSE or HBSE Board Exam preparations? Read the expert guidelines from Apex Institute teachers.",
    keywords: "boards and jee, school and coaching, cbse preparation, hbse exam tips, jee main coaching jind",
    publishDate: "2026-08-01",
    category: "JEE"
  }
];

// Database operations helper for LocalStorage
const loadData = (key, fallback) => {
  try {
    const data = localStorage.getItem(key);
    if (!data || data === "null") {
      if (fallback !== null && fallback !== undefined) {
        try {
          localStorage.setItem(key, JSON.stringify(fallback));
        } catch (e) {
          console.warn("LocalStorage save warning:", e);
        }
      }
      return fallback;
    }
    return JSON.parse(data);
  } catch (e) {
    return fallback;
  }
};

const saveData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn("LocalStorage saveData error, trying lightweight fallback:", key, e);
    if (key === DB_KEYS.SLIDERS && Array.isArray(data)) {
      try {
        // Strip heavy base64 from non-primary slides to fit inside browser storage limit
        const lightweight = data.map((sl, idx) => {
          if (idx > 0 && sl.imageUrl && sl.imageUrl.length > 50000) {
            return {
              ...sl,
              imageUrl: `/images/slides/slide_${idx + 1}.webp`,
              mobileImageUrl: `/images/slides/slide_${idx + 1}_mob.webp`
            };
          }
          return sl;
        });
        localStorage.setItem(key, JSON.stringify(lightweight));
      } catch (innerErr) {
        console.warn("Even lightweight sliders failed to save to LocalStorage:", innerErr);
      }
    }
  }
};

// Listeners for silent background database sync (Stale-While-Revalidate)
const dbListeners = new Set();
export const subscribeDbUpdates = (callback) => {
  dbListeners.add(callback);
  return () => dbListeners.delete(callback);
};
const notifyDbUpdates = () => {
  dbListeners.forEach(cb => {
    try { cb(); } catch (e) { console.error('Error notifying db listener:', e); }
  });
};

// Memory cache object for synchronous reads (Pre-seeded immediately from LocalStorage on Frame 0)
const ensureMobileSliders = (sliders) => {
  const activeOnly = (sliders || []).filter(s => s.id !== 's_1792327505092');
  const sorted = activeOnly.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
  const fallbackMobileMap = {
    's_1795321874461': '/images/slides/current_slide_1_mob.webp',
    's_1794480218465': '/images/slides/slide_2_mob.webp',
    's_1792327825822': '/images/slides/slide_3_mob.webp',
    's_1792327827472': '/images/slides/slide_4_mob.webp',
    's_1794480535869': '/images/slides/slide_5_mob.webp',
    's_1793439553074': '/images/slides/slide_6_mob.webp',
    's_1792575816493': '/images/slides/slide_7_mob.webp',
    's_1794481114248': '/images/slides/slide_8_mob.webp',
    's_1794481227750': '/images/slides/slide_9_mob.webp'
  };
  return sorted.map((s, idx) => {
    let mob = s.mobileImageUrl;
    if (!mob || mob === '') {
      mob = s.imageUrl || fallbackMobileMap[s.id] || `/images/slides/slide_${(idx % 9) + 1}_mob.webp`;
    }
    return { ...s, mobileImageUrl: mob };
  });
};

const cache = {
  settings: { ...DEFAULT_SETTINGS, ...loadData(DB_KEYS.SETTINGS, DEFAULT_SETTINGS) },
  sliders: ensureMobileSliders(loadData(DB_KEYS.SLIDERS, DEFAULT_SLIDERS)).sort((a,b) => (a.orderIndex || 0) - (b.orderIndex || 0)),
  courses: loadData(DB_KEYS.COURSES, DEFAULT_COURSES),
  resources: loadData(DB_KEYS.RESOURCES, DEFAULT_RESOURCES),
  testimonials: loadData(DB_KEYS.TESTIMONIALS, DEFAULT_TESTIMONIALS),
  results: sortResultsDesc(loadData(DB_KEYS.RESULTS, DEFAULT_RESULTS)),
  alumni: loadData(DB_KEYS.ALUMNI, DEFAULT_ALUMNI),
  enquiries: loadData(DB_KEYS.ENQUIRIES, []),
  pages: loadData(DB_KEYS.PAGES, DEFAULT_PAGES),
  posts: loadData(DB_KEYS.POSTS, DEFAULT_POSTS),
  scholarships: loadData(DB_KEYS.SCHOLARSHIPS, DEFAULT_SCHOLARSHIPS).sort((a,b) => (a.orderIndex || 0) - (b.orderIndex || 0))
};

let initPromise = null;

export const dbService = {
  // Initialize and preload databases into cache
  async init() {
    if (initPromise) return initPromise;
    initPromise = (async () => {
      if (isDefault) {
      // LocalStorage mode
      cache.settings = { ...DEFAULT_SETTINGS, ...loadData(DB_KEYS.SETTINGS, DEFAULT_SETTINGS) };
      cache.sliders = ensureMobileSliders(loadData(DB_KEYS.SLIDERS, DEFAULT_SLIDERS)).sort((a,b) => a.orderIndex - b.orderIndex);
      cache.courses = loadData(DB_KEYS.COURSES, DEFAULT_COURSES);
      cache.resources = loadData(DB_KEYS.RESOURCES, DEFAULT_RESOURCES);
      cache.testimonials = loadData(DB_KEYS.TESTIMONIALS, DEFAULT_TESTIMONIALS);
      cache.results = sortResultsDesc(loadData(DB_KEYS.RESULTS, DEFAULT_RESULTS));
      cache.alumni = loadData(DB_KEYS.ALUMNI, DEFAULT_ALUMNI);
      cache.enquiries = loadData(DB_KEYS.ENQUIRIES, []);
      cache.pages = loadData(DB_KEYS.PAGES, DEFAULT_PAGES);
      cache.posts = loadData(DB_KEYS.POSTS, DEFAULT_POSTS);
      cache.scholarships = loadData(DB_KEYS.SCHOLARSHIPS, DEFAULT_SCHOLARSHIPS).sort((a,b) => (a.orderIndex || 0) - (b.orderIndex || 0));
      return Promise.resolve();
    }

    try {
      // Firebase mode loading
      // 1. Settings
      const settingsSnap = await getDoc(doc(db, "settings", "main"));
      if (settingsSnap.exists()) {
        cache.settings = { ...DEFAULT_SETTINGS, ...settingsSnap.data() };
      } else {
        await setDoc(doc(db, "settings", "main"), DEFAULT_SETTINGS);
        cache.settings = DEFAULT_SETTINGS;
      }

      // 2. Read seed status tracking doc from Firestore settings/seed_status
      let seedStatus = {};
      try {
        const seedSnap = await getDoc(doc(db, "settings", "seed_status"));
        if (seedSnap.exists()) {
          seedStatus = seedSnap.data() || {};
        }
      } catch (e) {
        console.warn("Could not read seed_status, assuming initialized:", e);
      }

      // Safe Collection loader: NEVER resurrects deleted items once seeded!
      const loadCollection = async (colName, defaults) => {
        const snap = await getDocs(collection(db, colName));
        
        // If collection was already seeded in the past OR already contains documents:
        if (seedStatus[colName] || !snap.empty) {
          // Ensure seedStatus records it as initialized
          if (!seedStatus[colName]) {
            seedStatus[colName] = true;
            setDoc(doc(db, "settings", "seed_status"), { [colName]: true }, { merge: true }).catch(() => {});
          }
          // The database documents are the master truth. Deleted items STAY deleted!
          return snap.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
        }

        // Only on a 100% brand new, uninitialized database:
        if (defaults && Array.isArray(defaults) && defaults.length > 0) {
          console.log(`Initial one-time seeding for ${colName}...`);
          for (const item of defaults) {
            await setDoc(doc(db, colName, item.id), item);
          }
          seedStatus[colName] = true;
          await setDoc(doc(db, "settings", "seed_status"), { [colName]: true }, { merge: true });
          return defaults;
        }

        return [];
      };

      // Load all 9 collections concurrently in parallel
      const [
        slidersData,
        coursesData,
        resourcesData,
        testimonialsData,
        resultsData,
        alumniData,
        pagesData,
        postsData,
        scholarshipsData
      ] = await Promise.all([
        loadCollection("sliders", DEFAULT_SLIDERS),
        loadCollection("courses", DEFAULT_COURSES),
        loadCollection("resources", DEFAULT_RESOURCES),
        loadCollection("testimonials", DEFAULT_TESTIMONIALS),
        loadCollection("results", DEFAULT_RESULTS),
        loadCollection("alumni", DEFAULT_ALUMNI),
        loadCollection("pages", DEFAULT_PAGES),
        loadCollection("posts", DEFAULT_POSTS),
        loadCollection("scholarships", DEFAULT_SCHOLARSHIPS)
      ]);

      cache.sliders = ensureMobileSliders(slidersData).sort((a,b) => a.orderIndex - b.orderIndex);
      cache.courses = coursesData;
      cache.resources = resourcesData;
      cache.testimonials = testimonialsData;
      cache.results = sortResultsDesc(resultsData);
      cache.alumni = alumniData;
      cache.pages = pagesData;
      cache.posts = postsData;
      cache.scholarships = (scholarshipsData || []).sort((a,b) => (a.orderIndex || 0) - (b.orderIndex || 0));

      // 4. Enquiries (Restricted to logged-in admin for student privacy)
      if (this.isLoggedIn()) {
        try {
          const enquiriesSnap = await getDocs(collection(db, "enquiries"));
          cache.enquiries = enquiriesSnap.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
        } catch (e) {
          console.warn("⚠️ Enquiries fetch restricted to authenticated admins:", e);
        }
      } else {
        cache.enquiries = [];
      }

      // Keep LocalStorage in sync as offline cache for all collections
      saveData(DB_KEYS.SETTINGS, cache.settings);
      saveData(DB_KEYS.SLIDERS, cache.sliders);
      saveData(DB_KEYS.COURSES, cache.courses);
      saveData(DB_KEYS.RESOURCES, cache.resources);
      saveData(DB_KEYS.TESTIMONIALS, cache.testimonials);
      saveData(DB_KEYS.RESULTS, cache.results);
      saveData(DB_KEYS.ALUMNI, cache.alumni);
      saveData(DB_KEYS.PAGES, cache.pages);
      saveData(DB_KEYS.POSTS, cache.posts);
      saveData(DB_KEYS.SCHOLARSHIPS, cache.scholarships);
      saveData(DB_KEYS.ENQUIRIES, cache.enquiries);

      // Notify UI subscribers of fresh background data
      notifyDbUpdates();

    } catch (err) {
      console.error("⚠️ Firestore pre-loading failed. Reverting to LocalStorage.", err);
      // Fail-safe fallback loading
      cache.settings = loadData(DB_KEYS.SETTINGS, DEFAULT_SETTINGS);
      cache.sliders = ensureMobileSliders(loadData(DB_KEYS.SLIDERS, DEFAULT_SLIDERS));
      cache.courses = loadData(DB_KEYS.COURSES, DEFAULT_COURSES);
      cache.resources = loadData(DB_KEYS.RESOURCES, DEFAULT_RESOURCES);
      cache.testimonials = loadData(DB_KEYS.TESTIMONIALS, DEFAULT_TESTIMONIALS);
      cache.results = sortResultsDesc(loadData(DB_KEYS.RESULTS, DEFAULT_RESULTS));
      cache.alumni = loadData(DB_KEYS.ALUMNI, DEFAULT_ALUMNI);
      cache.enquiries = loadData(DB_KEYS.ENQUIRIES, []);
      cache.pages = loadData(DB_KEYS.PAGES, DEFAULT_PAGES);
      cache.posts = loadData(DB_KEYS.POSTS, DEFAULT_POSTS);
      cache.scholarships = loadData(DB_KEYS.SCHOLARSHIPS, DEFAULT_SCHOLARSHIPS);
      notifyDbUpdates();
    }
  })();
  return initPromise;
  },

  subscribe(callback) {
    return subscribeDbUpdates(callback);
  },

  // Settings
  getSettings() {
    return cache.settings;
  },
  async saveSettings(settings) {
    const cleanSettings = {
      ...settings,
      logoUrl: settings.logoUrl || settings.logoNameUrl || '/logo_full.webp',
      logoNameUrl: settings.logoUrl || settings.logoNameUrl || '/logo_full.webp'
    };
    cache.settings = cleanSettings;
    saveData(DB_KEYS.SETTINGS, cleanSettings);
    if (!isDefault) {
      await setDoc(doc(db, "settings", "main"), cleanSettings);
    }
    return cleanSettings;
  },

  // Sliders
  getSliders() {
    return ensureMobileSliders(cache.sliders);
  },
  async saveSliders(sliders) {
    const sorted = [...sliders].sort((a,b) => a.orderIndex - b.orderIndex);
    cache.sliders = sorted;
    saveData(DB_KEYS.SLIDERS, sorted);
    if (!isDefault) {
      for (const s of sorted) {
        const cleanDoc = Object.fromEntries(
          Object.entries(s).filter(([_, v]) => v !== undefined)
        );
        await setDoc(doc(db, "sliders", s.id), cleanDoc);
      }
    }
    return sorted;
  },
  async deleteSlider(id) {
    cache.sliders = cache.sliders.filter(s => s.id !== id);
    saveData(DB_KEYS.SLIDERS, cache.sliders);
    if (!isDefault) {
      await deleteDoc(doc(db, "sliders", id));
    }
  },

  // Courses
  getCourses() {
    return cache.courses;
  },
  getCourse(idOrSlug) {
    if (!idOrSlug) return null;
    const cleanId = String(idOrSlug).toLowerCase().trim();
    return (cache.courses || []).find(c => 
      String(c.id).toLowerCase() === cleanId ||
      (c.title && c.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') === cleanId)
    );
  },
  async saveCourse(course) {
    const list = [...cache.courses];
    if (!course.id) {
      course.id = 'c_' + Date.now();
    }
    
    // Clean undefined fields for Firestore safety
    const cleanCourse = {};
    Object.keys(course).forEach(key => {
      if (course[key] !== undefined) {
        cleanCourse[key] = course[key];
      }
    });

    const idx = list.findIndex(c => c.id === cleanCourse.id);
    if (idx > -1) {
      list[idx] = cleanCourse;
    } else {
      list.push(cleanCourse);
    }
    cache.courses = list;
    saveData(DB_KEYS.COURSES, list);

    if (!isDefault) {
      await setDoc(doc(db, "courses", cleanCourse.id), cleanCourse);
      console.log(`✓ Course ${cleanCourse.id} saved to Firestore successfully.`);
    }
    return cleanCourse;
  },
  async deleteCourse(id) {
    cache.courses = cache.courses.filter(c => c.id !== id);
    saveData(DB_KEYS.COURSES, cache.courses);
    if (!isDefault) {
      await deleteDoc(doc(db, "courses", id));
      console.log(`✓ Course ${id} deleted from Firestore successfully.`);
    }
  },

  // Results
  getResults() {
    return sortResultsDesc(cache.results);
  },
  async saveResult(result) {
    const list = [...cache.results];
    if (!result.id) {
      result.id = 'res_' + Date.now();
    }
    const idx = list.findIndex(r => r.id === result.id);
    if (idx > -1) {
      list[idx] = result;
    } else {
      list.push(result);
    }
    const sorted = sortResultsDesc(list);
    cache.results = sorted;
    saveData(DB_KEYS.RESULTS, sorted);

    if (!isDefault) {
      await setDoc(doc(db, "results", result.id), result);
    }
    return result;
  },
  async deleteResult(id) {
    cache.results = cache.results.filter(r => r.id !== id);
    saveData(DB_KEYS.RESULTS, cache.results);
    if (!isDefault) {
      await deleteDoc(doc(db, "results", id));
    }
  },

  // Alumni
  getAlumni() {
    return cache.alumni;
  },
  getAlumniById(id) {
    return cache.alumni.find(a => a.id === id);
  },
  async saveAlumni(alumniItem) {
    const list = [...cache.alumni];
    if (!alumniItem.id) {
      alumniItem.id = 'alm_' + Date.now();
    }
    const idx = list.findIndex(a => a.id === alumniItem.id);
    if (idx > -1) {
      list[idx] = alumniItem;
    } else {
      list.push(alumniItem);
    }
    cache.alumni = list;
    saveData(DB_KEYS.ALUMNI, list);

    if (!isDefault) {
      await setDoc(doc(db, "alumni", alumniItem.id), alumniItem);
    }
    return alumniItem;
  },
  async deleteAlumni(id) {
    cache.alumni = cache.alumni.filter(a => a.id !== id);
    saveData(DB_KEYS.ALUMNI, cache.alumni);
    if (!isDefault) {
      await deleteDoc(doc(db, "alumni", id));
    }
  },

  // Scholarships
  getScholarships() {
    return cache.scholarships;
  },
  async saveScholarship(scholarship) {
    const list = [...cache.scholarships];
    if (!scholarship.id) {
      scholarship.id = 'sc_' + Date.now();
    }
    const idx = list.findIndex(s => s.id === scholarship.id);
    if (idx > -1) {
      list[idx] = scholarship;
    } else {
      list.push(scholarship);
    }
    cache.scholarships = list.sort((a,b) => (a.orderIndex || 0) - (b.orderIndex || 0));
    saveData(DB_KEYS.SCHOLARSHIPS, cache.scholarships);

    if (!isDefault) {
      await setDoc(doc(db, "scholarships", scholarship.id), scholarship);
    }
    return scholarship;
  },
  async deleteScholarship(id) {
    cache.scholarships = cache.scholarships.filter(s => s.id !== id);
    saveData(DB_KEYS.SCHOLARSHIPS, cache.scholarships);
    if (!isDefault) {
      await deleteDoc(doc(db, "scholarships", id));
    }
  },

  // Resources
  getResources() {
    return cache.resources;
  },
  async saveResource(resource) {
    const list = [...cache.resources];
    if (!resource.id) {
      resource.id = 'r_' + Date.now();
    }
    const idx = list.findIndex(r => r.id === resource.id);
    if (idx > -1) {
      list[idx] = resource;
    } else {
      list.push(resource);
    }
    cache.resources = list;
    saveData(DB_KEYS.RESOURCES, list);

    if (!isDefault) {
      await setDoc(doc(db, "resources", resource.id), resource);
    }
    return resource;
  },
  async deleteResource(id) {
    cache.resources = cache.resources.filter(r => r.id !== id);
    saveData(DB_KEYS.RESOURCES, cache.resources);
    if (!isDefault) {
      await deleteDoc(doc(db, "resources", id));
    }
  },

  // Testimonials
  getTestimonials() {
    return cache.testimonials;
  },
  async saveTestimonial(testimonial) {
    const list = [...cache.testimonials];
    if (!testimonial.id) {
      testimonial.id = 't_' + Date.now();
    }
    const idx = list.findIndex(t => t.id === testimonial.id);
    if (idx > -1) {
      list[idx] = testimonial;
    } else {
      list.push(testimonial);
    }
    cache.testimonials = list;
    saveData(DB_KEYS.TESTIMONIALS, list);

    if (!isDefault) {
      await setDoc(doc(db, "testimonials", testimonial.id), testimonial);
    }
    return testimonial;
  },
  async deleteTestimonial(id) {
    cache.testimonials = cache.testimonials.filter(t => t.id !== id);
    saveData(DB_KEYS.TESTIMONIALS, cache.testimonials);
    if (!isDefault) {
      await deleteDoc(doc(db, "testimonials", id));
    }
  },

  // Pages
  getPages() {
    return cache.pages || DEFAULT_PAGES;
  },
  getCustomPages() {
    return this.getPages();
  },
  getPageBySlug(slug) {
    if (!slug) return null;
    const target = decodeURIComponent(String(slug)).toLowerCase().trim();
    const list = cache.pages || [];
    return list.find(p => 
      (p.slug && p.slug.toLowerCase().trim() === target) ||
      String(p.id).toLowerCase() === target ||
      (p.title && p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') === target)
    ) || DEFAULT_PAGES.find(p => p.slug === target || String(p.id).toLowerCase() === target) || null;
  },
  getCustomPage(slug) {
    return this.getPageBySlug(slug);
  },
  async savePage(page) {
    const list = [...cache.pages];
    page.lastUpdated = new Date().toISOString();
    if (!page.id) {
      page.id = 'p_' + Date.now();
    }
    const idx = list.findIndex(p => p.id === page.id);
    if (idx > -1) {
      list[idx] = page;
    } else {
      list.push(page);
    }
    cache.pages = list;
    saveData(DB_KEYS.PAGES, list);

    if (!isDefault) {
      await setDoc(doc(db, "pages", page.id), page);
    }
    return page;
  },
  async deletePage(id) {
    cache.pages = cache.pages.filter(p => p.id !== id);
    saveData(DB_KEYS.PAGES, cache.pages);
    if (!isDefault) {
      await deleteDoc(doc(db, "pages", id));
    }
  },

  // Posts
  getPosts() {
    return cache.posts || DEFAULT_POSTS;
  },
  getBlogPosts() {
    return this.getPosts();
  },
  getPostBySlug(slug) {
    if (!slug) return null;
    const target = decodeURIComponent(String(slug)).toLowerCase().trim();
    const list = cache.posts || [];
    return list.find(p => 
      (p.slug && p.slug.toLowerCase().trim() === target) ||
      String(p.id).toLowerCase() === target ||
      (p.title && p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') === target)
    ) || DEFAULT_POSTS.find(p => p.slug === target || String(p.id).toLowerCase() === target) || null;
  },
  getBlogPost(slug) {
    return this.getPostBySlug(slug);
  },
  async savePost(post) {
    const list = [...cache.posts];
    if (!post.id) {
      post.id = 'po_' + Date.now();
      post.publishDate = new Date().toLocaleDateString();
    }
    const idx = list.findIndex(p => p.id === post.id);
    if (idx > -1) {
      list[idx] = post;
    } else {
      list.push(post);
    }
    cache.posts = list;
    saveData(DB_KEYS.POSTS, list);

    if (!isDefault) {
      await setDoc(doc(db, "posts", post.id), post);
    }
    return post;
  },
  async deletePost(id) {
    cache.posts = cache.posts.filter(p => p.id !== id);
    saveData(DB_KEYS.POSTS, cache.posts);
    if (!isDefault) {
      await deleteDoc(doc(db, "posts", id));
    }
  },

  // Enquiries
  async fetchEnquiries() {
    if (!isDefault && this.isLoggedIn()) {
      try {
        const enquiriesSnap = await getDocs(collection(db, "enquiries"));
        cache.enquiries = enquiriesSnap.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
        saveData(DB_KEYS.ENQUIRIES, cache.enquiries);
      } catch (err) {
        console.warn("⚠️ Could not fetch live enquiries:", err);
      }
    }
    return cache.enquiries;
  },
  getEnquiries() {
    return cache.enquiries;
  },
  async addEnquiry(enquiry) {
    enquiry.id = 'e_' + Date.now();
    enquiry.status = 'New';
    enquiry.timestamp = new Date().toISOString();
    const list = [enquiry, ...cache.enquiries];
    cache.enquiries = list;
    saveData(DB_KEYS.ENQUIRIES, list);

    if (!isDefault) {
      await setDoc(doc(db, "enquiries", enquiry.id), enquiry);
    }
    return enquiry;
  },
  async updateEnquiryStatus(id, status) {
    const list = [...cache.enquiries];
    const idx = list.findIndex(e => e.id === id);
    if (idx > -1) {
      list[idx].status = status;
      cache.enquiries = list;
      saveData(DB_KEYS.ENQUIRIES, list);
      if (!isDefault) {
        await updateDoc(doc(db, "enquiries", id), { status });
      }
    }
  },
  async deleteEnquiry(id) {
    cache.enquiries = cache.enquiries.filter(e => e.id !== id);
    saveData(DB_KEYS.ENQUIRIES, cache.enquiries);
    if (!isDefault) {
      await deleteDoc(doc(db, "enquiries", id));
    }
  },

  // Firebase Auth Login (Lazily dynamically loaded to eliminate auth iframe on public visitor pages)
  async login(username, password) {
    if (isDefault) {
      if (username === 'admin' && password === 'apex2026') {
        localStorage.setItem(DB_KEYS.AUTH, 'true');
        return Promise.resolve(true);
      }
      return Promise.resolve(false);
    }
    
    try {
      const auth = await getAuthInstance();
      if (!auth) throw new Error("Firebase Auth could not be initialized.");
      const { signInWithEmailAndPassword } = await import("firebase/auth");
      const userCredential = await signInWithEmailAndPassword(auth, username, password);
      localStorage.setItem(DB_KEYS.AUTH, 'true');
      return true;
    } catch (err) {
      console.error("❌ Authentication error:", err);
      throw err;
    }
  },

  async loginWithGoogle() {
    if (isDefault) {
      throw new Error("Firebase configuration not found.");
    }
    try {
      const auth = await getAuthInstance();
      if (!auth) throw new Error("Firebase Auth could not be initialized.");
      const { GoogleAuthProvider, signInWithPopup, signOut } = await import("firebase/auth");
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const email = result.user.email;
      const settings = cache.settings || DEFAULT_SETTINGS;
      const emailsStr = settings.allowedAdminEmails || "instituteapex12@gmail.com, instituteapexjind@gmail.com, mbarahul99@gmail.com";
      const ALLOWED_ADMINS = emailsStr
        .split(",")
        .map(e => e.trim().toLowerCase())
        .filter(Boolean);
      if (ALLOWED_ADMINS.includes(email.toLowerCase())) {
        localStorage.setItem(DB_KEYS.AUTH, 'true');
        return true;
      } else {
        await signOut(auth);
        throw new Error(`Unauthorized: ${email} is not registered as an administrator.`);
      }
    } catch (err) {
      console.error("❌ Google Sign-In error:", err);
      throw err;
    }
  },
  
  async logout() {
    localStorage.removeItem(DB_KEYS.AUTH);
    if (!isDefault) {
      try {
        const auth = await getAuthInstance();
        if (auth) {
          const { signOut } = await import("firebase/auth");
          await signOut(auth);
        }
      } catch (err) {
        console.error("❌ Sign out error:", err);
      }
    }
  },
  
  isLoggedIn() {
    return localStorage.getItem(DB_KEYS.AUTH) === 'true';
  }
};
