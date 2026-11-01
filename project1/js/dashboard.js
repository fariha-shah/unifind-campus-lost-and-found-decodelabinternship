/* ============================================
   UNIFIND — dashboard.js
   User Dashboard, Listings & Claims Management
   ============================================ */

const baseUrl =
  typeof API_BASE_URL !== 'undefined' ? API_BASE_URL : 'http://localhost:4000';

// Check if user is logged in
const user = JSON.parse(localStorage.getItem('unifind_user') || 'null');
if (user) {
  const nameEl = document.querySelector('.dash-user-info h1');
  const detailsEl = document.querySelector('.dash-user-info p');
  if (nameEl) nameEl.textContent = user.name;
  if (detailsEl) {
    const dept = user.department ? `${user.department}` : 'Student Account';
    const sId = user.studentId ? ` · ID: ${user.studentId}` : '';
    detailsEl.textContent = `${user.email} · ${dept}${sId}`;
  }
} else {
  // If not logged in, suggest logging in
  const nameEl = document.querySelector('.dash-user-info h1');
  const detailsEl = document.querySelector('.dash-user-info p');
  if (nameEl) nameEl.textContent = 'Demo Student Account';
  if (detailsEl) detailsEl.textContent = 'Sign in to access your personal campus dashboard.';
}

document.addEventListener('DOMContentLoaded', () => {
  if (typeof lucide !== 'undefined') lucide.createIcons();

  // Tabs
  const tabs = document.querySelectorAll('.dash-tab');
  const panels = document.querySelectorAll('.dash-panel');
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      panels.forEach((p) => (p.hidden = true));
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      const target = document.getElementById(tab.getAttribute('aria-controls'));
      if (target) target.hidden = false;
    });
  });

  // Cancel delete
  document.getElementById('cancel-delete')?.addEventListener('click', () => {
    document.getElementById('delete-modal').hidden = true;
    document.getElementById('delete-backdrop').hidden = true;
    document.body.style.overflow = '';
    rowToDelete = null;
  });

  // Backdrop click
  document.getElementById('delete-backdrop')?.addEventListener('click', () => {
    document.getElementById('delete-modal').hidden = true;
    document.getElementById('delete-backdrop').hidden = true;
    document.body.style.overflow = '';
    rowToDelete = null;
  });

  // Confirm delete
  document
    .getElementById('confirm-delete')
    ?.addEventListener('click', async () => {
      if (rowToDelete) {
        const itemId = rowToDelete.dataset.itemId;
        try {
          await fetch(`${baseUrl}/api/items/${itemId}`, {
            method: 'DELETE',
          });
        } catch (error) {
          console.log('Delete error:', error);
        }
        rowToDelete.style.animation = 'fadeSlideUp 0.3s reverse both';
        setTimeout(() => {
          rowToDelete.remove();
          rowToDelete = null;
          loadUserItems(); // refresh counts
        }, 280);
      }
      document.getElementById('delete-modal').hidden = true;
      document.getElementById('delete-backdrop').hidden = true;
      document.body.style.overflow = '';
    });

  // Logout
  document.getElementById('logout-btn')?.addEventListener('click', () => {
    localStorage.removeItem('unifind_user');
    window.location.href = 'login.html';
  });
});

// Delete confirmation modal handler
let rowToDelete = null;

function confirmDelete(btn) {
  rowToDelete = btn.closest('.dash-item-row');
  document.getElementById('delete-modal').hidden = false;
  document.getElementById('delete-backdrop').hidden = false;
  document.body.style.overflow = 'hidden';
}

// Load items from API
async function loadUserItems() {
  try {
    const response = await fetch(`${baseUrl}/api/items`);
    const data = await response.json();
    if (!data.success) return;

    const list = document.querySelector('.dash-items-list');
    if (!list) return;

    list.innerHTML = '';

    if (data.data.length === 0) {
      list.innerHTML = `
        <div class="history-empty" style="text-align:center;padding:2.5rem 1rem;">
          <i data-lucide="inbox" style="width:48px;height:48px;opacity:0.4;margin-bottom:1rem;"></i>
          <h3>No listings found</h3>
          <p>You haven't posted any items yet.</p>
          <a href="report.html" class="btn btn-primary" style="margin-top:1rem;">Report an Item</a>
        </div>`;
      if (typeof lucide !== 'undefined') lucide.createIcons();
      return;
    }

    // Filter items posted by this user if logged in, otherwise show active items for demo
    const itemsToDisplay = user && user.email
      ? data.data.filter((i) => i.poster === user.email || i.poster === user.name)
      : data.data;

    const displayList = itemsToDisplay.length > 0 ? itemsToDisplay : data.data;

    displayList.forEach((item) => {
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
      const tagClass = `tag-${item.status}`;
      const statusLabel =
        item.status.charAt(0).toUpperCase() + item.status.slice(1);

      let imgHtml = '';
      if (item.image) {
        const imgUrl = typeof getImageUrl === 'function' ? getImageUrl(item.image) : `${baseUrl}${item.image}`;
        imgHtml = `<img src="${imgUrl}" alt="${item.title}" style="width:100%;height:100%;object-fit:cover;border-radius:inherit;" onerror="this.onerror=null; this.parentElement.innerHTML='<div class=\\'dir-img-ph\\'><i data-lucide=\\'${icon}\\'></i></div>'; if(window.lucide) lucide.createIcons();" />`;
      } else {
        imgHtml = `<div class="dir-img-ph"><i data-lucide="${icon}"></i></div>`;
      }

      list.innerHTML += `
        <div class="dash-item-row" data-item-id="${item._id}">
          <div class="dir-img-wrap">
            ${imgHtml}
          </div>
          <div class="dir-info">
            <div class="dir-top">
              <span class="tag ${tagClass}">${statusLabel}</span>
              <h3><a href="item-detail.html?id=${item._id}">${item.title}</a></h3>
            </div>
            <div class="dir-meta">
              <span><i data-lucide="map-pin"></i> ${item.location}</span>
              <span><i data-lucide="calendar"></i> ${new Date(item.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          <div class="dir-actions">
            <a href="item-detail.html?id=${item._id}" class="btn btn-sm btn-ghost" title="View details">
              <i data-lucide="eye"></i>
            </a>
            <button class="btn btn-sm btn-ghost dir-delete" title="Delete listing" onclick="confirmDelete(this)">
              <i data-lucide="trash-2"></i>
            </button>
          </div>
        </div>`;
    });

    const totalEl = document.getElementById('stat-total');
    const lostEl = document.getElementById('stat-lost');
    const foundEl = document.getElementById('stat-found');
    const returnedEl = document.getElementById('stat-returned');

    if (totalEl) totalEl.textContent = displayList.length;
    if (lostEl) lostEl.textContent = displayList.filter((i) => i.status === 'lost').length;
    if (foundEl) foundEl.textContent = displayList.filter((i) => i.status === 'found').length;
    if (returnedEl) returnedEl.textContent = displayList.filter((i) => i.status === 'returned').length;

    if (typeof lucide !== 'undefined') lucide.createIcons();
  } catch (error) {
    console.log('Dashboard items load error:', error);
  }
}

loadUserItems();

// Load claims from API
async function loadClaims() {
  try {
    const response = await fetch(`${baseUrl}/api/claims`);
    const data = await response.json();

    if (!data.success) return;

    const claimsList = document.querySelector('.claims-list');
    if (!claimsList) return;

    claimsList.innerHTML = '';

    if (data.data.length === 0) {
      claimsList.innerHTML = `
        <div class="history-empty" style="text-align:center;padding:2.5rem 1rem;">
          <i data-lucide="inbox" style="width:48px;height:48px;opacity:0.4;margin-bottom:1rem;"></i>
          <h3>No claim requests yet</h3>
          <p>When someone claims one of your posted items, it will appear here.</p>
        </div>`;
      if (typeof lucide !== 'undefined') lucide.createIcons();
      return;
    }

    const badge = document.querySelector('.tab-badge');
    const pendingCount = data.data.filter((c) => c.status === 'pending').length;
    if (badge) badge.textContent = pendingCount;

    data.data.forEach((claim) => {
      const statusColor =
        claim.status === 'approved'
          ? 'var(--clr-found)'
          : claim.status === 'rejected'
            ? 'var(--clr-lost)'
            : '';

      claimsList.innerHTML += `
        <div class="claim-card" id="claim-${claim._id}" style="${statusColor ? `border-color:${statusColor}` : ''}">
          <div class="claim-card-header">
            <div class="claim-user">
              <div class="claim-avatar"><i data-lucide="user-circle"></i></div>
              <div>
                <strong>${claim.claimerName}</strong>
                <p>${claim.claimerEmail}</p>
              </div>
            </div>
            <span class="tag ${claim.status === 'approved' ? 'tag-found' : claim.status === 'rejected' ? 'tag-lost' : 'tag-lost'}">
              ${claim.status === 'approved' ? 'Approved' : claim.status === 'rejected' ? 'Rejected' : 'Pending Claim'}
            </span>
          </div>
          <div class="claim-item-ref">
            <i data-lucide="package"></i>
            <span>Regarding: <strong>${claim.itemTitle}</strong></span>
          </div>
          <blockquote class="claim-message">"${claim.message}"</blockquote>
          ${
            claim.status === 'pending'
              ? `
          <div class="claim-actions">
            <button class="btn btn-primary btn-sm" onclick="handleClaim('${claim._id}', 'approved')">
              <i data-lucide="check"></i> Approve Claim
            </button>
            <button class="btn btn-outline btn-sm" onclick="handleClaim('${claim._id}', 'rejected')">
              <i data-lucide="x"></i> Reject
            </button>
          </div>`
              : `
          <div class="claim-actions">
            <span style="font-size:.85rem;color:${statusColor};font-weight:600;">
              ${claim.status === 'approved' ? '✓ Claim Approved — item marked as Returned' : '✗ Claim Rejected'}
            </span>
          </div>`
          }
        </div>`;
    });

    if (typeof lucide !== 'undefined') lucide.createIcons();
  } catch (error) {
    console.log('Claims load error:', error);
  }
}

// Claim approve/reject
async function handleClaim(claimId, status) {
  try {
    const response = await fetch(`${baseUrl}/api/claims/${claimId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });

    const data = await response.json();
    if (data.success) {
      loadClaims();
      loadUserItems();
    }
  } catch (error) {
    console.log('Claim update error:', error);
  }
}

loadClaims();
