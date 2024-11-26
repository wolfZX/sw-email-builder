import { button, linkCard } from '@/blocks/button';
import { createImageBlock, createLogoBlock, ImageConfig } from '@/blocks/image';
import { columns, forLoop, section, spacer } from '@/blocks/layout';
import { bulletList, orderedList } from '@/blocks/list';
import { BlockItem } from '@/blocks/types';
import {
  blockquote,
  clearLine,
  footer,
  hardBreak,
  heading1,
  heading2,
  heading3,
  text,
} from '@/blocks/typography';

export const createDefaultSlashCommands = (config?: {
  imageConfig?: ImageConfig;
}): BlockItem[] => [
  text,
  heading1,
  heading2,
  heading3,
  bulletList,
  orderedList,
  createImageBlock(config?.imageConfig),
  createLogoBlock(config?.imageConfig),
  columns,
  section,
  forLoop,
  spacer,
  button,
  linkCard,
  hardBreak,
  blockquote,
  footer,
  clearLine,
];

export const DEFAULT_SLASH_COMMANDS = createDefaultSlashCommands();
