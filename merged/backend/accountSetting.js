document.addEventListener('DOMContentLoaded', () => {
    // Fetch and display the user's current settings on page load
    fetch('/api/settings', {
        method: 'GET',
        credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
        document.querySelector('.Username').value = data.username || '';
        document.querySelector('.Email').value = data.email || '';
        // Password is not fetched for security reasons
    })
    .catch(error => console.error('Error:', error));

    // Event listeners for editing fields
    document.querySelector('.change-username-button').addEventListener('click', () => enableEdit('.Username'));
    document.querySelector('.change-email-button').addEventListener('click', () => enableEdit('.Email'));
    document.querySelector('.change-password-button').addEventListener('click', () => enableEdit('.Password'));

    // Event listener for saving changes
    document.querySelector('.Done').addEventListener('click', saveChanges);
});

function enableEdit(selector) {
    const element = document.querySelector(selector);
    element.removeAttribute('disabled');
    element.focus();
}

function saveChanges() {
    const username = document.querySelector('.Username').value;
    const email = document.querySelector('.Email').value;
    const password = document.querySelector('.Password').value;

    if (validateUserData(username, email, password)) {
        sendUpdateRequest({ username, email, password });
    }
}

function validateUserData(username, email, password) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!username.trim()) {
            alert('Username cannot be empty.');
            return false;
        }
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address.');
            return false;
        }
        if (password.length < 8) {
            alert('Password must be at least 8 characters long.');
            return false;
        }
        return true;
    
}

function sendUpdateRequest(data) {
    fetch('/api/updateSettings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
        alert('Changes saved successfully.');
        window.location.href = 'General.html'; // Redirect on success
    })
    .catch((error) => console.error('Error:', error));
}
