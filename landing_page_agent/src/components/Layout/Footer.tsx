import { Link } from 'react-router-dom'
import { FaGithub, FaTwitter, FaLinkedin, FaEnvelope, FaHeart } from 'react-icons/fa'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    product: [
      { label: 'Download', href: '#download' },
      { label: 'Features', href: '#features' },
      { label: 'Documentation', href: 'https://github.com/Dpro-at/AI-Agent-Player/tree/main/docs' },
      { label: 'Changelog', href: '#changelog' },
    ],
    community: [
      { label: 'GitHub', href: 'https://github.com/Dpro-at/AI-Agent-Player' },
      { label: 'Contribute', href: '/contribute' },
      { label: 'Issues', href: 'https://github.com/Dpro-at/AI-Agent-Player/issues' },
      { label: 'Discussions', href: 'https://github.com/Dpro-at/AI-Agent-Player/discussions' },
    ],
    legal: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'License', href: 'https://github.com/Dpro-at/AI-Agent-Player/blob/main/LICENSE' },
    ],
    company: [
      { label: 'About', href: 'https://dpro.at' },
      { label: 'Dpro GmbH', href: 'https://dpro.at/' },
      { label: 'Our Sponsor', href: '/sponsor' },
      { label: 'Flowxtra GmbH', href: 'http://flowxtra.com/' },
      { label: 'Contact', href: 'mailto:support@dpro.at' },
    ],
  }

  const socialLinks = [
    { icon: FaGithub, href: 'https://github.com/Dpro-at/AI-Agent-Player', label: 'GitHub' },
    { icon: FaTwitter, href: 'https://twitter.com/dpro_at', label: 'Twitter' },
    { icon: FaLinkedin, href: 'https://linkedin.com/company/dpro-at', label: 'LinkedIn' },
    { icon: FaEnvelope, href: 'mailto:support@dpro.at', label: 'Email' },
  ]

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-4">
              <img 
                src="/logo_white.png" 
                alt="Agent Player Logo" 
                className="h-20 w-auto"
              />
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Enterprise-grade AI agent management platform with privacy-first design and zero setup required.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  {link.href.startsWith('http') ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <a
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Community Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Community</h3>
            <ul className="space-y-3">
              {footerLinks.community.map((link) => (
                <li key={link.label}>
                  {link.href.startsWith('http') ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      to={link.href}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  {link.href.startsWith('http') ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      to={link.href}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-1 text-sm text-gray-400">
                <span>© {currentYear} Dpro GmbH. Made with</span>
                <FaHeart className="w-4 h-4 text-red-500" />
                <span>for the community.</span>
              </div>
              <div className="text-xs text-gray-500">
                Powered by <a href="https://dpro.at/" target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:text-primary-300 transition-colors">Dpro</a>
              </div>
            </div>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <span className="text-sm text-gray-400">
                Open Source • MIT License
              </span>
              <a
                href="https://github.com/Dpro-at/AI-Agent-Player/releases"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Latest Release
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer 