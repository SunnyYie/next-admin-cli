import { ThemeColorPresets, ThemeLayout, ThemeMode } from '@/types/layout/type'
import { FontFamilyPreset, typographyTokens } from '../theme/tokens/typography'
import { createJSONStorage, persist } from 'zustand/middleware'
import { StorageEnum } from '@/types/store/type'
import { create } from 'zustand'

type SettingsType = {
  themeColorPresets: ThemeColorPresets
  themeMode: ThemeMode
  themeLayout: ThemeLayout
  themeStretch: boolean
  breadCrumb: boolean
  multiTab: boolean
  darkSidebar: boolean
  fontFamily: string
  fontSize: number
  direction: 'ltr' | 'rtl'
}
type SettingStore = {
  settings: SettingsType
  actions: {
    setSettings: (settings: SettingsType) => void
    clearSettings: () => void
  }
}

const useSettingStore = create<SettingStore>()(
  persist(
    set => ({
      settings: {
        themeColorPresets: ThemeColorPresets.Default,
        themeMode: ThemeMode.Light,
        themeLayout: ThemeLayout.Vertical,
        themeStretch: false,
        breadCrumb: true,
        multiTab: true,
        darkSidebar: false,
        fontFamily: FontFamilyPreset.openSans,
        fontSize: Number(typographyTokens.fontSize.sm),
        direction: 'ltr',
      },
      actions: {
        setSettings: settings => {
          set({ settings })
        },
        clearSettings() {
          useSettingStore.persist.clearStorage()
        },
      },
    }),
    {
      name: StorageEnum.Settings,
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({ [StorageEnum.Settings]: state.settings }),
    },
  ),
)

export const useSettings = () => useSettingStore(state => state.settings)
export const useSettingActions = () => useSettingStore(state => state.actions)
