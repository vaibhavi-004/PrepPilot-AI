/**
 * js/ai.js
 * AI Interview Preparation Panel Logic
 * 
 * Handles sending trigger requests to backend AI completion endpoints,
 * animating loading states, and formatting resulting question categories.
 */

document.addEventListener('DOMContentLoaded', () => {
  const btnGenerate = document.getElementById('btn-generate-ai');
  const loadingSpinner = document.getElementById('ai-loading-spinner');
  const questionsOutput = document.getElementById('ai-questions-output');
  const metadataFooter = document.getElementById('ai-metadata-footer');
  const engineSource = document.getElementById('ai-engine-source');

  if (btnGenerate) {
    btnGenerate.addEventListener('click', async () => {
      const token = localStorage.getItem('preppilot_token');
      if (!token) return;

      // 1. Enter Loading State
      btnGenerate.disabled = true;
      btnGenerate.querySelector('span').textContent = 'Compiling...';
      loadingSpinner.classList.remove('hidden');
      questionsOutput.classList.add('hidden');
      metadataFooter.classList.add('hidden');

      try {
        const response = await fetch(`${API_BASE_URL}/ai/questions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'AI compilation failed.');
        }

        // 2. Render Categories
        renderCategoryQuestions('ai-questions-coding', data.technicalCoding);
        renderCategoryQuestions('ai-questions-fundamentals', data.csFundamentals);
        renderCategoryQuestions('ai-questions-hr', data.hr);

        // 3. Update Engine Meta Details
        if (engineSource) {
          engineSource.textContent = data.source || 'PrepPilot Engine';
        }

        // 4. Reveal Console Output
        loadingSpinner.classList.add('hidden');
        questionsOutput.classList.remove('hidden');
        metadataFooter.classList.remove('hidden');

      } catch (error) {
        console.error('[AI Generation Error]:', error);
        showDashboardToast('Error communicating with AI mock engine.', 'danger');
        loadingSpinner.classList.add('hidden');
      } finally {
        // Restore button activation
        btnGenerate.disabled = false;
        btnGenerate.querySelector('span').textContent = 'Regenerate Questions';
      }
    });
  }
});

/**
 * Utility to map questions inside designated categories
 */
function renderCategoryQuestions(containerId, questions) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (!questions || questions.length === 0) {
    container.innerHTML = `<p class="text-muted text-center py-3">No questions generated.</p>`;
    return;
  }

  container.innerHTML = questions.map(item => {
    return `
      <div class="ai-question-item">
        <span class="ai-question-tag">${escapeHTML(item.topic)}</span>
        <p class="ai-question-text">"${escapeHTML(item.question)}"</p>
        <div class="ai-question-tips">
          <strong>Tip:</strong> ${escapeHTML(item.tips)}
        </div>
      </div>
    `;
  }).join('');
}
