// Configuración de la tienda MILOCK. Este es el único archivo que hay que tocar para cambiar datos básicos.
window.MILOCK_CONFIG = {
  // Número de WhatsApp para pedidos, con código de país y sin "+" ni espacios.
  whatsapp: "573128544398",

  // Enlace CSV de la Google Sheet del catálogo (la hoja debe estar compartida como "Cualquier persona con el enlace: Lector").
  sheetCsvUrl: "https://docs.google.com/spreadsheets/d/167npYkxVo2A7PC_ltUqOahxWlN7HLDQMj1K5uSyvEXk/gviz/tq?tqx=out:csv&headers=1",

  // Nombre de la pestaña de la misma hoja donde están los códigos de descuento (columnas: Código, Descuento, Activo).
  codigosPestana: "CODIGOS",

  // Nombre de la pestaña con la lista de relojes.
  catalogoPestana: "LISTA",

  // Vista de vendedores (página/?vendedores). Huella de la clave, no la clave: para cambiarla pídanselo a Claude.
  claveVendedores: "a0b7136428d6a2100625a569fc0d356815e717dcc5057cf1d475718f0f11b79f",

  // Tema de temporada. "halloween" activa la decoración de Halloween; déjenlo en "" para volver al diseño normal.
  tema: "halloween",
};
