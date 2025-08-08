import { MessageCommon } from './message-common';

/**
 * LINE Emoji IDs(可用 ID：001 ~ 009)
 *
 * 取前面十種常用的編號
 */
type Emojis = ['001', '002', '003', '004', '005', '006', '007', '008', '009'];

/**
 * LINE Emoji Project IDs
 * - 表情符號系列(可愛臉部表情)：670e0cce840a8236ddd4ee4c
 * - 派對帽、蛋糕、禮物等慶祝主題：5ac2213e040ab15980c9b447
 * - 彩色英文字母 A~I：5ac21a8c040ab15980c9b43f
 * - 日文平假名 あ〜け：5ac21c4e031a6752fb806d5b
 * - 手勢系列（讚、揮手、握拳等）：5ac21e6c040ab15980c9b444
 * - 各式愛心表情符號臉：5ac1bf65040ab15980c9b435
 * - 天氣相關（雲、雨、雷、晴等）：5ac22e58040ab15980c9b44f
 * - 椅子、沙發、燈等室內家具：5ac22775040ab15980c9b44c
 * - 各種臉孔與髮型變化：5ac2197b040ab15980c9b43d
 * - 社交生活風格（音樂、化妝、派對）：5ac21c9a031a6752fb806d65
 *
 * 取前面十種常用的編號
 */
type ProjectIds = [
  '670e0cce840a8236ddd4ee4c',
  '5ac2213e040ab15980c9b447',
  '5ac21a8c040ab15980c9b43f',
  '5ac21c4e031a6752fb806d5b',
  '5ac21e6c040ab15980c9b444',
  '5ac1bf65040ab15980c9b435',
  '5ac22e58040ab15980c9b44f',
  '5ac22775040ab15980c9b44c',
  '5ac2197b040ab15980c9b43d',
  '5ac21c9a031a6752fb806d65',
];

export type TextMessageReq = MessageCommon & {
  text: string;
  emoji?: {
    index: number;
    productId: ProjectIds[number];
    emojiId: Emojis[number];
  };
};
