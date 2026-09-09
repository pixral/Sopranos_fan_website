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
  function marcarError(campo, idError, texto) {
    campo.closest(".campo").classList.add("campo--error");
    document.getElementById(idError).innerHTML =
      '<i class="fa-solid fa-circle-exclamation"></i> ' + texto;
    campo.setAttribute("aria-invalid", "true");
  }

  function limpiarError(campo) {
    campo.closest(".campo").classList.remove("campo--error");
    campo.removeAttribute("aria-invalid");
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
  nombre.addEventListener("blur", validarNombre);
  email.addEventListener("blur", validarEmail);
  asunto.addEventListener("change", validarAsunto);
  mensaje.addEventListener("blur", validarMensaje);
  condiciones.addEventListener("change", validarCondiciones);

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
      var primero = form.querySelector(".campo--error input, .campo--error select, .campo--error textarea");
      if (primero) primero.focus();
      return;
    }

    formOk.classList.remove("oculto");
    form.reset();
    contador.textContent = "0";
    formOk.scrollIntoView({ behavior: "smooth", block: "center" });
  });

});
