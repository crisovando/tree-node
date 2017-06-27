const Arbol = require('../models/arbol.js');
const debug = require('debug')('taxonomia:lib:especie');


class Especie {
  constructor(main) {
    this.db = main.db;
  }

  insert(data) {
    debug('lib.insert called');

    const arbol = new Arbol(this.db);
    return new Promise((resolve, reject) => {
      try {
        arbol.Agregar(data.dominioTaxonomico, data.especie)
          .then(() => arbol.Guardar()
            .then(nodo => resolve(nodo)),
          )
          .catch(err => reject(err));
      } catch (error) {
        reject(error);
      }
    });
  }

  find() {
    // TODO: Implementar find
  }

  remove() {
    // TODO: Implementar remove
  }
}

module.exports = Especie;
