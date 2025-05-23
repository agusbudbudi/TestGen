async function reviewTestCase() {
  const input = document.getElementById("testCaseInput").value.trim();
  const result = document.getElementById("reviewResult");

  if (!input) {
    result.innerHTML = `<p class="text-red-500">Please input a test case to review.</p>`;
    return;
  }

  const apiKey = localStorage.getItem("OPENAI_API_KEY");
  if (!apiKey) {
    result.innerHTML = `<p class="text-red-500">OpenAI API key is not set.</p>`;
    return;
  }

  result.innerHTML = `<p class="text-gray-500 italic">Reviewing test case with AI...</p>`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              // "You are a QA expert helping to review software test cases.",
              `You are a senior QA reviewer. Analyze the provided test cases according to:
- Completeness (are all scenarios covered?)
- Clarity (are the steps understandable?)
- Coverage of edge and negative cases
- Suggestions for improvements`,
          },
          {
            role: "user",
            // content: `Please review the following test case and give a summary, strengths, and suggestions:\n\n${input}`,
            content: `Provide:
- Suggested improvements
- List Any missing important cases:\n\n${input}`,
          },
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const reply =
      data.choices?.[0]?.message?.content || "No response received.";

    result.innerHTML = `
  <div class="bg-gray-100 dark:bg-gray-800 p-4 rounded border dark:border-gray-700 text-sm leading-relaxed space-y-4">
    <h2 class="font-semibold text-lg">AI Review Result</h2>
    <div class="space-y-2 whitespace-pre-wrap" text-xl>${formatGPTReview(
      reply
    )}</div>
  </div>
`;
  } catch (error) {
    console.error("Error reviewing test case:", error);
    result.innerHTML = `<p class="text-red-500">Failed to fetch review. Please try again.</p>`;
  }
}

function formatGPTReview(rawText) {
  const lines = rawText
    .trim()
    .split("\n")
    .map((line) => line.trim());

  let formatted = "";
  let currentSection = "";
  let sectionOpened = false;
  let olOpened = false;

  for (let line of lines) {
    // Format **bold** jadi <strong>bold</strong>
    line = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

    if (line.startsWith("###")) {
      if (sectionOpened) {
        formatted += "</ul>";
        sectionOpened = false;
      }
      if (olOpened) {
        formatted += "</ol>";
        olOpened = false;
      }

      const sectionTitle = line.replace("###", "").trim();
      if (sectionTitle.toLowerCase().includes("analysis")) {
        formatted += `<h3 class="font-bold text-lg mt-4">🧠 Analysis:</h3>\n<ul class="list-disc list-inside space-y-1">`;
        currentSection = "analysis";
        sectionOpened = true;
      } else if (sectionTitle.toLowerCase().includes("suggest")) {
        formatted += `<h3 class="font-bold text-lg mt-4">🛠️ Suggestions for Improvements:</h3>\n<ul class="list-disc list-inside space-y-1">`;
        currentSection = "suggestions";
        sectionOpened = true;
      }
      continue;
    }

    const isNumbered = /^\d+\.\s+/.test(line);

    if (isNumbered) {
      if (sectionOpened) {
        formatted += "</ul>";
        sectionOpened = false;
      }
      if (!olOpened) {
        formatted += `<ol class="list-decimal list-inside space-y-1 ml-4 mt-2">`;
        olOpened = true;
      }
      const content = line.replace(/^\d+\.\s*/, ""); // hapus numbering manual
      formatted += `\n  <li class="leading-relaxed">${content}</li>`;
    } else if (line.startsWith("•") || line.startsWith("-")) {
      if (olOpened) {
        formatted += "</ol>";
        olOpened = false;
      }
      if (!sectionOpened) {
        formatted += `<ul class="list-disc list-inside space-y-1">`;
        sectionOpened = true;
      }
      formatted += `\n  <li class="leading-relaxed">${line.replace(
        /^[-•]\s*/,
        ""
      )}</li>`;
    } else if (line) {
      if (olOpened) {
        formatted += "</ol>";
        olOpened = false;
      }
      if (!sectionOpened) {
        formatted += `<ul class="list-disc list-inside space-y-1">`;
        sectionOpened = true;
      }
      formatted += `\n  <li class="leading-relaxed">${line}</li>`;
    }
  }

  if (sectionOpened) formatted += "</ul>";
  if (olOpened) formatted += "</ol>";

  if (formatted.length < 100) {
    return `<pre class="whitespace-pre-wrap text-sm">${rawText}</pre>`;
  }

  return formatted;
}
