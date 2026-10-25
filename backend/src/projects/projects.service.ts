import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(page = 1, limit = 20, search = '') {
    const where: Prisma.ProjectWhereInput = search
      ? { OR: [{ name: { contains: search, mode: 'insensitive' } }, { description: { contains: search, mode: 'insensitive' } }] }
      : {};
    const [data, total] = await this.prisma.$transaction([
      this.prisma.project.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { name: 'asc' } }),
      this.prisma.project.count({ where }),
    ]);
    return { data, meta: { total, page, limit } };
  }

  findOne(id: string) {
    return this.prisma.project.findUnique({ where: { id }, include: { environments: true } });
  }

  async create(dto: CreateProjectDto) {
    try {
      return await this.prisma.project.create({ data: dto });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('A project with this name already exists');
      }
      throw error;
    }
  }

  async update(id: string, dto: UpdateProjectDto) {
    await this.ensureExists(id);
    return this.prisma.project.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.ensureExists(id);
    return this.prisma.project.delete({ where: { id } });
  }

  private async ensureExists(id: string) {
    if (!(await this.prisma.project.findUnique({ where: { id }, select: { id: true } }))) {
      throw new NotFoundException('Project not found');
    }
  }
}
