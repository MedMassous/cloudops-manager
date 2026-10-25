import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getStatus() {
    return {
      name: 'CloudOps Manager API',
      status: 'running',
    };
  }
}
