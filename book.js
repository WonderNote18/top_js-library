let myLibrary = [];

function Book(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
    this.info = function() {
        return title + ' by ' + author + ', ' + pages + ' pages, ' + read;
    }
}

function addBookToLibrary() {
    let userData = {};

    userData.title = window.prompt("Enter your book's title: ");
    userData.author = window.prompt("Enter the Author of the book: ");
    userData.pages = window.prompt("Enter the amount of pages in this book: ");
    userData.read = false;
    myLibrary.push(userData);
    render();
    alert(`Your book ${userData.title} by ${userData.author} with ${userData.pages} pages has been added.`);
}

function render() {
    let bookContainer = document.getElementById('bookContainer');
    bookContainer.innerHTML = "";
    myLibrary.forEach(function(book) {
        var bookString = `${book.title} by ${book.author}, ${book.pages} pages.`
        book.read ? bookString += ' Has read.' : bookString += ' Has not read.';
        
        var bookContent = document.createElement("p");
        bookContent.textContent = bookString
        bookContainer.appendChild(bookContent);
    })
}