
import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RoleName } from '@prisma/client';
import { Roles } from '../common/roles.decorator';
import { RolesGuard } from '../common/roles.guard';
import { CreateEnvironmentDto } from './dto/create-environment.dto';
import { UpdateEnvironmentDto } from './dto/update-environment.dto';
import { EnvironmentsService } from './environments.service';

@ApiTags('Environments')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('environments')
export class EnvironmentsController {
  constructor(private readonly environments: EnvironmentsService) {}

  @Get()
  @Roles(RoleName.ADMIN, RoleName.DEVOPS, RoleName.VIEWER)
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.environments.findAll(Number(page), Number(limit));
  }

  @Get(':id')
  @Roles(RoleName.ADMIN, RoleName.DEVOPS, RoleName.VIEWER)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.environments.findOne(id);
  }

  @Post()
  @Roles(RoleName.ADMIN, RoleName.DEVOPS)
  create(@Body() dto: CreateEnvironmentDto) {
    return this.environments.create(dto);
  }

  @Patch(':id')
  @Roles(RoleName.ADMIN, RoleName.DEVOPS)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateEnvironmentDto,
  ) {
    return this.environments.update(id, dto);
  }
}
