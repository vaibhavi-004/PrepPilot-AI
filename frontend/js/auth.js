/**
 * js/auth.js
 * User Authentication Client Logic
 * 
 * Handles signup submissions, login submissions, storing/removing tokens,
 * and page authorization guards to keep unauthenticated users away from the dashboard.
 */

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');
  const alertBox = document.getElementById('alert-box');
  const btnSubmit = document.getElementById('btn-submit');
  const loader = document.getElementById('loader');

  // --- AUTHORIZATION SECURITY GUARDS ---
  const currentPath = window.location.pathname;
  const token = localStorage.getItem('preppilot_token');

  // Guard 1: Redirect to dashboard if logged-in user visits login or signup
  if (token && (currentPath.includes('login.html') || currentPath.includes('signup.html'))) {
    window.location.href = 'dashboard.html';
    return;
  }

  // Guard 2: Redirect to login if visitor tries accessing protected dashboard without token
  if (!token && currentPath.includes('dashboard.html')) {
    window.location.href = 'login.html';
    return;
  }

  // --- UTILITY DISPLAY METHODS ---
  const showAlert = (message, type) => {
    if (!alertBox) return;
    alertBox.textContent = message;
    alertBox.className = `alert-box ${type}`; // type is 'success' or 'danger'
    alertBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  const setSubmitting = (isSubmitting) => {
    if (!btnSubmit || !loader) return;
    if (isSubmitting) {
      btnSubmit.disabled = true;
      loader.classList.remove('hidden');
      btnSubmit.querySelector('span').textContent = 'Processing...';
    } else {
      btnSubmit.disabled = false;
      loader.classList.add('hidden');
      const label = loginForm ? 'Log In' : 'Create Account';
      btnSubmit.querySelector('span').textContent = label;
    }
  };

  // --- SIGNUP PROCESSOR ---
  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirm-password').value;

      // Validate matching passwords
      if (password !== confirmPassword) {
        showAlert('Passwords do not match.', 'danger');
        return;
      }

      if (password.length < 6) {
        showAlert('Password must be at least 6 characters.', 'danger');
        return;
      }

      setSubmitting(true);
      try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Registration failed.');
        }

        // Save JWT token and profile variables
        localStorage.setItem('preppilot_token', data.token);
        localStorage.setItem('preppilot_user', JSON.stringify({
          id: data._id,
          name: data.name,
          email: data.email
        }));

        showAlert('Account created! Booting dashboard...', 'success');
        
        // Timeout redirect to let user see success message
        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 1200);

      } catch (error) {
        showAlert(error.message, 'danger');
        setSubmitting(false);
      }
    });
  }

  // --- LOGIN PROCESSOR ---
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;

      setSubmitting(true);
      try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Login failed.');
        }

        // Save JWT token and profile details
        localStorage.setItem('preppilot_token', data.token);
        localStorage.setItem('preppilot_user', JSON.stringify({
          id: data._id,
          name: data.name,
          email: data.email
        }));

        showAlert('Access granted. Booting dashboard...', 'success');

        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 1000);

      } catch (error) {
        showAlert(error.message, 'danger');
        setSubmitting(false);
      }
    });
  }

  // --- LOGOUT ROUTINE ---
  const logoutBtn = document.getElementById('btn-logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      // Clear token and user details from localStorage
      localStorage.removeItem('preppilot_token');
      localStorage.removeItem('preppilot_user');
      window.location.href = 'login.html';
    });
  }
});
