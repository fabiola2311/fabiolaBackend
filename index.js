import { Container } from './contenedor.js';
import express from 'express';
const app = express();




//Conexión al servidor
const PORT = 3000;
const server = app.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${server.address().port} usando express`)
})

//Ruta get Raíz

app.get('/', (solicitud, respuesta) => {
    respuesta.send('<h1> Bienvenidos al servidor </h1>');
});

//Creo un objeto a partir de la clase Container
const productos = new Container("productos.txt")

//Declaro un contexto asincrónico para usar async/await
const contextoAsincronico = async () => {
    const listadoDeProductos = await productos.getAll()
    
    //Ruta get '/productos'
    app.get('/productos', (solicitud, respuesta) => {
        respuesta.send(listadoDeProductos)
    })
    
    // Ruta get '/productoRandom'
    app.get('/productoRandom', (solicitud, respuesta) => {
        respuesta.send(getRandomItem(listadoDeProductos))
    })    
}

contextoAsincronico()


//Devuelve un item random de un array
function getRandomItem(arr) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    const item = arr[randomIndex];
    return item;
}

//Manejo de Errores
server.on("error", error => console.log(`Error en servidor ${error}`))
