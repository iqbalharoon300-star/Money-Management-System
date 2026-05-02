let DB = JSON.parse(localStorage.getItem("moneyApp")) || {
  settings: { exchangeRate: 76.5 },
  accounts: [
    { id: "a1", name: "Cash AED", currency: "AED", balance: 0 }
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

// BALANCE
function getTotalBalance() {
  let total = 0;

  DB.transactions.forEach(t => {
    if (t.type === "income") total += t.amount;
    if (t.type === "expense") total -= t.amount;
  });

  return total;
}

// RENDER
function render() {
  document.getElementById("totalBalance").innerText =
    "AED " + getTotalBalance();

  let list = document.getElementById("recentList");
  list.innerHTML = "";

  DB.transactions.slice(-5).reverse().forEach(t => {
    let li = document.createElement("li");
    li.innerText = `${t.type} - ${t.amount}`;
    list.appendChild(li);
  });
}

// INIT
render();
