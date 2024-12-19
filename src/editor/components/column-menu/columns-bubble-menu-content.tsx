import { EditorBubbleMenuProps } from '../text-menu/text-bubble-menu';
import { useColumnsState } from './use-columns-state';
import { Divider } from '../ui/divider';
import { TooltipProvider } from '../ui/tooltip';
import { VerticalAlignmentSwitch } from '../vertical-alignment-switch';
import {
  addColumnByIndex,
  removeColumnByIndex,
  updateColumnWidth,
} from '@/editor/utils/columns';
import { ShowPopover } from '../show-popover';
import { ColumnsWidthConfig } from './columns-width-config';

type ColumnsBubbleMenuProps = {
  editor: EditorBubbleMenuProps['editor'];
};

export function ColumnsBubbleMenuContent(props: ColumnsBubbleMenuProps) {
  const { editor } = props;
  if (!editor) {
    return null;
  }

  const state = useColumnsState(editor);

  const currentColumnCount = state.columnsCount;

  return (
    <TooltipProvider>
      <div className="mly-flex mly-items-stretch">
        {state.isColumnActive && (
          <>
            <ColumnsWidthConfig
              tooltip="Columns configuration"
              columnsCount={currentColumnCount}
              columnWidths={state.columnWidths}
              onColumnConfigChange={(count, widths) => {
                if (count > currentColumnCount) {
                  addColumnByIndex(editor);
                } else {
                  removeColumnByIndex(editor);
                }
                updateColumnWidth(editor, widths);
              }}
            />

            <Divider />
          </>
        )}

        <VerticalAlignmentSwitch
          alignment={state.currentVerticalAlignment}
          onAlignmentChange={(value) => {
            editor.commands.updateColumn({
              verticalAlign: value,
            });
          }}
        />

        {/* <Divider />

        <ShowPopover
          showIfKey={state.currentShowIfKey}
          onShowIfKeyValueChange={(value) => {
            editor.commands.updateColumns({
              showIfKey: value,
            });
          }}
        /> */}
      </div>
    </TooltipProvider>
  );
}
