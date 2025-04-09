// Variables
let currentActivity = null;
let timer = null;
let timerRunning = false;
let timeLeft = 0;
let totalTime = 0;
let tasks = [
    {
        id: 'task-1',
        name: '10 min de lecture',
        description: 'Prends un moment pour lire et te détendre',
        duration: 10,
        icon: 'book',
        type: 'reading'
    },
    {
        id: 'task-2',
        name: '1 session de travail de 25 min',
        description: 'Concentre-toi sur une tâche importante',
        duration: 25,
        icon: 'clock',
        type: 'pomodoro'
    },
    {
        id: 'task-3',
        name: 'Révision ou apprentissage',
        description: 'Apprends une nouvelle chose aujourd\'hui',
        duration: 15,
        icon: 'info',
        type: 'learning'
    },
    {
        id: 'task-4',
        name: '15 min de marche ou d\'étirement',
        description: 'Prends soin de ton corps',
        duration: 15,
        icon: 'eye',
        type: 'movement'
    }
];

// Vérifier si l'utilisateur a un abonnement premium
function isPremiumUser() {
    return localStorage.getItem('douceurProductivePremium') === 'true';
}

// Activer le mode premium
function activatePremium() {
    localStorage.setItem('douceurProductivePremium', 'true');
    console.log("Mode Premium activé !");
}

// Désactiver le mode premium
function deactivatePremium() {
    localStorage.removeItem('douceurProductivePremium');
    console.log("Mode Premium désactivé !");
}

// Appliquer l'état premium à l'interface
function applyPremiumStatus() {
    const isPremium = isPremiumUser();
    
    // Débloquer les onglets premium
    if (isPremium) {
        // Supprimer les overlays premium
        document.querySelectorAll('.premium-overlay').forEach(overlay => {
            overlay.style.display = 'none';
        });
        
        // Rendre les thèmes premium disponibles
        document.querySelectorAll('.theme-option.premium-feature').forEach(theme => {
            theme.classList.remove('premium-feature');
        });
        
        // Activer le bouton d'ajout de tâche
        const addTaskButton = document.getElementById('add-task-button');
        if (addTaskButton) {
            addTaskButton.classList.remove('premium-feature');
        }
        
        // Mettre à jour le texte des boutons premium
        const premiumButtons = document.querySelectorAll('.upgrade-button');
        premiumButtons.forEach(button => {
            if (button.textContent.includes('Premium')) {
                button.textContent = 'Mode Premium actif';
                button.style.backgroundColor = '#4CAF50'; // Vert
            }
        });
        
        // Informer l'utilisateur
        console.log("Interface Premium activée");
    } else {
        // Si nécessaire, réactiver les restrictions
        document.querySelectorAll('.premium-overlay').forEach(overlay => {
            overlay.style.display = 'flex';
        });
    }
}

// DOM Elements
const mainButton = document.getElementById('main-button');
const timerContainer = document.getElementById('timer-container');
const timerDisplay = document.getElementById('timer');
const timerActivityName = document.getElementById('timer-activity');
const startTimerBtn = document.getElementById('start-timer');
const pauseTimerBtn = document.getElementById('pause-timer');
const resetTimerBtn = document.getElementById('reset-timer');
const completeMessage = document.getElementById('complete-message');
const progressFill = document.getElementById('progress-fill');
const taskCards = document.querySelectorAll('.task-card');
const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');
const themeOptions = document.querySelectorAll('.theme-option');
const addTaskButton = document.getElementById('add-task-button');
const addTaskModal = document.getElementById('add-task-modal');
const closeModalButton = document.getElementById('close-modal');
const showPlansButton = document.getElementById('show-plans-button');
const plansModal = document.getElementById('plans-modal');
const closePlansModalButton = document.getElementById('close-plans-modal');
const upgradePremiumButtons = document.querySelectorAll('.upgrade-button');
const taskDurationInputs = document.querySelectorAll('.task-duration input');

// Toggle checkbox
function toggleCheckbox(element) {
    element.classList.toggle('checked');
    
    // Check if parent task card has data-time attribute
    const taskCard = element.closest('.task-card');
    if (taskCard && !element.classList.contains('checked')) {
        const taskId = taskCard.dataset.id;
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            startActivity(task);
        }
    }
}

// Format time (minutes:seconds)
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Start activity timer
function startActivity(task) {
    // Reset any existing timer
    if (timer) {
        clearInterval(timer);
    }
    
    // Set current activity
    currentActivity = task;
    totalTime = task.duration * 60;
    timeLeft = totalTime;
    
    // Update UI
    timerContainer.style.display = 'block';
    completeMessage.style.display = 'none';
    progressFill.style.width = '0%';
    
    // Set activity name
    timerActivityName.textContent = task.name;
    
    // Update timer display
    timerDisplay.textContent = formatTime(timeLeft);
    
    // Show timer container and scroll to it
    timerContainer.scrollIntoView({ behavior: 'smooth' });
}

// Start timer
function startTimer() {
    if (!timerRunning && timeLeft > 0) {
        timerRunning = true;
        timer = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = formatTime(timeLeft);
            
            // Update progress bar
            const progress = ((totalTime - timeLeft) / totalTime) * 100;
            progressFill.style.width = `${progress}%`;
            
            if (timeLeft <= 0) {
                clearInterval(timer);
                timerRunning = false;
                completeMessage.style.display = 'block';
                
                // Check the corresponding checkbox
                document.querySelectorAll('.task-card').forEach(card => {
                    if (card.dataset.id === currentActivity.id) {
                        const checkbox = card.querySelector('.checkbox');
                        checkbox.classList.add('checked');
                    }
                });
            }
        }, 1000);
    }
}

// Pause timer
function pauseTimer() {
    if (timerRunning) {
        clearInterval(timer);
        timerRunning = false;
    }
}

// Reset timer
function resetTimer() {
    clearInterval(timer);
    timerRunning = false;
    timeLeft = totalTime;
    timerDisplay.textContent = formatTime(timeLeft);
    progressFill.style.width = '0%';
    completeMessage.style.display = 'none';
}

// Gérer les tabs
function switchTab(tabId) {
    tabContents.forEach(content => {
        content.classList.remove('active');
    });
    
    tabButtons.forEach(button => {
        button.classList.remove('active');
    });
    
    document.getElementById(tabId).classList.add('active');
    document.querySelector(`.tab-button[data-tab="${tabId}"]`).classList.add('active');
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Vérifier et appliquer le statut premium dès le chargement
    applyPremiumStatus();
    
    // Event listeners pour les onglets
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            switchTab(this.dataset.tab);
        });
    });
    
    // Event listeners pour les durées des tâches
    taskDurationInputs.forEach(input => {
        input.addEventListener('change', function() {
            const taskCard = this.closest('.task-card');
            const taskId = taskCard.dataset.id;
            const taskIndex = tasks.findIndex(t => t.id === taskId);
            if (taskIndex !== -1) {
                tasks[taskIndex].duration = parseInt(this.value);
                taskCard.dataset.time = this.value;
            }
        });
    });
    
    // Event listener pour le bouton principal
    mainButton.addEventListener('click', () => {
        // Trouver la première tâche non cochée
        const firstUnchecked = document.querySelector('.task-card:not(.checked)');
        if (firstUnchecked) {
            const taskId = firstUnchecked.dataset.id;
            const task = tasks.find(t => t.id === taskId);
            if (task) {
                startActivity(task);
            }
        }
    });
    
    // Event listeners pour le minuteur
    startTimerBtn.addEventListener('click', startTimer);
    pauseTimerBtn.addEventListener('click', pauseTimer);
    resetTimerBtn.addEventListener('click', resetTimer);
    
    // Event listeners pour le modal d'ajout de tâche (premium)
    addTaskButton.addEventListener('click', function() {
        if (isPremiumUser()) {
            // Si premium, permettre l'ajout de tâches
            // Code ici pour ouvrir le modal d'ajout de tâches réel
            alert("Cette fonctionnalité sera disponible prochainement.");
        } else {
            // Sinon afficher le modal d'upgrade
            addTaskModal.style.display = 'flex';
        }
    });
    
    closeModalButton.addEventListener('click', function() {
        addTaskModal.style.display = 'none';
    });
    
    // Event listeners pour le modal des plans
    showPlansButton.addEventListener('click', function(e) {
        e.preventDefault();
        
        if (isPremiumUser()) {
            // Si déjà premium, informer l'utilisateur
            alert("Vous êtes déjà abonné au forfait Premium !");
        } else {
            plansModal.style.display = 'flex';
        }
    });
    
    closePlansModalButton.addEventListener('click', function() {
        plansModal.style.display = 'none';
    });
    
    // Event listeners pour les boutons d'upgrade
    upgradePremiumButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            if (!isPremiumUser()) {
                plansModal.style.display = 'flex';
            }
        });
    });
    
    // Fermer les modals en cliquant à l'extérieur
    window.addEventListener('click', function(e) {
        if (e.target === addTaskModal) {
            addTaskModal.style.display = 'none';
        }
        if (e.target === plansModal) {
            plansModal.style.display = 'none';
        }
    });
    
    // Empêcher l'utilisation des fonctionnalités premium
    themeOptions.forEach(option => {
        if (option.classList.contains('premium-feature') && !isPremiumUser()) {
            option.addEventListener('click', function(e) {
                e.preventDefault();
                plansModal.style.display = 'flex';
            });
        } else {
            option.addEventListener('click', function() {
                document.body.className = '';
                document.body.classList.add(`theme-${this.dataset.theme}`);
                
                themeOptions.forEach(opt => {
                    opt.classList.remove('active');
                });
                this.classList.add('active');
            });
        }
    });
    
    // Ajouter un bouton pour activer/désactiver le mode premium si on est en développement
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname.includes('github.io')) {
        // Nous sommes en développement, ajouter le bouton de test
        const toggleContainer = document.createElement('div');
        toggleContainer.style.position = 'fixed';
        toggleContainer.style.bottom = '10px';
        toggleContainer.style.right = '10px';
        toggleContainer.style.zIndex = '1000';
        toggleContainer.style.background = 'rgba(0,0,0,0.7)';
        toggleContainer.style.padding = '10px';
        toggleContainer.style.borderRadius = '5px';
        
        const toggleButton = document.createElement('button');
        toggleButton.textContent = isPremiumUser() ? 'Désactiver Premium' : 'Activer Premium';
        toggleButton.style.padding = '5px 10px';
        toggleButton.style.cursor = 'pointer';
        toggleButton.style.background = isPremiumUser() ? '#f44336' : '#4CAF50';
        toggleButton.style.color = 'white';
        toggleButton.style.border = 'none';
        toggleButton.style.borderRadius = '3px';
        
        toggleButton.addEventListener('click', function() {
            if (isPremiumUser()) {
                deactivatePremium();
                this.textContent = 'Activer Premium';
                this.style.background = '#4CAF50';
            } else {
                activatePremium();
                this.textContent = 'Désactiver Premium';
                this.style.background = '#f44336';
            }
            
            // Rafraîchir la page pour appliquer les changements
            window.location.reload();
        });
        
        toggleContainer.appendChild(toggleButton);
        document.body.appendChild(toggleContainer);
    }
});
