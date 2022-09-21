let books = [];
const RENDER_EVENT = 'render-todo';
const STORAGE_KEY = 'BOOKS_APPS';

document.addEventListener('DOMContentLoaded', function () {
    const formTambah = document.getElementById('form-tambah');
    formTambah.addEventListener('submit', function (event) {
      event.preventDefault();
      addBook();
  
    });
    const searchForm = document.getElementById('search-form');
    
    searchForm.addEventListener('keyup',(e)=>{
        e.preventDefault();
        const searchKey = document.getElementById('search-key').value.toUpperCase();
        const cards = document.getElementsByClassName('card-container');
        
        for (const card of cards) {
          card.classList.remove('hidden');
          const textContent = card.textContent.toUpperCase();
            if (!textContent.includes(searchKey)) {
                card.classList.add('hidden');
            }
        }
      });
      
      if (isStorageExist()) {
        loadDataFromStorage();
    };
  });

const tambahButton = document.getElementById('tambah-button');
const formHidden = document.getElementById('form-hidden');

tambahButton.addEventListener('click', function () {
    formHidden.classList.remove('hidden');
    const closeButton = document.getElementById('close-button');

    closeButton.addEventListener('click', () =>{
        formHidden.classList.add('hidden');
    });
});


function addBook() {
    const id = generateId();
    const judulBuku = document.getElementById('judul-buku').value;
    const penulisBuku = document.getElementById('penulis-buku').value;
    const tahunBuku = document.getElementById('tahun-buku').value;
    const checkBox = document.getElementById('isCompleted');
    const isCompleted = checkStatus(checkBox);
    const book = makeBookObject(id,judulBuku,penulisBuku,tahunBuku,isCompleted)

    books.push(book);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
};

function generateId() {
    return +new Date();
};

function checkStatus(checkBox) {
    if (checkBox.checked) {
        return true;
    } else {
        return false;
    }
};

function makeBookObject(id,judulBuku,penulisBuku,tahunBuku,isCompleted) {
    return {
        id,
        judulBuku,
        penulisBuku,
        tahunBuku,
        isCompleted
    }
};

document.addEventListener(RENDER_EVENT, function () {
  
    const incompleteBookshelfList = document.getElementById('incompleted');
    const completeBookshelfList = document.getElementById('completed');
    incompleteBookshelfList.textContent = '';
    completeBookshelfList.textContent = '';

    books.map((book) => {
        const bookElement = makeBook(book);
        if (book.isCompleted == true){
            completeBookshelfList.appendChild(bookElement);
        }else{
            incompleteBookshelfList.appendChild(bookElement);
        }
    });
  
  });

function makeBook(bookObject) {

    let icon = '';
    if (bookObject.isCompleted === true) {
      icon = '<i class="bi bi-bookmark-dash-fill"></i>'
    } else if(bookObject.isCompleted === false){
      icon = '<i class="bi bi-bookmark-check-fill"></i>'
    }
    
    const archiveButton = document.createElement('button');
    archiveButton.classList.add('px-3', 'py-[1px]', 'rounded-md', 'bg-blue-500','text-slate-100', 'hover:bg-blue-700');
    archiveButton.innerHTML = icon;
    
    const editButton = document.createElement('button');
    editButton.classList.add('px-3', 'py-[1px]', 'rounded-md', 'bg-yellow-500','text-slate-100', 'hover:bg-yellow-700');
    editButton.innerHTML = `<i class="bi bi-pencil-fill" data-id=${bookObject.id}></i>`;
    editButton.setAttribute('data-id',bookObject.id);

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('px-3', 'py-[1px]', 'rounded-md', 'bg-red-500', 'text-slate-100', 'hover:bg-red-700');
    deleteButton.innerHTML = '<i class="bi bi-archive-fill"></i>';
    
    const iconContainer = document.createElement('div');
    iconContainer.classList.add('flex', 'mt-3', 'gap-1');
    iconContainer.append(archiveButton,editButton,deleteButton);
    
    
    const judul = document.createElement('h1');
    judul.classList.add('text-lg', 'font-medium', 'text-slate-600');
    judul.innerHTML = bookObject.judulBuku;
    
    const penulis = document.createElement('p');
    penulis.classList.add('text-sm', 'text-slate-500', 'mt-1');
    penulis.innerHTML = ` Penulis : ${bookObject.penulisBuku}`
    
    const tahun = document.createElement('p');
    tahun.classList.add('text-sm', 'text-slate-500', 'mt-1');
    tahun.innerHTML = ` Tahun Terbit : ${bookObject.tahunBuku}`
    
    const container = document.createElement('div');
    container.classList.add('w-full', 'sm:w-[40%]', 'md:w-1/3', 'lg:w-[30%]', 'shadow-md', 'rounded-md', 'p-5','card-container');
    container.append(judul,penulis,tahun,iconContainer);
    
    archiveButton.addEventListener('click', function () {
        addTaskToCompleted(bookObject.id);
      });
    
    deleteButton.addEventListener('click', function () {
      swal({
        title: "Apakah Kamu Yakin?",
        text: "Setelah Menghapus ini Kamu tidak Bisa Mengembalikanya!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) {
          removeTaskFromCompleted(bookObject.id);
          swal("Buku Telah Dihapus", {
            icon: "success",
          });
        }
      });
    });
    
    editButton.addEventListener('click',()=>{
      books.map((book)=>{
        if (book.id === bookObject.id) {
            showModal(book);
        }
      });
    });
    
    
    return container; 
  }

function showModal(bookTarget) {
    const modal = document.getElementById('edit-section');
    const form = document.getElementById('form-edit');
    const judul = document.getElementById('edit-judul');
    const penulis = document.getElementById('edit-penulis');
    const tahun = document.getElementById('edit-tahun');
    const isCompleted = document.getElementById('editIsCompleted');
    
    judul.value = bookTarget.judulBuku;
    penulis.value = bookTarget.penulisBuku;
    tahun.value = bookTarget.tahunBuku;
    if (bookTarget.isCompleted === true) {
      isCompleted.checked = true;  
    }else{
      isCompleted.checked = false;  
    }
    
    modal.classList.remove('hidden');

    const closeButton = document.getElementById('edit-close-button');
    closeButton.addEventListener('click',()=>{
        modal.classList.add('hidden');
      });
      
      form.addEventListener('submit',()=>{
        bookTarget.judulBuku = judul.value;
        bookTarget.penulisBuku = penulis.value;
        bookTarget.tahunBuku = tahun.value;
        bookTarget.isCompleted = isCompleted.checked;
        modal.classList.add('hidden');
        saveData();
        document.dispatchEvent(new Event(RENDER_EVENT));
      });
  }

function addTaskToCompleted (bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;
   
    if (bookTarget.isCompleted === true) {
      bookTarget.isCompleted = false;
    }else{
      bookTarget.isCompleted = true;
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
    swal({
        title: "Berhasil!",
        text: "Buku Telah Dipindahkan",
        icon: "success",
        button: "Ok",
      });
    return null;
  };

function findBook(bookId) {
    for (const bookItem of books) {
      if (bookItem.id == bookId) {
        return bookItem;
      }
    };
        
  };
  
function removeTaskFromCompleted(bookId) {
    const bookTarget = findBookIndex(bookId);
   
    if (bookTarget === -1) return;
   
    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  };

    function findBookIndex(bookId) {
        for (const index in books) {
            if (books[index].id === bookId) {
                return index;
            }   
        }
};

function isStorageExist() /* boolean */ {
    if (typeof (Storage) === undefined) {
      alert('Browser kamu tidak mendukung local storage');
      return false;
    }
    return true;
  };
  
function saveData() {
    if (isStorageExist()) {
      const parsed = JSON.stringify(books);
      localStorage.setItem(STORAGE_KEY, parsed);
    }
};

const loadDataFromStorage = () => {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    const data = JSON.parse(serializedData);
    
    if(data !== null)
      books = data;
    
    document.dispatchEvent(new Event(RENDER_EVENT));
};

