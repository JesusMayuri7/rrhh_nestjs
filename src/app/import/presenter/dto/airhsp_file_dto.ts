import { Transform } from "class-transformer";
import { IsInt, IsNotEmpty, IsNumber } from "class-validator";

export class AirhspFileDto {

  @IsNotEmpty()
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  modalidadContratoId: Number;

  file:Express.Multer.File
  }