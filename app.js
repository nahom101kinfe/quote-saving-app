let quotes = JSON.parse(localStorage.getItem("quotes") || "[]");

function addQuote() {
  const text = document.getElementById("quoteText").value.trim();
  const author = document.getElementById("quoteAuthor").value.trim();
  const category = document.getElementById("quoteCategory").value.trim();
  const date = new Date().toISOString().split("T")[0];

  if (!text) return alert("Quote text cannot be empty!");

  const quote = { text, author, category, date };
  quotes.push(quote);
  localStorage.setItem("quotes", JSON.stringify(quotes));
  clearInputs();
  renderQuotes();
  updateCategoryFilter();
  showRandomQuote();
}

function clearInputs() {
  document.getElementById("quoteText").value = "";
  document.getElementById("quoteAuthor").value = "";
  document.getElementById("quoteCategory").value = "";
}

function renderQuotes(filtered = quotes) {
  const list = document.getElementById("quoteList");
  list.innerHTML = "";

  filtered.forEach((q, index) => {
    const div = document.createElement("div");
    div.className = "quote-card";
    div.innerHTML = \`
      <p>"\${q.text}"</p>
      <div class="quote-footer">
        <span>— \${q.author || "Unknown"}, \${q.category || "Uncategorized"} (\${q.date})</span>
        <div>
          <button onclick="editQuote(\${index})">✏️ Edit</button>
          <button onclick="deleteQuote(\${index})">🗑️ Delete</button>
        </div>
      </div>
    \`;
    list.appendChild(div);
  });
}

function deleteQuote(index) {
  quotes.splice(index, 1);
  localStorage.setItem("quotes", JSON.stringify(quotes));
  renderQuotes();
  updateCategoryFilter();
  showRandomQuote();
}

function editQuote(index) {
  const q = quotes[index];
  const newText = prompt("Edit quote text:", q.text);
  const newAuthor = prompt("Edit author:", q.author);
  const newCategory = prompt("Edit category:", q.category);
  if (newText !== null) quotes[index].text = newText;
  if (newAuthor !== null) quotes[index].author = newAuthor;
  if (newCategory !== null) quotes[index].category = newCategory;
  localStorage.setItem("quotes", JSON.stringify(quotes));
  renderQuotes();
  updateCategoryFilter();
  showRandomQuote();
}

function searchQuotes() {
  const term = document.getElementById("searchInput").value.toLowerCase();
  const filtered = quotes.filter(q =>
    q.text.toLowerCase().includes(term) ||
    q.author.toLowerCase().includes(term) ||
    q.category.toLowerCase().includes(term)
  );
  renderQuotes(filtered);
}

function updateCategoryFilter() {
  const categories = [...new Set(quotes.map(q => q.category).filter(Boolean))];
  const select = document.getElementById("categoryFilter");
  select.innerHTML = '<option value="">All Categories</option>';
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    select.appendChild(option);
  });
}

function filterByCategory() {
  const selected = document.getElementById("categoryFilter").value;
  const filtered = selected
    ? quotes.filter(q => q.category === selected)
    : quotes;
  renderQuotes(filtered);
}

function showRandomQuote() {
  const q = quotes[Math.floor(Math.random() * quotes.length)];
  if (!q) return;
  document.getElementById("randomQuote").innerHTML = \`
    <p>"\${q.text}"</p>
    <div class="quote-footer">
      <span>— \${q.author || "Unknown"}, \${q.category || "Uncategorized"} (\${q.date})</span>
    </div>
  \`;
}

document.getElementById("toggleTheme").onclick = () => {
  document.body.classList.toggle("light-mode");
  localStorage.setItem("theme", document.body.classList.contains("light-mode") ? "light" : "dark");
};

function applySavedTheme() {
  const theme = localStorage.getItem("theme");
  if (theme === "light") document.body.classList.add("light-mode");
}

applySavedTheme();
updateCategoryFilter();
renderQuotes();
showRandomQuote();