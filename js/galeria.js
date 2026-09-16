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
    /* aria-pressed comunica el estado del filtro a un lector de pantalla:
       sin esto, "activo" es solo un color. */
    boton.setAttribute("aria-pressed", boton.classList.contains("filtro--activo"));

    boton.addEventListener("click", function () {
      filtros.forEach(function (b) {
        b.classList.remove("filtro--activo");
        b.setAttribute("aria-pressed", "false");
      });
      boton.classList.add("filtro--activo");
      boton.setAttribute("aria-pressed", "true");
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

  /* Teclado: Escape cierra, flechas navegan y el Tab queda atrapado dentro */
  document.addEventListener("keydown", function (e) {
    if (visor.hidden) return;

    if (e.key === "Escape")     { cerrar(); return; }
    if (e.key === "ArrowLeft")  { mover(-1); return; }
    if (e.key === "ArrowRight") { mover(1);  return; }
    if (e.key === "Tab")        atraparFoco(e);
  });

  /* El visor es un diálogo modal: el foco no puede escaparse a la página de
     atrás, que está oculta para el mouse pero sigue siendo tabulable. */
  function atraparFoco(e) {
    var focoables = [btnCerrar, btnAnt, btnSig].filter(function (b) {
      return !b.classList.contains("oculto");
    });

    var primero = focoables[0];
    var ultimo  = focoables[focoables.length - 1];

    /* Si el foco se fue fuera del visor, se lo trae de vuelta */
    if (!visor.contains(document.activeElement)) {
      e.preventDefault();
      primero.focus();
      return;
    }

    if (e.shiftKey && document.activeElement === primero) {
      e.preventDefault();
      ultimo.focus();
    } else if (!e.shiftKey && document.activeElement === ultimo) {
      e.preventDefault();
      primero.focus();
    }
  }

});
