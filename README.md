# Los Soprano — Sitio de fans

Sitio web dedicado a la serie *Los Soprano* (HBO, 1999–2007), desarrollado como
trabajo práctico. Maquetado íntegramente con **Flexbox**, responsive y con una
paleta oscura acorde al tono de la serie.

## Páginas

| Página | Contenido |
|---|---|
| `index.html` | Portada: cabecera con logo y menú, contenido en dos columnas iguales (título + 3 párrafos / imagen) y pie con legales y redes. Incluye un montaje animado de fondo. |
| `temporadas.html` | Las 6 temporadas en tarjetas, con año, cantidad de episodios, resumen y episodios destacados. |
| `galeria.html` | 39 imágenes con filtro por categoría y visor ampliado. |
| `contacto.html` | Formulario con validación en JavaScript, canales de contacto y preguntas frecuentes. |

## Estructura

```
los-soprano/
├── index.html
├── temporadas.html
├── galeria.html
├── contacto.html
├── css/
│   ├── estilos.css      # estilos principales y comunes a todo el sitio
│   ├── temporadas.css
│   ├── galeria.css
│   └── contacto.css
├── img/
│   ├── logo.svg
│   ├── favicon.svg
│   ├── galeria/         # las 39 imágenes de la galería
│   └── montaje/         # los 6 fotogramas del fondo animado de la portada
└── js/
    ├── main.js          # menú responsive, sombra de cabecera, año del pie
    ├── galeria.js       # filtros por categoría y visor ampliado
    └── contacto.js      # validación del formulario
```

## Cómo se hizo

- **HTML5 semántico**: `header`, `main`, `section`, `figure`, `footer`.
- **Flexbox** para todo el maquetado: la cabecera, las dos columnas de la portada,
  la grilla de temporadas, la galería y el pie.
- **Responsive** con tres puntos de corte (992 px, 768 px y 480 px). En móvil las
  columnas se apilan y el menú pasa a hamburguesa.
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
