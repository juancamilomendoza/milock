# MILOCK · Tienda virtual

Tienda virtual de MILOCK, relojería en Cali, Colombia. Catálogo de relojes para caballero y dama con atención personalizada por WhatsApp.

## Cómo está hecha

- `index.html`: la página.
- `assets/styles.css` y `assets/app.js`: diseño y funcionamiento del catálogo.
- `assets/logos/`: logos de MILOCK.
- `videos/`: videos de los relojes (ver `videos/LEEME.md`).
- `config.js`: número de WhatsApp y enlace de la Google Sheet del catálogo.

## Catálogo desde Google Sheets

La página lee los productos de una Google Sheet publicada como CSV. Columnas (la primera fila debe tener estos nombres):

| Columna | Ejemplo | Notas |
|---|---|---|
| Marca | Casio | Se usa para los filtros por marca |
| Modelo | G-Shock GA-2100 | Nombre que ve el cliente |
| Referencia | GA-2100-1A1 | Opcional |
| Color | Negro | Opcional, se muestra en la tarjeta |
| Precio | 520000 | Sin puntos o con ellos, da igual |
| Género | Caballero / Dama / Unisex | Unisex aparece en ambos filtros |
| Material De La Caja | Acero inoxidable | Se muestra en la ficha de detalle |
| Material Del Pulso | Acero / Cuero / Caucho | Crea el filtro por material |
| Mecanismo | Automático / Pila / Solar | Crea el filtro por mecanismo |
| Foto | enlace de la imagen | Varias fotos: un enlace por línea dentro de la misma celda (Alt+Enter) o separados por coma. La primera es la principal. Sirven enlaces de Google Drive compartidos como "Cualquier persona con el enlace" |
| Video | casio-ga2100.mp4 | Opcional. Nombre del archivo subido a `videos/`, o enlace de YouTube o Google Drive |
| Disponible | Sí / No | "No" muestra el reloj como agotado |
| Etiqueta | Nuevo | Opcional, aparece sobre la foto |
| Descripción | Texto libre | Se muestra en la ficha de detalle |

`plantilla-catalogo.csv` trae estas columnas listas para importar en Google Sheets.

Para conectarla: en la hoja, Archivo > Compartir > Publicar en la web > CSV, copiar el enlace y pegarlo en `sheetCsvUrl` dentro de `config.js`. Mientras ese campo esté vacío, la página muestra productos de ejemplo.

## Publicación

La página se publica con GitHub Pages desde la rama `main` (Settings > Pages > Deploy from a branch > main / root).
