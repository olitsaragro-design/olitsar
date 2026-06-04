<!DOCTYPE html>
<html lang="uk">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>ОЛІТСАР АГРО ГРУП | Закупівля зерна в Україні</title>
<meta name="description" content="ТОВ «ОЛІТСАР АГРО ГРУП» — надійний зернотрейдер України. Закупівля пшениці, кукурудзи, ячменю, соняшнику, сої та ріпаку.">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
<style>
:root{--green:#0F3D2E;--gold:#D4A017}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Inter',sans-serif;color:#0A1C13;background:#fff}

nav{background:rgba(15,61,46,0.97);backdrop-filter:blur(12px);position:fixed;top:0;width:100%;z-index:1000;border-bottom:1px solid rgba(212,160,23,0.2)}
.nav-inner{max-width:1280px;margin:0 auto;padding:0 2rem;height:88px;display:flex;align-items:center;justify-content:space-between}
.logo{display:flex;align-items:center;gap:14px;color:white;text-decoration:none}
.logo img{height:62px;width:auto}
.logo-text{font-family:'Cormorant Garamond',serif;font-size:1.7rem;font-weight:700;letter-spacing:0.5px}

/* Hero */
#hero{min-height:100vh;background:linear-gradient(rgba(15,61,46,0.72),rgba(15,61,46,0.78)),url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2070') center/cover no-repeat;display:flex;align-items:center;color:white;position:relative}

/* Products */
.prod-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(340px,1fr));gap:2rem;margin-top:3rem}
.pc{border-radius:16px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.1);transition:all .4s;background:white}
.pc:hover{transform:translateY(-12px);box-shadow:0 25px 50px rgba(15,61,46,0.15)}
.pc-img{height:280px;background-size:cover;background-position:center;position:relative}
.pc-img::after{content:'';position:absolute;inset:0;background:linear-gradient(to top,rgba(15,61,46,0.65),transparent)}
.pc-body{padding:1.8rem}
.pc-body h3{font-size:1.85rem;margin-bottom:0.6rem;color:var(--green)}
.btn-buy{width:100%;padding:14px;background:var(--green);color:white;border:none;border-radius:12px;font-weight:600;cursor:pointer;transition:all .2s}
.btn-buy:hover{background:#1A5C44}
</style>
</head>
<body>

<!-- NAV -->
<nav>
  <div class="nav-inner">
    <a href="#" class="logo">
      <img src="https://i.ibb.co/KXXxY7Z/olitsar-logo.png" alt="ОЛІТСАР АГРО ГРУП">   <!-- Твій логотип -->
    </a>
    <div style="display:flex;gap:2.8rem;color:white;font-weight:500;font-size:1.02rem">
      <a href="#products">Продукція</a>
      <a href="#services">Послуги</a>
      <a href="#contact">Контакти</a>
    </div>
    <a href="#contact" style="background:#D4A017;color:#0F3D2E;padding:14px 34px;border-radius:50px;font-weight:600">Отримати ціну</a>
  </div>
</nav>

<!-- HERO -->
<section id="hero">
  <div style="max-width:1100px;margin:0 auto;padding:0 2rem;text-align:center">
    <h1 style="font-size:4.8rem;line-height:1.05;margin-bottom:1.3rem">Надійний партнер<br>на ринку зернових</h1>
    <p style="font-size:1.4rem;max-width:720px;margin:0 auto 2.8rem">Закуповуємо великі партії пшениці, кукурудзи, ячменю, соняшнику, сої та ріпаку безпосередньо у виробників України</p>
    <a href="#contact" style="background:#D4A017;color:#0F3D2E;padding:18px 52px;border-radius:50px;font-size:1.2rem;font-weight:600;display:inline-block">Запропонувати партію</a>
  </div>
</section>

<!-- PRODUCTS -->
<section id="products" style="padding:7rem 0;background:#F8F8F6">
  <div style="max-width:1280px;margin:0 auto;padding:0 2rem">
    <h2 style="text-align:center;font-size:3.1rem;color:var(--green);margin-bottom:3.5rem">Що ми закуповуємо</h2>
    
    <div class="prod-grid">

      <!-- Пшениця -->
      <div class="pc">
        <div class="pc-img" style="background-image:url('https://images.unsplash.com/photo-1600585154340-be6161a56a9c?q=80&w=2070')"></div>
        <div class="pc-body">
          <h3>Пшениця</h3>
          <p>2, 3 та 4 клас. Продовольча та фуражна.</p>
          <button onclick="openModal('Пшениця')" class="btn-buy">Запропонувати партію</button>
        </div>
      </div>

      <!-- Кукурудза -->
      <div class="pc">
        <div class="pc-img" style="background-image:url('https://images.unsplash.com/photo-1551754655-cd27e38d2076?q=80&w=2070')"></div>
        <div class="pc-body">
          <h3>Кукурудза</h3>
          <p>3 клас. Висока якість, великі обсяги.</p>
          <button onclick="openModal('Кукурудза')" class="btn-buy">Запропонувати партію</button>
        </div>
      </div>

      <!-- Ячмінь -->
      <div class="pc">
        <div class="pc-img" style="background-image:url('https://images.unsplash.com/photo-1574323347407-f5e1e2c1e5f8?q=80&w=2070')"></div>
        <div class="pc-body">
          <h3>Ячмінь</h3>
          <p>3 клас. Кормовий та технічний.</p>
          <button onclick="openModal('Ячмінь')" class="btn-buy">Запропонувати партію</button>
        </div>
      </div>

      <!-- Соняшник -->
      <div class="pc">
        <div class="pc-img" style="background-image:url('https://images.unsplash.com/photo-1597848212624-a19eb35e2651?q=80&w=2070')"></div>
        <div class="pc-body">
          <h3>Насіння соняшнику</h3>
          <p>Олійний соняшник з високою олійністю.</p>
          <button onclick="openModal('Соняшник')" class="btn-buy">Запропонувати партію</button>
        </div>
      </div>

      <!-- Соя -->
      <div class="pc">
        <div class="pc-img" style="background-image:url('https://images.unsplash.com/photo-1599280948090-d2ec8a5e6f6d?q=80&w=2070')"></div>
        <div class="pc-body">
          <h3>Соя</h3>
          <p>Соєві боби високої якості.</p>
          <button onclick="openModal('Соя')" class="btn-buy">Запропонувати партію</button>
        </div>
      </div>

      <!-- Ріпак -->
      <div class="pc">
        <div class="pc-img" style="background-image:url('https://images.unsplash.com/photo-1622389775051-5c8e5e8f8e8e?q=80&w=2070')"></div>
        <div class="pc-body">
          <h3>Насіння ріпаку</h3>
          <p>Низькоеруковий ріпак (Тип 00).</p>
          <button onclick="openModal('Ріпак')" class="btn-buy">Запропонувати партію</button>
        </div>
      </div>

    </div>
  </div>
</section>

<!-- MODAL -->
<div id="modal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.65);align-items:center;justify-content:center;z-index:2000">
  <div style="background:white;padding:2.8rem;max-width:460px;width:100%;border-radius:16px">
    <button onclick="closeModal()" style="float:right;font-size:1.8rem;background:none;border:none;cursor:pointer">×</button>
    <h3 id="modalTitle" style="margin:1.2rem 0 1.8rem;font-size:1.75rem;color:var(--green)">Запропонувати партію</h3>
    <button onclick="handleSubmit(this)" style="width:100%;padding:16px;background:#0F3D2E;color:white;border:none;border-radius:12px;font-weight:600">Надіслати заявку</button>
  </div>
</div>

<script>
function openModal(crop){
  document.getElementById('modalTitle').textContent = `Запропонувати ${crop}`;
  document.getElementById('modal').style.display = 'flex';
}
function closeModal(){
  document.getElementById('modal').style.display = 'none';
}
function handleSubmit(btn){
  btn.textContent = '✓ Заявка надіслана!';
  setTimeout(()=>{closeModal();btn.textContent='Надіслати заявку';},2200);
}
</script>
</body>
</html>
