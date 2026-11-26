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
  // Carrusel "En la muñeca": fotos de modelos con los relojes (se muestran en orden aleatorio en cada visita). Para agregar una, súbanla a
  // assets/models/web/ (JPG liviano) y pongan su nombre aquí. Lista vacía = la sección no aparece.
  modelos: [
    "assets/models/web/modelo-1.jpg", "assets/models/web/modelo-2.jpg", "assets/models/web/modelo-3.jpg",
    "assets/models/web/modelo-4.jpg", "assets/models/web/modelo-5.jpg", "assets/models/web/modelo-6.jpg",
    "assets/models/web/modelo-7.jpg", "assets/models/web/modelo-8.jpg", "assets/models/web/modelo-9.jpg",
    "assets/models/web/modelo-11.jpg", "assets/models/web/modelo-12.jpg", "assets/models/web/modelo-13.jpg",
    "assets/models/web/modelo-14.jpg", "assets/models/web/modelo-15.jpg",
  ],

  orden: [
    "destacado + inmediata",
    "destacado",
    "maspedido + inmediata",
    "maspedido",
    "ultimaunidad",
    "top",
  ],

  // Tema de la página: "blackfriday" (actual, promoción Black Week), "elegante", "" (diseño anterior) o "halloween". Para probar uno sin cambiarlo, agreguen ?tema=elegante o ?tema=clasico a la dirección.
  tema: "blackfriday",

  // Black Friday: % adicional para los relojes con "Entrega inmediata" = Sí (se suma al de la columna Descuento).
  // En la página aparece como oferta Black Friday. Pónganlo en 0 para terminar la promoción.
  blackFriday: 10,
};
