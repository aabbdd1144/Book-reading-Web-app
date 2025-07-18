const shelf = document.getElementById('shelf');
const uploader = document.getElementById('uploader');
const addBtn = document.getElementById('addBtn');

addBtn.onclick = () => uploader.click();
uploader.onchange = e => [...e.target.files].forEach(handleFile);

function handleFile(file) {
  const url = URL.createObjectURL(file);
  const id = crypto.randomUUID();
  const cover = `https://via.placeholder.com/120x160?text=${file.name.slice(0,10)}`;
  const bookEl = document.createElement('div');
  bookEl.className = 'book';
  bookEl.innerHTML = `<img src="${cover}" /><small>${file.name}</small>`;
  bookEl.onclick = () => location.href = `reader.html#${id}`;
  shelf.appendChild(bookEl);

  const store = JSON.parse(localStorage.books || '{}');
  store[id] = { name: file.name, url, type: file.type };
  localStorage.books = JSON.stringify(store);
}

// render existing on load
const store = JSON.parse(localStorage.books || '{}');
Object.entries(store).forEach(([id, b]) => {
  const bookEl = document.createElement('div');
  bookEl.className = 'book';
  bookEl.innerHTML = `<img src="https://via.placeholder.com/120x160?text=${b.name.slice(0,10)}" /><small>${b.name}</small>`;
  bookEl.onclick = () => location.href = `reader.html#${id}`;
  shelf.appendChild(bookEl);
});
