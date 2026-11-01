
import {
  Body,
  Controller,
  Delete,
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
import { CreateServerDto } from './dto/create-server.dto';
import { UpdateServerDto } from './dto/update-server.dto';
import { ServersService } from './servers.service';

@ApiTags('Servers')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('servers')
export class ServersController {
  constructor(private readonly servers: ServersService) {}

  @Get()
  @Roles(RoleName.ADMIN, RoleName.DEVOPS, RoleName.VIEWER)
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('search') search = '',
  ) {
    return this.servers.findAll(Number(page), Number(limit), search);
  }

  @Get(':id')
  @Roles(RoleName.ADMIN, RoleName.DEVOPS, RoleName.VIEWER)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.servers.findOne(id);
  }

  @Post()
  @Roles(RoleName.ADMIN, RoleName.DEVOPS)
  create(@Body() dto: CreateServerDto) {
    return this.servers.create(dto);
  }

  @Patch(':id')
  @Roles(RoleName.ADMIN, RoleName.DEVOPS)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateServerDto,
  ) {
    return this.servers.update(id, dto);
  }

  @Delete(':id')
  @Roles(RoleName.ADMIN)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.servers.remove(id);
  }
}
