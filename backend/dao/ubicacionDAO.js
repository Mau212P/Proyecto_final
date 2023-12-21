//ubicacionDAO.js
import mongodb from 'mongodb';

class ubicacionDAO {
    static ubicacion;
    static ObjectId = mongodb.ObjectId;
    static Int32 = mongodb.Int32;
    static Double = mongodb.Double;

    static async injectDB(conn) {
        if (ubicacionDAO.ubicacion) {
            return;
        }
        try {
            ubicacionDAO.ubicacion = await conn.db(process.env.NS).collection("Ubicacion");
        } catch (e) {
            console.error(`Unable to establish a collection handle in ubicacionDAO: ${e}`);
        }
    }

    static async getUbicacion({ filters = null, page = 0, ubicacionPerPage = 20 } = {}) {
        let query;
        if (filters) {
            console.log(filters)
            if ("calle" in filters) {
                query = { "calle": { $regex: filters["calle"], $options: 'i' } };
            } else if ("colonia_barrio" in filters) {
                query = { "colonia_barrio": new mongodb.ObjectId(filters["colonia_barrio"]) };
            }
        }

        let cursor;
        
        try {
            console.log(query);
            cursor = await ubicacionDAO.ubicacion.find(query);
        } catch (e) {
            console.error(`Unable to issue find command, ${e}`);
            return { ubicacionList: [], totalNumUbicacion: 0 }
        }

        const displayCursor = cursor.limit(ubicacionPerPage).skip(ubicacionPerPage * page);

        try {
            const ubicacionList = await displayCursor.toArray();
            const totalNumUbicacion = await ubicacionDAO.ubicacion.countDocuments(query);

            return { ubicacionList, totalNumUbicacion }
        } catch (e) {
            console.error(`Unable to convert cursor to array or problem counting documents, ${e}`);
            return { ubicacionList: [], totalNumUbicacion: 0 }
        }
    }

    static async addUbicacion(calle, colonia_barrio, numero_ext, num_int, municipio, referencias) {
        try {
            const ubicacionDoc = {
                calle,
                colonia_barrio,
                numero_ext,
                num_int,
                municipio,
                referencias
            };
            return await ubicacionDAO.ubicacion.insertOne(ubicacionDoc);
        } catch (e) {
            console.error(`unable to request: ${e}`);
            return { error: e };
        }
    }

    static async updateUbicacion(ubicacionId, calle, colonia_barrio, numero_ext, num_int, municipio, referencias) {
        try {
            const updateResponse = await ubicacionDAO.ubicacion.updateOne(
                { _id: new ubicacionDAO.ObjectId(ubicacionId) },
                { $set: { calle, colonia_barrio, numero_ext, num_int, municipio, referencias } },
            );
            return updateResponse;
        } catch (e) {
            console.error(`unable to update request: ${e}`);
            return { error: e };
        }
    }

    static async deleteUbicacion(ubicacionId) {
        try {
            const deleteResponse = await ubicacionDAO.ubicacion.deleteOne({
                _id: new ubicacionDAO.ObjectId(ubicacionId),
            });
            return deleteResponse;
        } catch (e) {
            console.error(`unable to delete request: ${e}`);
            return { error: e };
        }
    }
}

export default ubicacionDAO;