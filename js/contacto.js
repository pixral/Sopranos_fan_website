/* ==========================================================================
   LOS SOPRANO - Contacto: validación del formulario
   Es una demostración: no envía datos a ningún servidor.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {

  var form = document.getElementById("formContacto");
  if (!form) return;

  var nombre      = document.getElementById("nombre");
  var email       = document.getElementById("email");
  var asunto      = document.getElementById("asunto");
  var mensaje     = document.getElementById("mensaje");
  var condiciones = document.getElementById("condiciones");
  var formOk      = document.getElementById("formOk");
  var contador    = document.getElementById("contadorMensaje");
  var resumen     = document.getElementById("formErrores");
  var resumenLista = document.getElementById("formErroresLista");

  /* Quien pidió menos movimiento en su sistema no debería recibir un scroll
     animado. El CSS anula `scroll-behavior`, pero un scrollIntoView con
     `behavior: "smooth"` desde JavaScript le pasa por encima. */
  var menosMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)");

  function irA(el) {
    el.scrollIntoView({
      behavior: menosMovimiento.matches ? "auto" : "smooth",
      block: "center"
    });
  }

  /* El tope lo define el maxlength del HTML */
  var MAX_MENSAJE = parseInt(mensaje.getAttribute("maxlength"), 10) || 500;
  var MIN_MENSAJE = 20;

  /* Expresión regular simple para el correo */
  var RE_EMAIL = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

  /* ---------- Contador de caracteres ---------- */
  mensaje.addEventListener("input", function () {
    contador.textContent = mensaje.value.length;
  });

  /* Si el usuario vuelve a escribir, se oculta el mensaje de éxito anterior */
  form.addEventListener("input", function () {
    formOk.classList.add("oculto");
  });

  /* ---------- Helpers ---------- */

  /* Último texto de error de cada campo, para poder armar el resumen */
  var errores = {};

  function marcarError(campo, idError, texto) {
    campo.closest(".campo").classList.add("campo--error");
    document.getElementById(idError).innerHTML =
      '<i class="fa-solid fa-circle-exclamation" aria-hidden="true"></i> ' + texto;
    campo.setAttribute("aria-invalid", "true");
    errores[campo.id] = texto;
  }

  function limpiarError(campo) {
    var contenedor = campo.closest(".campo");
    contenedor.classList.remove("campo--error");
    campo.removeAttribute("aria-invalid");
    delete errores[campo.id];

    /* Hay que vaciar el texto, no solo esconderlo. El <p> del error es una
       región viva: si conserva el mensaje anterior y el campo vuelve a
       fallar con el mismo error, el contenido no cambia y el lector de
       pantalla no anuncia nada. */
    var aviso = contenedor.querySelector(".campo__error");
    if (aviso) aviso.textContent = "";
  }

  /* ---------- Validaciones por campo ---------- */
  function validarNombre() {
    var valor = nombre.value.trim();
    if (valor === "") {
      marcarError(nombre, "errorNombre", "Escribí tu nombre.");
      return false;
    }
    if (valor.length < 3) {
      marcarError(nombre, "errorNombre", "El nombre es demasiado corto.");
      return false;
    }
    limpiarError(nombre);
    return true;
  }

  function validarEmail() {
    var valor = email.value.trim();
    if (valor === "") {
      marcarError(email, "errorEmail", "Escribí tu correo electrónico.");
      return false;
    }
    if (!RE_EMAIL.test(valor)) {
      marcarError(email, "errorEmail", "El correo no tiene un formato válido.");
      return false;
    }
    limpiarError(email);
    return true;
  }

  function validarAsunto() {
    if (asunto.value === "") {
      marcarError(asunto, "errorAsunto", "Elegí un asunto.");
      return false;
    }
    limpiarError(asunto);
    return true;
  }

  function validarMensaje() {
    var valor = mensaje.value.trim();
    if (valor === "") {
      marcarError(mensaje, "errorMensaje", "El mensaje no puede estar vacío.");
      return false;
    }
    if (valor.length < MIN_MENSAJE) {
      marcarError(mensaje, "errorMensaje",
        "Contanos un poco más: faltan " + (MIN_MENSAJE - valor.length) + " caracteres.");
      return false;
    }
    limpiarError(mensaje);
    return true;
  }

  function validarCondiciones() {
    if (!condiciones.checked) {
      marcarError(condiciones, "errorCondiciones", "Tenés que aceptar los términos.");
      return false;
    }
    limpiarError(condiciones);
    return true;
  }

  /* ---------- Validación en vivo, una vez que el campo se usó ---------- */
  [
    [nombre,      "blur",   validarNombre],
    [email,       "blur",   validarEmail],
    [asunto,      "change", validarAsunto],
    [mensaje,     "blur",   validarMensaje],
    [condiciones, "change", validarCondiciones]
  ].forEach(function (par) {
    par[0].addEventListener(par[1], function () {
      par[2]();
      refrescarResumen();
    });
  });

  /* ---------- Resumen de errores ----------
     Con cinco campos, marcar cada uno por separado obliga a recorrer todo el
     formulario para descubrir qué falta. El resumen se arma al fallar el
     envío, recibe el foco y cada línea lleva directo al campo. Los errores
     de cada campo se mantienen igual: el resumen los acompaña, no los
     reemplaza. */
  var ETIQUETAS = {
    nombre:      "Nombre y apellido",
    email:       "Correo electrónico",
    asunto:      "Asunto",
    mensaje:     "Mensaje",
    condiciones: "Términos y condiciones"
  };

  /* El orden de la lista tiene que ser el del formulario, no el de las
     claves del objeto: si no, el resumen manda a saltar de un lado a otro. */
  var ORDEN = ["nombre", "email", "asunto", "mensaje", "condiciones"];

  function mostrarResumen(conFoco) {
    var lista = ORDEN.filter(function (id) { return errores[id]; });
    if (!lista.length) { ocultarResumen(); return; }

    resumenLista.innerHTML = lista.map(function (id) {
      return '<li><a href="#' + id + '">' + ETIQUETAS[id] + ": " + errores[id] + "</a></li>";
    }).join("");

    resumen.classList.remove("oculto");

    /* El foco por sí solo no alcanza: si el resumen ya asomaba en pantalla,
       el navegador da por hecho que está a la vista y no scrollea, así que el
       `scroll-padding-top` no entra en juego y la cabecera pegajosa le tapa
       el título (WCAG 2.2, "el foco no debe quedar oculto"). Se enfoca sin
       scroll y después se lo centra a mano. */
    if (conFoco) {
      resumen.focus({ preventScroll: true });
      irA(resumen);
    }
  }

  function ocultarResumen() {
    resumen.classList.add("oculto");
    resumenLista.innerHTML = "";
  }

  /* Mientras el resumen está a la vista se mantiene al día: si el usuario
     arregla un campo, esa línea desaparece en el acto. Sin esto la lista
     quedaría mintiendo hasta el siguiente envío. */
  function refrescarResumen() {
    if (!resumen.classList.contains("oculto")) mostrarResumen(false);
  }

  /* ---------- Envío ---------- */
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    formOk.classList.add("oculto");

    /* Se validan todos los campos (sin cortocircuito) para marcarlos juntos */
    var ok = [
      validarNombre(),
      validarEmail(),
      validarAsunto(),
      validarMensaje(),
      validarCondiciones()
    ].every(Boolean);

    if (!ok) {
      mostrarResumen(true);
      return;
    }

    ocultarResumen();
    formOk.classList.remove("oculto");
    form.reset();
    contador.textContent = "0";

    /* El foco va al aviso de éxito: quien navega con teclado se quedaba en el
       botón de enviar, con el formulario ya vacío y sin saber qué pasó.
       Mismo cuidado que con el resumen: se enfoca sin scroll y se centra. */
    formOk.focus({ preventScroll: true });
    irA(formOk);
  });

});
