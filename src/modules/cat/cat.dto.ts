import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString } from 'class-validator';
export class CreateCatDto {
  @IsString()
  @ApiProperty({ description: '猫猫的名字' })
  readonly name: string;

  @ApiPropertyOptional({ description: '猫猫的头像' })
  readonly avatar?: string;
}
