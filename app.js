let DB = JSON.parse(localStorage.getItem("moneyApp")) || {
  settings: { exchangeRate: 76.5 },
  accounts: [],
  transactions: [],
  reminders: []
};

function saveDB() {
  localStorage.setItem("moneyApp", JSON.stringify(DB));
}

// 🔐 LOCK
async function unlockApp() {
  document.getElementById("lockScreen").style.display = "none";
}

// NAV
function navigate(id) {
  document.querySelectorAll("section").forEach(s => s.style.display="none");
  document.getElementById(id).style.display="block";
}

// ACCOUNT
function addAccount() {
  DB.accounts.push({
    id: Date.now(),
    name: accName.value,
    currency: accCurrency.value,
    openingBalance: parseFloat(accBalance.value) || 0
  });
  saveDB();
  render();
}

// BALANCE
function getAccountBalance(id) {
  let acc = DB.accounts.find(a=>a.id==id);
  let bal = acc?.openingBalance || 0;

  DB.transactions.forEach(t=>{
    if(t.type==="transfer"){
      if(t.from==id) bal-=t.amountAED;
      if(t.to==id) bal+=t.amountPKR;
    }
    if(t.accountId==id){
      if(t.type==="income") bal+=t.amount;
      if(t.type==="expense") bal-=t.amount;
    }
  });

  return bal;
}

// TRANSACTION
function addTransaction() {
  let type = document.getElementById("type").value;
  let amount = parseFloat(amount.value);
  let from = account.value;
  let to = toAccount.value;

  if(type==="transfer"){
    let pkr = amount * DB.settings.exchangeRate;
    DB.transactions.push({
      id: Date.now(),
      type:"transfer",
      from, to,
      amountAED: amount,
      amountPKR: pkr,
      date: new Date()
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

// RENDER
function render() {

  // accounts
  let c = document.getElementById("accountsScroll");
  c.innerHTML="";
  DB.accounts.forEach(a=>{
    let d=document.createElement("div");
    d.innerHTML=`<h4>${a.name}</h4><p>${getAccountBalance(a.id)}</p>`;
    c.appendChild(d);
  });

  // recent
  let list = document.getElementById("recentList");
  list.innerHTML="";
  DB.transactions.slice(-5).reverse().forEach(t=>{
    let li=document.createElement("li");
    li.innerText = t.type==="transfer"
      ? `AED ${t.amountAED} → PKR ${t.amountPKR}`
      : `${t.type} ${t.amount}`;
    list.appendChild(li);
  });

  // stats
  let income=0, expense=0;
  DB.transactions.forEach(t=>{
    if(t.type==="income") income+=t.amount;
    if(t.type==="expense") expense+=t.amount;
  });
  monthlyStats.innerText=`Income ${income} | Expense ${expense}`;

  // insights
  insightBox.innerText = expense > income
    ? "⚠️ Spending more than income"
    : "✅ Good financial balance";

  // net worth
  let total=0;
  DB.accounts.forEach(a=> total+=getAccountBalance(a.id));
  netWorth.innerText="Net: "+total;

  // charts
  renderCharts();
}

// CHARTS
function renderCharts(){
  let months=Array(12).fill(0);
  DB.transactions.forEach(t=>{
    let m=new Date(t.date).getMonth();
    months[m]+=t.amount||0;
  });

  new Chart(monthlyChart,{
    type:"line",
    data:{labels:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
    datasets:[{data:months}]}
  });
}

render();