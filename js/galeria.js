/* ==========================================================================
   LOS SOPRANO - Galería: filtros por categoría y visor ampliado
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {

  var items     = Array.prototype.slice.call(document.querySelectorAll(".galeria__item"));
  var filtros   = Array.prototype.slice.call(document.querySelectorAll(".filtro"));
  var contador  = document.getElementById("contador");

  var visor     = document.getElementById("visor");
  var imagen    = document.getElementById("visorImagen");
  var titulo    = document.getElementById("visorTitulo");
  var epigrafe  = document.getElementById("visorEpigrafe");
  var credito   = document.getElementById("visorCredito");
  var btnCerrar = document.getElementById("visorCerrar");
  var btnAnt    = document.getElementById("visorAnterior");
  var btnSig    = document.getElementById("visorSiguiente");

  if (!items.length) return;

  var visibles = items.slice();   /* items que pasan el filtro actual */
  var indice   = 0;               /* posición dentro de "visibles" */
  var ultimoFoco = null;

  /* ======================================================================
     1. FILTROS
     ====================================================================== */
  filtros.forEach(function (boton) {
    boton.addEventListener("click", function () {
      filtros.forEach(function (b) { b.classList.remove("filtro--activo"); });
      boton.classList.add("filtro--activo");
      filtrar(boton.dataset.filtro);
    });
  });

  function filtrar(categoria) {
    visibles = [];

    items.forEach(function (item) {
      var coincide = categoria === "todas" || item.dataset.categoria === categoria;
      item.classList.toggle("oculto", !coincide);
      if (coincide) visibles.push(item);
    });

    actualizarContador();
  }

  function actualizarContador() {
    var n = visibles.length;
    contador.textContent = n === 1 ? "1 imagen" : n + " imágenes";
  }

  actualizarContador();

  /* ======================================================================
     2. VISOR AMPLIADO
     ====================================================================== */
  items.forEach(function (item) {
    item.querySelector(".galeria__boton").addEventListener("click", function () {
      abrir(visibles.indexOf(item));
    });
  });

  function abrir(i) {
    if (i < 0) return;
    ultimoFoco = document.activeElement;
    indice = i;
    mostrar();
    visor.hidden = false;
    /* Se fuerza un reflow para que la transición arranque desde opacidad 0 */
    void visor.offsetWidth;
    visor.classList.add("abierto");
    document.body.style.overflow = "hidden";
    btnCerrar.focus();
  }

  function cerrar() {
    visor.classList.remove("abierto");
    document.body.style.overflow = "";
    setTimeout(function () { visor.hidden = true; }, 300);
    if (ultimoFoco) ultimoFoco.focus();
  }

  function mostrar() {
    var boton = visibles[indice].querySelector(".galeria__boton");
    var img   = boton.querySelector("img");

    imagen.src = img.getAttribute("src");
    imagen.alt = img.getAttribute("alt");
    titulo.textContent   = boton.dataset.titulo;
    epigrafe.textContent = boton.dataset.epigrafe;
    credito.textContent  = boton.dataset.credito || "";

    /* Con una sola imagen visible no tiene sentido navegar */
    var unaSola = visibles.length < 2;
    btnAnt.classList.toggle("oculto", unaSola);
    btnSig.classList.toggle("oculto", unaSola);
  }

  function mover(paso) {
    indice = (indice + paso + visibles.length) % visibles.length;
    mostrar();
  }

  btnCerrar.addEventListener("click", cerrar);
  btnAnt.addEventListener("click", function () { mover(-1); });
  btnSig.addEventListener("click", function () { mover(1); });

  /* Clic en el fondo (fuera de la figura) cierra el visor */
  visor.addEventListener("click", function (e) {
    if (e.target === visor) cerrar();
  });

  /* Teclado: Escape cierra, flechas navegan */
  document.addEventListener("keydown", function (e) {
    if (visor.hidden) return;
    if (e.key === "Escape")     cerrar();
    if (e.key === "ArrowLeft")  mover(-1);
    if (e.key === "ArrowRight") mover(1);
  });

});
