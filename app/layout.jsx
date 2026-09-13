import './globals.css'

export const metadata = {
  title: 'Kuyay Natural · Kéfir Artesanal',
  description:
    'Kéfir artesanal, queso crema de kéfir y frutas deshidratadas. 100% natural, hecho con amor.',
  metadataBase: process.env.NEXT_PUBLIC_APP_URL
    ? new URL(process.env.NEXT_PUBLIC_APP_URL)
    : undefined,
  openGraph: {
    title: 'Kuyay Natural · Kéfir Artesanal',
    description: 'Probióticos vivos, sabor de verdad. 100% natural, hecho con amor.',
    images: ['/images/variedad.jpeg'],
  },
}

export const viewport = {
  themeColor: '#123524',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" type="image/jpeg" href="/images/logo.jpeg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700;9..144,900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
