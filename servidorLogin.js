const http = require('http');
const fs = require('fs');
const file ='usuarios.json';

const server = http.createServer((req,res) =>{
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
  /////////// POST para login 
  if (req.method === 'POST' && req.url === '/login') {
    let body = '';
    
    // Maneja la recepción de datos en el cuerpo de la solicitud
    req.on('data', (data) => {
      body += data;
    });
    
    // Una vez que se han recibido todos los datos, realiza alguna acción
    req.on('end', () => {
      try {
        const requestData = JSON.parse(body); // Parsea los datos JSON del cuerpo de la solicitud
        // Realiza alguna lógica con los datos, por ejemplo, autenticación
        try {
          // Lee el contenido de un archivo de manera síncrona
          const data = JSON.parse(fs.readFileSync(file, 'utf-8'));
          let i = 0 ;
          while(requestData.usuario !== data[i].email && i<data.length){
            i++
          }
          if(i<data.length && requestData.usuario === data[i].email && requestData.contra === data[i].contra){
            const responseData = {
              status: 'success',
              message: 'Solicitud de inicio de sesión exitosa',
              usuario: requestData.usuario
            };
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify(responseData));
          }
          else if(i<data.length && requestData.usuario === data[i].email && requestData.contra !== data[i].contra){
            // Si la contraseña es incorrecta, envía una respuesta de error
           res.writeHead(401, { 'Content-Type': 'application/json' });
           res.end(JSON.stringify({ error: 'Contraseña incorrecta' }));
          }
          else{  //Si no se encontro el usuario en el json
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'El Usuario no existe' }));
          }
        } catch (error) {
          console.error('Error al leer el archivo:', error);
        }
      } catch (error) {
        // Manejo de errores si los datos no son JSON válido
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify({ status: 'error', message: 'Datos no válidos' }));
      }
      res.end();
    });
  } 
  ////////////////// ACA POST de registro 
  else if(req.method === 'POST' && req.url ==='/register'){
      let body='';
       req.on('data',(data)=>{
        body+=data;
       })
       req.on('end',()=>{
        try{
          const requestData=JSON.parse(body);
          try{
              const data = JSON.parse(fs.readFileSync(file,'utf-8'));
              data.forEach((element)=>{
                if(element.email === requestData.usuario){
                  res.writeHead(401, {'Content-Type' : 'application/json'});
                  res.write(JSON.stringify({error : 'el usuario ya existe'}));
                }
              })
              data.push({id : data.length+1 , nombre: requestData.nombre , apellido: requestData.apellido , edad: requestData.edad , email: requestData.usuario ,contra: requestData.contra  })
              //Sobreescribimos el archivo con el nuevo usuario 
              try{
                fs.writeFileSync(file,JSON.stringify(data));
                res.writeHead(200,{'Content-Type': 'application/json'});
                res.write(JSON.stringify({status: 'success', message: 'Solicitud de registro exitosa'}));
              }
              catch(error){
                console.log('error al escribir el archivo');
              }
          }
          //Error al leer el archivo
          catch(error){
            console.log('error al leer el archivo');
          }
        }
        catch(error){
            // Manejo de errores si los datos no son JSON válido
           res.writeHead(400, { 'Content-Type': 'application/json' });
           res.write(JSON.stringify({ status: 'error', message: 'Datos no válidos' }));
        }
       res.end();
       });
    }
    else {
    // Maneja otras rutas o métodos de solicitud
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.write('Ruta no encontrada');
    res.end();
  }
});


server.listen(8085,()=>{
    console.log('servidor escuchando en el puerto 8085');
})