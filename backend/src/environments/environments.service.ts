
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEnvironmentDto } from './dto/create-environment.dto';
import { UpdateEnvironmentDto } from './dto/update-environment.dto';

@Injectable()
export class EnvironmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(page = 1, limit = 20) {
    const safePage = Math.max(1, page || 1);
    const safeLimit = Math.min(100, Math.max(1, limit || 20));

    const [data, total] = await this.prisma.$transaction([
      this.prisma.environment.findMany({
        skip: (safePage - 1) * safeLimit,
        take: safeLimit,
        orderBy: { name: 'asc' },
        include: {
          project: true,
          _count: {
            select: { servers: true },
          },
        },
      }),
      this.prisma.environment.count(),
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
    const environment = await this.prisma.environment.findUnique({
      where: { id },
      include: {
        project: true,
        servers: true,
      },
    });

    if (!environment) {
      throw new NotFoundException('Environment not found');
    }

    return environment;
  }

  async create(dto: CreateEnvironmentDto) {
    await this.ensureProjectExists(dto.projectId);

    try {
      return await this.prisma.environment.create({
        data: {
          name: dto.name,
          type: dto.type,
          project: {
            connect: { id: dto.projectId },
          },
        },
        include: {
          project: true,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'An environment with this name already exists in this project',
        );
      }

      throw error;
    }
  }

  async update(id: string, dto: UpdateEnvironmentDto) {
    await this.ensureExists(id);

    if (dto.projectId) {
      await this.ensureProjectExists(dto.projectId);
    }

    const { projectId, ...environmentData } = dto;

    try {
      return await this.prisma.environment.update({
        where: { id },
        data: {
          ...environmentData,
          ...(projectId
            ? {
                project: {
                  connect: { id: projectId },
                },
              }
            : {}),
        },
        include: {
          project: true,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'An environment with this name already exists in this project',
        );
      }

      throw error;
    }
  }

  private async ensureExists(id: string) {
    const environment = await this.prisma.environment.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!environment) {
      throw new NotFoundException('Environment not found');
    }
  }

  private async ensureProjectExists(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!project) {
      throw new BadRequestException('Project not found');
    }
  }
}
