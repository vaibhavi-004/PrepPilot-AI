/**
 * js/dsa.js
 * DSA Progress Tracker Logic
 * 
 * Handles fetching list of problems, filtering, creating,
 * editing, and deleting records in MongoDB.
 */

let allProblems = [];

// Initialize trackers and forms
document.addEventListener('DOMContentLoaded', () => {
  const addProblemForm = document.getElementById('add-problem-form');
  const editProblemForm = document.getElementById('edit-problem-form');
  const filterDifficulty = document.getElementById('dsa-filter-difficulty');
  const filterStatus = document.getElementById('dsa-filter-status');

  // --- ADD PROBLEM ---
  if (addProblemForm) {
    addProblemForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const token = localStorage.getItem('preppilot_token');
      const title = document.getElementById('problem-title').value.trim();
      const difficulty = document.getElementById('problem-difficulty').value;
      const status = document.getElementById('problem-status').value;

      try {
        const response = await fetch(`${API_BASE_URL}/problems`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ title, difficulty, status })
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || 'Failed to add problem');
        }

        // Cleanup, refresh stats, and reload
        closeModal('add-problem-modal');
        addProblemForm.reset();
        showDashboardToast('DSA problem tracked successfully!', 'success');
        
        // Refresh local memory and reload tables
        await fetchProblems();
        refreshDashboardStats(); // Update dashboard cards

      } catch (error) {
        showDashboardToast(error.message, 'danger');
      }
    });
  }

  // --- EDIT PROBLEM SUBMISSION ---
  if (editProblemForm) {
    editProblemForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const token = localStorage.getItem('preppilot_token');
      const id = document.getElementById('edit-problem-id').value;
      const title = document.getElementById('edit-problem-title').value.trim();
      const difficulty = document.getElementById('edit-problem-difficulty').value;
      const status = document.getElementById('edit-problem-status').value;

      try {
        const response = await fetch(`${API_BASE_URL}/problems/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ title, difficulty, status })
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || 'Failed to update problem');
        }

        closeModal('edit-problem-modal');
        showDashboardToast('DSA problem updated!', 'success');

        await fetchProblems();
        refreshDashboardStats();

      } catch (error) {
        showDashboardToast(error.message, 'danger');
      }
    });
  }

  // --- FILTER CHANGE HANDLERS ---
  if (filterDifficulty) {
    filterDifficulty.addEventListener('change', () => renderProblemsTable(applyFilters()));
  }
  if (filterStatus) {
    filterStatus.addEventListener('change', () => renderProblemsTable(applyFilters()));
  }
});

/**
 * Fetch all problems from server and store in global array
 */
async function fetchProblems() {
  const token = localStorage.getItem('preppilot_token');
  if (!token) return;

  try {
    const response = await fetch(`${API_BASE_URL}/problems`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) {
      throw new Error('Could not fetch problems.');
    }

    allProblems = await response.json();
    renderProblemsTable(applyFilters());

  } catch (error) {
    console.error('Error fetching problems:', error);
    showDashboardToast('Error loading problems sheet.', 'danger');
  }
}

/**
 * Filters the problems array based on select value criteria
 */
function applyFilters() {
  const diffVal = document.getElementById('dsa-filter-difficulty').value;
  const statusVal = document.getElementById('dsa-filter-status').value;

  return allProblems.filter(prob => {
    const matchesDiff = (diffVal === 'all' || prob.difficulty === diffVal);
    const matchesStatus = (statusVal === 'all' || prob.status === statusVal);
    return matchesDiff && matchesStatus;
  });
}

/**
 * Renders the tabular layout of problems inside the tracker tab
 */
function renderProblemsTable(problems) {
  const tbody = document.getElementById('dsa-problems-tbody');
  if (!tbody) return;

  if (problems.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" class="text-center text-muted py-5">No problems matches found.</td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = problems.map(prob => {
    const formattedDate = new Date(prob.createdAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    const diffClass = prob.difficulty.toLowerCase();
    let statusClass = 'status-notstarted';
    if (prob.status === 'Solved') statusClass = 'status-solved';
    if (prob.status === 'Attempted') statusClass = 'status-attempted';

    return `
      <tr>
        <td class="font-semibold">${escapeHTML(prob.title)}</td>
        <td><span class="badge ${diffClass}">${prob.difficulty}</span></td>
        <td><span class="badge ${statusClass}">${prob.status}</span></td>
        <td class="text-muted">${formattedDate}</td>
        <td class="actions-cell">
          <button class="btn-table-action edit" onclick="populateAndOpenEditModal('${prob._id}')" title="Edit Problem">
            <svg class="table-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
          </button>
          <button class="btn-table-action delete" onclick="confirmAndDeleteProblem('${prob._id}')" title="Delete Problem">
            <svg class="table-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

/**
 * Searches local memory array to populate edit form fields and reveals modal
 */
function populateAndOpenEditModal(id) {
  const problem = allProblems.find(p => p._id === id);
  if (!problem) return;

  document.getElementById('edit-problem-id').value = problem._id;
  document.getElementById('edit-problem-title').value = problem.title;
  document.getElementById('edit-problem-difficulty').value = problem.difficulty;
  document.getElementById('edit-problem-status').value = problem.status;

  openModal('edit-problem-modal');
}

/**
 * Double checks authorization and deletes the record via API
 */
async function confirmAndDeleteProblem(id) {
  const problem = allProblems.find(p => p._id === id);
  if (!problem) return;

  const confirmed = confirm(`Are you sure you want to delete the problem: "${problem.title}"?`);
  if (!confirmed) return;

  const token = localStorage.getItem('preppilot_token');
  try {
    const response = await fetch(`${API_BASE_URL}/problems/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) {
      throw new Error('Could not delete problem from database.');
    }

    showDashboardToast('Problem deleted successfully.', 'success');
    
    // Refresh lists and sync statistics
    await fetchProblems();
    refreshDashboardStats();

  } catch (error) {
    showDashboardToast(error.message, 'danger');
  }
}
