// Generate random CAPTCHA
function generateCaptcha() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let captcha = '';
    for (let i = 0; i < 6; i++) {
        captcha += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const captchaElement = document.getElementById('captchaText');
    if (captchaElement) {
        captchaElement.textContent = captcha;
    }
}

function generateStaffCaptcha() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let captcha = '';
    for (let i = 0; i < 6; i++) {
        captcha += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const captchaElement = document.getElementById('staffCaptchaText');
    if (captchaElement) {
        captchaElement.textContent = captcha;
    }
}

// Form validation functions
function validateStudentForm() {
    const studentId = document.getElementById('studentId').value;
    const password = document.getElementById('studentPassword').value;
    const academicYear = document.getElementById('academicYear').value;
    const semester = document.getElementById('semester').value;
    const captchaInput = document.getElementById('studentCaptchaInput').value;
    const captchaText = document.getElementById('captchaText').textContent;
    
    // Validate Student ID format - exactly 10 digits starting with 2
    if (!/^2[0-9]{9}$/.test(studentId)) {
        showAlert('Please enter a valid 10-digit Student ID starting with 2', 'error');
        document.getElementById('studentId').classList.add('is-invalid');
        return false;
    }
    
    // Validate password
    if (password.length < 6) {
        showAlert('Password must be at least 6 characters long', 'error');
        return false;
    }
    
    // Validate academic year
    if (!academicYear) {
        showAlert('Please select academic year', 'error');
        return false;
    }
    
    // Validate semester
    if (!semester) {
        showAlert('Please select semester', 'error');
        return false;
    }
    
    // Validate CAPTCHA
    if (captchaInput !== captchaText) {
        showAlert('Please enter the correct verification code', 'error');
        generateCaptcha();
        return false;
    }
    
    return true;
}

function validateStaffForm() {
    const email = document.getElementById('staffEmail').value;
    const password = document.getElementById('staffPassword').value;
    const department = document.getElementById('department').value;
    const captchaInput = document.getElementById('staffCaptchaInput').value;
    const captchaText = document.getElementById('staffCaptchaText').textContent;
    
    // Validate email format with KLH domain
    if (!/^[^\s@]+@klh\.edu\.in$/.test(email)) {
        showAlert('Please enter a valid KLH email address (@klh.edu.in)', 'error');
        return false;
    }
    
    // Validate password
    if (password.length < 6) {
        showAlert('Password must be at least 6 characters long', 'error');
        return false;
    }
    
    // Validate department selection
    if (!department) {
        showAlert('Please select your department', 'error');
        return false;
    }
    
    // Validate CAPTCHA
    if (captchaInput !== captchaText) {
        showAlert('Please enter the correct verification code', 'error');
        generateStaffCaptcha();
        return false;
    }
    
    return true;
}

// Show alert messages
function showAlert(message, type = 'info') {
    const existingAlert = document.querySelector('.custom-alert');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    const alert = document.createElement('div');
    alert.className = `custom-alert alert alert-${type === 'error' ? 'danger' : 'success'} position-fixed`;
    alert.style.cssText = `
        top: 20px;
        right: 20px;
        z-index: 1050;
        min-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    alert.innerHTML = `
        <div class="d-flex justify-content-between align-items-center">
            <span>${message}</span>
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    document.body.appendChild(alert);
    
    setTimeout(() => {
        if (alert.parentNode) {
            alert.remove();
        }
    }, 5000);
}

// Simulate login process
function simulateLogin(userType, callback) {
    const button = document.getElementById(`${userType}LoginBtn`);
    const buttonText = button.querySelector('.button-text');
    
    button.disabled = true;
    buttonText.innerHTML = '<span class="loading"></span> Logging in...';
    
    setTimeout(() => {
        button.disabled = false;
        buttonText.innerHTML = `<i class="fas fa-sign-in-alt me-2"></i>Login as ${userType.charAt(0).toUpperCase() + userType.slice(1)}`;
        callback();
    }, 2000);
}

// Prevent non-digit input for Student ID
function preventNonDigitInput(e) {
    if ([46, 8, 9, 27, 13].includes(e.keyCode) ||
        (e.keyCode === 65 && e.ctrlKey === true) ||
        (e.keyCode === 67 && e.ctrlKey === true) ||
        (e.keyCode === 86 && e.ctrlKey === true) ||
        (e.keyCode === 88 && e.ctrlKey === true) ||
        (e.keyCode >= 35 && e.keyCode <= 39)) {
        return;
    }
    
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
        e.preventDefault();
    }
}

// Forgot Password functionality
function isValidCollegeEmail(email) {
    // Common college email patterns
    const collegePatterns = [
        /@[a-zA-Z]+\.ac\.[a-zA-Z]+$/, // .ac.in, .ac.uk, etc.
        /@[a-zA-Z]+\.edu(\.[a-zA-Z]+)?$/, // .edu, .edu.in, etc.
        /@college\.[a-zA-Z]+$/,
        /@university\.[a-zA-Z]+$/,
        /@student\.[a-zA-Z]+$/,
        /@klh\.edu\.in$/ // KLH domain
    ];
    
    return collegePatterns.some(pattern => pattern.test(email));
}

function simulateResetLink(studentId, collegeEmail) {
    const button = document.getElementById('sendResetLinkBtn');
    const originalText = button.innerHTML;
    
    // Show loading state
    button.disabled = true;
    button.innerHTML = '<span class="loading"></span> Sending...';
    
    // Simulate API call
    setTimeout(() => {
        button.disabled = false;
        button.innerHTML = originalText;
        
        // Store reset request in localStorage (for demo purposes)
        const resetRequests = JSON.parse(localStorage.getItem('passwordResetRequests') || '[]');
        resetRequests.push({
            studentId: studentId,
            email: collegeEmail,
            timestamp: new Date().toISOString(),
            token: generateResetToken()
        });
        localStorage.setItem('passwordResetRequests', JSON.stringify(resetRequests));
        
        // Show success modal
        const forgotPasswordModal = bootstrap.Modal.getInstance(document.getElementById('forgotPasswordModal'));
        forgotPasswordModal.hide();
        
        const resetSuccessModal = new bootstrap.Modal(document.getElementById('resetSuccessModal'));
        resetSuccessModal.show();
        
        // Reset form
        document.getElementById('forgotPasswordForm').reset();
        
    }, 2000);
}

function generateResetToken() {
    return 'token_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

// AI Chatbot System
function initializeAIChatbot() {
    const chatToggle = document.getElementById('chatToggle');
    const chatContainer = document.querySelector('.chat-container');
    const closeChat = document.getElementById('closeChat');
    const sendChatMessage = document.getElementById('sendChatMessage');
    const chatMessage = document.getElementById('chatMessage');
    const chatMessages = document.querySelector('.chat-messages');
    
    // Load chat history from localStorage
    loadChatHistory();
    
    if (chatToggle && chatContainer) {
        chatToggle.addEventListener('click', function() {
            chatContainer.style.display = 
                chatContainer.style.display === 'block' ? 'none' : 'block';
        });
    }
    
    if (closeChat) {
        closeChat.addEventListener('click', function() {
            chatContainer.style.display = 'none';
        });
    }
    
    if (sendChatMessage && chatMessage) {
        sendChatMessage.addEventListener('click', function() {
            sendMessage();
        });
        
        chatMessage.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
    
    function sendMessage() {
        const message = chatMessage.value.trim();
        if (message) {
            // Add user message
            addMessageToChat('user', message);
            
            // Clear input
            chatMessage.value = '';
            
            // Scroll to bottom
            chatMessages.scrollTop = chatMessages.scrollHeight;
            
            // Generate AI response
            setTimeout(() => {
                const aiResponse = generateAIResponse(message);
                addMessageToChat('bot', aiResponse);
                
                // Scroll to bottom
                chatMessages.scrollTop = chatMessages.scrollHeight;
                
                // Save chat history
                saveChatHistory();
            }, 1000);
        }
    }
    
    function addMessageToChat(sender, message) {
        const messageDiv = document.createElement('div');
        
        if (sender === 'user') {
            messageDiv.className = 'd-flex justify-content-end mb-3';
            messageDiv.innerHTML = `
                <div class="bg-primary text-white p-3 rounded" style="max-width: 80%;">
                    <p class="mb-0">${message}</p>
                    <small class="opacity-75">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</small>
                </div>
            `;
        } else {
            messageDiv.className = 'd-flex justify-content-start mb-3';
            messageDiv.innerHTML = `
                <div class="bg-light p-3 rounded" style="max-width: 80%;">
                    <div class="d-flex align-items-center mb-2">
                        <i class="fas fa-robot text-primary me-2"></i>
                        <strong>KLH Assistant</strong>
                    </div>
                    <p class="mb-0">${message}</p>
                    <small class="text-muted">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</small>
                </div>
            `;
        }
        
        chatMessages.appendChild(messageDiv);
    }
    
    function generateAIResponse(userMessage) {
        const message = userMessage.toLowerCase();
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
        
        // Complaint related queries
        if (message.includes('complaint') || message.includes('issue') || message.includes('problem')) {
            if (message.includes('submit') || message.includes('create') || message.includes('new')) {
                return "To submit a new complaint, click on the 'Submit Complaint' button in your dashboard. You'll need to provide details about the issue, location, and optionally attach photos. Make sure to select the correct category and priority level.";
            }
            if (message.includes('status') || message.includes('check') || message.includes('track')) {
                return "You can check your complaint status in the 'My Complaints' section of your dashboard. Each complaint shows its current status (Pending, In Progress, or Resolved) along with any staff notes or resolution details.";
            }
            if (message.includes('pending') || message.includes('waiting')) {
                return "Pending complaints are awaiting staff review. The average response time is 1-2 business days. You'll receive notifications when your complaint status changes.";
            }
            return "I can help you with complaint submission, tracking, and general queries. What specific help do you need regarding complaints?";
        }
        
        // Academic queries
        if (message.includes('academic') || message.includes('exam') || message.includes('semester') || message.includes('course')) {
            if (message.includes('timetable') || message.includes('schedule')) {
                return "Academic timetables are available on the college portal. You can also check with your department office for the latest schedule updates.";
            }
            if (message.includes('exam') || message.includes('test')) {
                return "Exam schedules and hall tickets are usually released 2-3 weeks before exams. Keep checking the college website and your student portal for updates.";
            }
            return "For academic queries, please contact your department coordinator or check the official college academic calendar available on the KLH website.";
        }
        
        // Hostel queries
        if (message.includes('hostel') || message.includes('room') || message.includes('accommodation')) {
            if (message.includes('maintenance') || message.includes('repair')) {
                return "For hostel maintenance issues, submit a complaint under 'Hostel Maintenance' category. Emergency repairs are prioritized and addressed within 24 hours.";
            }
            if (message.includes('fee') || message.includes('payment')) {
                return "Hostel fee payments can be made through the college payment portal. The due dates are typically announced at the beginning of each semester.";
            }
            return "Hostel-related queries can be directed to the Hostel Management office. Office hours are 9 AM to 5 PM on weekdays.";
        }
        
        // Library queries
        if (message.includes('library') || message.includes('book') || message.includes('study')) {
            if (message.includes('hours') || message.includes('timing')) {
                return "Library hours: Monday-Friday: 8 AM - 10 PM, Saturday: 9 AM - 6 PM, Sunday: 10 AM - 4 PM. Extended hours during exams: 8 AM - 12 AM.";
            }
            if (message.includes('book') || message.includes('borrow')) {
                return "You can borrow up to 4 books for 15 days. Renewals are possible if no one has reserved the book. Overdue fines are ₹5 per day per book.";
            }
            return "The library offers digital resources, study spaces, and research assistance. Visit the library help desk for specific queries.";
        }
        
        // General college queries
        if (message.includes('college') || message.includes('klh') || message.includes('campus')) {
            if (message.includes('contact') || message.includes('phone') || message.includes('email')) {
                return "Main college contact: 040-12345678, info@klh.edu.in. Emergency contact: 040-12345679. Department contacts are available on the college website.";
            }
            if (message.includes('holiday') || message.includes('vacation')) {
                return "The academic calendar with all holidays and vacations is available on the college website. You can also check with your department notice board.";
            }
            return "KL University Hyderabad offers various undergraduate and postgraduate programs across multiple disciplines. For specific information, visit our official website.";
        }
        
        // Greetings
        if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
            return `Hello${currentUser.identifier ? ' ' + currentUser.identifier : ''}! I'm KLH Assistant. How can I help you today with college-related queries?`;
        }
        
        if (message.includes('thank') || message.includes('thanks')) {
            return "You're welcome! If you have any more questions, feel free to ask. Have a great day!";
        }
        
        if (message.includes('help')) {
            return "I can help you with:\n• Complaint submission and tracking\n• Academic information\n• Hostel queries\n• Library services\n• College general information\n• Campus facilities\n\nWhat specific help do you need?";
        }
        
        // Default response
        return "I understand you're asking about: '" + userMessage + "'. For detailed assistance with college matters, you can:\n\n1. Submit a formal complaint through the system\n2. Contact the relevant department directly\n3. Visit the college administration office\n4. Check the college website for official information\n\nIs there anything specific about KLH that I can help you with?";
    }
    
    function saveChatHistory() {
        const chatContent = chatMessages.innerHTML;
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
        const userId = currentUser.identifier || 'guest';
        
        // Save chat history with user ID to maintain separate histories
        localStorage.setItem(`chatHistory_${userId}`, chatContent);
    }
    
    function loadChatHistory() {
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
        const userId = currentUser.identifier || 'guest';
        const savedChat = localStorage.getItem(`chatHistory_${userId}`);
        
        if (savedChat) {
            chatMessages.innerHTML = savedChat;
            chatMessages.scrollTop = chatMessages.scrollHeight;
        } else {
            // Welcome message for new users
            addMessageToChat('bot', `Welcome to KLH Assistant! 🤖\n\nI'm here to help you with:\n• Complaint management\n• Academic information\n• Campus services\n• General college queries\n\nHow can I assist you today?`);
            saveChatHistory();
        }
    }
    
    // Clear chat history function (can be called from console if needed)
    window.clearChatHistory = function() {
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
        const userId = currentUser.identifier || 'guest';
        localStorage.removeItem(`chatHistory_${userId}`);
        chatMessages.innerHTML = '';
        addMessageToChat('bot', `Welcome to KLH Assistant! 🤖\n\nI'm here to help you with:\n• Complaint management\n• Academic information\n• Campus services\n• General college queries\n\nHow can I assist you today?`);
        saveChatHistory();
    };
}

// Notification System
function initializeNotificationSystem() {
    const notificationBell = document.getElementById('notificationBell');
    const notificationDropdown = document.querySelector('.notification-dropdown');
    const markAllReadBtn = document.getElementById('markAllRead');
    
    if (notificationBell && notificationDropdown) {
        notificationBell.addEventListener('click', function() {
            notificationDropdown.style.display = 
                notificationDropdown.style.display === 'block' ? 'none' : 'block';
            updateNotificationCount(0);
        });
    }
    
    if (markAllReadBtn) {
        markAllReadBtn.addEventListener('click', function() {
            updateNotificationCount(0);
            document.getElementById('notificationList').innerHTML = `
                <div class="text-center text-muted py-3">
                    <i class="fas fa-bell-slash fa-2x mb-2"></i>
                    <p>No new notifications</p>
                </div>
            `;
        });
    }
    
    // Simulate receiving notifications
    setTimeout(() => {
        addNotification('New complaint submitted in Hostel category');
    }, 5000);
    
    setTimeout(() => {
        addNotification('Your complaint #COMP-12345 has been resolved');
    }, 10000);
}

function addNotification(message) {
    const notificationList = document.getElementById('notificationList');
    const notificationCount = document.getElementById('notificationCount');
    
    // Remove empty state if it exists
    if (notificationList.querySelector('.text-center')) {
        notificationList.innerHTML = '';
    }
    
    const notificationItem = document.createElement('div');
    notificationItem.className = 'notification-item border-bottom pb-2 mb-2';
    notificationItem.innerHTML = `
        <div class="d-flex align-items-start">
            <i class="fas fa-bell text-primary mt-1 me-2"></i>
            <div class="flex-grow-1">
                <p class="mb-1 small">${message}</p>
                <small class="text-muted">${new Date().toLocaleTimeString()}</small>
            </div>
        </div>
    `;
    
    notificationList.prepend(notificationItem);
    
    // Update notification count
    const currentCount = parseInt(notificationCount.textContent) || 0;
    updateNotificationCount(currentCount + 1);
}

function updateNotificationCount(count) {
    const notificationCount = document.getElementById('notificationCount');
    if (notificationCount) {
        notificationCount.textContent = count;
        if (count === 0) {
            notificationCount.style.display = 'none';
        } else {
            notificationCount.style.display = 'block';
        }
    }
}

// Password strength indicator
function initializePasswordStrength() {
    const passwordInput = document.getElementById('studentPassword');
    const strengthBar = document.getElementById('passwordStrengthBar');
    
    if (passwordInput && strengthBar) {
        passwordInput.addEventListener('input', function() {
            const password = this.value;
            let strength = 0;
            
            if (password.length >= 6) strength += 25;
            if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength += 25;
            if (password.match(/\d/)) strength += 25;
            if (password.match(/[^a-zA-Z\d]/)) strength += 25;
            
            strengthBar.style.width = `${strength}%`;
            
            if (strength < 50) {
                strengthBar.className = 'progress-bar bg-danger';
            } else if (strength < 75) {
                strengthBar.className = 'progress-bar bg-warning';
            } else {
                strengthBar.className = 'progress-bar bg-success';
            }
        });
    }
}

// Generate Academic Years (Last 5 years to Next 3 years)
function generateAcademicYears() {
    const currentYear = new Date().getFullYear();
    const years = [];
    
    // Last 5 years
    for (let i = 5; i >= 1; i--) {
        years.push(`${currentYear - i}-${currentYear - i + 1}`);
    }
    
    // Current year
    years.push(`${currentYear}-${currentYear + 1}`);
    
    // Next 3 years
    for (let i = 1; i <= 3; i++) {
        years.push(`${currentYear + i}-${currentYear + i + 1}`);
    }
    
    return years;
}

// Populate Academic Year dropdown
function populateAcademicYears() {
    const academicYearSelect = document.getElementById('academicYear');
    if (!academicYearSelect) return;
    
    const years = generateAcademicYears();
    
    academicYearSelect.innerHTML = '<option value="">Select Academic Year</option>';
    years.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        academicYearSelect.appendChild(option);
    });
}

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    // Populate academic years
    populateAcademicYears();
    
    // Navigation between welcome and login screens
    const welcomeScreen = document.getElementById('welcomeScreen');
    const loginScreen = document.getElementById('loginScreen');
    const getStartedBtn = document.getElementById('getStartedBtn');
    const backToWelcomeBtn = document.getElementById('backToWelcome');

    if (welcomeScreen && loginScreen && getStartedBtn && backToWelcomeBtn) {
        // Show login screen when Get Started is clicked
        getStartedBtn.addEventListener('click', function() {
            welcomeScreen.classList.add('hidden');
            setTimeout(() => {
                loginScreen.classList.add('active');
                // Initialize login functionality after transition
                initializeLoginFunctionality();
            }, 500);
        });

        // Show welcome screen when Back is clicked
        backToWelcomeBtn.addEventListener('click', function() {
            loginScreen.classList.remove('active');
            setTimeout(() => {
                welcomeScreen.classList.remove('hidden');
            }, 100);
        });
    } else {
        // If we're directly on login screen (refresh), initialize immediately
        if (loginScreen) {
            loginScreen.classList.add('active');
            initializeLoginFunctionality();
        }
    }

    // Initialize login functionality
    function initializeLoginFunctionality() {
        generateCaptcha();
        generateStaffCaptcha();
        
        // Password toggle functionality
        const studentToggle = document.getElementById('studentPasswordToggle');
        const studentPassword = document.getElementById('studentPassword');
        
        const staffToggle = document.getElementById('staffPasswordToggle');
        const staffPassword = document.getElementById('staffPassword');
        
        if (studentToggle && studentPassword) {
            studentToggle.addEventListener('click', function() {
                const type = studentPassword.getAttribute('type') === 'password' ? 'text' : 'password';
                studentPassword.setAttribute('type', type);
                this.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
            });
        }
        
        if (staffToggle && staffPassword) {
            staffToggle.addEventListener('click', function() {
                const type = staffPassword.getAttribute('type') === 'password' ? 'text' : 'password';
                staffPassword.setAttribute('type', type);
                this.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
            });
        }
        
        // Student ID input validation - PREVENT LETTERS COMPLETELY
        const studentIdInput = document.getElementById('studentId');
        
        if (studentIdInput) {
            // Prevent non-digit key presses
            studentIdInput.addEventListener('keydown', preventNonDigitInput);
            
            // Handle paste event to remove non-digits
            studentIdInput.addEventListener('paste', function(e) {
                e.preventDefault();
                const pastedText = (e.clipboardData || window.clipboardData).getData('text');
                const digitsOnly = pastedText.replace(/\D/g, '');
                const currentValue = this.value;
                const newValue = currentValue.substring(0, this.selectionStart) + digitsOnly + currentValue.substring(this.selectionEnd);
                
                this.value = newValue.replace(/\D/g, '').substring(0, 10);
                this.dispatchEvent(new Event('input'));
            });
            
            // Real-time validation and filtering
            studentIdInput.addEventListener('input', function() {
                this.value = this.value.replace(/\D/g, '');
                
                if (this.value.length > 10) {
                    this.value = this.value.slice(0, 10);
                }
                
                // Ensure it starts with 2
                if (this.value.length > 0 && this.value.charAt(0) !== '2') {
                    this.value = '2' + this.value.slice(1);
                }
                
                if (this.value.length === 10 && /^2[0-9]{9}$/.test(this.value)) {
                    this.classList.remove('is-invalid');
                    this.classList.add('is-valid');
                } else {
                    this.classList.remove('is-valid');
                    if (this.value.length > 0) {
                        this.classList.add('is-invalid');
                    } else {
                        this.classList.remove('is-invalid');
                    }
                }
            });
        }
        
        // Refresh CAPTCHA buttons
        const refreshStudentCaptcha = document.getElementById('refreshStudentCaptcha');
        const refreshStaffCaptcha = document.getElementById('refreshStaffCaptcha');
        
        if (refreshStudentCaptcha) {
            refreshStudentCaptcha.addEventListener('click', generateCaptcha);
        }
        
        if (refreshStaffCaptcha) {
            refreshStaffCaptcha.addEventListener('click', generateStaffCaptcha);
        }
        
        // Form submission handlers
        const studentLoginForm = document.getElementById('studentLoginForm');
        const staffLoginForm = document.getElementById('staffLoginForm');
        
        if (studentLoginForm) {
            studentLoginForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                if (validateStudentForm()) {
                    const academicYear = document.getElementById('academicYear').value;
                    const semester = document.getElementById('semester').value;
                    
                    const currentUser = {
                        type: 'student',
                        identifier: document.getElementById('studentId').value,
                        academicYear: academicYear,
                        semester: semester,
                        loginTime: new Date().toISOString()
                    };
                    sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
                    
                    simulateLogin('student', function() {
                        showAlert('Login successful! Redirecting to student dashboard...', 'success');
                        setTimeout(() => {
                            // REDIRECT TO ACTUAL STUDENT DASHBOARD
                            window.location.href = 'student-dashboard.html';
                        }, 1000);
                    });
                }
            });
        }
        
        if (staffLoginForm) {
            staffLoginForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                if (validateStaffForm()) {
                    const currentUser = {
                        type: 'staff',
                        identifier: document.getElementById('staffEmail').value,
                        department: document.getElementById('department').value,
                        loginTime: new Date().toISOString()
                    };
                    sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
                    
                    simulateLogin('staff', function() {
                        showAlert('Login successful! Redirecting to staff dashboard...', 'success');
                        setTimeout(() => {
                            // REDIRECT TO ACTUAL STAFF DASHBOARD
                            window.location.href = 'staff-dashboard.html';
                        }, 1000);
                    });
                }
            });
        }
        
        // Remember me functionality
        const rememberStudent = document.getElementById('rememberStudent');
        const rememberStaff = document.getElementById('rememberStaff');
        
        if (rememberStudent) {
            if (localStorage.getItem('rememberStudent') === 'true') {
                rememberStudent.checked = true;
            }
            
            rememberStudent.addEventListener('change', function() {
                localStorage.setItem('rememberStudent', this.checked);
            });
        }
        
        if (rememberStaff) {
            if (localStorage.getItem('rememberStaff') === 'true') {
                rememberStaff.checked = true;
            }
            
            rememberStaff.addEventListener('change', function() {
                localStorage.setItem('rememberStaff', this.checked);
            });
        }
        
        // Input validation styling for other inputs
        const inputs = document.querySelectorAll('input:not(#studentId), select');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                if (this.checkValidity()) {
                    this.classList.remove('is-invalid');
                    this.classList.add('is-valid');
                } else {
                    this.classList.remove('is-valid');
                    this.classList.add('is-invalid');
                }
            });
            
            input.addEventListener('input', function() {
                if (this.checkValidity()) {
                    this.classList.remove('is-invalid');
                }
            });
        });
        
        // Forgot Password functionality
        const forgotPasswordModal = document.getElementById('forgotPasswordModal') ? 
            new bootstrap.Modal(document.getElementById('forgotPasswordModal')) : null;
        const resetSuccessModal = document.getElementById('resetSuccessModal') ? 
            new bootstrap.Modal(document.getElementById('resetSuccessModal')) : null;

        // Forgot password link click
        document.querySelectorAll('a.text-muted[href="#"]').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                if (forgotPasswordModal) {
                    forgotPasswordModal.show();
                }
            });
        });

        // Student ID validation for forgot password
        const studentIdForgot = document.getElementById('studentIdForgot');
        if (studentIdForgot) {
            studentIdForgot.addEventListener('input', function() {
                this.value = this.value.replace(/\D/g, '');
                if (this.value.length > 10) {
                    this.value = this.value.slice(0, 10);
                }
                
                // Ensure it starts with 2
                if (this.value.length > 0 && this.value.charAt(0) !== '2') {
                    this.value = '2' + this.value.slice(1);
                }
            });
        }

        // Send reset link button
        const sendResetLinkBtn = document.getElementById('sendResetLinkBtn');
        if (sendResetLinkBtn) {
            sendResetLinkBtn.addEventListener('click', function() {
                const studentId = document.getElementById('studentIdForgot').value;
                const collegeEmail = document.getElementById('collegeEmail').value;

                // Validate inputs
                if (!/^2[0-9]{9}$/.test(studentId)) {
                    showAlert('Please enter a valid 10-digit Student ID starting with 2', 'error');
                    return;
                }

                if (!collegeEmail) {
                    showAlert('Please enter your college email address', 'error');
                    return;
                }

                // Validate college email format (basic college email validation)
                if (!isValidCollegeEmail(collegeEmail)) {
                    showAlert('Please enter a valid college email address', 'error');
                    return;
                }

                // Simulate sending reset link
                simulateResetLink(studentId, collegeEmail);
            });
        }
        
        // Initialize additional systems
        initializeNotificationSystem();
        initializeAIChatbot();
        initializePasswordStrength();
    }
});