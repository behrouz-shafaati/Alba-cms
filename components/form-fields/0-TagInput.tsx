// 'use client'

// import { useState, useEffect } from 'react'
// import { Input } from '@/components/ui/input'
// import { Badge } from '@/components/ui/badge'
// import { X } from 'lucide-react'
// import { Label } from '../ui/label'

// type TagInputWithSuggestionsProps = {
//   name: string
//   value?: string[]
//   onChange?: (tags: string[]) => void
//   suggestions?: string[]
//   maxTags?: number
//   placeholder?: string
//   defaultValue?: string[]
//   id?: string
//   disabled?: boolean
//   readOnly?: boolean
// }

// export function TagInputWithSuggestions({
//   name,
//   value,
//   onChange,
//   suggestions = [],
//   maxTags = 20,
//   placeholder = 'تگ وارد کنید...',
//   defaultValue = [],
//   id,
//   disabled = false,
//   readOnly = false,
// }: TagInputWithSuggestionsProps) {
//   const isControlled = value !== undefined
//   const [internalTags, setInternalTags] = useState<string[]>(defaultValue)
//   const [inputValue, setInputValue] = useState('')
//   const [open, setOpen] = useState(false)

//   const tags = isControlled ? value! : internalTags

//   const updateTags = (newTags: string[]) => {
//     if (!isControlled) setInternalTags(newTags)
//     onChange?.(newTags)
//   }

//   const filteredSuggestions = suggestions.filter(
//     (tag) =>
//       tag.toLowerCase().includes(inputValue.toLowerCase()) &&
//       !tags.includes(tag)
//   )

//   const addTag = (tag: string) => {
//     if (!tag.trim()) return
//     if (tags.includes(tag)) return
//     if (tags.length >= maxTags) return

//     updateTags([...tags, tag.trim()])
//     setInputValue('')
//     setOpen(false)
//   }

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === 'Enter' || e.key === ',') {
//       e.preventDefault()
//       addTag(inputValue)
//     }

//     if (e.key === 'Backspace' && !inputValue) {
//       updateTags(tags.slice(0, -1))
//     }
//   }

//   const removeTag = (tag: string) => {
//     updateTags(tags.filter((t) => t !== tag))
//   }

//   return (
//     <div className="space-y-2">
//       <div className="flex flex-wrap items-center gap-2 border border-input rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-ring">
//         {tags.map((tag) => (
//           <Badge
//             key={tag}
//             variant="secondary"
//             className="flex items-center gap-1 px-2 py-1 rounded"
//           >
//             {tag}
//             {!readOnly && (
//               <button
//                 onClick={() => removeTag(tag)}
//                 className="ml-1 text-muted-foreground"
//                 type="button"
//               >
//                 <X className="w-3 h-3" />
//               </button>
//             )}
//           </Badge>
//         ))}

//         <Input
//           id={id || name}
//           value={inputValue}
//           onChange={(e) => {
//             setInputValue(e.target.value)
//             setOpen(true)
//           }}
//           onKeyDown={handleKeyDown}
//           placeholder={placeholder}
//           className="flex-1 border-none focus-visible:ring-0 focus-visible:ring-transparent p-0"
//           readOnly={readOnly}
//           disabled={disabled}
//         />
//       </div>

//       {/* Hidden input برای فرم */}
//       <input type="hidden" name={name} value={JSON.stringify(tags)} readOnly />
//     </div>
//   )
// }

// type TagProps = {
//   title: string
//   name: string
//   id?: string
//   type?: string
//   defaultValue?: string[]
//   placeholder?: string
//   description?: string
//   icon?: any
//   state?: any
//   value?: string
//   display?: boolean
//   disabled?: boolean
//   readOnly?: boolean
//   className?: string
//   onChange?: (e: any) => void
// }
// export default function TagInput({
//   title,
//   name,
//   id,
//   type,
//   defaultValue,
//   placeholder,
//   description,
//   icon,
//   state,
//   value,
//   display = true,
//   disabled = false,
//   readOnly = false,
//   className = '',
//   onChange,
// }: TagProps) {
//   if (!display) return null
//   const errorMessages = state?.errors?.[name] ?? []
//   const hasError = state?.errors?.[name]?.length > 0
//   const InputIcon = typeof icon === 'object' ? () => icon : icon
//   return (
//     <div className={`mb-4 ${className}`}>
//       <Label htmlFor={name} className="mb-2 block text-sm font-medium">
//         {title}
//       </Label>
//       <div className="relative">
//         <TagInputWithSuggestions
//           onChange={onChange}
//           id={id || name}
//           name={name}
//           defaultValue={defaultValue}
//           placeholder={placeholder}
//           readOnly={readOnly}
//           disabled={disabled}
//         />
//         {icon && (
//           <span className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500">
//             <InputIcon />
//           </span>
//         )}
//       </div>
//       {description && (
//         <span className="text-xs text-gray-500">{description}</span>
//       )}
//       {hasError && (
//         <div id={`${name}-error`} aria-live="polite" aria-atomic="true">
//           {errorMessages.map((error: string) => (
//             <p className="mt-2 text-xs text-red-500" key={error}>
//               {error}
//             </p>
//           ))}
//         </div>
//       )}
//     </div>
//   )
// }
