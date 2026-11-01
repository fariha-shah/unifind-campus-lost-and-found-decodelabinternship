/* ============================================
   UNIFIND — auth.js
   Login & Register form validation
   Connected to Backend API
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  if (typeof lucide !== 'undefined') lucide.createIcons();

  const baseUrl =
    typeof API_BASE_URL !== 'undefined' ? API_BASE_URL : 'http://localhost:4000';

  /* ================================================
     SHARED UTILITIES
     ================================================ */
  async function loadLoginStats() {
    try {
      const itemsRes = await fetch(`${baseUrl}/api/items`);
      const itemsData = await itemsRes.json();

      const usersRes = await fetch(`${baseUrl}/api/auth/users/count`);
      const usersData = await usersRes.json();

      const itemsEl = document.getElementById('login-stat-items');
      const usersEl = document.getElementById('login-stat-users');

      if (itemsEl) itemsEl.textContent = (itemsData.count || 6) + '+';
      if (usersEl) usersEl.textContent = (usersData.count || 15) + '+';
    } catch (error) {
      console.log('Stats load error:', error);
    }
  }

  loadLoginStats();

  function setError(fieldGroupId, errorId, message) {
    const group = document.getElementById(fieldGroupId);
    const errorEl = document.getElementById(errorId);
    if (group) group.classList.add('error');
    if (group) group.classList.remove('valid');
    if (errorEl) errorEl.textContent = message;
  }

  function setValid(fieldGroupId, errorId) {
    const group = document.getElementById(fieldGroupId);
    const errorEl = document.getElementById(errorId);
    if (group) group.classList.remove('error');
    if (group) group.classList.add('valid');
    if (errorEl) errorEl.textContent = '';
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function isUniversityEmail(email) {
    const personal = ['yahoo.com', 'hotmail.com'];
    const domain = email.split('@')[1];
    // Allow gmail for easy recruiter testing, reject random unformatted
    return domain && !personal.includes(domain.toLowerCase());
  }

  function setupPasswordToggle(toggleId, inputId) {
    const btn = document.getElementById(toggleId);
    const input = document.getElementById(inputId);
    if (!btn || !input) return;
    btn.addEventListener('click', () => {
      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';
      btn
        .querySelector('i')
        .setAttribute('data-lucide', isPassword ? 'eye-off' : 'eye');
      lucide.createIcons();
    });
  }

  function setLoading(btn, isLoading) {
    if (!btn) return;
    if (isLoading) {
      btn.classList.add('loading');
      btn.querySelector('span').textContent = 'Please wait...';
    } else {
      btn.classList.remove('loading');
    }
  }

  /* ================================================
     LOGIN FORM
     ================================================ */
  const loginForm = document.getElementById('login-form');

  if (loginForm) {
    setupPasswordToggle('toggle-password', 'password');

    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const errorBox = document.getElementById('login-error');
    const loginBtn = document.getElementById('login-btn');

    emailInput?.addEventListener('blur', () => validateLoginEmail());
    passwordInput?.addEventListener('blur', () => validateLoginPassword());
    emailInput?.addEventListener('input', () => {
      if (emailInput.value) validateLoginEmail();
    });

    function validateLoginEmail() {
      const val = emailInput.value.trim();
      if (!val) {
        setError('fg-email', 'email-error', 'Email is required.');
        return false;
      }
      if (!isValidEmail(val)) {
        setError(
          'fg-email',
          'email-error',
          'Please enter a valid email address.'
        );
        return false;
      }
      setValid('fg-email', 'email-error');
      return true;
    }

    function validateLoginPassword() {
      const val = passwordInput.value;
      if (!val) {
        setError('fg-password', 'password-error', 'Password is required.');
        return false;
      }
      if (val.length < 6) {
        setError(
          'fg-password',
          'password-error',
          'Password must be at least 6 characters.'
        );
        return false;
      }
      setValid('fg-password', 'password-error');
      return true;
    }

    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const emailOk = validateLoginEmail();
      const passwordOk = validateLoginPassword();
      if (!emailOk || !passwordOk) return;

      errorBox.hidden = true;
      setLoading(loginBtn, true);

      try {
        const response = await fetch(`${baseUrl}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: emailInput.value.trim(),
            password: passwordInput.value,
          }),
        });

        const data = await response.json();
        setLoading(loginBtn, false);

        if (data.success) {
          localStorage.setItem('unifind_user', JSON.stringify(data.data));
          loginBtn.innerHTML =
            '<i data-lucide="check"></i><span>Signed In!</span>';
          loginBtn.style.background = 'var(--clr-found)';
          lucide.createIcons();
          setTimeout(() => {
            window.location.href = 'dashboard.html';
          }, 800);
        } else {
          errorBox.querySelector('#login-error-msg').textContent =
            data.message || 'Invalid email or password.';
          errorBox.hidden = false;
          loginBtn.querySelector('span').textContent = 'Sign In';
        }
      } catch (error) {
        setLoading(loginBtn, false);
        errorBox.querySelector('#login-error-msg').textContent =
          'Unable to reach backend server. Please verify backend is running.';
        errorBox.hidden = false;
        loginBtn.querySelector('span').textContent = 'Sign In';
      }
    });
  }

  /* ================================================
     REGISTER FORM
     ================================================ */
  const registerForm = document.getElementById('register-form');

  if (registerForm) {
    setupPasswordToggle('toggle-reg-password', 'reg-password');
    setupPasswordToggle('toggle-confirm-password', 'confirm-password');

    const firstnameInput = document.getElementById('firstname');
    const lastnameInput = document.getElementById('lastname');
    const emailInput = document.getElementById('reg-email');
    const studentIdInput = document.getElementById('student-id');
    const departmentInput = document.getElementById('department');
    const passwordInput = document.getElementById('reg-password');
    const confirmInput = document.getElementById('confirm-password');
    const termsInput = document.getElementById('terms');
    const errorBox = document.getElementById('register-error');
    const successBox = document.getElementById('register-success');
    const registerBtn = document.getElementById('register-btn');
    const panelSteps = document.querySelectorAll('.ap-step');

    /* Password Strength */
    passwordInput?.addEventListener('input', () => {
      const val = passwordInput.value;
      const bars = document.querySelectorAll('.strength-bar');
      const label = document.getElementById('strength-label');
      const srDesc = document.getElementById('password-strength-desc');
      if (!bars.length) return;

      let score = 0;
      if (val.length >= 8) score++;
      if (/[A-Z]/.test(val)) score++;
      if (/[0-9]/.test(val)) score++;
      if (/[^A-Za-z0-9]/.test(val)) score++;

      const levels = ['', 'weak', 'fair', 'good', 'strong'];
      const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];

      bars.forEach((bar, i) => {
        bar.className = 'strength-bar';
        if (i < score) bar.classList.add(levels[score]);
      });

      if (label) label.textContent = val ? labels[score] : '';
      if (srDesc)
        srDesc.textContent = val ? `Password strength: ${labels[score]}` : '';

      if (score >= 2 && panelSteps[1]) {
        panelSteps[0]?.classList.add('completed');
        panelSteps[0]?.classList.remove('active');
        panelSteps[1]?.classList.add('active');
      }
    });

    /* Validation functions */
    function validateFirstName() {
      const val = firstnameInput?.value.trim();
      if (!val) {
        setError('fg-firstname', 'firstname-error', 'First name is required.');
        return false;
      }
      if (val.length < 2) {
        setError(
          'fg-firstname',
          'firstname-error',
          'Must be at least 2 characters.'
        );
        return false;
      }
      setValid('fg-firstname', 'firstname-error');
      return true;
    }

    function validateLastName() {
      const val = lastnameInput?.value.trim();
      if (!val) {
        setError('fg-lastname', 'lastname-error', 'Last name is required.');
        return false;
      }
      setValid('fg-lastname', 'lastname-error');
      return true;
    }

    function validateEmail() {
      const val = emailInput?.value.trim();
      if (!val) {
        setError('fg-reg-email', 'reg-email-error', 'Email is required.');
        return false;
      }
      if (!isValidEmail(val)) {
        setError(
          'fg-reg-email',
          'reg-email-error',
          'Please enter a valid email address.'
        );
        return false;
      }
      setValid('fg-reg-email', 'reg-email-error');
      return true;
    }

    function validateStudentId() {
      const val = studentIdInput?.value.trim();
      if (!val) {
        setError(
          'fg-student-id',
          'student-id-error',
          'Student ID is required.'
        );
        return false;
      }
      if (val.length < 4) {
        setError(
          'fg-student-id',
          'student-id-error',
          'Enter a valid student ID.'
        );
        return false;
      }
      setValid('fg-student-id', 'student-id-error');
      return true;
    }

    function validateDepartment() {
      const val = departmentInput?.value;
      if (!val) {
        setError(
          'fg-department',
          'department-error',
          'Please select your department.'
        );
        return false;
      }
      setValid('fg-department', 'department-error');
      return true;
    }

    function validatePassword() {
      const val = passwordInput?.value;
      if (!val) {
        setError(
          'fg-reg-password',
          'reg-password-error',
          'Password is required.'
        );
        return false;
      }
      if (val.length < 6) {
        setError(
          'fg-reg-password',
          'reg-password-error',
          'Password must be at least 6 characters.'
        );
        return false;
      }
      setValid('fg-reg-password', 'reg-password-error');
      return true;
    }

    function validateConfirmPassword() {
      const val = confirmInput?.value;
      if (!val) {
        setError(
          'fg-confirm-password',
          'confirm-password-error',
          'Please confirm your password.'
        );
        return false;
      }
      if (val !== passwordInput?.value) {
        setError(
          'fg-confirm-password',
          'confirm-password-error',
          'Passwords do not match.'
        );
        return false;
      }
      setValid('fg-confirm-password', 'confirm-password-error');
      return true;
    }

    function validateTerms() {
      if (!termsInput?.checked) {
        document.getElementById('terms-error').textContent =
          'You must accept the terms to continue.';
        return false;
      }
      document.getElementById('terms-error').textContent = '';
      return true;
    }

    /* Blur listeners */
    firstnameInput?.addEventListener('blur', validateFirstName);
    lastnameInput?.addEventListener('blur', validateLastName);
    emailInput?.addEventListener('blur', validateEmail);
    studentIdInput?.addEventListener('blur', validateStudentId);
    departmentInput?.addEventListener('change', validateDepartment);
    passwordInput?.addEventListener('blur', validatePassword);
    confirmInput?.addEventListener('blur', validateConfirmPassword);
    confirmInput?.addEventListener('input', () => {
      if (confirmInput.value) validateConfirmPassword();
    });

    /* Register submit */
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const checks = [
        validateFirstName(),
        validateLastName(),
        validateEmail(),
        validateStudentId(),
        validateDepartment(),
        validatePassword(),
        validateConfirmPassword(),
        validateTerms(),
      ];

      if (checks.includes(false)) {
        errorBox.querySelector('#register-error-msg').textContent =
          'Please fix the errors above.';
        errorBox.hidden = false;
        registerForm
          .querySelector('.form-group.error')
          ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      errorBox.hidden = true;
      setLoading(registerBtn, true);

      try {
        const response = await fetch(`${baseUrl}/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: `${firstnameInput.value.trim()} ${lastnameInput.value.trim()}`,
            email: emailInput.value.trim(),
            password: passwordInput.value,
            studentId: studentIdInput ? studentIdInput.value.trim() : '',
            department: departmentInput ? departmentInput.value : '',
          }),
        });

        const data = await response.json();
        setLoading(registerBtn, false);

        if (data.success) {
          panelSteps[1]?.classList.add('completed');
          panelSteps[1]?.classList.remove('active');
          panelSteps[2]?.classList.add('active');
          successBox.hidden = false;
          registerBtn.innerHTML =
            '<i data-lucide="check-circle"></i><span>Account Created!</span>';
          registerBtn.style.background = 'var(--clr-found)';
          lucide.createIcons();
          setTimeout(() => {
            window.location.href = 'login.html';
          }, 1500);
        } else {
          errorBox.querySelector('#register-error-msg').textContent =
            data.message || 'Registration failed.';
          errorBox.hidden = false;
          registerBtn.querySelector('span').textContent = 'Create Account';
        }
      } catch (error) {
        setLoading(registerBtn, false);
        errorBox.querySelector('#register-error-msg').textContent =
          'Unable to reach backend server. Please verify backend is running.';
        errorBox.hidden = false;
        registerBtn.querySelector('span').textContent = 'Create Account';
      }
    });
  }
});
