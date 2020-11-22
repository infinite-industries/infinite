import {Module} from "@nestjs/common";
import {SequelizeModule} from "@nestjs/sequelize";
import {UsersController} from "./users.controller";
import UsersService from "./users.service";

@Module({
    imports: [
        SequelizeModule.forFeature()
    ],
    controllers: [UsersController],
    providers: [UsersService]
})
export class UsersModules {}
