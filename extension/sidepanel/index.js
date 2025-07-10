import DOMPurify from "dompurify";
import { marked } from "marked";

const inputPrompt = document.body.querySelector("#input-prompt");
const elementResponse = document.body.querySelector("#response");
const elementLoading = document.body.querySelector("#loading");
const elementError = document.body.querySelector("#error");

// API Configuration
const API_BASE_URL = "http://localhost:8000";

// Reusable API call function
async function callAnswerAPI(context, question) {
  const response = await fetch(`${API_BASE_URL}/answer`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ context, question }),
  });

  if (!response.ok) {
    throw new Error(`API call failed: ${response.status}`);
  }

  return await response.json();
}

// Reusable storage utility functions
const StorageUtils = {
  async getContext() {
    const result = await chrome.storage.session.get("context");
    return result.context;
  },

  async getAutoExecute() {
    const result = await chrome.storage.session.get("autoExecute");
    return result.autoExecute;
  },

  async clearAutoExecute() {
    await chrome.storage.session.remove("autoExecute");
  },
};

// UI state management functions
const UIUtils = {
  showLoading() {
    this.hide(elementResponse);
    this.hide(elementError);
    this.show(elementLoading);
  },

  showResponse(response) {
    this.hide(elementLoading);
    this.show(elementResponse);
    elementResponse.innerHTML = DOMPurify.sanitize(marked.parse(response));
  },

  showError(error) {
    this.show(elementError);
    this.hide(elementResponse);
    this.hide(elementLoading);
    elementError.textContent = error;
  },

  show(element) {
    element.removeAttribute("hidden");
  },

  hide(element) {
    element.setAttribute("hidden", "");
  },
};

// Main execution function for API calls
async function executeQuery(question) {
  UIUtils.showLoading();
  try {
    const context = await StorageUtils.getContext();

    if (!context) {
      UIUtils.showError("No context found");
      return;
    }

    const data = await callAnswerAPI(context, question);
    UIUtils.showResponse(data.answer);
  } catch (error) {
    UIUtils.showError(error.message);
  }
}

// Function to execute the "summarize paragraph" request
async function executeRightAway() {
  const defaultQuestion =
    "Summarize this part of my book within 3 sentences. If it mentions any Figures, tell me what I should look for in the figure.";

  // Populate the input prompt with the default question
  inputPrompt.value = defaultQuestion;

  await executeQuery(defaultQuestion);
}

// Check if this was triggered by "summarize paragraph" on initial load
chrome.storage.session.get(["autoExecute"], async (result) => {
  const { autoExecute } = result;

  if (autoExecute) {
    await StorageUtils.clearAutoExecute();
    await executeRightAway();
  }
});

// Listen for storage changes (for when side panel is already open)
chrome.storage.session.onChanged.addListener(async (changes) => {
  if (changes.autoExecute && changes.autoExecute.newValue === true) {
    await StorageUtils.clearAutoExecute();
    await executeRightAway();
  }
});

// Input prompt event listener
inputPrompt.addEventListener("keypress", async (e) => {
  if (e.key === "Enter") {
    const prompt = inputPrompt.value.trim();
    if (prompt) {
      await executeQuery(prompt);
    }
  }
});
