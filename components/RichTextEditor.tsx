// components/RichTextEditor.tsx
'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Link as LinkIcon,
  Image as ImageIcon
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
}

export default function RichTextEditor({ content, onChange, placeholder = 'Write something amazing...' }: RichTextEditorProps) {
  const [linkUrl, setLinkUrl] = useState('')
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [showImageInput, setShowImageInput] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  // Wait until component is mounted to render editor (avoid SSR issues)
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Placeholder.configure({
        placeholder,
      }),
      Underline,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    immediatelyRender: false, // Explicitly set to false to avoid hydration issues
  })

  // Don't render editor until component is mounted
  if (!isMounted || !editor) {
    return (
      <div className="border rounded-lg overflow-hidden text-text">
        <div className="flex flex-wrap items-center gap-1 p-2 border-b ">
          {/* Placeholder toolbar */}
          <Button variant="outline" size="sm" disabled>
            <Bold className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" disabled>
            <Italic className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" disabled>
            <UnderlineIcon className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" disabled>
            <List className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" disabled>
            <ListOrdered className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" disabled>
            <Quote className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" disabled>
            <LinkIcon className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" disabled>
            <ImageIcon className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" disabled>
            <Undo className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" disabled>
            <Redo className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-4 min-h-[300px]  animate-pulse rounded-b-lg">
          {/* Loading placeholder */}
        </div>
      </div>
    )
  }

  const addLink = () => {
    if (linkUrl) {
      editor.chain().focus().setLink({ href: linkUrl }).run()
      setLinkUrl('')
      setShowLinkInput(false)
    }
  }

  const addImage = () => {
    if (imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl }).run()
      setImageUrl('')
      setShowImageInput(false)
    }
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b">
        <Button
          type="button"
          variant={editor.isActive('bold') ? 'default' : 'outline'}
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant={editor.isActive('italic') ? 'default' : 'outline'}
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant={editor.isActive('underline') ? 'default' : 'outline'}
          size="sm"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <UnderlineIcon className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant={editor.isActive('bulletList') ? 'default' : 'outline'}
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant={editor.isActive('orderedList') ? 'default' : 'outline'}
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant={editor.isActive('blockquote') ? 'default' : 'outline'}
          size="sm"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowLinkInput(!showLinkInput)}
        >
          <LinkIcon className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowImageInput(!showImageInput)}
        >
          <ImageIcon className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
        >
          <Undo className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>

      {/* Link Input */}
      {showLinkInput && (
        <div className="p-2 border-b  flex gap-2">
          <input
            type="text"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="Enter URL"
            className="flex-1 px-2 py-1 border rounded text-sm"
          />
          <Button type="button" size="sm" onClick={addLink}>
            Add
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setShowLinkInput(false)
              setLinkUrl('')
            }}
          >
            Cancel
          </Button>
        </div>
      )}

      {/* Image Input */}
      {showImageInput && (
        <div className="p-2 border-b  flex gap-2">
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Enter image URL"
            className="flex-1 px-2 py-1 border rounded text-sm"
          />
          <Button type="button" size="sm" onClick={addImage}>
            Add
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setShowImageInput(false)
              setImageUrl('')
            }}
          >
            Cancel
          </Button>
        </div>
      )}

      {/* Editor Content */}
      <div className="p-4 min-h-[300px]">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}