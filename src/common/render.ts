import { Response } from 'express';
import { Logger } from '@nestjs/common';

const logger = new Logger('Controller');

/**
 * Функция для рендеринга контента внутри общего шаблона
 * @param res - Express Response объект
 * @param view - Имя представления (без префикса 'content/')
 * @param data - Данные для передачи в шаблон
 */
export function renderWithLayout(res: Response, view: string, data: any): void {
  const contentView = `content/${view}`;

  res.app.render(contentView, data, (err, contentHtml) => {
    if (err) {
      logger.error(`Error rendering template ${contentView}: ${err.message}`);
      return res.status(500).send('Error rendering content template');
    }
    res.render('layout', { ...data, content: contentHtml });
    logger.log(`Content rendered: ${contentView}`);
  });
}