// Listen for Auth State changes
auth.onAuthStateChanged(user => {
    // Logout (null) vs Login (Object)
    // Basic check if User info exists
    if (user) {
        // Get data snapshot of user, set up listener for changes on db
        db.collection('users').doc(user.uid).onSnapshot(snapshot => {
            // Set user information for account modal
            setupUI(user);
        }, e => {
            // Error checking
            console.log(e.message);
        });

        // Get data snapshot of books
        db.collection("users").doc(user.uid).collection("books").onSnapshot(snapshot => {
            let bookList = []
            snapshot.forEach(book => {
                let tempData = book.data();
                tempData.id = book.ref.id;
                bookList.push(tempData);
            });
            // Set book information for bookGrid
            setupBooks(bookList, "online");
        });
    } else {
        // Output shell data
        setupUI();
        setupBooks([]);
    }
});

// Handle closing of modal if clicked outside of modal
const modalContainer = document.querySelector("#modalContainer");
modalContainer.addEventListener('mousedown', (e) => {
    const modalList = document.querySelectorAll('.modal');
    const mainContent = document.querySelector('#libraryContainer');

    // Loops over list of modals, closes only on active modal
    for (i = 0; i < modalList.length; i++) {
        if (e.target == modalContainer && modalList[i].style.display == "flex") {
            modalList[i].style.display = "none";
            modalContainer.style.display = "none";
            mainContent.setAttribute("class", "");
        }
    }
});

// Close modal, clear information, remove modal overlay
const resetModal = function(modalName) {
    const modalBackground = document.querySelector("#modalContainer");
    const currentModal = document.querySelector(`#modal-${modalName}`);
    modalBackground.style.display = "none";
    currentModal.style.display = "none";

    const mainContent = document.querySelector("#libraryContainer");
    mainContent.setAttribute("class", "");

    if (modalName == "account") {
        let accountDetails = document.querySelector('.account-details');
        accountDetails.innerHTML = '';
    } else if (modalName == "bookRead") {
        let confirmStatusDetails = document.querySelector(".confirmStatusDetails");
        confirmStatusDetails.innerHTML = '';
    } else {
        const currentForm = document.querySelector(`#${modalName}Form`);
        currentForm.reset();
    };
};

// Open modal
const selectModal = function(modalName) {
    const modalBackground = document.querySelector("#modalContainer");
    const currentModal = document.querySelector(`#modal-${modalName}`);
    const userNotifications = document.querySelector('#userNotifications');
    modalBackground.style.display = "flex";
    currentModal.style.display = "flex";
    userNotifications.textContent = "";

    const mainContent = document.querySelector("#libraryContainer");
    mainContent.setAttribute("class", "modalOverlay");
};

// Create New User
const signupForm = document.querySelector("#signupForm");
signupForm.addEventListener('submit', (e) => {
    // Prevent default action of button
    e.preventDefault();

    // Get User Info
    const email = signupForm['signup-email'].value;
    const password = signupForm['signup-password'].value;

    // Sign up User Info
    auth.createUserWithEmailAndPassword(email, password).then(credentials => {
        // Create and Pull user credentials with auto-UID
        // Setting username value to email string before '@'
        //      ex. 'abc123@email.com' => 'abc123'
        let currentDate = new Date();
        let formattedDate = `${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear()} ${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`
        
        // TODO: Check if anonLibrary needs to be converted into Firestore
        db.collection('users').doc(credentials.user.uid).set({
            username: email.split('@')[0],
            booksRead: 0,
            booksTotal: 0,
            createdOn: formattedDate
        }).catch(e => {
            console.log(e.message);
        });
    }).then(() => {
        // Close modal and clear form
        resetModal('signup');
        notifyUser("pass", `User '${email.split('@')[0]}' has signed up! Welcome!`)
    });
});

// Log Out User
const logout = document.querySelector('#logoutButton');
logout.addEventListener('click', (e) => {
    // Prevent default action of button
    e.preventDefault();

    // Sign User Out
    auth.signOut();
    location.reload();
});

// Log In User
const loginForm = document.querySelector('#loginForm');
loginForm.addEventListener('submit', (e) => {
    // Prevent default action of button
    e.preventDefault();

    // Get User Info from Form
    const email = loginForm['login-email'].value;
    const password = loginForm['login-password'].value;

    // Log User In
    auth.signInWithEmailAndPassword(email, password).then(credentials => {
        // Close modal and clear form
        resetModal('login');

        notifyUser("pass", `User '${email.split('@')[0]}' has logged in!`)
    }).catch((e) => {
        // Error on login
        console.log(e.message);
    });
});