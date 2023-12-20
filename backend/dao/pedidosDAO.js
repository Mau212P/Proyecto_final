//pedidosDAO.js
import mongodb from 'mongodb';

export default class pedidosDAO {
    static Pedidos;
    static ObjectId = mongodb.ObjectId;
    static Int32 = mongodb.Int32;
    static Double = mongodb.Double;
    //static String = mongodb.String;
    
    static async injectDB(conn) {
        if (pedidosDAO.Pedidos) {
            return;
        }
        try {
            pedidosDAO.Pedidos = await conn.db(process.env.NS).collection('Pedidos');
        } catch (e) {
            console.error(`unable to establish connection handle in pedidosDAO: ${e}`);
        }
    }

    static async addPedido(clienteId, restauranteId, productoId, destinoId, cantidad_producto, total, hora_pedido) {
        try {
            const pedidosDoc = {
                id_cliente: new pedidosDAO.ObjectId(clienteId),
                id_restaurante: new pedidosDAO.ObjectId(restauranteId),
                id_producto: new pedidosDAO.ObjectId(productoId),
                id_destino: new pedidosDAO.ObjectId(destinoId),
                cantidad_producto: new pedidosDAO.Int32(cantidad_producto),
                total: new pedidosDAO.Double(total),
                hora_pedido
            };
            return await pedidosDAO.Pedidos.insertOne(pedidosDoc);
        } catch (e) {
            console.error(`unable to request: ${e}`);
            return { error: e };
        }
    }

    static async updatePedido(pedidoId, clienteId, cantidad_producto, hora_pedido) {
        try {
            const updateResponse = await pedidosDAO.Pedidos.updateOne(
                { id_cliente: clienteId, _id: pedidoId/*new pedidosDAO.ObjectId(clienteId), _id: new pedidosDAO.ObjectId(pedidoId)*/ },
                { $set: { cantidad_producto, hora_pedido } },
            );
            return updateResponse;
        } catch (e) {
            console.error(`unable to update request: ${e}`);
            return { error: e };
        }
    }

    static async deletePedido(pedidoId, clienteId) {
        try {
            const deleteResponse = await pedidosDAO.Pedidos.deleteOne({
                _id: new pedidosDAO.ObjectId(pedidoId),
                user_id: new pedidosDAO.ObjectId(clienteId),
            });
            return deleteResponse;
        } catch (e) {
            console.error(`unable to delete request: ${e}`);
            return { error: e };
        }
    }
}
