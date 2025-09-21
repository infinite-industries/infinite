import { Injectable } from '@nestjs/common';
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
    return this.partnersModel.create({
      id: v4(),
      name: createPartnerRequest.name,
      logo_url: createPartnerRequest.logo_url || null,
    });
  }
}
