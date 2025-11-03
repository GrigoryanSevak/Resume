document.addEventListener('DOMContentLoaded', function(){
  // Селекторы
  const navToggle = document.getElementById('navToggle');
  const siteNav = document.getElementById('siteNav');
  const header = document.querySelector('header');

  // 1) Smooth scroll для внутренних ссылок (как у тебя был, но компактно)
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', function(e){
      const href = this.getAttribute('href');
      if(href && href.startsWith('#')){
        e.preventDefault();
        const id = href.slice(1);
        const el = document.getElementById(id);
        if(el) el.scrollIntoView({behavior:'smooth', block:'start'});
        if(siteNav && siteNav.classList.contains('open')) siteNav.classList.remove('open');
      }
    });
  });

  // Утилита: подставляем правильный top для мобильной навигации,
  // чтобы меню не вылазило под/за границы header.
  function updateNavTop(){
    if(!siteNav || !header) return;
    const rect = header.getBoundingClientRect();
    // rect.bottom — координата относительно окна; добавляем небольшой отступ
    const topPx = Math.max(8, Math.ceil(rect.bottom + 6));
    // применяем только на узких экранах, иначе возвращаем штатное поведение
    if(window.innerWidth <= 768){
      siteNav.style.position = 'fixed';
      siteNav.style.top = topPx + 'px';
      siteNav.style.left = '8px';
      siteNav.style.right = '8px';
    } else {
      siteNav.style.position = '';
      siteNav.style.top = '';
      siteNav.style.left = '';
      siteNav.style.right = '';
      siteNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  }

  // вызовы и обработчики для корректной работы навигации
  updateNavTop();
  window.addEventListener('resize', updateNavTop);
  window.addEventListener('orientationchange', updateNavTop);
  window.addEventListener('scroll', () => {
    // обновляем только если header меняет положение (для устройств с toolbars)
    updateNavTop();
  });

  if(navToggle && siteNav){
    navToggle.addEventListener('click', (e)=>{
      e.stopPropagation();
      siteNav.classList.toggle('open');
      const expanded = siteNav.classList.contains('open');
      navToggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
      // при открытии — подстраиваем верх меню (на случай, если header изменил размер)
      updateNavTop();
    });

    // закрытие при клике вне меню
    document.addEventListener('click', (e)=>{
      if(window.innerWidth <= 720){
        if(!siteNav.contains(e.target) && !navToggle.contains(e.target)){
          siteNav.classList.remove('open');
          navToggle.setAttribute('aria-expanded', 'false');
        }
      }
    });

    // Escape закрывает меню
    document.addEventListener('keydown', (e)=>{
      if(e.key === 'Escape'){
        siteNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Export/PDF button handling (если у тебя есть кнопка с id="downloadResume")
  const downloadBtn = document.getElementById('downloadResume');
  if(downloadBtn){
    downloadBtn.addEventListener('click', ()=>{
      const opt = {
        margin:       0.4,
        filename:     'Sevak_Grigoryan_Resume.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
      };
      const element = document.querySelector('.wrap');
      if(typeof html2pdf === 'function' || (window.html2pdf)){
        html2pdf().set(opt).from(element).save();
      } else {
        window.print();
      }
    });
  }
});
