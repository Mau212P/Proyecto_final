//index.js
// Cargar módulos necesarios
import express from 'express';
import cors from 'cors';
import clientesRoute from './api/clientesRoute.js';
import clientesDAO from './dao/clientesDAO.js';
import pedidosDAO from './dao/pedidosDAO.js';
import restauranteDAO from './dao/restauranteDAO.js';
import ubicacionDAO from './dao/ubicacionDAO.js';
import productoDAO from './dao/productoDAO.js';
import dotenv from 'dotenv';
import mongodb from 'mongodb';

class Index {
	
	static app = express();
	static router = express.Router();
	
	static main() {
		dotenv.config();
		Index.setUpServer();
		Index.setUpDatabase();
	}

	static setUpServer() {
		Index.app.use(cors());
		Index.app.use(express.json());
		Index.app.use(express.urlencoded({ extended: true }));
		Index.app.use('/api/v1/client', clientesRoute.configRoutes(Index.router));
		Index.app.use('*', (req, res) => {
			res.status(404).json({ error: 'no encontrado' });
		});
	}
	
	static async setUpDatabase() {

		const client = new mongodb.MongoClient(process.env.DB_URI);
		const port = process.env.PORT || 5000;
		console.log(port);
		try {
			// Connect to the MongoDB cluster
			await client.connect();
			await clientesDAO.injectDB(client);
			await restauranteDAO.injectDB(client);
			await pedidosDAO.injectDB(client);
			await ubicacionDAO.injectDB(client);
			await productoDAO.injectDB(client);
			Index.app.listen(port, () => {
				console.log(`server is running on port:${port}`);
			});
		} catch (e) {
			console.error(e);
			process.exit(1);
		}
	}
}

Index.main();
