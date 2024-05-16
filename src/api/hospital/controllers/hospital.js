"use strict";

/**
 * hospital controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::hospital.hospital",
  ({ strapi }) => ({
    async create(ctx) {
      const resposta = await super.create(ctx);

      if (resposta.data && ctx.request.body.data.especialidades) {
        const hospital_id = resposta.data.id;
        const especialidades = ctx.request.body.data.especialidades;

        await Promise.all(
          especialidades.map(async (especialidade_id) => {
            const especialidade = await strapi.db
              .query("api:especialidade.especialidade")
              .findOne({ where: { id: especialidade_id } });
            if (especialidade) {
              const subdivisao_nome = `${resposta.data.attributes.nome} / ${especialidade.nome}`;
              await strapi.db.query("api::lotacao.lotacao").create({
                data: {
                  nome: subdivisao_nome,
                  hospital: hospital_id,
                  especialidade: especialidade_id,
                },
              });
            }
          })
        );
      }
      return resposta;
    },
  })
);
