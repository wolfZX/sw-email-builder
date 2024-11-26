import { Extension } from '@tiptap/core';
import translate from 'translate';

// ------------------------------------------------------------
// Example Usage with custom language in the parent application:
// import { Editor } from '@your-package/editor';

// <Editor
//   translateConfig={{
//     fromLang: 'en',
//     toLang: 'es'  // or any other language code
//   }}
//   // ... other props
// />
// ------------------------------------------------------------

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    translate: {
      toggleTranslate: () => ReturnType;
    };
  }

  interface EditorProps {
    translateSettings?: {
      fromLang?: string;
      toLang?: string;
    };
  }
}

interface TranslateOptions {
  fromLang?: string;
  toLang?: string;
}

export const TranslateExtension = Extension.create<TranslateOptions>({
  name: 'translate',

  addCommands() {
    return {
      toggleTranslate:
        () =>
        ({ editor, tr, state }) => {
          const { from, to } = state.selection;
          const text = state.doc.textBetween(from, to);

          if (!text) return false;

          // @ts-ignore
          const settings = editor.options.editorProps.translateSettings;

          translate.engine = 'google';
          translate(text, { 
            from: settings?.fromLang ?? 'en', 
            to: settings?.toLang ?? 'zh' 
          })
            .then((translated) => {
              tr.insertText(translated.toString(), from, to);
              editor.view.dispatch(tr);
            })
            .catch((err) => {
              console.error('Translation failed:', err);
            });

          return true;
        },
    };
  },
});
