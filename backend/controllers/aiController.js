/**
 * controllers/aiController.js
 * AI Interview Preparation Controller
 * 
 * Interacts with the OpenAI API if 'OPENAI_API_KEY' is configured.
 * If the key is missing or the API call fails, it automatically falls back
 * to a diverse set of realistic pre-crafted interview questions.
 */

// A curated library of professional, mock interview questions to serve as a robust fallback.
// This ensures the application is fully functional and impressive even without an API key.
const MOCK_QUESTIONS_LIBRARY = {
  technicalCoding: [
    {
      topic: "Data Structures",
      question: "Explain the difference between a Hash Table and a Binary Search Tree. When would you prefer one over the other?",
      tips: "Hash Tables have average O(1) lookup time but do not maintain order. BSTs have O(log n) lookup but keep elements sorted. Choose based on ordering requirements."
    },
    {
      topic: "Algorithms",
      question: "Given an array of integers, write an algorithm to find the maximum subarray sum (Kadane's Algorithm). What is its time complexity?",
      tips: "Walk through the array keeping track of the current maximum sum ending at each index. Time complexity is O(N) and space complexity is O(1)."
    },
    {
      topic: "Problem Solving",
      question: "How would you design a rate limiter for an API? What data structures would you use to track client request counts within time windows?",
      tips: "You can use a Redis-based sliding window log or token bucket algorithm. Discuss trade-offs in memory usage and accuracy."
    },
    {
      topic: "Data Structures",
      question: "How does a Trie (Prefix Tree) work? Describe how you would use it to build an efficient autocomplete search input.",
      tips: "A Trie is a tree-like structure where nodes represent characters. It is optimal for prefix searches since it avoids comparing against the entire dataset."
    },
    {
      topic: "Algorithms",
      question: "Explain the concept of Dynamic Programming. How does it differ from a simple recursive divide-and-conquer approach?",
      tips: "Dynamic Programming solves subproblems once and stores results (memoization/tabulation) to avoid redundant computation, unlike naive recursion."
    }
  ],
  csFundamentals: [
    {
      topic: "Operating Systems",
      question: "What is the difference between a Process and a Thread? Explain how context switching works between them.",
      tips: "A process is an executing program with its own memory space. Threads are components of a process sharing the same address space. Context switching threads is cheaper."
    },
    {
      topic: "DBMS",
      question: "What are the ACID properties in a Database Transaction? Provide a concrete example of why concurrency control is needed.",
      tips: "ACID stands for Atomicity, Consistency, Isolation, and Durability. They guarantee database transactions are processed reliably, avoiding issues like double-spending."
    },
    {
      topic: "Computer Networks",
      question: "Describe what happens step-by-step when you type 'https://www.google.com' into your browser address bar and press Enter.",
      tips: "Cover DNS lookup, TCP 3-way handshake, TLS handshake, HTTP GET request, server rendering, response status codes, and browser DOM rendering."
    },
    {
      topic: "Object Oriented Programming",
      question: "Explain the four pillars of OOP (Encapsulation, Inheritance, Polymorphism, Abstraction) and give a brief real-world coding example of Polymorphism.",
      tips: "Polymorphism allows objects of different classes to be treated as objects of a common superclass, such as a base class 'Shape' with a method 'draw()'."
    }
  ],
  hr: [
    {
      topic: "Behavioral / Tell me about yourself",
      question: "Walk me through your resume. What got you interested in software engineering, and what is a project you are most proud of?",
      tips: "Use the Present-Past-Future formula. Talk about your current status, past project milestones, and why you are excited about this specific role."
    },
    {
      topic: "Strengths and weaknesses",
      question: "What do you consider your greatest professional strength and your biggest technical weakness? What steps are you taking to address the weakness?",
      tips: "Be honest about a real weakness (e.g., public speaking or deep-diving too early in tasks) but show a proactive strategy for self-improvement."
    },
    {
      topic: "Leadership / Conflict resolution",
      question: "Tell me about a time you had a disagreement with a team member on a technical approach. How did you resolve it?",
      tips: "Use the STAR method (Situation, Task, Action, Result). Focus on collaboration, objective testing/data, and professional alignment."
    },
    {
      topic: "Teamwork",
      question: "Describe a situation where a project deadline was at risk. How did you coordinate with your teammates to deliver on time?",
      tips: "Highlight communication, scoping adjustments, transparent updates to stakeholders, and pulling together to support struggling peers."
    }
  ]
};

/**
 * Helper function to randomly select N questions from a list
 */
const getRandomQuestions = (questionsArray, count) => {
  const shuffled = [...questionsArray].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

/**
 * @desc    Generate AI or Mock interview questions across 3 key pillars
 * @route   POST /api/ai/questions
 * @access  Private
 */
const generateQuestions = async (req, res) => {
  const apiKey = process.env.OPENAI_API_KEY;

  // If no OpenAI API key is configured, instantly serve randomized mock questions
  if (!apiKey || apiKey.trim() === '') {
    console.log('OpenAI API Key not configured. Serving realistic mock questions.');
    const response = {
      technicalCoding: getRandomQuestions(MOCK_QUESTIONS_LIBRARY.technicalCoding, 2),
      csFundamentals: getRandomQuestions(MOCK_QUESTIONS_LIBRARY.csFundamentals, 2),
      hr: getRandomQuestions(MOCK_QUESTIONS_LIBRARY.hr, 2),
      source: "PrepPilot Mock Engine (Local Fallback)"
    };
    return res.json(response);
  }

  try {
    console.log('Attempting to call OpenAI API for dynamic questions...');
    
    // Construct the prompt demanding JSON matching our schema
    const prompt = `
      You are an elite interviewer. Generate a fresh, professional set of 6 interview questions for a software engineer candidate.
      
      You MUST organize the questions into exactly three categories, with exactly two questions per category:
      1. "technicalCoding": 
         - Must cover topics like Data Structures, Algorithms, or Problem Solving.
      2. "csFundamentals": 
         - Must cover Operating Systems, DBMS, Computer Networks, or Object Oriented Programming.
      3. "hr": 
         - Must cover Behavioral topics like Tell me about yourself, Strengths/Weaknesses, Leadership, Teamwork, or Conflict Resolution.

      For each question, provide:
      - "topic": The sub-topic (e.g. "DBMS", "Algorithms", "Conflict resolution")
      - "question": A clear, thought-provoking interview question.
      - "tips": A brief 1-2 sentence tip on what a candidate should emphasize in their answer.

      Format the response strictly as a single JSON object. Do not include markdown code block syntax (like \`\`\`json) or any conversational text around the JSON.
      JSON structure:
      {
        "technicalCoding": [
          { "topic": "...", "question": "...", "tips": "..." },
          { "topic": "...", "question": "...", "tips": "..." }
        ],
        "csFundamentals": [
          { "topic": "...", "question": "...", "tips": "..." },
          { "topic": "...", "question": "...", "tips": "..." }
        ],
        "hr": [
          { "topic": "...", "question": "...", "tips": "..." },
          { "topic": "...", "question": "...", "tips": "..." }
        ]
      }
    `;

    // Make the direct network request to OpenAI using native fetch
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo', // Cost-effective, fast, and reliable model
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.8 // Slightly higher temperature for freshness/diversity
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API responded with status ${response.status}`);
    }

    const data = await response.json();
    let textResponse = data.choices[0].message.content.trim();

    // Sometimes models wrap responses in ```json or ``` blocks. Let's clean it up if so.
    if (textResponse.startsWith('```')) {
      textResponse = textResponse.replace(/^```json/, '').replace(/^```/, '').replace(/```$/, '').trim();
    }

    // Parse the JSON payload
    const parsedQuestions = JSON.parse(textResponse);
    parsedQuestions.source = "PrepPilot AI Engine (GPT-3.5)";

    return res.json(parsedQuestions);

  } catch (error) {
    console.error('OpenAI Error, falling back to mock questions:', error.message);
    
    // If anything fails (network timeout, rate limits, invalid key), fallback to mocks gracefully
    const response = {
      technicalCoding: getRandomQuestions(MOCK_QUESTIONS_LIBRARY.technicalCoding, 2),
      csFundamentals: getRandomQuestions(MOCK_QUESTIONS_LIBRARY.csFundamentals, 2),
      hr: getRandomQuestions(MOCK_QUESTIONS_LIBRARY.hr, 2),
      source: "PrepPilot Mock Engine (API Fallback)"
    };
    return res.json(response);
  }
};

module.exports = {
  generateQuestions
};
