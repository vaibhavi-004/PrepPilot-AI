/**
 * js/notes.js
 * Concept Notes Manager Logic
 * 
 * Manages fetching, rendering, adding, viewing,
 * and deleting user note cards.
 */

let allNotes = [];

document.addEventListener('DOMContentLoaded', () => {
  const addNoteForm = document.getElementById('add-note-form');

  // --- ADD NOTE ---
  if (addNoteForm) {
    addNoteForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const token = localStorage.getItem('preppilot_token');
      const title = document.getElementById('note-title').value.trim();
      const content = document.getElementById('note-content').value.trim();

      try {
        const response = await fetch(`${API_BASE_URL}/notes`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ title, content })
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || 'Failed to create note');
        }

        // Cleanup
        closeModal('add-note-modal');
        addNoteForm.reset();
        showDashboardToast('Revision note created!', 'success');

        await fetchNotes();
        refreshDashboardStats();

      } catch (error) {
        showDashboardToast(error.message, 'danger');
      }
    });
  }
});

/**
 * Fetches all notes associated with logged-in user
 */
async function fetchNotes() {
  const token = localStorage.getItem('preppilot_token');
  if (!token) return;

  try {
    const response = await fetch(`${API_BASE_URL}/notes`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) {
      throw new Error('Failed to load notes.');
    }

    allNotes = await response.json();
    renderNotesGrid(allNotes);

  } catch (error) {
    console.error('Error fetching notes:', error);
    showDashboardToast('Error loading study notes.', 'danger');
  }
}

/**
 * Renders notes as a dynamic grid of card components
 */
function renderNotesGrid(notes) {
  const container = document.getElementById('notes-cards-container');
  if (!container) return;

  if (notes.length === 0) {
    container.innerHTML = `
      <div class="text-center text-muted w-100 py-5">
        No study notes created yet. Click "Create Note" to document a concept.
      </div>
    `;
    return;
  }

  container.innerHTML = notes.map(note => {
    const formattedDate = new Date(note.createdAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    // Create a safe preview text (first 120 chars) for card bodies
    const previewText = note.content.length > 120 ? note.content.substring(0, 120) + '...' : note.content;

    return `
      <div class="note-card" onclick="viewFullNote('${note._id}')">
        <div class="note-header">
          <h4 class="note-title">${escapeHTML(note.title)}</h4>
          <button class="note-delete-btn" onclick="confirmAndDeleteNote(event, '${note._id}')" title="Delete Note">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          </button>
        </div>
        <p class="note-body">${escapeHTML(previewText)}</p>
        <div class="note-footer">
          <span class="note-date">${formattedDate}</span>
          <span class="text-btn">Read Note</span>
        </div>
      </div>
    `;
  }).join('');
}

/**
 * Reveals full scrollable details modal for a single note card
 */
function viewFullNote(id) {
  const note = allNotes.find(n => n._id === id);
  if (!note) return;

  const formattedDate = new Date(note.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const modalTitle = document.getElementById('view-note-title');
  const modalDate = document.getElementById('view-note-date');
  const modalContent = document.getElementById('view-note-content');

  if (modalTitle) modalTitle.textContent = note.title;
  if (modalDate) modalDate.textContent = `Documented on: ${formattedDate}`;
  
  if (modalContent) {
    // Preserve linebreaks and spaces during rendering
    modalContent.innerHTML = escapeHTML(note.content).replace(/\n/g, '<br>');
  }

  openModal('view-note-modal');
}

/**
 * Triggers deletion verification and removes note via endpoint
 */
async function confirmAndDeleteNote(event, id) {
  // Prevent click bubbling up and triggering viewFullNote modal immediately
  event.stopPropagation();

  const note = allNotes.find(n => n._id === id);
  if (!note) return;

  const confirmed = confirm(`Are you sure you want to delete the note: "${note.title}"?`);
  if (!confirmed) return;

  const token = localStorage.getItem('preppilot_token');
  try {
    const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) {
      throw new Error('Could not delete note.');
    }

    showDashboardToast('Revision note deleted.', 'success');

    await fetchNotes();
    refreshDashboardStats();

  } catch (error) {
    showDashboardToast(error.message, 'danger');
  }
}
