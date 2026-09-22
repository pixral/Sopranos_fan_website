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
  var estado    = document.getElementById("visorEstado");

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
      filtrar(boton.dataset.filtro, boton.textContent.trim());
    });
  });

  function filtrar(categoria, etiqueta) {
    visibles = [];

    items.forEach(function (item) {
      var coincide = categoria === "todas" || item.dataset.categoria === categoria;
      item.classList.toggle("oculto", !coincide);
      if (coincide) visibles.push(item);
    });

    actualizarContador(etiqueta);
  }

  /* El contador es la única señal de que el filtro hizo algo: quien no ve la
     grilla necesita que se anuncie la categoría además del número. Un "12"
     suelto no dice nada. */
  function actualizarContador(etiqueta) {
    var n = visibles.length;
    var cuantas = n === 1 ? "1 imagen" : n + " imágenes";

    if (n === 0) {
      contador.textContent = "No hay imágenes en " + etiqueta;
      return;
    }

    contador.textContent = etiqueta && etiqueta !== "Todas"
      ? etiqueta + ": " + cuantas
      : cuantas;
  }

  actualizarContador("Todas");

  /* ======================================================================
     2. VISOR AMPLIADO
     ====================================================================== */
  items.forEach(function (item) {
    item.querySelector(".galeria__boton").addEventListener("click", function () {
      abrir(visibles.indexOf(item));
    });
  });

  /* El resto de la página queda inerte mientras el visor está abierto: sin
     esto, el lector de pantalla sigue recorriendo la cabecera y la grilla de
     atrás como si el diálogo no existiera. `inert` no está en navegadores
     viejos, y ahí sigue haciendo su trabajo la trampa de foco del teclado. */
  var fondo = Array.prototype.slice.call(
    document.querySelectorAll("body > header, body > main, body > footer, .saltar")
  );

  function fondoInerte(activo) {
    fondo.forEach(function (el) {
      if (activo) el.setAttribute("inert", "");
      else el.removeAttribute("inert");
    });
  }

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
    fondoInerte(true);
    btnCerrar.focus();
  }

  function cerrar() {
    visor.classList.remove("abierto");
    document.body.style.overflow = "";
    /* Hay que quitar el inert ANTES de devolver el foco: a un elemento
       dentro de un contenedor inerte no se le puede dar foco. */
    fondoInerte(false);
    setTimeout(function () { visor.hidden = true; }, 300);

    /* Si la miniatura que abrió el visor quedó filtrada, ya no se le puede
       dar el foco: en ese caso se lo lleva el primer filtro, que es lo más
       cercano, en vez de perderse en el <body>. */
    var destino = ultimoFoco;
    if (!destino || !destino.isConnected || destino.offsetParent === null) {
      destino = filtros[0] || null;
    }
    if (destino) destino.focus();
  }

  function mostrar() {
    var boton = visibles[indice].querySelector(".galeria__boton");
    var img   = boton.querySelector("img");

    imagen.src = img.getAttribute("src");
    imagen.alt = img.getAttribute("alt");
    titulo.textContent   = boton.dataset.titulo;
    epigrafe.textContent = boton.dataset.epigrafe;
    credito.textContent  = boton.dataset.credito || "";

    /* Al pasar de una imagen a otra el foco se queda en la flecha y no cambia
       nada anunciable: sin este aviso, quien usa lector de pantalla aprieta
       la flecha y no recibe ninguna señal de que la foto cambió. */
    if (estado) {
      estado.textContent =
        boton.dataset.titulo + ". Imagen " + (indice + 1) + " de " + visibles.length + ".";
    }

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

  /* Teclado: Escape cierra, flechas navegan y el Tab queda atrapado dentro.
     Se mira la clase y no el atributo `hidden`, que tarda 300 ms en ponerse:
     en esa ventana el visor ya se está yendo y no debe responder a las
     flechas ni volver a cerrarse. */
  document.addEventListener("keydown", function (e) {
    if (!visor.classList.contains("abierto")) return;

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
