const Arbol = require('../models/arbol.js');
const debug = require('debug')('cablevision:lib:automovil');

/**
 * Genero la query a buscar
 */
const getQuery = (nombre, opcionales) => {
  let query = '';

  if (nombre) query += `nombre=${nombre}`;
  query += `&opcionales=${opcionales.toString()}`;
  debug(`query:${query}`);

  return query;
};

/**
 * obtengo los campos a proyectar
 * @param {*} selects
 */
const getCamposSelect = (selects) => {
  const campos = {};
  selects.forEach((element) => {
    campos[element] = 1;
  }, this);
  return campos;
};


class Especie {
  constructor(main) {
    this.db = main.db;
  }

  insert(data) {
    debug('lib.insert called');

    const arbol = new Arbol(this.db);
    return new Promise((resolve, reject) => {
      try {
        arbol.Agregar(data.dominioTaxonomico, data.especie);
        arbol.Guardar(this.db)
          .then(nodo => resolve(nodo))
          .catch(err => reject(err));
      } catch (error) {
        reject(error);
      }
    });
  }

  find(nombre, opcionales, fields) {
    return new Promise((resolve, reject) => {
      debug(`opcionales: ${opcionales}`);

      const campos = getCamposSelect(fields || []);

      if (opcionales) {
        this.db.automovil.find({ query: getQuery(nombre, opcionales) }, campos, (err, doc) => {
          if (err) reject(err);
          resolve(doc);
        });
      } else {
        const filt = {};
        if (nombre) filt.nombre = { $regex: `.*${nombre}.*`, $options: 'i' };

        this.db.automovil.find(filt, campos, (err, doc) => {
          if (err) reject(err);
          resolve(doc);
        });
      }
    });
  }

  remove(nombre) {
    return new Promise((resolve, reject) => {
      this.db.automovil.remove({ nombre }, (err, res) => {
        if (err) reject(err);
        resolve(res);
      });
    });
  }
}

module.exports = Especie;
