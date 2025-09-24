import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PartnerModel } from './models/partner.model';
import { UserModel } from './models/user.model';
import { CreatePartnerRequest } from './dto/create-partner-request';
import { AssociateUserPartnerRequest } from './dto/associate-user-partner-request';
import { v4 } from 'uuid';

@Injectable()
export class PartnersService {
  constructor(
    @InjectModel(PartnerModel) private partnersModel: typeof PartnerModel,
    @InjectModel(UserModel) private usersModel: typeof UserModel,
  ) {}

  async findAll(): Promise<PartnerModel[]> {
    return this.partnersModel.findAll({
      order: [['createdAt', 'ASC']],
    });
  }

  async findByName(name: string): Promise<PartnerModel | null> {
    return this.partnersModel.findOne({
      where: { name },
    });
  }

  async create(
    createPartnerRequest: CreatePartnerRequest,
  ): Promise<PartnerModel> {
    try {
      return await this.partnersModel.create({
        id: v4(),
        name: createPartnerRequest.name,
        logo_url: createPartnerRequest.logo_url || null,
      });
    } catch (error) {
      // Check if it's a unique constraint violation
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new ConflictException('Partner with this name already exists');
      }
      // Re-throw other errors
      throw error;
    }
  }

  async associateUserWithPartner(
    associateRequest: AssociateUserPartnerRequest,
  ): Promise<void> {
    const { user_id, partner_id } = associateRequest;

    // Find the user with their current partners
    const user = await this.usersModel.findByPk(user_id, {
      include: [
        {
          model: PartnerModel,
          as: 'partners',
          through: { attributes: [] },
        },
      ],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${user_id} not found`);
    }

    // Find the partner
    const partner = await this.partnersModel.findByPk(partner_id);

    if (!partner) {
      throw new NotFoundException(`Partner with ID ${partner_id} not found`);
    }

    // Check if association already exists
    const existingAssociation = user.partners.find((p) => p.id === partner_id);
    if (existingAssociation) {
      throw new ConflictException(
        `User ${user_id} is already associated with partner ${partner_id}`,
      );
    }

    // Create the association using Sequelize's association method
    await (user as any).addPartner(partner);
  }
}
