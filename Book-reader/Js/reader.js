import { openDB } from 'https://unpkg.com/idb?module';   // tiny promise wrapper

const id = location.hash.slice(1);
const store = JSON.parse(localStorage.books || '{}');
const book = store[id];
if (!book) { alert('Book not found'); history.back(); }

const viewer = document.getElementById('viewer');
const backBtn = document.getElementById('back');
const themeSel = document.getElementById('theme');
const sizeRange = document.getElementById('fontSize');

backBtn.onclick = () => location.href = 'index.html';

// Epub.js
if (book.type === 'application/epub+zip') {
  const bookObj = ePub(book.url);
  const rendition = bookObj.renderTo(viewer, { width:'100%', height:'100%' });
  rendition.display();
  themeSel.onchange = () => rendition.themes.select(themeSel.value);
  sizeRange.oninput = () => rendition.themes.fontSize(sizeRange.value + '%');
  bookObj.locations.generate(1024).then(() => { /* save for progress */ });
}
// PDF.js
else if (book.type === 'application/pdf') {
  pdfjsLib.getDocument(book.url).promise.then(doc => {
    let pageNum = 1;
    function renderPage(n) {
      doc.getPage(n).then(page => {
        const scale = viewer.clientWidth / page.getViewport({scale:1}).width;
        const viewport = page.getViewport({scale});
        const canvas = document.createElement('canvas');
        viewer.replaceChildren(canvas);
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        page.render({canvasContext:canvas.getContext('2d'), viewport});
      });
    }
    renderPage(pageNum);
    viewer.onclick = () => { pageNum = Math.min(pageNum+1, doc.numPages); renderPage(pageNum); };
    viewer.oncontextmenu = (e) => { e.preventDefault(); pageNum = Math.max(pageNum-1,1); renderPage(pageNum); };
  });
}
