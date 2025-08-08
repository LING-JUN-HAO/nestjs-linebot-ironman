import { MessageCommon } from './message-common';

/**
 * LINE Sticker Package IDs
 * - Moon: Special Edition（日文: ムーンスペシャル）— 446
 * - Sally: Special Edition（日文: サリースペシャル）— 789
 * - Moon: Special Edition（日文: ムーンスペシャル）— 1070
 * - LINE Characters: Making Amends（日文: LINEキャラクターズの謝罪篇）— 6136
 * - Brown and Cony Fun Size Pack（日文: ちっちゃいブラコニ）— 6325
 * - Brown and Cony Fun Size Pack（泰語版：Brown與Cony 迷你貼圖）— 6359
 * - Brown and Cony Fun Size Pack（繁體中文: 熊大＆兔兔 迷你篇）— 6362
 * - Brown and Cony Fun Size Pack（英日雙語: ちっちゃいブラコニ）— 6370
 * - LINE Characters: Making Amends（繁體中文: LINE卡通明星（專業道歉篇））— 6632
 * - LINE Characters: Pretty Phrases（日文: ゆる敬語★LINEキャラクターズ）— 8515
 */

export const stickerIds = [
  {
    packageId: '446',
    stickerIds: ['1988', '1989', '1990', '1991', '1992'],
  },
  {
    packageId: '789',
    stickerIds: ['10855', '10856', '10857', '10858', '10859'],
  },
  {
    packageId: '1070',
    stickerIds: ['17839', '17840', '17841', '17842', '17843'],
  },
  {
    packageId: '6136',
    stickerIds: ['10551376', '10551377', '10551378', '10551379', '10551380'],
  },
  {
    packageId: '6325',
    stickerIds: ['10979904', '10979905', '10979906', '10979907', '10979908'],
  },
  {
    packageId: '6359',
    stickerIds: ['11069848', '11069849', '11069850', '11069851', '11069852'],
  },
  {
    packageId: '6362',
    stickerIds: ['11087920', '11087921', '11087922', '11087923', '11087924'],
  },
  {
    packageId: '6370',
    stickerIds: ['11088016', '11088017', '11088018', '11088019', '11088020'],
  },
  {
    packageId: '6632',
    stickerIds: ['11825374', '11825375', '11825376', '11825377', '11825378'],
  },
  {
    packageId: '8515',
    stickerIds: ['16581242', '16581243', '16581244', '16581245', '16581246'],
  },
] as const;

export type StickerMap = {
  [K in (typeof stickerIds)[number]['packageId']]: Extract<
    (typeof stickerIds)[number],
    { packageId: K }
  >['stickerIds'][number];
};

export type StickerMessageReq = MessageCommon &
  {
    [K in keyof StickerMap]: {
      packageId: K;
      stickerId: StickerMap[K];
    };
  }[keyof StickerMap];
