import { Module } from '@nestjs/common';
import { SummarizationService } from './summarization.service';
import { SummarizationController } from './SummarizationController';

@Module({
  controllers: [SummarizationController],
  providers: [SummarizationService],
})
export class SummarizationModule {}
