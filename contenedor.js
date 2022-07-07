import fs from 'fs'


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

const productos = new Container("productos.txt")
const obj = {
    title: "gorrasss",
    price: 24,
    thumbnail: "www.google.com"
}

const prueba = async () => {
    console.log(`El id del último producto agregado es: ${await productos.save(obj)}`)
    console.log(await productos.getAll())
    console.log(await productos.getById(5))
    console.log(await productos.deleteById(2))
}


export {Container} 