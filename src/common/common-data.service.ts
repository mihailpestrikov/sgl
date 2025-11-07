import { Global, Injectable } from '@nestjs/common';
import { IMAGES, NAVIGATION, SITE_TEXT } from '../config/constants';

@Global()
@Injectable()
export class CommonDataService {
  /**
   * Получение общих данных для всех шаблонов
   */
  getCommonTemplateData() {
    return {
      bannerImage: IMAGES.BANNER,
      logoImage: IMAGES.LOGO,
      homeLink: NAVIGATION.HOME_LINK,
      navTitle1: SITE_TEXT.NAV_TITLE_1,
      navTitle2: SITE_TEXT.NAV_TITLE_2,
      footerText: SITE_TEXT.FOOTER_TEXT,
      menuItems: NAVIGATION.MENU_ITEMS,
    };
  }
}