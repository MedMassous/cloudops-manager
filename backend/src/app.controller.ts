import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Get API status' })
  @ApiOkResponse({ description: 'API identity and status' })
  getStatus() {
    return this.appService.getStatus();
  }

  @Get('health')
  @ApiOperation({ summary: 'Check API health' })
  getHealth() {
    return { status: 'ok', service: 'cloudops-manager-api' };
  }
}
