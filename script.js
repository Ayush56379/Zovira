const products=[
 {id:1,name:"AirPulse Studio",category:"tech",label:"BESTSELLER",price:3999,old:5499,rating:"4.9",art:"headphones"},
 {id:2,name:"Aero Runner X",category:"fashion",label:"NEW",price:2899,old:3999,rating:"4.8",art:"shoe"},
 {id:3,name:"Luma Desk Lamp",category:"home",label:"TRENDING",price:1499,old:1999,rating:"4.7",art:"lamp"},
 {id:4,name:"Mono Everyday Pack",category:"fashion",label:"LIMITED",price:1799,old:2399,rating:"4.9",art:"bag"},
 {id:5,name:"North Smart Watch",category:"tech",label:"POPULAR",price:3299,old:4499,rating:"4.8",art:"watch"},
 {id:6,name:"Forma Ceramic Set",category:"home",label:"NEW",price:1199,old:1599,rating:"4.6",art:"ceramic"},
 {id:7,name:"Vela Wireless Buds",category:"tech",label:"HOT",price:2199,old:2999,rating:"4.8",art:"buds"},
 {id:8,name:"Aero Overshirt",category:"fashion",label:"EDITORS' PICK",price:2499,old:3299,rating:"4.7",art:"shirt"}
];
const categories=[
 {name:"Electronics",count:"1.8k+ products",icon:"⌁"},
 {name:"Fashion",count:"3.2k+ products",icon:"◈"},
 {name:"Home",count:"2.1k+ products",icon:"⌂"},
 {name:"Beauty",count:"1.4k+ products",icon:"✦"},
 {name:"Sports",count:"900+ products",icon:"◉"},
 {name:"Lifestyle",count:"1.1k+ products",icon:"○"}
];
let cart=JSON.parse(localStorage.getItem("novacart_cart")||"[]");
let wishlist=JSON.parse(localStorage.getItem("novacart_wishlist")||"[]");

const $=s=>document.querySelector(s);
const $$=s=>document.querySelectorAll(s);

function save(){localStorage.setItem("novacart_cart",JSON.stringify(cart));localStorage.setItem("novacart_wishlist",JSON.stringify(wishlist));updateCounts();}
function money(n){return "₹"+n.toLocaleString("en-IN");}
function artStyle(type){
 const map={
  headphones:"background:radial-gradient(circle at 50% 40%,#222 0 22%,#555 23% 45%,#171717 46% 70%,#000 71%);",
  shoe:"background:linear-gradient(145deg,#fff,#d9d9d9);border-radius:60px 20px 40px 25px;transform:rotate(-12deg);",
  lamp:"background:linear-gradient(180deg,#ddd 0 25%,#222 26% 31%,#aaa 32% 100%);border-radius:70px 70px 25px 25px;",
  bag:"background:linear-gradient(145deg,#333,#999);border-radius:20px;",
  watch:"background:linear-gradient(145deg,#111,#777);border-radius:50%;",
  ceramic:"background:linear-gradient(145deg,#fff,#aaa);border-radius:50% 50% 35% 35%;",
  buds:"background:radial-gradient(circle,#fff 0 28%,#222 29% 70%,#777 71%);border-radius:50%;",
  shirt:"background:linear-gradient(145deg,#eee,#555);clip-path:polygon(20% 10%,38% 0,50% 13%,62% 0,80% 10%,100% 35%,80% 50%,75% 100%,25% 100%,20% 50%,0 35%);"
 };
 return map[type]||"background:#ddd";
}
function renderCategories(){
 $("#categoryGrid").innerHTML=categories.map(c=>`<button class="category-card" data-category="${c.name.toLowerCase()}"><span class="category-icon">${c.icon}</span><span><h3>${c.name}</h3><p>${c.count}</p></span></button>`).join("");
 $$("#categoryGrid .category-card").forEach(btn=>btn.addEventListener("click",()=>{toast(btn.dataset.category.replace(/^./,x=>x.toUpperCase())+" category selected");$("#trending").scrollIntoView({behavior:"smooth"});}));
}
function renderProducts(filter="all"){
 const list=filter==="all"?products:products.filter(p=>p.category===filter);
 $("#productGrid").innerHTML=list.map(p=>`
 <article class="product-card">
  <div class="product-image">
   <span class="product-tag">${p.label}</span>
   <button class="product-wish ${wishlist.includes(p.id)?"active":""}" data-wish="${p.id}" aria-label="Wishlist">${wishlist.includes(p.id)?"♥":"♡"}</button>
   <div class="product-art-small" style="${artStyle(p.art)}"></div>
  </div>
  <div class="product-info">
   <span class="category">${p.category}</span>
   <h3>${p.name}</h3>
   <div class="product-price">${money(p.price)} <del>${money(p.old)}</del></div>
   <div class="product-meta"><span class="rating">★ ${p.rating}</span><button class="add-btn" data-add="${p.id}">Add to cart</button></div>
  </div>
 </article>`).join("");
 $$("#productGrid [data-add]").forEach(b=>b.addEventListener("click",()=>addToCart(Number(b.dataset.add))));
 $$("#productGrid [data-wish]").forEach(b=>b.addEventListener("click",()=>toggleWish(Number(b.dataset.wish))));
}
function updateCounts(){ $("#cartCount").textContent=cart.reduce((a,i)=>a+i.qty,0);$("#wishlistCount").textContent=wishlist.length; }
function addToCart(id){
 const p=products.find(x=>x.id===id); if(!p)return;
 const item=cart.find(x=>x.id===id); item?item.qty++:cart.push({id,qty:1});
 save(); toast(`${p.name} added to cart`); renderDrawer("cart");
}
function toggleWish(id){
 wishlist.includes(id)?wishlist=wishlist.filter(x=>x!==id):wishlist.push(id);
 save(); renderProducts(currentFilter); renderDrawer("wishlist"); toast(wishlist.includes(id)?"Added to wishlist":"Removed from wishlist");
}
function renderDrawer(type){
 $("#drawerTitle").textContent=type==="cart"?"Your cart":"Your wishlist";
 $("#drawerBody").innerHTML="";
 if(type==="cart"){
  if(!cart.length) $("#drawerBody").innerHTML=`<div class="empty-state"><strong>Your cart is empty</strong><span>Add something you love from trending products.</span></div>`;
  else $("#drawerBody").innerHTML=cart.map(i=>{const p=products.find(x=>x.id===i.id);return `<div class="cart-item"><div class="cart-thumb" style="${artStyle(p.art)}"></div><div><h4>${p.name}</h4><p>${money(p.price)} × ${i.qty}</p><button class="remove-item" data-remove="${p.id}">Remove</button></div></div>`}).join("");
  const total=cart.reduce((s,i)=>{const p=products.find(x=>x.id===i.id);return s+p.price*i.qty},0);
  $("#drawerFoot").innerHTML=cart.length?`<div style="display:flex;justify-content:space-between;margin-bottom:14px;font-size:13px"><strong>Total</strong><strong>${money(total)}</strong></div><button class="btn btn-dark" style="width:100%" id="checkoutDemo">Proceed to checkout</button>`:"";
  $$("#drawerBody [data-remove]").forEach(b=>b.onclick=()=>{cart=cart.filter(x=>x.id!==Number(b.dataset.remove));save();renderDrawer("cart");});
  $("#checkoutDemo")?.addEventListener("click",()=>openModal("Checkout will be connected to the real order and Cashfree payment flow in the backend phase."));
 }else{
  if(!wishlist.length) $("#drawerBody").innerHTML=`<div class="empty-state"><strong>Your wishlist is empty</strong><span>Tap ♡ on a product to save it.</span></div>`;
  else $("#drawerBody").innerHTML=wishlist.map(id=>{const p=products.find(x=>x.id===id);return `<div class="cart-item"><div class="cart-thumb" style="${artStyle(p.art)}"></div><div><h4>${p.name}</h4><p>${money(p.price)}</p><button class="remove-item" data-remove-wish="${p.id}">Remove</button></div></div>`}).join("");
  $$("#drawerBody [data-remove-wish]").forEach(b=>b.onclick=()=>toggleWish(Number(b.dataset.removeWish)));
 }
}
function openDrawer(type){renderDrawer(type);$("#drawer").classList.add("open");$("#drawerBackdrop").classList.add("show");$("#drawer").setAttribute("aria-hidden","false");}
function closeDrawer(){$("#drawer").classList.remove("open");$("#drawerBackdrop").classList.remove("show");$("#drawer").setAttribute("aria-hidden","true");}
function openModal(html){$("#modalContent").innerHTML=`<h2>NovaCart</h2><p>${html}</p><button class="btn btn-dark" style="margin-top:20px" id="modalOk">Okay</button>`;$("#modal").classList.add("open");$("#modal").setAttribute("aria-hidden","false");$("#modalOk").onclick=closeModal;}
function closeModal(){$("#modal").classList.remove("open");$("#modal").setAttribute("aria-hidden","true");}
function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");clearTimeout(window.__toast);window.__toast=setTimeout(()=>t.classList.remove("show"),2200);}
let currentFilter="all";
renderCategories();renderProducts();updateCounts();

$("#filterPills").addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;currentFilter=b.dataset.filter;$$(".filter-pills button").forEach(x=>x.classList.remove("active"));b.classList.add("active");renderProducts(currentFilter);});
$("#cartBtn").onclick=()=>openDrawer("cart");
$("#wishlistBtn").onclick=()=>openDrawer("wishlist");
$("#drawerClose").onclick=closeDrawer;$("#drawerBackdrop").onclick=closeDrawer;
$("#modalClose").onclick=closeModal;$("#modal").addEventListener("click",e=>{if(e.target===e.currentTarget)closeModal()});
$("#menuBtn").onclick=()=>$("#mobileMenu").classList.toggle("open");
$("#mobileAccount").onclick=()=>openModal("Your account page will be connected to the real authentication system in the authentication phase.");
$("#accountBtn").onclick=()=>openModal("Account, Google Login and customer dashboard will be connected in the authentication phase.");
$("#sellerHeroBtn").onclick=()=>openModal("The Become a Seller flow will be connected in the seller module. Sellers will submit their application for admin verification.");
$("#sellerFooterBtn").onclick=()=>$("#sellerHeroBtn").click();
$("#supportBtn").onclick=()=>openModal("Seller support will be available from the seller dashboard.");
$("#faqBtn").onclick=()=>openModal("FAQ module will be added as a dedicated page in the next frontend module.");
$("#contactBtn").onclick=()=>openModal("Contact support will be connected to the support module.");
$("#allCategoriesBtn").onclick=()=>openModal("All category browsing will be available on the dedicated Categories page.");
$("#offerBtn").onclick=()=>$("#deals").scrollIntoView({behavior:"smooth"});
$("#searchToggle").onclick=()=>{$("#searchPanel").classList.toggle("open");if($("#searchPanel").classList.contains("open"))$("#searchInput").focus()};
$("#clearSearch").onclick=()=>{$("#searchInput").value="";$("#searchSuggestions").classList.remove("show")};
$("#searchInput").addEventListener("input",e=>{const q=e.target.value.trim().toLowerCase();const box=$("#searchSuggestions");if(!q){box.classList.remove("show");return}const hits=products.filter(p=>(p.name+" "+p.category).toLowerCase().includes(q)).slice(0,5);box.innerHTML=(hits.length?hits.map(p=>`<button class="suggestion" data-search-id="${p.id}">${p.name} <small style="color:#888">· ${p.category}</small></button>`).join(""):`<div class="suggestion">No matching product found</div>`);box.classList.add("show");});
$("#searchSuggestions").addEventListener("click",e=>{const b=e.target.closest("[data-search-id]");if(!b)return;const p=products.find(x=>x.id===Number(b.dataset.searchId));currentFilter=p.category;$$(".filter-pills button").forEach(x=>x.classList.toggle("active",x.dataset.filter===currentFilter));renderProducts(currentFilter);$("#trending").scrollIntoView({behavior:"smooth"});$("#searchPanel").classList.remove("open");});
$("#newsletterForm").addEventListener("submit",e=>{e.preventDefault();const email=$("#emailInput").value.trim();if(!email)return;$("#newsletterMessage").textContent="You're on the list ✓";e.target.reset();});
$$(".brand-chip").forEach(b=>b.onclick=()=>{toast(`${b.dataset.brand} collection selected`);$("#trending").scrollIntoView({behavior:"smooth"});});

let remaining=8*3600+24*60+59;
setInterval(()=>{remaining=Math.max(0,remaining-1);const h=Math.floor(remaining/3600),m=Math.floor((remaining%3600)/60),s=remaining%60;$("#hours").textContent=String(h).padStart(2,"0");$("#minutes").textContent=String(m).padStart(2,"0");$("#seconds").textContent=String(s).padStart(2,"0")},1000);

const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add("visible")}),{threshold:.12});
$$(".reveal").forEach(el=>observer.observe(el));
window.addEventListener("load",()=>setTimeout(()=>$("#pageLoader").classList.add("hide"),500));
