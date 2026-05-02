let DB = JSON.parse(localStorage.getItem("moneyApp")) || {
  settings: {
    exchangeRate: 76.5
  },
  accounts: [
    {
      id: "acc1",
      name: "Cash Wallet",
      currency: "AED",
      openingBalance: 0
    }
  ],
  transactions: []
};

// NAVIGATION
function navigate(id) {
  document.querySelectorAll("section").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

// SAVE
function saveDB() {
  localStorage.setItem("moneyApp", JSON.stringify(DB));
}

// ADD ACCOUNT
function addAccount() {
  const acc = {
    id: "acc" + Date.now(),
    name: document.getElementById("accName").value,
    currency: document.getElementById("accCurrency").value,
    openingBalance: parseFloat(document.getElementById("accBalance").value) || 0
  };

  DB.accounts.push(acc);
  saveDB();
  render();
}

// DELETE ACCOUNT
function deleteAccount(id) {
  DB.accounts = DB.accounts.filter(a => a.id !== id);
  DB.transactions = DB.transactions.filter(t => t.accountId !== id);
  saveDB();
  render();
}

// ACCOUNT BALANCE
function getAccountBalance(accountId) {
  const account = DB.accounts.find(a => a.id === accountId);
  let balance = account.openingBalance;

  DB.transactions.forEach(t => {
    if (t.accountId === accountId) {
      if (t.type === "income") balance += t.amount;
      if (t.type === "expense") balance -= t.amount;
      if (t.type === "remittance") balance -= t.amount;
    }
  });

  return balance;
}

// ADD TRANSACTION
function addTransaction() {
  const t = {
    id: Date.now(),
    type: document.getElementById("type").value,
    amount: parseFloat(document.getElementById("amount").value),
    category: document.getElementById("category").value,
    date: document.getElementById("date").value,
    accountId: document.getElementById("account").value
  };

  DB.transactions.push(t);
  saveDB();
  render();
}

// TOTAL BALANCE
function getTotalBalance() {
  let total = 0;

  DB.accounts.forEach(acc => {
    if (acc.currency === "AED") {
      total += getAccountBalance(acc.id);
    }
  });

  return total;
}

// LOAD ACCOUNT DROPDOWN
function loadAccountDropdown() {
  const select = document.getElementById("account");
  select.innerHTML = "";

  DB.accounts.forEach(acc => {
    let option = document.createElement("option");
    option.value = acc.id;
    option.text = acc.name + " (" + acc.currency + ")";
    select.appendChild(option);
  });
}

// RENDER ACCOUNT CARDS
function renderAccountsScroll() {
  const container = document.getElementById("accountsScroll");
  container.innerHTML = "";

  DB.accounts.forEach(acc => {
    const balance = getAccountBalance(acc.id);

    let div = document.createElement("div");
    div.innerHTML = `
      <h4>${acc.name}</h4>
      <p>${acc.currency} ${balance.toFixed(2)}</p>
    `;

    container.appendChild(div);
  });
}

// RENDER ACCOUNTS PAGE
function renderAccountsPage() {
  const container = document.getElementById("accountsList");
  container.innerHTML = "";

  DB.accounts.forEach(acc => {
    const balance = getAccountBalance(acc.id);

    let div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <h3>${acc.name}</h3>
      <p>${acc.currency} ${balance.toFixed(2)}</p>
      <button onclick="deleteAccount('${acc.id}')">Delete</button>
    `;

    container.appendChild(div);
  });
}

// RENDER RECENT
function renderRecent() {
  let list = document.getElementById("recentList");
  list.innerHTML = "";

  DB.transactions.slice(-5).reverse().forEach(t => {
    let li = document.createElement("li");
    li.innerText = `${t.type} - ${t.amount}`;
    list.appendChild(li);
  });
}

// MAIN RENDER
function render() {
  document.getElementById("totalBalance").innerText =
    "AED " + getTotalBalance().toFixed(2);

  loadAccountDropdown();
  renderAccountsScroll();
  renderAccountsPage();
  renderRecent();
}

// INIT
render();