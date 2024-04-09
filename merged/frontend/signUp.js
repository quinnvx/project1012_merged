function sendAuthRequest(url, data) {
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  .then(response => response.json())
  .then(result => {
    alert(result.message);
    if (result.success) {
      window.location.href = 'General.html';
    }
  })
  .catch(error => {
    alert('Error: ' + error.message);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('SignUpForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const username = document.getElementById('signupUsername').value;
    const password = document.getElementById('signupPassword').value;
    if (username && password) {
      sendAuthRequest('/api/signup', { username, password });
    } else {
      alert('Please enter both username and password.');
    }
  });

  document.getElementById('LoginForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    if (username && password) {
      sendAuthRequest('/api/login', { username, password });
    } else {
      alert('Please enter both username and password.');
    }
  });
  
  document.getElementById('showSignupBtn').addEventListener('click', () => {
    document.getElementById('LoginForm').style.display = 'none';
    document.getElementById('SignUpForm').style.display = 'block';
  });

  document.getElementById('showLoginBtn').addEventListener('click', () => {
    document.getElementById('SignUpForm').style.display = 'none';
    document.getElementById('LoginForm').style.display = 'block';
  });
});
