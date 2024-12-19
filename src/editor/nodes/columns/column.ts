import { updateAttributes } from '@/editor/utils/update-attribute';
import { Node, mergeAttributes } from '@tiptap/core';
import { v4 as uuid } from 'uuid';

export const DEFAULT_COLUMN_WIDTH = 'auto';

export type AllowedColumnVerticalAlign = 'top' | 'middle' | 'bottom';
export const DEFAULT_COLUMN_VERTICAL_ALIGN: AllowedColumnVerticalAlign = 'top';

interface ColumnAttributes {
  verticalAlign: AllowedColumnVerticalAlign;
  backgroundColor: string;
  borderRadius: number;
  align: string;
  borderWidth: number;
  borderColor: string;

  paddingTop: number;
  paddingRight: number;
  paddingBottom: number;
  paddingLeft: number;

  showIfKey: string;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    column: {
      updateColumn: (attrs: Partial<ColumnAttributes>) => ReturnType;
    };
  }
}

export const Column = Node.create({
  name: 'column',
  content: 'block+',
  isolating: true,

  addAttributes() {
    return {
      columnId: {
        default: null,
        parseHTML: (element) =>
          element.getAttribute('data-column-id') || uuid(),
        renderHTML: (attributes) => {
          if (!attributes.columnId) {
            return {
              'data-column-id': uuid(),
            };
          }

          return {
            'data-column-id': attributes.columnId,
          };
        },
      },
      width: {
        default: DEFAULT_COLUMN_WIDTH,
        parseHTML: (element) => {
          const width = element.style.width?.replace(/['"px%]+/g, '');
          return width ? (width.includes('.') ? width + '%' : parseInt(width, 10)) : DEFAULT_COLUMN_WIDTH;
        },
        renderHTML: (attributes) => {
          if (!attributes.width || attributes.width === DEFAULT_COLUMN_WIDTH) {
            return {};
          }

          const widthValue = typeof attributes.width === 'number' 
            ? `${attributes.width}px` 
            : attributes.width;

          return {
            style: `width: ${widthValue}; max-width: ${widthValue};`,
          };
        },
      },
      verticalAlign: {
        default: DEFAULT_COLUMN_VERTICAL_ALIGN,
        parseHTML: (element) => element?.getAttribute('data-vertical-align') || 'top',
        renderHTML: (attributes) => {
          const { verticalAlign } = attributes;
          if (
            !verticalAlign ||
            verticalAlign === DEFAULT_COLUMN_VERTICAL_ALIGN
          ) {
            return {};
          }

          if (verticalAlign === 'middle') {
            return {
              'data-vertical-align': verticalAlign,
              style: `display: flex;flex-direction: column;justify-content: center;`,
            };
          } else if (verticalAlign === 'bottom') {
            return {
              'data-vertical-align': verticalAlign,
              style: `display: flex;flex-direction: column;justify-content: flex-end;`,
            };
          }
        },
      },
    };
  },

  addCommands() {
    return {
      updateColumn: (attrs) => updateAttributes(this.name, attrs),
    };
  },

  renderHTML({ HTMLAttributes }) {
    const { 'data-vertical-align': dataVerticalAlign } = HTMLAttributes;
    const haveAlignment = ['middle', 'bottom'].includes(dataVerticalAlign);

    const columnStyle = `
      flex-basis: 0;
      flex-grow: 1;
      overflow: auto;
      display: ${haveAlignment ? 'flex' : 'table-cell'};
      ${haveAlignment ? 'flex-direction: column;' : ''}
      ${dataVerticalAlign === 'middle' ? 'justify-content: center;' : ''}
      ${dataVerticalAlign === 'bottom' ? 'justify-content: flex-end;' : ''}
    `;

    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-type': 'column',
        class: 'hide-scrollbars',
        style: columnStyle,
      }),
      0,
    ];
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="column"]',
      },
    ];
  },
});
