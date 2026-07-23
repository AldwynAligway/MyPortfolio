// Wait for the DOM (HTML elements) to fully load before running scripts
document.addEventListener("DOMContentLoaded", () => {
  // Add this inside document.addEventListener("DOMContentLoaded", () => { ... })

const dynamicText = document.getElementById("dynamic-text");

// Initialize Lucide icons on page load
if (typeof lucide !== 'undefined') {
  lucide.createIcons();
}

if (dynamicText) {
  // Words to loop through
  const roles = [
    "Computer Engineer",
    "Robotics Developer",
    "Software Engineer",
    "Web Developer",
  ];
  
  let roleIndex = 0;

  // Change the word every 2.5 seconds with a smooth fade
  setInterval(() => {
    // 1. Fade out the current text
    dynamicText.classList.add("fade-out");

    setTimeout(() => {
      // 2. Move to the next word in the array
      roleIndex = (roleIndex + 1) % roles.length;
      dynamicText.textContent = roles[roleIndex];

      // 3. Fade back in
      dynamicText.classList.remove("fade-out");
    }, 300); // 300ms matches the CSS transition time below
  }, 2500); // Swaps every 2.5 seconds (2500ms)
}
  // ==========================================
  // 1. DARK MODE TOGGLE WITH LOCALSTORAGE
  // ==========================================
  const themeToggleBtn = document.getElementById("theme-toggle");
  
  // Check if user previously saved a theme preference in localStorage
  const savedTheme = localStorage.getItem("portfolio-theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      // Toggle the 'dark-mode' class on the body tag
      document.body.classList.toggle("dark-mode");

      // Save preference so it persists after page refresh
      if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("portfolio-theme", "dark");
      } else {
        localStorage.setItem("portfolio-theme", "light");
      }
    });
  }

  // ==========================================
  // 2. CONTACT FORM SUBMISSION
  // ==========================================
  const contactForm = document.getElementById("contact-form");

  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      // Prevent the browser's default behavior of reloading the page on submit
      event.preventDefault();

      // Collect user input values
      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;

      // Display success feedback to user
      alert(`Thank you, ${name}! Your message has been received. I'll get back to you at ${email} soon.`);

      // Reset form input fields
      contactForm.reset();
    });
  }

  // ==========================================
  // 3. FETCH PROJECTS FROM SANITY CMS (PLACEHOLDER)
  // ==========================================
  fetchSanityProjects();
});

// Function to fetch projects dynamically
async function fetchSanityProjects() {
  const projectsGrid = document.getElementById("projects-grid");

  if (!projectsGrid) {
    console.error("Could not find element with id 'projects-grid' in index.html");
    return;
  }

  const SANITY_PROJECT_ID = "qqzzfoa5";
  const DATASET = "production";
  
  // GROQ query expanded to fetch the image asset URL!
  const QUERY = encodeURIComponent(`*[_type == "project"]{
    title,
    description,
    techStack,
    demoLink,
    githubLink,
    "imageUrl": image.asset->url
  }`);
  
  const URL = `https://${SANITY_PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${DATASET}?query=${QUERY}`;

  try {
    const response = await fetch(URL);
    const { result } = await response.json();

    if (result && result.length > 0) {
        projectsGrid.innerHTML = result.map(project => `
        <div class="project-card">
            <div class="project-image-container">
            ${project.imageUrl 
                ? `<img src="${project.imageUrl}" alt="${project.title}" class="project-image" />` 
                : `<div class="project-image-placeholder">No Preview Available</div>`
            }
            </div>
            <div class="project-content">
            <h3>${project.title}</h3>
            <p>${project.description || ''}</p>
            <div class="tech-stack">
                ${(project.techStack || []).map(tech => `<span>${tech}</span>`).join('')}
            </div>
            <div class="project-links">
                ${project.demoLink ? `<a href="${project.demoLink}" target="_blank">Live Demo</a>` : ''}
                ${project.githubLink ? `<a href="${project.githubLink}" target="_blank">GitHub</a>` : ''}
            </div>
            </div>
        </div>
        `).join('');
    } else {
      projectsGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center;">No published projects found in Sanity Studio.</p>`;
    }

  } catch (error) {
    console.error("Error fetching project data from Sanity:", error);
    projectsGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: red;">Failed to load projects.</p>`;
  }
}