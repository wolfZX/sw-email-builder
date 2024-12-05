import {
  NodeViewWrapper,
  type NodeViewProps,
  ReactNodeViewRenderer,
} from '@tiptap/react';
import { type CSSProperties, useRef, useState } from 'react';
import TipTapImage from '@tiptap/extension-image';
import { useEvent } from '../utils/use-event';
import { DEFAULT_SECTION_SHOW_IF_KEY } from '../nodes/section/section';

const MIN_WIDTH = 20;
const MAX_WIDTH = 600;

function ResizableImageTemplate(props: NodeViewProps) {
  const { node, updateAttributes, selected } = props;

  const imgRef = useRef<HTMLImageElement>(null);

  const [resizingStyle, setResizingStyle] = useState<
    Pick<CSSProperties, 'width' | 'height'> | undefined
  >();

  const handleMouseDown = useEvent(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const imageParent = document.querySelector(
        '.ProseMirror-selectednode'
      ) as HTMLDivElement;

      if (!imgRef.current || !imageParent || !selected) {
        return;
      }

      const imageParentWidth = Math.max(imageParent.offsetWidth, MAX_WIDTH);

      event.preventDefault();
      const direction = event.currentTarget.dataset.direction || '--';
      const initialXPosition = event.clientX;
      const currentWidth = imgRef.current.width;
      const currentHeight = imgRef.current.height;
      let newWidth = currentWidth;
      let newHeight = currentHeight;
      const transform = direction[1] === 'w' ? -1 : 1;

      const removeListeners = () => {
        window.removeEventListener('mousemove', mouseMoveHandler);
        window.removeEventListener('mouseup', removeListeners);
        updateAttributes({ 
          width: newWidth, 
          height: newHeight 
        });
        setResizingStyle(undefined);
      };

      const mouseMoveHandler = (event: MouseEvent) => {
        newWidth = Math.max(
          currentWidth + transform * (event.clientX - initialXPosition),
          MIN_WIDTH
        );

        if (newWidth > imageParentWidth) {
          newWidth = imageParentWidth;
        }

        newHeight = (newWidth / currentWidth) * currentHeight;

        setResizingStyle({ width: newWidth, height: newHeight });
        // If mouse is up, remove event listeners
        if (!event.buttons) {
          return removeListeners();
        }
      };

      window.addEventListener('mousemove', mouseMoveHandler);
      window.addEventListener('mouseup', removeListeners);
    }
  );

  function dragCornerButton(direction: string) {
    return (
      <div
        role="button"
        tabIndex={0}
        onMouseDown={handleMouseDown}
        data-direction={direction}
        className="mly-bg-rose-500"
        style={{
          position: 'absolute',
          height: '10px',
          width: '10px',
          ...{ n: { top: 0 }, s: { bottom: 0 } }[direction[0]],
          ...{ w: { left: 0 }, e: { right: 0 } }[direction[1]],
          cursor: `${direction}-resize`,
        }}
      />
    );
  }

  let { alignment = 'center', width = '100%', height = '100%' } = node.attrs || {};
  const { externalLink, showIfKey, ...attrs } = node.attrs || {};

  // Ensure we're using '100%' when width/height is empty or 0
  width = !width || width === 0 ? '100%' : width;
  height = !height || height === 0 ? '100%' : height;

  // Convert width/height to numbers only if they're pixel values
  const numericWidth = typeof width === 'number' ? width : width;
  const numericHeight = typeof height === 'number' ? height : height;

  return (
    <NodeViewWrapper
      as="div"
      draggable
      data-drag-handle
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        ...resizingStyle,
        overflow: 'hidden',
        position: 'relative',
        // Weird! Basically tiptap/prose wraps this in a span and the line height causes an annoying buffer.
        lineHeight: '0px',
        display: 'block',
        ...({
          center: { marginLeft: 'auto', marginRight: 'auto' },
          left: { marginRight: 'auto' },
          right: { marginLeft: 'auto' },
        }[alignment as string] || {}),
      }}
    >
      <img
        {...attrs}
        ref={imgRef}
        style={{
          width: typeof width === 'number' ? `${width}px` : width,
          height: typeof height === 'number' ? `${height}px` : height,
          ...resizingStyle,
          cursor: 'default',
          marginBottom: 0,
        }}
      />
      {selected && (
        <>
          {/* Don't use a simple border as it pushes other content around. */}
          {[
            { left: 0, top: 0, height: '100%', width: '1px' },
            { right: 0, top: 0, height: '100%', width: '1px' },
            { top: 0, left: 0, width: '100%', height: '1px' },
            { bottom: 0, left: 0, width: '100%', height: '1px' },
          ].map((style, i) => (
            <div
              key={i}
              className="mly-bg-rose-500"
              style={{
                position: 'absolute',
                ...style,
              }}
            />
          ))}
          {dragCornerButton('nw')}
          {dragCornerButton('ne')}
          {dragCornerButton('sw')}
          {dragCornerButton('se')}
        </>
      )}
    </NodeViewWrapper>
  );
}

export const ResizableImageExtension = TipTapImage.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      display: {
        default: 'block',
        parseHTML: (element) => {
          const display = element.style.display;
          return display ? display : null;
        },
        renderHTML: (attributes) => ({
          style: 'display: block',
        }),
      },
      width: {
        default: '100%',
        parseHTML: (element) => {
          const width = element.style.width;
          if (!width) return '100%';
          return width.includes('px') ? parseInt(width, 10) : width;
        },
        renderHTML: (attributes) => {
          if (typeof attributes.width === 'number') {
            return { 
              style: `width: ${attributes.width}px`,
              'data-width': attributes.width
            };
          }
          return { style: `width: ${attributes.width}` };
        },
      },
      height: {
        default: '100%',
        parseHTML: (element) => {
          const height = element.style.height;
          if (!height) return '100%';
          return height.includes('px') ? parseInt(height, 10) : height;
        },
        renderHTML: (attributes) => {
          if (typeof attributes.height === 'number') {
            return { 
              style: `height: ${attributes.height}px`,
              'data-height': attributes.height
            };
          }
          return { style: `height: ${attributes.height}` };
        },
      },
      alignment: {
        default: 'center',
        renderHTML: ({ alignment }) => ({
          style: alignment === 'center' ? 'margin: 0 auto; display: block' : '',
          'data-alignment': alignment,
        }),
        parseHTML: (element) =>
          element.getAttribute('data-alignment') || 'center',
      },
      externalLink: {
        default: null,
        renderHTML: ({ externalLink }) => {
          if (!externalLink) {
            return {};
          }
          return {
            'data-external-link': externalLink,
          };
        },
        parseHTML: (element) => {
          const externalLink = element.getAttribute('data-external-link');
          return externalLink ? { externalLink } : null;
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
      inline: {
        default: true,
        renderHTML: () => ({
          'data-inline': 'true',
        }),
      },
      draggable: {
        default: true,
      },
    };
  },
  group: 'inline block',
  draggable: true,
  selectable: true,
  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageTemplate);
  },
});
