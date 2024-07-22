// Define default books with a `default` property
const defaultBooks = [
  new Book("To Kill a Mockingbird", "Harper Lee", 281, false, true),
  new Book("1984", "George Orwell", 328, false, true),
  new Book("The Great Gatsby", "F. Scott Fitzgerald", 180, false, true),
];

// Initialize myLibrary with data from localStorage or use defaultBooks
const myLibrary = JSON.parse(localStorage.getItem("library")) || defaultBooks;

// Book constructor with an optional `default` property
function Book(title, author, pages, read, isDefault = false) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
  this.isDefault = isDefault; // Indicates if the book is a default book
}

// Function to add a book to the library
function addBookToLibrary(book) {
  myLibrary.push(book);
  saveLibrary();
  displayBooks();
}

// Function to save the library to localStorage
function saveLibrary() {
  localStorage.setItem("library", JSON.stringify(myLibrary));
}

// Function to display the books in the library
function displayBooks() {
  const library = document.getElementById("library");
  library.innerHTML =
    '<button id="new-book-btn"><i class="mdi mdi-plus"></i></button>';

  myLibrary.forEach((book, index) => {
    const bookCard = document.createElement("div");
    bookCard.classList.add("book-card");
    bookCard.dataset.index = index;

    bookCard.innerHTML = `
      <div class='book-design'>
        ${
          book.read
            ? '<div class="markRead"><span class="mdi mdi-read"></span></div>'
            : ""
        }
        <div>
          <h1>${book.title}</h1>
          <i>by</i>
          <h3>${book.author}</h3>
        </div>
        <b>${book.pages} PG</b>
        <div>
          ${
            !book.isDefault
              ? '<button class="remove-btn"><span class="mdi mdi-delete"></span></button>'
              : ""
          }
          <button class="toggle-read-btn">${
            book.read
              ? '<span class="mdi mdi-check"></span>'
              : '<span class="mdi mdi-book-remove"></span>'
          }</button>
        </div>
      </div>
    `;

    library.appendChild(bookCard);
  });

  document.getElementById("new-book-btn").addEventListener("click", () => {
    formContainer.classList.toggle("hidden");
  });
}

// Function to remove a book from the library
function removeBook(e) {
  const index = e.target.closest(".book-card").dataset.index;
  const book = myLibrary[index];

  if (!book.isDefault) {
    // Only remove non-default books
    myLibrary.splice(index, 1);
    saveLibrary();
    displayBooks();
  }
}

// Function to toggle the read status of a book
function toggleReadStatus(e) {
  const index = e.target.closest(".book-card").dataset.index;
  myLibrary[index].read = !myLibrary[index].read;
  saveLibrary();
  displayBooks();
}

// Event listener for the book form
const formContainer = document.getElementById("form-container");
const bookForm = document.getElementById("book-form");

// Allow only numeric input for the pages field
document.getElementById("pages").addEventListener("input", function (e) {
  this.value = this.value.replace(/[^0-9]/g, "");
});

// Handle form submission
bookForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const pages = document.getElementById("pages").value;
  const read = document.getElementById("read").checked;

  const newBook = new Book(title, author, pages, read);
  addBookToLibrary(newBook);

  bookForm.reset();
  formContainer.classList.add("hidden");
});

// Toggle form visibility
const handleRemoveBookForm = () => {
  formContainer.classList.toggle("hidden");
};

// Display books when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  displayBooks();

  document.getElementById("library").addEventListener("click", (e) => {
    if (e.target.closest(".remove-btn")) {
      removeBook(e);
    } else if (e.target.closest(".toggle-read-btn")) {
      toggleReadStatus(e);
    }
  });
});
