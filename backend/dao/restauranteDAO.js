//restauranteDAO.js
import mongodb from 'mongodb';

class restauranteDAO {
    static restaurante;
    static ObjectId = mongodb.ObjectId;
    static Int32 = mongodb.Int32;
    static Double = mongodb.Double;

    static async injectDB(conn) {
        if (restauranteDAO.restaurante) {
            return;
        }
        try {
            restauranteDAO.restaurante = await conn.db(process.env.NS).collection("Restaurante");
        } catch (e) {
            console.error(`Unable to establish a collection handle in restauranteDAO: ${e}`);
        }
    }

    static async getRestaurante({ filters = null, page = 0, restaurantePerPage = 20 } = {}) {
        let query;
        if (filters) {
            console.log(filters)
            if ("nombre" in filters) {
                query = { "nombre": { $regex: filters["nombre"], $options: 'i' } };
            } else if ("id_ubicacion" in filters) {
                query = { "id_ubicacion": new mongodb.ObjectId(filters["id_ubicacion"]) };
            }
        }

        let cursor;
        
        try {
            console.log(query);
            cursor = await restauranteDAO.restaurante.find(query);
        } catch (e) {
            console.error(`Unable to issue find command, ${e}`);
            return { restauranteList: [], totalNumRestaurante: 0 }
        }

        const displayCursor = cursor.limit(restaurantePerPage).skip(restaurantePerPage * page);

        try {
            const restauranteList = await displayCursor.toArray();
            const totalNumRestaurante = await restauranteDAO.restaurante.countDocuments(query);

            return { restauranteList, totalNumRestaurante }
        } catch (e) {
            console.error(`Unable to convert cursor to array or problem counting documents, ${e}`);
            return { restauranteList: [], totalNumRestaurante: 0 }
        }
    }

    static async addRestaurante(nombre, horario_apertura, horario_cierre, calificacion, ubicacionId) {
        try {
            const restauranteDoc = {
                nombre,
                horario_apertura,
                horario_cierre,
                calificion: new restauranteDAO.Int32(calificacion),
                id_ubicacion: new restauranteDAO.ObjectId(ubicacionId)
            };
            return await restauranteDAO.restaurante.insertOne(restauranteDoc);
        } catch (e) {
            console.error(`unable to request: ${e}`);
            return { error: e };
        }
    }

    static async updateRestaurante(restauranteId, nombre, horario_apertura, horario_cierre, calificacion) {
        try {
            const updateResponse = await restauranteDAO.restaurante.updateOne(
                { _id: new restauranteDAO.ObjectId(restauranteId) },
                { $set: { nombre, horario_apertura, horario_cierre, calificacion } },
            );
            return updateResponse;
        } catch (e) {
            console.error(`unable to update request: ${e}`);
            return { error: e };
        }
    }

    static async deleteRestaurante(restauranteId) {
        try {
            const deleteResponse = await restauranteDAO.restaurante.deleteOne({
                _id: new restauranteDAO.ObjectId(restauranteId),
            });
            return deleteResponse;
        } catch (e) {
            console.error(`unable to delete request: ${e}`);
            return { error: e };
        }
    }
}

export default restauranteDAO;