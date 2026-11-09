<script setup lang="ts">
import StarterKit from '@tiptap/starter-kit'
import { EditorContent, useEditor } from '@tiptap/vue-3'
import DOMPurify from 'dompurify'
import { watch } from 'vue'

import { useT } from '@shared/lib/i18n/I18n'
const props = defineProps<{ modelValue: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
const { t } = useT()
const editor = useEditor({
  extensions: [StarterKit],
  content: DOMPurify.sanitize(props.modelValue),
  onUpdate: ({ editor }) => {
    emit('update:modelValue', DOMPurify.sanitize(editor.getHTML()))
  },
  editorProps: {
    attributes: {
      'aria-label': t('categories.description'),
      class: 'min-h-32 rounded border border-default p-3',
    },
  },
})
watch(
  () => props.modelValue,
  (value) => {
    const clean = DOMPurify.sanitize(value)
    if (editor.value && editor.value.getHTML() !== clean) editor.value.commands.setContent(clean, { emitUpdate: false })
  },
)
</script>

<template>
  <EditorContent :editor="editor" />
</template>
