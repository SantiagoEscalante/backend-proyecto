const http = require('http');
const fs = require('fs');
const file ='/usuarios.json';

const server = http.createServer((req,res) =>{
   console.log(req.method);
  // Permite solicitudes desde cualquier origen (*)
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Habilita los métodos HTTP que se permiten
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');

  // Permite ciertos encabezados personalizados (puedes especificar los que necesites)
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Habilita cookies y credenciales en las solicitudes (si es necesario)
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    // Las solicitudes OPTIONS se utilizan para preflights en CORS
    res.writeHead(204);
    res.end();
    return;
  }

  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.write('Hola');
  res.end();
});


server.listen(8085,()=>{
    console.log('servidor escuchando en el puerto 8085');
})