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
    myLibrary.length == 0 ? bookId = 0 : bookId = myLibrary.length;
    let bookTitle = window.prompt("Enter your book's Title");
    let bookAuthor = window.prompt("Enter the Author of the book");
    let bookPages = window.prompt("Enter the amount of pages in this book");

    let newBook = new Book(bookId, bookTitle, bookAuthor, bookPages);
    newBook.prototype = Object.create(Book.prototype);
    newBook.addToLibrary();
    myLibrary.push(newBook);

    addToGrid(newBook.id);
    
    alert(`Your book ${newBook.title} by ${newBook.author} with ${newBook.pages} pages has been added.`);
}

function addToGrid(libraryId) {
    let bookContainer = document.createElement("div");
    let bookData = myLibrary[libraryId];
    bookContainer.setAttribute("id", "bookContainer" + libraryId);
    bookContainer.setAttribute("class", "gridEntry");
    document.getElementById("bookGrid").appendChild(bookContainer);

    let dataKeys = Object.keys(bookData);
    dataKeys.splice(dataKeys.indexOf('id'), 1);
    dataKeys.splice(dataKeys.indexOf('prototype'), 1);
    dataKeys.splice(dataKeys.indexOf('read'), 1);

    for (i = 0; i < dataKeys.length; i++) {
        let dataElement = document.createElement("p");
        let dataKey = dataKeys[i];
        dataElement.setAttribute("id", dataKey + libraryId);
        dataElement.setAttribute("class", "gridFont");
        dataElement.textContent = bookData[dataKey];
        bookContainer.appendChild(dataElement);
    }

    let readElement = document.createElement("p");
    readElement.setAttribute("id", "read" + libraryId);
    readElement.setAttribute("class", "gridFont gridReadFalse");
    readElement.textContent = "Not Completed";
    bookContainer.appendChild(readElement);
    
    let actionElement = document.createElement("div");
    actionElement.setAttribute("id", "actions" + libraryId);
    actionElement.setAttribute("class", "gridFont gridActions");
    actionElement.textContent = "TEMP";
    bookContainer.appendChild(actionElement);
}