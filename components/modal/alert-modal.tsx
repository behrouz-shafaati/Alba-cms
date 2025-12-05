'use client'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import Modal from './modal'

interface AlertModalProps {
  title?: any
  description?: any
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  loading: boolean
}

export const AlertModal: React.FC<AlertModalProps> = ({
  title,
  description,
  isOpen,
  onClose,
  onConfirm,
  loading,
}) => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  const ModalContent = () => (
    <div className="pt-6 space-x-reverse space-x-2 flex items-center justify-end w-full">
      <Button disabled={loading} variant="outline" onClick={onClose}>
        لغو
      </Button>
      <Button disabled={loading} variant="destructive" onClick={onConfirm}>
        ادامه
      </Button>
    </div>
  )
  return (
    <Modal
      title={title ? title : 'مطمئن هستید؟'}
      description={description ? description : 'این عمل غیر قابل بازگشت است'}
      isOpen={isOpen}
      onCloseModal={onClose}
      content={<ModalContent />}
    />
  )
}
