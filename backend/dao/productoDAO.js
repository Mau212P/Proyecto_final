//productoDAO.js
import mongodb from 'mongodb';

class productoDAO {
    static producto;
    static ObjectId = mongodb.ObjectId;
    static Int32 = mongodb.Int32;
    static Double = mongodb.Double;

    static async injectDB(conn) {
        if (productoDAO.producto) {
            return;
        }
        try {
            productoDAO.producto = await conn.db(process.env.NS).collection("Producto");
        } catch (e) {
            console.error(`Unable to establish a collection handle in productoDAO: ${e}`);
        }
    }

    static async getProducto({ filters = null, page = 0, productoPerPage = 20 } = {}) {
        let query;
        if (filters) {
            console.log(filters)
            if ("nombre" in filters) {
                query = { "nombre": { $regex: filters["nombre"], $options: 'i' } };
            } else if ("categoria" in filters) {
                query = { "categoria": new mongodb.ObjectId(filters["categoria"]) };
            }
        }

        let cursor;
        
        try {
            console.log(query);
            cursor = await productoDAO.producto.find(query);
        } catch (e) {
            console.error(`Unable to issue find command, ${e}`);
            return { productoList: [], totalNumProducto: 0 }
        }

        const displayCursor = cursor.limit(productoPerPage).skip(productoPerPage * page);

        try {
            const productoList = await displayCursor.toArray();
            const totalNumProducto = await productoDAO.producto.countDocuments(query);

            return { productoList, totalNumProducto }
        } catch (e) {
            console.error(`Unable to convert cursor to array or problem counting documents, ${e}`);
            return { productoList: [], totalNumProducto: 0 }
        }
    }

    static async addProducto(nombre, categoria, costo, estatus, restauranteId) {
        //nombre, categoria, costo, estatus
        try {
            const productoDoc = {
                nombre, 
                categoria, 
                costo, 
                estatus,
                id_restaurante: new productoDAO.ObjectId(restauranteId)
            };
            return await productoDAO.producto.insertOne(productoDoc);
        } catch (e) {
            console.error(`unable to request: ${e}`);
            return { error: e };
        }
    }

    static async updateProducto(productoId, nombre, categoria, costo, estatus) {
        try {
            const updateResponse = await productoDAO.producto.updateOne(
                { _id: new productoDAO.ObjectId(productoId) },
                { $set: { nombre, categoria, costo, estatus } },
            );
            return updateResponse;
        } catch (e) {
            console.error(`unable to update request: ${e}`);
            return { error: e };
        }
    }

    static async deleteProducto(productoId) {
        try {
            const deleteResponse = await productoDAO.producto.deleteOne({
                _id: new productoDAO.ObjectId(productoId),
            });
            return deleteResponse;
        } catch (e) {
            console.error(`unable to delete request: ${e}`);
            return { error: e };
        }
    }
}

export default productoDAO;