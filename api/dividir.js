const { PDFDocument } = require('pdf-lib');

module.exports = async (req, res) => {
  // 1. Filtro de seguridad: solo aceptar POST
  if (req.method !== 'POST') {
    return res.status(405).send('Solo POST');
  }

  try {
    const { archivo_pdf } = req.body;
    
    // 2. Filtro: Si llega vacío, avisamos
    if (!archivo_pdf) {
       return res.status(400).send('No se recibio el archivo PDF');
    }

    // 3. Cargamos el PDF de tu iPhone
    const pdfOriginal = await PDFDocument.load(archivo_pdf);
    
    // 4. Creamos un lienzo en blanco
    const pdfNuevo = await PDFDocument.create();

    // 5. Extraemos la primera hoja (índice 0)
    const [paginaCopiada] = await pdfNuevo.copyPages(pdfOriginal, [0]);
    pdfNuevo.addPage(paginaCopiada);

    // 6. Empaquetamos en Base64
    const pdfBase64 = await pdfNuevo.saveAsBase64();

    // 7. Devolvemos el JSON perfecto
    res.status(200).json({ resultado_pdf: pdfBase64 });
    
  } catch (error) {
    // Si la librería falla, devolvemos JSON (no HTML)
    res.status(500).json({ error: 'Fallo interno al procesar el documento' });
  }
};
⁠// Forzando el build en Vercel⁠
