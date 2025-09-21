import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PartnerModel } from './models/partner.model';
import { CreatePartnerRequest } from './dto/create-partner-request';
import { v4 } from 'uuid';

@Injectable()
export class PartnersService {
  constructor(
    @InjectModel(PartnerModel) private partnersModel: typeof PartnerModel,
  ) {}

  async findAll(): Promise<PartnerModel[]> {
    return this.partnersModel.findAll({
      order: [['createdAt', 'ASC']],
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
}
