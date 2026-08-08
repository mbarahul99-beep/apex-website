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

// Seed data for results matching the Aakash excellence list format
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

// Database operations helper
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
  // Initialize all databases
  init() {
    // Migrate or load settings to ensure logo keys and exam portal URL are populated
    const storedSettings = localStorage.getItem(DB_KEYS.SETTINGS);
    if (storedSettings) {
      try {
        const parsed = JSON.parse(storedSettings);
        let updated = false;
        if (!parsed.logoUrl) { parsed.logoUrl = "/logo.png"; updated = true; }
        if (!parsed.logoNameUrl) { parsed.logoNameUrl = "/logo_name.png"; updated = true; }
        if (!parsed.logoIconHeight) { parsed.logoIconHeight = "44px"; updated = true; }
        if (!parsed.logoWidth) { parsed.logoWidth = "180px"; updated = true; }
        if (!parsed.logoHeight) { parsed.logoHeight = "45px"; updated = true; }
        if (!parsed.examPortalUrl) { parsed.examPortalUrl = "https://app.instituteapex.in?app=student"; updated = true; }
        if (parsed.showBlogImagesOnHome === undefined) { parsed.showBlogImagesOnHome = false; updated = true; }
        if (updated) {
          localStorage.setItem(DB_KEYS.SETTINGS, JSON.stringify(parsed));
        }
      } catch (e) {
        localStorage.setItem(DB_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
      }
    } else {
      loadData(DB_KEYS.SETTINGS, DEFAULT_SETTINGS);
    }

    loadData(DB_KEYS.SLIDERS, DEFAULT_SLIDERS);
    
    // Reset/migrate stored Kalam data to use the brochure image
    const storedKalam = localStorage.getItem(DB_KEYS.KALAM);
    if (storedKalam) {
      try {
        const parsed = JSON.parse(storedKalam);
        if (parsed.quoteText || !parsed.imageUrl || parsed.imageUrl.includes('unsplash.com')) {
          localStorage.setItem(DB_KEYS.KALAM, JSON.stringify(DEFAULT_KALAM));
        }
      } catch (e) {
        localStorage.setItem(DB_KEYS.KALAM, JSON.stringify(DEFAULT_KALAM));
      }
    } else {
      loadData(DB_KEYS.KALAM, DEFAULT_KALAM);
    }
    loadData(DB_KEYS.SCHOLARSHIPS, DEFAULT_SCHOLARSHIPS);
    loadData(DB_KEYS.COURSES, DEFAULT_COURSES);
    loadData(DB_KEYS.RESOURCES, DEFAULT_RESOURCES);
    loadData(DB_KEYS.TESTIMONIALS, DEFAULT_TESTIMONIALS);
    // Migrate or seed student results
    const storedResults = localStorage.getItem(DB_KEYS.RESULTS);
    if (storedResults) {
      try {
        const parsed = JSON.parse(storedResults);
        const hasMissingYear = parsed.some(r => !r.year);
        if (parsed.length < 10 || hasMissingYear) {
          localStorage.setItem(DB_KEYS.RESULTS, JSON.stringify(DEFAULT_RESULTS));
        }
      } catch (e) {
        localStorage.setItem(DB_KEYS.RESULTS, JSON.stringify(DEFAULT_RESULTS));
      }
    } else {
      loadData(DB_KEYS.RESULTS, DEFAULT_RESULTS);
    }
    loadData(DB_KEYS.PAGES, DEFAULT_PAGES);
    loadData(DB_KEYS.POSTS, DEFAULT_POSTS);
    loadData(DB_KEYS.ENQUIRIES, []);
  },

  // Settings
  getSettings() {
    return loadData(DB_KEYS.SETTINGS, DEFAULT_SETTINGS);
  },
  saveSettings(settings) {
    saveData(DB_KEYS.SETTINGS, settings);
    return settings;
  },

  // Sliders
  getSliders() {
    return loadData(DB_KEYS.SLIDERS, DEFAULT_SLIDERS).sort((a,b) => a.orderIndex - b.orderIndex);
  },
  saveSliders(sliders) {
    saveData(DB_KEYS.SLIDERS, sliders);
    return sliders;
  },

  // Kalam Section
  getKalam() {
    return loadData(DB_KEYS.KALAM, DEFAULT_KALAM);
  },
  saveKalam(kalam) {
    saveData(DB_KEYS.KALAM, kalam);
    return kalam;
  },

  // Courses
  getCourses() {
    return loadData(DB_KEYS.COURSES, DEFAULT_COURSES);
  },
  getCourse(id) {
    return this.getCourses().find(c => c.id === id);
  },
  saveCourse(course) {
    const courses = this.getCourses();
    const idx = courses.findIndex(c => c.id === course.id);
    if (idx > -1) {
      courses[idx] = course;
    } else {
      course.id = 'c_' + Date.now();
      courses.push(course);
    }
    saveData(DB_KEYS.COURSES, courses);
    return course;
  },
  deleteCourse(id) {
    const courses = this.getCourses().filter(c => c.id !== id);
    saveData(DB_KEYS.COURSES, courses);
  },

  // Results
  getResults() {
    return loadData(DB_KEYS.RESULTS, DEFAULT_RESULTS);
  },
  saveResult(result) {
    const list = this.getResults();
    const idx = list.findIndex(r => r.id === result.id);
    if (idx > -1) {
      list[idx] = result;
    } else {
      result.id = 'res_' + Date.now();
      list.push(result);
    }
    saveData(DB_KEYS.RESULTS, list);
    return result;
  },
  deleteResult(id) {
    const list = this.getResults().filter(r => r.id !== id);
    saveData(DB_KEYS.RESULTS, list);
  },

  // Scholarships
  getScholarships() {
    return loadData(DB_KEYS.SCHOLARSHIPS, DEFAULT_SCHOLARSHIPS).sort((a,b) => (a.orderIndex || 0) - (b.orderIndex || 0));
  },
  saveScholarship(scholarship) {
    const list = this.getScholarships();
    const idx = list.findIndex(s => s.id === scholarship.id);
    if (idx > -1) {
      list[idx] = scholarship;
    } else {
      scholarship.id = 'sc_' + Date.now();
      list.push(scholarship);
    }
    saveData(DB_KEYS.SCHOLARSHIPS, list);
    return scholarship;
  },
  deleteScholarship(id) {
    const list = this.getScholarships().filter(s => s.id !== id);
    saveData(DB_KEYS.SCHOLARSHIPS, list);
  },

  // Resources
  getResources() {
    return loadData(DB_KEYS.RESOURCES, DEFAULT_RESOURCES);
  },
  saveResource(resource) {
    const resources = this.getResources();
    const idx = resources.findIndex(r => r.id === resource.id);
    if (idx > -1) {
      resources[idx] = resource;
    } else {
      resource.id = 'r_' + Date.now();
      resources.push(resource);
    }
    saveData(DB_KEYS.RESOURCES, resources);
    return resource;
  },
  deleteResource(id) {
    const resources = this.getResources().filter(r => r.id !== id);
    saveData(DB_KEYS.RESOURCES, resources);
  },

  // Testimonials
  getTestimonials() {
    return loadData(DB_KEYS.TESTIMONIALS, DEFAULT_TESTIMONIALS);
  },
  saveTestimonial(testimonial) {
    const list = this.getTestimonials();
    const idx = list.findIndex(t => t.id === testimonial.id);
    if (idx > -1) {
      list[idx] = testimonial;
    } else {
      testimonial.id = 't_' + Date.now();
      list.push(testimonial);
    }
    saveData(DB_KEYS.TESTIMONIALS, list);
    return testimonial;
  },
  deleteTestimonial(id) {
    const list = this.getTestimonials().filter(t => t.id !== id);
    saveData(DB_KEYS.TESTIMONIALS, list);
  },

  // Pages
  getPages() {
    return loadData(DB_KEYS.PAGES, DEFAULT_PAGES);
  },
  getPageBySlug(slug) {
    return this.getPages().find(p => p.slug === slug);
  },
  savePage(page) {
    const pages = this.getPages();
    const idx = pages.findIndex(p => p.id === page.id);
    page.lastUpdated = new Date().toISOString();
    if (idx > -1) {
      pages[idx] = page;
    } else {
      page.id = 'p_' + Date.now();
      pages.push(page);
    }
    saveData(DB_KEYS.PAGES, pages);
    return page;
  },
  deletePage(id) {
    const pages = this.getPages().filter(p => p.id !== id);
    saveData(DB_KEYS.PAGES, pages);
  },

  // Posts
  getPosts() {
    return loadData(DB_KEYS.POSTS, DEFAULT_POSTS);
  },
  getPostBySlug(slug) {
    return this.getPosts().find(p => p.slug === slug);
  },
  savePost(post) {
    const posts = this.getPosts();
    const idx = posts.findIndex(p => p.id === post.id);
    if (idx > -1) {
      posts[idx] = post;
    } else {
      post.id = 'po_' + Date.now();
      post.publishDate = new Date().toLocaleDateString();
      posts.push(post);
    }
    saveData(DB_KEYS.POSTS, posts);
    return post;
  },
  deletePost(id) {
    const posts = this.getPosts().filter(p => p.id !== id);
    saveData(DB_KEYS.POSTS, posts);
  },

  // Enquiries
  getEnquiries() {
    return loadData(DB_KEYS.ENQUIRIES, []);
  },
  addEnquiry(enquiry) {
    const enquiries = this.getEnquiries();
    enquiry.id = 'e_' + Date.now();
    enquiry.status = 'New';
    enquiry.timestamp = new Date().toISOString();
    enquiries.unshift(enquiry);
    saveData(DB_KEYS.ENQUIRIES, enquiries);
    return enquiry;
  },
  updateEnquiryStatus(id, status) {
    const enquiries = this.getEnquiries();
    const idx = enquiries.findIndex(e => e.id === id);
    if (idx > -1) {
      enquiries[idx].status = status;
      saveData(DB_KEYS.ENQUIRIES, enquiries);
    }
  },
  deleteEnquiry(id) {
    const enquiries = this.getEnquiries().filter(e => e.id !== id);
    saveData(DB_KEYS.ENQUIRIES, enquiries);
  },

  // Authenticate Admin locally (using a default hash or config)
  login(username, password) {
    if (username === 'admin' && password === 'apex2026') {
      localStorage.setItem(DB_KEYS.AUTH, 'true');
      return true;
    }
    return false;
  },
  logout() {
    localStorage.removeItem(DB_KEYS.AUTH);
  },
  isLoggedIn() {
    return localStorage.getItem(DB_KEYS.AUTH) === 'true';
  }
};
