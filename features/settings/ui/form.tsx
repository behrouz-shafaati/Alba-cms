import settingsCtrl from '../controller'
import { FormGeneral } from './form-general'
import pageCtrl from '@/features/page/controller'
import { SettingsTabs } from './settings-tab'
import { FormAppearance } from './form-appearance'
import { FormValidation } from './form-validation'
import { FormSMS } from './form-sms'
import { FormEmail } from './form-email'
import { FormAD } from './form-ad'
import { FormUsers } from './form-users'

type FormProps = {
  tab:
    | 'general'
    | 'appearance'
    | 'email'
    | 'validation'
    | 'sms'
    | 'ad'
    | 'users'
}

export default async function Form({ tab }: FormProps) {
  const [settings, allPages] = await Promise.all([
    settingsCtrl.findOne({ filters: { type: 'site-settings' } }),
    pageCtrl.findAll({}),
  ])

  return (
    <div>
      <SettingsTabs />
      {tab === 'general' && (
        <FormGeneral settings={settings} allPages={allPages.data} />
      )}
      {tab === 'appearance' && <FormAppearance settings={settings} />}
      {tab === 'ad' && <FormAD settings={settings} />}
      {tab === 'validation' && <FormValidation settings={settings} />}
      {tab === 'sms' && <FormSMS settings={settings} />}
      {tab === 'email' && <FormEmail settings={settings} />}
      {tab === 'users' && <FormUsers settings={settings} />}
    </div>
  )
}
