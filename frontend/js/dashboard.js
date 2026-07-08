/**
 * js/dashboard.js
 * SPA Dashboard Navigation & Global Stats Processor
 * 
 * Manages view toggles, sidebar active states, welcome name overlays,
 * modal dialog controls, and handles calculating overall DSA and Notes stats.
 */

// Global State
let dashboardProblems = [];
let dashboardNotes = [];

// DOM Ready initialization
document.addEventListener('DOMContentLoaded', () => {
  // Ensure token check occurs first (handled in auth.js, but let's be double safe)
  const token = localStorage.getItem('preppilot_token');
  if (!token) return;

  // Retrieve user payload from storage
  const user = JSON.parse(localStorage.getItem('preppilot_user'));
  if (user) {
    updateUserUIDOM(user);
  }

  // Bind Sidebar Navigation Triggers
  initSidebarNavigation();

  // Load all data to calculate statistics
  refreshDashboardStats();
});

/**
 * Populates User greeting labels, initials, and profile form fields
 */
function updateUserUIDOM(user) {
  const welcomeSub = document.getElementById('header-subtitle');
  const pillName = document.getElementById('pill-user-name');
  const avatarLetters = document.getElementById('avatar-letters');
  const avatarLargeLetters = document.getElementById('avatar-large-letters');
  const profileName = document.getElementById('profile-name');
  const profileLargeName = document.getElementById('profile-large-name');
  const profileEmail = document.getElementById('profile-email');
  const profileFieldName = document.getElementById('profile-field-name');
  const profileFieldEmail = document.getElementById('profile-field-email');

  // Compute initials (e.g. "John Doe" -> "JD")
  const initials = user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'PP';

  if (welcomeSub) welcomeSub.textContent = `Welcome back, ${user.name}!`;
  if (pillName) pillName.textContent = user.name;
  if (avatarLetters) avatarLetters.textContent = initials;
  if (avatarLargeLetters) avatarLargeLetters.textContent = initials;
  if (profileName) profileName.textContent = user.name;
  if (profileLargeName) profileLargeName.textContent = user.name;
  if (profileEmail) profileEmail.textContent = user.email;
  if (profileFieldName) profileFieldName.value = user.name;
  if (profileFieldEmail) profileFieldEmail.value = user.email;
}

/**
 * Configures navigation menu event handlers to simulate SPA view switching
 */
function initSidebarNavigation() {
  const menuButtons = document.querySelectorAll('.menu-item:not(.logout)');
  const sections = document.querySelectorAll('.content-section');
  const headerTitle = document.getElementById('header-title');

  // Titles mapping for UI header
  const sectionTitles = {
    'section-dashboard': 'Dashboard Overview',
    'section-dsa': 'DSA Progress Tracker',
    'section-notes': 'Concept Notes Manager',
    'section-ai': 'AI Interview Assistant',
    'section-profile': 'Candidate Profile Settings'
  };

  const handleNavigation = (targetSectionId) => {
    // 1. Un-active all menu items and hide all sections
    menuButtons.forEach(btn => btn.classList.remove('active'));
    sections.forEach(sec => sec.classList.add('hidden'));

    // 2. Activate target menu item in sidebar
    const activeBtn = Array.from(menuButtons).find(btn => btn.getAttribute('data-target') === targetSectionId);
    if (activeBtn) activeBtn.classList.add('active');

    // 3. Show target section
    const targetSection = document.getElementById(targetSectionId);
    if (targetSection) {
      targetSection.classList.remove('hidden');
    }

    // 4. Update Header Title
    if (headerTitle) {
      headerTitle.textContent = sectionTitles[targetSectionId] || 'PrepPilot AI';
    }

    // Dynamic fetch overrides for real-time consistency
    if (targetSectionId === 'section-dashboard') {
      refreshDashboardStats();
    } else if (targetSectionId === 'section-dsa' && typeof fetchProblems === 'function') {
      fetchProblems();
    } else if (targetSectionId === 'section-notes' && typeof fetchNotes === 'function') {
      fetchNotes();
    }
  };

  // Attach standard sidebar buttons
  menuButtons.forEach(button => {
    button.addEventListener('click', () => {
      const target = button.getAttribute('data-target');
      handleNavigation(target);
    });
  });

  // Attach internal UI links that direct users to sections (e.g. quick actions)
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('.nav-trigger-btn');
    if (trigger) {
      const target = trigger.getAttribute('data-target');
      handleNavigation(target);
    }
  });
}

/**
 * Global stats aggregator. Fetches fresh problems & notes from database
 * and computes status numbers, notes quantity, and progress percentages.
 */
async function refreshDashboardStats() {
  const token = localStorage.getItem('preppilot_token');
  if (!token) return;

  try {
    // 1. Fetch raw problems list
    const problemsRes = await fetch(`${API_BASE_URL}/problems`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (problemsRes.ok) {
      dashboardProblems = await problemsRes.json();
    }

    // 2. Fetch raw notes list
    const notesRes = await fetch(`${API_BASE_URL}/notes`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (notesRes.ok) {
      dashboardNotes = await notesRes.json();
    }

    // 3. Perform calculations and update UI
    calculateAndRenderStats(dashboardProblems, dashboardNotes);

  } catch (error) {
    console.error('[Dashboard Stats Refresh Error]:', error.message);
  }
}

/**
 * Calculates stats and updates dashboard nodes
 */
function calculateAndRenderStats(problems, notes) {
  // DOM selectors
  const totalProblemsText = document.getElementById('stats-total-problems');
  const solvedPercentText = document.getElementById('stats-solved-percent');
  const countSolvedText = document.getElementById('count-solved');
  const countAttemptedText = document.getElementById('count-attempted');
  const countNotStartedText = document.getElementById('count-notstarted');
  
  const totalNotesText = document.getElementById('stats-total-notes');
  const gridNotesCount = document.getElementById('notes-grid-count');
  const profileTotalProblems = document.getElementById('profile-total-problems');
  const profileTotalNotes = document.getElementById('profile-total-notes');

  // DSA Counters
  const totalCount = problems.length;
  const solvedCount = problems.filter(p => p.status === 'Solved').length;
  const attemptedCount = problems.filter(p => p.status === 'Attempted').length;
  const notStartedCount = problems.filter(p => p.status === 'Not Started').length;

  const solvedPercentage = totalCount > 0 ? Math.round((solvedCount / totalCount) * 100) : 0;

  // Update Stats Cards
  if (totalProblemsText) totalProblemsText.textContent = totalCount;
  if (solvedPercentText) solvedPercentText.textContent = `${solvedPercentage}% Solved`;
  if (countSolvedText) countSolvedText.textContent = solvedCount;
  if (countAttemptedText) countAttemptedText.textContent = attemptedCount;
  if (countNotStartedText) countNotStartedText.textContent = notStartedCount;

  // Notes counters
  if (totalNotesText) totalNotesText.textContent = notes.length;
  if (gridNotesCount) gridNotesCount.textContent = notes.length;

  // Profile page summaries
  if (profileTotalProblems) profileTotalProblems.textContent = totalCount;
  if (profileTotalNotes) profileTotalNotes.textContent = notes.length;

  // If we are currently on the dashboard landing tab, update the Recent list table
  const recentProblemsTbody = document.getElementById('recent-problems-tbody');
  if (recentProblemsTbody) {
    renderRecentProblemsTable(problems.slice(0, 5)); // show top 5 latest
  }
}

/**
 * Renders the top 5 recently logged problems on the Dashboard home view
 */
function renderRecentProblemsTable(recentProblems) {
  const tbody = document.getElementById('recent-problems-tbody');
  if (!tbody) return;

  if (recentProblems.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="3" class="text-center text-muted py-3">No problems logged yet.</td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = recentProblems.map(prob => {
    let difficultyClass = prob.difficulty.toLowerCase();
    let statusClass = 'status-notstarted';
    if (prob.status === 'Solved') statusClass = 'status-solved';
    if (prob.status === 'Attempted') statusClass = 'status-attempted';

    return `
      <tr>
        <td class="font-semibold">${escapeHTML(prob.title)}</td>
        <td><span class="badge ${difficultyClass}">${prob.difficulty}</span></td>
        <td><span class="badge ${statusClass}">${prob.status}</span></td>
      </tr>
    `;
  }).join('');
}

// --- GLOBAL MODAL CONTROLLERS ---

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('hidden');
    // Lock document scroll
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }
}

/**
 * Utility function to sanitize HTML rendering to prevent XSS attacks
 */
function escapeHTML(str) {
  if (!str) return '';
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}

/**
 * Universal Toast Notification controller for Dashboard actions
 */
function showDashboardToast(message, type = 'success') {
  const alertBar = document.getElementById('dashboard-alert');
  if (!alertBar) return;

  alertBar.textContent = message;
  alertBar.className = `dashboard-alert ${type}`;
  alertBar.classList.remove('hidden');

  // Auto-hide alert after 3 seconds
  setTimeout(() => {
    alertBar.classList.add('hidden');
  }, 3500);
}
