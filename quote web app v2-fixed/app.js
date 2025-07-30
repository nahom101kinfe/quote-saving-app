let quotes = JSON.parse(localStorage.getItem("quotes") || "[]");

const quoteInput = document.getElementById("quoteInput");
const authorInput = document.getElementById("authorInput");
const categoryInput = document.getElementById("categoryInput");
const dateInput = document.getElementById("dateInput");
const quoteList = document.getElementById("quoteList");
const categoryFilter = document.getElementById("categoryFilter");
const randomBtn = document.getElementById("randomBtn");

document.getElementById("addBtn").onclick = () => {
    const newQuote = {
        text: quoteInput.value,
        author: authorInput.value,
        category: categoryInput.value,
        date: dateInput.value,
        id: Date.now()
    };
    if (editingId) {
        quotes = quotes.map(q => q.id === editingId ? newQuote : q);
        editingId = null;
    } else {
        quotes.push(newQuote);
    }
    saveAndRender();
    clearInputs();
};

document.getElementById("toggleTheme").onclick = () => {
    document.body.classList.toggle("light");
};

randomBtn.onclick = () => {
    if (quotes.length === 0) return;
    const random = quotes[Math.floor(Math.random() * quotes.length)];
    alert(`"${random.text}" - ${random.author}`);
};

categoryFilter.onchange = renderQuotes;

let editingId = null;

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
            div.innerHTML = `
                <p>"${q.text}"</p>
                <p><strong>- ${q.author}</strong> (${q.category}, ${q.date})</p>
                <button onclick="editQuote(${q.id})">Edit</button>
                <button onclick="deleteQuote(${q.id})">Delete</button>
            `;
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