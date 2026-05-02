let DB = JSON.parse(localStorage.getItem("moneyApp")) || {
  settings:{exchangeRate:76.5},
  accounts:[],
  transactions:[]
};

function saveDB(){
  localStorage.setItem("moneyApp",JSON.stringify(DB));
}

function navigate(id){
  document.querySelectorAll("section").forEach(s=>s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

// ACCOUNTS
function addAccount(){
  DB.accounts.push({
    id:Date.now(),
    name:accName.value,
    currency:accCurrency.value,
    openingBalance:parseFloat(accBalance.value)||0
  });
  saveDB(); render();
}

function getAccountBalance(id){
  let acc=DB.accounts.find(a=>a.id==id);
  let bal=acc?.openingBalance||0;

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

// CATEGORY
function loadCategories(){
  const type=document.getElementById("type").value;
  const select=document.getElementById("category");

  const data={
    income:["Salary","Bonus"],
    expense:["Food","Transport","Rent","Shopping"],
    remittance:["Family","Pakistan"],
    transfer:["Transfer"]
  };

  select.innerHTML="";
  data[type].forEach(c=>{
    let o=document.createElement("option");
    o.value=c; o.text=c;
    select.appendChild(o);
  });
}

// ACCOUNT DROPDOWN
function loadAccountDropdown(){
  const a=document.getElementById("account");
  const b=document.getElementById("toAccount");

  a.innerHTML=""; b.innerHTML="";

  DB.accounts.forEach(acc=>{
    let o=document.createElement("option");
    o.value=acc.id;
    o.text=acc.name;
    a.appendChild(o);
    b.appendChild(o.cloneNode(true));
  });
}

// TRANSFER TOGGLE
function toggleTransfer(){
  let t=document.getElementById("type").value;
  document.getElementById("toAccount").style.display =
    t==="transfer"?"block":"none";
}

// ADD TX
function addTransaction(){
  let type=document.getElementById("type").value;
  let amount=parseFloat(amount.value);
  let from=account.value;
  let to=toAccount.value;

  if(type==="transfer"){
    DB.transactions.push({
      id:Date.now(),
      type:"transfer",
      from,to,
      amountAED:amount,
      amountPKR:amount*DB.settings.exchangeRate,
      date:new Date()
    });
  } else {
    DB.transactions.push({
      id:Date.now(),
      type,
      amount,
      category:category.value,
      accountId:from,
      date:date.value
    });
  }

  saveDB(); render();
}

// INSIGHTS
function insights(){
  let expense=0, food=0;

  DB.transactions.forEach(t=>{
    if(t.type==="expense"){
      expense+=t.amount;
      if(t.category==="Food") food+=t.amount;
    }
  });

  insightBox.innerText =
    food>expense*0.4
    ? "🍔 Too much food spending"
    : "✅ Good balance";
}

// CHARTS
let chart;

function renderCharts(){
  if(chart) chart.destroy();

  let data=Array(12).fill(0);

  DB.transactions.forEach(t=>{
    let m=new Date(t.date||Date.now()).getMonth();
    if(t.amount) data[m]+=t.amount;
  });

  chart=new Chart(monthlyChart,{
    type:"line",
    data:{labels:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
    datasets:[{data:data}]}
  });
}

// RENDER
function render(){
  loadAccountDropdown();
  loadCategories();

  // balance
  let total=0;
  DB.accounts.forEach(a=> total+=getAccountBalance(a.id));
  totalBalance.innerText="AED "+total;

  // recent
  recentList.innerHTML="";
  DB.transactions.slice(-5).reverse().forEach(t=>{
    let li=document.createElement("li");
    li.innerText = t.type==="transfer"
      ? `AED ${t.amountAED} → PKR ${t.amountPKR}`
      : `${t.category} ${t.amount}`;
    recentList.appendChild(li);
  });

  insights();
  renderCharts();
}

// SERVICE WORKER
if("serviceWorker" in navigator){
  navigator.serviceWorker.register("sw.js");
}

render();