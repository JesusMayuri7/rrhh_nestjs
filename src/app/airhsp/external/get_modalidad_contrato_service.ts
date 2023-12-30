import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { AirhspData } from '@prisma/client';

@Injectable()
export class GetModalidadContratoService {
    constructor(private readonly prismaService: PrismaService) {}

async getAirhsp() {
    return await this.prismaService.modalidadContrato.findMany();
}
}