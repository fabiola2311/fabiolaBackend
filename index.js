const fs = require('fs')
const express = require('express')


const app = express();
class Container {

    constructor(file) {
        this.file = file;
    }

    async save(object) {
        try {

            if (!fs.existsSync(this.file)) {
                fs.writeFileSync(this.file, "[]")
            }
            let products = await fs.promises.readFile(this.file, 'utf-8')
            if (!products) {
                object = {id:1, ...object}
                products = [object]
                await fs.promises.writeFile(this.file, JSON.stringify(products))
                return 1
            }
            else {
                products = JSON.parse(products)
                const idObject = products[products.length-1].id+1
                object = {id:idObject, ...object}
                products = [...products,object]
                await fs.promises.writeFile(this.file, JSON.stringify(products))
                return idObject

            }




        } catch (error) {
            console.log('Error al guardar el producto en save():', error)
        }
    }



    async getAll() {
        try {
            const products = await fs.promises.readFile(this.file, 'utf-8')
            const productsParsed = JSON.parse(products)
            return productsParsed
        } catch (error) {
            console.log('Error de lectura en getAll():', error)
        }
    }


    async deleteAll() {
        try {
            await fs.promises.writeFile(this.file,"[]")
    
        } catch (error) {
            console.log('Error al borrar productos en deleteAll():', error)
            
        }
    }


    async getById(id) {
        try {
            let products = await this.getAll()
            let foundProduct = products.find(product => {
                return product.id==id
            })
            if(foundProduct){
                return foundProduct

            }
            else {
                console.log("no se encontró el producto")
                return null
            }


            
        } catch (error) {
            console.log('Error al obtener producto en getById():', error)
            
        }

    }
    

    async deleteById(id) {
        try {
            let products = await this.getAll()
            let productToDelete = await this.getById(id)

            products = products.filter(product => {
                return product.id != productToDelete.id
            })

            await fs.promises.writeFile(this.file,JSON.stringify(products))
            
        } catch (error) {
            console.log('Error al eliminar producto en deleteById():', error)
            
        }

    }


}



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
