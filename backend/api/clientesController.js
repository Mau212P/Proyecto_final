//clientesController.js
import clientesDAO from '../dao/clientesDAO.js';

class clientesController {
    static async apiGetClientes(req, res, next) {
        const clientesPerPage = req.query.clientesPerPage ? parseInt(req.query.clientesPerPage, 10) : 20;
        const page = req.query.page ? parseInt(req.query.page, 10) : 0;

        let filters = {};
        if (req.query.nombre_completo) {
            filters.nombre_completo = req.query.nombre_completo;
        } else if (req.query.id_ubicacion) {
            filters.id_ubicacion = req.query.id_ubicacion;
        }

        const { clientesList, totalNumClientes } = await clientesDAO.getClientes({
            filters,
            page,
            clientesPerPage,
        });

        let response = {
            clientes: clientesList,
            page: page,
            filters: filters,
            entries_per_page: clientesPerPage,
            total_results: totalNumClientes,
        };
        res.json(response);
    }
}

export default clientesController;
