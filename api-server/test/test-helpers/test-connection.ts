import { Sequelize } from 'sequelize'
import {POSTGRES_DB, POSTGRES_PW, POSTGRES_USER} from "../../src/constants";

const DB_DIALECT = 'postgres'

let cache = null

// export interface  SequelizeWithModels {
//     [key: string]: Model<unknown>
//     sequelize: typeof Sequelize
// }

export default function getConnection(
    host: string,
    port: number
): Sequelize {
    if (cache !== null) {
        return  cache
    }

    const sequelize = new Sequelize(POSTGRES_DB, POSTGRES_USER, POSTGRES_PW, {
        host,
        port,
        dialect: DB_DIALECT,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        logging: false
    })

    cache = sequelize

    return sequelize
};
