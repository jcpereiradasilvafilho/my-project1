'use strict';

/**
 * banco service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::banco.banco');
