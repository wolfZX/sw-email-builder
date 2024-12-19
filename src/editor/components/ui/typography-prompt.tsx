'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip';
import { useEffect, useState } from 'react';
import { BaseButton } from '../base-button';
import { HeadingIcon } from 'lucide-react';

type TypographyPromptProps = {
  typography: number;
  onTypographyChange: (typography: number) => void;

  borderColor?: string;
  backgroundColor?: string;
  tooltip?: string;
  className?: string;
};

export function TypographyPrompt(props: TypographyPromptProps) {
  const {
    typography,
    onTypographyChange,
    tooltip,
  } = props;

  const [newTypography, setNewTypography] = useState(typography);

  useEffect(() => {
    setNewTypography(typography);
  }, [typography]);

  const handleTypographyChange = (typography: number) => {
    setNewTypography(typography);
  };

  const handleApplyTypography = () => {
    // HACK: This is a workaround for a bug in tiptap
    // https://github.com/ueberdosis/tiptap/issues/3580
    //
    //     ERROR: flushSync was called from inside a lifecycle
    //
    // To fix this, we need to make sure that the onChange
    // callback is run after the current execution context.
    queueMicrotask(() => {
      onTypographyChange(newTypography);
    });
  };

  const triggerButton = (
    <Dialog.Trigger asChild>
      <BaseButton
          variant="ghost"
          className="!mly-size-7 mly-px-2.5 disabled:mly-cursor-not-allowed"
          size="sm"
          type="button"
        >
          <HeadingIcon className="mly-h-3 mly-w-3 mly-shrink-0 mly-stroke-[2.5]"/>
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
        <div className="mly-min-w-[260px] mly-rounded-xl mly-border mly-bg-white mly-p-4">
          <Dialog.Title className="mly-mb-2 mly-text-md mly-font-medium">Font Styles</Dialog.Title>
          <select
            className="w-full mly-h-auto mly-appearance-none mly-border-0 mly-border-none mly-p-1 mly-text-sm mly-tabular-nums mly-outline-none focus-visible:mly-outline-none"
            value={newTypography}
            onChange={(e) => handleTypographyChange(Number(e.target.value))}
          >
            <option value={1}>Heading 1</option>
            <option value={2}>Heading 2</option>
            <option value={3}>Heading 3</option>
            <option value={0}>Paragraph</option>
          </select>
          <div className="mly-flex mly-justify-end mly-mt-4 mly-gap-3">
            <Dialog.Close asChild>
              <BaseButton variant="default" size="sm" type="button" onClick={handleApplyTypography}>
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
