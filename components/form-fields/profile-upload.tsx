/* Create public/uploads/tmp directory. */

'use client'
import Image from 'next/image'
import { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { CameraIcon, TrashIcon } from 'lucide-react'
import clsx from 'clsx'
import { deleteFile, uploadFile } from '@/lib/entity/file/actions'
import { File as BeFile } from '@/lib/entity/file/interface'
import { Button } from '../ui/button'
const ObjectId = require('bson-objectid')

// Context from Function app/ui/components/dropzone.tsx:Dropzone
export default function ProfileUpload({
  className,
  title,
  name,
  defaultValue = null,
  state,
  targetFormat = '',
}: {
  className?: string
  title: string
  name: string
  defaultValue?: BeFile | null
  state?: any
  targetFormat: 'png' | ''
}) {
  const defaultImageUrl = '/assets/default-profile.png'
  const errorMessages = state?.errors?.[name] ?? []
  const hasError = state?.errors?.[name]?.length > 0

  const [file, setFile] = useState<any>(defaultValue)

  const onDrop = (acceptedFiles: File[]) => {
    let firstImage = true
    if (acceptedFiles?.length) {
      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          id: ObjectId().toString(),
          preview: URL.createObjectURL(file),
          main: true,
          title: file.name.split('.')[0],
          alt: '',
          description: '',
        })
      )

      setFile(newFiles[0])
      console.log('#230 onDrop:', newFiles)
      for (const file of newFiles) {
        submitFile(file)
      }
    }
  }

  const submitFile = async (file: any) => {
    const formData = new FormData()

    formData.append('file', file)
    formData.append('id', file.id)
    formData.append('title', file.title)
    formData.append('alt', file.alt)
    formData.append('description', file.description)
    formData.append('main', file.main)
    formData.append('targetFormat', targetFormat)

    console.log('#290 formData:', formData)
    const data = await uploadFile(formData)

    console.log(data)
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': [],
    },
    maxSize: 6 * 1024 * 1000, // 6 MB
    onDrop,
  })

  const removeFile = () => {
    deleteFile(file.id)
    setFile(null)
  }
  return (
    <>
      {/* Preview */}
      <section className="flex justify-center flex-col items-center space-y-2">
        {/* title */}
        <p className="text-md mb-2">{title}</p>
        <textarea
          name={name}
          className="hidden"
          value={file?.id || ''}
          readOnly
        />
        <div className="w-[74px] h-[74px] relative">
          {/* Accepted files */}
          <Image
            src={file?.preview || file?.srcSmall || defaultImageUrl}
            alt={file?.name || file?.alt || defaultImageUrl}
            width={100}
            height={100}
            //   onLoad={() => {
            //     URL.revokeObjectURL(file.preview);
            //   }}
            className={clsx(
              'h-full w-full cursor-pointer rounded-md object-contain shadow-sm'
            )}
          />
        </div>
        <div className="flex flex-row gap-2">
          <Button
            {...getRootProps({
              className: `text-xs`,
            })}
            variant={'ghost'}
            role="button"
            type="button"
          >
            <input {...getInputProps()} />
            <CameraIcon className="h-5 w-5 text-gray-500" />
          </Button>
          {file !== null && (
            <Button
              onClick={() => removeFile()}
              variant={'ghost'}
              role="button"
              type="button"
            >
              <TrashIcon className="h-5 w-5 text-gray-500" />
            </Button>
          )}
        </div>
        {hasError && (
          <div id={`${name}-error`} aria-live="polite" aria-atomic="true">
            {errorMessages.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
          </div>
        )}
      </section>
    </>
  )
}
