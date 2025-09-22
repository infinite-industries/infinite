import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserModel } from './models/user.model';
import { PartnerModel } from './models/partner.model';
import NewUser from './dto/new-user';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export default class UsersService {
  constructor(@InjectModel(UserModel) private usersModel: typeof UserModel) {}

  async ensureByName(user: NewUser): Promise<UserModel> {
    const name = user.name;

    const userToInsert = {
      ...user,
      id: uuidv4(),
    };

    return this.usersModel
      .findOrCreate({ 
        where: { name }, 
        defaults: userToInsert,
        include: [
          {
            model: PartnerModel,
            as: 'partners',
            through: { attributes: [] }, // Exclude join table attributes
          },
        ],
      })
      .then((resp) => resp[0]);
  }
}
