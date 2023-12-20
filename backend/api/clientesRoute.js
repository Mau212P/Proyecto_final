//clientesRoute.js
import clientesController from "./clientesController.js";
import pedidosController from './pedidosController.js';

export default class clientesRoute {
	static configRoutes(router) {
		router.route('/').get(clientesController.apiGetClientes);
		router
			.route('/pedidos')
			.post( pedidosController.apiPostPedido)
			.put(pedidosController.apiUpdatePedido)
			.delete(pedidosController.apiDeletePedido);
		return router;
	}
}