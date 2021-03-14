import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/sequelize";
import {UserModel} from "./models/user.model";
import NewUser from "./dto/new-user";
import {v4 as uuidv4} from 'uuid';

@Injectable()
export default class UsersService{
    constructor(
        @InjectModel(UserModel) private usersModel: typeof UserModel) {}

    async ensureByName(user: NewUser): Promise<UserModel> {
        const name = user.name

        const userToInsert = {
            ...user,
            id: uuidv4()
        }

        return this.usersModel.findOrCreate({ where: { name }, defaults: userToInsert })
            .then(resp => resp[0])
    }
}

