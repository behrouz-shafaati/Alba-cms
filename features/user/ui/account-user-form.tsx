'use client'
import { useActionState, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  User as UserIcon,
  Mail as MailIcon,
  Smartphone as PhoneIcon,
  ShieldQuestionIcon,
  KeyRound,
  Trash,
} from 'lucide-react'
// import { Separator } from "@/components/ui/separator";
import { Heading } from '@/components/ui/heading'
// import FileUpload from "@/components/FileUpload";
import { useToast } from '../../../hooks/use-toast'
import roleCtrl from '@/features/role/controller'
import {
  deleteUsersAction,
  updateAccountUserAction,
} from '@/features/user/actions'
import Text from '../../../components/form-fields/text'
import SubmitButton from '../../../components/form-fields/submit-button'
import MultipleSelector, {
  Option,
} from '../../../components/form-fields/multiple-selector'
import { AlertModal } from '../../../components/modal/alert-modal'
import ProfileUpload from '../../../components/form-fields/profile-upload'
import { Role } from '@/features/role/interface'
import { can } from '@/lib/utils/can.client'
import AccessDenied from '@/components/access-denied'
import StickyBox from 'react-sticky-box'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn, getTranslation } from '@/lib/utils'
import { User } from 'next-auth'
// import FileUpload from "../file-upload";

interface ProductFormProps {
  user: User | null
  lodginedUser: User | null
}

export const AccountUserForm: React.FC<ProductFormProps> = ({
  user,
  lodginedUser,
}) => {
  const locale = 'fa'
  const META_DESC_LIMIT = 300
  const router = useRouter()
  const lodginedUserRoles = lodginedUser?.roles || []
  if (lodginedUser?.id !== user?.id || !user) {
    return <AccessDenied />
  }
  const canEdit = can(
    lodginedUserRoles,
    lodginedUser?.id !== user?.id ? 'user.edit.any' : 'user.edit.own'
  )

  const initialState = {
    message: null,
    errors: {},
    values: { roles: [], ...user },
  }
  const actionHandler = updateAccountUserAction.bind(null, String(user.id))
  const [state, dispatch] = useActionState(actionHandler as any, initialState)
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [imgLoading, setImgLoading] = useState(false)

  const translation = getTranslation({ translations: user.translations })
  const [about, setAbout] = useState(translation?.about || '')
  useEffect(() => {
    if (state.message && state.message !== null)
      toast({
        variant: state?.success ? 'default' : 'destructive',
        title: '',
        description: state.message,
      })
  }, [state, toast])
  if (user && !canEdit) return <AccessDenied />
  const allRoles: Role[] = roleCtrl.getRoles()
  const roleOptions: Option[] = allRoles.map((role) => ({
    label: role.title,
    value: role.slug,
  }))
  const userRoles: Option[] = Array.isArray(state.values?.roles)
    ? state.values?.roles.map((slug: string) => {
        const findedRole: Role | undefined = allRoles.find(
          (role: Role) => role.slug == slug
        )
        return { label: findedRole?.title, value: slug }
      })
    : []

  const title = user ? 'ویرایش اطلاعات کاربری' : 'افزودن کاربر'
  const description = user ? user.name : 'افزودن یک کاربر'
  const toastMessage = user ? 'کاربر بروزرسانی شد' : 'کاربر اضافه شد'
  const action = user ? 'ذخیره تغییرات' : 'ذخیره'

  const onDelete = async () => {
    try {
      setLoading(true)
      const deleteResult = await deleteUsersAction([user?.id])
      if (deleteResult?.success) router.replace('/dashboard/users')
      else {
        setOpen(false)
        setLoading(false)
        toast({
          variant: deleteResult?.success ? 'default' : 'destructive',
          description: deleteResult?.message,
        })
      }
    } catch (error: any) {}
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {false && (
          <AlertModal
            isOpen={open}
            onClose={() => setOpen(false)}
            onConfirm={onDelete}
            loading={loading}
          />
        )}

        {user && false && (
          <>
            <AlertModal
              isOpen={open}
              onClose={() => setOpen(false)}
              onConfirm={onDelete}
              loading={loading}
            />
            <Button
              disabled={loading}
              variant="destructive"
              size="sm"
              onClick={() => setOpen(true)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
      {/* <Separator /> */}
      <form action={dispatch} className="md:grid md:grid-cols-12 gap-8">
        <input type="hidden" name="locale" value="fa" />
        <div className="col-span-12 md:col-span-9 grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* First Name */}
          <Text
            title="نام"
            name="firstName"
            defaultValue={state.values?.firstName || ''}
            placeholder="نام"
            state={state}
            icon={<UserIcon className="w-4 h-4" />}
            className=""
          />

          {/* Last Name */}
          <Text
            title="نام خانوادگی"
            name="lastName"
            defaultValue={state.values?.lastName}
            placeholder="نام خانوادگی"
            state={state}
            icon={<UserIcon className="w-4 h-4" />}
            className=""
          />
          {/* Email */}
          <Text
            title="ایمیل"
            name="email"
            defaultValue={state.values?.email}
            placeholder="ایمیل"
            state={state}
            icon={<MailIcon className="w-4 h-4" />}
            className=""
          />
          {/* userName */}
          <Text
            title="نام کاربری"
            name="userName"
            defaultValue={state.values?.userName}
            placeholder="نام کاربری"
            state={state}
            icon={<MailIcon className="w-4 h-4" />}
            className=""
            readOnly
          />
          {/* Mobile */}
          <Text
            title="موبایل"
            name="mobile"
            defaultValue={state.values?.mobile}
            placeholder="موبایل"
            state={state}
            icon={<PhoneIcon className="w-4 h-4" />}
            className=""
          />
          {/* Roles */}
          <MultipleSelector
            title="نقش"
            name="roles"
            defaultValues={userRoles}
            placeholder="نقش های کاربر را انتخاب کنید"
            state={state}
            defaultSuggestions={roleOptions}
            icon={<ShieldQuestionIcon className="w-4 h-4" />}
            className=""
            disabled
          />
          {/* Password */}
          <Text
            title="رمز ورود"
            name="password"
            type="password"
            placeholder="رمز ورود"
            description={
              user &&
              'اگر می خواهید رمز ورود را تغییر دهید، این فیلد را پر کنید.'
            }
            state={state}
            icon={<KeyRound className="w-4 h-4" />}
            className=""
          />
          <div className="">
            {/* Meta Description */}
            <div className="space-y-1">
              <Label htmlFor="about">معرفی</Label>
              <Textarea
                id="about"
                name="about"
                defaultValue={state.values?.about}
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                maxLength={META_DESC_LIMIT}
                rows={3}
                placeholder="معرفی کوتاه کاربر..."
              />
              <p
                className={cn(
                  'text-xs text-gray-500 text-right',
                  about.length > META_DESC_LIMIT - 20 && 'text-yellow-600',
                  about.length >= META_DESC_LIMIT && 'text-red-600'
                )}
              >
                {about.length}/{META_DESC_LIMIT} کاراکتر
              </p>
            </div>
          </div>
        </div>

        <div className="relative col-span-12 md:col-span-3 gap-2">
          <StickyBox offsetBottom={0}>
            <ProfileUpload title="" name="image" defaultValue={user?.image} />
            <SubmitButton loading={loading} className="my-4 w-full" />
          </StickyBox>
        </div>
      </form>
    </>
  )
}
