// components/Footer.tsx
import Link from 'next/link'
import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa'
import { footerData } from '@/data/footerData'

export default function Footer() {
  const { brand, copyright, socialLinks } = footerData

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'FaGithub': return <FaGithub className="h-6 w-6" />
      case 'FaTwitter': return <FaTwitter className="h-6 w-6" />
      case 'FaLinkedin': return <FaLinkedin className="h-6 w-6" />
      default: return null
    }
  }

  return (
    <footer className="bg-card text-text border-t border-gray-200 dark:border-gray-800">
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link href="/" className="text-xl font-bold text-primary">
              {brand}
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
              {copyright}
            </p>
          </div>
          
          <div className="flex space-x-6">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors"
                aria-label={social.name}
              >
                {getIcon(social.icon)}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}