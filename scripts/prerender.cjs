const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '..', 'dist');
const baseHtmlPath = path.join(distDir, 'index.html');

if (!fs.existsSync(baseHtmlPath)) {
  console.error('dist/index.html not found! Run vite build first.');
  process.exit(1);
}

const baseHtml = fs.readFileSync(baseHtmlPath, 'utf8');

const routes = [
  {
    path: 'courses',
    title: 'NEET & IIT-JEE Coaching Courses in Jind | Institute APEX (CBSE & ICSE)',
    description: 'Explore classroom coaching programs for NEET (Medical), IIT-JEE (Main & Advanced), and Foundation (Classes 9th & 10th) at Institute APEX, Urban Estate, Jind. Small batches & 16+ years of top ranks.',
    canonical: 'https://instituteapex.in/courses',
    heading: 'Coaching Courses & Academic Programs at Institute APEX Jind',
    contentHtml: `
      <section style="max-width:1200px;margin:30px auto;padding:0 20px;font-family:-apple-system,BlinkMacSystemFont,sans-serif;color:#0f2b48;">
        <h1 style="font-size:2rem;font-weight:800;color:#0f2b48;margin-bottom:12px;">Premier Coaching Courses for NEET, IIT-JEE & Foundation in Jind</h1>
        <p style="font-size:1.05rem;line-height:1.6;color:#334155;margin-bottom:28px;">
          Institute APEX offers comprehensive classroom programs designed by veteran educators with 16+ years of proven top ranks in medical and engineering entrance examinations. Located at Urban Estate, Jind, our campus provides rigorous syllabus coverage, daily doubt resolution, and personalized attention.
        </p>

        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(300px, 1fr));gap:24px;margin-bottom:40px;">
          <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;padding:24px;box-shadow:0 2px 8px rgba(0,0,0,0.05);">
            <h2 style="font-size:1.35rem;font-weight:700;color:#0369a1;margin-bottom:8px;">NEET (UG) Medical Entrance Course</h2>
            <p style="font-size:0.95rem;color:#475569;line-height:1.5;">Targeted 1-Year & 2-Year comprehensive preparation for Class 11th, 12th & Droppers covering Physics, Chemistry, and Biology (NCERT-focused + Advanced Level).</p>
            <ul style="padding-left:20px;font-size:0.9rem;color:#334155;line-height:1.6;">
              <li>Comprehensive NCERT line-by-line coverage</li>
              <li>Weekly OMR-based NEET pattern mock tests</li>
              <li>Small batches of 25-30 students for personal care</li>
            </ul>
          </div>

          <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;padding:24px;box-shadow:0 2px 8px rgba(0,0,0,0.05);">
            <h2 style="font-size:1.35rem;font-weight:700;color:#0369a1;margin-bottom:8px;">IIT-JEE (Main & Advanced) Engineering</h2>
            <p style="font-size:0.95rem;color:#475569;line-height:1.5;">Integrated foundation and advanced problem-solving in Physics, Chemistry, and Mathematics for Class 11th, 12th, and repeaters.</p>
            <ul style="padding-left:20px;font-size:0.9rem;color:#334155;line-height:1.6;">
              <li>Conceptual numerical mastery from fundamentals to JEE Adv</li>
              <li>Computer-Based Test (CBT) portal practice</li>
              <li>Daily Practice Problem (DPP) sets with doubt removal</li>
            </ul>
          </div>

          <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;padding:24px;box-shadow:0 2px 8px rgba(0,0,0,0.05);">
            <h2 style="font-size:1.35rem;font-weight:700;color:#0369a1;margin-bottom:8px;">Junior Science & Maths Foundation (Classes 9th & 10th)</h2>
            <p style="font-size:0.95rem;color:#475569;line-height:1.5;">Early competitive edge for CBSE, ICSE, and State Boards with special orientation for Olympiads and NTSE.</p>
            <ul style="padding-left:20px;font-size:0.9rem;color:#334155;line-height:1.6;">
              <li>Complete school board distinction prep</li>
              <li>Analytical reasoning and scientific problem solving</li>
              <li>Strong mathematical aptitude training</li>
            </ul>
          </div>
        </div>

        <h2 style="font-size:1.4rem;font-weight:700;margin-bottom:16px;">Frequently Asked Questions (FAQs)</h2>
        <div style="background:#f8fafc;padding:20px;border-radius:12px;margin-bottom:30px;">
          <h3 style="font-size:1.1rem;font-weight:700;margin-bottom:6px;">How can I enroll in Institute APEX courses?</h3>
          <p style="font-size:0.95rem;color:#475569;line-height:1.5;margin-bottom:16px;">Visit our campus at #1257, Urban Estate, Near HUDA Ground, Jind, or call 94677-52374 / 01681-247700. Free 2-3 day trial demo classes are available for new admissions.</p>
          <h3 style="font-size:1.1rem;font-weight:700;margin-bottom:6px;">Are scholarships available for bright students?</h3>
          <p style="font-size:0.95rem;color:#475569;line-height:1.5;">Yes, we conduct the ASAT (APEX Scholarship Admission Test) offering up to 90% tuition fee concessions based on merit.</p>
        </div>
      </section>
    `,
    schema: {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "itemListElement": [
        {
          "@type": "Course",
          "name": "NEET (UG) Medical Classroom Coaching",
          "description": "Comprehensive 1-year and 2-year classroom coaching for NEET medical entrance at Jind.",
          "provider": { "@type": "EducationalOrganization", "name": "Institute APEX", "url": "https://instituteapex.in" }
        },
        {
          "@type": "Course",
          "name": "IIT-JEE (Main & Advanced) Entrance Coaching",
          "description": "Intensive Physics, Chemistry, and Mathematics engineering preparation in Jind.",
          "provider": { "@type": "EducationalOrganization", "name": "Institute APEX", "url": "https://instituteapex.in" }
        },
        {
          "@type": "Course",
          "name": "Class 9th & 10th Junior Science & Maths Foundation",
          "description": "Board exam distinction and Olympiad foundation program for Classes 9 and 10.",
          "provider": { "@type": "EducationalOrganization", "name": "Institute APEX", "url": "https://instituteapex.in" }
        }
      ]
    }
  },
  {
    path: 'courses/c1',
    title: 'NEET Integrated Classroom Program in Jind | Institute APEX',
    description: 'Integrated classroom coaching in Jind for Class 11th & 12th medical students preparing for NEET entrance and CBSE/ICSE board examinations at Institute APEX.',
    canonical: 'https://instituteapex.in/courses/c1',
    heading: 'NEET Integrated Classroom Program at Institute APEX Jind',
    contentHtml: `
      <article style="max-width:1000px;margin:30px auto;padding:0 20px;font-family:-apple-system,BlinkMacSystemFont,sans-serif;color:#0f2b48;">
        <h1 style="font-size:2.2rem;font-weight:800;color:#0f2b48;margin-bottom:14px;">NEET Integrated Classroom Program in Jind</h1>
        <p style="font-size:1.1rem;line-height:1.6;color:#334155;margin-bottom:24px;">
          Comprehensive 1-Year and 2-Year classroom coaching programs for Class 11th & 12th medical aspirants in Jind. Covering Physics, Chemistry, and Biology for NEET alongside complete school board syllabus (CBSE, ICSE, and State Boards).
        </p>
        <div style="background:#f8fafc;padding:24px;border-radius:12px;margin-bottom:28px;border:1px solid #e2e8f0;">
          <h2 style="font-size:1.3rem;font-weight:700;color:#0369a1;margin-bottom:12px;">Course Highlights</h2>
          <ul style="padding-left:20px;line-height:1.8;color:#334155;">
            <li>Daily concept classes with NCERT line-by-line coverage</li>
            <li>Weekly OMR-based NEET mock test series</li>
            <li>Small batch sizes of 25-30 students for personal care</li>
            <li>Daily 1-on-1 doubt clearing sessions with senior faculty</li>
          </ul>
        </div>
      </article>
    `,
    schema: {
      "@context": "https://schema.org",
      "@type": "Course",
      "name": "NEET Integrated Classroom Program",
      "description": "Integrated classroom coaching for Class 11th and 12th medical aspirants preparing for NEET entrance examination.",
      "provider": { "@type": "EducationalOrganization", "name": "Institute APEX", "url": "https://instituteapex.in" }
    }
  },
  {
    path: 'courses/c2',
    title: 'IIT-JEE Entrance & Board Preparation in Jind | Institute APEX',
    description: 'Targeted classroom coaching in Jind for Class 11th & 12th engineering aspirants preparing for JEE Main & JEE Advanced alongside CBSE/ICSE boards.',
    canonical: 'https://instituteapex.in/courses/c2',
    heading: 'IIT-JEE Entrance & Board Preparation at Institute APEX Jind',
    contentHtml: `
      <article style="max-width:1000px;margin:30px auto;padding:0 20px;font-family:-apple-system,BlinkMacSystemFont,sans-serif;color:#0f2b48;">
        <h1 style="font-size:2.2rem;font-weight:800;color:#0f2b48;margin-bottom:14px;">IIT-JEE Entrance & Board Preparation in Jind</h1>
        <p style="font-size:1.1rem;line-height:1.6;color:#334155;margin-bottom:24px;">
          Targeted classroom coaching for Class 11th and 12th engineering aspirants. The curriculum covers Physics, Chemistry, and Mathematics for JEE Main and JEE Advanced alongside board syllabus requirements.
        </p>
        <div style="background:#f8fafc;padding:24px;border-radius:12px;margin-bottom:28px;border:1px solid #e2e8f0;">
          <h2 style="font-size:1.3rem;font-weight:700;color:#0369a1;margin-bottom:12px;">Course Highlights</h2>
          <ul style="padding-left:20px;line-height:1.8;color:#334155;">
            <li>Conceptual problem solving from fundamentals to JEE Advanced level</li>
            <li>Computer-Based Test (CBT) portal simulation practice</li>
            <li>Daily Practice Problem (DPP) sets with dedicated solution hours</li>
            <li>Synchronized board examination subjective answer writing</li>
          </ul>
        </div>
      </article>
    `,
    schema: {
      "@context": "https://schema.org",
      "@type": "Course",
      "name": "IIT-JEE Entrance & Board Preparation",
      "description": "Classroom coaching in Jind for Class 11th and 12th engineering aspirants preparing for JEE Main & JEE Advanced.",
      "provider": { "@type": "EducationalOrganization", "name": "Institute APEX", "url": "https://instituteapex.in" }
    }
  },
  {
    path: 'courses/c3',
    title: 'Junior Science & Maths Foundation Course in Jind | Institute APEX',
    description: 'Foundation coaching in Jind for Class 9th and 10th students in Science and Mathematics for CBSE, ICSE, NTSE and Olympiad preparations.',
    canonical: 'https://instituteapex.in/courses/c3',
    heading: 'Junior Science & Maths Foundation at Institute APEX Jind',
    contentHtml: `
      <article style="max-width:1000px;margin:30px auto;padding:0 20px;font-family:-apple-system,BlinkMacSystemFont,sans-serif;color:#0f2b48;">
        <h1 style="font-size:2.2rem;font-weight:800;color:#0f2b48;margin-bottom:14px;">Junior Science & Maths Foundation in Jind</h1>
        <p style="font-size:1.1rem;line-height:1.6;color:#334155;margin-bottom:24px;">
          Foundation coaching for Class 9th and 10th students in Science and Mathematics. Designed to build strong fundamentals for school board examinations (CBSE, ICSE, and HBSE) while laying the groundwork for NTSE, Olympiads, and future competitive exams.
        </p>
        <div style="background:#f8fafc;padding:24px;border-radius:12px;margin-bottom:28px;border:1px solid #e2e8f0;">
          <h2 style="font-size:1.3rem;font-weight:700;color:#0369a1;margin-bottom:12px;">Course Highlights</h2>
          <ul style="padding-left:20px;line-height:1.8;color:#334155;">
            <li>Early conceptual mastery in Physics, Chemistry, Biology & Mathematics</li>
            <li>Complete distinction preparation for CBSE, ICSE & HBSE boards</li>
            <li>Analytical aptitude training for NTSE and Olympiads</li>
            <li>Small batch sizes for personalized care</li>
          </ul>
        </div>
      </article>
    `,
    schema: {
      "@context": "https://schema.org",
      "@type": "Course",
      "name": "Junior Science & Maths Foundation",
      "description": "Foundation coaching for Class 9th and 10th students in Science and Mathematics in Jind.",
      "provider": { "@type": "EducationalOrganization", "name": "Institute APEX", "url": "https://instituteapex.in" }
    }
  },
  {
    path: 'about',
    title: 'About Institute APEX Jind | 16+ Years Medical & Engineering Coaching',
    description: 'Learn about Institute APEX, Jind’s premier coaching institute for NEET and IIT-JEE located at Urban Estate, Jind. Established in 2009 by senior educators producing top medical and engineering ranks.',
    canonical: 'https://instituteapex.in/about',
    heading: 'About Institute APEX - 16+ Years of Proven Ranks in Jind',
    contentHtml: `
      <section style="max-width:1200px;margin:30px auto;padding:0 20px;font-family:-apple-system,BlinkMacSystemFont,sans-serif;color:#0f2b48;">
        <h1 style="font-size:2rem;font-weight:800;color:#0f2b48;margin-bottom:12px;">About Institute APEX Jind</h1>
        <p style="font-size:1.05rem;line-height:1.6;color:#334155;margin-bottom:20px;">
          Established in 2009, Institute APEX has stood as Jind's most dependable and result-oriented coaching center for medical (NEET) and engineering (IIT-JEE) entrance examinations, as well as secondary school board distinctions (CBSE, ICSE, HBSE).
        </p>
        <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;padding:24px;margin-bottom:24px;">
          <h2 style="font-size:1.35rem;font-weight:700;color:#0369a1;margin-bottom:10px;">Our Core Philosophy</h2>
          <p style="font-size:0.95rem;color:#475569;line-height:1.6;">
            We believe that every student has latent potential that blossoms with individual mentorship, structured study material, and timely feedback. Unlike massive commercial factories with hundreds of students per batch, APEX maintains intimate batch sizes (25-30 students) where every student's doubts are answered daily.
          </p>
        </div>
        <div style="background:#f8fafc;border-radius:12px;padding:24px;">
          <h2 style="font-size:1.35rem;font-weight:700;color:#0369a1;margin-bottom:10px;">Campus & Contact Details</h2>
          <p style="font-size:0.95rem;color:#475569;line-height:1.6;">
            <strong>Location:</strong> #1257, Urban Estate, Near HUDA Ground, Jind-126102 (Haryana)<br/>
            <strong>Helpline:</strong> 94677-52374 | Landline: 01681-247700<br/>
            <strong>Email:</strong> instituteapexjind@gmail.com
          </p>
        </div>
      </section>
    `,
    schema: {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      "name": "About Institute APEX Jind",
      "url": "https://instituteapex.in/about",
      "mainEntity": {
        "@type": "EducationalOrganization",
        "name": "Institute APEX",
        "foundingDate": "2009",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "#1257, Urban Estate, Near HUDA Ground",
          "addressLocality": "Jind",
          "addressRegion": "Haryana",
          "postalCode": "126102",
          "addressCountry": "IN"
        }
      }
    }
  },
  {
    path: 'scholarships',
    title: 'ASAT Scholarship Test & Admission Concessions | Institute APEX Jind',
    description: 'Apply for the APEX Scholarship Admission Test (ASAT). Up to 90% tuition fee waiver for meritorious students in Class 9, 10, 11, 12, and NEET/JEE repeaters in Jind, Haryana.',
    canonical: 'https://instituteapex.in/scholarships',
    heading: 'APEX Scholarship Admission Test (ASAT) - Up to 90% Fee Waiver',
    contentHtml: `
      <section style="max-width:1200px;margin:30px auto;padding:0 20px;font-family:-apple-system,BlinkMacSystemFont,sans-serif;color:#0f2b48;">
        <h1 style="font-size:2rem;font-weight:800;color:#0f2b48;margin-bottom:12px;">ASAT Scholarship Admission Test at Institute APEX</h1>
        <p style="font-size:1.05rem;line-height:1.6;color:#334155;margin-bottom:24px;">
          Institute APEX recognizes and rewards academic merit. Through our annual ASAT exam and board merit waivers, talented students from economically modest backgrounds receive up to 90% fee concessions on classroom tuition.
        </p>
        <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;padding:24px;margin-bottom:24px;">
          <h2 style="font-size:1.35rem;font-weight:700;color:#0369a1;margin-bottom:12px;">Scholarship Tiers</h2>
          <ul style="padding-left:20px;font-size:0.95rem;color:#334155;line-height:1.7;">
            <li><strong>Rank 1 to 5:</strong> Up to 90% Tuition Fee Concession</li>
            <li><strong>Rank 6 to 15:</strong> Up to 60% Tuition Fee Concession</li>
            <li><strong>Rank 16 to 30:</strong> Up to 40% Tuition Fee Concession</li>
            <li><strong>Board Distinction Waiver:</strong> Direct fee concessions for students scoring 90%+ in Class 10/12 board exams</li>
          </ul>
        </div>
      </section>
    `,
    schema: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "ASAT Scholarship Admission Test",
      "url": "https://instituteapex.in/scholarships"
    }
  },
  {
    path: 'results',
    title: 'NEET & IIT-JEE Results & Toppers | Institute APEX Jind',
    description: 'View the authentic selection list and board exam toppers from Institute APEX Jind across NEET (UG), IIT-JEE (Main & Advanced), CBSE & ICSE Boards.',
    canonical: 'https://instituteapex.in/results',
    heading: 'Outstanding Results & Achievers - Institute APEX Jind',
    contentHtml: `
      <section style="max-width:1200px;margin:30px auto;padding:0 20px;font-family:-apple-system,BlinkMacSystemFont,sans-serif;color:#0f2b48;">
        <h1 style="font-size:2rem;font-weight:800;color:#0f2b48;margin-bottom:12px;">Our Proud Achievers & Toppers</h1>
        <p style="font-size:1.05rem;line-height:1.6;color:#334155;margin-bottom:24px;">
          Year after year, students from Institute APEX earn admissions to prestigious government medical colleges (AIIMS, PGIMS, GMC) and top engineering institutions (IITs, NITs, BITS).
        </p>
      </section>
    `,
    schema: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Results & Achievers",
      "url": "https://instituteapex.in/results"
    }
  },
  {
    path: 'contact',
    title: 'Contact Institute APEX Jind | #1257 Urban Estate Near HUDA Ground',
    description: 'Visit Institute APEX at #1257, Urban Estate, Near HUDA Ground, Jind-126102 (Haryana). Call 94677-52374 or 01681-247700 for admission inquiries, demo classes, and counseling.',
    canonical: 'https://instituteapex.in/contact',
    heading: 'Contact Us - Institute APEX Jind Admissions Office',
    contentHtml: `
      <section style="max-width:1200px;margin:30px auto;padding:0 20px;font-family:-apple-system,BlinkMacSystemFont,sans-serif;color:#0f2b48;">
        <h1 style="font-size:2rem;font-weight:800;color:#0f2b48;margin-bottom:12px;">Contact Institute APEX Jind</h1>
        <p style="font-size:1.05rem;line-height:1.6;color:#334155;margin-bottom:24px;">
          Have questions regarding courses, admission criteria, or scholarship exams? Reach out to our academic counseling team or visit our Jind campus.
        </p>
        <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;padding:24px;line-height:1.8;">
          <p><strong>Campus Address:</strong> #1257, Urban Estate, Near HUDA Ground, Jind-126102 (Haryana)</p>
          <p><strong>Direct Helpline:</strong> <a href="tel:9467752374" style="color:#0284c7;text-decoration:none;">94677-52374</a></p>
          <p><strong>Landline:</strong> <a href="tel:01681247700" style="color:#0284c7;text-decoration:none;">01681-247700</a></p>
          <p><strong>WhatsApp Support:</strong> <a href="https://wa.me/919467752374" style="color:#16a34a;text-decoration:none;">Chat on WhatsApp</a></p>
          <p><strong>Email:</strong> instituteapexjind@gmail.com</p>
          <p><strong>Counseling Hours:</strong> Monday – Sunday: 8:00 AM – 7:00 PM</p>
        </div>
      </section>
    `,
    schema: {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      "name": "Contact Institute APEX Jind",
      "url": "https://instituteapex.in/contact"
    }
  },
  {
    path: 'blogs',
    title: 'NEET & JEE Preparation Blog & Academic News | Institute APEX Jind',
    description: 'Read expert preparation strategies, exam dates, syllabus changes, and study tips for NEET, IIT-JEE, and Class 10 & 12 Board examinations from APEX Jind faculty.',
    canonical: 'https://instituteapex.in/blogs',
    heading: 'NEET & JEE Entrance Preparation Insights & Articles',
    contentHtml: `
      <section style="max-width:1200px;margin:30px auto;padding:0 20px;font-family:-apple-system,BlinkMacSystemFont,sans-serif;color:#0f2b48;">
        <h1 style="font-size:2rem;font-weight:800;color:#0f2b48;margin-bottom:12px;">Educational Articles & Exam Guides</h1>
        <p style="font-size:1.05rem;line-height:1.6;color:#334155;margin-bottom:24px;">
          Expert academic articles, revision roadmaps, and guidelines curated by senior faculty at Institute APEX.
        </p>
      </section>
    `,
    schema: {
      "@context": "https://schema.org",
      "@type": "Blog",
      "name": "Institute APEX Education Blog",
      "url": "https://instituteapex.in/blogs"
    }
  },
  {
    path: 'online-prep',
    title: 'Online CBT Test Prep & Student Exam Portal | Institute APEX Jind',
    description: 'Access the APEX online computer-based test (CBT) portal for NEET and JEE Main mock exams, question papers, performance analytics, and OMR test series.',
    canonical: 'https://instituteapex.in/online-prep',
    heading: 'Online CBT Mock Tests & Assessment System',
    contentHtml: `
      <section style="max-width:1200px;margin:30px auto;padding:0 20px;font-family:-apple-system,BlinkMacSystemFont,sans-serif;color:#0f2b48;">
        <h1 style="font-size:2rem;font-weight:800;color:#0f2b48;margin-bottom:12px;">Online Test Prep & Exam Portal</h1>
        <p style="font-size:1.05rem;line-height:1.6;color:#334155;margin-bottom:24px;">
          Practice on real NTA-standard Computer Based Test (CBT) interfaces to build speed, accuracy, and exam temperament.
        </p>
      </section>
    `,
    schema: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Online CBT Test Prep Portal",
      "url": "https://instituteapex.in/online-prep"
    }
  },
  {
    path: 'posts/balance-boards-with-jee',
    title: 'How to Balance Board Exam Preparations with JEE Main | APEX Jind',
    description: 'Struggling to balance JEE Main coaching with CBSE or HBSE Board Exam preparations? Read expert guidelines from Apex Institute teachers on topic alignment and time management.',
    canonical: 'https://instituteapex.in/posts/balance-boards-with-jee',
    heading: 'Balancing Board Exams with JEE Preparation - Expert Strategy',
    contentHtml: `
      <article style="max-width:850px;margin:30px auto;padding:0 20px;font-family:-apple-system,BlinkMacSystemFont,sans-serif;color:#0f2b48;line-height:1.7;">
        <h1 style="font-size:2.1rem;font-weight:800;color:#0f2b48;margin-bottom:16px;">How to Balance Board Exam Preparations with JEE Main Coaching</h1>
        <p style="color:#64748b;font-size:0.9rem;margin-bottom:24px;">Published by Academic Faculty, Institute APEX Jind</p>
        <p style="font-size:1.05rem;color:#334155;margin-bottom:18px;">
          Balancing board exams (CBSE/HBSE) alongside rigorous JEE preparation is a frequent dilemma for Class 12 aspirants. However, with synchronized study schedules and strategic focus, students can easily excel in both examinations.
        </p>
        <h2 style="font-size:1.4rem;font-weight:700;color:#0369a1;margin-top:24px;margin-bottom:12px;">1. Synchronize Common Syllabi</h2>
        <p style="color:#334155;margin-bottom:16px;">
          Over 80% of Physics and Chemistry syllabus overlaps directly between CBSE Class 12 boards and JEE Main. When studying Electrostatics, Thermodynamics, or Organic Chemistry mechanisms, master the conceptual derivations required for subjective board answers while simultaneously solving objective numericals for JEE.
        </p>
        <h2 style="font-size:1.4rem;font-weight:700;color:#0369a1;margin-top:24px;margin-bottom:12px;">2. Allocate Weekend Slots for Subjective Writing Practice</h2>
        <p style="color:#334155;margin-bottom:16px;">
          Many students lose board marks not due to lack of knowledge, but due to poor answer presentation. Dedicate 2 hours every Sunday to write step-by-step solutions with labeled diagrams, standard SI units, and structured derivations.
        </p>
      </article>
    `,
    schema: {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": "How to Balance Board Exam Preparations with JEE Main Coaching",
      "datePublished": "2026-08-01",
      "author": { "@type": "Organization", "name": "Institute APEX" },
      "publisher": { "@type": "Organization", "name": "Institute APEX", "url": "https://instituteapex.in" }
    }
  },
  {
    path: 'pages/about-apex-jind',
    title: 'About Apex Institute Jind - Premier NEET & IIT-JEE Coaching',
    description: 'Learn more about Apex Institute Jind, Haryana’s premium educational center for IIT-JEE, NEET entrance coaching and secondary board tuitions.',
    canonical: 'https://instituteapex.in/pages/about-apex-jind',
    heading: 'About Institute APEX Jind',
    contentHtml: `
      <section style="max-width:1200px;margin:30px auto;padding:0 20px;font-family:-apple-system,BlinkMacSystemFont,sans-serif;color:#0f2b48;">
        <h1 style="font-size:2rem;font-weight:800;color:#0f2b48;margin-bottom:12px;">About Apex Institute Jind</h1>
        <p style="font-size:1.05rem;line-height:1.6;color:#334155;margin-bottom:20px;">
          Apex Institute is Jind's leading educational setup catering to students aiming to excel in NEET, IIT-JEE, NTSE, and Olympiads. Located in Urban Estate, Jind, we provide unmatched guidance for Class 9th to 12th across CBSE, HBSE, and ICSE boards.
        </p>
      </section>
    `,
    schema: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "About Apex Institute Jind",
      "url": "https://instituteapex.in/pages/about-apex-jind"
    }
  }
];

console.log('Prerendering static route HTML files for SEO indexing...');

routes.forEach(route => {
  const targetDir = path.join(distDir, ...route.path.split('/'));
  fs.mkdirSync(targetDir, { recursive: true });
  const targetFilePath = path.join(targetDir, 'index.html');

  let html = baseHtml;

  // 1. Replace Title (with data-rh attribute for react-helmet hydration)
  html = html.replace(/<title[\s\S]*?<\/title>/i, `<title data-rh="true">${route.title}</title>`);

  // 2. Replace Meta Description
  html = html.replace(/<meta\s+[^>]*name="description"[^>]*\/?>/i, `<meta data-rh="true" name="description" content="${route.description}" />`);

  // 3. Replace Canonical Link
  html = html.replace(/<link\s+[^>]*rel="canonical"[^>]*\/?>/i, `<link data-rh="true" rel="canonical" href="${route.canonical}" />`);

  // 4. Sanitize: ensure no accidental duplicate title or canonical tags exist
  let titleFound = false;
  html = html.replace(/<title[\s\S]*?<\/title>/gi, (match) => {
    if (!titleFound) {
      titleFound = true;
      return match;
    }
    return '';
  });

  let canonicalFound = false;
  html = html.replace(/<link\s+[^>]*rel="canonical"[^>]*\/?>/gi, (match) => {
    if (!canonicalFound) {
      canonicalFound = true;
      return match;
    }
    return '';
  });

  // 4. Inject dedicated JSON-LD Schema
  if (route.schema) {
    const schemaTag = `\n    <script type="application/ld+json">${JSON.stringify(route.schema, null, 2)}</script>`;
    html = html.replace('</head>', `${schemaTag}\n  </head>`);
  }

  // 5. Inject rich static content into initial shell so Googlebot sees real page content on first pass
  const staticContent = `
    <div class="prerendered-seo-content" style="padding-top:20px;">
      ${route.contentHtml}
    </div>
  `;
  
  // Replace the hero shell with the page's rich content
  html = html.replace(/<div class="shell-hero">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/i, `${staticContent}</div></div>`);

  fs.writeFileSync(targetFilePath, html, 'utf8');
  console.log(`✓ Prerendered: dist/${route.path}/index.html (${Math.round(fs.statSync(targetFilePath).size / 1024)} KB)`);
});

console.log('Prerendering complete! All static routes generated successfully.');
