// پنل تنظیمات برای این بلاک
'use client'
import React, { useEffect, useState } from 'react'
import { useBuilderStore } from '@/components/builder-canvas/store/useBuilderStore'
import { Option } from '@/types'
import Text from '@/components/form-fields/text'
import Combobox from '@/components/form-fields/combobox'
import { getAllCampaigns } from '@/features/campaign/actions'
import { Campaign } from '@/features/campaign/interface'

type Props = {
  initialData: any
  savePage: () => void
}

export const ContentEditor = ({ initialData, savePage }: Props) => {
  const locale = 'fa'
  const { selectedBlock, update } = useBuilderStore()
  const [campaignOptions, setCampaignOptions] = useState<Option[]>([])
  useEffect(() => {
    const fetchData = async () => {
      const [allCampaigns] = await Promise.all([getAllCampaigns()])
      const campaignOptions: Option[] = allCampaigns.data.map(
        (campaign: Campaign) => {
          return {
            value: String(campaign.id),
            label: campaign.title,
          }
        }
      )
      setCampaignOptions([
        { label: 'هیچکدام', value: 'none' },
        ...campaignOptions,
      ])
    }

    fetchData()
  }, [])

  return (
    <div key={campaignOptions?.length}>
      <Text
        title="عنوان جایگاه"
        name="title"
        defaultValue={selectedBlock?.content?.title || ''}
        onChange={(e) => {
          update(selectedBlock?.id as string, 'content', {
            ...selectedBlock?.content,
            title: e.target.value,
          })
        }}
      />
      <Combobox
        title="کمپین متصل"
        name="linkedCampaign"
        defaultValue={selectedBlock?.content?.linkedCampaign ?? 'none'}
        placeholder={`کمپین متصل`}
        options={campaignOptions}
        onChange={(e) => {
          update(selectedBlock?.id as string, 'content', {
            ...selectedBlock?.content,
            linkedCampaign: e.target.value,
          })
        }}
      />
    </div>
  )
}
