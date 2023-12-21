//pedidosController.js
import pedidosDAO from '../dao/pedidosDAO.js';

export default class pedidosController {
    static async apiGetPedido(req, res, next) {
        const pedidosPerPage = req.query.pedidosPerPage ? parseInt(req.query.pedidosPerPage, 10) : 20;
        const page = req.query.page ? parseInt(req.query.page, 10) : 0;

        let filters = {};
        if (req.query.id_cliente) {
            filters.id_cliente = req.query.id_cliente;
        } else if (req.query.id_producto) {
            filters.id_producto = req.query.id_producto;
        }

        const { pedidosList, totalNumPedidos } = await pedidosDAO.getPedido({
            filters,
            page,
            pedidosPerPage,
        });

        let response = {
            pedidos: pedidosList,
            page: page,
            filters: filters,
            entries_per_page: pedidosPerPage,
            total_results: totalNumPedidos,
        };
        res.json(response);
    }

    static async apiPostPedido(req, res, next) {
        try {
            const id_cliente = req.body.id_cliente;
            const id_restaurante = req.body.id_restaurante;
            const id_producto = req.body.id_producto;
            const id_destino = req.body.id_destino;
            const cantidad_producto = req.body.cantidad_producto;
            const total = req.body.total;
            const hora_pedido = req.body.hora_pedido;
            const pedidosResponse = await pedidosDAO.addPedido(
                id_cliente,
                id_restaurante,
                id_producto,
                id_destino,
                cantidad_producto,
                total,
                hora_pedido
            );
            if(pedidosResponse){
                res.json({ status: 'success ' });
            }
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    static async apiUpdatePedido(req, res, next) {
        try {
            const pedidoId = req.body.pedidoId;
            const { cantidad_producto } = req.body;
            const { total } = req.body;
            const { hora_pedido } = req.body;
            const pedidosResponse = await pedidosDAO.updatePedido(
                pedidoId,
                cantidad_producto,
                total,
                hora_pedido,
            );
            const { error } = pedidosResponse;
            console.log(pedidosResponse);
            if (error) {
                res.status.json({ error });
            }
            if (pedidosResponse.modifiedCount === 0) {
                throw new Error('No se han detectado modificaciones, verifica la conexion');
            }
            res.json({ status: 'success ' });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    static async apiDeletePedido(req, res, next) {
        try {
            const pedidoId = req.body.pedidoId;
            const pedidosResponse = await pedidosDAO.deletePedido(
                pedidoId
            );
            console.log(pedidosResponse);
            res.json({ status: 'success ' });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }
}
