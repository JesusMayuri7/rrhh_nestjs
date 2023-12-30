import { AirhspRepositoryInterface } from './airhsp_repository';

export class GetAirhspUsecase {

    constructor(private airhspRepository: AirhspRepositoryInterface) {}

    async execute():Promise<any> {
        
        return await this.airhspRepository.getAirhsp();
    }
}