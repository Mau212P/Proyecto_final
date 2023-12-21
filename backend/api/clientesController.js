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

    static async apiPostCliente(req, res, next) {
        //nombre_completo, metodo_pago, id_ubicacion
        try {
            const nombre_completo = req.body.nombre_completo;
            const metodo_pago = req.body.metodo_pago;
            const id_ubicacion = req.body.id_ubicacion;
            const productoResponse = await clientesDAO.addCliente(
                nombre_completo, 
                metodo_pago, 
                id_ubicacion
            );
            if(productoResponse){
                res.json({ status: 'success ' });
            }
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    static async apiUpdateCliente(req, res, next) {
        //nombre_completo, metodo_pago, id_ubicacion
        try {
            const clienteId = req.body.clienteId;
            const { nombre_completo } = req.body;
            const { metodo_pago } = req.body;
            const clientesResponse = await clientesDAO.updateCliente(
                clienteId,
                nombre_completo, 
                metodo_pago
            );
            const { error } = clientesResponse;
            console.log(clientesResponse);
            if (error) {
                res.status.json({ error });
            }
            if (clientesResponse.modifiedCount === 0) {
                throw new Error('No se han detectado modificaciones, verifica la conexion');
            }
            res.json({ status: 'success ' });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    static async apiDeleteCliente(req, res, next) {
        try {
            const clienteId = req.body.clienteId;
            const clienteResponse = await clientesDAO.deleteCliente(
                clienteId
            );
            console.log(clienteResponse);
            res.json({ status: 'success ' });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }
}

export default clientesController;
