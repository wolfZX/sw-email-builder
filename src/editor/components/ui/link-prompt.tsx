import { Link, LucideIcon } from "lucide-react";
import * as Dialog from '@radix-ui/react-dialog';
import { Editor } from "@tiptap/core";
import { useEffect, useState } from "react";
import { SVGIcon } from "../icons/grid-lines";
import { BaseButton } from "../base-button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

type LinkPromptProps = {
  icon?: LucideIcon | SVGIcon;
  title?: string;
  type?: 'text' | 'image' | 'image_external_link';
  linkUrl: string;
  editor: Editor;
  tooltip?: string;
  isLogoActive?: boolean;
  onCommand?: (url?: string) => void;
};

export function LinkPrompt(props: LinkPromptProps) {
  const {
    icon = Link,
    linkUrl,
    editor,
    tooltip,
    title = 'URL',
    type = 'text',
    isLogoActive,
    onCommand,
  } = props;
  const [inputValue, setInputValue] = useState(linkUrl || '');

  useEffect(() => {
    setInputValue(linkUrl || '');
  }, [linkUrl]);

  const handleSubmit = (e: React.FormEvent) => {
    if (onCommand) {
      onCommand(inputValue);
      return;
    }

    if (inputValue === null || inputValue === undefined) {
      return;
    }

    if (type === 'text' && inputValue === '') {
      editor?.chain().focus().extendMarkRange('link').unsetLink().run();
    } else if (type === 'text' && inputValue) {
      editor?.chain().focus().extendMarkRange('link').setLink({ href: inputValue }).run();
    } else if (type === 'image') {
      if (isLogoActive) {
        editor?.chain().setLogoAttributes({ src: inputValue }).run();
      } else {
        editor?.chain().updateAttributes('image', { src: inputValue }).run();
      }
    } else if (type === 'image_external_link') {
      editor?.chain()
        .setLink({ href: inputValue })
        .run();
    }
  };

  const Icon = icon;

  const triggerButton = (
    <Dialog.Trigger asChild>
      <BaseButton
        variant="ghost"
        className="!mly-size-7 mly-px-2.5 disabled:mly-cursor-not-allowed"
        size="sm"
        type="button"
        data-state={!!linkUrl}
      >
        <Icon className="mly-h-3 mly-w-3 mly-shrink-0 mly-stroke-[2.5]" />
      </BaseButton>
    </Dialog.Trigger>
  );

  return (
    <Dialog.Root>
      {tooltip ? (
        <Tooltip>
          <TooltipTrigger asChild>{triggerButton}</TooltipTrigger>
          <TooltipContent sideOffset={8}>{tooltip}</TooltipContent>
        </Tooltip>
      ) : (
        triggerButton
      )}
      
      <Dialog.Portal>
        <Dialog.Overlay className="mly-fixed mly-inset-0 mly-bg-black/50 mly-z-[99999]" />
        <Dialog.Content
          style={{ zIndex: 999999 }}
          className="mly-fixed mly-left-1/2 mly-top-1/2 mly-transform mly--translate-x-1/2 mly--translate-y-1/2"
          aria-describedby={undefined}
        >
          <div className="min-w-[300px] mly-rounded-xl mly-border mly-bg-white mly-p-4">
            <Dialog.Title className="mly-mb-2 mly-text-md mly-font-medium">{title}</Dialog.Title>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="mly-w-full mly-p-2 mly-border mly-rounded mly-mb-4 mly-h-[35px]"
                placeholder="https://example.com"
                autoFocus
              />
              <div className="mly-flex mly-justify-end mly-mt-4 mly-gap-3">
                <Dialog.Close asChild>
                  <BaseButton variant="default" size="sm" type="button" onClick={handleSubmit}>
                    Confirm
                  </BaseButton>
                </Dialog.Close>
                <Dialog.Close asChild>
                  <BaseButton variant="secondary" size="sm" type="button">
                    Cancel
                  </BaseButton>
                </Dialog.Close>
                </div>
            </form>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
