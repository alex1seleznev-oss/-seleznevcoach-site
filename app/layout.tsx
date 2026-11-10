import type {Metadata} from 'next';
import Script from 'next/script';
export const metadata:Metadata={metadataBase:new URL('https://seleznevcoach.ru'),icons:{icon:'/favicon.svg'}};
export default function RootLayout({children}:{children:React.ReactNode}) {
 return <html lang="ru"><head><link rel="preload" href="/fonts/onest-variable.ttf" as="font" type="font/ttf" crossOrigin="anonymous"/><link rel="stylesheet" href="/legacy-next/static/css/7e4bb42e68c0a8e6.css"/><link rel="stylesheet" href="/legacy-next/static/css/7b4429b70e1e6d3f.css"/><link rel="stylesheet" href="/motion-refresh.css?v=native-1"/><link rel="stylesheet" href="/premium-sports.css?v=faq-1"/><link rel="stylesheet" href="/native-home.css?v=native-3"/><link rel="stylesheet" href="/experience-hero.css?v=portal-1"/><link rel="stylesheet" href="/service-finish.css?v=leads-1"/><link rel="stylesheet" href="/editorial-seo.css?v=journal-4"/></head><body className="native-home">{children}<Script src="/site.js?v=leads-1" strategy="afterInteractive"/></body></html>;
}
