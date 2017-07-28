import Tree from '../models/arbol';

const debug = require('debug')('taxonomia:lib:especie');

function Guardar(root) {
  return new Promise((resolve, reject) => {
    this.db.taxonomia.update({ categoria: root.categoria }, root, { upsert: true }, (err, doc) => {
      err ? reject(err) : resolve(doc);
    });
  });
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
    return new Promise((resolve, reject) => {
      this.db.taxonomia.find({}, (err, docs) => {
        if (err) reject(err);
        // TODO: Hacer logica de buscar nodo
        resolve(docs);
      });
    });
  }

  remove() {
    // TODO: Implementar remove
  }
}

export default Especie;
