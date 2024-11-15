'use client';

import { HexColorPicker, HexColorInput } from 'react-colorful';
import * as Dialog from '@radix-ui/react-dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip';
import { cn } from '@/editor/utils/classname';
import { ReactNode, useEffect, useState } from 'react';
import { BaseButton } from '../base-button';

type ColorPickerPromptProps = {
  color: string;
  onColorChange: (color: string) => void;

  borderColor?: string;
  backgroundColor?: string;
  tooltip?: string;
  className?: string;

  children?: ReactNode;
};

export function ColorPickerPrompt(props: ColorPickerPromptProps) {
  const {
    color,
    onColorChange,
    borderColor,
    backgroundColor,
    tooltip,
    className,

    children,
  } = props;

  const [newColor, setNewColor] = useState(color);

  useEffect(() => {
    setNewColor(color);
  }, [color]);

  const handleColorChange = (color: string) => {
    setNewColor(color);
  };

  const handleApplyColor = () => {
    // HACK: This is a workaround for a bug in tiptap
    // https://github.com/ueberdosis/tiptap/issues/3580
    //
    //     ERROR: flushSync was called from inside a lifecycle
    //
    // To fix this, we need to make sure that the onChange
    // callback is run after the current execution context.
    queueMicrotask(() => {
      onColorChange(newColor);
    });
  };

  const triggerButton = (
    <Dialog.Trigger asChild>
      {children || (
        <BaseButton
          variant="ghost"
          className="!mly-size-7 mly-shrink-0"
          size="sm"
          type="button"
        >
          <div
            className={cn(
              'mly-h-4 mly-w-4 mly-shrink-0 mly-rounded mly-border-2 mly-border-gray-700',
              className
            )}
            style={{
              ...(borderColor ? { borderColor } : {}),
              backgroundColor: backgroundColor || 'transparent',
            }}
          />
        </BaseButton>
      )}
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
        <div className="mly-min-w-[260px] mly-rounded-xl mly-border mly-bg-white mly-p-4">
          <Dialog.Title className="mly-mb-2 mly-text-md mly-font-medium">Custom Color</Dialog.Title>
            <HexColorPicker
              color={color}
              onChange={handleColorChange}
              className="mly-flex !mly-w-full mly-flex-col mly-gap-4"
            />
            <HexColorInput
              alpha={true}
              color={color}
              onChange={handleColorChange}
              className="mly-mt-4 mly-w-full mly-min-w-0 mly-rounded-lg mly-border mly-px-2 mly-py-1.5 mly-text-sm mly-uppercase focus-visible:mly-border-gray-400 focus-visible:mly-outline-none"
              prefixed
            />
          <div className="mly-flex mly-justify-end mly-mt-4 mly-gap-3">
            <Dialog.Close asChild>
              <BaseButton variant="default" size="sm" type="button" onClick={handleApplyColor}>
                Apply
              </BaseButton>
            </Dialog.Close>
            <Dialog.Close asChild>
              <BaseButton variant="secondary" size="sm" type="button">
                Cancel
              </BaseButton>
            </Dialog.Close>
          </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
