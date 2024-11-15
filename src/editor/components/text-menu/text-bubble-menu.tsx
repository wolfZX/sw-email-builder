import { BubbleMenu, BubbleMenuProps } from '@tiptap/react';
import {
  BoldIcon,
  CodeIcon,
  ItalicIcon,
  List,
  ListOrdered,
  Link,
  LucideIcon,
  StrikethroughIcon,
  UnderlineIcon,
  LanguagesIcon,
} from 'lucide-react';
import { BubbleMenuButton } from '../bubble-menu-button';
import { ColorPicker } from '../ui/color-picker';
import { BaseButton } from '../base-button';
import { useTextMenuState } from './use-text-menu-state';
import { isCustomNodeSelected } from '@/editor/utils/is-custom-node-selected';
import { isTextSelected } from '@/editor/utils/is-text-selected';
import { TooltipProvider } from '../ui/tooltip';
import { LinkInputPopover } from '../ui/link-input-popover';
import { Divider } from '../ui/divider';
import { AlignmentSwitch } from '../alignment-switch';
import { SVGIcon } from '../icons/grid-lines';
import { useState } from 'react';
import { LinkPrompt } from '../ui/link-prompt';
import { ColorPickerPrompt } from '../ui/color-picker-prompt';

export interface BubbleMenuItem {
  name?: string;
  isActive?: () => boolean;
  command?: () => void;
  shouldShow?: () => boolean;
  icon?: LucideIcon | SVGIcon;
  className?: string;
  iconClassName?: string;
  nameClassName?: string;
  disbabled?: boolean;

  tooltip?: string;
}

export type EditorBubbleMenuProps = Omit<BubbleMenuProps, 'children'> & {
  appendTo?: React.RefObject<any>;
};

export function TextBubbleMenu(props: EditorBubbleMenuProps) {
  const { editor, appendTo } = props;

  if (!editor) {
    return null;
  }

  const items: BubbleMenuItem[] = [
    {
      name: 'bold',
      isActive: () => editor?.isActive('bold')!,
      command: () => editor?.chain().focus().toggleBold().run()!,
      icon: BoldIcon,
      tooltip: 'Bold',
    },
    {
      name: 'italic',
      isActive: () => editor?.isActive('italic')!,
      command: () => editor?.chain().focus().toggleItalic().run()!,
      icon: ItalicIcon,
      tooltip: 'Italic',
    },
    {
      name: 'underline',
      isActive: () => editor?.isActive('underline')!,
      command: () => editor?.chain().focus().toggleUnderline().run()!,
      icon: UnderlineIcon,
      tooltip: 'Underline',
    },
    {
      name: 'strike',
      isActive: () => editor?.isActive('strike')!,
      command: () => editor?.chain().focus().toggleStrike().run()!,
      icon: StrikethroughIcon,
      tooltip: 'Strikethrough',
    },
    {
      name: 'code',
      isActive: () => editor?.isActive('code')!,
      command: () => editor?.chain().focus().toggleCode().run()!,
      icon: CodeIcon,
      tooltip: 'Code',
    },
    {
      name: 'translate',
      isActive: () => editor?.isActive('translate')!,
      command: () => editor?.chain().focus().toggleTranslate().run()!,
      icon: LanguagesIcon,
      tooltip: 'Translate',
    },
  ];

  const state = useTextMenuState(editor);

  const bubbleMenuProps: EditorBubbleMenuProps = {
    ...props,
    ...(appendTo ? { appendTo: appendTo.current } : {}),
    pluginKey: 'textMenu',
    shouldShow: ({ editor, state, from, to, view }) => {
      if (!view || editor.view.dragging) {
        return false;
      }

      const domAtPos = view.domAtPos(from || 0).node as HTMLElement;
      const nodeDOM = view.nodeDOM(from || 0) as HTMLElement;
      const node = nodeDOM || domAtPos;

      if (isCustomNodeSelected(editor, node)) {
        return false;
      }

      return isTextSelected(editor);
    },
    tippyOptions: {
      popperOptions: {
        placement: 'top-start',
        modifiers: [
          {
            name: 'preventOverflow',
            options: {
              boundary: 'viewport',
              padding: 8,
            },
          },
          {
            name: 'flip',
            options: {
              fallbackPlacements: ['bottom-start', 'top-end', 'bottom-end'],
            },
          },
        ],
      },
      maxWidth: '100%',
      interactive: true,
      hideOnClick: false,
    },
  };

  // NOTE: BubbleMenu have issue if want to apply button to open another popover
  return (
    <BubbleMenu
      {...bubbleMenuProps}
      className="mly-flex mly-gap-1 mly-rounded-lg mly-border mly-border-slate-200 mly-bg-white mly-p-0.5 mly-shadow-md"
    >
      <TooltipProvider>
        {items.map((item, index) => (
          <BubbleMenuButton key={index} {...item} />
        ))}

        <AlignmentSwitch
          alignment={state.textAlign}
          onAlignmentChange={(alignment) => {
            editor?.chain().focus().setTextAlign(alignment).run();
          }}
        />

        {!state.isListActive && (
          <>
            <BubbleMenuButton
              icon={List}
              command={() => {
                editor.chain().focus().toggleBulletList().run();
              }}
              tooltip="Bullet List"
            />
            <BubbleMenuButton
              icon={ListOrdered}
              command={() => {
                editor.chain().focus().toggleOrderedList().run();
              }}
              tooltip="Ordered List"
            />
          </>
        )}

        {/* TODO: Disabled until have fix when use with Bubble Menu*/}
        {/* <LinkInputPopover
          editor={editor}
          defaultValue={state?.linkUrl ?? ''}
          onValueChange={(value) => {
            if (!value) {
              editor?.chain().focus().extendMarkRange('link').unsetLink().run();
              return;
            }

            editor
              ?.chain()
              .extendMarkRange('link')
              .setLink({ href: value })
              .run()!;
          }}
          tooltip="External URL"
        /> */}
        <LinkPrompt
          linkUrl={state?.linkUrl ?? ''}
          editor={editor}
          tooltip="External URL"
        />

        <Divider />

        {/* TODO: Disabled until have fix when use with Bubble Menu*/}
        {/* <ColorPicker
          color={state.currentTextColor}
          onColorChange={(color) => {
            editor?.chain().setColor(color).run();
          }}
          tooltip="Text Color"
        >
          <BaseButton
            variant="ghost"
            size="sm"
            type="button"
            className="!mly-h-7 mly-w-7 mly-shrink-0 mly-p-0"
          >
            <div className="mly-flex mly-flex-col mly-items-center mly-justify-center mly-gap-[1px]">
              <span className="mly-font-bolder mly-font-mono mly-text-xs mly-text-slate-700">
                A
              </span>
              <div
                className="mly-h-[2px] mly-w-3"
                style={{ backgroundColor: state.currentTextColor }}
              />
            </div>
          </BaseButton>
        </ColorPicker> */}
        <ColorPickerPrompt
          color={state.currentTextColor}
          onColorChange={(color) => {
            editor?.chain().setColor(color).run();
          }}
          tooltip="Text Color"
        >
          <BaseButton
            variant="ghost"
            size="sm"
            type="button"
            className="!mly-h-7 mly-w-7 mly-shrink-0 mly-p-0"
          >
            <div className="mly-flex mly-flex-col mly-items-center mly-justify-center mly-gap-[1px]">
              <span className="mly-font-bolder mly-font-mono mly-text-xs mly-text-slate-700">
                A
              </span>
              <div
                className="mly-h-[2px] mly-w-3"
                style={{ backgroundColor: state.currentTextColor }}
              />
            </div>
          </BaseButton>
        </ColorPickerPrompt>
      </TooltipProvider>
    </BubbleMenu>
  );
}
