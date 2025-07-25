import swaggerJSDoc from "swagger-jsdoc";
import * as swaggerUi from "swagger-ui-express"
import config from "../config/config";

const options: swaggerJSDoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Contract SIMS PPOB',
            version: '1.0.0',
            description: 'API Assignment PT. Nutech Integrasi'
        },
        servers: [
            {
                url: `${config.APP_HOST}:${config.APP_PORT}`,
                description: 'Local server',
            }
        ]
    },
    apis: ['src/modules/**/routes/*.routes.ts'],
}

const specs = swaggerJSDoc(options)

export { swaggerUi, specs }