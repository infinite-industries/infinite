import { Sequelize } from 'sequelize'
import { Event } from '../../src/events/models/event.model'
import { Venue } from '../../src/venues/models/venue.model'
import {Model} from "sequelize-typescript";

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

    const sequelize = new Sequelize(process.env.POSTGRES_DB, process.env.POSTGRES_USER, process.env.POSTGRES_PW, {
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
