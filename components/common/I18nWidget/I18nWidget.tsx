import cn from 'classnames'
import Link from 'next/link'
import { FC, useState } from 'react'
import { useRouter } from 'next/router'
import s from './I18nWidget.module.css'
import { Cross, ChevronUp } from '@components/icons'
import ClickOutside from '@lib/click-outside'
interface LOCALE_DATA {
  name: string
  img: {
    filename: string
    alt: string
  }
}

const LOCALES_MAP: Record<string, LOCALE_DATA> = {
  es: {
    name: 'Español',
    img: {
      filename: 'flag-es-co.svg',
      alt: 'Bandera Colombiana',
    },
  },
  'en-US': {
    name: 'English',
    img: {
      filename: 'flag-en-us.svg',
      alt: 'US Flag',
    },
  },
}

const I18nWidget: FC = () => {
  const [display, setDisplay] = useState(false)
  const {
    locale,
    locales,
    defaultLocale = 'en-US',
    asPath: currentPath,
  } = useRouter()

  const options = locales?.filter((val) => val !== locale)
  const currentLocale = locale || defaultLocale

  return (
    <ClickOutside active={display} onClick={() => setDisplay(false)}>
      <nav className={s.root}>
        <div
          className="flex items-center relative"
          onClick={() => setDisplay(!display)}
        >
          <button className={s.button} aria-label="Language selector">
            <img
              className="block mr-2 w-5"
              src={`/${LOCALES_MAP[currentLocale].img.filename}`}
              alt={LOCALES_MAP[currentLocale].img.alt}
            />
            {options && (
              <span className="cursor-pointer">
                <ChevronUp className={cn({ [s.icon]: display })} />
              </span>
            )}
          </button>
        </div>
        <div className="absolute top-0 right-0">
          {options?.length && display ? (
            <div className={s.dropdownMenu}>
              <div className="flex flex-row justify-end px-6">
                <button
                  onClick={() => setDisplay(false)}
                  aria-label="Close panel"
                  className={s.closeButton}
                >
                  <Cross className="h-6 w-6" />
                </button>
              </div>
              <ul>
                {options.map((locale) => (
                  <li key={locale}>
                    <Link href={currentPath} locale={locale}>
                      <a
                        className={cn(s.item)}
                        onClick={() => setDisplay(false)}
                      >
                        {LOCALES_MAP[locale].name}
                      </a>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </nav>
    </ClickOutside>
  )
}

export default I18nWidget
