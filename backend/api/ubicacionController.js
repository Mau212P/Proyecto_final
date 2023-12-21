//ubicacionController.js
import ubicacionDAO from '../dao/ubicacionDAO.js';

class ubicacionController {
    static async apiGetUbicacion(req, res, next) {
        const ubicacionPerPage = req.query.ubicacionPerPage ? parseInt(req.query.ubicacionPerPage, 10) : 20;
        const page = req.query.page ? parseInt(req.query.page, 10) : 0;

        let filters = {};
        if (req.query.calle) {
            filters.calle = req.query.calle;
        } else if (req.query.colonia_barrio) {
            filters.colonia_barrio = req.query.colonia_barrio;
        }

        const { ubicacionList, totalNumUbicacion } = await ubicacionDAO.getUbicacion({
            filters,
            page,
            ubicacionPerPage,
        });

        let response = {
            ubicacion: ubicacionList,
            page: page,
            filters: filters,
            entries_per_page: ubicacionPerPage,
            total_results: totalNumUbicacion,
        };
        res.json(response);
    }

    static async apiPostUbicacion(req, res, next) {
    //calle, colonia_barrio, numero_ext, num_int, municipio, referencias
        try {
            const calle = req.body.calle;
            const colonia_barrio = req.body.colonia_barrio;
            const numero_ext = req.body.numero_ext;
            const num_int = req.body.num_int;
            const municipio = req.body.municipio;
            const referencias = req.body.referencias;
            const ubicacionResponse = await ubicacionDAO.addUbicacion(
                calle,
                colonia_barrio, 
                numero_ext, 
                num_int, 
                municipio, 
                referencias
            );
            if(ubicacionResponse){
                res.json({ status: 'success ' });
            }
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    static async apiUpdateUbicacion(req, res, next) {
    //calle, colonia_barrio, numero_ext, num_int, municipio, referencias
        try {
            const ubicacionId = req.body.ubicacionId;
            const { calle } = req.body;
            const { colonia_barrio } = req.body;
            const { numero_ext } = req.body;
            const { num_int } = req.body;
            const { municipio } = req.body;
            const { referencias } = req.body;
            const ubicacionResponse = await ubicacionDAO.updateUbicacion(
                ubicacionId,
                calle,
                colonia_barrio, 
                numero_ext, 
                num_int, 
                municipio, 
                referencias
            );
            const { error } = ubicacionResponse;
            console.log(ubicacionResponse);
            if (error) {
                res.status.json({ error });
            }
            if (ubicacionResponse.modifiedCount === 0) {
                throw new Error('No se han detectado modificaciones, verifica la conexion');
            }
            res.json({ status: 'success ' });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    static async apiDeleteUbicacion(req, res, next) {
        try {
            const ubicacionId = req.body.ubicacionId;
            const ubicacionResponse = await ubicacionDAO.deleteUbicacion(
                ubicacionId
            );
            console.log(ubicacionResponse);
            res.json({ status: 'success ' });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }
}

export default ubicacionController;
