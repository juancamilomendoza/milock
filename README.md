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
| Video | casio-ga2100.mp4 | Opcional. Uno o varios videos (uno por línea): archivo subido a `videos/`, YouTube, Google Drive, Instagram, TikTok o Vimeo. Ver `videos/LEEME.md` |
| Disponible | Sí / No | "No" muestra el reloj como agotado |
| Etiqueta | Nuevo | Opcional, aparece sobre la foto |
| Destacado | Sí | Opcional. Con "Sí", el reloj aparece en el banner de destacados arriba de la página. Vacío = no |
| Descuento | 20% | Opcional. Porcentaje de descuento: la página muestra el precio ya rebajado y el original tachado |
| Descripción | Texto libre | Se muestra en la ficha de detalle |

`plantilla-catalogo.csv` trae estas columnas listas para importar en Google Sheets.

La hoja se conecta en `sheetCsvUrl` dentro de `config.js` y debe estar compartida como "Cualquier persona con el enlace: Lector" (nunca Editor).

## Publicación

La página se publica con GitHub Pages desde la rama `main` (Settings > Pages > Deploy from a branch > main / root).

## Códigos de descuento

En la misma Google Sheet, una pestaña llamada **Codigos** (sin tilde) con estas columnas:

| Código | Descuento | Activo |
|---|---|---|
| BLACK10 | 10% | Sí |

- El cliente lo escribe en el carrito (no importan mayúsculas ni espacios).
- El % se aplica al total del carrito, que ya incluye el descuento propio de cada reloj.
- Para apagar un código, cambien Activo a "No" o borren la fila.
- El código y el descuento aparecen en el mensaje de WhatsApp del pedido.
