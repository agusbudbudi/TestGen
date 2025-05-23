async function generateBugReport() {
  const bugDetails = document.getElementById("bugReportInput").value;
  const loading = document.getElementById("loadingBugReport");
  const bugTable = document.getElementById("bugReportTable");
  const tbody = bugTable.querySelector("tbody");

  const combinedPrompt = `You are a QA specialist. Based on the following bug details, generate a **bug report** in a **Markdown table format** with these columns:
  Summary | Step to Reproduce | Actual Result | Expected Result | Severity & Retest Result | 
  Bug Details:
  ${bugDetails}`;

  if (!combinedPrompt.trim()) {
    alert("masukkan bug detail terlebih dahulu!");
    return;
  }

  loading.classList.remove("hidden");
  bugTable.classList.add("hidden");
  tbody.innerHTML = "";

  const apiKey = localStorage.getItem("OPENAI_API_KEY");
  if (!apiKey) {
    loading.classList.add("hidden");
    alert("API Key is missing! Please set it in the sidebar.");
    return;
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
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
    const resultText = data.choices[0]?.message?.content || "";
    // const parsedData = parseGPTTable(resultText);
    const parsedData = parseBugReportTable(resultText);

    if (parsedData.length > 1) {
      bugTable.classList.remove("hidden");

      parsedData.slice(1).forEach((row) => {
        const tr = document.createElement("tr");
        row.forEach((cell) => {
          const td = document.createElement("td");
          td.innerHTML = cell.replace(/\n/g, "<br>");
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });

      loading.classList.add("hidden");
    } else {
      alert("Tidak ada bug report yang dihasilkan.");
      loading.classList.add("hidden");
    }
  } catch (error) {
    alert(error.message);
    loading.classList.add("hidden");
  }
}

function parseBugReportTable(gptResponse) {
  const lines = gptResponse
    .trim()
    .split("\n")
    .filter((line) => line.includes("|") && !/^[-| ]+$/.test(line)); // Filter out separator rows like |----|

  const table = [];

  lines.forEach((line, index) => {
    const columns = line
      .split("|")
      .map((col) => col.trim())
      .filter((col) => col !== ""); // Remove empty columns

    if (index === 0) {
      // Header row
      table.push(columns);
    } else {
      // Data rows
      table.push(columns);
    }
  });

  return table;
}

function copyBugReport() {
  const bugReportTable = document.getElementById("bugReportTable");
  const rows = bugReportTable.querySelectorAll("tbody tr");

  if (rows.length === 0) {
    alert("No bug report to copy!");
    return;
  }

  let copiedText = "";

  // Tambahkan header di baris pertama
  const headers = [
    "Summary",
    "Step to Reproduce",
    "Actual Result",
    "Expected Result",
    "Severity & Retest Result",
  ];
  copiedText += headers.join("\t") + "\n";

  // Proses setiap baris data
  rows.forEach((row) => {
    const cells = row.querySelectorAll("td");
    let rowData = [];

    cells.forEach((cell) => {
      let cellText = cell.innerHTML
        .replace(/<br\s*\/?>/gi, "\r\n") // Ganti <br> dengan newline
        .replace(/&nbsp;/g, " ") // Ganti &nbsp; dengan spasi
        .replace(/<[^>]*>/g, "") // Hapus tag HTML lain
        .trim();

      // Escape double quotes
      cellText = cellText.replace(/"/g, `""`);

      // Bungkus dengan tanda kutip jika ada newline atau kutip
      if (cellText.includes("\r\n") || cellText.includes('"')) {
        cellText = `"${cellText}"`;
      }

      rowData.push(cellText);
    });

    copiedText += rowData.join("\t") + "\n";
  });

  // Salin ke clipboard
  navigator.clipboard
    .writeText(copiedText)
    .then(() => alert("✅ Bug report (with header) copied!"))
    .catch(() => alert("❌ Failed to copy bug report."));
}
