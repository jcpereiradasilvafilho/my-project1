'use strict';

/**
 * hospital controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::hospital.hospital', ({ strapi }) => ({
  async create(ctx) {
    
    const response = await super.create(ctx);

    
    if (response.data && ctx.request.body.data.especialidades) {
      const hospitalId = response.data.id;
      const especialidades = ctx.request.body.data.especialidades;

      
      await Promise.all(especialidades.map(async (especialidadeId) => {
        const especialidade = await strapi.db.query('api:especialidade.especialidade').findOne({ where: { id: especialidadeId}});
        if (especialidade) {
          const subdivisionName = `${response.data.attributes.nome} / ${especialidade.nome}`;
          await strapi.db.query('api::lotacao.lotacao').create({
            data: {
              nome: subdivisionName,
              hospital: hospitalId,
              especialidade: especialidadeId
            }
          });
        }
      }));
    }

    return response;
  }
}));