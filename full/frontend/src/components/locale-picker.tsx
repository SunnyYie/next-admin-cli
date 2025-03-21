import useLocale, { LANGUAGE_MAP } from '../locales/use-locale'
import type { MenuProps } from 'antd'
import { SvgIcon } from './icon'
import { Dropdown } from 'antd'

export enum LocalEnum {
  en_US = 'en_US',
  zh_CN = 'zh_CN',
}

type Locale = keyof typeof LocalEnum

export default function LocalePicker() {
  const { setLocale, locale } = useLocale()

  const localeList: MenuProps['items'] = Object.values(LANGUAGE_MAP).map(item => {
    return {
      key: item.locale,
      label: item.label,
      icon: <SvgIcon icon={item.icon} size="20" className="rounded-md" />,
    }
  })

  return (
    <Dropdown
      placement="bottomRight"
      trigger={['click']}
      menu={{ items: localeList, onClick: e => setLocale(e.key as Locale) }}
    >
      <div className="h-10 w-10 hover:scale-105 flex cursor-pointer items-center justify-center rounded-full p-2 hover:bg-hover">
        <SvgIcon icon={`ic-locale_${locale}`} size="24" className="rounded-md" />
      </div>
    </Dropdown>
  )
}
