let DB = JSON.parse(localStorage.getItem("moneyApp")) || {
  settings: { exchangeRate: 76.5 },
  accounts: [],
  transactions: [],
  reminders: [],
  loans: []
};

function saveDB() {
  localStorage.setItem("moneyApp", JSON.stringify(DB));
}

function navigate(id) {
  document.querySelectorAll("section").forEach(s => s.style.display="none");
  document.getElementById(id).style.display="block";
}

function addAccount() {
  DB.accounts.push({
    id: Date.now(),
    name: accName.value,
    currency: accCurrency.value,
    openingBalance: parseFloat(accBalance.value)
  });
  saveDB();
  render();
}

function getAccountBalance(id) {
  let acc = DB.accounts.find(a=>a.id==id);
  let bal = acc.openingBalance || 0;

  DB.transactions.forEach(t=>{
    if(t.type=="transfer"){
      if(t.from==id) bal-=t.amountAED;
      if(t.to==id) bal+=t.amountPKR;
    }
    if(t.accountId==id){
      if(t.type=="income") bal+=t.amount;
      if(t.type=="expense") bal-=t.amount;
    }
  });

  return bal;
}

function addTransaction() {
  let type = type.value;
  let amount = parseFloat(document.getElementById("amount").value);
  let from = account.value;
  let to = toAccount.value;

  if(type=="transfer"){
    let pkr = amount * DB.settings.exchangeRate;
    DB.transactions.push({
      id: Date.now(),
      type:"transfer",
      from,
      to,
      amountAED: amount,
      amountPKR: pkr
    });
  } else {
    DB.transactions.push({
      id: Date.now(),
      type,
      amount,
      category: category.value,
      accountId: from,
      date: date.value
    });
  }

  saveDB();
  render();
}

function renderAccounts() {
  let c = document.getElementById("accountsScroll");
  c.innerHTML="";
  DB.accounts.forEach(a=>{
    let d=document.createElement("div");
    d.innerHTML=`<h4>${a.name}</h4><p>${getAccountBalance(a.id)}</p>`;
    c.appendChild(d);
  });
}

function renderRecent() {
  let list = recentList;
  list.innerHTML="";
  DB.transactions.slice(-5).reverse().forEach(t=>{
    let li=document.createElement("li");
    li.innerText = t.type=="transfer"
      ? `AED ${t.amountAED} → PKR ${t.amountPKR}`
      : `${t.type} ${t.amount}`;
    list.appendChild(li);
  });
}

function renderStats(){
  let income=0, expense=0;
  DB.transactions.forEach(t=>{
    if(t.type=="income") income+=t.amount;
    if(t.type=="expense") expense+=t.amount;
  });
  monthlyStats.innerText=`Income ${income} | Expense ${expense}`;
}

function insights(){
  let total=0, food=0;
  DB.transactions.forEach(t=>{
    if(t.type=="expense"){
      total+=t.amount;
      if(t.category=="food") food+=t.amount;
    }
  });
  insightBox.innerText = food>total*0.4
    ? "🍔 High food spending"
    : "👍 Spending looks good";
}

function netWorth(){
  let total=0;
  DB.accounts.forEach(a=> total+=getAccountBalance(a.id));
  netWorth.innerText="Net: "+total;
}

function render(){
  renderAccounts();
  renderRecent();
  renderStats();
  insights();
  netWorth();
}

render();