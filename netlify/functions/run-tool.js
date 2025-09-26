// netlify/functions/run-tool.js
exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ 
      message: '✅ Función ejecutada con éxito',
      output: 'Esta es una prueba desde Netlify Functions.' 
    })
  };
}
