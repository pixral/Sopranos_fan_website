# Los Soprano — Sitio de fans

Sitio web dedicado a la serie *Los Soprano* (HBO, 1999–2007), desarrollado como
trabajo práctico. Maquetado íntegramente con **Flexbox**, responsive y con una
paleta oscura acorde al tono de la serie.

## Consigna del trabajo práctico

| Requisito | Cómo se cumple |
|---|---|
| Una home | `index.html` |
| Mínimo 4 links de primer nivel, sin contar la home | **4**: Temporadas, Personajes, Galería y Contacto |
| Uno de ellos, un formulario de contacto | `contacto.html`: validación en JavaScript, mensajes de error por campo y resumen de errores |
| Otro, una galería de imágenes funcional | `galeria.html`: 39 imágenes, filtro por categoría y visor ampliado con teclado |
| Una sección con submenú desplegable de al menos 3 opciones de segundo nivel | **Temporadas**, con **6** opciones: una por temporada, cada una lleva a su tarjeta (`temporadas.html#temporada-1` … `#temporada-6`) |
| Sitio responsive | Maquetado con Flexbox; menú hamburguesa hasta 992 px; verificado sin desborde horizontal de 320 a 1280 px |

### Cómo funciona el submenú

- En escritorio se abre con el botón de flecha que está al lado de *Temporadas*,
  y también al pasar el mouse por encima. El link *Temporadas* sigue llevando a
  su página.
- En tablet y móvil queda dentro del menú hamburguesa y se despliega en el lugar
  con el mismo botón.
- Con teclado: Tab hasta la flecha, Enter o Espacio para abrir, Tab para recorrer
  las temporadas y Escape para cerrar. En el menú hamburguesa, el primer Escape
  pliega el submenú y el segundo cierra el menú.
- Se sigue el patrón *Disclosure Navigation* de WAI-ARIA: el botón anuncia su
  estado con `aria-expanded` y el submenú cerrado no se puede alcanzar con Tab.

## Páginas

| Página | Contenido |
|---|---|
| `index.html` | Portada: cabecera con logo y menú, contenido en dos columnas iguales (título + 3 párrafos / imagen) y pie con legales y redes. Incluye un montaje animado de fondo con botón de pausa. |
| `temporadas.html` | Las 6 temporadas en tarjetas, con año, cantidad de episodios, resumen y episodios destacados. Es el destino del submenú. |
| `personajes.html` | 15 personajes con el actor que los interpretó, en tres grupos: la familia Soprano, la organización y el entorno. |
| `galeria.html` | 39 imágenes con filtro por categoría y visor ampliado. |
| `contacto.html` | Formulario con validación en JavaScript, canales de contacto y preguntas frecuentes. |

## Estructura

```
los-soprano/
├── index.html
├── temporadas.html
├── personajes.html
├── galeria.html
├── contacto.html
├── css/
│   ├── estilos.css      # estilos principales y comunes a todo el sitio
│   ├── temporadas.css
│   ├── personajes.css
│   ├── galeria.css
│   └── contacto.css
├── img/
│   ├── logo.svg
│   ├── favicon.svg
│   ├── galeria/         # las 39 imágenes de la galería
│   ├── personajes/      # fotogramas que solo usa la página de personajes
│   └── montaje/         # los 6 fotogramas del fondo animado de la portada
└── js/
    ├── main.js          # menú responsive, submenú, sombra de cabecera, pausa del fondo
    ├── galeria.js       # filtros por categoría y visor ampliado
    └── contacto.js      # validación del formulario
```

## Cómo se hizo

- **HTML5 semántico**: `header`, `main`, `section`, `figure`, `footer`.
- **Flexbox** para todo el maquetado: la cabecera, el menú y su submenú, las dos
  columnas de la portada, la grilla de temporadas, las tarjetas de personajes, la
  galería y el pie.
- **Responsive** con tres puntos de corte (992 px, 768 px y 480 px). Hasta 992 px
  el menú pasa a hamburguesa; hasta 768 px las columnas se apilan.
- **CSS puro** para el montaje animado de la portada: seis fotogramas apilados que
  se cortan entre sí cada 6 segundos con `@keyframes` y `animation-delay`
  escalonado. Respeta `prefers-reduced-motion`.
- **JavaScript sin dependencias** (*vanilla*), sin frameworks ni librerías.
- **Font Awesome 6** para los iconos y **Google Fonts** (Cinzel e Inter) para
  las tipografías.
- **Accesibilidad**: `aria-label`, `aria-expanded`, `aria-live` en los errores del
  formulario, foco visible y textos alternativos en todas las imágenes.

## Verlo en local

No hace falta compilar nada: alcanza con abrir `index.html` en el navegador.
Para servirlo por HTTP:

```bash
python -m http.server 8000
```

Y entrar a `http://localhost:8000`.

## Créditos

Todas las imágenes son de uso libre y están acreditadas una por una en
[CREDITOS.md](CREDITOS.md). Los fotogramas de la serie los publicó la propia HBO
bajo licencia CC BY 3.0 en Wikimedia Commons; las fotos del elenco y de las
locaciones, sus autores bajo distintas licencias Creative Commons.

Este es un sitio de fans sin fines de lucro. *Los Soprano* y todos sus derechos
pertenecen a HBO. El sitio no está afiliado ni patrocinado por HBO.
