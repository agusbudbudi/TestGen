// function setupUI() {
//   document.getElementById("sidebar").innerHTML = `
//         <ul>
//             <li><a href="#" onclick="showSection('testCaseSection')">Generate Test Case</a></li>
//             <li><a href="#" onclick="showSection('historySection')">History</a></li>
//         </ul>
//     `;
// }

// Function to switch sections
function showSection(sectionId) {
  // Hide all sections
  document.querySelectorAll(".section").forEach((section) => {
    section.style.display = "none";
  });

  // Show the selected section
  document.getElementById(sectionId).style.display = "block";

  // Remove 'active' class from all menu items
  document.querySelectorAll(".sidebar ul li").forEach((li) => {
    li.classList.remove("active");
  });

  // Add 'active' class to the clicked menu item
  document
    .querySelector(`.sidebar ul li a[onclick="showSection('${sectionId}')"]`)
    .parentElement.classList.add("active");
}

// loading state
//==========================================
function showLoading(state) {
  const loading = document.getElementById("loadingAnimation");
  if (state) {
    loading.classList.remove("hidden");
  } else {
    loading.classList.add("hidden");
  }
}

//toggle theme
//==========================================
document.getElementById("toggleTheme").addEventListener("click", function () {
  const body = document.body;
  const themeIcon = document.getElementById("themeIcon");

  // Toggle dark mode
  body.classList.toggle("dark-mode");

  // Simpan tema di localStorage
  const isDarkMode = body.classList.contains("dark-mode");
  localStorage.setItem("theme", isDarkMode ? "dark" : "light");

  // Tambahkan animasi perubahan ikon
  themeIcon.style.opacity = "0"; // Hilangkan ikon dulu
  setTimeout(() => {
    themeIcon.innerText = isDarkMode ? "☀️" : "🌙"; // Ganti ikon
    themeIcon.style.opacity = "1"; // Tampilkan kembali dengan efek
  }, 300);
});

// Saat halaman dimuat, set ikon sesuai tema tersimpan
document.addEventListener("DOMContentLoaded", () => {
  const isDarkMode = localStorage.getItem("theme") === "dark";
  if (isDarkMode) {
    document.body.classList.add("dark-mode");
    document.getElementById("themeIcon").innerText = "☀️";
  }
});

// Toggle Sidebar
//==========================================
function toggleSidebar() {
  const sidebar = document.querySelector(".sidebar");
  const content = document.querySelector(".content");

  // Toggle collapsed class
  sidebar.classList.toggle("collapsed");

  // Adjust content width
  content.style.width = sidebar.classList.contains("collapsed") ? "90%" : "82%";

  // Save state in localStorage
  localStorage.setItem(
    "sidebarCollapsed",
    sidebar.classList.contains("collapsed")
  );
}

// Load sidebar state on page load
function loadSidebarState() {
  const sidebar = document.querySelector(".sidebar");
  const content = document.querySelector(".content");

  if (localStorage.getItem("sidebarCollapsed") === "true") {
    sidebar.classList.add("collapsed");
    content.style.width = "90%";
  } else {
    content.style.width = "82%"; //default width content main
  }
}

// Initialize UI functions
document.addEventListener("DOMContentLoaded", () => {
  loadSidebarState();

  // Attach event listener to toggle button
  const toggleButton = document.getElementById("toggleSidebar");
  if (toggleButton) {
    toggleButton.addEventListener("click", toggleSidebar);
  } else {
    console.error("Sidebar toggle button not found!");
  }
});

function copyTestCase() {
  const resultTable = document.getElementById("resultTable");
  const rows = resultTable.querySelectorAll("tbody tr");

  if (rows.length === 0) {
    alert("No test cases to copy!");
    return;
  }

  let copiedText = "";

  rows.forEach((row) => {
    const cells = row.querySelectorAll("td");
    let rowData = [];

    cells.forEach((cell) => {
      let cellText = cell.innerHTML
        .replace(/<br\s*\/?>/gi, "\r\n") // Ganti <br> jadi \r\n
        .replace(/&nbsp;/g, " ") // Ganti &nbsp; jadi spasi biasa
        .replace(/&amp;/g, "&") // UPDATE: Ganti &amp; jadi &
        .replace(/&lt;/g, "<") // UPDATE: Ganti &lt; jadi <
        .replace(/&gt;/g, ">") // UPDATE: Ganti &gt; jadi >
        .replace(/<[^>]*>/g, "") // Hapus tag HTML lain
        .trim();

      // Escape double quotes di dalam cell (jadi double-double quotes "")
      cellText = cellText.replace(/"/g, `""`);

      // Jika ada \r\n (multiline) atau ada double quote, bungkus dengan quote
      if (cellText.includes("\r\n") || cellText.includes('"')) {
        cellText = `"${cellText}"`;
      }

      rowData.push(cellText);
    });

    copiedText += rowData.join("\t") + "\n"; // Tab antar kolom, newline antar baris
  });

  navigator.clipboard
    .writeText(copiedText)
    .then(() => alert("✅ Test cases copied with proper multiline and quotes!"))
    .catch(() => alert("❌ Failed to copy test cases."));
}

// Attach event listener to button
document
  .getElementById("copyTestCaseButton")
  .addEventListener("click", copyTestCase);

function showApiKeyModal() {
  document.getElementById("apiKeyModal").classList.remove("hidden");
  document.getElementById("modalOverlay").classList.remove("hidden");
}

function closeApiKeyModal() {
  document.getElementById("apiKeyModal").classList.add("hidden");
  document.getElementById("modalOverlay").classList.add("hidden");
}

// Save API Key to localStorage
function setApiKey() {
  const apiKey = document.getElementById("apiKeyInput").value.trim();
  if (apiKey) {
    localStorage.setItem("OPENAI_API_KEY", apiKey);
    alert("API Key saved successfully!");
    closeApiKeyModal();
    apiKeyInput.placeholder = "API key sudah tersimpan";
    apiKeyInput.value = ""; // Pastikan tidak auto-isi demi keamanan
    apiKeyInput.disabled = true;
  } else {
    alert("Please enter a valid API Key.");
  }
}

// Load saved API Key (optional: auto-fill input field if key exists)
// document.addEventListener("DOMContentLoaded", () => {
//   const savedKey = localStorage.getItem("OPENAI_API_KEY");
//   if (savedKey) {
//     document.getElementById("apiKeyInput").value = savedKey;
//   }
// });

function clearApiKey() {
  localStorage.removeItem("OPENAI_API_KEY"); // Remove from storage
  document.getElementById("apiKeyInput").value = ""; // Clear input field
  alert("API Key has been cleared.");
  closeApiKeyModal(); // Auto-close the modal after clicking "OK"
  apiKeyInput.placeholder = "Enter OpenAI API Key";
  apiKeyInput.value = ""; // Pastikan tidak auto-isi demi keamanan
  apiKeyInput.disabled = false;
}

function deleteHistory(index, type) {
  if (type === "prompt") {
    promptHistory.splice(index, 1);
    localStorage.setItem("promptHistory", JSON.stringify(promptHistory));
  } else if (type === "result") {
    resultHistory.splice(index, 1);
    localStorage.setItem("resultHistory", JSON.stringify(resultHistory));
  }
  updateHistory();
}

document.addEventListener("DOMContentLoaded", () => {
  let savedPrompts = localStorage.getItem("promptHistory");
  let savedResults = localStorage.getItem("resultHistory");

  if (savedPrompts) {
    promptHistory = JSON.parse(savedPrompts);
  }
  if (savedResults) {
    resultHistory = JSON.parse(savedResults);
  }

  updateHistory();
});

//how to use modal
//==========================================
function showHowToUseModal() {
  document.getElementById("howToUseModal").classList.remove("hidden");
  document.getElementById("modalOverlay").classList.remove("hidden");
}

function closeHowToUseModal() {
  document.getElementById("howToUseModal").classList.add("hidden");
  document.getElementById("modalOverlay").classList.add("hidden");
}

// paste template
function applyTemplate() {
  const templateUserStory = `User Story: `;
  const templatePrompt = `Preconditions: 
AcceptanceCriteria: 


Constraints: 

Formatting table
- create in table format only show content without header column section
- use <br> line breaks in the generated test case text
- Use Gherkin syntax (Given, When, Then) for test case preconditions, steps, and expected results.

Test cases should follow this structure:
- Column A: No (numbering)
- Column B: Section (feature name)
- Column C: Case Type (positive/negative/edge case)
- Column D: Title (concise comprehensive summary contains the item to be verified)  
- Column E: Precondition (dash list)  
- Column F: Step (numbered list)
- Column G: Expected Result (dash list)
`;

  document.getElementById("userStory").value = templateUserStory;
  document.getElementById("prompt").value = templatePrompt;
}
