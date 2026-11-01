
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsIP,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { ServerStatus } from '@prisma/client';

export class CreateServerDto {
  @ApiProperty({ example: 'a UUID of an existing environment' })
  @IsUUID()
  environmentId: string;

  @ApiProperty({ example: 'web-server-01' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: 'AWS' })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  provider: string;

  @ApiProperty({ example: 'eu-west-1' })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  region: string;

  @ApiPropertyOptional({ example: 'web-server-01.example.com' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  hostname?: string;

  @ApiPropertyOptional({ example: '10.0.1.10' })
  @IsOptional()
  @IsIP()
  ipAddress?: string;

  @ApiPropertyOptional({ example: 'Red Hat Enterprise Linux 9' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  operatingSystem?: string;

  @ApiProperty({ example: 4 })
  @IsInt()
  @Min(1)
  @Max(256)
  cpuCores: number;

  @ApiProperty({ example: 8 })
  @IsInt()
  @Min(1)
  @Max(4096)
  ramGb: number;

  @ApiProperty({ example: 100 })
  @IsInt()
  @Min(1)
  @Max(100000)
  storageGb: number;

  @ApiPropertyOptional({ enum: ServerStatus, example: ServerStatus.ONLINE })
  @IsOptional()
  @IsEnum(ServerStatus)
  status?: ServerStatus;
}
