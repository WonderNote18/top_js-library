// TODO: Change main functions to work with Firestore
// TODO: Update functions to use innerHTML instead of creating individual elements
// TODO: Change how readButton-to-bookID tracking works with Firestore
// TODO: Allow data to be entered once an account has been created {difficult}
// IDEA: Create anonymous UUID on creation of first book if non user, then save book/user into DB

// DOM element for Book Grid
const bookList = document.querySelector('#bookGrid');

// Book array for anonymous users/users not signed in
const anonLibrary = [];

// DOM elements for Login/Logout Buttons
const loggedInActions = document.querySelectorAll('.logged-in');
const loggedOutActions = document.querySelectorAll('.logged-out');

// DOM element for Account information
const accountDetails = document.querySelector('.account-details');

// Sets up UI elements based on User Login status
const setupUI = function(user) {
    if (user) {
        // Gather Account Info, publish for Account button
        db.collection('users').doc(user.uid).get().then(doc => {
            let userDb = doc.data();
            const html = `
            <div class="modalTableField">Username:</div>
            <div class="modalTableValue" id="accountUser">${userDb.username}</div>
            <div class="modalTableField">Books Read:</div>
            <div class="modalTableValue">${userDb.booksRead}</div>
            <div class="modalTableField">Total Books:</div>
            <div class="modalTableValue">${userDb.booksTotal}</div>
            <div class="modalTableField">Created On:</div>
            <div class="modalTableValue">${userDb.createdOn}</div>
            `;
            accountDetails.innerHTML = html;
        });

        // Toggle UI Elements
        loggedInActions.forEach(item => item.style.display = 'flex');
        loggedOutActions.forEach(item => item.style.display = 'none');
    } else {
        // Hide account Info
        accountDetails.innerHTML = '';

        // Toggle UI Elements
        loggedInActions.forEach(item => item.style.display = 'none');
        loggedOutActions.forEach(item => item.style.display = 'flex');
    };
};

// Output Books using collection data from db ref in auth.js
const setupBooks = function(data, loginState="offline") {
    // Checking if there's any data
    if (data.length > 0) {
        // Output Account information
        let html = '';

        // Cycle through database for each item, referencing as doc
        data.forEach(book => {
            // Get data from database item
            let bookStatusClass = '';
            let bookStatusText = '';
            let bookStatusButton = ''
            let bookID = '';

            // Set status of book, disable Read button if book has been read
            if (book.status) {
                bookStatusClass = 'gridReadTrue';
                bookStatusText = 'Completed';
                bookStatusButton = "disabled";
            } else {
                bookStatusClass = 'gridReadFalse';
                bookStatusText = 'Not Completed';
            }

            // Set ID of book
            if (loginState == "online") {
                bookID = book.id;
            } else if (loginState == "offline") {
                bookID = data.indexOf(book);
            }

            // Create HTML template of book to be entered in bookGrid
            const gridEntry = `
            <div class='gridEntry'>
                <div id="title${bookID}" class="gridCell gridFont">
                    <p>${book.title}</p>
                </div>
                <div id="author${bookID}" class="gridCell gridFont">
                    <p>${book.author}</p>
                </div>
                <div id="pages${bookID}" class="gridCell gridFont">
                    <p>${book.pages}</p>
                </div>
                <div id="read${bookID}" class="gridCell gridFont ${bookStatusClass}">
                    <p>${bookStatusText}</p>
                </div>
                <div id="actions${bookID}" class="gridCell gridFont">
                    <button id="readBook${bookID}" class="readButton" data-target="modal-bookRead" onclick="setupReadUI('${bookID}')" ${bookStatusButton}>READ</button>
                </div>
            </div>
            `;
            html += gridEntry;
        });

        // Append data to book grid
        bookList.innerHTML = html;
    };
};

// Sets up bookRead modal to confirm book read selection
const setupReadUI = function(bookID) {
    let user = auth.currentUser;
    var title;
    var author;
    var pages;
    var html;

    if (user) {
        let bookEntryRef = db.collection('users').doc(user.uid).collection('books').doc(bookID);
        bookEntryRef.get().then(book => {
            let bookEntryData = book.data();
            title = bookEntryData.title;
            author = bookEntryData.author;
            pages = bookEntryData.pages;
            html = `
            <div class="modalTableField">Title:</div>
            <div class="modalTableValue">${title}</div>
            <div class="modalTableField">Author:</div>
            <div class="modalTableValue">${author}</div>
            <div class="modalTableField">Pages:</div>
            <div class="modalTableValue">${pages}</div>
            `;

            let confirmStatusDetails = document.querySelector(".confirmStatusDetails");
            confirmStatusDetails.innerHTML = html;

            selectModal('bookRead');
        });
    } else {
        let bookEntryData = anonLibrary[bookID];
        title = bookEntryData.title;
        author = bookEntryData.author;
        pages = bookEntryData.pages;

        html = `
        <div class="modalTableField">Title:</div>
        <div class="modalTableValue">${title}</div>
        <div class="modalTableField">Author:</div>
        <div class="modalTableValue">${author}</div>
        <div class="modalTableField">Pages:</div>
        <div class="modalTableValue">${pages}</div>
        `;

        let confirmStatusDetails = document.querySelector(".confirmStatusDetails");
        confirmStatusDetails.innerHTML = html;

        selectModal('bookRead');
    };

    let readButton = document.querySelector("#confirmReadButton");
    readButton.setAttribute('onclick', `markAsRead('${bookID}')`);
};

// Sends notification on pass/fail of actions, print result on userNotification element
const notifyUser = function(status, message) {
    const userNotifications = document.querySelector("#userNotifications");
    if (status == "pass") {
        userNotifications.setAttribute("class", "gridFont notifyPass");
    } else if (status == "fail") {
        userNotifications.setAttribute("class", "gridFont notifyFail");
    };
    userNotifications.textContent = message;
};

// Changes status of entry as true, changes DOM element for status if offline
const markAsRead = function(bookID) {
    let user = auth.currentUser;
    if (user) {
        let bookEntryRef = db.collection('users').doc(user.uid).collection('books').doc(bookID);
        bookEntryRef.get().then(book => {
            let bookData = book.data();
            if (bookData.status == false) {
                bookEntryRef.update({status: true});
            };
        });

        // Increment counters for user's booksRead
        let userDoc = db.collection('users').doc(user.uid);
        userDoc.get().then(doc => {
            let docData = doc.data();
            userDoc.update({booksRead: firebase.firestore.FieldValue.increment(1)})
        });
    } else {
        // Edit status value of Object in user's local array
        anonLibrary[bookID].status = true;

        // Change DOM elements of Status and Actions cells for entry
        let statusCell = document.querySelector(`#read${bookID}`);
        let statusText = statusCell.getElementsByTagName("p")[0];
        let readButton = document.querySelector(`#readBook${bookID}`);

        statusCell.setAttribute("class", "gridCell gridFont gridReadTrue");
        statusText.textContent = "Completed";
        readButton.disabled = true;
    };

    let bookTitleCell = document.querySelector(`#title${bookID}`);
    let bookTitleText = bookTitleCell.getElementsByTagName("p")[0];
    notifyUser("pass", `Book '${bookTitleText.textContent}' has been read!`);
    resetModal("bookRead");
};

// Add a new book to user's database, display on page
// If user not signed in, store in local array
const bookForm = document.querySelector('#bookForm');
bookForm.addEventListener('submit', (e) => {
    // Prevent default action of button
    e.preventDefault();

    // Get book info from Form
    const title = bookForm['book-title'].value;
    const author = bookForm['book-author'].value;
    const pages = bookForm['book-pages'].value;
    resetModal('book');

    // Verify data integrity and length
    if (title.length > 100 ||
        (title.split(' ').length <= 2 &&
        title.split(' ')[0].length > 30)) {
            notifyUser("fail", "Error: Title length greater than 100 characters.");
            return;
    } else if (author.length > 100 ||
        (author.split(' ').length <= 2 &&
        author.split(' ')[0].length > 30)) {
            notifyUser("fail", "Error: Author length greater than 100 characters.");
            return;
    } else if (pages <= 0 ||
        pages > 100000) {
            notifyUser("fail", "Error: Invalid amount of book pages.");
            return;
    };

    // Check if user is signed in. 
    // If true, add to book collection in Firestore
    // If false, add to anonLibrary and post to file
    let user = auth.currentUser;
    let bookEntry = {
        title: title,
        author: author,
        pages: pages,
        status: false
    }
    if (user) {
        // Add book to 'books' collection in user's DB
        let bookRef = db.collection('users').doc(user.uid).collection('books');
        bookRef.add(bookEntry).then(doc => {
            notifyUser("pass", `New Book '${title}' has been added!`);
        }).catch(e => {
            console.log(e.message);
        });

        // Increment counters for user's booksTotal
        let userDoc = db.collection('users').doc(user.uid);
        userDoc.update({booksTotal: firebase.firestore.FieldValue.increment(1)});

    } else {
        anonLibrary.push(bookEntry);
        setupBooks(anonLibrary);
        notifyUser("pass", `New Book '${title}' has been added!`);
    };
});