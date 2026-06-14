export const config = {
  runtime: 'edge',
};

import { PDFDocument } from 'https://esm.sh/pdf-lib';

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Solo POST', { status: 405 });
  }

  try {
    const body = await req.json();
    const archivo_pdf = body.archivo_pdf;
    
    if (!archivo_pdf) {
       return new Response(JSON.stringify({ error: 'No se recibio PDF' }), { 
         status: 400,
         headers: { 'Content-Type': 'application/json' }
       });
    }

    const pdfOriginal = await PDFDocument.load(archivo_pdf);
    const pdfNuevo = await PDFDocument.create();

    const [paginaCopiada] = await pdfNuevo.copyPages(pdfOriginal, [0]);
    pdfNuevo.addPage(paginaCopiada);

    const pdfBase64 = await pdfNuevo.saveAsBase64();

    return new Response(JSON.stringify({ resultado_pdf: pdfBase64 }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
