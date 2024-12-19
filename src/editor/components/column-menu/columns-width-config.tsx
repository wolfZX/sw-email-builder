import * as Dialog from '@radix-ui/react-dialog';
import { Columns2, SlidersVertical, Columns3 } from 'lucide-react';
import { TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { cn } from '@/editor/utils/classname';
import { Tooltip } from '../ui/tooltip';
import { BaseButton } from '../base-button';
import { useState } from 'react';

type ColumnsWidthConfigProps = {
  tooltip?: string;
  columnsCount: number;
  columnWidths: string[];
  onColumnConfigChange: (column: number, widths: string[]) => void;
  children?: React.ReactNode;
};

export function ColumnsWidthConfig(props: ColumnsWidthConfigProps) {
  const {
    tooltip,
    columnsCount = 2,
    columnWidths,
    onColumnConfigChange,
    children,
  } = props;

  const [count, setCount] = useState(columnsCount);
  const [width, setWidth] = useState(columnWidths);

  const handleApply = () => {
    onColumnConfigChange(count, width);
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
          <SlidersVertical className="mly-h-3 mly-w-3 mly-shrink-0 mly-stroke-[2.5]"/>
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
          <Dialog.Title className="mly-mb-2 mly-text-md mly-font-medium">Columns configuration</Dialog.Title>
          <div className="mly-grid mly-grid-cols-2 mly-gap-1">
            <SwitchButton
              onClick={() => setCount(2)}
              isActive={count === 2}
            >
              <Columns2 className="mly-h-4 mly-w-4 mly-stroke-[2.5]" />
              <span>2 Columns</span>
            </SwitchButton>
            <SwitchButton
              onClick={() => setCount(3)}
              isActive={count === 3}
            >
              <Columns3 className="mly-h-4 mly-w-4 mly-stroke-[2.5]" />
              <span>3 Columns</span>
            </SwitchButton>
          </div>

          <hr className="mly-my-0.5 mly-border-gray-200" />

          <div
            className="mly-grid mly-gap-1 mly-p-1"
            style={{ gridTemplateColumns: `repeat(${count}, 1fr)` }}
          >
            {Array.from({ length: count }).map((_, i) => {
              const value =
                width[i] === 'auto' ? '' : width[i];
              const label =
                columnsCount === 2
                  ? i === 0
                    ? 'Left'
                    : 'Right'
                  : i === 0
                    ? 'Left'
                    : i === 1
                      ? 'Middle'
                      : 'Right';

              return (
                <div className="mly-flex mly-flex-col mly-gap-1" key={i}>
                  <span className="mly-text-xs mly-text-gray-400">{label}</span>

                  <label className="mly-relative">
                    <input
                      placeholder="auto"
                      min={1}
                      max={90}
                      type="number"
                      className="hide-number-controls mly-w-full mly-appearance-none mly-rounded-md mly-bg-soft-gray mly-px-1.5 mly-py-1 mly-pr-6 mly-text-sm mly-tabular-nums mly-outline-none focus:mly-bg-soft-gray focus:mly-outline-none focus:mly-ring-1 focus:mly-ring-midnight-gray/50"
                      value={value}
                      onChange={(e) => {
                        const value = e.target.value;
                        setWidth(prev => {
                          const newWidth = [...prev];
                          newWidth[i] = value || 'auto';
                          return newWidth;
                        });
                      }}
                    />
                    <span className="mly-absolute mly-inset-y-0 mly-right-0 mly-flex mly-aspect-square mly-items-center mly-justify-center mly-text-xs mly-tabular-nums mly-text-gray-500">
                      %
                    </span>
                  </label>
                </div>
              );
            })}
          </div>

          <div className="mly-flex mly-justify-end mly-mt-4 mly-gap-3">
            <Dialog.Close asChild>
              <BaseButton variant="default" size="sm" type="button" onClick={handleApply}>
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

type SwitchButtonProps = {
  isActive?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
};

function SwitchButton(props: SwitchButtonProps) {
  const { onClick, isActive = false, children } = props;

  return (
    <button
      className={cn(
        'mly-flex mly-h-7 mly-items-center mly-gap-1 mly-rounded-md mly-px-2 mly-text-sm mly-text-gray-500 hover:mly-bg-soft-gray hover:mly-text-midnight-gray',
        isActive && 'mly-bg-soft-gray mly-text-midnight-gray'
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
