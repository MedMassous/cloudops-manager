
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServerDto } from './dto/create-server.dto';
import { UpdateServerDto } from './dto/update-server.dto';

@Injectable()
export class ServersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(page = 1, limit = 20, search = '') {
    const safePage = Math.max(1, page || 1);
    const safeLimit = Math.min(100, Math.max(1, limit || 20));

    const where: Prisma.ServerWhereInput = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { provider: { contains: search, mode: 'insensitive' } },
            { region: { contains: search, mode: 'insensitive' } },
            { hostname: { contains: search, mode: 'insensitive' } },
            { ipAddress: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    const [data, total] = await this.prisma.$transaction([
      this.prisma.server.findMany({
        where,
        skip: (safePage - 1) * safeLimit,
        take: safeLimit,
        orderBy: { name: 'asc' },
        include: {
          environment: {
            include: {
              project: true,
            },
          },
        },
      }),
      this.prisma.server.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page: safePage,
        limit: safeLimit,
      },
    };
  }

  async findOne(id: string) {
    const server = await this.prisma.server.findUnique({
      where: { id },
      include: {
        environment: {
          include: {
            project: true,
          },
        },
      },
    });

    if (!server) {
      throw new NotFoundException('Server not found');
    }

    return server;
  }

  async create(dto: CreateServerDto) {
    await this.ensureEnvironmentExists(dto.environmentId);

    try {
      return await this.prisma.server.create({
        data: {
          name: dto.name,
          provider: dto.provider,
          region: dto.region,
          hostname: dto.hostname,
          ipAddress: dto.ipAddress,
          operatingSystem: dto.operatingSystem,
          cpuCores: dto.cpuCores,
          ramGb: dto.ramGb,
          storageGb: dto.storageGb,
          status: dto.status,
          environment: {
            connect: { id: dto.environmentId },
          },
        },
        include: {
          environment: {
            include: {
              project: true,
            },
          },
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'A server with this name already exists in this environment',
        );
      }

      throw error;
    }
  }

  async update(id: string, dto: UpdateServerDto) {
    await this.ensureExists(id);

    if (dto.environmentId) {
      await this.ensureEnvironmentExists(dto.environmentId);
    }

    const { environmentId, ...serverData } = dto;

    try {
      return await this.prisma.server.update({
        where: { id },
        data: {
          ...serverData,
          ...(environmentId
            ? {
                environment: {
                  connect: { id: environmentId },
                },
              }
            : {}),
        },
        include: {
          environment: {
            include: {
              project: true,
            },
          },
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'A server with this name already exists in this environment',
        );
      }

      throw error;
    }
  }

  async remove(id: string) {
    await this.ensureExists(id);

    return this.prisma.server.delete({
      where: { id },
    });
  }

  private async ensureExists(id: string) {
    const server = await this.prisma.server.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!server) {
      throw new NotFoundException('Server not found');
    }
  }

  private async ensureEnvironmentExists(id: string) {
    const environment = await this.prisma.environment.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!environment) {
      throw new BadRequestException('Environment not found');
    }
  }
}
