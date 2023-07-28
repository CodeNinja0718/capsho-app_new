import {
  biArrowReturnLeft,
  biArrowReturnRight,
  biDropletFill,
  biEmojiSmile,
  biImage,
  biListOl,
  biListUl,
  biTextParagraph,
  biQuote,
  biTypeH1,
  biTypeH2,
  biTypeH3
} from '@quasar/extras/bootstrap-icons'

export interface IconsOptions {
  blockQuote: string
  color: string
  h1: string
  h2: string
  h3: string
  h4?: string
  h5?: string
  image: string
  p: string
  redo: string
  undo: string
}

export const menuIcons: IconsOptions = {
  blockQuote: biQuote,
  color: biDropletFill,
  h1: biTypeH1,
  h2: biTypeH2,
  h3: biTypeH3,
  image: biImage,
  p: biTextParagraph,
  redo: biArrowReturnRight,
  undo: biArrowReturnLeft
}

export interface SlashMenuIcons extends IconsOptions {
  ol: string
  ul: string
}
export const slashMenuItems: SlashMenuIcons = {
  ...menuIcons,
  ol: biListOl,
  ul: biListUl
}

const defaultIcon = biEmojiSmile

export function get(iconName: keyof SlashMenuIcons): string {
  return slashMenuItems[iconName] ?? defaultIcon
}
