/* ==========================================================================
   LOS SOPRANO - Scripts del sitio
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {

  /* ---------- 1. Menú responsive (hamburguesa) ---------- */
  var boton = document.getElementById("menuToggle");
  var menu  = document.getElementById("menu");

  if (boton && menu) {
    boton.addEventListener("click", function () {
      var abierto = menu.classList.toggle("abierto");
      boton.classList.toggle("activo", abierto);
      boton.setAttribute("aria-expanded", abierto);
      boton.setAttribute("aria-label", abierto ? "Cerrar menú" : "Abrir menú");
    });

    /* Cerrar el menú al hacer clic en un enlace */
    menu.querySelectorAll("a").forEach(function (enlace) {
      enlace.addEventListener("click", cerrarMenu);
    });

    /* Cerrar el menú al volver a escritorio */
    window.addEventListener("resize", function () {
      if (window.innerWidth > 768) cerrarMenu();
    });

    /* Cerrar el menú con la tecla Escape y devolver el foco al botón */
    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape" || !menu.classList.contains("abierto")) return;
      cerrarMenu();
      boton.focus();
    });

    /* Cerrar el menú al tocar cualquier otra parte de la página */
    document.addEventListener("click", function (e) {
      if (!menu.classList.contains("abierto")) return;
      if (menu.contains(e.target) || boton.contains(e.target)) return;
      cerrarMenu();
    });
  }

  function cerrarMenu() {
    menu.classList.remove("abierto");
    boton.classList.remove("activo");
    boton.setAttribute("aria-expanded", "false");
    boton.setAttribute("aria-label", "Abrir menú");
  }

  /* ---------- 2. Sombra en la cabecera al hacer scroll ---------- */
  var cabecera = document.getElementById("cabecera");

  if (cabecera) {
    window.addEventListener("scroll", function () {
      cabecera.classList.toggle("cabecera--scroll", window.scrollY > 20);
    });
  }

  /* ---------- 3. Año actual en los legales del pie ---------- */
  var anio = document.getElementById("anio");
  if (anio) anio.textContent = new Date().getFullYear();

  /* ---------- 4. Aviso en los enlaces que abren una pestaña nueva ----------
     El atributo target="_blank" no lo anuncia ningún lector de pantalla. Se
     agrega por script para no repetir el texto en las decenas de créditos. */
  document.querySelectorAll('a[target="_blank"]').forEach(function (enlace) {
    if (enlace.querySelector(".solo-lectores")) return;
    var aviso = document.createElement("span");
    aviso.className = "solo-lectores";
    aviso.textContent = " (se abre en una pestaña nueva)";
    enlace.appendChild(aviso);
  });

});
