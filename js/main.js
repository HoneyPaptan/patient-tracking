// Store references that need to be accessed globally
const currentUser = {
    isLoggedIn: false,
    userData: null
};

// Local Storage Keys
const STORAGE_KEYS = {
    USERS: 'patientcare_users',
    CURRENT_USER: 'patientcare_current_user',
    APPOINTMENTS: 'patientcare_appointments',
    PRESCRIPTIONS: 'patientcare_prescriptions'
};

// Initialize local storage with sample data if empty
function initializeLocalStorage() {
    // Check if users exist
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
        const sampleUsers = [
            {
                email: 'admin@example.com',
                password: 'password123',
                firstName: 'Admin',
                lastName: 'User',
                age: 35,
                gender: 'male',
                phone: '123-456-7890'
            }
        ];
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(sampleUsers));
    }

    // Check if appointments exist
    if (!localStorage.getItem(STORAGE_KEYS.APPOINTMENTS)) {
        const sampleAppointments = [
            {
                id: 1,
                userId: 'admin@example.com',
                doctor: 'Dr. John Smith',
                date: '2024-07-15',
                time: '10:00',
                reason: 'Annual checkup',
                status: 'confirmed'
            }
        ];
        localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(sampleAppointments));
    }

    // Check if prescriptions exist
    if (!localStorage.getItem(STORAGE_KEYS.PRESCRIPTIONS)) {
        const samplePrescriptions = [
            {
                id: 1,
                userId: 'admin@example.com',
                doctor: 'Dr. John Smith',
                date: '2024-06-15',
                medications: [
                    {
                        name: 'Paracetamol',
                        dosage: '500mg',
                        instructions: 'Take twice daily with meals'
                    }
                ]
            }
        ];
        localStorage.setItem(STORAGE_KEYS.PRESCRIPTIONS, JSON.stringify(samplePrescriptions));
    }

    // Check if user is logged in from previous session
    const savedUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (savedUser) {
        currentUser.isLoggedIn = true;
        currentUser.userData = JSON.parse(savedUser);
        updateUIForLoggedInUser();
    }
}

// Form Validation Functions
function validateLoginForm(event) {
    event.preventDefault();
    
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    const rememberMe = document.getElementById('remember');
    
    let isValid = true;
    
    // Reset error messages
    resetErrors();
    
    // Email validation
    if (!email.value) {
        showError(emailError, 'Email is required');
        isValid = false;
    } else if (!isValidEmail(email.value)) {
        showError(emailError, 'Please enter a valid email address');
        isValid = false;
    }
    
    // Password validation
    if (!password.value) {
        showError(passwordError, 'Password is required');
        isValid = false;
    }
    
    if (isValid) {
        // Authenticate user with localStorage
        const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || [];
        const user = users.find(u => u.email === email.value && u.password === password.value);
        
        if (user) {
            // Login successful
            loginUser(user, rememberMe.checked);
            window.location.href = 'index.html';
        } else {
            // Login failed
            showError(passwordError, 'Invalid email or password');
        }
    }
    
    return false;
}

function validateRegisterForm(event) {
    event.preventDefault();
    
    const firstName = document.getElementById('firstName');
    const lastName = document.getElementById('lastName');
    const email = document.getElementById('email');
    const age = document.getElementById('age');
    const gender = document.getElementById('gender');
    const phone = document.getElementById('phone');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    const terms = document.getElementById('terms');
    
    let isValid = true;
    
    // Reset error messages
    resetErrors();
    
    // First Name validation
    if (!firstName.value.trim()) {
        showError(document.getElementById('firstNameError'), 'First name is required');
        isValid = false;
    }
    
    // Last Name validation
    if (!lastName.value.trim()) {
        showError(document.getElementById('lastNameError'), 'Last name is required');
        isValid = false;
    }
    
    // Email validation
    if (!email.value) {
        showError(document.getElementById('emailError'), 'Email is required');
        isValid = false;
    } else if (!isValidEmail(email.value)) {
        showError(document.getElementById('emailError'), 'Please enter a valid email address');
        isValid = false;
    } else {
        // Check if email already exists
        const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || [];
        const existingUser = users.find(u => u.email === email.value);
        if (existingUser) {
            showError(document.getElementById('emailError'), 'Email already in use');
            isValid = false;
        }
    }
    
    // Age validation
    if (!age.value) {
        showError(document.getElementById('ageError'), 'Age is required');
        isValid = false;
    } else if (age.value < 0 || age.value > 150) {
        showError(document.getElementById('ageError'), 'Please enter a valid age');
        isValid = false;
    }
    
    // Gender validation
    if (!gender.value) {
        showError(document.getElementById('genderError'), 'Please select a gender');
        isValid = false;
    }
    
    // Phone validation
    if (!phone.value) {
        showError(document.getElementById('phoneError'), 'Phone number is required');
        isValid = false;
    } else if (!isValidPhone(phone.value)) {
        showError(document.getElementById('phoneError'), 'Please enter a valid phone number');
        isValid = false;
    }
    
    // Password validation
    if (!password.value) {
        showError(document.getElementById('passwordError'), 'Password is required');
        isValid = false;
    } else if (password.value.length < 8) {
        showError(document.getElementById('passwordError'), 'Password must be at least 8 characters long');
        isValid = false;
    }
    
    // Confirm Password validation
    if (!confirmPassword.value) {
        showError(document.getElementById('confirmPasswordError'), 'Please confirm your password');
        isValid = false;
    } else if (password.value !== confirmPassword.value) {
        showError(document.getElementById('confirmPasswordError'), 'Passwords do not match');
        isValid = false;
    }
    
    // Terms validation
    if (!terms.checked) {
        showError(document.getElementById('termsError'), 'You must accept the terms and conditions');
        isValid = false;
    }
    
    if (isValid) {
        // Register user
        const newUser = {
            firstName: firstName.value.trim(),
            lastName: lastName.value.trim(),
            email: email.value,
            age: parseInt(age.value),
            gender: gender.value,
            phone: phone.value,
            password: password.value
        };
        
        // Save to localStorage
        const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || [];
        users.push(newUser);
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
        
        // Auto login after registration
        loginUser(newUser, true);
        
        // Redirect to home page
        window.location.href = 'index.html';
    }
    
    return false;
}

function validateAppointmentForm(event) {
    event.preventDefault();
    
    // Check if user is logged in
    if (!currentUser.isLoggedIn) {
        window.location.href = 'login.html';
        return false;
    }
    
    const doctor = document.getElementById('doctor');
    const appointmentDate = document.getElementById('appointmentDate');
    const appointmentTime = document.getElementById('appointmentTime');
    const reason = document.getElementById('reason');
    
    let isValid = true;
    
    // Reset error messages
    resetErrors();
    
    // Doctor validation
    if (!doctor.value) {
        showError(document.getElementById('doctorError'), 'Please select a doctor');
        isValid = false;
    }
    
    // Date validation
    if (!appointmentDate.value) {
        showError(document.getElementById('dateError'), 'Please select a date');
        isValid = false;
    } else if (!isValidFutureDate(appointmentDate.value)) {
        showError(document.getElementById('dateError'), 'Please select a future date');
        isValid = false;
    }
    
    // Time validation
    if (!appointmentTime.value) {
        showError(document.getElementById('timeError'), 'Please select a time');
        isValid = false;
    }
    
    // Reason validation
    if (!reason.value.trim()) {
        showError(document.getElementById('reasonError'), 'Please provide a reason for the visit');
        isValid = false;
    }
    
    if (isValid) {
        // Get appointments from localStorage
        const appointments = JSON.parse(localStorage.getItem(STORAGE_KEYS.APPOINTMENTS)) || [];
        
        // Create new appointment
        const newAppointment = {
            id: Date.now(), // unique ID based on timestamp
            userId: currentUser.userData.email,
            doctor: doctor.value,
            date: appointmentDate.value,
            time: appointmentTime.value,
            reason: reason.value.trim(),
            status: 'pending'
        };
        
        // Save appointment
        appointments.push(newAppointment);
        localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
        
        // Reset form and show success message
        document.getElementById('appointmentForm').reset();
        alert('Appointment booked successfully!');
        
        // Reload appointments table if it exists
        loadUserAppointments();
    }
    
    return false;
}

// Helper Functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    return phoneRegex.test(phone);
}

function isValidFutureDate(date) {
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate >= today;
}

function showError(element, message) {
    element.textContent = message;
    element.style.display = 'block';
}

function resetErrors() {
    const errorElements = document.getElementsByClassName('error-message');
    for (let element of errorElements) {
        element.style.display = 'none';
        element.textContent = '';
    }
}

// User Authentication Functions
function loginUser(user, remember) {
    // Set current user
    currentUser.isLoggedIn = true;
    currentUser.userData = {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
    };
    
    // Save to localStorage if remember me is checked
    if (remember) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser.userData));
    }
    
    // Update UI based on login status
    updateUIForLoggedInUser();
}

function logoutUser() {
    // Clear current user
    currentUser.isLoggedIn = false;
    currentUser.userData = null;
    
    // Remove from localStorage
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    
    // Redirect to login page
    window.location.href = 'login.html';
}

function updateUIForLoggedInUser() {
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) {
        // Update navigation links based on login status
        if (currentUser.isLoggedIn) {
            // Create welcome element
            const welcomeElement = document.createElement('span');
            welcomeElement.textContent = `Welcome, ${currentUser.userData.firstName}`;
            welcomeElement.classList.add('welcome-text');
            
            // Replace login/register links with logout
            const loginLink = navLinks.querySelector('.login-btn');
            const registerLink = navLinks.querySelector('.register-btn');
            
            if (loginLink) navLinks.removeChild(loginLink);
            if (registerLink) navLinks.removeChild(registerLink);
            
            // Add welcome text and logout button
            if (!navLinks.querySelector('.welcome-text')) {
                navLinks.appendChild(welcomeElement);
                
                const logoutLink = document.createElement('a');
                logoutLink.href = '#';
                logoutLink.textContent = 'Logout';
                logoutLink.classList.add('logout-btn');
                logoutLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    logoutUser();
                });
                navLinks.appendChild(logoutLink);
            }
        }
    }
}

// Appointments and Prescriptions Functions
function loadUserAppointments() {
    const appointmentsTable = document.querySelector('.appointments-table tbody');
    if (appointmentsTable && currentUser.isLoggedIn) {
        // Clear existing rows
        appointmentsTable.innerHTML = '';
        
        // Get user appointments from localStorage
        const allAppointments = JSON.parse(localStorage.getItem(STORAGE_KEYS.APPOINTMENTS)) || [];
        const userAppointments = allAppointments.filter(app => app.userId === currentUser.userData.email);
        
        if (userAppointments.length === 0) {
            // No appointments
            const emptyRow = document.createElement('tr');
            emptyRow.innerHTML = `<td colspan="5" style="text-align: center;">No appointments found</td>`;
            appointmentsTable.appendChild(emptyRow);
        } else {
            // Sort appointments by date (newest first)
            userAppointments.sort((a, b) => new Date(b.date) - new Date(a.date));
            
            // Add appointments to table
            userAppointments.forEach(app => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${app.doctor}</td>
                    <td>${app.date}</td>
                    <td>${app.time}</td>
                    <td><span class="status-badge ${app.status}">${app.status}</span></td>
                    <td>
                        <button class="action-btn reschedule" data-id="${app.id}">Reschedule</button>
                        <button class="action-btn cancel" data-id="${app.id}">Cancel</button>
                    </td>
                `;
                appointmentsTable.appendChild(row);
            });
            
            // Add click handlers for action buttons
            addAppointmentActionHandlers();
        }
    }
}

function loadUserPrescriptions() {
    const prescriptionsGrid = document.querySelector('.prescriptions-grid');
    if (prescriptionsGrid && currentUser.isLoggedIn) {
        // Clear existing prescriptions
        prescriptionsGrid.innerHTML = '';
        
        // Get user prescriptions from localStorage
        const allPrescriptions = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRESCRIPTIONS)) || [];
        const userPrescriptions = allPrescriptions.filter(presc => presc.userId === currentUser.userData.email);
        
        if (userPrescriptions.length === 0) {
            // No prescriptions
            prescriptionsGrid.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">No prescriptions found</p>';
        } else {
            // Sort prescriptions by date (newest first)
            userPrescriptions.sort((a, b) => new Date(b.date) - new Date(a.date));
            
            // Add prescriptions to grid
            userPrescriptions.forEach(presc => {
                const card = createPrescriptionCard(presc);
                prescriptionsGrid.appendChild(card);
            });
        }
    }
}

function createPrescriptionCard(prescription) {
    const card = document.createElement('div');
    card.classList.add('prescription-card');
    
    let medicationsHtml = '';
    prescription.medications.forEach(med => {
        medicationsHtml += `
            <li>
                <div class="med-name">${med.name}</div>
                <div class="med-dosage">${med.dosage}</div>
                <div class="med-instructions">${med.instructions}</div>
            </li>
        `;
    });
    
    card.innerHTML = `
        <div class="prescription-header">
            <h3>${prescription.doctor}</h3>
            <div class="prescription-date">${prescription.date}</div>
        </div>
        <div class="medications">
            <h4>Medications:</h4>
            <ul>
                ${medicationsHtml}
            </ul>
        </div>
        <div class="prescription-footer">
            <button class="secondary-btn">Download PDF</button>
            <button class="primary-btn">Request Refill</button>
        </div>
    `;
    
    return card;
}

function addAppointmentActionHandlers() {
    // Add click handlers for action buttons
    const actionButtons = document.querySelectorAll('.action-btn');
    actionButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const action = e.target.classList.contains('cancel') ? 'cancel' : 'reschedule';
            const appointmentId = parseInt(e.target.getAttribute('data-id'));
            const row = e.target.closest('tr');
            
            if (action === 'cancel') {
                if (confirm('Are you sure you want to cancel this appointment?')) {
                    // Get appointments and remove the canceled one
                    const appointments = JSON.parse(localStorage.getItem(STORAGE_KEYS.APPOINTMENTS)) || [];
                    const updatedAppointments = appointments.filter(app => app.id !== appointmentId);
                    
                    // Update localStorage
                    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(updatedAppointments));
                    
                    // Remove row from table
                    row.remove();
                }
            } else if (action === 'reschedule') {
                // In a real app, this would open a modal for rescheduling
                alert('Reschedule functionality would be implemented here');
            }
        });
    });
}

// Event Listeners for Dynamic Features
document.addEventListener('DOMContentLoaded', function() {
    // Initialize local storage
    initializeLocalStorage();
    
    // Update UI based on login status
    updateUIForLoggedInUser();
    
    // Initialize date input min attribute to today
    const dateInputs = document.querySelectorAll('input[type="date"]');
    const today = new Date().toISOString().split('T')[0];
    dateInputs.forEach(input => input.min = today);
    
    // Load user-specific data based on current page
    const currentPage = window.location.pathname.split('/').pop();
    
    if (currentPage === 'appointments.html') {
        // Load appointments
        loadUserAppointments();
    } else if (currentPage === 'prescriptions.html') {
        // Load prescriptions
        loadUserPrescriptions();
    }
    
    // Add search functionality for prescriptions
    const searchBox = document.querySelector('.search-box input');
    if (searchBox) {
        searchBox.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const prescriptionCards = document.querySelectorAll('.prescription-card');
            
            prescriptionCards.forEach(card => {
                const text = card.textContent.toLowerCase();
                card.style.display = text.includes(searchTerm) ? 'block' : 'none';
            });
        });
    }
    
    // Add date filter functionality for prescriptions
    const dateFilter = document.getElementById('dateFilter');
    if (dateFilter) {
        dateFilter.addEventListener('change', function(e) {
            const filterValue = e.target.value;
            const prescriptionCards = document.querySelectorAll('.prescription-card');
            
            prescriptionCards.forEach(card => {
                const dateText = card.querySelector('.prescription-date').textContent;
                const prescriptionDate = new Date(dateText);
                const today = new Date();
                let show = true;
                
                switch(filterValue) {
                    case 'recent':
                        show = (today - prescriptionDate) / (1000 * 60 * 60 * 24) <= 30;
                        break;
                    case '6months':
                        show = (today - prescriptionDate) / (1000 * 60 * 60 * 24) <= 180;
                        break;
                    case 'year':
                        show = (today - prescriptionDate) / (1000 * 60 * 60 * 24) <= 365;
                        break;
                    default:
                        show = true;
                }
                
                card.style.display = show ? 'block' : 'none';
            });
        });
    }
    
    // Add logout handler if logout button exists
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logoutUser();
        });
    }
}); 