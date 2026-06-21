/* ==========================================================================
   ResumeFlow.AI - Application Logic
   ========================================================================== */

// --- Global App State ---
const state = {
  isPro: false,
  clonedAudioUrl: null,
  videoGenerated: false,
  activeTab: 'builder-tab',
  resume: {
    fullName: "John Smith",
    title: "Junior Software Engineer",
    email: "john.smith@email.com",
    phone: "+1 (555) 019-2834",
    location: "San Francisco, CA",
    website: "linkedin.com/in/johnsmith",
    summary: "Passionate and detail-oriented Software Engineering graduate with internship experience building responsive web applications. Skilled in HTML, CSS, JavaScript, React, and Node.js. Excited to contribute to innovative projects and collaborate in agile team settings.",
    skills: ["JavaScript", "HTML5", "CSS3", "React", "Node.js", "Git", "SQL", "Agile Methodology", "REST APIs"],
    experience: [
      {
        company: "TechNova Solutions",
        title: "Software Engineering Intern",
        dates: "June 2024 - Dec 2024",
        location: "Remote",
        bullets: [
          "Developed and maintained 15+ reusable React UI components.",
          "Collaborated with backend teams to integrate RESTful API endpoints.",
          "Improved page load speeds by 25% through optimization of assets."
        ]
      }
    ],
    education: [
      {
        school: "State University of California",
        degree: "B.S. in Computer Science",
        dates: "Class of 2024",
        gpa: "GPA: 3.7 / Cum Laude"
      }
    ],
    projects: [
      {
        title: "E-Commerce API Service",
        subtitle: "Backend Developer",
        desc: "Built a Node.js/Express server processing 100+ requests/sec with MySQL database hosting catalog items."
      }
    ]
  }
};

// --- DOM References ---
const DOM = {
  // Navigation
  navItems: document.querySelectorAll('.nav-item'),
  panels: document.querySelectorAll('.tab-panel'),
  unlockBtn: document.getElementById('demo-unlock-btn'),
  userTierLabel: document.getElementById('user-tier-label'),
  premiumCtaCard: document.getElementById('premium-cta-card'),
  
  // Modal
  upgradeModal: document.getElementById('upgrade-modal'),
  upgradeTriggers: document.querySelectorAll('.btn-upgrade-trigger, #btn-upgrade-sidebar'),
  modalCloseBtn: document.getElementById('modal-close-btn'),
  btnActivatePremium: document.getElementById('btn-activate-premium'),
  
  // Forms & Preview
  resumePaper: document.getElementById('resume-paper'),
  templateSelect: document.getElementById('template-select'),
  btnPdfDownload: document.getElementById('btn-pdf-download'),
  btnDocDownload: document.getElementById('btn-doc-download'),
  btnAddExperience: document.getElementById('btn-add-experience'),
  btnAddEducation: document.getElementById('btn-add-education'),
  btnAddProject: document.getElementById('btn-add-project'),
  btnAiSummary: document.getElementById('btn-ai-summary'),
  
  // Video Avatar
  avatarCards: document.querySelectorAll('.avatar-option-card'),
  avatarViewports: document.querySelectorAll('.avatar-character-viewport'),
  avatarVoiceSelect: document.getElementById('avatar-voice-select'),
  btnAutoScript: document.getElementById('btn-auto-script'),
  avatarScriptText: document.getElementById('avatar-script-text'),
  btnPlayVoice: document.getElementById('btn-play-voice'),
  btnExportHdVideo: document.getElementById('btn-export-hd-video'),
  ccTextBox: document.getElementById('cc-text-box'),
  avatarStatusText: document.getElementById('avatar-status-text'),
  scriptWordCount: document.getElementById('script-word-count'),
  scriptDuration: document.getElementById('script-duration'),
  btnUploadAvatarCard: document.getElementById('btn-upload-avatar-card'),
  avatarFileInput: document.getElementById('avatar-file-input'),
  avatarImageUploaded: document.getElementById('avatar-image-uploaded'),
  btnCloneVoice: document.getElementById('btn-clone-voice'),
  voiceRecorderStatus: document.getElementById('voice-recorder-status'),
  voiceRecorderText: document.getElementById('voice-recorder-text'),
  voicePulseCircle: document.getElementById('voice-pulse-circle'),
  recordingBars: document.getElementById('recording-bars'),
  renderingOverlay: document.getElementById('rendering-overlay'),
  renderingProgress: document.getElementById('rendering-progress'),
  renderingPercent: document.getElementById('rendering-percent'),
  renderingStep: document.getElementById('rendering-step'),
  
  // Careerflow CRM
  btnSaveCRMJob: document.getElementById('btn-add-job-crm'),
  auditScoreCircle: document.getElementById('audit-score-circle'),
  auditScoreValue: document.getElementById('audit-score-value'),
  crmWishlist: document.getElementById('crm-wishlist'),
  crmApplied: document.getElementById('crm-applied'),
  crmInterview: document.getElementById('crm-interview'),
  crmOffer: document.getElementById('crm-offer'),
  
  // Jobright Scanner
  jobDescText: document.getElementById('job-desc-text'),
  btnScanMatch: document.getElementById('btn-scan-match'),
  scanLoading: document.getElementById('scan-loading'),
  reportViewContent: document.getElementById('report-view-content'),
  scanScoreNum: document.getElementById('scan-score-num'),
  scanScoreLabel: document.getElementById('scan-score-label'),
  scanScoreDesc: document.getElementById('scan-score-desc'),
  matchedKeywords: document.getElementById('matched-keywords'),
  missingKeywords: document.getElementById('missing-keywords'),
  scanRecommendation: document.getElementById('scan-recommendation'),
  
  // Social Sonic
  sonicPostStyle: document.getElementById('sonic-post-style'),
  sonicEmojiDensity: document.getElementById('sonic-emoji-density'),
  btnGenerateLinkedinPost: document.getElementById('btn-generate-linkedin-post'),
  sonicProfileHeadline: document.getElementById('sonic-profile-headline'),
  sonicPostOutput: document.getElementById('sonic-post-output'),
  btnCopyPost: document.getElementById('btn-copy-post')
};

// --- Speech Synthesis Instance ---
let currentUtterance = null;
let speechInterval = null;
let activeAudio = null;

// --- Initialize App ---
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initFormAccordions();
  initFormBindings();
  initTemplateEngine();
  initAvatarSpeech();
  initPremiumTriggers();
  initCRMCounting();
  initJobrightScanner();
  initSocialSonic();
  
  // Render default resume data on startup
  renderResume();
  updateScriptStats();
});

// --- 1. Sidebar Navigation Logic ---
function initNavigation() {
  DOM.navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetTab = item.getAttribute('data-tab');
      
      // Toggle nav styles
      DOM.navItems.forEach(nav => nav.classList.remove('active'));
      item.classList.add('active');
      
      // Toggle target panel
      DOM.panels.forEach(panel => {
        panel.classList.remove('active');
        if (panel.id === targetTab) {
          panel.classList.add('active');
        }
      });
      
      state.activeTab = targetTab;
    });
  });
}

// --- 2. Form Bindings & Custom Form Actions ---
function initFormAccordions() {
  const headers = document.querySelectorAll('.accordion-header');
  headers.forEach(header => {
    header.addEventListener('click', () => {
      const parent = header.parentElement;
      const content = header.nextElementSibling;
      const icon = header.querySelector('.fa-chevron-down, .fa-chevron-up');
      
      const isExpanded = parent.classList.toggle('expanded');
      
      if (isExpanded) {
        icon.className = 'fa-solid fa-chevron-up';
      } else {
        icon.className = 'fa-solid fa-chevron-down';
      }
    });
  });
}

function initFormBindings() {
  // Simple Input Sync
  const inputs = [
    { id: 'resume-fullname', field: 'fullName' },
    { id: 'resume-title', field: 'title' },
    { id: 'resume-email', field: 'email' },
    { id: 'resume-phone', field: 'phone' },
    { id: 'resume-location', field: 'location' },
    { id: 'resume-website', field: 'website' },
    { id: 'resume-summary', field: 'summary' }
  ];

  inputs.forEach(item => {
    const el = document.getElementById(item.id);
    if (el) {
      el.addEventListener('input', (e) => {
        state.resume[item.field] = e.target.value;
        renderResume();
        
        // Dynamic LinkedIn audit update
        updateLinkedInAudit();
      });
    }
  });

  // Skills input sync
  const skillsEl = document.getElementById('resume-skills');
  if (skillsEl) {
    skillsEl.addEventListener('input', (e) => {
      state.resume.skills = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
      renderResume();
      updateLinkedInAudit();
    });
  }

  // Dynamic Adders
  DOM.btnAddExperience.addEventListener('click', addExperienceFormItem);
  DOM.btnAddEducation.addEventListener('click', addEducationFormItem);
  DOM.btnAddProject.addEventListener('click', addProjectFormItem);

  // AI Summary Generator (Pro Feature)
  if (DOM.btnAiSummary) {
    DOM.btnAiSummary.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Gate behind Pro subscription
      if (!state.isPro) {
        DOM.upgradeModal.classList.add('active');
        return;
      }
      
      // Generate summary based on current resume title and skills
      const title = state.resume.title || "Software Engineer";
      const skills = state.resume.skills.length > 0 ? state.resume.skills.slice(0, 5).join(', ') : "software development";
      
      const templates = [
        `Highly motivated and results-driven ${title} with key expertise in ${skills}. Dedicated to writing clean, maintainable code and solving complex technical challenges in collaborative team environments.`,
        `Dynamic and detail-oriented ${title} skilled in ${skills}. Experienced in designing responsive user interfaces and building robust logic flows. Eager to contribute to innovative projects in an agile engineering setting.`,
        `Resourceful ${title} passionate about software engineering and web technologies, specializing in ${skills}. Proven ability to build functional applications and collaborate with cross-functional development teams.`
      ];
      
      const randomIdx = Math.floor(Math.random() * templates.length);
      const generatedText = templates[randomIdx];
      
      // Update DOM textarea
      const textarea = document.getElementById('resume-summary');
      if (textarea) {
        textarea.value = generatedText;
      }
      
      // Update state model & redraw
      state.resume.summary = generatedText;
      renderResume();
      updateLinkedInAudit();
    });
  }
}

function addExperienceFormItem() {
  const container = document.getElementById('experience-list');
  const index = container.children.length;
  
  const newItemHtml = `
    <div class="dynamic-item">
      <div class="form-row">
        <div class="form-group">
          <label>Company Name</label>
          <input type="text" class="exp-company" placeholder="e.g. Microsoft">
        </div>
        <div class="form-group">
          <label>Job Title</label>
          <input type="text" class="exp-title" placeholder="e.g. Software Engineer">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Dates (e.g. 2024 - Present)</label>
          <input type="text" class="exp-dates" placeholder="e.g. June 2025 - Present">
        </div>
        <div class="form-group">
          <label>Location</label>
          <input type="text" class="exp-loc" placeholder="e.g. Redmond, WA">
        </div>
      </div>
      <div class="form-group">
        <label>Key Accomplishments (One per line)</label>
        <textarea class="exp-desc" rows="3" placeholder="Developed microservices using Node.js.&#10;Collaborated with product teams to design features."></textarea>
      </div>
    </div>
  `;
  container.insertAdjacentHTML('beforeend', newItemHtml);
  
  // Re-bind change listeners
  bindDynamicInputs();
}

function addEducationFormItem() {
  const container = document.getElementById('education-list');
  const newItemHtml = `
    <div class="dynamic-item">
      <div class="form-row">
        <div class="form-group">
          <label>School / University</label>
          <input type="text" class="edu-school" placeholder="e.g. Stanford University">
        </div>
        <div class="form-group">
          <label>Degree & Major</label>
          <input type="text" class="edu-degree" placeholder="e.g. M.S. in Computer Science">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Graduation Year</label>
          <input type="text" class="edu-dates" placeholder="e.g. Class of 2025">
        </div>
        <div class="form-group">
          <label>GPA / Honors (Optional)</label>
          <input type="text" class="edu-gpa" placeholder="e.g. GPA: 3.9">
        </div>
      </div>
    </div>
  `;
  container.insertAdjacentHTML('beforeend', newItemHtml);
  bindDynamicInputs();
}

function addProjectFormItem() {
  const container = document.getElementById('project-list');
  const newItemHtml = `
    <div class="dynamic-item">
      <div class="form-row">
        <div class="form-group">
          <label>Project Title</label>
          <input type="text" class="proj-title" placeholder="e.g. AI Portfolio Generator">
        </div>
        <div class="form-group">
          <label>Role / Subtitle</label>
          <input type="text" class="proj-subtitle" placeholder="e.g. Lead Engineer">
        </div>
      </div>
      <div class="form-group">
        <label>Project Description</label>
        <textarea class="proj-desc" rows="2" placeholder="Describe what you built and the technologies used."></textarea>
      </div>
    </div>
  `;
  container.insertAdjacentHTML('beforeend', newItemHtml);
  bindDynamicInputs();
}

// Scan all dynamically added items and pull values to the state model
function bindDynamicInputs() {
  const inputs = document.querySelectorAll('.dynamic-item input, .dynamic-item textarea');
  inputs.forEach(el => {
    el.removeEventListener('input', harvestDynamicData);
    el.addEventListener('input', harvestDynamicData);
  });
}

function harvestDynamicData() {
  // Harvest experience
  const expItems = [];
  const expBlocks = document.querySelectorAll('#experience-list .dynamic-item');
  expBlocks.forEach(block => {
    expItems.push({
      company: block.querySelector('.exp-company').value || "",
      title: block.querySelector('.exp-title').value || "",
      dates: block.querySelector('.exp-dates').value || "",
      location: block.querySelector('.exp-loc').value || "",
      bullets: (block.querySelector('.exp-desc').value || "").split('\n').map(b => b.trim()).filter(Boolean)
    });
  });
  state.resume.experience = expItems;

  // Harvest education
  const eduItems = [];
  const eduBlocks = document.querySelectorAll('#education-list .dynamic-item');
  eduBlocks.forEach(block => {
    eduItems.push({
      school: block.querySelector('.edu-school').value || "",
      degree: block.querySelector('.edu-degree').value || "",
      dates: block.querySelector('.edu-dates').value || "",
      gpa: block.querySelector('.edu-gpa').value || ""
    });
  });
  state.resume.education = eduItems;

  // Harvest projects
  const projItems = [];
  const projBlocks = document.querySelectorAll('#project-list .dynamic-item');
  projBlocks.forEach(block => {
    projItems.push({
      title: block.querySelector('.proj-title').value || "",
      subtitle: block.querySelector('.proj-subtitle').value || "",
      desc: block.querySelector('.proj-desc').value || ""
    });
  });
  state.resume.projects = projItems;

  // Re-render preview
  renderResume();
}

// First binding setup
bindDynamicInputs();

// --- 3. Live Resume Template Rendering Engine ---
function initTemplateEngine() {
  DOM.templateSelect.addEventListener('change', (e) => {
    const template = e.target.value;
    
    // Swap template classes
    DOM.resumePaper.className = `resume-sheet template-${template}`;
  });

  DOM.btnPdfDownload.addEventListener('click', () => {
    const element = document.getElementById('resume-paper');
    
    // Generate optimized file name
    const fileName = `${state.resume.fullName.replace(/\s+/g, '_')}_Resume.pdf`;

    // Configure high-fidelity rendering parameters
    const opt = {
      margin:       0.3,
      filename:     fileName,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, logging: false },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    
    // Temporarily strip dashboard container bounds so the canvas renders full-sheet size
    const originalWidth = element.style.width;
    const originalMaxWidth = element.style.maxWidth;
    const originalShadow = element.style.boxShadow;
    const originalBorderRadius = element.style.borderRadius;

    element.style.width = '100%';
    element.style.maxWidth = '100%';
    element.style.boxShadow = 'none';
    element.style.borderRadius = '0px';

    // Execute PDF conversion and download
    html2pdf().set(opt).from(element).save().then(() => {
      // Instantly restore preview dashboard styles
      element.style.width = originalWidth;
      element.style.maxWidth = originalMaxWidth;
      element.style.boxShadow = originalShadow;
      element.style.borderRadius = originalBorderRadius;
    });
  });

  // DOC Download Handler (Office HTML conversion)
  DOM.btnDocDownload.addEventListener('click', () => {
    const element = document.getElementById('resume-paper');
    if (!element) return;

    const r = state.resume;
    const fileName = `${r.fullName.replace(/\s+/g, '_')}_Resume.doc`;

    // Wrap the HTML content in clean document headers with styles to open in Word
    const htmlContent = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8">
        <title>${r.fullName} - Resume</title>
        <!--[if gte mso 9]>
        <xml>
          <w:WordDocument>
            <w:View>Print</w:View>
            <w:Zoom>100</w:Zoom>
            <w:DoNotOptimizeForBrowser/>
          </w:WordDocument>
        </xml>
        <![endif]-->
        <style>
          body {
            font-family: Arial, sans-serif;
            font-size: 11.5pt;
            line-height: 1.4;
            color: #1e293b;
            padding: 1in;
          }
          h2 {
            font-size: 20pt;
            font-weight: bold;
            color: #0f172a;
            margin: 0 0 4px 0;
            text-align: center;
          }
          .resume-title {
            font-size: 12pt;
            font-weight: bold;
            color: #4b5563;
            margin: 0 0 12px 0;
            text-align: center;
          }
          .resume-contact-bar {
            text-align: center;
            font-size: 9.5pt;
            color: #4b5563;
            margin: 0 0 16px 0;
            border-top: 1px solid #cbd5e1;
            border-bottom: 1px solid #cbd5e1;
            padding: 6px 0;
          }
          .resume-contact-bar span {
            margin: 0 10px;
            display: inline-block;
          }
          h4.section-title {
            font-size: 11pt;
            text-transform: uppercase;
            font-weight: bold;
            color: #0f172a;
            border-bottom: 1.5pt solid #94a3b8;
            margin: 20px 0 10px 0;
            padding-bottom: 3px;
          }
          .resume-job-item, .resume-edu-item, .resume-proj-item {
            margin-bottom: 12px;
          }
          .item-header-flex {
            font-weight: bold;
            margin-bottom: 2px;
          }
          .item-sub-flex {
            color: #4b5563;
            font-style: italic;
            margin-bottom: 4px;
          }
          .resume-bullet-list {
            margin-top: 4px;
            margin-bottom: 8px;
            padding-left: 20px;
          }
          .resume-bullet-list li {
            margin-bottom: 3px;
          }
        </style>
      </head>
      <body>
        ${element.innerHTML}
      </body>
      </html>
    `;

    // Create a Blob with Microsoft Word mime-type and trigger file save download
    const blob = new Blob(['\ufeff' + htmlContent], { type: 'application/msword;charset=utf-8' });
    
    // Download link simulation
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = fileName;
    
    document.body.appendChild(link);
    link.click();
    
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  });
}

function renderResume() {
  const r = state.resume;
  const selectedTemplate = DOM.templateSelect ? DOM.templateSelect.value : 'classic';
  
  // 1. Build contact list string
  let contactHtml = '';
  if (r.email) contactHtml += `<span><i class="fa-regular fa-envelope"></i> ${r.email}</span>`;
  if (r.phone) contactHtml += `<span><i class="fa-solid fa-phone"></i> ${r.phone}</span>`;
  if (r.location) contactHtml += `<span><i class="fa-solid fa-location-dot"></i> ${r.location}</span>`;
  if (r.website) contactHtml += `<span><i class="fa-brands fa-linkedin"></i> ${r.website}</span>`;

  // 2. Build Skills list
  let skillsHtml = '';
  if (r.skills.length > 0) {
    skillsHtml = `
      <h4 class="section-title">Core Skills</h4>
      <p style="margin-bottom: 12px;">${r.skills.join(' • ')}</p>
    `;
  }

  // 3. Build Work Experience HTML
  let expHtml = '';
  if (r.experience.length > 0) {
    expHtml += `<h4 class="section-title">Work Experience</h4>`;
    r.experience.forEach(job => {
      let bulletsList = '';
      if (job.bullets.length > 0) {
        bulletsList = `<ul class="resume-bullet-list">` + 
          job.bullets.map(b => `<li>${b}</li>`).join('') + 
          `</ul>`;
      }
      expHtml += `
        <div class="resume-job-item">
          <div class="item-header-flex">
            <span>${job.title}</span>
            <span>${job.dates}</span>
          </div>
          <div class="item-sub-flex">
            <span>${job.company}</span>
            <span>${job.location}</span>
          </div>
          ${bulletsList}
        </div>
      `;
    });
  }

  // 4. Build Education HTML
  let eduHtml = '';
  if (r.education.length > 0) {
    eduHtml += `<h4 class="section-title">Education</h4>`;
    r.education.forEach(edu => {
      eduHtml += `
        <div class="resume-edu-item">
          <div class="item-header-flex">
            <span>${edu.degree}</span>
            <span>${edu.dates}</span>
          </div>
          <div class="item-sub-flex">
            <span>${edu.school}</span>
            <span>${edu.gpa}</span>
          </div>
        </div>
      `;
    });
  }

  // 5. Build Projects HTML
  let projHtml = '';
  if (r.projects.length > 0) {
    projHtml += `<h4 class="section-title">Academic & Technical Projects</h4>`;
    r.projects.forEach(proj => {
      projHtml += `
        <div class="resume-proj-item">
          <div class="item-header-flex">
            <span>${proj.title}</span>
            <span>${proj.subtitle}</span>
          </div>
          <p style="margin-top: 4px; color: #475569;">${proj.desc}</p>
        </div>
      `;
    });
  }

  // Render layouts conditionally
  if (selectedTemplate === 'twocolumn' || selectedTemplate === 'minibar') {
    DOM.resumePaper.innerHTML = `
      <div class="two-col-layout">
        <!-- Sidebar (Left Col) -->
        <div class="sidebar-col">
          <div class="sidebar-section">
            <h4 class="sidebar-section-title">Contact</h4>
            <div class="sidebar-contact-list">
              ${r.email ? `<div><i class="fa-regular fa-envelope" style="width:14px;"></i> ${r.email}</div>` : ''}
              ${r.phone ? `<div><i class="fa-solid fa-phone" style="width:14px;"></i> ${r.phone}</div>` : ''}
              ${r.location ? `<div><i class="fa-solid fa-location-dot" style="width:14px;"></i> ${r.location}</div>` : ''}
              ${r.website ? `<div><i class="fa-brands fa-linkedin" style="width:14px;"></i> ${r.website}</div>` : ''}
            </div>
          </div>
          
          ${r.skills.length > 0 ? `
            <div class="sidebar-section">
              <h4 class="sidebar-section-title">Skills</h4>
              <div class="sidebar-skills-grid">
                ${r.skills.map(s => `<span>${s}</span>`).join('')}
              </div>
            </div>
          ` : ''}
          
          ${r.education.length > 0 ? `
            <div class="sidebar-section">
              <h4 class="sidebar-section-title">Education</h4>
              ${r.education.map(edu => `
                <div class="sidebar-edu-card">
                  <div class="edu-degree-bold">${edu.degree}</div>
                  <div class="edu-school-text">${edu.school}</div>
                  <div class="edu-date-text">${edu.dates}</div>
                </div>
              `).join('')}
            </div>
          ` : ''}
        </div>
        
        <!-- Main Column (Right Col) -->
        <div class="main-col">
          <h2 class="resume-name">${r.fullName || "Your Name"}</h2>
          <p class="resume-title">${r.title || "Professional Subtitle"}</p>
          
          ${r.summary ? `
            <div class="profile-block">
              <h4 class="section-title">Profile</h4>
              <p style="color: #475569; font-size: 0.8rem; line-height: 1.45;">${r.summary}</p>
            </div>
          ` : ''}
          
          ${expHtml}
          ${projHtml}
        </div>
      </div>
    `;
  } else if (selectedTemplate === 'engineer') {
    DOM.resumePaper.innerHTML = `
      <div class="two-col-layout right-sidebar">
        <!-- Main Column (Left Col) -->
        <div class="main-col">
          <h2 class="resume-name">${r.fullName || "Your Name"}</h2>
          <p class="resume-title">${r.title || "Professional Subtitle"}</p>
          
          ${r.summary ? `
            <div class="profile-block">
              <h4 class="section-title">Profile</h4>
              <p style="color: #475569; font-size: 0.8rem; line-height: 1.45;">${r.summary}</p>
            </div>
          ` : ''}
          
          ${expHtml}
          ${projHtml}
        </div>

        <!-- Sidebar (Right Col) -->
        <div class="sidebar-col">
          <div class="sidebar-section">
            <h4 class="sidebar-section-title">Contact</h4>
            <div class="sidebar-contact-list">
              ${r.email ? `<div><i class="fa-regular fa-envelope" style="width:14px;"></i> ${r.email}</div>` : ''}
              ${r.phone ? `<div><i class="fa-solid fa-phone" style="width:14px;"></i> ${r.phone}</div>` : ''}
              ${r.location ? `<div><i class="fa-solid fa-location-dot" style="width:14px;"></i> ${r.location}</div>` : ''}
              ${r.website ? `<div><i class="fa-brands fa-linkedin" style="width:14px;"></i> ${r.website}</div>` : ''}
            </div>
          </div>
          
          ${r.skills.length > 0 ? `
            <div class="sidebar-section">
              <h4 class="sidebar-section-title">Skills</h4>
              <div class="sidebar-skills-grid">
                ${r.skills.map(s => `<span>${s}</span>`).join('')}
              </div>
            </div>
          ` : ''}
          
          ${r.education.length > 0 ? `
            <div class="sidebar-section">
              <h4 class="sidebar-section-title">Education</h4>
              ${r.education.map(edu => `
                <div class="sidebar-edu-card">
                  <div class="edu-degree-bold">${edu.degree}</div>
                  <div class="edu-school-text">${edu.school}</div>
                  <div class="edu-date-text">${edu.dates}</div>
                </div>
              `).join('')}
            </div>
          ` : ''}
        </div>
      </div>
    `;
  } else {
    // Normal flat layouts (Classic, Tech, Executive, Minimalist, Elegant, BoldTech, Academic, Corporate, Slate, Startup, Functional, Legal, Creative, Timeline)
    DOM.resumePaper.innerHTML = `
      <h2 class="resume-name">${r.fullName || "Your Name"}</h2>
      <p class="resume-title">${r.title || "Professional Subtitle"}</p>
      
      <div class="resume-contact-bar">
        ${contactHtml}
      </div>

      ${r.summary ? `
        <h4 class="section-title">Professional Summary</h4>
        <p style="margin-bottom: 12px;">${r.summary}</p>
      ` : ''}

      ${expHtml}
      ${eduHtml}
      ${skillsHtml}
      ${projHtml}
    `;
  }
}

// --- 4. AI Video Avatar Pitch & WebSpeech TTS Engine ---
function initAvatarSpeech() {
  // 1. Photo Upload Event Listener (Gated behind Pro)
  if (DOM.btnUploadAvatarCard) {
    DOM.btnUploadAvatarCard.addEventListener('click', (e) => {
      // Gate behind Pro
      if (!state.isPro) {
        e.stopPropagation();
        DOM.upgradeModal.classList.add('active');
        return;
      }
      
      // If upgraded, trigger file explorer input
      if (DOM.avatarFileInput) {
        DOM.avatarFileInput.click();
      }
    });
  }

  if (DOM.avatarFileInput) {
    DOM.avatarFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const url = URL.createObjectURL(file);
      if (DOM.avatarImageUploaded) {
        DOM.avatarImageUploaded.src = url;
      }

      // Activate the uploaded avatar option card and viewport
      DOM.avatarCards.forEach(c => c.classList.remove('active'));
      const uploadCard = document.getElementById('btn-upload-avatar-card');
      if (uploadCard) uploadCard.classList.add('active');

      DOM.avatarViewports.forEach(vp => {
        vp.classList.remove('active');
        if (vp.id === 'viewport-uploaded') {
          vp.classList.add('active');
        }
      });
    });
  }

  // 2. Voice Cloning Recorder Listener (Gated behind Pro)
  if (DOM.btnCloneVoice) {
    DOM.btnCloneVoice.addEventListener('click', async (e) => {
      e.preventDefault();

      // Gate behind Pro
      if (!state.isPro) {
        DOM.upgradeModal.classList.add('active');
        return;
      }

      // If Pro is active, trigger voice recorder
      if (DOM.voiceRecorderStatus) {
        DOM.voiceRecorderStatus.style.display = 'flex';
        DOM.btnCloneVoice.disabled = true;

        let secondsLeft = 5;
        if (DOM.voiceRecorderText) {
          DOM.voiceRecorderText.textContent = `🎤 Recording sample... Speak into your mic: ${secondsLeft}s left`;
        }

        let mediaStream = null;
        let mediaRecorder = null;
        let audioContext = null;
        let analyser = null;
        let isRecording = true;
        let audioChunks = [];
        let animationFrameId = null;
        let fallbackInterval = null;

        // Reset elements style
        if (DOM.voicePulseCircle) {
          DOM.voicePulseCircle.style.transform = 'scale(1)';
        }

        try {
          // Request mic access
          mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
          
          // Setup Audio Analyzer
          audioContext = new (window.AudioContext || window.webkitAudioContext)();
          const source = audioContext.createMediaStreamSource(mediaStream);
          analyser = audioContext.createAnalyser();
          analyser.fftSize = 256;
          source.connect(analyser);
          
          const dataArray = new Uint8Array(analyser.frequencyBinCount);
          
          // Volume loop
          const updateVolume = () => {
            if (!isRecording) return;
            analyser.getByteFrequencyData(dataArray);
            
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) {
              sum += dataArray[i];
            }
            const average = sum / dataArray.length;
            const volume = average / 128; // Normalized value between 0 and 2 roughly
            
            // Pulse the mic circle
            if (DOM.voicePulseCircle) {
              DOM.voicePulseCircle.style.transform = `scale(${1 + Math.min(volume * 1.5, 2)})`;
            }
            
            // Bouncing volume bars
            if (DOM.recordingBars) {
              const bars = DOM.recordingBars.querySelectorAll('.rec-bar');
              bars.forEach((bar) => {
                const randomFactor = 0.6 + Math.random() * 0.4;
                const height = Math.max(4, Math.round(volume * 18 * randomFactor));
                bar.style.height = `${height}px`;
              });
            }
            
            animationFrameId = requestAnimationFrame(updateVolume);
          };
          
          updateVolume();

          // Start actual media recorder
          mediaRecorder = new MediaRecorder(mediaStream);
          mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
              audioChunks.push(event.data);
            }
          };
          mediaRecorder.start();

        } catch (err) {
          console.warn("Microphone access denied or unavailable, falling back to simulation:", err);
          if (DOM.voiceRecorderText) {
            DOM.voiceRecorderText.textContent = `🎤 (Simulated) Recording sample... Speak now: ${secondsLeft}s left`;
          }
          
          // Fallback simulation
          fallbackInterval = setInterval(() => {
            if (!isRecording) return;
            const simVolume = Math.random() * 0.4;
            
            if (DOM.voicePulseCircle) {
              DOM.voicePulseCircle.style.transform = `scale(${1 + simVolume * 1.8})`;
            }
            
            if (DOM.recordingBars) {
              const bars = DOM.recordingBars.querySelectorAll('.rec-bar');
              bars.forEach((bar) => {
                const height = Math.max(4, Math.round(simVolume * 18 * (0.6 + Math.random() * 0.4)));
                bar.style.height = `${height}px`;
              });
            }
          }, 100);
        }

        // 5s Countdown timer
        const countdownInterval = setInterval(() => {
          secondsLeft--;
          if (secondsLeft > 0) {
            if (DOM.voiceRecorderText) {
              const prefix = mediaStream ? "🎤 Recording sample... Speak into your mic:" : "🎤 (Simulated) Recording sample... Speak now:";
              DOM.voiceRecorderText.textContent = `${prefix} ${secondsLeft}s left`;
            }
          } else {
            clearInterval(countdownInterval);
            isRecording = false;
            
            // Clean up recording context
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
            if (fallbackInterval) clearInterval(fallbackInterval);
            
            if (DOM.voicePulseCircle) DOM.voicePulseCircle.style.transform = 'scale(1)';
            if (DOM.recordingBars) {
              DOM.recordingBars.querySelectorAll('.rec-bar').forEach(bar => bar.style.height = '4px');
            }

            // Stop MediaRecorder and store audio
            if (mediaRecorder && mediaRecorder.state !== 'inactive') {
              mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                state.clonedAudioUrl = URL.createObjectURL(audioBlob);
              };
              mediaRecorder.stop();
            }

            // Stop mic tracks
            if (mediaStream) {
              mediaStream.getTracks().forEach(track => track.stop());
            }

            if (audioContext) {
              audioContext.close();
            }
            
            // Phase 2: Analyzing
            if (DOM.voiceRecorderText) {
              DOM.voiceRecorderText.textContent = `⚙️ Analyzing speech characteristics and cloning vocal frequency...`;
            }

            setTimeout(() => {
              // Phase 3: Done
              if (DOM.voiceRecorderStatus) {
                DOM.voiceRecorderStatus.style.display = 'none';
              }
              DOM.btnCloneVoice.disabled = false;

              // Inject cloned voice option into voice selector
              if (DOM.avatarVoiceSelect) {
                let existingOpt = DOM.avatarVoiceSelect.querySelector('option[value="cloned-user-voice"]');
                if (!existingOpt) {
                  const opt = document.createElement('option');
                  opt.value = "cloned-user-voice";
                  opt.textContent = `👤 Cloned Voice (My Custom Voice)`;
                  DOM.avatarVoiceSelect.insertBefore(opt, DOM.avatarVoiceSelect.firstChild);
                }
                DOM.avatarVoiceSelect.value = "cloned-user-voice";
              }

              alert("🎉 Voice cloning completed! 'My Custom Voice' has been successfully created and selected as your active presenter voice.");
            }, 2000);
          }
        }, 1000);
      }
    });
  }

  // 3. Selector for avatars
  DOM.avatarCards.forEach(card => {
    card.addEventListener('click', () => {
      DOM.avatarCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      // Switch matching viewport Base image
      const targetAvatar = card.getAttribute('data-avatar');
      DOM.avatarViewports.forEach(vp => {
        vp.classList.remove('active');
        if (vp.id === `viewport-${targetAvatar}`) {
          vp.classList.add('active');
        }
      });
    });
  });

  // 2. Fetch and populate TTS voices
  const populateVoices = () => {
    if (typeof speechSynthesis === 'undefined') return;
    const voices = speechSynthesis.getVoices();
    DOM.avatarVoiceSelect.innerHTML = '';
    
    // Filter down to standard English voices for optimal quality in pitch
    const englishVoices = voices.filter(v => v.lang.startsWith('en'));
    
    if (englishVoices.length === 0) {
      DOM.avatarVoiceSelect.innerHTML = `<option value="en-US">Standard English (Default)</option>`;
      return;
    }
    
    englishVoices.forEach(v => {
      const opt = document.createElement('option');
      opt.value = v.name;
      opt.textContent = `${v.name} (${v.lang})`;
      DOM.avatarVoiceSelect.appendChild(opt);
    });
  };

  populateVoices();
  if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = populateVoices;
  }

  // 3. Auto-Script Generator
  DOM.btnAutoScript.addEventListener('click', () => {
    const r = state.resume;
    const skillsList = r.skills.slice(0, 4).join(', ');
    const recentJob = r.experience[0];
    
    let text = `Hello recruiters! My name is ${r.fullName}, and I am a ${r.title}. `;
    if (r.summary) {
      text += `My core focus is ${r.summary.substring(0, 120).trim()}... `;
    }
    if (skillsList) {
      text += `I have developed hands-on technical skills in ${skillsList}. `;
    }
    if (recentJob) {
      text += `Recently, as a ${recentJob.title} at ${recentJob.company}, I successfully ${recentJob.bullets[0] || 'worked on building core components'}. `;
    }
    text += `I am seeking new opportunities where I can apply my skills and grow with a professional engineering team. Thank you for listening to my elevator pitch!`;

    DOM.avatarScriptText.value = text;
    updateScriptStats();
  });

  DOM.avatarScriptText.addEventListener('input', updateScriptStats);

  // 4. TTS speech play with visual mouth-indicator sync
  DOM.btnPlayVoice.addEventListener('click', () => {
    // If playing custom cloned audio, stop it
    if (activeAudio) {
      activeAudio.pause();
      activeAudio = null;
      stopSpeechAnimation();
      return;
    }

    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
      stopSpeechAnimation();
      return;
    }

    const script = DOM.avatarScriptText.value;
    if (!script) return;

    // Check if voice is Cloned Voice
    const selectedVoiceName = DOM.avatarVoiceSelect.value;
    
    if (selectedVoiceName === 'cloned-user-voice') {
      if (state.clonedAudioUrl) {
        // Play the recorded sample first
        activeAudio = new Audio(state.clonedAudioUrl);
        
        activeAudio.onplay = () => {
          document.body.classList.add('speaking-active');
          DOM.btnPlayVoice.innerHTML = `<i class="fa-solid fa-circle-stop"></i> Stop Presentation`;
          DOM.avatarStatusText.textContent = "Playing Cloned Voice Sample...";
          DOM.ccTextBox.textContent = `"[Playing recorded voice print sample...]"`;
        };
        
        activeAudio.onended = () => {
          activeAudio = null;
          // Speak the rest of the script with pitch-shifted TTS
          speakTTS(script, true);
        };
        
        activeAudio.onerror = () => {
          activeAudio = null;
          speakTTS(script, true);
        };
        
        activeAudio.play();
      } else {
        speakTTS(script, true);
      }
    } else {
      speakTTS(script, false);
    }
  });

  // Helper function to read text via browser TTS
  function speakTTS(script, isCloned) {
    currentUtterance = new SpeechSynthesisUtterance(script);
    
    if (isCloned) {
      currentUtterance.pitch = 0.85; // Custom pitch adjustment to sound "cloned/synthesized"
      currentUtterance.rate = 0.95;
      
      const voices = speechSynthesis.getVoices();
      const preferred = voices.find(v => v.lang.startsWith('en') && v.name.includes('Natural')) || voices[0];
      if (preferred) currentUtterance.voice = preferred;
    } else {
      const selectedVoiceName = DOM.avatarVoiceSelect.value;
      const voices = speechSynthesis.getVoices();
      const voice = voices.find(v => v.name === selectedVoiceName);
      if (voice) currentUtterance.voice = voice;
    }

    currentUtterance.onstart = () => {
      document.body.classList.add('speaking-active');
      DOM.btnPlayVoice.innerHTML = `<i class="fa-solid fa-circle-stop"></i> Stop Presentation`;
      DOM.avatarStatusText.textContent = isCloned ? "Presenting with Cloned Voice..." : "Presenting Audio Pitch...";
    };

    currentUtterance.onend = () => {
      stopSpeechAnimation();
    };

    currentUtterance.onerror = () => {
      stopSpeechAnimation();
    };

    currentUtterance.onboundary = (event) => {
      if (event.name === 'word') {
        const textOffset = event.charIndex;
        const currentSlice = script.substring(textOffset, textOffset + 35);
        DOM.ccTextBox.textContent = `"${currentSlice}..."`;
      }
    };

    speechSynthesis.speak(currentUtterance);
  }

  // 5. HD Video Generation click listener (Gated behind Pro)
  if (DOM.btnExportHdVideo) {
    DOM.btnExportHdVideo.addEventListener('click', (e) => {
      e.preventDefault();

      // Gate behind Pro
      if (!state.isPro) {
        DOM.upgradeModal.classList.add('active');
        return;
      }

      // If already generated, download again
      if (state.videoGenerated) {
        triggerVideoDownload();
        return;
      }

      const script = DOM.avatarScriptText.value;
      if (!script) {
        alert("Please write or generate an elevator pitch script first.");
        return;
      }

      // Start rendering simulation
      if (DOM.renderingOverlay) {
        DOM.renderingOverlay.style.display = 'flex';
      }

      let progress = 0;
      const steps = [
        "Initializing rendering pipeline...",
        "Analyzing facial structure & mouth landmarks...",
        "Synthesizing vocal characteristics with ElevenLabs models...",
        "Stitching lip-sync frames and facial expressions...",
        "Rendering high-fidelity 1080p video stream...",
        "Finalizing video container & adding subtitles...",
        "Success! HD Video Resume generated!"
      ];

      const renderingInterval = setInterval(() => {
        progress += 2;
        if (progress > 100) progress = 100;

        if (DOM.renderingProgress) {
          DOM.renderingProgress.style.width = `${progress}%`;
        }
        if (DOM.renderingPercent) {
          DOM.renderingPercent.textContent = `${progress}%`;
        }

        // Change step text based on progress
        let stepIdx = Math.min(Math.floor((progress / 100) * steps.length), steps.length - 1);
        if (DOM.renderingStep) {
          DOM.renderingStep.textContent = steps[stepIdx];
        }

        if (progress === 100) {
          clearInterval(renderingInterval);
          
          setTimeout(() => {
            // Hide overlay
            if (DOM.renderingOverlay) {
              DOM.renderingOverlay.style.display = 'none';
            }

            // Change button state to Download
            DOM.btnExportHdVideo.innerHTML = `<i class="fa-solid fa-download"></i> Download HD Video (MP4)`;
            DOM.btnExportHdVideo.classList.remove('btn-premium');
            DOM.btnExportHdVideo.classList.add('btn-success');
            DOM.btnExportHdVideo.style.backgroundColor = 'var(--color-primary)';
            DOM.btnExportHdVideo.style.borderColor = 'var(--color-primary)';
            DOM.btnExportHdVideo.style.color = '#fff';
            
            state.videoGenerated = true;

            if (DOM.avatarStatusText) {
              DOM.avatarStatusText.textContent = "HD Video Resume Generated";
            }

            // Trigger mock download
            triggerVideoDownload();
            
            alert("🎉 AI HD Video Resume generated successfully! You can now download your digital avatar video pitch as an MP4 file.");
          }, 800);
        }
      }, 90); // ~4.5 seconds total
    });
  }

  function triggerVideoDownload() {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:video/mp4;base64,AAAAHGZ0eXBtcDQyAAAAAG1wZDQybXA0MQAAAAhibW9vdgAAAGxtdmhkAAAAAM21h...'); // small mock data
    element.setAttribute('download', `${state.resume.fullName.replace(/\s+/g, '_')}_Video_Resume.mp4`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }
}

function stopSpeechAnimation() {
  if (activeAudio) {
    activeAudio.pause();
    activeAudio = null;
  }
  if (speechSynthesis.speaking) {
    speechSynthesis.cancel();
  }
  document.body.classList.remove('speaking-active');
  DOM.btnPlayVoice.innerHTML = `<i class="fa-solid fa-volume-high"></i> Play Speech Preview`;
  DOM.avatarStatusText.textContent = "Ready to Record";
  DOM.ccTextBox.textContent = `Select "Play Speech Preview" to listen to the avatar pitch.`;
}

function updateScriptStats() {
  const text = DOM.avatarScriptText.value;
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  DOM.scriptWordCount.textContent = `${wordCount} words`;
  
  // Average speaking rate: 130 words per minute
  const durationSec = Math.round((wordCount / 130) * 60);
  DOM.scriptDuration.textContent = `${durationSec} seconds`;
}

// --- 5. 01 Careerflow Kanban Drag & Drop Simulator ---
function moveCRMCard(btn, targetStage) {
  const card = btn.closest('.kanban-card');
  if (!card) return;

  // Move card to target container element
  let containerId = `crm-${targetStage}`;
  const container = document.getElementById(containerId);
  if (!container) return;

  // Update button based on target column
  const actionDiv = card.querySelector('.card-footer-action');
  if (targetStage === 'applied') {
    actionDiv.innerHTML = `<button class="btn-advance" onclick="moveCRMCard(this, 'interview')">Interview <i class="fa-solid fa-arrow-right"></i></button>`;
    card.querySelector('.card-date').innerHTML = `<i class="fa-regular fa-calendar"></i> Applied Today`;
  } else if (targetStage === 'interview') {
    actionDiv.innerHTML = `<button class="btn-advance success" onclick="moveCRMCard(this, 'offer')">Got Offer <i class="fa-solid fa-trophy"></i></button>`;
    card.querySelector('.card-date').innerHTML = `<i class="fa-regular fa-clock"></i> Technical Round Scheduled`;
    card.className = "kanban-card active-interview";
  } else if (targetStage === 'offer') {
    actionDiv.innerHTML = `<span class="badge" style="background-color: var(--color-primary); color: white;">Contract Signed</span>`;
    card.querySelector('.card-date').innerHTML = `<i class="fa-solid fa-square-check"></i> Accepted Offer`;
    card.className = "kanban-card";
  }

  container.appendChild(card);
  initCRMCounting();
}

function initCRMCounting() {
  const columns = document.querySelectorAll('.kanban-column');
  columns.forEach(col => {
    const list = col.querySelector('.kanban-cards-list');
    const badge = col.querySelector('.count-badge');
    if (list && badge) {
      badge.textContent = list.children.length;
    }
  });
}

// Add Job Application Simulation
DOM.btnSaveCRMJob.addEventListener('click', () => {
  const company = prompt("Enter Company Name:", "Google");
  if (!company) return;
  const role = prompt("Enter Job Title:", "Junior Web Developer");
  if (!role) return;

  const cardHtml = `
    <div class="kanban-card">
      <div class="card-meta">${company}</div>
      <h5>${role}</h5>
      <div class="card-date"><i class="fa-regular fa-calendar"></i> Saved Today</div>
      <div class="card-footer-action">
        <button class="btn-advance" onclick="moveCRMCard(this, 'applied')">Apply <i class="fa-solid fa-arrow-right"></i></button>
      </div>
    </div>
  `;
  DOM.crmWishlist.insertAdjacentHTML('beforeend', cardHtml);
  initCRMCounting();
});

// LinkedIn profile Audit calculator
function updateLinkedInAudit() {
  const r = state.resume;
  let score = 50; // Starting baseline score

  // Check contact details
  if (r.fullName) score += 5;
  if (r.title) score += 5;
  if (r.summary && r.summary.length > 50) score += 10;
  
  // Keyword density checklist checks
  const checkSkills = document.getElementById('check-skills');
  const checkAbout = document.getElementById('check-about');

  if (r.skills.includes('SQL') || r.skills.includes('Git')) {
    score += 15;
    if (checkSkills) {
      checkSkills.className = "check-item passed";
      checkSkills.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>Keywords (SQL, Git) verified in resume</span>`;
    }
  } else {
    if (checkSkills) {
      checkSkills.className = "check-item warning";
      checkSkills.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> <span>Missing 3 skills found in target jobs (SQL, Git)</span>`;
    }
  }

  if (r.summary && r.summary.length > 150) {
    score += 15;
    if (checkAbout) {
      checkAbout.className = "check-item passed";
      checkAbout.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>LinkedIn Bio has strong descriptive length</span>`;
    }
  } else {
    if (checkAbout) {
      checkAbout.className = "check-item missing";
      checkAbout.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> <span>About section is too short (needs target keywords)</span>`;
    }
  }

  // Update SVG charts
  score = Math.min(score, 100);
  DOM.auditScoreValue.textContent = `${score}%`;
  
  // DashOffset computation for stroke-dasharray (circumference of 100)
  DOM.auditScoreCircle.setAttribute('stroke-dasharray', `${score}, 100`);
}

// --- 6. 02 Jobright Matcher & AI Scanner Simulator ---
function initJobrightScanner() {
  DOM.btnScanMatch.addEventListener('click', () => {
    const jobText = DOM.jobDescText.value;
    if (!jobText.trim()) {
      alert("Please paste a job description first.");
      return;
    }

    // Toggle loading spinner
    DOM.scanLoading.style.display = 'flex';
    DOM.reportViewContent.style.opacity = '0.3';

    setTimeout(() => {
      // Finished scanning simulation
      DOM.scanLoading.style.display = 'none';
      DOM.reportViewContent.style.opacity = '1';

      // Perform simulated keyword scan matching
      const r = state.resume;
      const doc = jobText.toLowerCase();

      const targetKeywords = ['react', 'javascript', 'html', 'css', 'node.js', 'sql', 'git', 'agile', 'rest api', 'mysql', 'docker', 'python'];
      const matched = [];
      const missing = [];

      targetKeywords.forEach(kw => {
        const containsInJob = doc.includes(kw);
        const containsInResume = r.skills.some(skill => skill.toLowerCase().includes(kw)) || 
                                 (r.summary && r.summary.toLowerCase().includes(kw));

        if (containsInJob) {
          if (containsInResume) {
            matched.push(kw);
          } else {
            missing.push(kw);
          }
        }
      });

      // Calculate score based on keyword match density
      let matchPercent = 50; // Base score
      if (matched.length > 0 || missing.length > 0) {
        const total = matched.length + missing.length;
        matchPercent = Math.round((matched.length / total) * 50) + 50;
      }

      // Update radial UI
      DOM.scanScoreNum.textContent = `${matchPercent}%`;
      
      const parentCircle = DOM.scanScoreNum.closest('.score-circle-container');
      if (parentCircle) {
        parentCircle.style.background = `conic-gradient(var(--color-primary) ${matchPercent}%, rgba(255,255,255,0.05) ${matchPercent}%)`;
      }

      // Add labels
      if (matchPercent >= 80) {
        DOM.scanScoreLabel.textContent = "High Match Quality";
        DOM.scanScoreDesc.textContent = "Your resume is highly optimized for this job listing. You are ready to apply!";
      } else if (matchPercent >= 65) {
        DOM.scanScoreLabel.textContent = "Moderate Match Quality";
        DOM.scanScoreDesc.textContent = "Good foundation. Adding the keyword gaps on the right will improve your ATS screening success.";
      } else {
        DOM.scanScoreLabel.textContent = "Low Match Quality";
        DOM.scanScoreDesc.textContent = "Key technical requirements are missing. Review the keyword gaps below.";
      }

      // Populate Pills
      DOM.matchedKeywords.innerHTML = matched.length > 0 
        ? matched.map(m => `<span class="keyword-pill success">${m.toUpperCase()}</span>`).join('')
        : '<span style="font-size:0.75rem; color:var(--text-muted);">None found.</span>';

      DOM.missingKeywords.innerHTML = missing.length > 0
        ? missing.map(m => `<span class="keyword-pill danger">${m.toUpperCase()}</span>`).join('')
        : '<span style="font-size:0.75rem; color:var(--text-muted);">No missing keywords detected!</span>';

      // Recommendation Text
      if (missing.length > 0) {
        DOM.scanRecommendation.textContent = `To boost your match score, integrate these missing keywords into your skills list or project description sections: ${missing.slice(0, 3).join(', ').toUpperCase()}.`;
      } else {
        DOM.scanRecommendation.textContent = `Excellent! Your resume includes all essential keywords for this position. Proceed with applying via the Careerflow tracking board.`;
      }

    }, 1500);
  });
}

// --- 7. 03 Social Sonic LinkedIn Writer Simulator ---
function initSocialSonic() {
  DOM.btnGenerateLinkedinPost.addEventListener('click', () => {
    const r = state.resume;
    const style = DOM.sonicPostStyle.value;
    const emoji = DOM.sonicEmojiDensity.value;

    let headline = `${r.title} Seeking New Roles`;
    DOM.sonicProfileHeadline.textContent = `${r.fullName} | seeking opportunities`;

    let postText = '';
    const recentJob = r.experience[0];

    let bulletHook = recentJob ? recentJob.bullets[0] : "building interactive frontends";
    let companyName = recentJob ? recentJob.company : "TechNova Solutions";

    if (style === 'story') {
      postText = `🚀 From graduate project to deploying production code, the tech journey is real.

I remember starting out wondering how variables and arrays connected to customer experiences. Now, after completing my stint at ${companyName}, it's all making sense.

I recently focused on:
- ${bulletHook}
- Collaborating in agile sprints
- Deep-diving into modern engineering practices

What's next? I'm officially Seeking Opportunities! If your team is looking for a self-motivated Junior Software Engineer skilled in React and Node, let's connect. 

👉 Details and video pitch attached in my profile! #webdevelopment #softwareengineer #hiring`;
    } else if (style === 'technical') {
      postText = `🛠️ Technical Project Highlight: ${r.projects[0] ? r.projects[0].title : 'E-Commerce Backend API'}

I wanted to share my latest build! I created a responsive service utilizing ${r.skills.slice(0, 3).join(', ')}.

Key milestones:
- Managed REST API routes in Express
- Processed heavy database queries efficiently
- Configured repository versioning

Building this taught me to write scalable, clean, and self-documenting code. Check out the full walkthrough and my video resume attachment!

#reactjs #javascriptdeveloper #opensource #buildinpublic`;
    } else {
      // Announcement
      postText = `📢 I'm Seeking New Opportunities!

I am thrilled to announce that I am officially Open to Work as a ${r.title}. 

With hands-on experience in React, JavaScript, and database management, I enjoy building tools that solve real-world problems.

What I bring:
- High energy and a commitment to clean styling architecture.
- Experience with testing, debugging, and API integrations.
- A strong foundation in Computer Science logic.

If you are hiring or know someone looking for developer talent in ${r.location || 'remote'}, I would love a brief chat!

#opentowork #seekingjobs #juniorroles #developerjobs`;
    }

    // Emoji density processor
    if (emoji === 'none') {
      postText = postText.replace(/[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, "");
    } else if (emoji === 'high') {
      postText = postText.replace(/\n\n/g, "\n🔥\n").replace(/- /g, "⚡ ");
    }

    DOM.sonicPostOutput.textContent = postText;
  });

  // Copy post handler
  DOM.btnCopyPost.addEventListener('click', () => {
    const text = DOM.sonicPostOutput.textContent;
    if (text.includes("Choose a post format")) return;

    navigator.clipboard.writeText(text).then(() => {
      alert("Post copied to clipboard successfully!");
    }).catch(err => {
      console.error("Could not copy post: ", err);
    });
  });
}

// --- 8. Premium Checkout Mock Simulator ---
function initPremiumTriggers() {
  // Show Upgrade modal
  DOM.upgradeTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      DOM.upgradeModal.classList.add('active');
    });
  });

  // Close modal
  DOM.modalCloseBtn.addEventListener('click', () => {
    DOM.upgradeModal.classList.remove('active');
  });

  // Click outside to close
  DOM.upgradeModal.addEventListener('click', (e) => {
    if (e.target === DOM.upgradeModal) {
      DOM.upgradeModal.classList.remove('active');
    }
  });

  // Simulated activation
  DOM.btnActivatePremium.addEventListener('click', () => {
    DOM.btnActivatePremium.disabled = true;
    DOM.btnActivatePremium.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Activating Membership...`;

    setTimeout(() => {
      // Upgrade Completed!
      state.isPro = true;
      document.body.classList.add('pro-unlocked');
      
      // Update UI elements
      DOM.userTierLabel.textContent = "Premium Pro Member";
      DOM.userTierLabel.className = "tier-label pro-active";
      
      DOM.unlockBtn.innerHTML = `<i class="fa-solid fa-crown" style="color:var(--color-accent-gold);"></i> <span>Pro Unlocked</span>`;
      DOM.unlockBtn.disabled = true;
      DOM.unlockBtn.style.cursor = 'default';
      
      // Remove sidebar card
      DOM.premiumCtaCard.style.display = 'none';

      // Hide all badges
      document.querySelectorAll('.badge.pro').forEach(badge => {
        badge.style.display = 'none';
      });

      // Close modal
      DOM.upgradeModal.classList.remove('active');

      alert("🎉 Welcome to ResumeFlow Pro! All premium AI features are now unlocked.");
    }, 1500);
  });

  // Toggle state via demo unlock header button
  DOM.unlockBtn.addEventListener('click', () => {
    if (!state.isPro) {
      DOM.upgradeModal.classList.add('active');
    }
  });
}
