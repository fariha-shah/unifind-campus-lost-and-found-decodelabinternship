/* ============================================
   UNIFIND — item-detail.js
   Item Detail, Live Chat & Claim Modals
   ============================================ */

document.addEventListener('DOMContentLoaded', async () => {
  if (typeof lucide !== 'undefined') lucide.createIcons();

  const baseUrl =
    typeof API_BASE_URL !== 'undefined' ? API_BASE_URL : 'http://localhost:4000';
  const currentUser = JSON.parse(localStorage.getItem('unifind_user') || 'null');

  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const container = document.getElementById('item-detail-content');

  if (!id) {
    if (container) {
      container.innerHTML = `
        <div class="detail-loading">
          <h2>Item Not Specified</h2>
          <p>Please select an item from the listings to view its details.</p>
          <a href="index.html#browse" class="btn btn-primary" style="margin-top:1rem;">Browse All Items</a>
        </div>`;
      if (typeof lucide !== 'undefined') lucide.createIcons();
    }
    return;
  }

  try {
    const response = await fetch(`${baseUrl}/api/items/${id}`);
    const data = await response.json();

    if (!data.success || !data.data) {
      container.innerHTML = `
        <div class="detail-loading">
          <h2>Item Not Found</h2>
          <p>This listing may have been resolved, deleted, or does not exist.</p>
          <a href="index.html#browse" class="btn btn-primary" style="margin-top:1rem;">Browse All Items</a>
        </div>`;
      if (typeof lucide !== 'undefined') lucide.createIcons();
      return;
    }

    const item = data.data;
    const icons = {
      electronics: 'smartphone',
      keys: 'key-round',
      bags: 'backpack',
      documents: 'file-text',
      accessories: 'glasses',
      clothing: 'shirt',
      books: 'book-open',
      other: 'package',
    };
    const icon = icons[item.category] || 'package';
    const statusColors = {
      lost: 'tag-lost',
      found: 'tag-found',
      returned: 'tag-returned',
    };
    const statusLabels = { lost: 'Lost', found: 'Found', returned: 'Returned' };
    const isResolved = item.status === 'returned';

    document.title = `${item.title} | UniFind`;
    const bc = document.getElementById('breadcrumb-title');
    if (bc) bc.textContent = item.title;

    // Check if uploaded image exists
    let imgDisplay = '';
    if (item.image) {
      const imgUrl = typeof getImageUrl === 'function' ? getImageUrl(item.image) : `${baseUrl}${item.image}`;
      imgDisplay = `
        <img src="${imgUrl}" alt="${item.title}" style="width:100%;height:100%;object-fit:cover;border-radius:inherit;" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';" />
        <i data-lucide="${icon}" style="display:none;"></i>
      `;
    } else {
      imgDisplay = `<i data-lucide="${icon}"></i>`;
    }

    container.innerHTML = `
      <div class="detail-grid">
        <div class="detail-img-panel">
          <div class="detail-img-main">
            ${imgDisplay}
            <span class="tag ${statusColors[item.status]} detail-status-badge">${statusLabels[item.status]}</span>
          </div>
        </div>
        <div class="detail-info-panel">
          <div>
            <h1>${item.title}</h1>
            <div class="detail-meta-grid">
              <div class="detail-meta-item"><i data-lucide="map-pin"></i><div><strong>Location</strong>${item.location}</div></div>
              <div class="detail-meta-item"><i data-lucide="calendar"></i><div><strong>Date</strong>${new Date(item.createdAt).toLocaleDateString()}</div></div>
              <div class="detail-meta-item"><i data-lucide="layers"></i><div><strong>Category</strong>${item.category.charAt(0).toUpperCase() + item.category.slice(1)}</div></div>
              <div class="detail-meta-item"><i data-lucide="activity"></i><div><strong>Status</strong>${statusLabels[item.status]}</div></div>
            </div>
          </div>
          <div class="detail-description">
            <h2>Description</h2>
            <p>${item.description}</p>
          </div>
          <div class="reporter-card">
            <div class="reporter-info">
              <div class="reporter-avatar"><i data-lucide="user-circle"></i></div>
              <div>
                <div class="reporter-name">${item.poster ? item.poster.split('@')[0] : 'Campus Student'}</div>
                <div style="font-size:0.8rem;color:var(--clr-ink-light);">${item.poster || ''}</div>
              </div>
            </div>
            <span class="tag ${statusColors[item.status]}">${statusLabels[item.status]} listing</span>
          </div>
          <div class="contact-section" id="contact">
            <h2>Contact or Claim</h2>
            ${
              isResolved
                ? `<div style="display:flex;align-items:center;gap:0.5rem;color:var(--clr-found);font-weight:600;padding:1rem;background:rgba(91,173,143,0.1);border-radius:8px;">
                     <i data-lucide="check-circle"></i>
                     <span>This item has been successfully recovered and returned.</span>
                   </div>`
                : `<p style="font-size:.9rem;color:var(--clr-ink-mid);margin-bottom:1rem;">
                     Think this is your item or have information? Send an instant chat message or submit an official claim.
                   </p>
                   <div style="display:flex;gap:1rem;flex-wrap:wrap;">
                     <button class="btn btn-primary btn-lg" id="open-contact-modal">
                       <i data-lucide="send"></i> Send Message
                     </button>
                     <button class="btn btn-outline btn-lg" id="open-claim-modal">
                      <i data-lucide="hand-helping"></i> Claim / I Found This
                     </button>
                   </div>`
            }
          </div>
        </div>
      </div>
      <div style="margin-top:2.5rem;padding-top:2rem;border-top:1px solid var(--clr-grey-mid);">
        <a href="index.html#browse" class="btn btn-outline"><i data-lucide="arrow-left"></i> Back to All Listings</a>
      </div>`;

    if (typeof lucide !== 'undefined') lucide.createIcons();

    // Autofill user fields if logged in
    if (currentUser) {
      const msgName = document.getElementById('msg-name');
      const msgEmail = document.getElementById('msg-email');
      const claimName = document.getElementById('claim-name');
      const claimEmail = document.getElementById('claim-email');

      if (msgName && !msgName.value) msgName.value = currentUser.name || '';
      if (msgEmail && !msgEmail.value) msgEmail.value = currentUser.email || '';
      if (claimName && !claimName.value) claimName.value = currentUser.name || '';
      if (claimEmail && !claimEmail.value) claimEmail.value = currentUser.email || '';
    }

    const openBtn = document.getElementById('open-contact-modal');
    if (openBtn) openBtn.addEventListener('click', openModal);
    const claimBtn = document.getElementById('open-claim-modal');
    if (claimBtn) claimBtn.addEventListener('click', openClaimModal);

    if (window.location.hash === '#contact' && !isResolved) {
      setTimeout(() => {
        document
          .getElementById('contact')
          ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(openModal, 600);
      }, 300);
    }
  } catch (error) {
    container.innerHTML = `
      <div class="detail-loading">
        <h2>Error Loading Item</h2>
        <p>Could not connect to the backend server. Please make sure the API is active.</p>
        <a href="index.html#browse" class="btn btn-primary" style="margin-top:1rem;">Browse All Items</a>
      </div>`;
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }
});

/* ---- Modal logic ---- */
function openModal() {
  document.getElementById('contact-modal').hidden = false;
  document.getElementById('modal-backdrop').hidden = false;
  document.body.style.overflow = 'hidden';
  document.getElementById('msg-name')?.focus();
}

function closeModal() {
  document.getElementById('contact-modal').hidden = true;
  document.getElementById('modal-backdrop').hidden = true;
  document.body.style.overflow = '';
}

document.addEventListener('DOMContentLoaded', () => {
  const baseUrl =
    typeof API_BASE_URL !== 'undefined' ? API_BASE_URL : 'http://localhost:4000';

  document.getElementById('close-modal')?.addEventListener('click', closeModal);
  document
    .getElementById('modal-backdrop')
    ?.addEventListener('click', closeModal);
  document
    .getElementById('close-success')
    ?.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
      closeClaimModal();
    }
  });

  const form = document.getElementById('contact-form');
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();

    let valid = true;
    const name = document.getElementById('msg-name').value.trim();
    const email = document.getElementById('msg-email').value.trim();
    const msg = document.getElementById('msg-text').value.trim();

    if (!name) {
      document.getElementById('fg-msg-name').classList.add('error');
      document.getElementById('msg-name-error').textContent =
        'Name is required.';
      valid = false;
    } else {
      document.getElementById('fg-msg-name').classList.remove('error');
      document.getElementById('msg-name-error').textContent = '';
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      document.getElementById('fg-msg-email').classList.add('error');
      document.getElementById('msg-email-error').textContent =
        'Enter a valid email.';
      valid = false;
    } else {
      document.getElementById('fg-msg-email').classList.remove('error');
      document.getElementById('msg-email-error').textContent = '';
    }

    if (!msg || msg.length < 5) {
      document.getElementById('fg-msg-text').classList.add('error');
      document.getElementById('msg-text-error').textContent =
        'Message must be at least 5 characters.';
      valid = false;
    } else {
      document.getElementById('fg-msg-text').classList.remove('error');
      document.getElementById('msg-text-error').textContent = '';
    }

    if (!valid) return;

    const btn = document.getElementById('send-msg-btn');
    btn.querySelector('span').textContent = 'Sending...';
    btn.disabled = true;

    await new Promise((r) => setTimeout(r, 600));

    document.getElementById('contact-form').style.display = 'none';
    const chatView = document.getElementById('chat-view');
    chatView.hidden = false;
    if (typeof lucide !== 'undefined') lucide.createIcons();

    const params = new URLSearchParams(window.location.search);
    const itemId = params.get('id');

    await loadMessages(itemId);
    addBubble(msg, 'sent');
    await saveMessage(itemId, msg, 'sent', name);

    setTimeout(async () => {
      const reply = "Thanks for reaching out! I've received your message and will coordinate handoff shortly.";
      addBubble(reply, 'received');
      await saveMessage(itemId, reply, 'received', 'Reporter');
    }, 1000);
  });
});

/* ---- Chat Logic ---- */
const autoReplies = [
  'Hi! Yes I have it safely with me. When are you free to meet on campus?',
  "Sure, I'm available near the library study hall tomorrow afternoon.",
  'Can you share any unique detail or markings so I can double verify?',
  'I have submitted it to the admin desk security counter for safekeeping.',
  "I'll be at the student cafeteria around 1:00 PM if that works for you!",
];

function getTime() {
  return new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function addBubble(text, type) {
  const messages = document.getElementById('chat-messages');
  if (!messages) return;
  const bubble = document.createElement('div');
  bubble.className = `chat-bubble ${type}`;
  bubble.innerHTML = `${text}<span class="bubble-time">${getTime()}</span>`;
  messages.appendChild(bubble);
  messages.scrollTop = messages.scrollHeight;
}

async function saveMessage(itemId, text, type, senderOverride) {
  const baseUrl =
    typeof API_BASE_URL !== 'undefined' ? API_BASE_URL : 'http://localhost:4000';
  const user = JSON.parse(localStorage.getItem('unifind_user') || 'null');
  const sender = senderOverride || (user ? user.name : 'Student');
  try {
    await fetch(`${baseUrl}/api/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ itemId, sender, text, type }),
    });
  } catch (error) {
    console.log('Message save error:', error);
  }
}

async function loadMessages(itemId) {
  const baseUrl =
    typeof API_BASE_URL !== 'undefined' ? API_BASE_URL : 'http://localhost:4000';
  try {
    const response = await fetch(`${baseUrl}/api/messages/${itemId}`);
    const data = await response.json();
    if (!data.success) return;
    const messagesDiv = document.getElementById('chat-messages');
    if (!messagesDiv) return;
    messagesDiv.innerHTML = '';
    data.data.forEach((msg) => addBubble(msg.text, msg.type));
  } catch (error) {
    console.log('Messages load error:', error);
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const itemId = params.get('id');
  const sendBtn = document.getElementById('chat-send-btn');
  const chatInput = document.getElementById('chat-input');

  sendBtn?.addEventListener('click', async () => {
    const text = chatInput.value.trim();
    if (!text) return;
    addBubble(text, 'sent');
    chatInput.value = '';
    await saveMessage(itemId, text, 'sent');

    setTimeout(async () => {
      const reply = autoReplies[Math.floor(Math.random() * autoReplies.length)];
      addBubble(reply, 'received');
      await saveMessage(itemId, reply, 'received');
    }, 1200);
  });

  chatInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendBtn?.click();
  });
});

/* ---- Claim Modal Logic ---- */
function openClaimModal() {
  document.getElementById('claim-modal').hidden = false;
  document.getElementById('modal-backdrop').hidden = false;
  document.body.style.overflow = 'hidden';
  document.getElementById('claim-name')?.focus();
}

function closeClaimModal() {
  document.getElementById('claim-modal').hidden = true;
  document.getElementById('modal-backdrop').hidden = true;
  document.body.style.overflow = '';
}

document.addEventListener('DOMContentLoaded', () => {
  const baseUrl =
    typeof API_BASE_URL !== 'undefined' ? API_BASE_URL : 'http://localhost:4000';

  document
    .getElementById('close-claim-modal')
    ?.addEventListener('click', closeClaimModal);
  document
    .getElementById('close-claim-success')
    ?.addEventListener('click', closeClaimModal);

  // Claim form submit
  document
    .getElementById('claim-form')
    ?.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('claim-name').value.trim();
      const email = document.getElementById('claim-email').value.trim();
      const message = document.getElementById('claim-message').value.trim();

      let valid = true;

      if (!name) {
        document.getElementById('claim-name-error').textContent =
          'Name is required.';
        valid = false;
      } else document.getElementById('claim-name-error').textContent = '';

      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        document.getElementById('claim-email-error').textContent =
          'Valid email required.';
        valid = false;
      } else document.getElementById('claim-email-error').textContent = '';

      if (!message || message.length < 10) {
        document.getElementById('claim-message-error').textContent =
          'Please add more verification details (min 10 chars).';
        valid = false;
      } else document.getElementById('claim-message-error').textContent = '';

      if (!valid) return;

      const btn = document.getElementById('claim-submit-btn');
      btn.querySelector('span').textContent = 'Submitting...';
      btn.disabled = true;

      const params = new URLSearchParams(window.location.search);
      const itemId = params.get('id');

      const itemTitle =
        document.querySelector('.detail-info-panel h1')?.textContent ||
        'Campus Item';

      try {
        const response = await fetch(`${baseUrl}/api/claims`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            itemId,
            itemTitle,
            claimerName: name,
            claimerEmail: email,
            message,
          }),
        });

        const data = await response.json();

        if (data.success) {
          document.getElementById('claim-form').style.display = 'none';
          document.getElementById('claim-success').hidden = false;
          if (typeof lucide !== 'undefined') lucide.createIcons();
        } else {
          btn.querySelector('span').textContent = 'Submit Claim';
          btn.disabled = false;
          alert('Error: ' + data.message);
        }
      } catch (error) {
        btn.querySelector('span').textContent = 'Submit Claim';
        btn.disabled = false;
        alert('Server se connection nahi ho raha!');
      }
    });
});
