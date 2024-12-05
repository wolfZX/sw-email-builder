'use client';

import { useRef, useEffect, forwardRef } from 'react';
import { Editor as TiptapEditor, Extension, FocusPosition } from '@tiptap/core';
import { EditorContent, JSONContent, useEditor } from '@tiptap/react';

import { EditorMenuBar } from './components/editor-menu-bar';
import { ImageBubbleMenu } from './components/image-menu/image-bubble-menu';
import { extensions as defaultExtensions } from './extensions';
import {
  DEFAULT_PAYLOAD_VALUE_SUGGESTION_CHAR,
  DEFAULT_VARIABLE_SUGGESTION_CHAR,
  MailyContextType,
  MailyProvider,
} from './provider';
import { cn } from './utils/classname';
import { SectionBubbleMenu } from './components/section-menu/section-bubble-menu';
import { TextBubbleMenu } from './components/text-menu/text-bubble-menu';
import { ColumnsBubbleMenu } from './components/column-menu/columns-bubble-menu';
import { ContentMenu } from './components/content-menu';
import { ForBubbleMenu } from './components/for-menu/for-bubble-menu';
import { SpacerBubbleMenu } from './components/spacer-menu/spacer-bubble-menu';
import { createDefaultSlashCommands } from './extensions/slash-command/default-slash-commands';
import { ImageConfig } from '@/blocks/image';
import { Slice } from '@tiptap/pm/model';

// -----------------------------------------------------------------------------
// To access the editor instance, you can use the ref prop.
// import { Editor } from 'sw-email-builder';
// import { Editor as TiptapEditor } from '@tiptap/core';

// function MyComponent() {
//   const editorRef = useRef<TiptapEditor | null>(null);

//   const switchTemplate = (newContent: string) => {
//     if (editorRef.current) {
//       editorRef.current.commands.setContent(newContent);
//     }
//   };

//   return (
//     <>
//       <Editor ref={editorRef} {...otherProps} />
//       <button onClick={() => switchTemplate('new content')}>
//         Switch Template
//       </button>
//     </>
//   );
// }
// -----------------------------------------------------------------------------

type ParitialMailContextType = Partial<MailyContextType>;

export type EditorProps = {
  contentHtml?: string;
  contentJson?: JSONContent;
  onUpdate?: (editor: TiptapEditor) => void;
  onCreate?: (editor: TiptapEditor) => void;
  onDrop?: (e: DragEvent, slice: Slice, moved: boolean) => void;
  extensions?: Extension[];
  config?: {
    hasMenuBar?: boolean;
    spellCheck?: boolean;
    wrapClassName?: string;
    toolbarClassName?: string;
    contentClassName?: string;
    bodyClassName?: string;
    autofocus?: FocusPosition;
    immediatelyRender?: boolean;
  };
  imageConfig?: ImageConfig;
  translateConfig?: {
    fromLang?: string;
    toLang?: string;
  };
  ref?: React.ForwardedRef<TiptapEditor | null>;
} & ParitialMailContextType;

export const Editor = forwardRef<TiptapEditor | null, EditorProps>((props, ref) => {
  const {
    config: {
      wrapClassName = '',
      contentClassName = '',
      bodyClassName = '',
      hasMenuBar = true,
      spellCheck = false,
      autofocus = 'end',
      immediatelyRender = false,
    } = {},
    onDrop,
    onCreate,
    onUpdate,
    extensions,
    contentHtml,
    contentJson,
    variables,
    blocks = createDefaultSlashCommands({ imageConfig: props.imageConfig }),
    variableSuggestionChar = DEFAULT_VARIABLE_SUGGESTION_CHAR,
    payloadValueSuggestionChar = DEFAULT_PAYLOAD_VALUE_SUGGESTION_CHAR,
    translateConfig,
  } = props;

  let formattedContent: any = null;
  if (contentJson) {
    formattedContent =
      contentJson?.type === 'doc'
        ? contentJson
        : {
            type: 'doc',
            content: contentJson,
          };
  } else if (contentHtml) {
    formattedContent = contentHtml;
  } else {
    formattedContent = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [],
        },
      ],
    };
  }

  const menuContainerRef = useRef(null);

  const editor = useEditor({
    editorProps: {
      attributes: {
        class: cn(`mly-prose mly-w-full`, contentClassName),
        spellCheck: spellCheck ? 'true' : 'false',
      },
      handleDOMEvents: {
        keydown: (_view, event) => {
          // prevent default event listeners from firing when slash command is active
          if (['ArrowUp', 'ArrowDown', 'Enter'].includes(event.key)) {
            const slashCommand = document.querySelector('#slash-command');
            if (slashCommand) {
              return true;
            }
          }
        },
      },
      // @ts-ignore
      translateSettings: translateConfig,
      // Add parsing rules for linked images
      parseOptions: {
        preserveWhitespace: true,
      },
    },
    immediatelyRender,
    onDrop: (e: DragEvent, slice: Slice, moved: boolean) => {
      onDrop?.(e, slice, moved);
    },
    onCreate: ({ editor }) => {
      onCreate?.(editor);
    },
    onUpdate: ({ editor }) => {
      onUpdate?.(editor);
    },
    extensions: [
      ...defaultExtensions({
        variables,
        blocks,
        variableSuggestionChar,
        payloadValueSuggestionChar,
        translateOptions: translateConfig,
      }),
      ...(extensions || []),
    ],
    content: formattedContent,
    autofocus,
  });

  useEffect(() => {
    if (editor && translateConfig) {
      editor.setOptions({
        editorProps: {
          ...editor.options.editorProps,
          // @ts-ignore
          translateSettings: translateConfig
        }
      });
    }
  }, [editor, translateConfig?.fromLang, translateConfig?.toLang]);

  useEffect(() => {
    if (ref) {
      if (typeof ref === 'function') {
        ref(editor);
      } else {
        ref.current = editor;
      }
    }
  }, [editor, ref]);

  if (!editor) {
    return null;
  }

  return (
    <MailyProvider
      variables={variables}
      blocks={blocks}
      variableSuggestionChar={variableSuggestionChar}
      payloadValueSuggestionChar={payloadValueSuggestionChar}
    >
      <div
        className={cn('mly-editor mly-antialiased', wrapClassName)}
        ref={menuContainerRef}
      >
        {hasMenuBar && <EditorMenuBar config={props.config} editor={editor} />}
        <div
          className={cn(
            'mly-mt-4 mly-rounded mly-border mly-bg-white mly-p-4',
            bodyClassName
          )}
        >
          <TextBubbleMenu editor={editor} appendTo={menuContainerRef} />
          <ImageBubbleMenu editor={editor} appendTo={menuContainerRef} />
          <SpacerBubbleMenu editor={editor} appendTo={menuContainerRef} />
          <EditorContent editor={editor} />
          <SectionBubbleMenu editor={editor} appendTo={menuContainerRef} />
          <ColumnsBubbleMenu editor={editor} appendTo={menuContainerRef} />
          <ContentMenu editor={editor} />
          <ForBubbleMenu editor={editor} appendTo={menuContainerRef} />
        </div>
      </div>
    </MailyProvider>
  );
});
