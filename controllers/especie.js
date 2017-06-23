

const debug = require('debug')('taxonomia:controllers:especie');


function Especie(main) {
  debug('init...');

  return {
    insert: (req, res, next) => {
      debug('.especie.insert called: ', +JSON.stringify(req.swagger.params));

      const parametros = {
        dominioTaxonomico: req.swagger.params.dominioTaxonomico.value,
        especie: req.swagger.params.especie.value,
      };

      main.libs.especie.insert(parametros)
      .then((especie) => {
        res.json(especie);
      })
      .catch(err => next(err));
    },
    search: (req, res, next) => {
      debug('.especie.find called');

      const nombre = req.swagger.params.nombre ? req.swagger.params.nombre.value : null;
      const opcionales = req.swagger.params.opcionales ? req.swagger.params.opcionales.value : null;
      const fields = req.swagger.params.fields ? req.swagger.params.fields.value : null;

      main.libs.especie.find(nombre, opcionales, fields)
                .then((automoviles) => {
                  res.json(automoviles);
                })
                .catch(err => next(err));
    },
  };
}

module.exports = Especie;
