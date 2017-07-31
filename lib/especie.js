
import Tree from '../models/arbol';

const debug = require('debug')('taxonomia:lib:especie');

function Guardar(root) {
  return new Promise((resolve, reject) => {
    this.db.taxonomia.update({ categoria: root.categoria }, root, { upsert: true }, (err, doc) => {
      err ? reject(err) : resolve(doc);
    });
  });
}

const getCategoriasByDominio = dominio => dominio.split('.').reverse();
const nodoSiguiente = (nodo, categorias) => {

}
const eliminarNodosVacios = (root, categorias) => {
  const cats = Object.assign([], categorias);
  const categoria = cats.pop();
  if (root.categoria === categoria) {
    root.hijoIzq = nodoSiguiente(root.hijoIzq, cats);
  } else {
    
  }
}

class Especie {
  constructor(main) {
    this.db = main.db;
  }

  insert(data) {
    debug('lib.insert called');

    const arbol = new Tree(this.db);
    return new Promise((resolve, reject) => {
      try {
        arbol.Agregar(data.dominioTaxonomico, data.especie, this.db)
          .then(root => Guardar.call(this, root))
          .then(nodo => resolve(nodo))
          .catch(err => reject(err));
      } catch (error) {
        reject(error);
      }
    });
  }

  find(dominio) {
    const categorias = getCategoriasByDominio(dominio);
    return new Promise((resolve, reject) => {
      this.db.taxonomia.findOne({}, (err, doc) => {
        if (err) reject(err);

        if (doc) {
          const arbol = new Tree(null, doc);
          resolve(arbol.ObtenerEspecie(categorias));
        } else {
          resolve(doc);
        }
      });
    });
  }

  remove(dominio) {
    const categorias = getCategoriasByDominio(dominio.substring(0, dominio.lastIndexOf('.')));
    return new Promise((resolve, reject) => {
      this.db.taxonomia.findOne({}, (err, doc) => {
        if (err) reject(err);

        if (doc) {
          const nameEspecie = dominio.split('.').pop();
          const arbol = new Tree(null, doc);
          const nodo = arbol.ObtenerEspecie(categorias);
          // Si existe especie actualizo
          if (nodo) {
            let currentEspecie = nodo.hijoIzq;
            let lastEspecie = {};
            // busco la especie
            let encontrado = false;
            if (currentEspecie.categoria === nameEspecie) {
              nodo.hijoIzq = currentEspecie.hermanoDer;
              encontrado = true;
            } else {
              while (currentEspecie && currentEspecie.categoria !== nameEspecie) {
                lastEspecie = currentEspecie;
                currentEspecie = currentEspecie.hermanoDer;

                if (currentEspecie) {
                  lastEspecie.hermanoDer = currentEspecie.hermanoDer;
                  encontrado = true;
                }
              }
            }
            if (encontrado) {
              eliminarNodosVacios(arbol.root, categorias);
            }
          }
          Guardar.call(this, arbol.root);
        }
      });
    });
  }
}

export default Especie;
