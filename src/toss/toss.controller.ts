import { Controller, Post, Body, Get, Res } from '@nestjs/common';
import { TossService } from './toss.service';
import { Response } from 'express';
import { CreateTossDto } from './dto/create-toss.dto';

@Controller()
export class TossController {
  constructor(private readonly tossService: TossService) {}

  @Post('/confirm') 
  async successPayment(
    @Body() createTossDto: CreateTossDto,
    @Res() res: Response,
  ) {
    console.log('createPayDto: ', createTossDto);

    const result = await this.tossService.confirmPayment(createTossDto);
    console.log('result: ', result.status);
    res.status(result.status).json(result.data);
  }
}
