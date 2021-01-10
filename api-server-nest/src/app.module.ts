import {Module} from '@nestjs/common';
import {VenuesModule} from "./venues/venues.module";
import {SequelizeModule} from "@nestjs/sequelize";
import {CurrentEventsModule} from "./current-events/current-events.module";
import {AppController} from "./app.controller";
import {EventsModule} from "./events/events.module";
import { ConfigModule } from '@nestjs/config';
import {AnnouncementsModule} from "./announcements/announcements.module";
import {UsersModules} from "./users/users.modules";

require('dotenv').config();

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: [
                '.env.test',
                '.env'
            ]
        }),
        SequelizeModule.forRoot({
            dialect: 'postgres',
            autoLoadModels: true,
            synchronize: true,
            host: process.env.DB_HOST,
            port: +process.env.DB_PORT,
            username: process.env.DB_USER_NAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        }),
        VenuesModule,
        CurrentEventsModule,
        EventsModule,
        AnnouncementsModule,
        UsersModules
    ],
    controllers: [AppController]
})
export class AppModule {}
