import { mergeAttributes, Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { ButtonView } from './button-view';
import { AllowedLogoAlignment } from '@/editor/nodes/logo';
import { updateAttributes } from '@/editor/utils/update-attribute';
import { DEFAULT_SECTION_SHOW_IF_KEY } from '../section/section';

export const DEFAULT_BUTTON_ALIGNMENT: AllowedLogoAlignment = 'left';
export const DEFAULT_BUTTON_VARIANT: AllowedButtonVariant = 'filled';
export const DEFAULT_BUTTON_BORDER_RADIUS: AllowedButtonBorderRadius = 'smooth';
export const DEFAULT_BUTTON_BACKGROUND_COLOR = '#000000';
export const DEFAULT_BUTTON_TEXT_COLOR = '#ffffff';

export const allowedButtonVariant = ['filled', 'outline'] as const;
export type AllowedButtonVariant = (typeof allowedButtonVariant)[number];

export const allowedButtonBorderRadius = ['sharp', 'smooth', 'round'] as const;
export type AllowedButtonBorderRadius =
  (typeof allowedButtonBorderRadius)[number];

type ButtonAttributes = {
  text: string;
  url: string;
  alignment: AllowedLogoAlignment;
  variant: AllowedButtonVariant;
  borderRadius: AllowedButtonBorderRadius;
  buttonColor: string;
  textColor: string;

  showIfKey: string;
};

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    button: {
      setButton: () => ReturnType;
      updateButton: (attrs: Partial<ButtonAttributes>) => ReturnType;
    };
  }
}

export const ButtonExtension = Node.create({
  name: 'button',
  group: 'block',
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      text: {
        default: 'Button',
        parseHTML: (element) => {
          return element.getAttribute('data-text') || '';
        },
        renderHTML: (attributes) => {
          return {
            'data-text': attributes.text,
          };
        },
      },
      url: {
        default: '',
        parseHTML: (element) => {
          return element.getAttribute('data-url') || '';
        },
        renderHTML: (attributes) => {
          return {
            'data-url': attributes.url,
          };
        },
      },
      alignment: {
        default: DEFAULT_BUTTON_ALIGNMENT,
        parseHTML: (element) => {
          return (
            element.getAttribute('data-alignment') || DEFAULT_BUTTON_ALIGNMENT
          );
        },
        renderHTML: (attributes) => {
          return {
            'data-alignment': attributes.alignment,
          };
        },
      },
      variant: {
        default: DEFAULT_BUTTON_VARIANT,
        parseHTML: (element) => {
          return element.getAttribute('data-variant') || DEFAULT_BUTTON_VARIANT;
        },
        renderHTML: (attributes) => {
          return {
            'data-variant': attributes.variant,
          };
        },
      },
      borderRadius: {
        default: DEFAULT_BUTTON_BORDER_RADIUS,
        parseHTML: (element) => {
          return (
            element.getAttribute('data-border-radius') ||
            DEFAULT_BUTTON_BORDER_RADIUS
          );
        },
        renderHTML: (attributes) => {
          return {
            'data-border-radius': attributes.borderRadius,
          };
        },
      },
      buttonColor: {
        default: DEFAULT_BUTTON_BACKGROUND_COLOR,
        parseHTML: (element) => {
          return (
            element.getAttribute('data-button-color') ||
            DEFAULT_BUTTON_BACKGROUND_COLOR
          );
        },
        renderHTML: (attributes) => {
          return {
            'data-button-color': attributes.buttonColor,
          };
        },
      },
      textColor: {
        default: DEFAULT_BUTTON_TEXT_COLOR,
        parseHTML: (element) => {
          return (
            element.getAttribute('data-text-color') || DEFAULT_BUTTON_TEXT_COLOR
          );
        },
        renderHTML: (attributes) => {
          return {
            'data-text-color': attributes.textColor,
          };
        },
      },
      showIfKey: {
        default: DEFAULT_SECTION_SHOW_IF_KEY,
        parseHTML: (element) => {
          return (
            element.getAttribute('data-show-if-key') ||
            DEFAULT_SECTION_SHOW_IF_KEY
          );
        },
        renderHTML(attributes) {
          if (!attributes.showIfKey) {
            return {};
          }

          return {
            'data-show-if-key': attributes.showIfKey,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        // Parse div structure (from editor)
        tag: `div[data-type="${this.name}"]`,
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const {
      'data-text': dataText,
      'data-url': dataURL,
      'data-alignment': dataAlignment,
      'data-variant': dataVariant,
      'data-border-radius': dataBorderRadius,
      'data-button-color': dataButtonColor,
      'data-text-color': dataTextColor,
      'data-show-if-key': dataShowIfKey,
    } = HTMLAttributes;

    const text = dataText || 'Button';
    const url = dataURL || '';
    const alignment = dataAlignment || DEFAULT_BUTTON_ALIGNMENT;
    const variant = dataVariant || DEFAULT_BUTTON_VARIANT;
    const borderRadius = dataBorderRadius || DEFAULT_BUTTON_BORDER_RADIUS;
    const buttonColor = dataButtonColor || DEFAULT_BUTTON_BACKGROUND_COLOR;
    const textColor = dataTextColor || DEFAULT_BUTTON_TEXT_COLOR;
    const showIfKey = dataShowIfKey || DEFAULT_SECTION_SHOW_IF_KEY;

    const buttonStyle = `
      display: inline-block;
      padding: 12px 32px;
      background-color: ${variant === 'filled' ? buttonColor : 'transparent'};
      color: ${textColor};
      text-decoration: none;
      border: ${variant === 'outline' ? `2px solid ${buttonColor}` : 'none'};
      border-radius: ${
        borderRadius === 'sharp' ? '0' :
        borderRadius === 'smooth' ? '4px' : '999px'
      };
      text-align: center;
      font-size: 0.875rem;
      font-weight: 600;
      line-height: 1.5;
      mso-padding-alt: 0;
      mso-text-raise: 0;
      mso-line-height-rule: exactly;
    `;

    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-type': this.name,
        'data-button': '',
      }),
      [
        'table',
        {
          border: '0',
          cellpadding: '0',
          cellspacing: '0',
          role: 'presentation',
          style: 'width: 100%; margin: 0;',
        },
        [
          'tr',
          {},
          [
            'td',
            { align: alignment },
            [
              'a',
              {
                href: url || '#',
                style: buttonStyle,
                target: '_blank',
                'data-variant': variant,
                'data-border-radius': borderRadius,
                ...(showIfKey ? { 'data-show-if-key': showIfKey } : {}),
              },
              text || 'Button'
            ]
          ]
        ]
      ]
    ];
  },

  addCommands() {
    return {
      setButton:
        () =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: {},
            content: [],
          });
        },
      updateButton: (attrs) => updateAttributes(this.name, attrs),
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(ButtonView, {
      contentDOMElementTag: 'div',
    });
  },
});
