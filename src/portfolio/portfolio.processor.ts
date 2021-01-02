import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

@Processor('portfolio')
export class LoadPortfolioJob {
  private readonly logger = new Logger(LoadPortfolioJob.name);

  @Process('load')
  load(job: Job) {
    this.logger.debug('Start transcoding...');
    this.logger.debug(job.data);
    this.logger.debug('Transcoding completed');
  }
}