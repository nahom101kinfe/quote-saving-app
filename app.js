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
        <button onclick="deleteQuote(\${index})">🗑️</button>
      </div>
    \`;
    list.appendChild(div);
  });
}

function deleteQuote(index) {
  quotes.splice(index, 1);
  localStorage.setItem("quotes", JSON.stringify(quotes));
  renderQuotes();
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

renderQuotes();