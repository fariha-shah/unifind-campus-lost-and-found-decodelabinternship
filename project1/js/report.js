/* ============================================
   UNIFIND — report.js
   Report form: type toggle, validation, upload
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  if (typeof lucide !== 'undefined') lucide.createIcons();

  const baseUrl =
    typeof API_BASE_URL !== 'undefined' ? API_BASE_URL : 'http://localhost:4000';
  const currentUser = JSON.parse(localStorage.getItem('unifind_user') || 'null');

  // Autofill logged in user email if available
  const emailInput = document.getElementById('contact-email');
  if (emailInput && currentUser && currentUser.email) {
    emailInput.value = currentUser.email;
  }

  // Set date default to today
  const dateInput = document.getElementById('item-date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
    dateInput.max = today;
  }

  // Read URL param for pre-selecting type
  const params = new URLSearchParams(window.location.search);
  const preType = params.get('type');
  if (preType === 'found') {
    document.getElementById('btn-found')?.click();
  }

  // Type toggle
  const btnLost = document.getElementById('btn-lost');
  const btnFound = document.getElementById('btn-found');
  const successMsg = document.getElementById('success-msg');

  function setType(type) {
    btnLost.classList.toggle('active', type === 'lost');
    btnFound.classList.toggle('active', type === 'found');
    if (successMsg) {
      successMsg.textContent =
        type === 'lost'
          ? "Your lost item report has been posted. We'll notify you when someone responds."
          : "Your found item report has been posted. We'll try to match it with the owner.";
    }
  }

  btnLost?.addEventListener('click', () => setType('lost'));
  btnFound?.addEventListener('click', () => setType('found'));

  // Character counter
  const desc = document.getElementById('description');
  const counter = document.getElementById('desc-count');
  const MAX = 300;
  desc?.addEventListener('input', () => {
    const len = desc.value.length;
    if (counter) counter.textContent = `${len} / ${MAX}`;
    if (counter) counter.classList.toggle('over', len > MAX);
    if (len > MAX) desc.value = desc.value.substring(0, MAX);
  });

  // Image upload preview
  const uploadInput = document.getElementById('image-upload');
  const uploadZone = document.getElementById('upload-zone');
  const placeholder = document.getElementById('upload-placeholder');
  const preview = document.getElementById('upload-preview');
  const previewImg = document.getElementById('preview-img');
  const removeBtn = document.getElementById('remove-img');

  function showPreview(file) {
    if (!file || !file.type.startsWith('image/')) {
      document.getElementById('image-error').textContent =
        'Please select a valid image file (JPG, PNG, WEBP).';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      document.getElementById('image-error').textContent =
        'File size must be under 5MB.';
      return;
    }
    document.getElementById('image-error').textContent = '';
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImg.src = e.target.result;
      placeholder.hidden = true;
      preview.hidden = false;
    };
    reader.readAsDataURL(file);
  }

  uploadInput?.addEventListener('change', (e) => {
    if (e.target.files[0]) showPreview(e.target.files[0]);
  });

  removeBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    uploadInput.value = '';
    previewImg.src = '';
    placeholder.hidden = false;
    preview.hidden = true;
  });

  // Drag and drop
  uploadZone?.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadZone.classList.add('drag-over');
  });
  uploadZone?.addEventListener('dragleave', () =>
    uploadZone.classList.remove('drag-over')
  );
  uploadZone?.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadZone.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file) {
      showPreview(file);
    }
  });

  // Form validation helpers
  function setError(fgId, errId, msg) {
    document.getElementById(fgId)?.classList.add('error');
    document.getElementById(fgId)?.classList.remove('valid');
    if (errId) document.getElementById(errId).textContent = msg;
  }
  function setValid(fgId, errId) {
    document.getElementById(fgId)?.classList.remove('error');
    document.getElementById(fgId)?.classList.add('valid');
    if (errId) document.getElementById(errId).textContent = '';
  }

  // Blur validators
  document.getElementById('item-name')?.addEventListener('blur', () => {
    const v = document.getElementById('item-name').value.trim();
    if (!v)
      setError('fg-item-name', 'item-name-error', 'Item name is required.');
    else if (v.length < 3)
      setError(
        'fg-item-name',
        'item-name-error',
        'Must be at least 3 characters.'
      );
    else setValid('fg-item-name', 'item-name-error');
  });

  document.getElementById('category')?.addEventListener('change', () => {
    if (!document.getElementById('category').value)
      setError('fg-category', 'category-error', 'Please select a category.');
    else setValid('fg-category', 'category-error');
  });

  document.getElementById('description')?.addEventListener('blur', () => {
    const v = document.getElementById('description').value.trim();
    if (!v)
      setError(
        'fg-description',
        'description-error',
        'Description is required.'
      );
    else if (v.length < 15)
      setError(
        'fg-description',
        'description-error',
        'Please add more detail (min 15 chars).'
      );
    else setValid('fg-description', 'description-error');
  });

  document.getElementById('location')?.addEventListener('change', () => {
    if (!document.getElementById('location').value)
      setError('fg-location', 'location-error', 'Please select a location.');
    else setValid('fg-location', 'location-error');
  });

  document.getElementById('contact-email')?.addEventListener('blur', () => {
    const v = document.getElementById('contact-email').value.trim();
    if (!v)
      setError('fg-contact-email', 'contact-email-error', 'Email is required.');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v))
      setError(
        'fg-contact-email',
        'contact-email-error',
        'Enter a valid email.'
      );
    else setValid('fg-contact-email', 'contact-email-error');
  });

  // Submit
  document
    .getElementById('report-form')
    ?.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('item-name').value.trim();
      const cat = document.getElementById('category').value;
      const desc = document.getElementById('description').value.trim();
      const loc = document.getElementById('location').value;
      const email = document.getElementById('contact-email').value.trim();

      let valid = true;
      if (!name || name.length < 3) {
        setError('fg-item-name', 'item-name-error', 'Item name is required.');
        valid = false;
      } else setValid('fg-item-name', 'item-name-error');

      if (!cat) {
        setError('fg-category', 'category-error', 'Please select a category.');
        valid = false;
      } else setValid('fg-category', 'category-error');

      if (!desc || desc.length < 15) {
        setError(
          'fg-description',
          'description-error',
          'Please add more detail (min 15 chars).'
        );
        valid = false;
      } else setValid('fg-description', 'description-error');

      if (!loc) {
        setError('fg-location', 'location-error', 'Please select a location.');
        valid = false;
      } else setValid('fg-location', 'location-error');

      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setError(
          'fg-contact-email',
          'contact-email-error',
          'Enter a valid email.'
        );
        valid = false;
      } else setValid('fg-contact-email', 'contact-email-error');

      if (!valid) {
        document
          .querySelector('.form-group.error')
          ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      const btn = document.getElementById('report-btn');
      const btnText = document.getElementById('report-btn-text');
      btn.disabled = true;
      btnText.textContent = 'Submitting...';

      const formData = new FormData();
      formData.append('title', name);
      formData.append('category', cat);
      formData.append(
        'status',
        document.getElementById('btn-lost').classList.contains('active')
          ? 'lost'
          : 'found'
      );
      formData.append('location', loc);
      formData.append('description', desc);
      formData.append('poster', email);

      const imageFile = document.getElementById('image-upload').files[0];
      if (imageFile) formData.append('image', imageFile);

      try {
        const response = await fetch(`${baseUrl}/api/items`, {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (data.success) {
          document.getElementById('success-overlay').hidden = false;
          if (typeof lucide !== 'undefined') lucide.createIcons();
        } else {
          alert('Error: ' + data.message);
          btn.disabled = false;
          btnText.textContent = 'Submit Report';
        }
      } catch (error) {
        alert('Could not connect to backend server. Please verify the API is running.');
        btn.disabled = false;
        btnText.textContent = 'Submit Report';
      }
    });
});
