import type { BlockItem } from './types';
import { ImageIcon } from 'lucide-react';

// ------------------------------------------------------------
// Example Usage with custom image handling:
// In the parent application
// import { Editor } from '@your-package/editor';

// function ParentComponent() {
//   const handleImageAdd = ({ editor, range }) => {
//     // Your custom image handling logic
//     // For example, opening a modal:
//     openImageModal().then(imageUrl => {
//       if (imageUrl) {
//         editor.chain().focus().deleteRange(range).run();
//         editor.chain().focus().setImage({ src: imageUrl }).run();
//       }
//     });
//   };

//   return (
//     <Editor
//       imageConfig={{
//         onImageAdd: handleImageAdd,
//       }}
//       // ... other props
//     />
//   );
// }
// ------------------------------------------------------------

export type ImageHandlerProps = {
  editor: any;
  range: any;
};

export type ImageConfig = {
  onImageAdd?: (props: ImageHandlerProps) => void;
};

export const createImageBlock = (config?: ImageConfig): BlockItem => ({
  title: 'Image',
  description: 'Full width image',
  searchTerms: ['image'],
  icon: <ImageIcon className="mly-h-4 mly-w-4" />,
  command: ({ editor, range }) => {
    if (config?.onImageAdd) {
      config.onImageAdd({ editor, range });
      return;
    }

    // Default behavior
    const imageUrl = prompt('Image URL: ') || '';
    if (!imageUrl) {
      return;
    }

    editor.chain().focus().deleteRange(range).run();
    // @ts-ignore
    editor.chain().focus().setImage({ src: imageUrl }).run();
  },
});

// Similar changes for logo block
export const createLogoBlock = (config?: ImageConfig): BlockItem => ({
  title: 'Logo',
  description: 'Add your brand logo',
  searchTerms: ['image', 'logo'],
  icon: <ImageIcon className="mly-h-4 mly-w-4" />,
  command: ({ editor, range }) => {
    if (config?.onImageAdd) {
      config.onImageAdd({ editor, range });
      return;
    }

    // Default behavior
    const logoUrl = prompt('Logo URL: ') || '';
    if (!logoUrl) {
      return;
    }

    editor.chain().focus().deleteRange(range).run();
    // @ts-ignore
    editor.chain().focus().setLogoImage({ src: logoUrl }).run();
  },
});
