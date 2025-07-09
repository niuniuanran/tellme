import DOMPurify from 'dompurify';
import { marked } from 'marked';

const inputPrompt = document.body.querySelector('#input-prompt');
const elementResponse = document.body.querySelector('#response');
const elementLoading = document.body.querySelector('#loading');
const elementError = document.body.querySelector('#error');

inputPrompt.addEventListener('keypress', async (e) => {
  if (e.key === 'Enter') {
    const prompt = inputPrompt.value.trim();
    showLoading();
    try {
      chrome.storage.session.get('context', async ({ context }) => {
        const response = await fetch('http://localhost:8000/answer', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ context: context, question: prompt })
        });
        const data = await response.json();
        showResponse(data.answer);
      });
    } catch (e) {
      showError(e);
    }
  }
});

function showLoading() {
  hide(elementResponse);
  hide(elementError);
  show(elementLoading);
}

function showResponse(response) {
  hide(elementLoading);
  show(elementResponse);
  elementResponse.innerHTML = DOMPurify.sanitize(marked.parse(response));
}

function showError(error) {
  show(elementError);
  hide(elementResponse);
  hide(elementLoading);
  elementError.textContent = error;
}

function show(element) {
  element.removeAttribute('hidden');
}

function hide(element) {
  element.setAttribute('hidden', '');
}
