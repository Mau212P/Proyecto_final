//restauranteController.js
import restauranteDAO from '../dao/restauranteDAO.js';

class restauranteController {
    static async apiGetRestaurante(req, res, next) {
        const restaurantePerPage = req.query.restaurantePerPage ? parseInt(req.query.restaurantePerPage, 10) : 20;
        const page = req.query.page ? parseInt(req.query.page, 10) : 0;

        let filters = {};
        if (req.query.nombre) {
            filters.nombre = req.query.nombre;
        } else if (req.query.id_ubicacion) {
            filters.id_ubicacion = req.query.id_ubicacion;
        }

        const { restauranteList, totalNumRestaurante } = await restauranteDAO.getRestaurante({
            filters,
            page,
            restaurantePerPage,
        });

        let response = {
            restaurantes: restauranteList,
            page: page,
            filters: filters,
            entries_per_page: restaurantePerPage,
            total_results: totalNumRestaurante,
        };
        res.json(response);
    }

    static async apiPostRestaurante(req, res, next) {
        try {
            const nombre = req.body.nombre;
            const horario_apertura = req.body.horario_apertura;
            const horario_cierre = req.body.horario_cierre;
            const calificacion = req.body.calificacion;
            const id_ubicacion = req.body.ubicacion;
            const restauranteResponse = await restauranteDAO.addRestaurante(
                nombre,
                horario_apertura,
                horario_cierre,
                calificacion,
                id_ubicacion
            );
            if(restauranteResponse){
                res.json({ status: 'success ' });
            }
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    static async apiUpdateRestaurante(req, res, next) {
        try {
            const restauranteId = req.body.restauranteId;
            const { nombre } = req.body;
            const { horario_apertura } = req.body;
            const { horario_cierre } = req.body;
            const { calificacion } = req.body;
            const restauranteResponse = await restauranteDAO.updateRestaurante(
                restauranteId,
                nombre,
                horario_apertura,
                horario_cierre,
                calificacion,
            );
            const { error } = restauranteResponse;
            console.log(restauranteResponse);
            if (error) {
                res.status.json({ error });
            }
            if (restauranteResponse.modifiedCount === 0) {
                throw new Error('No se han detectado modificaciones, verifica la conexion');
            }
            res.json({ status: 'success ' });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    static async apiDeleteRestaurante(req, res, next) {
        try {
            const restauranteId = req.body.restauranteId;
            const restauranteResponse = await restauranteDAO.deleteRestaurante(
                restauranteId
            );
            console.log(restauranteResponse);
            res.json({ status: 'success ' });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }
}

export default restauranteController;
