import { Controller, Get, Res, Sse } from '@nestjs/common';
import { Response } from 'express';
import { renderWithLayout } from '../../common/render';
import { CommonDataService } from '../../common/common-data.service';
import { PAGE_TITLES } from '../../config/constants';
import { RatingService } from './rating.service';
import { map, Observable } from 'rxjs';
import { EventEmitter } from 'events';


const ratingChangeEmitter = new EventEmitter();

@Controller('rating')
export class RatingController {
  constructor(
    private readonly commonDataService: CommonDataService,
    private readonly ratingService: RatingService,
  ) {}

  @Get()
  async rating(@Res() res: Response) {
    const commonData = this.commonDataService.getCommonTemplateData();

    const menPersonalRating = await this.ratingService.getMenPersonalRating();
    const womenPersonalRating = await this.ratingService.getWomenPersonalRating();
    const menUniversityRating = await this.ratingService.getMenUniversityRating();
    const womenUniversityRating = await this.ratingService.getWomenUniversityRating();

    const data = {
      title: PAGE_TITLES.RATING,
      ...commonData,
      menPersonalRating,
      womenPersonalRating,
      menUniversityRating,
      womenUniversityRating,
      ratingToggleScript: true
    };

    renderWithLayout(res, 'rating', data);
  }

  @Sse('changes')
  ratingChanges(): Observable<MessageEvent> {
    return new Observable((subscriber) => {
      const onRatingChange = (data) => {
        subscriber.next({ data });
      };

      ratingChangeEmitter.on('ratingChange', onRatingChange);

      return () => {
        ratingChangeEmitter.off('ratingChange', onRatingChange);
      };
    }).pipe(
      map((eventData): MessageEvent => {
        return {
          data: eventData,
          type: 'message',
          lastEventId: '',
        } as MessageEvent;
      })
    );
  }

  static notifyRatingChange(changeData: any) {
    ratingChangeEmitter.emit('ratingChange', changeData);
  }
}