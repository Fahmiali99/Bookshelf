const dontRead = "unRead";
const finishedRead = "doneRead";
const Uniq_Book = "itemId";
const bookStorage = "unit_book";

let books = [];

function addBuku() {
  const unReadBook = document.getElementById(dontRead);
  const doneReadBook = document.getElementById(finishedRead);

  const inputBookjudul = document.getElementById("judulBuku").value;
  const inputBookWriter = document.getElementById("penulisBuku").value;
  const inputBookDate = document.getElementById("tanggalBuku").value;
  const checkBook = document.getElementById("checkBuku");

  if (checkBook.checked === true) {
    const buku = createBookList(
      inputBookjudul,
      inputBookWriter,
      inputBookDate,
      true
    );

    const bookSubject = ComponentSubject(
      inputBookjudul,
      inputBookWriter,
      inputBookDate,
      true
    );

    buku[Uniq_Book] = bookSubject.id;
    books.push(bookSubject);

    doneReadBook.append(buku);
    updateBookData();
  } else {
    const buku = createBookList(
      inputBookjudul,
      inputBookWriter,
      inputBookDate,
      false
    );

    const bookSubject = ComponentSubject(
      inputBookjudul,
      inputBookWriter,
      inputBookDate,
      false
    );

    buku[Uniq_Book] = bookSubject.id;
    books.push(bookSubject);

    unReadBook.append(buku);
    updateBookData();
  }
}

function createBookList(judul, penulis, tanggal, iSuccess) {
  const setjudul = document.createElement("h3");
  const setBookWriter = document.createElement("h5");
  const setBookDate = document.createElement("p");
  const setDetailContainer = document.createElement("div");
  const setContainer = document.createElement("div");

  setjudul.innerText = judul;
  setBookWriter.innerText = penulis;
  setBookDate.innerText = tanggal;

  setDetailContainer.classList.add("unit_book");
  setDetailContainer.append(setjudul, setBookWriter, setBookDate);

  setContainer.classList.add("book_shelf", "shadow");
  setContainer.append(setDetailContainer);

  if (iSuccess) {
    setContainer.append(setCanselButton(), setRemoveButton());
  } else {
    setContainer.append(setTesting(), setRemoveButton());
  }
  return setContainer;
}

function createButton(buttonParent, text, eventListener) {
  const button = document.createElement("button");
  button.classList.add(buttonParent);
  button.innerText = text;
  button.addEventListener("click", function (e) {
    eventListener(e);
  });
  return button;
}

function setTesting() {
  return createButton("green", "Selesai dibaca", function (e) {
    dataSuccess(e.target.parentElement);
  });
}

function dataSuccess(e) {
  const compSuccess = document.getElementById(finishedRead);
  const compTitle = e.querySelector(".unit_book > h3").innerText;
  const compWriter = e.querySelector(".unit_book > h5").innerText;
  const compDate = e.querySelector(".unit_book > p").innerText;

  const newBook = createBookList(compTitle, compWriter, compDate, true);

  const book = findBook(e[Uniq_Book]);
  book.iSuccess = true;
  newBook[Uniq_Book] = book.id;

  compSuccess.append(newBook);
  e.remove();

  updateBookData();
}

function removeTaskFromCompleted(e) {
  const bookPosition = findBookId(e[Uniq_Book]);
  books.splice(bookPosition, 1);

  e.remove();
  updateBookData();
}

function setRemoveButton() {
  return createButton("red", "Hapus buku", function (event) {
    removeTaskFromCompleted(event.target.parentElement);
  });
}

function undoTaskFromCompleted(e) {
  const listUncompleted = document.getElementById(dontRead);
  const compTitle = e.querySelector(".unit_book > h3").innerText;
  const compWriter = e.querySelector(".unit_book > h5").innerText;
  const compDate = e.querySelector(".unit_book > p").innerText;

  const newBook = createBookList(compTitle, compWriter, compDate, false);

  const book = findBook(e[Uniq_Book]);
  book.iSuccess = false;
  newBook[Uniq_Book] = book.id;

  listUncompleted.append(newBook);
  e.remove();

  updateBookData();
}

function setCanselButton() {
  return createButton("yellow", "Belum Selesai ", function (e) {
    undoTaskFromCompleted(e.target.parentElement);
  });
}

function dontSaveData() {
  if (typeof Storage === undefined) {
    alert("Browsers don't match");
    return false;
  }
  return true;
}

function saveData() {
  const unit = JSON.stringify(books);
  localStorage.setItem(bookStorage, unit);
  document.dispatchEvent(new Event("DataSuccessfully"));
}

function LoadofStorage() {
  const bookData = localStorage.getItem(bookStorage);

  let isBooks = JSON.parse(bookData);

  if (isBooks !== null) books = isBooks;

  document.dispatchEvent(new Event("LoadData"));
}

function updateBookData() {
  if (dontSaveData()) saveData();
}

function ComponentSubject(judul, penulis, tanggal, iSuccess) {
  return {
    id: +new Date(),
    judul,
    penulis,
    tanggal,
    iSuccess,
  };
}

function findBook(e) {
  for (book of books) {
    if (book.id === e) return book;
  }
  return null;
}

function findBookId(e) {
  let i = 0;
  for (book of books) {
    if (book.id === e) return i;
    i++;
  }
  return -1;
}

function refreshDataFrombooks() {
  const dontSaveBook = document.getElementById(dontRead);
  let compSuccess = document.getElementById(finishedRead);

  for (book of books) {
    const newBook = createBookList(
      book.judul,
      book.penulis,
      book.tanggal,
      book.iSuccess
    );
    newBook[Uniq_Book] = book.id;

    if (book.iSuccess) {
      compSuccess.append(newBook);
    } else {
      dontSaveBook.append(newBook);
    }
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("inputForm");

  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBuku();
  });

  if (dontSaveData()) {
    LoadofStorage();
  }
});

document.addEventListener("DataSuccessfully", () => {
  console.log("Book data saved successfully");
});
document.addEventListener("LoadData", () => {
  console.log("Load Data of Book");
  refreshDataFrombooks();
});
