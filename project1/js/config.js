/* ============================================================
   UNIFIND — config.js
   Hybrid Environment, Dynamic Session Navigation &
   Embedded Offline/Netlify Demo Engine (Zero Server Required)
   ============================================================ */

// 1. Backend URL Configuration
// If deploying backend separately on Render, put URL here. Leave empty for auto-detection/Netlify.
const PRODUCTION_BACKEND_URL = ''; 

const API_BASE_URL =
  window.API_BASE_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:4000'
    : PRODUCTION_BACKEND_URL || window.location.origin);

// 2. Helper for formatting item image URLs
function getImageUrl(imagePath) {
  if (!imagePath) return null;
  if (
    imagePath.startsWith('http://') ||
    imagePath.startsWith('https://') ||
    imagePath.startsWith('data:') ||
    imagePath.startsWith('blob:')
  ) {
    return imagePath;
  }
  return `${API_BASE_URL}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
}

/* ============================================================
   3. SEED DATA FOR LOCAL / NETLIFY DEMO MODE
   ============================================================ */
const INITIAL_DEMO_ITEMS = [
  {
    _id: 'item_101',
    title: 'iPhone 14 Pro – Space Black',
    category: 'electronics',
    status: 'lost',
    location: 'Science Block',
    description:
      'Lost near physics lab corridor around 2:00 PM. Has a matte black case with a minor scratch on screen protector.',
    poster: 'ahmed@university.edu',
    image: null,
    createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
  },
  {
    _id: 'item_102',
    title: 'Silver Key Bundle (3 Keys with Blue Lanyard)',
    category: 'keys',
    status: 'found',
    location: 'Cafeteria',
    description:
      'Found on the corner wooden table near the cafeteria entrance. Has 3 silver keys and a blue university lanyard.',
    poster: 'sara@university.edu',
    image: null,
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    _id: 'item_103',
    title: 'Navy Blue Backpack (Jansport)',
    category: 'bags',
    status: 'lost',
    location: 'Main Library',
    description:
      'Left on 2nd floor silent study desk. Contains lecture notebooks for Data Structures and a metallic water bottle.',
    poster: 'ahmed@university.edu',
    image: null,
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
  },
  {
    _id: 'item_104',
    title: 'Apple AirPods Pro in White Case',
    category: 'electronics',
    status: 'found',
    location: 'CS Department',
    description:
      'Found plugged into charging dock in Computer Lab 3. Has a small red silicone protective cover.',
    poster: 'bilal@university.edu',
    image: null,
    createdAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
  },
  {
    _id: 'item_105',
    title: 'Student ID Card & Green Wallet',
    category: 'documents',
    status: 'found',
    location: 'Student Center',
    description:
      'Found near ATM machine. Student ID belongs to Department of Mechanical Engineering. Safe with security desk.',
    poster: 'sara@university.edu',
    image: null,
    createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
  },
  {
    _id: 'item_106',
    title: 'TI-84 Plus CE Graphing Calculator',
    category: 'electronics',
    status: 'returned',
    location: 'Lecture Hall B',
    description:
      'Accidentally left after Calculus II midterm exam. Successfully returned to owner.',
    poster: 'ahmed@university.edu',
    image: null,
    createdAt: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
  },
];

const INITIAL_DEMO_USERS = [
  {
    id: 'user_1',
    name: 'Ahmed Khan',
    email: 'ahmed@university.edu',
    password: 'password123',
    studentId: '2024-CS-0042',
    department: 'Computer Science',
  },
  {
    id: 'user_2',
    name: 'Sara Malik',
    email: 'sara@university.edu',
    password: 'password123',
    studentId: '2023-EE-0118',
    department: 'Electrical Engineering',
  },
  {
    id: 'user_3',
    name: 'Bilal Tariq',
    email: 'bilal@university.edu',
    password: 'password123',
    studentId: '2024-BBA-0089',
    department: 'Business Administration',
  },
];

const INITIAL_DEMO_CLAIMS = [
  {
    _id: 'claim_1',
    itemId: 'item_102',
    itemTitle: 'Silver Key Bundle (3 Keys with Blue Lanyard)',
    claimerName: 'Hamza Farooq',
    claimerEmail: 'hamza@university.edu',
    message:
      'Hi Sara! I think these are my hostel room keys. One of them has a small notch near the base. Can we meet up?',
    status: 'pending',
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
  },
];

const INITIAL_DEMO_MESSAGES = [
  {
    itemId: 'item_101',
    sender: 'Sara Malik',
    text: 'Salam Ahmed, I saw a black iPhone at the Science Block reception desk earlier!',
    type: 'received',
    createdAt: new Date(Date.now() - 3600 * 1000).toISOString(),
  },
  {
    itemId: 'item_101',
    sender: 'Ahmed Khan',
    text: 'Thank you so much Sara! I will go check with reception right now.',
    type: 'sent',
    createdAt: new Date(Date.now() - 3500 * 1000).toISOString(),
  },
];

// Initialize LocalStorage Collections
function initLocalDatabase() {
  if (!localStorage.getItem('unifind_db_items')) {
    localStorage.setItem('unifind_db_items', JSON.stringify(INITIAL_DEMO_ITEMS));
  }
  if (!localStorage.getItem('unifind_db_users')) {
    localStorage.setItem('unifind_db_users', JSON.stringify(INITIAL_DEMO_USERS));
  }
  if (!localStorage.getItem('unifind_db_claims')) {
    localStorage.setItem('unifind_db_claims', JSON.stringify(INITIAL_DEMO_CLAIMS));
  }
  if (!localStorage.getItem('unifind_db_messages')) {
    localStorage.setItem('unifind_db_messages', JSON.stringify(INITIAL_DEMO_MESSAGES));
  }
}

initLocalDatabase();

/* ============================================================
   4. CLIENT DEMO ENGINE (MOCK REST API RESPONSES)
   Runs automatically on Netlify, GitHub Pages or whenever 
   MongoDB / Express is offline so the demo never breaks!
   ============================================================ */
async function handleMockApiRequest(url, init = {}) {
  const method = (init.method || 'GET').toUpperCase();
  const urlObj = new URL(url, window.location.href);
  const pathname = urlObj.pathname;

  // Simulate network latency (200ms) for realistic feel
  await new Promise((r) => setTimeout(r, 200));

  // --- /api/auth/users/count ---
  if (pathname.endsWith('/api/auth/users/count')) {
    const users = JSON.parse(localStorage.getItem('unifind_db_users') || '[]');
    return new Response(
      JSON.stringify({ success: true, count: users.length }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // --- /api/auth/login ---
  if (pathname.endsWith('/api/auth/login') && method === 'POST') {
    const body = typeof init.body === 'string' ? JSON.parse(init.body) : {};
    const users = JSON.parse(localStorage.getItem('unifind_db_users') || '[]');
    const user = users.find(
      (u) =>
        u.email.toLowerCase() === (body.email || '').trim().toLowerCase() &&
        u.password === body.password
    );

    if (user) {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Login successful!',
          data: {
            id: user.id || user._id,
            name: user.name,
            email: user.email,
            studentId: user.studentId || '',
            department: user.department || '',
          },
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } else {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Invalid email or password',
        }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  // --- /api/auth/register ---
  if (pathname.endsWith('/api/auth/register') && method === 'POST') {
    const body = typeof init.body === 'string' ? JSON.parse(init.body) : {};
    const users = JSON.parse(localStorage.getItem('unifind_db_users') || '[]');

    const existing = users.find(
      (u) => u.email.toLowerCase() === (body.email || '').trim().toLowerCase()
    );
    if (existing) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'An account already exists with this email address',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const newUser = {
      id: 'user_' + Date.now(),
      name: body.name,
      email: (body.email || '').toLowerCase().trim(),
      password: body.password,
      studentId: body.studentId || '',
      department: body.department || '',
    };
    users.push(newUser);
    localStorage.setItem('unifind_db_users', JSON.stringify(users));

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Registration successful!',
        data: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          studentId: newUser.studentId,
          department: newUser.department,
        },
      }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // --- /api/items ---
  if (pathname.endsWith('/api/items')) {
    const items = JSON.parse(localStorage.getItem('unifind_db_items') || '[]');

    if (method === 'GET') {
      const category = urlObj.searchParams.get('category');
      const status = urlObj.searchParams.get('status');
      const search = urlObj.searchParams.get('search');

      let filtered = [...items];
      if (category && category !== 'all') {
        filtered = filtered.filter((i) => i.category === category);
      }
      if (status && status !== 'all') {
        filtered = filtered.filter((i) => i.status === status);
      }
      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(
          (i) =>
            i.title.toLowerCase().includes(q) ||
            i.description.toLowerCase().includes(q) ||
            i.location.toLowerCase().includes(q)
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          count: filtered.length,
          data: filtered,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (method === 'POST') {
      let title, category, status, location, description, poster, image;

      if (init.body instanceof FormData) {
        title = init.body.get('title');
        category = init.body.get('category');
        status = init.body.get('status');
        location = init.body.get('location');
        description = init.body.get('description');
        poster = init.body.get('poster');
        const imgFile = init.body.get('image');
        if (imgFile && imgFile instanceof File && imgFile.size > 0) {
          image = URL.createObjectURL(imgFile);
        }
      } else if (typeof init.body === 'string') {
        const b = JSON.parse(init.body);
        title = b.title;
        category = b.category;
        status = b.status;
        location = b.location;
        description = b.description;
        poster = b.poster;
        image = b.image;
      }

      const newItem = {
        _id: 'item_' + Date.now(),
        title: title || 'Campus Item',
        category: category || 'other',
        status: status || 'lost',
        location: location || 'Campus',
        description: description || '',
        poster: poster || 'Student',
        image: image || null,
        createdAt: new Date().toISOString(),
      };

      items.unshift(newItem);
      localStorage.setItem('unifind_db_items', JSON.stringify(items));

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Item added successfully!',
          data: newItem,
        }),
        { status: 201, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  // --- /api/items/:id ---
  const itemMatch = pathname.match(/\/api\/items\/([^/]+)/);
  if (itemMatch) {
    const id = itemMatch[1];
    let items = JSON.parse(localStorage.getItem('unifind_db_items') || '[]');

    if (method === 'GET') {
      const item = items.find((i) => i._id === id || String(i.id) === id);
      if (item) {
        return new Response(
          JSON.stringify({ success: true, data: item }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      } else {
        return new Response(
          JSON.stringify({ success: false, message: 'Item not found' }),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    if (method === 'DELETE') {
      items = items.filter((i) => i._id !== id && String(i.id) !== id);
      localStorage.setItem('unifind_db_items', JSON.stringify(items));
      return new Response(
        JSON.stringify({ success: true, message: 'Item deleted!' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  // --- /api/claims ---
  if (pathname.endsWith('/api/claims')) {
    const claims = JSON.parse(localStorage.getItem('unifind_db_claims') || '[]');

    if (method === 'GET') {
      return new Response(
        JSON.stringify({ success: true, count: claims.length, data: claims }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (method === 'POST') {
      const body = typeof init.body === 'string' ? JSON.parse(init.body) : {};
      const newClaim = {
        _id: 'claim_' + Date.now(),
        itemId: body.itemId,
        itemTitle: body.itemTitle,
        claimerName: body.claimerName,
        claimerEmail: body.claimerEmail,
        message: body.message,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      claims.unshift(newClaim);
      localStorage.setItem('unifind_db_claims', JSON.stringify(claims));

      return new Response(
        JSON.stringify({ success: true, message: 'Claim submitted!', data: newClaim }),
        { status: 201, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  // --- /api/claims/:id ---
  const claimMatch = pathname.match(/\/api\/claims\/([^/]+)/);
  if (claimMatch && method === 'PUT') {
    const claimId = claimMatch[1];
    const body = typeof init.body === 'string' ? JSON.parse(init.body) : {};
    const claims = JSON.parse(localStorage.getItem('unifind_db_claims') || '[]');
    const claim = claims.find((c) => c._id === claimId);

    if (claim) {
      claim.status = body.status;
      localStorage.setItem('unifind_db_claims', JSON.stringify(claims));

      // If approved, automatically mark the item as returned!
      if (body.status === 'approved' && claim.itemId) {
        const items = JSON.parse(localStorage.getItem('unifind_db_items') || '[]');
        const targetItem = items.find((i) => i._id === claim.itemId || String(i.id) === claim.itemId);
        if (targetItem) {
          targetItem.status = 'returned';
          localStorage.setItem('unifind_db_items', JSON.stringify(items));
        }
      }

      return new Response(
        JSON.stringify({ success: true, message: `Claim ${body.status}!`, data: claim }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  // --- /api/messages ---
  if (pathname.endsWith('/api/messages') && method === 'POST') {
    const body = typeof init.body === 'string' ? JSON.parse(init.body) : {};
    const messages = JSON.parse(localStorage.getItem('unifind_db_messages') || '[]');
    const newMsg = {
      _id: 'msg_' + Date.now(),
      itemId: body.itemId,
      sender: body.sender,
      text: body.text,
      type: body.type,
      createdAt: new Date().toISOString(),
    };
    messages.push(newMsg);
    localStorage.setItem('unifind_db_messages', JSON.stringify(messages));

    return new Response(
      JSON.stringify({ success: true, data: newMsg }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // --- /api/messages/:itemId ---
  const msgMatch = pathname.match(/\/api\/messages\/([^/]+)/);
  if (msgMatch && method === 'GET') {
    const itemId = msgMatch[1];
    const messages = JSON.parse(localStorage.getItem('unifind_db_messages') || '[]');
    const itemMsgs = messages.filter((m) => m.itemId === itemId);

    return new Response(
      JSON.stringify({ success: true, data: itemMsgs }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Fallback 404
  return new Response(
    JSON.stringify({ success: false, message: 'Mock endpoint not found' }),
    { status: 404, headers: { 'Content-Type': 'application/json' } }
  );
}

// 5. Global Fetch Interceptor
const nativeFetch = window.fetch;
window.fetch = async function (input, init) {
  const url = typeof input === 'string' ? input : input && input.url ? input.url : '';

  if (url.includes('/api/')) {
    // If running locally, check if real Express backend is active
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1200);
        const options = Object.assign({}, init, { signal: controller.signal });
        const res = await nativeFetch(input, options);
        clearTimeout(timeoutId);
        return res;
      } catch (err) {
        // Express backend is offline locally -> seamless fallback to Mock DB
      }
    }
    // On Netlify / GitHub Pages / Cloud without backend -> Mock DB serves request
    return handleMockApiRequest(url, init);
  }

  return nativeFetch.apply(this, arguments);
};

/* ============================================================
   6. DYNAMIC SESSION NAVBAR & RECRUITER DEMO HELPER
   ============================================================ */
function initAuthNav() {
  const userStr = localStorage.getItem('unifind_user');

  try {
    const user = userStr ? JSON.parse(userStr) : null;
    const navActions = document.querySelector('.nav-actions');

    if (navActions && user) {
      const firstName = user.name ? user.name.split(' ')[0] : 'Account';
      navActions.innerHTML = `
        <a href="dashboard.html" class="btn btn-ghost" title="My Dashboard">
          <i data-lucide="user"></i> <span>Hi, ${firstName}</span>
        </a>
        <a href="report.html" class="btn btn-primary btn-sm">
          <i data-lucide="plus"></i> Report
        </a>
        <button id="nav-logout-btn" class="btn btn-ghost btn-sm" title="Logout">
          <i data-lucide="log-out"></i>
        </button>
      `;

      document.getElementById('nav-logout-btn')?.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('unifind_user');
        window.location.reload();
      });
    }

    // Update mobile menu
    const mobileMenuUl = document.querySelector('.mobile-menu ul');
    if (mobileMenuUl && user) {
      const loginLink = mobileMenuUl.querySelector('a[href="login.html"]');
      const regLink = mobileMenuUl.querySelector('a[href="register.html"]');
      if (loginLink && loginLink.parentElement) {
        loginLink.parentElement.innerHTML = `<a href="dashboard.html" class="nav-link"><i data-lucide="layout-dashboard"></i> Dashboard (${user.name.split(' ')[0]})</a>`;
      }
      if (regLink && regLink.parentElement) {
        regLink.parentElement.innerHTML = `<a href="#" id="mobile-logout-btn" class="nav-link"><i data-lucide="log-out"></i> Sign Out</a>`;
        document.getElementById('mobile-logout-btn')?.addEventListener('click', (e) => {
          e.preventDefault();
          localStorage.removeItem('unifind_user');
          window.location.reload();
        });
      }
    }

    // Auto-fill button for recruiters on Login Page
    const loginForm = document.getElementById('login-form');
    if (loginForm && !document.getElementById('demo-credentials-box')) {
      const demoBox = document.createElement('div');
      demoBox.id = 'demo-credentials-box';
      demoBox.className = 'demo-quick-login';
      demoBox.innerHTML = `
        <div class="dql-content">
          <i data-lucide="sparkles"></i>
          <div>
            <strong>Recruiter / Reviewer?</strong>
            <span>Quick test with preloaded student account</span>
          </div>
        </div>
        <button type="button" id="demo-fill-btn" class="btn btn-sm btn-primary">
          <i data-lucide="key-round"></i> Auto Fill
        </button>
      `;
      loginForm.parentElement.insertBefore(demoBox, loginForm);

      document.getElementById('demo-fill-btn')?.addEventListener('click', () => {
        const emailInput = document.getElementById('email');
        const passInput = document.getElementById('password');
        if (emailInput) emailInput.value = 'ahmed@university.edu';
        if (passInput) passInput.value = 'password123';
        const errorBox = document.getElementById('login-error');
        if (errorBox) errorBox.hidden = true;
      });
    }

    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  } catch (e) {
    console.error('Error updating navigation:', e);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initAuthNav();
});
