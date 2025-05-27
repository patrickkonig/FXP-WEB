<<<<<<< HEAD
const API_KEY = "c753cadb88msh8452454e2a62bf5p126aafjsna7a968f0e9e4";
const API_HOST = "exercisedb.p.rapidapi.com";
const navLinks = document.querySelectorAll('.nav-link');
const pageSections = document.querySelectorAll('.page-section');
const loginBtn = document.getElementById('login-btn');
const registerBtn = document.getElementById('register-btn');
const authModal = document.getElementById('auth-modal');
const closeAuth = document.getElementById('close-auth');
const authTitle = document.getElementById('auth-title');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const logoutBtn = document.getElementById('logout-btn');
const startNowBtn = document.getElementById('start-now-btn');
const searchExercisesBtn = document.getElementById('search-exercises');
const exerciseResults = document.getElementById('exercise-results');
const exerciseList = document.getElementById('exercise-list');
const currentWorkout = document.getElementById('current-workout');
const workoutExercises = document.getElementById('workout-exercises');
const saveWorkoutBtn = document.getElementById('save-workout');
const clearWorkoutBtn = document.getElementById('clear-workout');
const navLinksCont = document.getElementById('nav-links');
const authButtons = document.getElementById('auth-buttons');
const userProfile = document.getElementById('user-profile');
const usernameDisplay = document.getElementById('username-display');

// App State
let currentUser = null;
let currentWorkoutPlan = {
    name: "",
    exercises: []
};
let savedWorkouts = [];

// Initialize App
function initApp() {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
        showLoggedInState();
        loadUserData();
    } else {
        showLoggedOutState();
    }

    showSection('home');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.getAttribute('data-target');
            showSection(target);
        });
    });

    loginBtn.addEventListener('click', () => {
        showAuthModal('login');
    });

    registerBtn.addEventListener('click', () => {
        showAuthModal('register');
    });

    closeAuth.addEventListener('click', () => {
        authModal.classList.add('hidden');
    });

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleLogin();
    });

    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleRegister();
    });

    logoutBtn.addEventListener('click', handleLogout);

    startNowBtn.addEventListener('click', () => {
        if (currentUser) {
            showSection('workout-planner');
        } else {
            showAuthModal('login');
        }
    });

    searchExercisesBtn.addEventListener('click', searchExercises);

    clearWorkoutBtn.addEventListener('click', () => {
        clearWorkoutPlan();
    });

    saveWorkoutBtn.addEventListener('click', saveWorkoutPlan);
}

// Functions
function showSection(sectionId) {
    pageSections.forEach(section => {
        section.classList.add('hidden');
    });
    document.getElementById(sectionId).classList.remove('hidden');
    
    // Update active nav link
    navLinks.forEach(link => {
        if (link.getAttribute('data-target') === sectionId) {
            link.classList.add('font-bold');
        } else {
            link.classList.remove('font-bold');
        }
    });
}

function showAuthModal(type) {
    authModal.classList.remove('hidden');
    
    if (type === 'login') {
        authTitle.textContent = 'Login';
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
    } else {
        authTitle.textContent = 'Register';
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
    }
}

function handleLogin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        currentUser = {
            name: user.name,
            email: user.email,
            memberId: user.memberId,
            memberSince: user.memberSince
        };
        
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        showLoggedInState();
        authModal.classList.add('hidden');
        showSection('workout-planner');
        loadUserData();
    } else {
        alert('Invalid email or password');
    }
}

function handleRegister() {
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    
    // In a real app, we would send this to a server
    // For demo purposes, we'll store in localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if user already exists
    if (users.some(u => u.email === email)) {
        alert('User with this email already exists');
        return;
    }
    
    const newUser = {
        name,
        email,
        password,
        memberId: 'FXP' + Date.now().toString().substr(-6),
        memberSince: new Date().toLocaleDateString()
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    currentUser = {
        name: newUser.name,
        email: newUser.email,
        memberId: newUser.memberId,
        memberSince: newUser.memberSince
    };
    
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    showLoggedInState();
    authModal.classList.add('hidden');
    showSection('workout-planner');
    loadUserData();
}

function handleLogout() {
    localStorage.removeItem('currentUser');
    currentUser = null;
    showLoggedOutState();
    showSection('home');
}

function showLoggedInState() {
    authButtons.classList.add('hidden');
    userProfile.classList.remove('hidden');
    navLinksCont.classList.remove('hidden');
    usernameDisplay.textContent = currentUser.name.split(' ')[0];
}

function showLoggedOutState() {
    authButtons.classList.remove('hidden');
    userProfile.classList.add('hidden');
    navLinksCont.classList.add('hidden');
}

function loadUserData() {
    // Load profile data
    document.getElementById('profile-name').value = currentUser.name;
    document.getElementById('profile-email').value = currentUser.email;
    document.getElementById('profile-member-since').value = currentUser.memberSince;
    
    // Set profile initials
    const initials = currentUser.name.split(' ').map(n => n[0]).join('');
    document.getElementById('profile-initials').textContent = initials;
    
    // Load saved workouts
    loadSavedWorkouts();
}

function loadSavedWorkouts() {
    const userWorkouts = JSON.parse(localStorage.getItem(`workouts_${currentUser.email}`) || '[]');
    savedWorkouts = userWorkouts;
    
    document.getElementById('profile-workouts').value = savedWorkouts.length;
    
    // Display workouts
    const workoutsList = document.getElementById('saved-workouts-list');
    
    if (savedWorkouts.length === 0) {
        workoutsList.innerHTML = '<div class="text-gray-500 text-center py-8">No saved workouts yet. Create a workout in the Workout Planner.</div>';
        return;
    }
    
    workoutsList.innerHTML = '';
    savedWorkouts.forEach((workout, index) => {
        const workoutCard = document.createElement('div');
        workoutCard.className = 'bg-white p-6 rounded-lg shadow-md flex flex-col';
        
        const header = document.createElement('div');
        header.className = 'flex justify-between items-center mb-4';
        
        const title = document.createElement('h3');
        title.className = 'text-xl font-bold';
        title.textContent = workout.name || `Workout ${index + 1}`;
        
        const actions = document.createElement('div');
        actions.className = 'flex space-x-2';
        
        const editBtn = document.createElement('button');
        editBtn.className = 'text-blue-600 hover:text-blue-800';
        editBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>';
        editBtn.addEventListener('click', () => loadWorkoutForEdit(index));
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'text-red-600 hover:text-red-800';
        deleteBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>';
        deleteBtn.addEventListener('click', () => deleteWorkout(index));
        
        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);
        
        header.appendChild(title);
        header.appendChild(actions);
        
        const exerciseCount = document.createElement('div');
        exerciseCount.className = 'text-gray-600 mb-4';
        exerciseCount.textContent = `${workout.exercises.length} exercise${workout.exercises.length !== 1 ? 's' : ''}`;
        
        const workoutImage = document.createElement('img');
        workoutImage.src = 'https://static.wikitide.net/avidwiki/thumb/e/e6/FXP_%282016%29.png/480px-FXP_%282016%29.png';
        workoutImage.alt = 'Workout Image';
        workoutImage.className = 'w-full h-40 object-cover rounded mb-4';
        
        const exercisesList = document.createElement('ul');
        exercisesList.className = 'text-gray-700 mb-4 flex-grow';
        
            const displayLimit = Math.min(3, workout.exercises.length);
        for (let i = 0; i < displayLimit; i++) {
            const exercise = workout.exercises[i];
            const exerciseItem = document.createElement('li');
            exerciseItem.className = 'mb-1';
            exerciseItem.textContent = exercise.name;
            exercisesList.appendChild(exerciseItem);
        }
        
        if (workout.exercises.length > 3) {
            const moreItem = document.createElement('li');
            moreItem.className = 'text-blue-600';
            moreItem.textContent = `...and ${workout.exercises.length - 3} more`;
            exercisesList.appendChild(moreItem);
        }
        
        const startBtn = document.createElement('button');
        startBtn.className = 'bg-blue-600 text-white w-full py-2 rounded-lg font-medium hover:bg-blue-700 transition mt-auto';
        startBtn.textContent = 'Start Workout';
        startBtn.addEventListener('click', () => startWorkout(workout));
        
            workoutCard.appendChild(header);
        workoutCard.appendChild(workoutImage);
        workoutCard.appendChild(exerciseCount);
        workoutCard.appendChild(exercisesList);
        workoutCard.appendChild(startBtn);
        workoutsList.appendChild(workoutCard);
    });
}

function searchExercises() {
    const muscleGroup = document.getElementById('muscle-group').value;
    const equipment = document.getElementById('equipment').value;
    const difficulty = document.getElementById('difficulty').value;
    
    if (!muscleGroup) {
        alert('Please select a muscle group');
        return;
    }
    
    exerciseList.innerHTML = '<div class="col-span-3 text-center py-8"><div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div><p class="mt-2">Loading exercises...</p></div>';
    exerciseResults.classList.remove('hidden');
    
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': API_KEY,
            'X-RapidAPI-Host': API_HOST
        }
    };
    
    let url = `https://exercisedb.p.rapidapi.com/exercises/target/${muscleGroup}`;
    
    setTimeout(() => {
        const mockExercises = getMockExercises(muscleGroup, equipment, difficulty);
        displayExercises(mockExercises);
    }, 1000);
}

function getMockExercises(muscleGroup, equipment, difficulty) {
    const exercisesBase = [
        {
            id: "0001",
            name: "Barbell Bench Press",
            target: "chest",
            equipment: "barbell",
            difficulty: "intermediate",
            instructions: "Lie on a flat bench, grip the barbell with hands slightly wider than shoulder-width apart, lower the bar to your chest, then push it back up.",
            imageUrl: "https://static.strengthlevel.com/images/illustrations/bench-press-1000x1000.jpg"
        },
        {
            id: "0002", 
            name: "Push-up",
            target: "chest",
            equipment: "bodyweight",
            difficulty: "beginner",
            instructions: "Get into a plank position with hands shoulder-width apart, lower your body until your chest nearly touches the floor, then push back up.",
            imageUrl: "https://static.strengthlevel.com/images/illustrations/push-ups-1000x1000.jpg"
        },
        {
            id: "0003",
            name: "Dumbbell Fly",
            target: "chest",
            equipment: "dumbbell",
            difficulty: "intermediate",
            instructions: "Lie on a flat bench holding dumbbells above your chest with palms facing each other, lower the weights out to the sides in an arc, then bring them back up.",
            imageUrl: "https://static.strengthlevel.com/images/exercises/dumbbell-fly/dumbbell-fly-800.jpg"
        },
        {
            id: "0004",
            name: "Squat",
            target: "quadriceps",
            equipment: "bodyweight",
            difficulty: "beginner",
            instructions: "Stand with feet shoulder-width apart, lower your body by bending your knees and pushing your hips back, then return to standing position.",
            imageUrl: "https://static.strengthlevel.com/images/illustrations/bodyweight-squat-1000x1000.jpg"
        },
        {
            id: "0005",
            name: "Barbell Back Squat",
            target: "quadriceps",
            equipment: "barbell",
            difficulty: "intermediate",
            instructions: "Place a barbell on your upper back, feet shoulder-width apart, lower your body by bending your knees and pushing your hips back, then return to standing position.",
            imageUrl: "https://static.strengthlevel.com/images/illustrations/squat-1000x1000.jpg"
        },
        {
            id: "0006",
            name: "Leg Press",
            target: "quadriceps",
            equipment: "machine",
            difficulty: "beginner",
            instructions: "Sit in the leg press machine, place your feet on the platform shoulder-width apart, lower the platform by bending your knees, then push it back up.",
            imageUrl: "https://static.strengthlevel.com/images/exercises/sled-leg-press/sled-leg-press-800.jpg"
        },
        {
            id: "0007",
            name: "Lat Pulldown",
            target: "lats",
            equipment: "cable",
            difficulty: "beginner",
            instructions: "Sit at a lat pulldown machine, grip the bar with hands wider than shoulder-width apart, pull the bar down to your chest, then slowly release it back up.",
            imageUrl: "https://static.strengthlevel.com/images/illustrations/lat-pulldown-1000x1000.jpg"
        },
        {
            id: "0008",
            name: "Pull-up",
            target: "lats",
            equipment: "bodyweight",
            difficulty: "intermediate",
            instructions: "Hang from a pull-up bar with hands slightly wider than shoulder-width apart, pull your body up until your chin is over the bar, then lower back down.",
            imageUrl: "https://static.strengthlevel.com/images/illustrations/pull-ups-1000x1000.jpg"
        },
        {
            id: "0009",
            name: "Barbell Deadlift",
            target: "lower_back",
            equipment: "barbell",
            difficulty: "expert",
            instructions: "Stand with feet hip-width apart, bend at the hips and knees to grip the barbell, lift the bar by extending your hips and knees, then lower it back down.",
            imageUrl: "https://static.strengthlevel.com/images/illustrations/deadlift-1000x1000.jpg"
        },
        {
            id: "0010",
            name: "Dumbbell Bicep Curl",
            target: "biceps",
            equipment: "dumbbell",
            difficulty: "beginner",
            instructions: "Stand with a dumbbell in each hand, palms facing forward, curl the weights toward your shoulders, then lower them back down.",
            imageUrl: "https://static.strengthlevel.com/images/illustrations/dumbbell-curl-1000x1000.jpg"
        },
        {
            id: "0011",
            name: "Tricep Dip",
            target: "triceps",
            equipment: "bodyweight",
            difficulty: "intermediate",
            instructions: "Support yourself between parallel bars, lower your body by bending your elbows, then push back up.",
            imageUrl: "https://static.strengthlevel.com/images/exercises/dips/dips-800.jpg"
        },
        {
            id: "0012",
            name: "Plank",
            target: "abdominals",
            equipment: "bodyweight",
            difficulty: "beginner",
            instructions: "Get into a push-up position but rest on your forearms, keep your body in a straight line from head to heels, and hold.",
            imageUrl: "https://static.strengthlevel.com/images/illustrations/plank-1000x1000.jpg"
        },
        {
            id: "0013",
            name: "Russian Twist",
            target: "abdominals",
            equipment: "bodyweight",
            difficulty: "intermediate",
            instructions: "Sit on the floor with knees bent, lean back slightly, twist your torso from side to side.",
            imageUrl: "https://static.strengthlevel.com/images/illustrations/russian-twist-1000x1000.jpg"
        },
        {
            id: "0014",
            name: "Calf Raise",
            target: "calves",
            equipment: "bodyweight",
            difficulty: "beginner",
            instructions: "Stand with feet hip-width apart, raise your heels off the ground, then lower them back down.",
            imageUrl: "https://static.strengthlevel.com/images/exercises/machine-calf-raise/machine-calf-raise-800.jpg"
        },
        {
            id: "0015",
            name: "Dumbbell Shoulder Press",
            target: "traps",
            equipment: "dumbbell",
            difficulty: "intermediate",
            instructions: "Sit with a dumbbell in each hand at shoulder height, press the weights overhead, then lower them back to shoulder height.",
            imageUrl: "https://static.strengthlevel.com/images/illustrations/dumbbell-shoulder-press-1000x1000.jpg"
        },
        {
            id: "0016",
            name: "Barbell Row",
            target: "lats",
            equipment: "barbell",
            difficulty: "intermediate",
            instructions: "Bend at your hips and knees and grab a barbell with an overhand grip. Keep your back straight, bend your elbows and pull the bar to your lower chest. Lower the bar back to the starting position.",
            imageUrl: "https://static.strengthlevel.com/images/exercises/bent-over-row/bent-over-row-800.jpg"
        },
        {
            id: "0017",
            name: "Military Press",
            target: "traps",
            equipment: "barbell",
            difficulty: "intermediate",
            instructions: "Stand with feet shoulder-width apart, grip the barbell at shoulder level with palms facing forward. Press the bar overhead until arms are fully extended, then lower back to shoulder level.",
            imageUrl: "https://static.strengthlevel.com/images/illustrations/military-press-1000x1000.jpg"
        },
        {
            id: "0018",
            name: "Romanian Deadlift",
            target: "lower_back",
            equipment: "barbell",
            difficulty: "intermediate",
            instructions: "Hold a barbell in front of your thighs, feet shoulder-width apart. Keep your back straight and legs slightly bent, hinge at the hips to lower the bar along your legs until you feel a stretch in your hamstrings, then return to standing.",
            imageUrl: "https://static.strengthlevel.com/images/illustrations/romanian-deadlift-1000x1000.jpg"
        },
        {
            id: "0019",
            name: "Face Pull",
            target: "traps",
            equipment: "cable",
            difficulty: "beginner",
            instructions: "Set a cable pulley to head height, attach a rope. Stand and pull the rope towards your face, separating your hands as you pull. Focus on squeezing your shoulder blades together.",
            imageUrl: "https://static.strengthlevel.com/images/exercises/face-pull/face-pull-800.jpg"
        },
        {
            id: "0020",
            name: "Leg Extension",
            target: "quadriceps",
            equipment: "machine",
            difficulty: "beginner",
            instructions: "Sit in the leg extension machine with your back against the pad. Hook your feet under the pad and extend your legs until they're straight, then slowly lower back down.",
            imageUrl: "https://static.strengthlevel.com/images/illustrations/leg-extension-1000x1000.jpg"
        },
        {
            id: "0021",
            name: "Hammer Curl",
            target: "biceps",
            equipment: "dumbbell",
            difficulty: "beginner",
            instructions: "Stand holding dumbbells at your sides with palms facing each other. Keeping your upper arms stationary, curl the weights up to your shoulders, then lower back down.",
            imageUrl: "https://static.strengthlevel.com/images/illustrations/hammer-curl-1000x1000.jpg"
        },
        {
            id: "0022",
            name: "Incline Bench Press",
            target: "chest",
            equipment: "barbell",
            difficulty: "intermediate",
            instructions: "Lie on an incline bench set to 30-45 degrees. Grip the barbell with hands slightly wider than shoulder-width. Lower the bar to your upper chest, then press it back up.",
            imageUrl: "https://static.strengthlevel.com/images/illustrations/incline-bench-press-1000x1000.jpg"
        },
        {
            id: "0023",
            name: "Seated Cable Row",
            target: "lats",
            equipment: "cable",
            difficulty: "beginner",
            instructions: "Sit at a cable row station with feet secured. Grab the handle with arms extended, keep your back straight, and pull the handle to your lower chest, then slowly return to start.",
            imageUrl: "https://static.strengthlevel.com/images/exercises/seated-cable-row/seated-cable-row-800.jpg"
        },
        {
            id: "0024",
            name: "Leg Curl",
            target: "quadriceps",
            equipment: "machine",
            difficulty: "beginner",
            instructions: "Lie face down on the leg curl machine. Hook your ankles under the pad and curl your legs up towards your buttocks, then slowly lower back down.",
            imageUrl: "https://static.strengthlevel.com/images/exercises/seated-leg-curl/seated-leg-curl-800.jpg"
        },
        {
            id: "0025",
            name: "Lateral Raise",
            target: "traps",
            equipment: "dumbbell",
            difficulty: "beginner",
            instructions: "Stand holding dumbbells at your sides. Keep a slight bend in your elbows and raise the weights out to your sides until arms are parallel to the ground, then lower back down.",
            imageUrl: "https://static.strengthlevel.com/images/illustrations/dumbbell-lateral-raise-1000x1000.jpg"
        },
        {
            id: "0026",
            name: "Neck Extension",
            target: "neck",
            equipment: "bodyweight",
            difficulty: "beginner",
            instructions: "Lie face down with your head off the edge of a bench. Slowly lift your head back, then return to the starting position.",
            imageUrl: "https://static.strengthlevel.com/images/exercises/neck-extension/neck-extension-800.jpg"
        },
        {
            id: "0027",
            name: "Hip Abduction",
            target: "abductors",
            equipment: "machine",
            difficulty: "beginner",
            instructions: "Sit in the hip abduction machine, position your thighs against the pads. Push your legs apart against resistance, then slowly return to starting position.",
            imageUrl: "https://static.strengthlevel.com/images/exercises/hip-abduction/hip-abduction-800.jpg"
        },
        {
            id: "0028",
            name: "Hip Adduction",
            target: "adductors",
            equipment: "machine",
            difficulty: "beginner",
            instructions: "Sit in the hip adduction machine, position your thighs against the pads. Squeeze your legs together against resistance, then slowly return to starting position.",
            imageUrl: "https://static.strengthlevel.com/images/exercises/hip-abduction/hip-abduction-800.jpg"
        },
        {
            id: "0029",
            name: "Reverse Wrist Curl",
            target: "forearms",
            equipment: "dumbbell",
            difficulty: "beginner",
            instructions: "Sit with your forearms resting on your thighs, palms facing down, holding dumbbells. Extend your wrists upward, then slowly lower back down.",
            imageUrl: "https://static.strengthlevel.com/images/illustrations/reverse-wrist-curl-1000x1000.jpg"
        },
        {
            id: "0030",
            name: "Hip Thrust",
            target: "glutes",
            equipment: "barbell",
            difficulty: "intermediate",
            instructions: "Sit with your upper back against a bench, place a barbell over your hips. Drive your hips up by squeezing your glutes, then lower back down.",
            imageUrl: "https://static.strengthlevel.com/images/exercises/hip-thrust/hip-thrust-800.jpg"
        },
        {
            id: "0031",
            name: "Lying Leg Curl",
            target: "hamstrings",
            equipment: "machine",
            difficulty: "beginner",
            instructions: "Lie face down on the leg curl machine. Hook your ankles under the pad and curl your legs up towards your buttocks, then slowly lower back down.",
            imageUrl: "https://static.strengthlevel.com/images/illustrations/lying-leg-curl-1000x1000.jpg"
        },
        {
            id: "0032",
            name: "T-Bar Row",
            target: "middle_back",
            equipment: "barbell",
            difficulty: "intermediate",
            instructions: "Stand straddling a T-bar with your chest up. Grip the handles, pull the weight up to your chest while keeping your elbows close to your body, then lower back down.",
            imageUrl: "https://static.strengthlevel.com/images/illustrations/t-bar-row-1000x1000.jpg"
        }
    ];
    
    // Filter exercises based on muscle group
    let filteredExercises = exercisesBase.filter(ex => ex.target === muscleGroup);
    
    // Apply additional filters if specified
    if (equipment) {
        filteredExercises = filteredExercises.filter(ex => ex.equipment === equipment);
    }
    
    if (difficulty) {
        filteredExercises = filteredExercises.filter(ex => ex.difficulty === difficulty);
    }
    
    // If no exercises match, return a few from the selected muscle group
    if (filteredExercises.length === 0) {
        return exercisesBase.filter(ex => ex.target === muscleGroup).slice(0, 3);
    }
    
    return filteredExercises;
}

function displayExercises(exercises) {
    if (!exercises || exercises.length === 0) {
        exerciseList.innerHTML = '<div class="col-span-3 text-center py-8">No exercises found. Try different filters.</div>';
        return;
    }
    exerciseList.innerHTML = '';
    exercises.forEach(exercise => {
        const card = document.createElement('div');
        card.className = 'bg-white rounded-lg shadow-md overflow-hidden exercise-card flex flex-col';
        const image = document.createElement('img');
        image.className = 'w-full h-40 object-cover';
        image.src = exercise.imageUrl || 'https://api.placeholder.com/300x200?text=Exercise';
        image.alt = exercise.name;
        card.appendChild(image);
        const content = document.createElement('div');
        content.className = 'p-4 flex-1 flex flex-col';
        const name = document.createElement('h3');
        name.className = 'text-lg font-bold mb-2';
        name.textContent = exercise.name;
        const details = document.createElement('div');
        details.className = 'text-sm text-gray-600 mb-4';
        details.innerHTML = `
            <p><span class="font-medium">Equipment:</span> ${exercise.equipment.charAt(0).toUpperCase() + exercise.equipment.slice(1)}</p>
            <p><span class="font-medium">Difficulty:</span> ${exercise.difficulty.charAt(0).toUpperCase() + exercise.difficulty.slice(1)}</p>
        `;
        const instructions = document.createElement('p');
        instructions.className = 'text-sm text-gray-700 mb-4';
        instructions.textContent = exercise.instructions;
        const addButton = document.createElement('button');
        addButton.className = 'bg-blue-600 text-white w-full py-2 rounded-lg font-medium hover:bg-blue-700 transition mt-auto';
        addButton.textContent = 'Add to Workout';
        addButton.addEventListener('click', () => addExerciseToWorkout(exercise));
        content.appendChild(name);
        content.appendChild(details);
        content.appendChild(instructions);
        content.appendChild(addButton);
        card.appendChild(content);
        exerciseList.appendChild(card);
    });
    // Show current workout section if not already visible
    currentWorkout.classList.remove('hidden');
}

function addExerciseToWorkout(exercise) {
    // Add exercise to current workout plan
    currentWorkoutPlan.exercises.push({
        id: exercise.id,
        name: exercise.name,
        sets: 3,
        reps: 10,
        rest: 60 // Rest time in seconds
    });
    
    // Update UI
    displayCurrentWorkout();
}

function displayCurrentWorkout() {
    if (currentWorkoutPlan.exercises.length === 0) {
        workoutExercises.innerHTML = '<div class="text-gray-500 text-center py-8">No exercises added yet. Search and add exercises above.</div>';
        // Hide current workout section if empty
        currentWorkout.classList.add('hidden');
        return;
    }
    // Show current workout section if there are exercises
    currentWorkout.classList.remove('hidden');
    workoutExercises.innerHTML = '';
    
    // Create table
    const table = document.createElement('table');
    table.className = 'w-full border-collapse';
    
    // Create table header
    const thead = document.createElement('thead');
    thead.className = 'bg-gray-100';
    thead.innerHTML = `
        <tr>
            <th class="py-2 px-4 text-left">Exercise</th>
            <th class="py-2 px-4 text-center">Sets</th>
            <th class="py-2 px-4 text-center">Reps</th>
            <th class="py-2 px-4 text-center">Rest</th>
            <th class="py-2 px-4 text-center">Actions</th>
        </tr>
    `;
    
    // Create table body
    const tbody = document.createElement('tbody');
    currentWorkoutPlan.exercises.forEach((exercise, index) => {
        const tr = document.createElement('tr');
        tr.className = 'border-b';
        
        const tdName = document.createElement('td');
        tdName.className = 'py-3 px-4';
        tdName.textContent = exercise.name;
        
        const tdSets = document.createElement('td');
        tdSets.className = 'py-3 px-4 text-center';
        const setsInput = document.createElement('input');
        setsInput.type = 'number';
        setsInput.className = 'w-16 text-center border rounded-lg p-1';
        setsInput.value = exercise.sets;
        setsInput.min = 1;
        setsInput.max = 10;
        setsInput.addEventListener('change', (e) => {
            currentWorkoutPlan.exercises[index].sets = parseInt(e.target.value);
        });
        tdSets.appendChild(setsInput);
        
        const tdReps = document.createElement('td');
        tdReps.className = 'py-3 px-4 text-center';
        const repsInput = document.createElement('input');
        repsInput.type = 'number';
        repsInput.className = 'w-16 text-center border rounded-lg p-1';
        repsInput.value = exercise.reps;
        repsInput.min = 1;
        repsInput.max = 100;
        repsInput.addEventListener('change', (e) => {
            currentWorkoutPlan.exercises[index].reps = parseInt(e.target.value);
        });
        tdReps.appendChild(repsInput);
        
        const tdRest = document.createElement('td');
        tdRest.className = 'py-3 px-4 text-center';
        const restInput = document.createElement('input');
        restInput.type = 'number';
        restInput.className = 'w-16 text-center border rounded-lg p-1';
        restInput.value = exercise.rest;
        restInput.min = 0;
        restInput.max = 300;
        restInput.addEventListener('change', (e) => {
            currentWorkoutPlan.exercises[index].rest = parseInt(e.target.value);
        });
        tdRest.appendChild(restInput);
        
        const tdActions = document.createElement('td');
        tdActions.className = 'py-3 px-4 text-center';
        const removeBtn = document.createElement('button');
        removeBtn.className = 'text-red-600 hover:text-red-800';
        removeBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>';
        removeBtn.addEventListener('click', () => removeExerciseFromWorkout(index));
        tdActions.appendChild(removeBtn);
        
        tr.appendChild(tdName);
        tr.appendChild(tdSets);
        tr.appendChild(tdReps);
        tr.appendChild(tdRest);
        tr.appendChild(tdActions);
        
        tbody.appendChild(tr);
    });
    
    table.appendChild(thead);
    table.appendChild(tbody);
    workoutExercises.appendChild(table);
}

function removeExerciseFromWorkout(index) {
    currentWorkoutPlan.exercises.splice(index, 1);
    displayCurrentWorkout();
}

function clearWorkoutPlan() {
    currentWorkoutPlan = {
        name: "",
        exercises: []
    };
    document.getElementById('workout-name').value = "";
    displayCurrentWorkout();
    // Hide current workout section after clearing
    currentWorkout.classList.add('hidden');
}

function saveWorkoutPlan() {
    if (currentWorkoutPlan.exercises.length === 0) {
        alert('Please add at least one exercise to your workout');
        return;
    }
    
    const workoutName = document.getElementById('workout-name').value;
    if (!workoutName) {
        alert('Please give your workout a name');
        return;
    }
    
    currentWorkoutPlan.name = workoutName;
    
    // Save workout to user's saved workouts
    savedWorkouts.push({...currentWorkoutPlan});
    localStorage.setItem(`workouts_${currentUser.email}`, JSON.stringify(savedWorkouts));
    
    // Update UI
    alert(`Workout "${workoutName}" saved successfully!`);
    clearWorkoutPlan();
    document.getElementById('profile-workouts').value = savedWorkouts.length;
}

function loadWorkoutForEdit(index) {
    const workout = savedWorkouts[index];
    
    // Load workout into current workout plan
    currentWorkoutPlan = {
        name: workout.name,
        exercises: [...workout.exercises]
    };
    
    // Update UI
    document.getElementById('workout-name').value = workout.name;
    displayCurrentWorkout();
    
    // Switch to workout planner section
    showSection('workout-planner');
    
    // Delete the old workout
    deleteWorkout(index, false);
}

function deleteWorkout(index, showConfirm = true) {
    if (showConfirm && !confirm('Are you sure you want to delete this workout?')) {
        return;
    }
    
    savedWorkouts.splice(index, 1);
    localStorage.setItem(`workouts_${currentUser.email}`, JSON.stringify(savedWorkouts));
    
    // Update UI
    loadSavedWorkouts();
}

function startWorkout(workout) {
    alert(`Starting workout: ${workout.name}\n\nIn a full application, this would launch the workout tracker/timer.`);
}

// Initialize the app when DOM is loaded
=======
const API_KEY = "c753cadb88msh8452454e2a62bf5p126aafjsna7a968f0e9e4";
const API_HOST = "exercisedb.p.rapidapi.com";
const navLinks = document.querySelectorAll('.nav-link');
const pageSections = document.querySelectorAll('.page-section');
const loginBtn = document.getElementById('login-btn');
const registerBtn = document.getElementById('register-btn');
const authModal = document.getElementById('auth-modal');
const closeAuth = document.getElementById('close-auth');
const authTitle = document.getElementById('auth-title');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const logoutBtn = document.getElementById('logout-btn');
const startNowBtn = document.getElementById('start-now-btn');
const searchExercisesBtn = document.getElementById('search-exercises');
const exerciseResults = document.getElementById('exercise-results');
const exerciseList = document.getElementById('exercise-list');
const currentWorkout = document.getElementById('current-workout');
const workoutExercises = document.getElementById('workout-exercises');
const saveWorkoutBtn = document.getElementById('save-workout');
const clearWorkoutBtn = document.getElementById('clear-workout');
const navLinksCont = document.getElementById('nav-links');
const authButtons = document.getElementById('auth-buttons');
const userProfile = document.getElementById('user-profile');
const usernameDisplay = document.getElementById('username-display');

// App State
let currentUser = null;
let currentWorkoutPlan = {
    name: "",
    exercises: []
};
let savedWorkouts = [];

// Initialize App
function initApp() {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
        showLoggedInState();
        loadUserData();
    } else {
        showLoggedOutState();
    }

    showSection('home');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.getAttribute('data-target');
            showSection(target);
        });
    });

    loginBtn.addEventListener('click', () => {
        showAuthModal('login');
    });

    registerBtn.addEventListener('click', () => {
        showAuthModal('register');
    });

    closeAuth.addEventListener('click', () => {
        authModal.classList.add('hidden');
    });

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleLogin();
    });

    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleRegister();
    });

    logoutBtn.addEventListener('click', handleLogout);

    startNowBtn.addEventListener('click', () => {
        if (currentUser) {
            showSection('workout-planner');
        } else {
            showAuthModal('login');
        }
    });

    searchExercisesBtn.addEventListener('click', searchExercises);

    clearWorkoutBtn.addEventListener('click', () => {
        clearWorkoutPlan();
    });

    saveWorkoutBtn.addEventListener('click', saveWorkoutPlan);
}

// Functions
function showSection(sectionId) {
    pageSections.forEach(section => {
        section.classList.add('hidden');
    });
    document.getElementById(sectionId).classList.remove('hidden');
    
    // Update active nav link
    navLinks.forEach(link => {
        if (link.getAttribute('data-target') === sectionId) {
            link.classList.add('font-bold');
        } else {
            link.classList.remove('font-bold');
        }
    });
}

function showAuthModal(type) {
    authModal.classList.remove('hidden');
    
    if (type === 'login') {
        authTitle.textContent = 'Login';
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
    } else {
        authTitle.textContent = 'Register';
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
    }
}

function handleLogin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        currentUser = {
            name: user.name,
            email: user.email,
            memberId: user.memberId,
            memberSince: user.memberSince
        };
        
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        showLoggedInState();
        authModal.classList.add('hidden');
        showSection('workout-planner');
        loadUserData();
    } else {
        alert('Invalid email or password');
    }
}

function handleRegister() {
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    
    // In a real app, we would send this to a server
    // For demo purposes, we'll store in localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if user already exists
    if (users.some(u => u.email === email)) {
        alert('User with this email already exists');
        return;
    }
    
    const newUser = {
        name,
        email,
        password,
        memberId: 'FXP' + Date.now().toString().substr(-6),
        memberSince: new Date().toLocaleDateString()
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    currentUser = {
        name: newUser.name,
        email: newUser.email,
        memberId: newUser.memberId,
        memberSince: newUser.memberSince
    };
    
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    showLoggedInState();
    authModal.classList.add('hidden');
    showSection('workout-planner');
    loadUserData();
}

function handleLogout() {
    localStorage.removeItem('currentUser');
    currentUser = null;
    showLoggedOutState();
    showSection('home');
}

function showLoggedInState() {
    authButtons.classList.add('hidden');
    userProfile.classList.remove('hidden');
    navLinksCont.classList.remove('hidden');
    usernameDisplay.textContent = currentUser.name.split(' ')[0];
}

function showLoggedOutState() {
    authButtons.classList.remove('hidden');
    userProfile.classList.add('hidden');
    navLinksCont.classList.add('hidden');
}

function loadUserData() {
    // Load profile data
    document.getElementById('profile-name').value = currentUser.name;
    document.getElementById('profile-email').value = currentUser.email;
    document.getElementById('profile-member-since').value = currentUser.memberSince;
    
    // Set profile initials
    const initials = currentUser.name.split(' ').map(n => n[0]).join('');
    document.getElementById('profile-initials').textContent = initials;
    
    // Load saved workouts
    loadSavedWorkouts();
}

function loadSavedWorkouts() {
    const userWorkouts = JSON.parse(localStorage.getItem(`workouts_${currentUser.email}`) || '[]');
    savedWorkouts = userWorkouts;
    
    document.getElementById('profile-workouts').value = savedWorkouts.length;
    
    // Display workouts
    const workoutsList = document.getElementById('saved-workouts-list');
    
    if (savedWorkouts.length === 0) {
        workoutsList.innerHTML = '<div class="text-gray-500 text-center py-8">No saved workouts yet. Create a workout in the Workout Planner.</div>';
        return;
    }
    
    workoutsList.innerHTML = '';
    savedWorkouts.forEach((workout, index) => {
        const workoutCard = document.createElement('div');
        workoutCard.className = 'bg-white p-6 rounded-lg shadow-md flex flex-col';
        
        const header = document.createElement('div');
        header.className = 'flex justify-between items-center mb-4';
        
        const title = document.createElement('h3');
        title.className = 'text-xl font-bold';
        title.textContent = workout.name || `Workout ${index + 1}`;
        
        const actions = document.createElement('div');
        actions.className = 'flex space-x-2';
        
        const editBtn = document.createElement('button');
        editBtn.className = 'text-blue-600 hover:text-blue-800';
        editBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>';
        editBtn.addEventListener('click', () => loadWorkoutForEdit(index));
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'text-red-600 hover:text-red-800';
        deleteBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>';
        deleteBtn.addEventListener('click', () => deleteWorkout(index));
        
        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);
        
        header.appendChild(title);
        header.appendChild(actions);
        
        const exerciseCount = document.createElement('div');
        exerciseCount.className = 'text-gray-600 mb-4';
        exerciseCount.textContent = `${workout.exercises.length} exercise${workout.exercises.length !== 1 ? 's' : ''}`;
        
        const workoutImage = document.createElement('img');
        workoutImage.src = 'https://static.wikitide.net/avidwiki/thumb/e/e6/FXP_%282016%29.png/480px-FXP_%282016%29.png';
        workoutImage.alt = 'Workout Image';
        workoutImage.className = 'w-full h-40 object-cover rounded mb-4';
        
        const exercisesList = document.createElement('ul');
        exercisesList.className = 'text-gray-700 mb-4 flex-grow';
        
            const displayLimit = Math.min(3, workout.exercises.length);
        for (let i = 0; i < displayLimit; i++) {
            const exercise = workout.exercises[i];
            const exerciseItem = document.createElement('li');
            exerciseItem.className = 'mb-1';
            exerciseItem.textContent = exercise.name;
            exercisesList.appendChild(exerciseItem);
        }
        
        if (workout.exercises.length > 3) {
            const moreItem = document.createElement('li');
            moreItem.className = 'text-blue-600';
            moreItem.textContent = `...and ${workout.exercises.length - 3} more`;
            exercisesList.appendChild(moreItem);
        }
        
        const startBtn = document.createElement('button');
        startBtn.className = 'bg-blue-600 text-white w-full py-2 rounded-lg font-medium hover:bg-blue-700 transition mt-auto';
        startBtn.textContent = 'Start Workout';
        startBtn.addEventListener('click', () => startWorkout(workout));
        
            workoutCard.appendChild(header);
        workoutCard.appendChild(workoutImage);
        workoutCard.appendChild(exerciseCount);
        workoutCard.appendChild(exercisesList);
        workoutCard.appendChild(startBtn);
        workoutsList.appendChild(workoutCard);
    });
}

function searchExercises() {
    const muscleGroup = document.getElementById('muscle-group').value;
    const equipment = document.getElementById('equipment').value;
    const difficulty = document.getElementById('difficulty').value;
    
    if (!muscleGroup) {
        alert('Please select a muscle group');
        return;
    }
    
    exerciseList.innerHTML = '<div class="col-span-3 text-center py-8"><div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div><p class="mt-2">Loading exercises...</p></div>';
    exerciseResults.classList.remove('hidden');
    
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': API_KEY,
            'X-RapidAPI-Host': API_HOST
        }
    };
    
    let url = `https://exercisedb.p.rapidapi.com/exercises/target/${muscleGroup}`;
    
    setTimeout(() => {
        const mockExercises = getMockExercises(muscleGroup, equipment, difficulty);
        displayExercises(mockExercises);
    }, 1000);
}

function getMockExercises(muscleGroup, equipment, difficulty) {
    const exercisesBase = [
        {
            id: "0001",
            name: "Barbell Bench Press",
            target: "chest",
            equipment: "barbell",
            difficulty: "intermediate",
            instructions: "Lie on a flat bench, grip the barbell with hands slightly wider than shoulder-width apart, lower the bar to your chest, then push it back up.",
            imageUrl: "https://static.strengthlevel.com/images/illustrations/bench-press-1000x1000.jpg"
        },
        {
            id: "0002", 
            name: "Push-up",
            target: "chest",
            equipment: "bodyweight",
            difficulty: "beginner",
            instructions: "Get into a plank position with hands shoulder-width apart, lower your body until your chest nearly touches the floor, then push back up.",
            imageUrl: "https://static.strengthlevel.com/images/illustrations/push-ups-1000x1000.jpg"
        },
        {
            id: "0003",
            name: "Dumbbell Fly",
            target: "chest",
            equipment: "dumbbell",
            difficulty: "intermediate",
            instructions: "Lie on a flat bench holding dumbbells above your chest with palms facing each other, lower the weights out to the sides in an arc, then bring them back up.",
            imageUrl: "https://static.strengthlevel.com/images/exercises/dumbbell-fly/dumbbell-fly-800.jpg"
        },
        {
            id: "0004",
            name: "Squat",
            target: "quadriceps",
            equipment: "bodyweight",
            difficulty: "beginner",
            instructions: "Stand with feet shoulder-width apart, lower your body by bending your knees and pushing your hips back, then return to standing position.",
            imageUrl: "https://static.strengthlevel.com/images/illustrations/bodyweight-squat-1000x1000.jpg"
        },
        {
            id: "0005",
            name: "Barbell Back Squat",
            target: "quadriceps",
            equipment: "barbell",
            difficulty: "intermediate",
            instructions: "Place a barbell on your upper back, feet shoulder-width apart, lower your body by bending your knees and pushing your hips back, then return to standing position.",
            imageUrl: "https://static.strengthlevel.com/images/illustrations/squat-1000x1000.jpg"
        },
        {
            id: "0006",
            name: "Leg Press",
            target: "quadriceps",
            equipment: "machine",
            difficulty: "beginner",
            instructions: "Sit in the leg press machine, place your feet on the platform shoulder-width apart, lower the platform by bending your knees, then push it back up.",
            imageUrl: "https://static.strengthlevel.com/images/exercises/sled-leg-press/sled-leg-press-800.jpg"
        },
        {
            id: "0007",
            name: "Lat Pulldown",
            target: "lats",
            equipment: "cable",
            difficulty: "beginner",
            instructions: "Sit at a lat pulldown machine, grip the bar with hands wider than shoulder-width apart, pull the bar down to your chest, then slowly release it back up.",
            imageUrl: "https://static.strengthlevel.com/images/illustrations/lat-pulldown-1000x1000.jpg"
        },
        {
            id: "0008",
            name: "Pull-up",
            target: "lats",
            equipment: "bodyweight",
            difficulty: "intermediate",
            instructions: "Hang from a pull-up bar with hands slightly wider than shoulder-width apart, pull your body up until your chin is over the bar, then lower back down.",
            imageUrl: "https://static.strengthlevel.com/images/illustrations/pull-ups-1000x1000.jpg"
        },
        {
            id: "0009",
            name: "Barbell Deadlift",
            target: "lower_back",
            equipment: "barbell",
            difficulty: "expert",
            instructions: "Stand with feet hip-width apart, bend at the hips and knees to grip the barbell, lift the bar by extending your hips and knees, then lower it back down.",
            imageUrl: "https://static.strengthlevel.com/images/illustrations/deadlift-1000x1000.jpg"
        },
        {
            id: "0010",
            name: "Dumbbell Bicep Curl",
            target: "biceps",
            equipment: "dumbbell",
            difficulty: "beginner",
            instructions: "Stand with a dumbbell in each hand, palms facing forward, curl the weights toward your shoulders, then lower them back down.",
            imageUrl: "https://static.strengthlevel.com/images/illustrations/dumbbell-curl-1000x1000.jpg"
        },
        {
            id: "0011",
            name: "Tricep Dip",
            target: "triceps",
            equipment: "bodyweight",
            difficulty: "intermediate",
            instructions: "Support yourself between parallel bars, lower your body by bending your elbows, then push back up.",
            imageUrl: "https://static.strengthlevel.com/images/exercises/dips/dips-800.jpg"
        },
        {
            id: "0012",
            name: "Plank",
            target: "abdominals",
            equipment: "bodyweight",
            difficulty: "beginner",
            instructions: "Get into a push-up position but rest on your forearms, keep your body in a straight line from head to heels, and hold.",
            imageUrl: "https://static.strengthlevel.com/images/illustrations/plank-1000x1000.jpg"
        },
        {
            id: "0013",
            name: "Russian Twist",
            target: "abdominals",
            equipment: "bodyweight",
            difficulty: "intermediate",
            instructions: "Sit on the floor with knees bent, lean back slightly, twist your torso from side to side.",
            imageUrl: "https://static.strengthlevel.com/images/illustrations/russian-twist-1000x1000.jpg"
        },
        {
            id: "0014",
            name: "Calf Raise",
            target: "calves",
            equipment: "bodyweight",
            difficulty: "beginner",
            instructions: "Stand with feet hip-width apart, raise your heels off the ground, then lower them back down.",
            imageUrl: "https://static.strengthlevel.com/images/exercises/machine-calf-raise/machine-calf-raise-800.jpg"
        },
        {
            id: "0015",
            name: "Dumbbell Shoulder Press",
            target: "traps",
            equipment: "dumbbell",
            difficulty: "intermediate",
            instructions: "Sit with a dumbbell in each hand at shoulder height, press the weights overhead, then lower them back to shoulder height.",
            imageUrl: "https://static.strengthlevel.com/images/illustrations/dumbbell-shoulder-press-1000x1000.jpg"
        },
        {
            id: "0016",
            name: "Barbell Row",
            target: "lats",
            equipment: "barbell",
            difficulty: "intermediate",
            instructions: "Bend at your hips and knees and grab a barbell with an overhand grip. Keep your back straight, bend your elbows and pull the bar to your lower chest. Lower the bar back to the starting position.",
            imageUrl: "https://static.strengthlevel.com/images/exercises/bent-over-row/bent-over-row-800.jpg"
        },
        {
            id: "0017",
            name: "Military Press",
            target: "traps",
            equipment: "barbell",
            difficulty: "intermediate",
            instructions: "Stand with feet shoulder-width apart, grip the barbell at shoulder level with palms facing forward. Press the bar overhead until arms are fully extended, then lower back to shoulder level.",
            imageUrl: "https://static.strengthlevel.com/images/illustrations/military-press-1000x1000.jpg"
        },
        {
            id: "0018",
            name: "Romanian Deadlift",
            target: "lower_back",
            equipment: "barbell",
            difficulty: "intermediate",
            instructions: "Hold a barbell in front of your thighs, feet shoulder-width apart. Keep your back straight and legs slightly bent, hinge at the hips to lower the bar along your legs until you feel a stretch in your hamstrings, then return to standing.",
            imageUrl: "https://static.strengthlevel.com/images/illustrations/romanian-deadlift-1000x1000.jpg"
        },
        {
            id: "0019",
            name: "Face Pull",
            target: "traps",
            equipment: "cable",
            difficulty: "beginner",
            instructions: "Set a cable pulley to head height, attach a rope. Stand and pull the rope towards your face, separating your hands as you pull. Focus on squeezing your shoulder blades together.",
            imageUrl: "https://static.strengthlevel.com/images/exercises/face-pull/face-pull-800.jpg"
        },
        {
            id: "0020",
            name: "Leg Extension",
            target: "quadriceps",
            equipment: "machine",
            difficulty: "beginner",
            instructions: "Sit in the leg extension machine with your back against the pad. Hook your feet under the pad and extend your legs until they're straight, then slowly lower back down.",
            imageUrl: "https://static.strengthlevel.com/images/illustrations/leg-extension-1000x1000.jpg"
        },
        {
            id: "0021",
            name: "Hammer Curl",
            target: "biceps",
            equipment: "dumbbell",
            difficulty: "beginner",
            instructions: "Stand holding dumbbells at your sides with palms facing each other. Keeping your upper arms stationary, curl the weights up to your shoulders, then lower back down.",
            imageUrl: "https://static.strengthlevel.com/images/illustrations/hammer-curl-1000x1000.jpg"
        },
        {
            id: "0022",
            name: "Incline Bench Press",
            target: "chest",
            equipment: "barbell",
            difficulty: "intermediate",
            instructions: "Lie on an incline bench set to 30-45 degrees. Grip the barbell with hands slightly wider than shoulder-width. Lower the bar to your upper chest, then press it back up.",
            imageUrl: "https://static.strengthlevel.com/images/illustrations/incline-bench-press-1000x1000.jpg"
        },
        {
            id: "0023",
            name: "Seated Cable Row",
            target: "lats",
            equipment: "cable",
            difficulty: "beginner",
            instructions: "Sit at a cable row station with feet secured. Grab the handle with arms extended, keep your back straight, and pull the handle to your lower chest, then slowly return to start.",
            imageUrl: "https://static.strengthlevel.com/images/exercises/seated-cable-row/seated-cable-row-800.jpg"
        },
        {
            id: "0024",
            name: "Leg Curl",
            target: "quadriceps",
            equipment: "machine",
            difficulty: "beginner",
            instructions: "Lie face down on the leg curl machine. Hook your ankles under the pad and curl your legs up towards your buttocks, then slowly lower back down.",
            imageUrl: "https://static.strengthlevel.com/images/exercises/seated-leg-curl/seated-leg-curl-800.jpg"
        },
        {
            id: "0025",
            name: "Lateral Raise",
            target: "traps",
            equipment: "dumbbell",
            difficulty: "beginner",
            instructions: "Stand holding dumbbells at your sides. Keep a slight bend in your elbows and raise the weights out to your sides until arms are parallel to the ground, then lower back down.",
            imageUrl: "https://static.strengthlevel.com/images/illustrations/dumbbell-lateral-raise-1000x1000.jpg"
        },
        {
            id: "0026",
            name: "Neck Extension",
            target: "neck",
            equipment: "bodyweight",
            difficulty: "beginner",
            instructions: "Lie face down with your head off the edge of a bench. Slowly lift your head back, then return to the starting position.",
            imageUrl: "https://static.strengthlevel.com/images/exercises/neck-extension/neck-extension-800.jpg"
        },
        {
            id: "0027",
            name: "Hip Abduction",
            target: "abductors",
            equipment: "machine",
            difficulty: "beginner",
            instructions: "Sit in the hip abduction machine, position your thighs against the pads. Push your legs apart against resistance, then slowly return to starting position.",
            imageUrl: "https://static.strengthlevel.com/images/exercises/hip-abduction/hip-abduction-800.jpg"
        },
        {
            id: "0028",
            name: "Hip Adduction",
            target: "adductors",
            equipment: "machine",
            difficulty: "beginner",
            instructions: "Sit in the hip adduction machine, position your thighs against the pads. Squeeze your legs together against resistance, then slowly return to starting position.",
            imageUrl: "https://static.strengthlevel.com/images/exercises/hip-abduction/hip-abduction-800.jpg"
        },
        {
            id: "0029",
            name: "Reverse Wrist Curl",
            target: "forearms",
            equipment: "dumbbell",
            difficulty: "beginner",
            instructions: "Sit with your forearms resting on your thighs, palms facing down, holding dumbbells. Extend your wrists upward, then slowly lower back down.",
            imageUrl: "https://static.strengthlevel.com/images/illustrations/reverse-wrist-curl-1000x1000.jpg"
        },
        {
            id: "0030",
            name: "Hip Thrust",
            target: "glutes",
            equipment: "barbell",
            difficulty: "intermediate",
            instructions: "Sit with your upper back against a bench, place a barbell over your hips. Drive your hips up by squeezing your glutes, then lower back down.",
            imageUrl: "https://static.strengthlevel.com/images/exercises/hip-thrust/hip-thrust-800.jpg"
        },
        {
            id: "0031",
            name: "Lying Leg Curl",
            target: "hamstrings",
            equipment: "machine",
            difficulty: "beginner",
            instructions: "Lie face down on the leg curl machine. Hook your ankles under the pad and curl your legs up towards your buttocks, then slowly lower back down.",
            imageUrl: "https://static.strengthlevel.com/images/illustrations/lying-leg-curl-1000x1000.jpg"
        },
        {
            id: "0032",
            name: "T-Bar Row",
            target: "middle_back",
            equipment: "barbell",
            difficulty: "intermediate",
            instructions: "Stand straddling a T-bar with your chest up. Grip the handles, pull the weight up to your chest while keeping your elbows close to your body, then lower back down.",
            imageUrl: "https://static.strengthlevel.com/images/illustrations/t-bar-row-1000x1000.jpg"
        }
    ];
    
    // Filter exercises based on muscle group
    let filteredExercises = exercisesBase.filter(ex => ex.target === muscleGroup);
    
    // Apply additional filters if specified
    if (equipment) {
        filteredExercises = filteredExercises.filter(ex => ex.equipment === equipment);
    }
    
    if (difficulty) {
        filteredExercises = filteredExercises.filter(ex => ex.difficulty === difficulty);
    }
    
    // If no exercises match, return a few from the selected muscle group
    if (filteredExercises.length === 0) {
        return exercisesBase.filter(ex => ex.target === muscleGroup).slice(0, 3);
    }
    
    return filteredExercises;
}

function displayExercises(exercises) {
    if (!exercises || exercises.length === 0) {
        exerciseList.innerHTML = '<div class="col-span-3 text-center py-8">No exercises found. Try different filters.</div>';
        return;
    }
    exerciseList.innerHTML = '';
    exercises.forEach(exercise => {
        const card = document.createElement('div');
        card.className = 'bg-white rounded-lg shadow-md overflow-hidden exercise-card flex flex-col';
        const image = document.createElement('img');
        image.className = 'w-full h-40 object-cover';
        image.src = exercise.imageUrl || 'https://api.placeholder.com/300x200?text=Exercise';
        image.alt = exercise.name;
        card.appendChild(image);
        const content = document.createElement('div');
        content.className = 'p-4 flex-1 flex flex-col';
        const name = document.createElement('h3');
        name.className = 'text-lg font-bold mb-2';
        name.textContent = exercise.name;
        const details = document.createElement('div');
        details.className = 'text-sm text-gray-600 mb-4';
        details.innerHTML = `
            <p><span class="font-medium">Equipment:</span> ${exercise.equipment.charAt(0).toUpperCase() + exercise.equipment.slice(1)}</p>
            <p><span class="font-medium">Difficulty:</span> ${exercise.difficulty.charAt(0).toUpperCase() + exercise.difficulty.slice(1)}</p>
        `;
        const instructions = document.createElement('p');
        instructions.className = 'text-sm text-gray-700 mb-4';
        instructions.textContent = exercise.instructions;
        const addButton = document.createElement('button');
        addButton.className = 'bg-blue-600 text-white w-full py-2 rounded-lg font-medium hover:bg-blue-700 transition mt-auto';
        addButton.textContent = 'Add to Workout';
        addButton.addEventListener('click', () => addExerciseToWorkout(exercise));
        content.appendChild(name);
        content.appendChild(details);
        content.appendChild(instructions);
        content.appendChild(addButton);
        card.appendChild(content);
        exerciseList.appendChild(card);
    });
    // Show current workout section if not already visible
    currentWorkout.classList.remove('hidden');
}

function addExerciseToWorkout(exercise) {
    // Add exercise to current workout plan
    currentWorkoutPlan.exercises.push({
        id: exercise.id,
        name: exercise.name,
        sets: 3,
        reps: 10,
        rest: 60 // Rest time in seconds
    });
    
    // Update UI
    displayCurrentWorkout();
}

function displayCurrentWorkout() {
    if (currentWorkoutPlan.exercises.length === 0) {
        workoutExercises.innerHTML = '<div class="text-gray-500 text-center py-8">No exercises added yet. Search and add exercises above.</div>';
        // Hide current workout section if empty
        currentWorkout.classList.add('hidden');
        return;
    }
    // Show current workout section if there are exercises
    currentWorkout.classList.remove('hidden');
    workoutExercises.innerHTML = '';
    
    // Create table
    const table = document.createElement('table');
    table.className = 'w-full border-collapse';
    
    // Create table header
    const thead = document.createElement('thead');
    thead.className = 'bg-gray-100';
    thead.innerHTML = `
        <tr>
            <th class="py-2 px-4 text-left">Exercise</th>
            <th class="py-2 px-4 text-center">Sets</th>
            <th class="py-2 px-4 text-center">Reps</th>
            <th class="py-2 px-4 text-center">Rest</th>
            <th class="py-2 px-4 text-center">Actions</th>
        </tr>
    `;
    
    // Create table body
    const tbody = document.createElement('tbody');
    currentWorkoutPlan.exercises.forEach((exercise, index) => {
        const tr = document.createElement('tr');
        tr.className = 'border-b';
        
        const tdName = document.createElement('td');
        tdName.className = 'py-3 px-4';
        tdName.textContent = exercise.name;
        
        const tdSets = document.createElement('td');
        tdSets.className = 'py-3 px-4 text-center';
        const setsInput = document.createElement('input');
        setsInput.type = 'number';
        setsInput.className = 'w-16 text-center border rounded-lg p-1';
        setsInput.value = exercise.sets;
        setsInput.min = 1;
        setsInput.max = 10;
        setsInput.addEventListener('change', (e) => {
            currentWorkoutPlan.exercises[index].sets = parseInt(e.target.value);
        });
        tdSets.appendChild(setsInput);
        
        const tdReps = document.createElement('td');
        tdReps.className = 'py-3 px-4 text-center';
        const repsInput = document.createElement('input');
        repsInput.type = 'number';
        repsInput.className = 'w-16 text-center border rounded-lg p-1';
        repsInput.value = exercise.reps;
        repsInput.min = 1;
        repsInput.max = 100;
        repsInput.addEventListener('change', (e) => {
            currentWorkoutPlan.exercises[index].reps = parseInt(e.target.value);
        });
        tdReps.appendChild(repsInput);
        
        const tdRest = document.createElement('td');
        tdRest.className = 'py-3 px-4 text-center';
        const restInput = document.createElement('input');
        restInput.type = 'number';
        restInput.className = 'w-16 text-center border rounded-lg p-1';
        restInput.value = exercise.rest;
        restInput.min = 0;
        restInput.max = 300;
        restInput.addEventListener('change', (e) => {
            currentWorkoutPlan.exercises[index].rest = parseInt(e.target.value);
        });
        tdRest.appendChild(restInput);
        
        const tdActions = document.createElement('td');
        tdActions.className = 'py-3 px-4 text-center';
        const removeBtn = document.createElement('button');
        removeBtn.className = 'text-red-600 hover:text-red-800';
        removeBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>';
        removeBtn.addEventListener('click', () => removeExerciseFromWorkout(index));
        tdActions.appendChild(removeBtn);
        
        tr.appendChild(tdName);
        tr.appendChild(tdSets);
        tr.appendChild(tdReps);
        tr.appendChild(tdRest);
        tr.appendChild(tdActions);
        
        tbody.appendChild(tr);
    });
    
    table.appendChild(thead);
    table.appendChild(tbody);
    workoutExercises.appendChild(table);
}

function removeExerciseFromWorkout(index) {
    currentWorkoutPlan.exercises.splice(index, 1);
    displayCurrentWorkout();
}

function clearWorkoutPlan() {
    currentWorkoutPlan = {
        name: "",
        exercises: []
    };
    document.getElementById('workout-name').value = "";
    displayCurrentWorkout();
    // Hide current workout section after clearing
    currentWorkout.classList.add('hidden');
}

function saveWorkoutPlan() {
    if (currentWorkoutPlan.exercises.length === 0) {
        alert('Please add at least one exercise to your workout');
        return;
    }
    
    const workoutName = document.getElementById('workout-name').value;
    if (!workoutName) {
        alert('Please give your workout a name');
        return;
    }
    
    currentWorkoutPlan.name = workoutName;
    
    // Save workout to user's saved workouts
    savedWorkouts.push({...currentWorkoutPlan});
    localStorage.setItem(`workouts_${currentUser.email}`, JSON.stringify(savedWorkouts));
    
    // Update UI
    alert(`Workout "${workoutName}" saved successfully!`);
    clearWorkoutPlan();
    document.getElementById('profile-workouts').value = savedWorkouts.length;
}

function loadWorkoutForEdit(index) {
    const workout = savedWorkouts[index];
    
    // Load workout into current workout plan
    currentWorkoutPlan = {
        name: workout.name,
        exercises: [...workout.exercises]
    };
    
    // Update UI
    document.getElementById('workout-name').value = workout.name;
    displayCurrentWorkout();
    
    // Switch to workout planner section
    showSection('workout-planner');
    
    // Delete the old workout
    deleteWorkout(index, false);
}

function deleteWorkout(index, showConfirm = true) {
    if (showConfirm && !confirm('Are you sure you want to delete this workout?')) {
        return;
    }
    
    savedWorkouts.splice(index, 1);
    localStorage.setItem(`workouts_${currentUser.email}`, JSON.stringify(savedWorkouts));
    
    // Update UI
    loadSavedWorkouts();
}

function startWorkout(workout) {
    alert(`Starting workout: ${workout.name}\n\nIn a full application, this would launch the workout tracker/timer.`);
}

// Initialize the app when DOM is loaded
>>>>>>> ca21439a9c06770ca5eb0bb878d151c14c434aae
document.addEventListener('DOMContentLoaded', initApp);