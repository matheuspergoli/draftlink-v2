import React from "react"

import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { Bold, Heading, Italic } from "lucide-react"

import { Button } from "@/shared/ui/button"

interface EditorProps {
	content?: string | null
	onChange: (content: string) => void
}

export const DescriptionEditor = React.forwardRef<HTMLDivElement, EditorProps>(
	({ onChange, content }, ref) => {
		const editor = useEditor({
			extensions: [StarterKit],
			onUpdate: ({ editor }) => {
				onChange(editor.getHTML())
			},
			content: content ? content : "",
			editorProps: {
				attributes: {
					class: "outline-none",
					placeholder: "Write a description..."
				}
			}
		})

		const isActiveBold = editor?.isActive("bold")
		const toggleBold = () => {
			editor?.chain().focus().toggleBold().run()
		}

		const isActiveItalic = editor?.isActive("italic")
		const toggleItalic = () => {
			editor?.chain().focus().toggleItalic().run()
		}

		const isActiveHeading = editor?.isActive("heading", { level: 1 })
		const toggleHeading = () => {
			editor?.chain().focus().toggleHeading({ level: 1 }).run()
		}

		return (
			<div className="w-full space-y-3 rounded-md border">
				<div className="space-x-3 border-b bg-primary/5 p-3">
					<Button
						variant={isActiveBold ? "default" : "secondary"}
						type="button"
						onClick={toggleBold}>
						<Bold className="size-4" />
					</Button>
					<Button
						variant={isActiveItalic ? "default" : "secondary"}
						type="button"
						onClick={toggleItalic}>
						<Italic className="size-4" />
					</Button>
					<Button
						variant={isActiveHeading ? "default" : "secondary"}
						type="button"
						onClick={toggleHeading}>
						<Heading className="size-4" />
					</Button>
				</div>
				<EditorContent
					ref={ref}
					editor={editor}
					className="prose prose-sm dark:prose-invert sm:prose w-full rounded-md"
				/>
			</div>
		)
	}
)
