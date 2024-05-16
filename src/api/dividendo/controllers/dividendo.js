"use strict";

/**
 * dividendo controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::dividendo.dividendo",
  ({ strapi }) => ({
    async create(ctx) {
      
      const resposta = await super.create(ctx);

      if (resposta.data && resposta.data.attributes) {
        const { valor_bruto, desconto } = resposta.data.attributes;

        const valor_liquido = parseFloat(valor_bruto * ((100 - desconto) / 100)).toFixed(2);

        await strapi.db.query("api::dividendo.dividendo").update({
          where: { id: resposta.data.id },
          data: {
            valor_liquido: valor_liquido,
          },
        });

        resposta.data.attributes.valor_liquido = valor_liquido;
      }
      return resposta;
    },
  })
);
