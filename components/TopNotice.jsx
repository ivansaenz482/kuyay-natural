'use client'

import { useSettings } from '../context/SettingsContext'

export default function TopNotice() {
  const { topNotice } = useSettings()
  if (!topNotice?.enabled || !topNotice?.text) return null

  return (
    <div className="bg-kuyay-forest px-4 py-2 text-center">
      <p className="mx-auto max-w-5xl text-[11px] font-semibold leading-snug text-kuyay-lime sm:text-xs">
        {topNotice.text}
      </p>
    </div>
  )
}
