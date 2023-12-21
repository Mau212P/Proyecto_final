//productoController.js
import productoDAO from '../dao/productoDAO.js';

class productoController {
    static async apiGetProducto(req, res, next) {
        const productoPerPage = req.query.productoPerPage ? parseInt(req.query.productoPerPage, 10) : 20;
        const page = req.query.page ? parseInt(req.query.page, 10) : 0;

        let filters = {};
        if (req.query.nombre) {
            filters.nombre = req.query.nombre;
        } else if (req.query.id_ubicacion) {
            filters.categoria = req.query.categoria;
        }

        const { productoList, totalNumProducto } = await productoDAO.getProducto({
            filters,
            page,
            productoPerPage,
        });

        let response = {
            productos: productoList,
            page: page,
            filters: filters,
            entries_per_page: productoPerPage,
            total_results: totalNumProducto,
        };
        res.json(response);
    }

    static async apiPostProducto(req, res, next) {
        //nombre, categoria, costo, estatus
        try {
            const nombre = req.body.nombre;
            const categoria = req.body.categoria;
            const costo = req.body.costo;
            const estatus = req.body.estatus;
            const productoResponse = await productoDAO.addProducto(
                nombre, 
                categoria, 
                costo, 
                estatus
            );
            if(productoResponse){
                res.json({ status: 'success ' });
            }
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    static async apiUpdateProducto(req, res, next) {
        //nombre, categoria, costo, estatus
        try {
            const productoId = req.body.productoId;
            const { nombre } = req.body;
            const { categoria } = req.body;
            const { costo } = req.body;
            const { estatus } = req.body;
            const productoResponse = await productoDAO.updateProducto(
                productoId,
                nombre, 
                categoria, 
                costo, 
                estatus
            );
            const { error } = productoResponse;
            console.log(productoResponse);
            if (error) {
                res.status.json({ error });
            }
            if (productoResponse.modifiedCount === 0) {
                throw new Error('No se han detectado modificaciones, verifica la conexion');
            }
            res.json({ status: 'success ' });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    static async apiDeleteProducto(req, res, next) {
        try {
            const productoId = req.body.productoId;
            const productoResponse = await productoDAO.deleteProducto(
                productoId
            );
            console.log(productoResponse);
            res.json({ status: 'success ' });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }
}

export default productoController;
