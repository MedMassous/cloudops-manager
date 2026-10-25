import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
      include: { role: true },
    });
    if (!user?.isActive || !(await compare(dto.password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = { sub: user.id, email: user.email, role: user.role.name };
    return { accessToken: await this.jwt.signAsync(payload), user: { id: user.id, email: user.email, fullName: user.fullName, role: user.role.name } };
  }

  async me(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, fullName: true, isActive: true, role: { select: { name: true } } },
    });
  }
}
