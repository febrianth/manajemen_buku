let books = [];

function addBook() {
  const title = document.getElementById("bookTitle").value;

  if (isTitleExists(title)) {
    Swal.fire('Judul buku sudah ada. Harap pilih judul yang berbeda');
    return;
  }

  const author = document.getElementById("bookAuthor").value;
  const year = parseInt(document.getElementById("bookYear").value);
  const isComplete = document.getElementById("isComplete").checked;

  if (!title || !author || !year) {
    alert("Harap isi semua field!");
    return;
  }

  const book = {
    id: +new Date(),
    title,
    author,
    year,
    isComplete,
  };

  books.push(book);
  localStorage.setItem("books", JSON.stringify(books));
  updateBookshelves();
}

function isTitleExists(title) {
  return books.some((book) => book.title === title);
}

function moveBook(id, targetShelf) {
  const books = JSON.parse(localStorage.getItem("books")) || [];
  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    books[index].isComplete = targetShelf === "finished";
    localStorage.setItem("books", JSON.stringify(books));
    updateBookshelves();
  }
}

function deleteBook(id) {
  const books = JSON.parse(localStorage.getItem("books")) || [];
  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    books.splice(index, 1);
    localStorage.setItem("books", JSON.stringify(books));
    updateBookshelves();
  }
}

function editBook(id) {
  const books = JSON.parse(localStorage.getItem("books")) || [];
  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    const book = books[index];
    const newTitle = prompt("Edit judul buku:", book.title);
    const newAuthor = prompt("Edit penulis buku:", book.author);
    const newYear = parseInt(prompt("Edit tahun terbit buku:", book.year));

    if (newTitle && newAuthor && newYear) {
      book.title = newTitle;
      book.author = newAuthor;
      book.year = newYear;

      localStorage.setItem("books", JSON.stringify(books));
      updateBookshelves();
    }
  }
}

function updateBookshelves() {
  const unfinishedBooks = document.getElementById("unfinishedBooks");
  const finishedBooks = document.getElementById("finishedBooks");
  const searchTitle = document
    .getElementById("searchTitle")
    .value.toLowerCase();

  unfinishedBooks.innerHTML = "";
  finishedBooks.innerHTML = "";

  books = JSON.parse(localStorage.getItem("books")) || [];

  books = books;

  books.forEach((book) => {
    if (searchTitle && !book.title.toLowerCase().includes(searchTitle)) {
      return;
    }

    const li = document.createElement("li");
    const buttonMove = document.createElement("button");
    const buttonDelete = document.createElement("button");
    const buttonEdit = document.createElement("button");

    buttonMove.textContent = book.isComplete
      ? "Pindah ke Belum selesai dibaca"
      : "Pindah ke Selesai dibaca";
    buttonMove.onclick = () =>
      moveBook(book.id, book.isComplete ? "unfinished" : "finished");

    buttonDelete.textContent = "Hapus";
    buttonDelete.onclick = () => showDeleteConfirmationDialog(book.id);

    buttonEdit.textContent = "Edit";
    buttonEdit.onclick = () => editBook(book.id);

    li.textContent = `${book.title} - ${book.author} (${book.year})`;
    li.appendChild(buttonMove);
    li.appendChild(buttonDelete);
    li.appendChild(buttonEdit);

    if (book.isComplete) {
      finishedBooks.appendChild(li);
    } else {
      unfinishedBooks.appendChild(li);
    }
  });
}

function searchBooks() {
  updateBookshelves();
}

function showDeleteConfirmationDialog(id) {
  const confirmation = confirm("Apakah Anda yakin ingin menghapus buku ini?");
  if (confirmation) {
    deleteBook(id);
  }
}

function toggleDarkMode() {
  const body = document.body;
  body.classList.toggle("dark-mode");
}
updateBookshelves();
