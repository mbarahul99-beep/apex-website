import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  deleteDoc,
  updateDoc
} from "firebase/firestore";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { db, auth, isDefault } from "./firebase";

// Database Service using LocalStorage with Brochure details as default seed data
const DB_KEYS = {
  SETTINGS: 'apex_settings',
  SLIDERS: 'apex_sliders',
  KALAM: 'apex_kalam',
  COURSES: 'apex_courses',
  RESOURCES: 'apex_resources',
  TESTIMONIALS: 'apex_testimonials',
  RESULTS: 'apex_results',
  ENQUIRIES: 'apex_enquiries',
  PAGES: 'apex_pages',
  POSTS: 'apex_posts',
  AUTH: 'apex_admin_auth',
  SCHOLARSHIPS: 'apex_scholarships'
};

const DEFAULT_SETTINGS = {
  instituteName: "APEX INSTITUTE",
  tagline: "Institute of Medical Entrance Exams (NEET) & IIT-JEE Coaching & Tuition",
  address: "#1257, Urban Estate, Near HUDA Ground, Jind-126102 (Haryana)",
  phone: "94677-52374",
  telephone: "01681-247700",
  email: "instituteapexjind@gmail.com",
  whatsappText: "Hello Apex Institute, I would like to enquire about your coaching courses.",
  logoUrl: "/logo.png",
  logoNameUrl: "/logo_name.png",
  logoIconHeight: "44px",
  logoWidth: "180px",
  logoHeight: "45px",
  examPortalUrl: "https://app.instituteapex.in?app=student",
  showBlogImagesOnHome: false
};

const DEFAULT_SLIDERS = [
  { id: "s1", imageUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=800", orderIndex: 0, active: true },
  { id: "s2", imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=800", orderIndex: 1, active: true },
  { id: "s3", imageUrl: "https://images.unsplash.com/photo-1532187643603-ba119ca4109e?q=80&w=800", orderIndex: 2, active: true },
  { id: "s4", imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800", orderIndex: 3, active: true },
  { id: "s5", imageUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=800", orderIndex: 4, active: true },
  { id: "s6", imageUrl: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=800", orderIndex: 5, active: true },
  { id: "s7", imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800", orderIndex: 6, active: true },
  { id: "s8", imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800", orderIndex: 7, active: true },
  { id: "s9", imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800", orderIndex: 8, active: true },
  { id: "s10", imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800", orderIndex: 9, active: true }
];

const DEFAULT_KALAM = {
  imageUrl: "/kalam.jpg"
};

const DEFAULT_SCHOLARSHIPS = [
  { 
    id: "sc1", 
    title: "APEX AASAT Entrance Scholarship", 
    criteria: "Top 1-10 ranks in AASAT (APEX Admission Cum Scholarship Test)", 
    discount: "80% Tuition Fee Waiver", 
    description: "Applicable to classroom integration coaching programs for NEET/JEE. Requires qualifying test verification.", 
    orderIndex: 0 
  },
  { 
    id: "sc2", 
    title: "Board Examination Merit Award", 
    criteria: ">= 95% aggregate marks in 10th or 12th Board Examinations", 
    discount: "50% Tuition Fee Waiver", 
    description: "Applies to CBSE and Haryana Board toppers residing in Jind district. High academic records support standard tuition waivers.", 
    orderIndex: 1 
  },
  { 
    id: "sc3", 
    title: "National Olympiad & NTSE Scholars Program", 
    criteria: "NTSE Stage-2 qualifiers or National Olympiad Medalists", 
    discount: "100% Tuition Fee Waiver", 
    description: "Full scholarship program covering academic study sheets, tests, and mock coaching fees to support exceptional talent.", 
    orderIndex: 2 
  },
  { 
    id: "sc4", 
    title: "Sibling Education Assistance", 
    criteria: "Siblings of active or graduated APEX students", 
    discount: "10% Tuition Fee Waiver", 
    description: "Family assistance discount on tuition fee, valid throughout the duration of concurrent course enrollment.", 
    orderIndex: 3 
  }
];

const DEFAULT_COURSES = [
  {
    id: "c1",
    title: "NEET Integrated Classroom Program",
    category: "class-11-12",
    target: "11th & 12th Classes (Medical Entrance Exams & Tuitions)",
    boards: "CBSE & HBSE Board Students",
    duration: "1 Year / 2 Years Integrated Course",
    schedule: "Mon - Fri (3 hrs) • Sat - Sun (3 hrs)",
    fee: 45000,
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=600",
    details: "Comprehensive coaching for NEET biology, chemistry, and physics along with core board syllabus coverage for both CBSE and Haryana Board."
  },
  {
    id: "c2",
    title: "IIT-JEE Entrance & Board Preparation",
    category: "class-11-12",
    target: "11th & 12th Classes (JEE Main, Advanced & Board Tuitions)",
    boards: "CBSE & HBSE Board Students",
    duration: "1 Year / 2 Years Integrated Course",
    schedule: "Mon - Fri (3 hrs) • Sat - Sun (3.5 hrs)",
    fee: 50000,
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=600",
    details: "In-depth engineering prep covering physics, chemistry, and mathematics with rigour, mock test series, and structured notes matching CBSE and HBSE."
  },
  {
    id: "c3",
    title: "Junior Science & Maths Foundation",
    category: "class-9-10",
    target: "9th & 10th Classes (Tuition, NTSE & Olympiads Prep)",
    boards: "ICSE, CBSE & HBSE Board Students",
    duration: "1 Year Foundation",
    schedule: "Tue - Thu - Sat (2.5 hrs)",
    fee: 25000,
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=600",
    details: "Covers Core Mathematics, Physics, Chemistry, and Biology, custom-tailored to trigger logical thinking for NTSE, Olympiads, and school toppers."
  },
  {
    id: "c4",
    title: "Olympiad & NTSE Excellence Prep",
    category: "class-9-10",
    target: "9th & 10th Classes (Tuition & Competition Focus)",
    boards: "ICSE, CBSE & HBSE Board Students",
    duration: "1 Year Intensive Course",
    schedule: "Wed - Fri - Sun (3 hrs)",
    fee: 28000,
    image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=600",
    details: "Advanced conceptual tutoring in Math and Science subjects. Boosts analytical and problem-solving capabilities required for national competitive exams."
  }
];

const DEFAULT_RESOURCES = [
  { id: "r1", title: "JEE Main Answer Key & Detailed Solutions", type: "answer-key", linkUrl: "#" },
  { id: "r2", title: "NEET 2026 Question Paper & Solution Keys", type: "answer-key", linkUrl: "#" },
  { id: "r3", title: "Haryana Board (HBSE) Class 12 Date Sheet 2027", type: "news", linkUrl: "#" },
  { id: "r4", title: "Class 10th NTSE Mock Papers & Answer Guides", type: "answer-key", linkUrl: "#" }
];

const DEFAULT_TESTIMONIALS = [
  {
    id: "t1",
    studentName: "Aarav Sharma",
    examType: "IIT-JEE Main",
    rankBadge: "Percentile 99.98%ile",
    photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&fit=crop",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    textReview: "The support I got from Apex classes was unparalleled. The regular test feedback enabled me to identify weaker conceptual sections in Physics and Maths."
  },
  {
    id: "t2",
    studentName: "Priyanka Jindal",
    examType: "NEET UG",
    rankBadge: "AIR 124",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&fit=crop",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    textReview: "Personalized attention and detailed worksheets helped me crack NEET biology with high scoring confidence. Highly recommend Apex Jind!"
  }
];

const DEFAULT_RESULTS = [
  { id: "res1", studentName: "Utkarsh Khokhar", examType: "JEE Main", achievement: "Percentile 99.99%ile", location: "State Haryana", photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&fit=crop", year: "2025" },
  { id: "res2", studentName: "Ajaiy P", examType: "JEE Main", achievement: "Percentile 99.98%ile", location: "State Haryana", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&fit=crop", year: "2025" },
  { id: "res3", studentName: "Aarav Gupta", examType: "NEET", achievement: "AIR 45", location: "Marks 715/720", photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&fit=crop", year: "2025" },
  { id: "res4", studentName: "R Jayanth Shekhar", examType: "NEET", achievement: "AIR 112", location: "Marks 705/720", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&fit=crop", year: "2025" },
  { id: "res5", studentName: "Krishang Joshi", examType: "Olympiads", achievement: "Gold Medalist", location: "INBO (Biology)", photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=200&fit=crop", year: "2024" },
  { id: "res6", studentName: "Nisha Hooda", examType: "GUJ-CET", achievement: "AIR 23", location: "Percentile 99.95%ile", photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&fit=crop", year: "2024" },
  { id: "res7", studentName: "Amit Malik", examType: "NEET", achievement: "AIR 180", location: "Marks 698/720", photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&fit=crop", year: "2025" },
  { id: "res8", studentName: "Divya Sharma", examType: "NEET", achievement: "AIR 210", location: "Marks 695/720", photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&fit=crop", year: "2025" },
  { id: "res9", studentName: "Sahil Verma", examType: "JEE Main", achievement: "AIR 450", location: "Percentile 99.5%ile", photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&fit=crop", year: "2024" },
  { id: "res10", studentName: "Kavita Rani", examType: "JEE Main", achievement: "AIR 612", location: "Percentile 99.3%ile", photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&fit=crop", year: "2023" },
  { id: "res11", studentName: "Rahul Verma", examType: "NEET", achievement: "AIR 320", location: "Marks 685/720", photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&fit=crop", year: "2025" },
  { id: "res12", studentName: "Neha Singhal", examType: "NEET", achievement: "AIR 402", location: "Marks 680/720", photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&fit=crop", year: "2025" },
  { id: "res13", studentName: "Saurabh Garg", examType: "JEE Main", achievement: "Percentile 99.1%ile", location: "State Haryana", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&fit=crop", year: "2025" },
  { id: "res14", studentName: "Pooja Sharma", examType: "Olympiads", achievement: "Silver Medalist", location: "INChO (Chemistry)", photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&fit=crop", year: "2025" }
];

const DEFAULT_PAGES = [
  {
    id: "p1",
    title: "About Apex Institute Jind",
    slug: "about-apex-jind",
    content: "<h2>Welcome to Institute APEX</h2><p>Apex Institute is Jind's leading educational setup catering to students aiming to excel in NEET, IIT-JEE, NTSE, and Olympiads. Nestled in Urban Estate, Jind, we provide unmatched guidance for Class 9th to 12th across CBSE, HBSE, and ICSE boards.</p><p>Our structured pedagogy, focus on core concepts, and regular assessment cycles ensure every student reaches their highest potential.</p>",
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
    content: "<p>Balancing board exams (CBSE/HBSE) alongside rigorous JEE preparation is a common concern for Class 12 aspirants. Here are crucial strategies:</p><ul><li><b>Align Topics:</b> Physics and Chemistry syllabus overlaps heavily. Study them concurrently.</li><li><b>Solve Board Previous Years:</b> Allocate weekend slots to practice writing descriptive answers for board prep.</li><li><b>Mock Exams:</b> Take regular mock OMR tests at APEX to refine speed while writing subjective tests at school.</li></ul>",
    coverImage: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=600",
    metaTitle: "Tips to Balance CBSE/HBSE Board Exams with JEE Prep",
    metaDescription: "Struggling to balance JEE Main coaching with CBSE or HBSE Board Exam preparations? Read the expert guidelines from Apex Institute teachers.",
    keywords: "boards and jee, school and coaching, cbse preparation, hbse exam tips",
    publishDate: new Date().toLocaleDateString(),
    category: "JEE"
  }
];

// Memory cache object for synchronous reads
const cache = {
  settings: DEFAULT_SETTINGS,
  sliders: DEFAULT_SLIDERS,
  kalam: DEFAULT_KALAM,
  courses: DEFAULT_COURSES,
  resources: DEFAULT_RESOURCES,
  testimonials: DEFAULT_TESTIMONIALS,
  results: DEFAULT_RESULTS,
  enquiries: [],
  pages: DEFAULT_PAGES,
  posts: DEFAULT_POSTS,
  scholarships: DEFAULT_SCHOLARSHIPS
};

// Database operations helper for LocalStorage
const loadData = (key, fallback) => {
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(fallback));
    return fallback;
  }
  return JSON.parse(data);
};

const saveData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const dbService = {
  // Initialize and preload databases into cache
  async init() {
    if (isDefault) {
      // LocalStorage mode
      cache.settings = loadData(DB_KEYS.SETTINGS, DEFAULT_SETTINGS);
      cache.sliders = loadData(DB_KEYS.SLIDERS, DEFAULT_SLIDERS).sort((a,b) => a.orderIndex - b.orderIndex);
      cache.kalam = loadData(DB_KEYS.KALAM, DEFAULT_KALAM);
      cache.courses = loadData(DB_KEYS.COURSES, DEFAULT_COURSES);
      cache.resources = loadData(DB_KEYS.RESOURCES, DEFAULT_RESOURCES);
      cache.testimonials = loadData(DB_KEYS.TESTIMONIALS, DEFAULT_TESTIMONIALS);
      cache.results = loadData(DB_KEYS.RESULTS, DEFAULT_RESULTS);
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

      // 2. Kalam Quote
      const kalamSnap = await getDoc(doc(db, "kalam", "main"));
      if (kalamSnap.exists()) {
        cache.kalam = kalamSnap.data();
      } else {
        await setDoc(doc(db, "kalam", "main"), DEFAULT_KALAM);
        cache.kalam = DEFAULT_KALAM;
      }

      // Collection loader and dynamic seeder
      const loadCollection = async (colName, defaults) => {
        const snap = await getDocs(collection(db, colName));
        if (!snap.empty) {
          return snap.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
        } else {
          // Dynamic Seed data to Firestore
          for (const item of defaults) {
            await setDoc(doc(db, colName, item.id), item);
          }
          return defaults;
        }
      };

      cache.sliders = (await loadCollection("sliders", DEFAULT_SLIDERS)).sort((a,b) => a.orderIndex - b.orderIndex);
      cache.courses = await loadCollection("courses", DEFAULT_COURSES);
      cache.resources = await loadCollection("resources", DEFAULT_RESOURCES);
      cache.testimonials = await loadCollection("testimonials", DEFAULT_TESTIMONIALS);
      cache.results = await loadCollection("results", DEFAULT_RESULTS);
      cache.pages = await loadCollection("pages", DEFAULT_PAGES);
      cache.posts = await loadCollection("posts", DEFAULT_POSTS);
      cache.scholarships = (await loadCollection("scholarships", DEFAULT_SCHOLARSHIPS)).sort((a,b) => (a.orderIndex || 0) - (b.orderIndex || 0));

      // 3. Enquiries (No seed required)
      const enquiriesSnap = await getDocs(collection(db, "enquiries"));
      cache.enquiries = enquiriesSnap.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));

    } catch (err) {
      console.error("⚠️ Firestore pre-loading failed. Reverting to LocalStorage.", err);
      // Fail-safe fallback loading
      cache.settings = loadData(DB_KEYS.SETTINGS, DEFAULT_SETTINGS);
      cache.sliders = loadData(DB_KEYS.SLIDERS, DEFAULT_SLIDERS);
      cache.kalam = loadData(DB_KEYS.KALAM, DEFAULT_KALAM);
      cache.courses = loadData(DB_KEYS.COURSES, DEFAULT_COURSES);
      cache.resources = loadData(DB_KEYS.RESOURCES, DEFAULT_RESOURCES);
      cache.testimonials = loadData(DB_KEYS.TESTIMONIALS, DEFAULT_TESTIMONIALS);
      cache.results = loadData(DB_KEYS.RESULTS, DEFAULT_RESULTS);
      cache.enquiries = loadData(DB_KEYS.ENQUIRIES, []);
      cache.pages = loadData(DB_KEYS.PAGES, DEFAULT_PAGES);
      cache.posts = loadData(DB_KEYS.POSTS, DEFAULT_POSTS);
      cache.scholarships = loadData(DB_KEYS.SCHOLARSHIPS, DEFAULT_SCHOLARSHIPS);
    }
  },

  // Settings
  getSettings() {
    return cache.settings;
  },
  saveSettings(settings) {
    cache.settings = settings;
    if (isDefault) {
      saveData(DB_KEYS.SETTINGS, settings);
    } else {
      setDoc(doc(db, "settings", "main"), settings).catch(err => console.error("Firestore settings save error:", err));
    }
    return settings;
  },

  // Sliders
  getSliders() {
    return cache.sliders;
  },
  saveSliders(sliders) {
    cache.sliders = sliders.sort((a,b) => a.orderIndex - b.orderIndex);
    if (isDefault) {
      saveData(DB_KEYS.SLIDERS, sliders);
    } else {
      for (const s of sliders) {
        setDoc(doc(db, "sliders", s.id), s).catch(err => console.error("Firestore slider save error:", err));
      }
    }
    return sliders;
  },

  // Kalam Section
  getKalam() {
    return cache.kalam;
  },
  saveKalam(kalam) {
    cache.kalam = kalam;
    if (isDefault) {
      saveData(DB_KEYS.KALAM, kalam);
    } else {
      setDoc(doc(db, "kalam", "main"), kalam).catch(err => console.error("Firestore kalam save error:", err));
    }
    return kalam;
  },

  // Courses
  getCourses() {
    return cache.courses;
  },
  getCourse(id) {
    return cache.courses.find(c => c.id === id);
  },
  saveCourse(course) {
    const list = [...cache.courses];
    if (!course.id) {
      course.id = 'c_' + Date.now();
    }
    const idx = list.findIndex(c => c.id === course.id);
    if (idx > -1) {
      list[idx] = course;
    } else {
      list.push(course);
    }
    cache.courses = list;

    if (isDefault) {
      saveData(DB_KEYS.COURSES, list);
    } else {
      setDoc(doc(db, "courses", course.id), course).catch(err => console.error("Firestore course save error:", err));
    }
    return course;
  },
  deleteCourse(id) {
    cache.courses = cache.courses.filter(c => c.id !== id);
    if (isDefault) {
      saveData(DB_KEYS.COURSES, cache.courses);
    } else {
      deleteDoc(doc(db, "courses", id)).catch(err => console.error("Firestore course delete error:", err));
    }
  },

  // Results
  getResults() {
    return cache.results;
  },
  saveResult(result) {
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
    cache.results = list;

    if (isDefault) {
      saveData(DB_KEYS.RESULTS, list);
    } else {
      setDoc(doc(db, "results", result.id), result).catch(err => console.error("Firestore result save error:", err));
    }
    return result;
  },
  deleteResult(id) {
    cache.results = cache.results.filter(r => r.id !== id);
    if (isDefault) {
      saveData(DB_KEYS.RESULTS, cache.results);
    } else {
      deleteDoc(doc(db, "results", id)).catch(err => console.error("Firestore result delete error:", err));
    }
  },

  // Scholarships
  getScholarships() {
    return cache.scholarships;
  },
  saveScholarship(scholarship) {
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

    if (isDefault) {
      saveData(DB_KEYS.SCHOLARSHIPS, cache.scholarships);
    } else {
      setDoc(doc(db, "scholarships", scholarship.id), scholarship).catch(err => console.error("Firestore scholarship save error:", err));
    }
    return scholarship;
  },
  deleteScholarship(id) {
    cache.scholarships = cache.scholarships.filter(s => s.id !== id);
    if (isDefault) {
      saveData(DB_KEYS.SCHOLARSHIPS, cache.scholarships);
    } else {
      deleteDoc(doc(db, "scholarships", id)).catch(err => console.error("Firestore scholarship delete error:", err));
    }
  },

  // Resources
  getResources() {
    return cache.resources;
  },
  saveResource(resource) {
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

    if (isDefault) {
      saveData(DB_KEYS.RESOURCES, list);
    } else {
      setDoc(doc(db, "resources", resource.id), resource).catch(err => console.error("Firestore resource save error:", err));
    }
    return resource;
  },
  deleteResource(id) {
    cache.resources = cache.resources.filter(r => r.id !== id);
    if (isDefault) {
      saveData(DB_KEYS.RESOURCES, cache.resources);
    } else {
      deleteDoc(doc(db, "resources", id)).catch(err => console.error("Firestore resource delete error:", err));
    }
  },

  // Testimonials
  getTestimonials() {
    return cache.testimonials;
  },
  saveTestimonial(testimonial) {
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

    if (isDefault) {
      saveData(DB_KEYS.TESTIMONIALS, list);
    } else {
      setDoc(doc(db, "testimonials", testimonial.id), testimonial).catch(err => console.error("Firestore testimonial save error:", err));
    }
    return testimonial;
  },
  deleteTestimonial(id) {
    cache.testimonials = cache.testimonials.filter(t => t.id !== id);
    if (isDefault) {
      saveData(DB_KEYS.TESTIMONIALS, cache.testimonials);
    } else {
      deleteDoc(doc(db, "testimonials", id)).catch(err => console.error("Firestore testimonial delete error:", err));
    }
  },

  // Pages
  getPages() {
    return cache.pages;
  },
  getPageBySlug(slug) {
    return cache.pages.find(p => p.slug === slug);
  },
  savePage(page) {
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

    if (isDefault) {
      saveData(DB_KEYS.PAGES, list);
    } else {
      setDoc(doc(db, "pages", page.id), page).catch(err => console.error("Firestore page save error:", err));
    }
    return page;
  },
  deletePage(id) {
    cache.pages = cache.pages.filter(p => p.id !== id);
    if (isDefault) {
      saveData(DB_KEYS.PAGES, cache.pages);
    } else {
      deleteDoc(doc(db, "pages", id)).catch(err => console.error("Firestore page delete error:", err));
    }
  },

  // Posts
  getPosts() {
    return cache.posts;
  },
  getPostBySlug(slug) {
    return cache.posts.find(p => p.slug === slug);
  },
  savePost(post) {
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

    if (isDefault) {
      saveData(DB_KEYS.POSTS, list);
    } else {
      setDoc(doc(db, "posts", post.id), post).catch(err => console.error("Firestore post save error:", err));
    }
    return post;
  },
  deletePost(id) {
    cache.posts = cache.posts.filter(p => p.id !== id);
    if (isDefault) {
      saveData(DB_KEYS.POSTS, cache.posts);
    } else {
      deleteDoc(doc(db, "posts", id)).catch(err => console.error("Firestore post delete error:", err));
    }
  },

  // Enquiries
  getEnquiries() {
    return cache.enquiries;
  },
  addEnquiry(enquiry) {
    enquiry.id = 'e_' + Date.now();
    enquiry.status = 'New';
    enquiry.timestamp = new Date().toISOString();
    const list = [enquiry, ...cache.enquiries];
    cache.enquiries = list;

    if (isDefault) {
      saveData(DB_KEYS.ENQUIRIES, list);
    } else {
      setDoc(doc(db, "enquiries", enquiry.id), enquiry).catch(err => console.error("Firestore enquiry save error:", err));
    }
    return enquiry;
  },
  updateEnquiryStatus(id, status) {
    const list = [...cache.enquiries];
    const idx = list.findIndex(e => e.id === id);
    if (idx > -1) {
      list[idx].status = status;
      cache.enquiries = list;
      if (isDefault) {
        saveData(DB_KEYS.ENQUIRIES, list);
      } else {
        updateDoc(doc(db, "enquiries", id), { status }).catch(err => console.error("Firestore enquiry update error:", err));
      }
    }
  },
  deleteEnquiry(id) {
    cache.enquiries = cache.enquiries.filter(e => e.id !== id);
    if (isDefault) {
      saveData(DB_KEYS.ENQUIRIES, cache.enquiries);
    } else {
      deleteDoc(doc(db, "enquiries", id)).catch(err => console.error("Firestore enquiry delete error:", err));
    }
  },

  // Firebase Auth Login
  async login(username, password) {
    if (isDefault) {
      if (username === 'admin' && password === 'apex2026') {
        localStorage.setItem(DB_KEYS.AUTH, 'true');
        return Promise.resolve(true);
      }
      return Promise.resolve(false);
    }
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, username, password);
      localStorage.setItem(DB_KEYS.AUTH, 'true');
      return true;
    } catch (err) {
      console.error("❌ Authentication error:", err);
      throw err;
    }
  },
  
  async logout() {
    localStorage.removeItem(DB_KEYS.AUTH);
    if (!isDefault) {
      try {
        await signOut(auth);
      } catch (err) {
        console.error("❌ Sign out error:", err);
      }
    }
  },
  
  isLoggedIn() {
    return localStorage.getItem(DB_KEYS.AUTH) === 'true';
  }
};
