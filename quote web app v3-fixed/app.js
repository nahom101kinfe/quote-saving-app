let quotes = JSON.parse(localStorage.getItem("quotes") || "[]");

const quoteInput = document.getElementById("quoteInput");
const authorInput = document.getElementById("authorInput");
const categoryInput = document.getElementById("categoryInput");
const dateInput = document.getElementById("dateInput");
const quoteList = document.getElementById("quoteList");
const categoryFilter = document.getElementById("categoryFilter");
const randomBtn = document.getElementById("randomBtn");
const addBtn = document.getElementById("addBtn");
const toggleTheme = document.getElementById("toggleTheme");

let editingId = null;

addBtn.addEventListener("click", () => {
  const newQuote = {
    text: quoteInput.value,
    author: authorInput.value,
    category: categoryInput.value,
    date: dateInput.value,
    id: Date.now()
  };
  if (!newQuote.text || !newQuote.author) return;
  if (editingId) {
    quotes = quotes.map(q => q.id === editingId ? newQuote : q);
    editingId = null;
  } else {
    quotes.push(newQuote);
  }
  saveAndRender();
  clearInputs();
});

toggleTheme.addEventListener("click", () => {
  document.body.classList.toggle("light");
});

randomBtn.addEventListener("click", () => {
  if (quotes.length === 0) return;
  const random = quotes[Math.floor(Math.random() * quotes.length)];
  alert(`"${random.text}" - ${random.author}`);
});

categoryFilter.addEventListener("change", renderQuotes);

function clearInputs() {
  quoteInput.value = "";
  authorInput.value = "";
  categoryInput.value = "";
  dateInput.value = "";
}

function saveAndRender() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
  renderQuotes();
  populateCategories();
}

function populateCategories() {
  const cats = [...new Set(quotes.map(q => q.category))];
  categoryFilter.innerHTML = '<option value="all">All</option>';
  cats.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c;
    opt.textContent = c;
    categoryFilter.appendChild(opt);
  });
}

function renderQuotes() {
  const filter = categoryFilter.value;
  quoteList.innerHTML = "";
  quotes
    .filter(q => filter === "all" || q.category === filter)
    .forEach(q => {
      const div = document.createElement("div");
      div.className = "quote-card";
      const quoteText = document.createElement("p");
      quoteText.textContent = `"${q.text}"`;
      const quoteMeta = document.createElement("p");
      quoteMeta.innerHTML = `<strong>- ${q.author}</strong> (${q.category}, ${q.date})`;

      const editBtn = document.createElement("button");
      editBtn.textContent = "Edit";
      editBtn.addEventListener("click", () => editQuote(q.id));

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.addEventListener("click", () => deleteQuote(q.id));

      div.appendChild(quoteText);
      div.appendChild(quoteMeta);
      div.appendChild(editBtn);
      div.appendChild(deleteBtn);
      quoteList.appendChild(div);
    });
}

function deleteQuote(id) {
  quotes = quotes.filter(q => q.id !== id);
  saveAndRender();
}

function editQuote(id) {
  const q = quotes.find(q => q.id === id);
  if (!q) return;
  quoteInput.value = q.text;
  authorInput.value = q.author;
  categoryInput.value = q.category;
  dateInput.value = q.date;
  editingId = id;
}

saveAndRender();
