// Configuración de la tienda MILOCK. Este es el único archivo que hay que tocar para cambiar datos básicos.
window.MILOCK_CONFIG = {
  // Dirección principal de la página. Al cambiarla (por ejemplo al dominio propio en Netlify), quien entre por la
  // dirección vieja de GitHub Pages pasa sola a esta, y las vistas previas de los enlaces usan esta dirección.
  sitio: "https://juancamilomendoza.github.io/milock/",

  // Número de WhatsApp para pedidos, con código de país y sin "+" ni espacios.
  whatsapp: "573128544398",

  // Enlace CSV de la Google Sheet del catálogo (la hoja debe estar compartida como "Cualquier persona con el enlace: Lector").
  sheetCsvUrl: "https://docs.google.com/spreadsheets/d/167npYkxVo2A7PC_ltUqOahxWlN7HLDQMj1K5uSyvEXk/gviz/tq?tqx=out:csv&headers=1",

  // Códigos de descuento: false = apagados (sin barra arriba ni campo en el carrito). Pónganlo en true para volver a usarlos.
  codigosDescuento: false,
  // Nombre de la pestaña de la misma hoja donde están los códigos de descuento (columnas: Código, Descuento, Activo).
  codigosPestana: "CODIGOS",

  // Nombre de la pestaña con la lista de relojes.
  catalogoPestana: "LISTA",

  // Vista de vendedores (página/?vendedores). Huella de la clave, no la clave: para cambiarla pídanselo a Claude.
  claveVendedores: "99e3a13288b215635a5b341b839c1cfcd1083ddfabc3c60d882d02fda43ba790",

  // Orden del catálogo en "Recomendados", de arriba hacia abajo. Cada línea es un grupo; "+" significa que debe cumplir las dos cosas.
  // Palabras posibles: destacado, inmediata (entrega inmediata), maspedido, ultimaunidad, top. Lo que no entre en ningún grupo va al final.
  orden: [
    "destacado + inmediata",
    "destacado",
    "maspedido + inmediata",
    "maspedido",
    "ultimaunidad",
    "top",
  ],

  // Tema de la página: "elegante" (actual), "" (diseño anterior) o "halloween". Para probar uno sin cambiarlo, agreguen ?tema=elegante o ?tema=clasico a la dirección.
  tema: "elegante",
};
