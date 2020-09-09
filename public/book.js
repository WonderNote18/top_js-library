

let myLibrary = [];

class Book {
    constructor(id, title, author, pages) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.read = false;
    }
    markAsRead() {
        if (this.read == false) {
            this.read = true;
            let readCell = document.getElementById("read" + this.id);
            let readText = readCell.getElementsByTagName("p")[0];
            let readButton = document.getElementById("readBook" + this.id);

            readCell.setAttribute("class", "gridCell gridFont gridReadTrue");
            readText.textContent = "Completed";
            readButton.disabled = true;

            alert(`You have marked ${this.title} by ${this.author} as read!`);
        }
    }
}


function addBookToLibrary() {
    let bookId;
    myLibrary.length == 0 ? bookId = 0 : bookId = myLibrary[myLibrary.length - 1].id + 1;
    let bookTitle = window.prompt("Enter your book's Title");
    if (bookTitle.length > 100 || 
        (bookTitle.split(' ').length <= 2 && 
        (bookTitle.split(' ')[0].length > 30 || 
        bookTitle.split(' ')[0].length > 30 ))) {
        alert("The title entered is too long.");
        return;
    }
    if (bookTitle.length == 0) {
        alert("A book title is required.");
        return;
    }
    let bookAuthor = window.prompt("Enter the Author of the book");
    if (bookTitle.length > 100 || 
        (bookTitle.split(' ').length <= 2 && 
        (bookTitle.split(' ')[0].length > 30 || 
        bookTitle.split(' ')[0].length > 30 ))) {
        alert("The author entered is too long.");
        return;
    }
    if (bookAuthor.length == 0) {
        alert("A book author is required.");
        return;
    }
    let bookPages = parseInt(window.prompt("Enter the amount of pages in this book"));
    if (isNaN(bookPages) == true || bookPages > 100000) {
        alert("An invalid number was entered");
        return
    }

    let newBook = new Book(bookId, bookTitle, bookAuthor, bookPages);
    newBook.prototype = Object.create(Book.prototype);
    // myLibrary.push(newBook);

    addToGrid(newBook.id);
    
    alert(`Your book ${newBook.title} by ${newBook.author} with ${newBook.pages} pages has been added.`);
}

function addToGrid(libraryId) {
    let bookData = myLibrary[libraryId];

    let bookContainer = document.createElement("div");
    bookContainer.setAttribute("class", "gridEntry");
    document.getElementById("bookGrid").appendChild(bookContainer);

    let dataKeys = Object.keys(bookData);
    let spamKeys = ['id', 'prototype', 'read'];
    spamKeys.map(function(key) {
        dataKeys.splice(dataKeys.indexOf(key), 1);
    });

    for (i = 0; i < dataKeys.length; i++) {
        let dataElement = document.createElement("div");
        let dataKey = dataKeys[i];
        dataElement.setAttribute("id", dataKey + libraryId);
        dataElement.setAttribute("class", "gridCell gridFont");
        bookContainer.appendChild(dataElement);

        let dataValue = document.createElement("p");
        dataValue.textContent = bookData[dataKey];
        dataElement.appendChild(dataValue);
    }

    let readElement = document.createElement("div");
    readElement.setAttribute("id", "read" + libraryId);
    readElement.setAttribute("class", "gridCell gridFont gridReadFalse");
    bookContainer.appendChild(readElement);

    let readText = document.createElement("p");
    readText.textContent = "Not Completed";
    readElement.appendChild(readText);
    
    let actionElement = document.createElement("div");
    actionElement.setAttribute("id", "actions" + libraryId);
    actionElement.setAttribute("class", "gridCell gridFont gridActions");
    bookContainer.appendChild(actionElement);

    let actionButton = document.createElement("button");
    actionButton.setAttribute("id", "readBook" + libraryId);
    actionButton.setAttribute("class", "readButton");
    actionButton.setAttribute("onclick", `myLibrary[${libraryId}].markAsRead()`);
    actionButton.textContent = "READ";
    actionElement.appendChild(actionButton);
}