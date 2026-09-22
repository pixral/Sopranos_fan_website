/* ==========================================================================
   LOS SOPRANO - Scripts del sitio
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {

  /* Ancho hasta el que el menú es hamburguesa. Tiene que coincidir con el
     @media (max-width: 992px) de css/estilos.css: si se cambia uno, el otro. */
  var MENU_MOVIL = 992;

  function esEscritorio() { return window.innerWidth > MENU_MOVIL; }

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

    /* Cerrar el menú al volver a escritorio.
       El resize dispara decenas de veces por segundo mientras se arrastra el
       borde de la ventana: se espera a que pare. */
    var temporizadorResize = null;
    window.addEventListener("resize", function () {
      clearTimeout(temporizadorResize);
      temporizadorResize = setTimeout(function () {
        if (esEscritorio()) cerrarMenu();
      }, 150);
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
    /* Al volver a abrir el menú, los submenús arrancan plegados */
    cerrarSubmenus();
  }

  /* ---------- 1b. Submenús desplegables ----------
     Cada ítem con submenú tiene un botón propio (aria-expanded). Se abre con
     clic, toque, Enter o Espacio; se cierra con Escape, con un clic afuera o,
     en escritorio, cuando el foco sale del ítem. */
  var desplegables = Array.prototype.slice.call(
    document.querySelectorAll(".nav__item--desplegable")
  );

  function fijarSubmenu(item, abierto) {
    item.classList.toggle("abierto", abierto);
    item.querySelector(".nav__despliegue").setAttribute("aria-expanded", abierto);
  }

  function cerrarSubmenus(excepto) {
    desplegables.forEach(function (item) {
      if (item !== excepto) fijarSubmenu(item, false);
    });
  }

  desplegables.forEach(function (item) {
    var disparador = item.querySelector(".nav__despliegue");

    disparador.addEventListener("click", function () {
      var abrir = !item.classList.contains("abierto");
      cerrarSubmenus(item);        /* uno abierto por vez */
      fijarSubmenu(item, abrir);
    });

    /* Escape cierra solo el submenú y devuelve el foco a su botón. Se corta la
       propagación para que el Escape del menú hamburguesa no cierre todo de
       una: la primera pulsación pliega el submenú, la segunda cierra el menú. */
    item.addEventListener("keydown", function (e) {
      if (e.key !== "Escape" || !item.classList.contains("abierto")) return;
      e.stopPropagation();
      fijarSubmenu(item, false);
      disparador.focus();
    });

    /* En escritorio el submenú flota sobre el contenido: si el foco se va con
       Tab, se cierra para no dejar un panel abierto tapando la página. En el
       menú hamburguesa se queda abierto, porque ahí no tapa nada. */
    item.addEventListener("focusout", function (e) {
      if (!esEscritorio()) return;
      if (e.relatedTarget && item.contains(e.relatedTarget)) return;
      fijarSubmenu(item, false);
    });
  });

  /* Clic en cualquier otra parte: se cierran los submenús abiertos */
  document.addEventListener("click", function (e) {
    desplegables.forEach(function (item) {
      if (!item.contains(e.target)) fijarSubmenu(item, false);
    });
  });

  /* ---------- 2. Sombra en la cabecera al hacer scroll ----------
     El evento de scroll se dispara en cada cuadro. Antes se escribía en el
     DOM en todos, incluso cuando la clase ya estaba puesta; ahora el trabajo
     se agenda en un requestAnimationFrame y solo se toca el DOM si el estado
     realmente cambió. */
  var cabecera = document.getElementById("cabecera");

  if (cabecera) {
    var conSombra = false;
    var pendiente = false;

    window.addEventListener("scroll", function () {
      if (pendiente) return;
      pendiente = true;

      window.requestAnimationFrame(function () {
        pendiente = false;
        var deberia = window.scrollY > 20;
        if (deberia === conSombra) return;
        conSombra = deberia;
        cabecera.classList.toggle("cabecera--scroll", deberia);
      });
    }, { passive: true });
  }

  /* ---------- 3. Año actual en los legales del pie ---------- */
  var anio = document.getElementById("anio");
  if (anio) anio.textContent = new Date().getFullYear();

  /* ---------- 4. Pausar el montaje de la portada ----------
     Contenido en movimiento que arranca solo y se repite: hace falta poder
     detenerlo. La preferencia se recuerda para las próximas visitas. */
  var ctrl    = document.getElementById("montajeControl");
  var montaje = document.querySelector(".montaje");

  if (ctrl && montaje) {
    var CLAVE = "montaje-pausado";

    /* localStorage puede fallar (modo privado, cookies bloqueadas) */
    function leerPreferencia() {
      try { return localStorage.getItem(CLAVE) === "1"; } catch (e) { return false; }
    }

    function guardarPreferencia(pausado) {
      try { localStorage.setItem(CLAVE, pausado ? "1" : "0"); } catch (e) { /* se ignora */ }
    }

    function aplicar(pausado, guardar) {
      montaje.classList.toggle("montaje--pausado", pausado);
      ctrl.setAttribute("aria-pressed", pausado);
      ctrl.querySelector(".montaje-control__texto").textContent =
        pausado ? "Reanudar el fondo" : "Pausar el fondo";
      ctrl.querySelector("i").className =
        pausado ? "fa-solid fa-play" : "fa-solid fa-pause";
      if (guardar) guardarPreferencia(pausado);
    }

    aplicar(leerPreferencia(), false);

    ctrl.addEventListener("click", function () {
      aplicar(!montaje.classList.contains("montaje--pausado"), true);
    });
  }

  /* ---------- 5. Aviso en los enlaces que abren una pestaña nueva ----------
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
