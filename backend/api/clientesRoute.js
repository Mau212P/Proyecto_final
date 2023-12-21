//clientesRoute.js
import clientesController from "./clientesController.js";
import pedidosController from './pedidosController.js';
import productoController from './productoController.js';
import restauranteController from "./restauranteController.js";
import ubicacionController from "./ubicacionController.js";

export default class clientesRoute {
	static configRoutes(router) {
		router.
			route('/')
			.get(clientesController.apiGetClientes)
			.post( clientesController.apiPostCliente)
			.put(clientesController.apiUpdateCliente)
			.delete(clientesController.apiDeleteCliente);
		router.
			route('/restaurantes')
			.get(restauranteController.apiGetRestaurante)
			.post( restauranteController.apiPostRestaurante)
			.put(restauranteController.apiUpdateRestaurante)
			.delete(restauranteController.apiDeleteRestaurante);
		router.
			route('/ubicaciones')
			.get(ubicacionController.apiGetUbicacion)
			.post( ubicacionController.apiPostUbicacion)
			.put(ubicacionController.apiUpdateUbicacion)
			.delete(ubicacionController.apiDeleteUbicacion);
		router
			.route('/pedidos')
			.get(pedidosController.apiGetPedido)
			.post( pedidosController.apiPostPedido)
			.put(pedidosController.apiUpdatePedido)
			.delete(pedidosController.apiDeletePedido);
		router
			.route('/producto')
			.get(productoController.apiGetProducto)
			.post( productoController.apiPostProducto)
			.put(productoController.apiUpdateProducto)
			.delete(productoController.apiDeleteProducto);
		return router;
	}
}