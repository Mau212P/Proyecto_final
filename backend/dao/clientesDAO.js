//clientesDAO.js
import mongodb from 'mongodb';

class clientesDAO {
    static clientes;

    static async injectDB(conn) {
        if (clientesDAO.clientes) {
            return;
        }
        try {
            clientesDAO.clientes = await conn.db(process.env.NS).collection("Cliente");
        } catch (e) {
            console.error(`Unable to establish a collection handle in clientesDAO: ${e}`);
        }
    }

    static async getClientes({ filters = null, page = 0, clientesPerPage = 20 } = {}) {
        let query;
        if (filters) {
            console.log(filters)
            if ("nombre_completo" in filters) {
                query = { "nombre_completo": { $regex: filters["nombre_completo"], $options: 'i' } };
            } else if ("id_ubicacion" in filters) {
                query = { "id_ubicacion": new mongodb.ObjectId(filters["id_ubicacion"]) };
            }
        }

        let cursor;
        
        try {
            console.log(query);
            cursor = await clientesDAO.clientes.find(query);
        } catch (e) {
            console.error(`Unable to issue find command, ${e}`);
            return { clientesList: [], totalNumClientes: 0 }
        }

        const displayCursor = cursor.limit(clientesPerPage).skip(clientesPerPage * page);

        try {
            const clientesList = await displayCursor.toArray();
            const totalNumClientes = await clientesDAO.clientes.countDocuments(query);

            return { clientesList, totalNumClientes }
        } catch (e) {
            console.error(`Unable to convert cursor to array or problem counting documents, ${e}`);
            return { clientesList: [], totalNumClientes: 0 }
        }
    }
}

export default clientesDAO;