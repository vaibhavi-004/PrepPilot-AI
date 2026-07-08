// /**
//  * js/config.js
//  * Frontend Configuration File
//  * 
//  * Dynamically resolves the backend API Base URL based on where the app is running.
//  * This makes the codebase immediately portable between local development and cloud hosting
//  * (like Render for backend and Vercel for frontend) without changing hardcoded endpoints!
//  */

// // If running locally or served by Node, window.location.origin is the backend.
// // Otherwise, configure a fallback to your production server URL.
// const getAPIBaseUrl = () => {
//   const localBackendPort = '5000';
  
//   // If served directly by the backend (e.g. Render/Express static serving)
//   if (window.location.port === localBackendPort || window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
//     return `${window.location.origin}/api`;
//   }
  
//   // If running on a standalone local frontend port (like a VS Code Live Server on port 5500)
//   return `http://localhost:${localBackendPort}/api`;
// };

// const API_BASE_URL = getAPIBaseUrl();
// console.log(`[PrepPilot Config] API Base URL resolved to: ${API_BASE_URL}`);

/**
 * js/config.js
 * API Configuration
 */

const API_BASE_URL =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "http://localhost:5000/api"
    : "/api";

console.log(`[PrepPilot Config] API Base URL: ${API_BASE_URL}`);
