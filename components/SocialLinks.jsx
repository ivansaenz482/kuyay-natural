'use client'

import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react'
import { useSettings } from '../context/SettingsContext'
import TikTokIcon from './TikTokIcon'

export const SOCIAL_FIELDS = [
  { key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/tu-usuario', Icon: Instagram },
  { key: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/tu-pagina', Icon: Facebook },
  { key: 'tiktok', label: 'TikTok', placeholder: 'https://tiktok.com/@tu-usuario', Icon: TikTokIcon },
  { key: 'youtube', label: 'YouTube', placeholder: 'https://youtube.com/@tu-canal', Icon: Youtube },
  { key: 'x', label: 'X (Twitter)', placeholder: 'https://x.com/tu-usuario', Icon: Twitter },
]

export default function SocialLinks({ className = '' }) {
  const { social } = useSettings()
  const items = SOCIAL_FIELDS.filter((f) => social?.[f.key])

  if (!items.length) return null

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {items.map((f) => (
        <a
          key={f.key}
          href={social[f.key]}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={f.label}
          title={f.label}
          className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white transition hover:-translate-y-0.5 hover:bg-kuyay-lime hover:text-kuyay-forest"
        >
          <f.Icon className="h-4 w-4" />
        </a>
      ))}
    </div>
  )
}
