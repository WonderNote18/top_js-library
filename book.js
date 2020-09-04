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
        this.read = true;
        document.getElementById("read" + id).setAttribute("class", "gridFont gridReadTrue");
        document.getElementById("read" + id).textContent = "Completed";
    }
}


function addBookToLibrary() {
    let bookId;
    myLibrary.length == 0 ? bookId = 0 : bookId = myLibrary[myLibrary.length - 1].id + 1;
    let bookTitle = window.prompt("Enter your book's Title");
    let bookAuthor = window.prompt("Enter the Author of the book");
    let bookPages = window.prompt("Enter the amount of pages in this book");

    let newBook = new Book(bookId, bookTitle, bookAuthor, bookPages);
    newBook.prototype = Object.create(Book.prototype);
    myLibrary.push(newBook);

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

    let actionText = document.createElement("p");
    actionText.textContent = "TEMP";
    actionElement.appendChild(actionText);
}