"use strict";

/**
 * dividendo controller
 */

const { createCoreController } = require("@strapi/strapi").factories;
const medico = 2;
const administrador = 1;
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
        
        async find(ctx) {
            const user = ctx.state.user;
            console.log(ctx.state);
            let response;
    
            if (!user || !user.role) {
              return ctx.badRequest("USUÁRIO NÃO CADASTRADO PARA VISUALIZAR OS DIVIDENDOS");
            }
        
            if (user.role.id === medico) { 
                response = await strapi.entityService.findMany('api::dividendo.dividendo',{
                    filters: {
                        ...ctx.query.filters,
                        user: user['id'],
                    },
                })
            } else if (user.role.id === administrador) {
                response = await strapi.entityService.findMany('api::dividendo.dividendo',{
                    filters: {
                        ...ctx.query.filters,
                    },
                })
            }
        
            console.log('response' + response);
            return response;
          },        
    })
);
