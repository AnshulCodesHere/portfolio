/**
 * ANSHUL PATEL — MASTER PORTFOLIO SCRIPTS
 * Interactive features: spotlight cards, animated counters, smooth tabs,
 * ATS resume modal, lightbox gallery, conversation shuffler, clipboard copy,
 * and subtle Web Audio feedback.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Bento Card Dynamic Mouse Spotlight
  const bentoCards = document.querySelectorAll('.bento-card');
  bentoCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // 2. Dynamic Count-Up for Numbers (e.g. 2M Reach, 80% Class 12th, 8.4 CGPA)
  const animatedCounters = document.querySelectorAll('[data-counter-target]');
  const countObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.getAttribute('data-counter-target'));
        const prefix = el.getAttribute('data-counter-prefix') || '';
        const suffix = el.getAttribute('data-counter-suffix') || '';
        const decimals = parseInt(el.getAttribute('data-counter-decimals') || '0', 10);
        const duration = 1600; // ms
        const startTime = performance.now();

        const updateCounter = (currentTime) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out expo
          const easeOut = 1 - Math.pow(2, -10 * progress);
          const currentVal = (target * easeOut).toFixed(decimals);
          el.textContent = `${prefix}${currentVal}${suffix}`;

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            el.textContent = `${prefix}${target.toFixed(decimals)}${suffix}`;
          }
        };

        requestAnimationFrame(updateCounter);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  animatedCounters.forEach(el => countObserver.observe(el));

  // 3. ScrollSpy for Pill Navigation & Section Tabs
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
  const sectionTabs = document.querySelectorAll('.section-tab-item[href^="#"]');

  const scrollSpyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const activeId = entry.target.getAttribute('id');
        
        // Update Floating Pill
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${activeId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });

        // Update Section Tabs
        sectionTabs.forEach(tab => {
          if (tab.getAttribute('href') === `#${activeId}`) {
            tab.classList.add('active');
          } else {
            tab.classList.remove('active');
          }
        });
      }
    });
  }, { threshold: 0.25 });

  sections.forEach(sec => scrollSpyObserver.observe(sec));

  // 4. ATS Resume Modal Controls
  const resumeModal = document.getElementById('resumeModal');
  const openResumeButtons = document.querySelectorAll('[data-open-resume]');
  const closeResumeBtn = document.getElementById('closeResumeBtn');
  const printResumeBtn = document.getElementById('printResumeBtn');

  const openResume = () => {
    if (!resumeModal) return;
    resumeModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    playSubtleClick();
  };

  const closeResume = () => {
    if (!resumeModal) return;
    resumeModal.classList.remove('active');
    document.body.style.overflow = '';
  };

  openResumeButtons.forEach(btn => btn.addEventListener('click', (e) => {
    e.preventDefault();
    openResume();
  }));

  if (closeResumeBtn) {
    closeResumeBtn.addEventListener('click', closeResume);
  }

  if (resumeModal) {
    resumeModal.addEventListener('click', (e) => {
      if (e.target === resumeModal) {
        closeResume();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (resumeModal && resumeModal.classList.contains('active')) closeResume();
      if (projectDetailsModal && projectDetailsModal.classList.contains('active')) closeProject();
    }
  });

  if (printResumeBtn) {
    printResumeBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // 5. Toast Notification System & Clipboard Copy
  const toast = document.getElementById('toastNotice');
  const toastMsg = document.getElementById('toastMsg');
  let toastTimer = null;

  const showToast = (message) => {
    if (!toast) return;
    toastMsg.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    playSubtleClick();
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  };

  // Clipboard copy triggers
  const copyButtons = document.querySelectorAll('[data-copy-text]');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const text = btn.getAttribute('data-copy-text');
      const label = btn.getAttribute('data-copy-label') || 'Copied to clipboard!';
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
          showToast(label);
        }).catch(() => {
          fallbackCopyText(text, label);
        });
      } else {
        fallbackCopyText(text, label);
      }
    });
  });

  function fallbackCopyText(text, label) {
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    showToast(label);
  }

  // 6. Project Details Modal (With Geo Context AI live link)
  const projectDetailsModal = document.getElementById('projectDetailsModal');
  const projectModalTitle = document.getElementById('projectModalTitle');
  const projectModalContent = document.getElementById('projectModalContent');
  const closeProjectBtn = document.getElementById('closeProjectBtn');

  const projectData = {
    sih2026: {
      title: "Geo Context AI (SIH 2026)",
      subtitle: "Industrial Fire / Hotspot Monitoring System",
      role: "Team Leader & Backend Developer",
      badge: "Shortlisted for Round 2",
      projectUrl: "https://geo-context-ai.onrender.com",
      description: "Led a multifaceted student team to engineer an industrial early-warning hotspot and fire detection system under Smart India Hackathon. Developed backend APIs, integrated sensor stream pipelines, and pitched our scalable architecture live before the national judging panel, advancing our team to Round 2.",
      stack: ["Python", "FastAPI", "REST APIs", "IoT Data Ingestion", "Render Cloud", "Git / GitHub"],
      highlights: [
        "Architected core backend endpoints and sensor event processing workflows.",
        "Deployed functional prototype live on Render at geo-context-ai.onrender.com.",
        "Coordinated full-cycle team execution from problem discovery to live prototype presentation.",
        "Successfully defended solution architecture before technical evaluation judges."
      ]
    },
    aimanthan: {
      title: "AI Manthan — 24-Hour Hackathon",
      subtitle: "AI-Powered Industrial Defect Detection System",
      role: "Research Contributor & Lead Presenter",
      badge: "Best Creative Team Award Winner",
      description: "Participated in an intensive 24-hour hackathon focused on industrial computer vision and automated defect screening. Researched industrial QA challenges, helped shape the defect-classification pipeline, and delivered the winning pitch to secure the Best Creative Team accolade.",
      stack: ["Python", "AI / ML Concepts", "Problem Research", "Technical Pitching"],
      highlights: [
        "Conducted in-depth feasibility research on real-time industrial surface anomaly detection.",
        "Formulated creative edge-case handling for varying factory lighting environments.",
        "Awarded Best Creative Team for novel methodology and impactful presentation."
      ]
    }
  };

  const openProjectButtons = document.querySelectorAll('[data-project-id]');
  openProjectButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Don't intercept if clicking direct link anchor
      if (e.target.closest('.btn-project-link') || e.target.closest('a')) {
        return;
      }
      e.preventDefault();
      const projKey = btn.getAttribute('data-project-id');
      const data = projectData[projKey];
      if (!data) return;

      projectModalTitle.innerHTML = `
        <span class="project-tag" style="margin-bottom: 0.25rem;">${data.badge}</span>
        <h2 style="font-size: 1.6rem; font-weight: 600; color: #fff;">${data.title}</h2>
        <p style="color: var(--accent-coral); font-size: 0.95rem; margin-top: 0.2rem;">${data.subtitle}</p>
      `;

      let liveButtonHtml = '';
      if (data.projectUrl) {
        liveButtonHtml = `
          <div style="margin-top: 1.5rem; padding-top: 1.25rem; border-top: 1px solid rgba(255,255,255,0.08); display: flex; align-items: center; justify-content: space-between;">
            <span style="font-size: 0.85rem; color: #a1a1aa;">Live Deployment:</span>
            <a href="${data.projectUrl}" target="_blank" rel="noopener noreferrer" class="btn-project-link">
              <span>Explore Live Project ↗</span>
            </a>
          </div>
        `;
      }

      projectModalContent.innerHTML = `
        <div style="margin-bottom: 1.25rem;">
          <span style="font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted); font-family: 'JetBrains Mono', monospace;">Role</span>
          <p style="color: #ffffff; font-weight: 600; font-size: 1rem;">${data.role}</p>
        </div>
        
        <p style="color: var(--text-secondary); line-height: 1.65; margin-bottom: 1.5rem;">${data.description}</p>
        
        <div style="margin-bottom: 1.5rem;">
          <h4 style="font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); font-family: 'JetBrains Mono', monospace; margin-bottom: 0.75rem;">Key Contributions & Outcomes</h4>
          <ul style="list-style: none; padding-left: 0;">
            ${data.highlights.map(h => `
              <li style="display: flex; align-items: flex-start; gap: 0.6rem; margin-bottom: 0.5rem; font-size: 0.9rem; color: #e4e4e7;">
                <span style="color: var(--accent-coral); margin-top: 2px;">✦</span>
                <span>${h}</span>
              </li>
            `).join('')}
          </ul>
        </div>

        <div>
          <h4 style="font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); font-family: 'JetBrains Mono', monospace; margin-bottom: 0.75rem;">Technologies & Tools</h4>
          <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
            ${data.stack.map(s => `
              <span class="skill-pill">${s}</span>
            `).join('')}
          </div>
        </div>
        ${liveButtonHtml}
      `;

      projectDetailsModal.classList.add('active');
      document.body.style.overflow = 'hidden';
      playSubtleClick();
    });
  });

  const closeProject = () => {
    if (projectDetailsModal) {
      projectDetailsModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  if (closeProjectBtn) closeProjectBtn.addEventListener('click', closeProject);
  if (projectDetailsModal) {
    projectDetailsModal.addEventListener('click', (e) => {
      if (e.target === projectDetailsModal) closeProject();
    });
  }

  // 7. Conversation Starter Shuffler (Personal & Fun)
  const conversationPrompts = [
    "What's a life philosophy or perspective that completely shifted how you see the world?",
    "If you could hear the unvarnished, true life story of anyone you know, whose would it be?",
    "What is a song, melody, or piece of poetry that instantly transports you to a specific memory?",
    "What's the most spontaneous, unconventional decision you've ever said yes to that turned out amazing?",
    "What is something you're endlessly curious about right now that most people don't talk about?",
    "What makes a human being truly authentic and unforgettable to you?",
    "If we had an hour with zero distractions over coffee, what would we end up debating?",
    "What's an unconventional adventure or hobby on your bucket list this year?"
  ];

  const conversationTopicText = document.getElementById('conversationTopicText');
  const shuffleTopicBtn = document.getElementById('shuffleTopicBtn');
  let currentTopicIdx = 0;

  if (shuffleTopicBtn && conversationTopicText) {
    shuffleTopicBtn.addEventListener('click', () => {
      playSubtleClick();
      conversationTopicText.style.opacity = '0';
      conversationTopicText.style.transform = 'translateY(6px)';
      
      setTimeout(() => {
        let newIdx = Math.floor(Math.random() * conversationPrompts.length);
        if (newIdx === currentTopicIdx) {
          newIdx = (newIdx + 1) % conversationPrompts.length;
        }
        currentTopicIdx = newIdx;
        conversationTopicText.textContent = `"${conversationPrompts[currentTopicIdx]}"`;
        conversationTopicText.style.opacity = '1';
        conversationTopicText.style.transform = 'translateY(0)';
      }, 200);
    });
  }

  // 9. Subtle Web Audio Micro-Interaction
  let audioCtx = null;
  function playSubtleClick() {
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(820, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(320, audioCtx.currentTime + 0.035);
      gain.gain.setValueAtTime(0.015, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.035);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.035);
    } catch (err) {
      // Audio context silently fails if blocked or unsupported
    }
  }
});
