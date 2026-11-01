/* ============================================
   UNIFIND — main.js
   Campus Lost & Found Platform
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  if (typeof lucide !== 'undefined') lucide.createIcons();

  const baseUrl = typeof API_BASE_URL !== 'undefined' ? API_BASE_URL : 'http://localhost:4000';

  /* --- Mobile Nav Toggle --- */
  const navToggle = document.querySelector('.nav-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen);
      mobileMenu.setAttribute('aria-hidden', !isOpen);
    });
    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
      });
    });
  }

  /* --- Filter Chips --- */
  const chips = document.querySelectorAll('.chip');
  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      chips.forEach((c) => c.classList.remove('chip-active'));
      chip.classList.add('chip-active');

      const filter = chip.dataset.filter;
      const itemCards = document.querySelectorAll('.item-card');

      itemCards.forEach((card) => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = '';
          card.style.animation = 'fadeSlideUp 0.3s ease both';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  /* --- Live Search --- */
  const searchInput = document.querySelector('.search-input');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.toLowerCase().trim();
      const itemCards = document.querySelectorAll('.item-card');
      itemCards.forEach((card) => {
        const title =
          card.querySelector('.item-card-title')?.textContent.toLowerCase() ||
          '';
        const desc =
          card.querySelector('.item-card-desc')?.textContent.toLowerCase() ||
          '';
        const loc =
          card.querySelector('.item-location')?.textContent.toLowerCase() || '';
        const matches =
          title.includes(query) || desc.includes(query) || loc.includes(query);
        card.style.display = matches ? '' : 'none';
      });
    });
  }

  /* --- Sticky nav shadow --- */
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener(
      'scroll',
      () => {
        header.style.boxShadow =
          window.scrollY > 10 ? '0 2px 20px rgba(44,36,32,0.1)' : 'none';
      },
      { passive: true }
    );
  }

  /* --- Format time helper --- */
  function formatRelativeTime(dateString) {
    if (!dateString) return 'Recent';
    const date = new Date(dateString);
    const diffMs = Date.now() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 5) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays}d ago`;
  }

  /* --- Load Real Items from API --- */
  async function loadItems() {
    const grid = document.getElementById('items-grid');
    if (!grid) return;

    try {
      const response = await fetch(`${baseUrl}/api/items`);
      const data = await response.json();

      if (!data.success) return;

      if (!data.data || data.data.length === 0) {
        grid.innerHTML = `
          <div style="grid-column: 1/-1; text-align: center; padding: 3rem 1rem; color: var(--clr-ink-light);">
            <i data-lucide="inbox" style="width:48px;height:48px;opacity:0.4;margin-bottom:1rem;"></i>
            <h3>No items listed yet</h3>
            <p>Be the first to report a lost or found item on campus!</p>
            <a href="report.html" class="btn btn-primary" style="margin-top:1rem;">Report an Item</a>
          </div>
        `;
        if (typeof lucide !== 'undefined') lucide.createIcons();
        return;
      }

      grid.innerHTML = '';

      data.data.forEach((item) => {
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
        const timeAgo = formatRelativeTime(item.createdAt);

        // Format Image HTML: Show real uploaded image if exists, else icon placeholder
        let imgHtml = '';
        if (item.image) {
          const imgUrl = typeof getImageUrl === 'function' ? getImageUrl(item.image) : `${baseUrl}${item.image}`;
          imgHtml = `
            <img src="${imgUrl}" alt="${item.title}" class="item-card-img" onerror="this.onerror=null; this.parentElement.innerHTML='<div class=\\'item-card-img-placeholder\\'><i data-lucide=\\'${icon}\\'></i></div>'; if(window.lucide) lucide.createIcons();" />
          `;
        } else {
          imgHtml = `
            <div class="item-card-img-placeholder">
              <i data-lucide="${icon}"></i>
            </div>
          `;
        }

        grid.innerHTML += `
          <article class="item-card" role="listitem" data-category="${item.category}">
            <a href="item-detail.html?id=${item._id}" class="item-card-img-wrap">
              ${imgHtml}
              <span class="tag ${tagClass} item-status-tag">${statusLabel}</span>
            </a>
            <div class="item-card-body">
              <div class="item-card-meta">
                <span class="item-location"><i data-lucide="map-pin"></i> ${item.location}</span>
                <span class="item-time"><i data-lucide="clock"></i> ${timeAgo}</span>
              </div>
              <h3 class="item-card-title">
                <a href="item-detail.html?id=${item._id}">${item.title}</a>
              </h3>
              <p class="item-card-desc">${item.description}</p>
              <div class="item-card-footer">
                <span class="item-poster"><i data-lucide="user-circle"></i> ${item.poster ? item.poster.split('@')[0] : 'Campus Member'}</span>
                <a href="item-detail.html?id=${item._id}#contact" class="btn btn-sm btn-primary">
                  <i data-lucide="send"></i> Contact
                </a>
              </div>
            </div>
          </article>`;
      });

      // Stats update
      const totalItems = data.count;
      const returnedItems = data.data.filter(
        (i) => i.status === 'returned'
      ).length;

      try {
        const userRes = await fetch(`${baseUrl}/api/auth/users/count`);
        const userData = await userRes.json();
        const totalUsers = userData.count || 0;

        const statNums = document.querySelectorAll('.stat-num');
        if (statNums.length >= 3) {
          statNums[0].textContent = (returnedItems || 12) + '+';
          statNums[1].textContent = totalItems;
          statNums[2].textContent = (totalUsers || 25) + '+';
        }

        const trustedEl = document.getElementById('trusted-count');
        if (trustedEl) {
          trustedEl.textContent = `Trusted by ${totalUsers > 0 ? totalUsers : 25}+ students`;
        }
      } catch (err) {
        console.log('User stats count load error:', err);
      }

      if (typeof lucide !== 'undefined') lucide.createIcons();
    } catch (error) {
      console.log('Items load nahi hue (falling back to mock items):', error);
    }
  }

  loadItems();
});
