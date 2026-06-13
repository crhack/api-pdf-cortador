const { PDFDocument } = require('pdf-lib');

export default async function handler(req, res) {
  // Solo permitimos peticiones POST (las que mandan archivos)
  if (req.method !== 'POST') return res.status(405).send('Solo POST');

  try {
    const { archivo_pdf } = req.body;
    
    // 1. Cargamos el PDF que viene en Base64 desde tu iPhone
    const pdfOriginal = await PDFDocument.load(archivo_pdf);
    
    // 2. Creamos un PDF nuevo y en blanco
    const pdfNuevo = await PDFDocument.create();

    // 3. Copiamos la primera página (el índice es 0)
    const [paginaCopiada] = await pdfNuevo.copyPages(pdfOriginal, [0]);
    pdfNuevo.addPage(paginaCopiada);

    // 4. Lo volvemos a empaquetar en Base64 para devolverlo
    const pdfBase64 = await pdfNuevo.saveAsBase64();

    // 5. Respondemos al iPhone
    res.status(200).json({ resultado_pdf: pdfBase64 });
    
  } catch (error) {
    res.status(500).json({ error: 'Hubo un error al procesar el PDF' });
  }
}
