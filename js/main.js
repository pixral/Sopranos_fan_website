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

    /* Cerrar el menú con la tecla Escape */
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") cerrarMenu();
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

});
