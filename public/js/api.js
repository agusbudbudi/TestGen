async function generateTestCase() {
  const userStory = document.getElementById("userStory").value;
  const prompt = document.getElementById("prompt").value;
  const loading = document.getElementById("loadingAnimation");
  const resultTable = document.getElementById("resultTable");
  const tbody = resultTable.querySelector("tbody");

  // ✅ New: Combine `userStory` and `promptDescription` into a single prompt
  const combinedPrompt = `User Story: ${userStory}\n\nPrompt: ${prompt}`;

  // ✅ Fix: Ensure prompt is not empty (checks the combined input now)
  if (!combinedPrompt.trim()) {
    alert("Masukkan User Story dan Prompt terlebih dahulu!");
    return;
  }

  // Show loading animation and hide the result table initially
  loading.classList.remove("hidden");
  resultTable.classList.add("hidden");
  tbody.innerHTML = ""; // Kosongkan hasil sebelumnya

  const apiKey = localStorage.getItem("OPENAI_API_KEY");
  if (!apiKey) {
    loading.classList.add("hidden");
    alert("API Key is missing! Please set it in the sidebar.");
    return;
  }

  const apiUrl = "https://api.openai.com/v1/chat/completions";

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: combinedPrompt }],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error("Gagal mengambil data dari OpenAI!");
    }

    const data = await response.json();
    const resultText = data.choices[0]?.message?.content || ""; // ✅ Fix: Prevent potential undefined error
    const parsedData = parseGPTTable(resultText);

    if (parsedData.length > 1) {
      resultTable.classList.remove("hidden");

      // Populate table UPDATE Table biar precond step dan expected result bisa multiline
      parsedData.slice(1).forEach((row) => {
        const tr = document.createElement("tr");
        row.forEach((cell) => {
          const td = document.createElement("td");
          td.innerHTML = cell.replace(/\n/g, "<br>"); // 🔥 Replace newline with <br>
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });

      loading.classList.add("hidden");
    } else {
      alert("Tidak ada test case yang dihasilkan.");
      loading.classList.add("hidden");
    }
  } catch (error) {
    alert(error.message);
    loading.classList.add("hidden");
  }
}

function formatTableData(tableData) {
  // 🛠 Ensure tableData is an actual array
  if (typeof tableData === "string") {
    try {
      tableData = JSON.parse(tableData); // Convert JSON string back to array
    } catch (e) {
      console.error("❌ Failed to parse tableData JSON:", tableData);
      return "Invalid table data";
    }
  }

  if (!Array.isArray(tableData)) {
    console.error("❌ tableData is not an array!", tableData);
    return "Invalid table data";
  }

  return tableData
    .map((row) => (Array.isArray(row) ? row.join("\t") : row)) // Ensure each row is an array
    .join("\n"); // Join rows with new lines
}

// Load stored history from localStorage or initialize an empty array
let historyEntries = JSON.parse(localStorage.getItem("historyEntries")) || [];

// Function to generate test case and store the prompt
function generateTestCaseAndStoreHistory() {
  let userStory = document.getElementById("userStory").value; // ✅ Get User Story value
  let prompt = document.getElementById("prompt").value; // ✅ Trim prompt value

  // 🚨 Validation: Check if the User Story is empty
  if (userStory.trim() === "") {
    alert("Please enter a User Story!"); // 🔴 Show alert if missing
    return; // ⛔ Stop function execution
  }

  // 🚨 Validation: Check if the Prompt is empty
  if (prompt.trim() === "") {
    alert("Please enter a Prompt!"); // 🔴 Show alert if missing
    return; // ⛔ Stop function execution
  }

  // Save prompt as a history entry
  historyEntries.push({
    type: "prompt",
    content: `User Story: ${userStory}\nPrompt: ${prompt}`,
  });

  //localStorage.setItem("historyEntries", JSON.stringify(historyEntries));
  updateHistory();

  // Call existing test case generator function
  generateTestCase();
}

function updateHistory() {
  let historyList = document.getElementById("historyList");
  historyList.innerHTML = ""; // Clear previous history

  historyEntries.forEach((entry, index) => {
    let content = entry.content;

    // Ensure content is a string
    if (typeof content !== "string") {
      content = JSON.stringify(content); // Convert array/object to string
    }

    if (!content.trim()) return; // Skip empty entries

    let chatBubble = document.createElement("div");
    chatBubble.classList.add("chat-bubble");

    if (entry.type === "prompt") {
      chatBubble.classList.add("even-bubble");
      chatBubble.innerHTML = `<div><strong>Prompt:</strong><br> ${content}</div>
       <div class="button-section"><button class="delete-btn" onclick="deleteHistory(${index})"><i class="uil uil-trash"></i> Delete</button></div>`;
    } else if (entry.type === "result") {
      chatBubble.classList.add("odd-bubble");
      chatBubble.innerHTML = `<div class="chat"><strong>Test Case Result:</strong><br>
        <pre>${formatTableData(content)}</pre></div>
        <div class="button-section"><button class="delete-btn" onclick="deleteHistory(${index})"><i class="uil uil-trash"></i> Delete</button></div>`;
    }

    historyList.appendChild(chatBubble);
  });

  localStorage.setItem("historyEntries", JSON.stringify(historyEntries));
}

function addResultToHistory() {
  let resultTable = document.getElementById("resultTable");
  if (resultTable.classList.contains("hidden")) {
    alert("No test case result available to save!");
    return;
  }

  let tableData = [];
  let rows = resultTable.querySelectorAll("tbody tr");

  rows.forEach((row) => {
    let rowData = [];
    row.querySelectorAll("td").forEach((cell) => {
      rowData.push(cell.textContent.trim());
    });
    tableData.push(rowData);
  });

  if (tableData.length === 0) {
    alert("No test case data found!");
    return;
  }

  // Find the last entry index to determine proper insertion
  let lastEntryIndex = historyEntries.length - 1;

  // If the last entry is already a test case result, insert at the next index
  if (
    lastEntryIndex % 2 === 0 &&
    historyEntries[lastEntryIndex]?.type === "result"
  ) {
    historyEntries.splice(lastEntryIndex + 1, 0, {
      type: "result",
      content: tableData,
    });
  } else {
    historyEntries.push({ type: "result", content: tableData });
  }

  localStorage.setItem("historyEntries", JSON.stringify(historyEntries));
  updateHistory();
  alert("Test case result has been added to history.");
}

// delete history
function deleteHistory(index) {
  historyEntries.splice(index, 1);
  localStorage.setItem("historyEntries", JSON.stringify(historyEntries));
  updateHistory();
}

//Load Data on Page Load
document.addEventListener("DOMContentLoaded", () => {
  let savedHistory = localStorage.getItem("historyEntries");

  if (savedHistory) {
    historyEntries = JSON.parse(savedHistory);
  }

  updateHistory();
});
