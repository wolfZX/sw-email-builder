import { Extension } from '@tiptap/core';
import translate from 'translate';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    translate: {
      toggleTranslate: () => ReturnType;
    };
  }
}

export const TranslateExtension = Extension.create({
  name: 'translate',

  addCommands() {
    return {
      toggleTranslate:
        () =>
        ({ editor, tr, state }) => {
          const { from, to } = state.selection;
          const text = state.doc.textBetween(from, to);

          if (!text) return false;

          // TODO: make the language configurable
          translate.engine = 'google';
          translate(text, { from: 'en', to: 'zh' })
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
