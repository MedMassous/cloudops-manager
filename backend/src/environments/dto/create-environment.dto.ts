
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

export class CreateEnvironmentDto {
  @ApiProperty({ example: 'a7447a8d-5396-4276-a6ce-f51e15de4c89' })
  @IsUUID()
  projectId: string;

  @ApiProperty({ example: 'Production' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: 'PRODUCTION' })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  type: string;
}
