
let paneCount = 0;
const paneTypes = document.getElementById('paneTypes');
const totalPanes = document.getElementById('totalPanes');
const totalPrice = document.getElementById('totalPrice');

function addPaneType() {
  const container = document.createElement('div');
  container.innerHTML = `
    <input type="text" placeholder="Window Type (e.g. large)" class="type" />
    <input type="number" placeholder="# Panes" class="count" value="0" />
  `;
  paneTypes.appendChild(container);
}

function calculateTotal() {
  const counts = document.querySelectorAll('.count');
  let total = 0;
  counts.forEach(input => {
    total += parseInt(input.value || 0, 10);
  });
  totalPanes.textContent = total;
  totalPrice.textContent = (total * 5).toFixed(2); // $5/pane default
}

paneTypes.addEventListener('input', calculateTotal);

document.getElementById('quoteForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  calculateTotal();

  const clientName = document.getElementById('clientName').value;
  const address = document.getElementById('address').value;
  const types = Array.from(document.querySelectorAll('.type')).map(el => el.value);
  const counts = Array.from(document.querySelectorAll('.count')).map(el => el.value);
  const total = totalPanes.textContent;
  const price = totalPrice.textContent;

  const payload = {
    timestamp: new Date().toISOString(),
    clientName,
    address,
    windowTypes: types.join(', '),
    paneCounts: counts.join(', '),
    total,
    price
  };

  // 🔄 Replace this URL with your Google Apps Script endpoint:
  const webhookURL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';

  try {
    const res = await fetch(webhookURL, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' }
    });
    alert('Quote sent successfully!');
  } catch (err) {
    alert('Failed to send: ' + err.message);
  }
});
