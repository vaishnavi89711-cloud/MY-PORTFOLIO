// ==========================================================================
// PIXEL ART PORTFOLIO - CORE SCRIPTS
// Navigation, Night Mode Toggle, Scrollspy & Accessibility
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
    initVerticalNavigation();
    initScrollspy();
    initThemeToggle();
    initSkillsFilter();
    initProjectModal();
    initAIChat();
    initContactForm();
    initDynamicYear();
});

/**
 * Handles Mobile Drawer Navigation (Open, Close, Backdrop, Keyboard trap/Escape)
 */
function initVerticalNavigation() {
    const sidebar = document.getElementById("vertical-navbar");
    const mobileToggle = document.getElementById("mobile-nav-toggle");
    const closeBtn = document.getElementById("mobile-close-btn");
    const backdrop = document.getElementById("sidebar-backdrop");
    const sidebarLinks = document.querySelectorAll(".sidebar-link");

    if (!sidebar || !mobileToggle) return;

    function openSidebar() {
        sidebar.classList.add("open");
        if (backdrop) backdrop.classList.add("active");
        document.body.classList.add("sidebar-open");
        mobileToggle.setAttribute("aria-expanded", "true");
        // Focus first navigation link or close button for keyboard accessibility
        if (closeBtn) closeBtn.focus();
    }

    function closeSidebar() {
        sidebar.classList.remove("open");
        if (backdrop) backdrop.classList.remove("active");
        document.body.classList.remove("sidebar-open");
        mobileToggle.setAttribute("aria-expanded", "false");
    }

    // Toggle button click
    mobileToggle.addEventListener("click", () => {
        const isOpen = sidebar.classList.contains("open");
        if (isOpen) {
            closeSidebar();
        } else {
            openSidebar();
        }
    });

    // Close button click
    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            closeSidebar();
            mobileToggle.focus();
        });
    }

    // Backdrop click
    if (backdrop) {
        backdrop.addEventListener("click", () => {
            closeSidebar();
        });
    }

    // Escape key to close mobile drawer
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && sidebar.classList.contains("open")) {
            closeSidebar();
            mobileToggle.focus();
        }
    });

    // Auto-close drawer on mobile when any navigation link is clicked
    sidebarLinks.forEach((link) => {
        link.addEventListener("click", () => {
            if (window.innerWidth <= 992 && sidebar.classList.contains("open")) {
                closeSidebar();
            }
        });
    });
}

/**
 * Scrollspy: Highlights active link in the vertical navbar as sections scroll into view
 */
function initScrollspy() {
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".sidebar-link");

    if (!sections.length || !navLinks.length) return;

    function updateActiveNav() {
        let currentSectionId = "";
        const scrollPosition = window.scrollY + 200;

        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute("id");
            }
        });

        // Fallback for top of page
        if (window.scrollY < 150) {
            currentSectionId = "hero";
        }

        // Fallback for very bottom of page (e.g. contact section)
        if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 50)) {
            const lastSection = sections[sections.length - 1];
            if (lastSection) currentSectionId = lastSection.getAttribute("id");
        }

        if (currentSectionId) {
            navLinks.forEach((link) => {
                const target = link.getAttribute("href") ? link.getAttribute("href").replace("#", "") : "";
                if (target === currentSectionId) {
                    link.classList.add("active");
                    link.setAttribute("aria-current", "page");
                } else {
                    link.classList.remove("active");
                    link.removeAttribute("aria-current");
                }
            });
        }
    }

    window.addEventListener("scroll", updateActiveNav, { passive: true });
    updateActiveNav();
}

/**
 * Initializes Theme Toggle with System Media Query detection
 */
function initThemeToggle() {
    const themeToggleBtn = document.getElementById("theme-toggle");
    if (!themeToggleBtn) return;

    // Media query to check browser's default color scheme
    const prefersDarkMedia = window.matchMedia("(prefers-color-scheme: dark)");

    // Retrieve saved user choice from localStorage
    const savedTheme = localStorage.getItem("portfolio-theme");

    if (savedTheme) {
        document.documentElement.setAttribute("data-theme", savedTheme);
        themeToggleBtn.setAttribute("aria-pressed", savedTheme === "dark" ? "true" : "false");
    } else {
        // No manual choice saved: system media query automatically applies via CSS!
        const systemIsDark = prefersDarkMedia.matches;
        themeToggleBtn.setAttribute("aria-pressed", systemIsDark ? "true" : "false");
    }

    // Toggle button click listener
    themeToggleBtn.addEventListener("click", () => {
        const currentDataTheme = document.documentElement.getAttribute("data-theme");
        
        let newTheme;
        if (currentDataTheme) {
            newTheme = currentDataTheme === "dark" ? "light" : "dark";
        } else {
            // If unset, invert current media query state
            newTheme = prefersDarkMedia.matches ? "light" : "dark";
        }

        // Apply new theme
        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("portfolio-theme", newTheme);
        themeToggleBtn.setAttribute("aria-pressed", newTheme === "dark" ? "true" : "false");
    });

    // Listen for real-time changes to the OS / browser color scheme
    prefersDarkMedia.addEventListener("change", (e) => {
        // Only update if the user has NOT manually set an override in this session
        if (!localStorage.getItem("portfolio-theme")) {
            themeToggleBtn.setAttribute("aria-pressed", e.matches ? "true" : "false");
        }
    });
}

/**
 * Automatically updates current year in the footer
 */
function initDynamicYear() {
    const yearSpan = document.getElementById("current-year");
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}

/**
 * Handles Interactive Skills Category Filtering & Progress Animation
 */
function initSkillsFilter() {
    const filterButtons = document.querySelectorAll(".filter-btn");
    const categoryCards = document.querySelectorAll(".skill-category-card");

    if (!filterButtons.length || !categoryCards.length) return;

    filterButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            const filterValue = btn.getAttribute("data-filter");

            // Update button active state
            filterButtons.forEach((b) => {
                b.classList.remove("active");
                b.setAttribute("aria-selected", "false");
            });
            btn.classList.add("active");
            btn.setAttribute("aria-selected", "true");

            // Filter cards with smooth fade
            categoryCards.forEach((card) => {
                const category = card.getAttribute("data-category");
                if (filterValue === "all" || category === filterValue) {
                    card.classList.remove("hidden");
                    card.style.opacity = "0";
                    card.style.transform = "translateY(10px)";
                    setTimeout(() => {
                        card.style.opacity = "1";
                        card.style.transform = "translateY(0)";
                    }, 20);
                } else {
                    card.classList.add("hidden");
                }
            });
        });
    });

    // Animate progress bars into place when skills section enters viewport
    const progressFills = document.querySelectorAll(".pixel-progress-fill");
    if ("IntersectionObserver" in window && progressFills.length) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    progressFills.forEach((fill) => {
                        const targetWidth = fill.style.width;
                        fill.style.width = "0%";
                        setTimeout(() => {
                            fill.style.width = targetWidth;
                        }, 50);
                    });
                    observer.disconnect();
                }
            });
        }, { threshold: 0.15 });

        const skillsSection = document.getElementById("skills");
        if (skillsSection) observer.observe(skillsSection);
    }
}

// ==========================================================================
// PROJECT DATA STORE & MODAL CONNECTION LOGIC
// EXPLANATION OF THUMBNAIL-TO-DETAIL CONNECTION:
// 1. Each project thumbnail in index.html is tagged with `data-project-id`
//    (e.g., 'project-ide', 'project-cloud', 'project-ai', 'project-crypto').
// 2. When a user clicks either the project thumbnail wrapper or the
//    "Details" button, this script intercepts the event and extracts the id.
// 3. The script queries the PROJECTS_DATA dictionary below to retrieve the
//    matching detailed architectural report, metrics, and repository links.
// 4. It dynamically injects this content into the accessible modal dialog
//    (#project-modal) and opens it with an animated, focus-trapped overlay.
// ==========================================================================

const PROJECTS_DATA = {
    "project-ide": {
        title: "Neon Cloud IDE",
        tagline: "Browser-based Collaborative IDE & Containerized Cloud Runtime",
        category: "FULL-STACK // DEVELOPER TOOL",
        img: "project_ide.jpg",
        alt: "Neon Cloud IDE interface preview showing syntax highlighting and terminal",
        problem: "Developers frequently suffer from local machine configuration drift, high collaboration friction when reviewing complex code together, and the overhead of maintaining disparate development environments.",
        solution: "Constructed an in-browser cloud workspace leveraging Monaco editor, WebSockets for sub-25ms collaborative state synchronization via Operational Transformation, and warm Docker containers for instant bash terminals.",
        metrics: [
            "Sub-25ms collaborative keystroke state sync using Operational Transformation (OT)",
            "Instant containerized sandbox spin-up in <800ms via Docker warm container pools",
            "Full language syntax highlighting, auto-completion, and error diagnostics across 20+ languages",
            "Integrated terminal supporting Node.js, Python, and Git CLI workflows directly in the browser"
        ],
        tech: ["React.js", "Node.js", "WebSockets", "Docker", "Monaco Editor", "Express", "Tailwind CSS"],
        demo: "#projects",
        github: "https://github.com"
    },
    "project-cloud": {
        title: "ByteStream Cloud Mesh",
        tagline: "High-Throughput Distributed Microservices Network & Event Telemetry",
        category: "DISTRIBUTED // CLOUD ARCHITECTURE",
        img: "project_cloud.jpg",
        alt: "Isometric diagram of distributed cloud microservices network clusters",
        problem: "Monolithic backends struggle with unpredictable traffic spikes, cascading network timeouts, and lack of visibility into inter-service latency bottlenecks across microservice boundaries.",
        solution: "Architected a resilient distributed service mesh featuring automated circuit breaking, non-blocking asynchronous event streams via Redis, and distributed packet telemetry across server clusters.",
        metrics: [
            "Benchmarked at 100,000+ RPC requests per second under peak distributed stress load",
            "Automated circuit breaker tripped and gracefully rerouted traffic in under 5ms during simulated node failovers",
            "Distributed tracing overhead reduced to less than 1.8% CPU footprint with selective sampling",
            "Zero data loss achieved with idempotent transactional outbox messaging patterns"
        ],
        tech: ["Go", "Python", "gRPC", "Redis Streams", "PostgreSQL", "Docker", "AWS ECS", "Prometheus"],
        demo: "#projects",
        github: "https://github.com"
    },
    "project-ai": {
        title: "CyberBrain AI Telemetry",
        tagline: "Neural Model Observability, Inference Profiling & Data Intelligence",
        category: "AI // MACHINE LEARNING SYSTEMS",
        img: "project_ai.jpg",
        alt: "AI Neural Network dashboard preview with cybernetic brain diagram and metric graphs",
        problem: "Deploying machine learning models in production frequently conceals silent accuracy degradation, token embedding hallucinations, and unaccounted GPU/VRAM memory saturation.",
        solution: "Constructed an automated telemetry engine that intercepts live model inferences, tracks token embeddings drift in real time, and exposes a retro cyberpunk observation dashboard with automated webhook alerts.",
        metrics: [
            "Continuous latency telemetry capturing p95 and p99 inference timings with millisecond accuracy",
            "Real-time token drift analysis processing 500+ inferences/second with minimal overhead",
            "Hardware telemetry profiling GPU memory, CPU saturation, and VRAM efficiency in real time",
            "Automated Discord & Slack webhook alert triggers when drift thresholds exceed 5%"
        ],
        tech: ["Python", "FastAPI", "PyTorch", "React", "Chart.js", "Docker", "Vector DB"],
        demo: "#projects",
        github: "https://github.com"
    },
    "project-crypto": {
        title: "PixelTrade Market Terminal",
        tagline: "Low-Latency Algorithmic Trading Station & Financial Backtesting Engine",
        category: "FINTECH // ALGORITHMIC SYSTEMS",
        img: "project_crypto.jpg",
        alt: "Pixel trading terminal preview with candlestick charts and order book",
        problem: "Retail traders and algorithmic engineers require low-latency order execution, real-time depth-of-book updates, and historical scenario backtesting without expensive institutional terminal costs.",
        solution: "Engineered an arcade-inspired financial trading simulator streaming tick-level order books over binary WebSockets, matching limit/market orders with sub-millisecond precision, and providing backtesting algorithms.",
        metrics: [
            "Tick-by-tick order book matching engine operating at sub-millisecond execution speeds",
            "Streaming market updates over binary WebSockets supporting 50+ tickers concurrently",
            "Historical replay backtester evaluating 1,000,000+ historical bars in under 3 seconds",
            "Strict financial audit ledger enforcing double-entry bookkeeping and balance verification"
        ],
        tech: ["TypeScript", "Next.js", "WebSockets", "PostgreSQL", "Tailwind CSS", "Redis"],
        demo: "#projects",
        github: "https://github.com"
    }
};

/**
 * Initializes Project Thumbnail Click Handlers & Detailed Modal View
 */
function initProjectModal() {
    const modal = document.getElementById("project-modal");
    if (!modal) return;

    const closeBtn = document.getElementById("modal-close-btn");
    const dismissBtn = document.getElementById("modal-dismiss-btn");

    // Modal DOM Elements
    const modalTitle = document.getElementById("modal-project-title");
    const modalTagline = document.getElementById("modal-project-tagline");
    const modalCategory = document.getElementById("modal-project-category");
    const modalImg = document.getElementById("modal-project-img");
    const modalProblem = document.getElementById("modal-project-problem");
    const modalSolution = document.getElementById("modal-project-solution");
    const modalMetrics = document.getElementById("modal-project-metrics");
    const modalTech = document.getElementById("modal-project-tech");
    const modalDemo = document.getElementById("modal-demo-link");
    const modalGithub = document.getElementById("modal-github-link");

    let lastFocusedElement = null;

    /**
     * Opens and populates the Project Detail Modal based on the projectId
     */
    function openProjectModal(projectId, triggerElement) {
        const project = PROJECTS_DATA[projectId];
        if (!project) return;

        lastFocusedElement = triggerElement;

        // Populate modal data
        modalTitle.textContent = project.title;
        modalTagline.textContent = project.tagline;
        modalCategory.textContent = project.category;
        modalImg.src = project.img;
        modalImg.alt = project.alt;
        modalProblem.textContent = project.problem;
        modalSolution.textContent = project.solution;

        // Populate metrics list
        modalMetrics.innerHTML = "";
        project.metrics.forEach((metric) => {
            const li = document.createElement("li");
            li.textContent = metric;
            modalMetrics.appendChild(li);
        });

        // Populate tech stack badges
        modalTech.innerHTML = "";
        project.tech.forEach((tech) => {
            const span = document.createElement("span");
            span.className = "tech-pill";
            span.textContent = tech;
            modalTech.appendChild(span);
        });

        // Update action links
        modalDemo.href = project.demo;
        modalGithub.href = project.github;

        // Open modal and lock body scroll
        modal.classList.add("open");
        modal.setAttribute("aria-hidden", "false");
        document.body.classList.add("modal-open");

        // Focus close button for accessibility
        if (closeBtn) closeBtn.focus();
    }

    /**
     * Closes the Project Detail Modal and restores focus
     */
    function closeProjectModal() {
        modal.classList.remove("open");
        modal.setAttribute("aria-hidden", "true");
        document.body.classList.remove("modal-open");

        if (lastFocusedElement) {
            lastFocusedElement.focus();
        }
    }

    // 1. Connect clickable thumbnails to project details
    const thumbnailWrappers = document.querySelectorAll(".project-thumbnail-wrapper");
    thumbnailWrappers.forEach((thumb) => {
        const card = thumb.closest(".project-card");
        const projectId = card ? card.getAttribute("data-project-id") : null;

        if (projectId) {
            // Click listener
            thumb.addEventListener("click", () => {
                openProjectModal(projectId, thumb);
            });

            // Keyboard accessibility (Enter or Space)
            thumb.addEventListener("keydown", (e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openProjectModal(projectId, thumb);
                }
            });
        }
    });

    // 2. Connect "Details" inspect buttons to project details
    const inspectButtons = document.querySelectorAll(".btn-inspect");
    inspectButtons.forEach((btn) => {
        const projectId = btn.getAttribute("data-project-target");
        if (projectId) {
            btn.addEventListener("click", () => {
                openProjectModal(projectId, btn);
            });
        }
    });

    // Close on Close button and Dismiss button
    if (closeBtn) closeBtn.addEventListener("click", closeProjectModal);
    if (dismissBtn) dismissBtn.addEventListener("click", closeProjectModal);

    // Close on clicking backdrop outside container
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            closeProjectModal();
        }
    });

    // Close on Escape key
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains("open")) {
            closeProjectModal();
        }
    });
}

// ==========================================================================
// AI CHATBOT TERMINAL INTERACTION LOGIC
// Simulates interactive conversations with an AI persona of Vaishnavi.
// ==========================================================================

/**
 * ==========================================================================
 * FUTURE API INTEGRATION GUIDE (e.g. OpenAI GPT-4o / Claude / Custom Backend)
 * ==========================================================================
 * Currently, this interface uses a client-side simulated response engine
 * (`getSimulatedAIResponse()`) to provide fast, reliable responses without
 * incurring API costs or requiring server credentials.
 *
 * TO INTEGRATE A REAL AI API (LIKE OPENAI):
 * --------------------------------------------------------------------------
 * 1. BACKEND PROXY (CRITICAL FOR SECURITY):
 *    Never expose your private API key (`sk-...`) in client-side JavaScript.
 *    Create a server-side route (e.g., in Node.js/Express, Next.js /api/chat,
 *    or Python/FastAPI) that securely holds the OPENAI_API_KEY environment
 *    variable and calls OpenAI's Chat Completions endpoint:
 *
 * 2. INTEGRATION FUNCTION EXAMPLE:
 *    async function fetchOpenAIResponse(userPrompt, conversationHistory) {
 *        const response = await fetch("/api/chat", {
 *            method: "POST",
 *            headers: { "Content-Type": "application/json" },
 *            body: JSON.stringify({
 *                model: "gpt-4o",
 *                systemPrompt: "You are Vaishnavi.AI, a friendly retro 8-bit software engineer persona...",
 *                messages: [
 *                    ...conversationHistory,
 *                    { role: "user", content: userPrompt }
 *                ]
 *            })
 *        });
 *        const data = await response.json();
 *        return data.reply;
 *    }
 *
 * 3. WHERE TO HOOK IN:
 *    In handleUserMessage(), swap out the call to `getSimulatedAIResponse(cleanText)`
 *    with `await fetchOpenAIResponse(cleanText, chatHistory)` inside an async block!
 * ==========================================================================
 */

function initAIChat() {
    const chatForm = document.getElementById("chat-form");
    const chatInput = document.getElementById("chat-input");
    const chatMessages = document.getElementById("chat-messages");
    const typingIndicator = document.getElementById("chat-typing-indicator");
    const clearBtn = document.getElementById("chat-clear-btn");
    const suggestionChips = document.querySelectorAll(".chat-suggestion-chip");

    if (!chatForm || !chatInput || !chatMessages) return;

    let isProcessing = false;
    let messageCounter = 0;

    // Helper: format current local time (e.g. "12:54 PM")
    function getFormattedTime() {
        const now = new Date();
        return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }

    // Helper: safely escape HTML characters
    function escapeHTML(str) {
        return str
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // Helper: format markdown-style bold and code tags for rich AI output
    function formatMessageText(text) {
        let formatted = escapeHTML(text);
        // Replace **bold** with <strong>bold</strong>
        formatted = formatted.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
        // Replace `code` with <code>code</code>
        formatted = formatted.replace(/`([^`]+)`/g, "<code class='tech-pill'>$1</code>");
        // Convert newlines to breaks
        formatted = formatted.replace(/\n/g, "<br>");
        return formatted;
    }

    // Appends a new message row to the chat display area
    function appendMessage(sender, text, timestamp) {
        const row = document.createElement("div");
        row.className = `chat-message-row ${sender === "ai" ? "msg-ai" : "msg-user"}`;
        row.id = `msg-${++messageCounter}`;

        const isAI = sender === "ai";
        const avatarSrc = isAI ? "pixel_avatar.jpg" : "";
        const roleLabel = isAI ? "AI" : "YOU";
        const senderName = isAI ? "Vaishnavi.AI" : "Visitor (Player 2)";
        const timeStr = timestamp || getFormattedTime();

        row.innerHTML = `
            <div class="msg-avatar-wrapper">
                ${isAI 
                    ? `<img src="${avatarSrc}" alt="${senderName} Avatar" class="msg-avatar-img">` 
                    : `<div class="msg-avatar-img user-avatar-icon" style="background:#1e293b;display:flex;align-items:center;justify-content:center;font-size:1.1rem;color:#38bdf8;" aria-hidden="true">&#128100;</div>`
                }
                <span class="avatar-role-tag">${roleLabel}</span>
            </div>
            <div class="msg-bubble-container">
                <div class="msg-meta-row">
                    <span class="msg-sender-name">${senderName}</span>
                    <span class="msg-timestamp">${timeStr}</span>
                </div>
                <div class="msg-bubble pixel-box">
                    <p>${formatMessageText(text)}</p>
                </div>
            </div>
        `;

        // Insert before typing indicator
        if (typingIndicator && typingIndicator.parentNode === chatMessages) {
            chatMessages.insertBefore(row, typingIndicator);
        } else {
            chatMessages.appendChild(row);
        }

        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Shows/hides simulated AI typing indicator
    function setTyping(isTyping) {
        if (!typingIndicator) return;
        if (isTyping) {
            typingIndicator.style.display = "flex";
            chatMessages.appendChild(typingIndicator); // Ensure it is at the bottom
            chatMessages.scrollTop = chatMessages.scrollHeight;
        } else {
            typingIndicator.style.display = "none";
        }
    }

    /**
     * Simulated Knowledge Base Response Generator
     * Provides conversational responses matching Vaishnavi's portfolio profile.
     */
    function getSimulatedAIResponse(query) {
        const q = query.toLowerCase();

        // 1. Identity & Introduction
        if (q.includes("about") || q.includes("who are you") || q.includes("yourself") || q.includes("introduce") || q.includes("background")) {
            return "I am **Vaishnavi**, a Software Engineer specializing in full-stack web applications, distributed systems, and cloud infrastructure. I hold an 8-bit passion for building scalable, high-performance web products with clean code, modern UX, and resilient architectures!";
        }

        // 2. Neon Cloud IDE Project
        if (q.includes("neon") || q.includes("ide") || q.includes("editor")) {
            return "The **Neon Cloud IDE** is one of my standout projects! It is a browser-based collaborative developer environment built with `React`, `Node.js`, `WebSockets`, and `Monaco Editor`. It supports sub-25ms state sync via Operational Transformation (OT) and instant containerized bash terminals in <800ms using Docker warm pools!";
        }

        // 3. ByteStream Cloud Mesh Project
        if (q.includes("mesh") || q.includes("bytestream") || q.includes("cloud") || q.includes("distributed") || q.includes("microservice")) {
            return "**ByteStream Cloud Mesh** is an isometric microservices engine and service mesh designed in `Go` and `Python`. It is benchmarked to handle **100,000+ RPC requests/second** with automatic circuit breaking (<5ms rerouting) and Redis stream telemetry!";
        }

        // 4. CyberBrain AI Project
        if (q.includes("ai") || q.includes("cyberbrain") || q.includes("neural") || q.includes("machine learning") || q.includes("pytorch")) {
            return "**CyberBrain AI Telemetry** is an ML observability dashboard built with `FastAPI` and `PyTorch`. It captures p95/p99 inference latencies, tracks real-time token embedding drift, and triggers automated alerts if drift exceeds 5%!";
        }

        // 5. PixelTrade Financial Terminal
        if (q.includes("trade") || q.includes("crypto") || q.includes("pixeltrade") || q.includes("market") || q.includes("finance")) {
            return "**PixelTrade Market Terminal** is a low-latency financial simulator built with `TypeScript`, `Next.js`, and binary `WebSockets`. It features tick-by-tick order book matching at sub-millisecond speeds and a historical replay backtesting engine evaluating 1M+ bars in <3 seconds!";
        }

        // 6. Projects General
        if (q.includes("project") || q.includes("built") || q.includes("portfolio") || q.includes("work")) {
            return "My portfolio highlights 4 core builds: \n1. **Neon Cloud IDE** (In-browser collaborative coding workspace)\n2. **ByteStream Cloud Mesh** (Distributed microservices broker)\n3. **CyberBrain AI Telemetry** (ML model observation console)\n4. **PixelTrade Terminal** (Algorithmic financial trading engine)\n\nYou can click on any thumbnail in the **Projects** section above to inspect detailed architectural reports!";
        }

        // 7. Tech Stack & Skills
        if (q.includes("skill") || q.includes("stack") || q.includes("tech") || q.includes("language") || q.includes("tool") || q.includes("framework")) {
            return "My core ability tree spans:\n• **Languages**: JavaScript (ES6+), TypeScript, Python, Java, SQL, C/C++\n• **Frontend**: React.js, Next.js, Modern CSS3, Tailwind\n• **Backend & Cloud**: Node.js, Express, FastAPI, Go, Docker, PostgreSQL, Redis, AWS\n• **DevOps & Testing**: Git, CI/CD, Jest, Postman, Linux\n\nCheck out the interactive **Skills** ability tree on this page for my proficiency levels!";
        }

        // 8. Experience, Education & Timeline
        if (q.includes("experience") || q.includes("education") || q.includes("college") || q.includes("university") || q.includes("timeline") || q.includes("degree") || q.includes("career")) {
            return "I hold a **B.Tech in Computer Science & Engineering** (CGPA: 8.8/10). My journey includes serving as Full-Stack Engineering Fellow, cloud backend architect on distributed systems, and open-source contributor. You can explore the full journey in the **Timeline** quest log above!";
        }

        // 9. Hiring, Contact & Availability
        if (q.includes("hire") || q.includes("contact") || q.includes("email") || q.includes("job") || q.includes("resume") || q.includes("collaborat") || q.includes("opportunity")) {
            return "I am actively open to software engineering opportunities and impactful collaborations! You can reach me directly via the **Contact** section at the bottom of the page, or check out my repositories on GitHub. Let's build something awesome together! 🚀";
        }

        // 10. Greetings
        if (q.includes("hi") || q.includes("hello") || q.includes("hey") || q.includes("greetings") || q.includes("sup")) {
            return "Hello there! Glad you stopped by the Tavern. Feel free to ask about my projects, programming skills, architecture experience, or how we can collaborate!";
        }

        // 11. Hobbies & Fun
        if (q.includes("hobby") || q.includes("game") || q.includes("pixel") || q.includes("fun") || q.includes("interest")) {
            return "Outside of coding, I love retro pixel art game design, exploring lo-fi chiptune sound design, solving algorithmic puzzles, and mechanical keyboards with clicky switches! 🎮";
        }

        // 12. Fallback / Default response
        return "That's an interesting question! While I am currently running on Vaishnavi's local neural rule engine, I know all about her software engineering projects, tech stack, and background.\n\nTry asking me:\n• *'What is your core tech stack?'*\n• *'Tell me about the Neon Cloud IDE'* \n• *'How can I contact or hire you?'*";
    }

    // Handles user submission
    async function handleUserMessage(userText) {
        if (!userText || isProcessing) return;

        const cleanText = userText.trim();
        if (!cleanText) return;

        isProcessing = true;
        chatInput.value = "";
        chatInput.disabled = true;

        // 1. Render User Message
        appendMessage("user", cleanText);

        // 2. Show Typing Indicator
        setTyping(true);

        /* 
         * ==================================================================
         * OPENAI / BACKEND API HOOK POINT
         * ==================================================================
         * If you wish to connect this to OpenAI's API:
         * 
         * try {
         *     const response = await fetch("/api/chat", {
         *         method: "POST",
         *         headers: { "Content-Type": "application/json" },
         *         body: JSON.stringify({ message: cleanText })
         *     });
         *     const data = await response.json();
         *     aiReply = data.reply;
         * } catch (error) {
         *     console.error("OpenAI API call failed:", error);
         *     aiReply = "Sorry, my neural uplink encountered an error. Please try again!";
         * }
         * ==================================================================
         */

        // 3. Simulate realistic AI computing delay (750ms - 1100ms)
        const delay = Math.floor(Math.random() * 350) + 750;
        setTimeout(() => {
            const aiReply = getSimulatedAIResponse(cleanText);
            setTyping(false);
            appendMessage("ai", aiReply);

            isProcessing = false;
            chatInput.disabled = false;
            chatInput.focus();
        }, delay);
    }

    // Form submit listener
    chatForm.addEventListener("submit", (e) => {
        e.preventDefault();
        handleUserMessage(chatInput.value);
    });

    // Suggestion chips listeners
    suggestionChips.forEach((chip) => {
        chip.addEventListener("click", () => {
            const prompt = chip.getAttribute("data-prompt");
            if (prompt) {
                chatInput.value = prompt;
                handleUserMessage(prompt);
            }
        });
    });

    // Reset / Clear chat listener
    if (clearBtn) {
        clearBtn.addEventListener("click", () => {
            // Reset to initial greeting and typing indicator
            chatMessages.innerHTML = `
                <div class="chat-message-row msg-ai">
                    <div class="msg-avatar-wrapper">
                        <img src="pixel_avatar.jpg" alt="AI Vaishnavi Pixel Avatar" class="msg-avatar-img">
                        <span class="avatar-role-tag">AI</span>
                    </div>
                    <div class="msg-bubble-container">
                        <div class="msg-meta-row">
                            <span class="msg-sender-name">Vaishnavi.AI</span>
                            <span class="msg-timestamp">SYSTEM RESET</span>
                        </div>
                        <div class="msg-bubble pixel-box">
                            <p>
                                Console buffer cleared! &#9851; I'm ready for new questions about Vaishnavi's skills, software builds, or contact links. How can I help you today?
                            </p>
                        </div>
                    </div>
                </div>
                <div id="chat-typing-indicator" class="chat-message-row msg-ai typing-indicator" style="display: none;" aria-hidden="true">
                    <div class="msg-avatar-wrapper">
                        <img src="pixel_avatar.jpg" alt="AI Avatar" class="msg-avatar-img">
                        <span class="avatar-role-tag">AI</span>
                    </div>
                    <div class="msg-bubble-container">
                        <div class="msg-meta-row">
                            <span class="msg-sender-name">Vaishnavi.AI</span>
                            <span class="msg-timestamp">COMPUTING...</span>
                        </div>
                        <div class="msg-bubble typing-bubble pixel-box">
                            <span class="typing-dot"></span>
                            <span class="typing-dot"></span>
                            <span class="typing-dot"></span>
                            <span class="typing-text">Formulating response...</span>
                        </div>
                    </div>
                </div>
            `;
            chatInput.value = "";
            chatInput.focus();
        });
    }
}

/**
 * Contact Transmission Console & Form Controller
 * Manages form validation, live character counting, clipboard copying,
 * arcade transmission simulation, and accessible status announcements.
 */
function initContactForm() {
    const contactForm = document.getElementById("contact-form");
    const nameInput = document.getElementById("contact-name");
    const emailInput = document.getElementById("contact-email");
    const subjectSelect = document.getElementById("contact-subject");
    const messageTextarea = document.getElementById("contact-message");
    const charCounter = document.getElementById("contact-char-counter");
    const statusBanner = document.getElementById("contact-status-banner");
    const submitBtn = document.getElementById("contact-submit-btn");
    const resetBtn = document.getElementById("contact-reset-btn");
    const copyEmailBtn = document.getElementById("copy-email-btn");

    const nameError = document.getElementById("name-error");
    const emailError = document.getElementById("email-error");
    const subjectError = document.getElementById("subject-error");
    const messageError = document.getElementById("message-error");

    if (!contactForm) return;

    // Helper: update live character counter
    function updateCharCounter() {
        if (!messageTextarea || !charCounter) return;
        const currentLength = messageTextarea.value.length;
        const maxLength = messageTextarea.getAttribute("maxlength") || 1000;
        charCounter.textContent = `${currentLength} / ${maxLength} CHARS`;

        charCounter.classList.remove("near-limit", "at-limit");
        if (currentLength >= maxLength * 0.95) {
            charCounter.classList.add("at-limit");
        } else if (currentLength >= maxLength * 0.8) {
            charCounter.classList.add("near-limit");
        }
    }

    if (messageTextarea) {
        messageTextarea.addEventListener("input", updateCharCounter);
    }

    // Helper: clear all validation errors
    function clearErrors() {
        [nameInput, emailInput, subjectSelect, messageTextarea].forEach((input) => {
            if (input) input.classList.remove("field-invalid");
        });
        [nameError, emailError, subjectError, messageError].forEach((errEl) => {
            if (errEl) errEl.textContent = "";
        });
    }

    // Helper: show banner
    function showBanner(type, message) {
        if (!statusBanner) return;
        statusBanner.className = "contact-status-banner status-" + type;
        statusBanner.innerHTML = message;
        statusBanner.style.display = "block";
    }

    // Copy Email to Clipboard
    if (copyEmailBtn) {
        copyEmailBtn.addEventListener("click", () => {
            const emailAddress = "vaishnavi.dev@example.com";
            navigator.clipboard.writeText(emailAddress).then(() => {
                const originalHtml = copyEmailBtn.innerHTML;
                copyEmailBtn.innerHTML = '<span aria-hidden="true">&#10003;</span> COPIED!';
                copyEmailBtn.classList.add("pixel-btn-primary");
                copyEmailBtn.classList.remove("pixel-btn-secondary");

                setTimeout(() => {
                    copyEmailBtn.innerHTML = originalHtml;
                    copyEmailBtn.classList.remove("pixel-btn-primary");
                    copyEmailBtn.classList.add("pixel-btn-secondary");
                }, 2200);
            }).catch(() => {
                showBanner("error", "[CLIPBOARD ACCESS RESTRICTED] Manually copy: vaishnavi.dev@example.com");
            });
        });
    }

    // Reset button listener
    if (resetBtn) {
        resetBtn.addEventListener("click", () => {
            contactForm.reset();
            clearErrors();
            updateCharCounter();
            if (statusBanner) {
                statusBanner.style.display = "none";
                statusBanner.textContent = "";
            }
            if (nameInput) nameInput.focus();
        });
    }

    // Live validation error clearing on input
    [nameInput, emailInput, subjectSelect, messageTextarea].forEach((field) => {
        if (field) {
            field.addEventListener("input", () => {
                field.classList.remove("field-invalid");
            });
        }
    });

    // Form submit listener
    contactForm.addEventListener("submit", (e) => {
        e.preventDefault();
        clearErrors();

        let isValid = true;
        let firstInvalidField = null;

        // 1. Validate Name (at least 2 non-whitespace characters)
        const nameVal = nameInput ? nameInput.value.trim() : "";
        if (!nameVal || nameVal.length < 2) {
            isValid = false;
            if (nameInput) nameInput.classList.add("field-invalid");
            if (nameError) nameError.textContent = "⚠ Please provide a valid sender name or codename (min 2 characters).";
            if (!firstInvalidField) firstInvalidField = nameInput;
        }

        // 2. Validate Email (standard pattern)
        const emailVal = emailInput ? emailInput.value.trim() : "";
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        if (!emailVal || !emailPattern.test(emailVal)) {
            isValid = false;
            if (emailInput) emailInput.classList.add("field-invalid");
            if (emailError) emailError.textContent = "⚠ Please provide a valid return frequency address (e.g. name@domain.com).";
            if (!firstInvalidField) firstInvalidField = emailInput;
        }

        // 3. Validate Subject
        const subjectVal = subjectSelect ? subjectSelect.value : "";
        if (!subjectVal) {
            isValid = false;
            if (subjectSelect) subjectSelect.classList.add("field-invalid");
            if (subjectError) subjectError.textContent = "⚠ Please select an objective category for this mission.";
            if (!firstInvalidField) firstInvalidField = subjectSelect;
        }

        // 4. Validate Message (at least 10 non-whitespace characters)
        const messageVal = messageTextarea ? messageTextarea.value.trim() : "";
        if (!messageVal || messageVal.length < 10) {
            isValid = false;
            if (messageTextarea) messageTextarea.classList.add("field-invalid");
            if (messageError) messageError.textContent = "⚠ Mission briefing message must contain at least 10 characters.";
            if (!firstInvalidField) firstInvalidField = messageTextarea;
        }

        if (!isValid) {
            showBanner("error", "<strong>TRANSMISSION REJECTED:</strong> Please resolve the flagged parameters above before transmitting.");
            if (firstInvalidField) firstInvalidField.focus();
            return;
        }

        // Transmission Simulation State
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span aria-hidden="true">&#9203;</span> TRANSMITTING...';
        }

        showBanner("transmitting", `
            <strong>[TRANSMITTING DISPATCH]</strong> Encrypting packet with AES-256 and dispatching to personal relay...
        `);

        // Simulate network relay dispatch
        setTimeout(() => {
            showBanner("success", `
                <strong>[STATUS 200: TRANSMISSION DELIVERED]</strong><br>
                Thank you, <strong>${escapeHtml(nameVal)}</strong>! Your dispatch regarding <em>&quot;${escapeHtml(subjectVal)}&quot;</em> has been logged in Vaishnavi's inbox. An encrypted response will be dispatched within 24 hours.
            `);

            // Reset form controls
            contactForm.reset();
            updateCharCounter();

            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<span aria-hidden="true">&#9654;</span> TRANSMIT DISPATCH';
            }

            // Scroll status banner into view
            if (statusBanner) {
                statusBanner.scrollIntoView({ behavior: "smooth", block: "nearest" });
            }
        }, 1200);
    });

    // Helper: basic HTML sanitizer for template string insertion
    function escapeHtml(str) {
        if (!str) return "";
        return str
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
    }
}


