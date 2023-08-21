import {
  Controller,
  Get,
  HttpCode,
  Logger,
  Res,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Response } from 'express';
import { catchError, from, map, throwError } from 'rxjs';
import { AppService } from './app.service';

@Controller('/v1/color')
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService) {}

  @Get()
  @HttpCode(201)
  getHello(@Res({ passthrough: true }) res: Response) {
    this.logger.log('cmd=register');
    return from(this.appService.getHello()).pipe(
      map((it) => {
        res.set('my-custom-header', '1');
        return it;
      }),
      catchError((err) => {
        this.logger.error('deu pau', err);
        return throwError(() => new UnprocessableEntityException(err));
      }),
    );
  }
}
