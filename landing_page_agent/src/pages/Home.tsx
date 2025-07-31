import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { FaDownload, FaGithub, FaStar, FaEye, FaUsers, FaCode, FaLock, FaRocket, FaWindows, FaApple, FaLinux } from 'react-icons/fa'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface GitHubStats {
  stars: number
  forks: number
  watchers: number
  downloads: number
}

const Home = () => {
  const heroRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)
  const [githubStats, setGithubStats] = useState<GitHubStats>({
    stars: 1,
    forks: 0,
    watchers: 0,
    downloads: 156 // Mock download counter
  })

  // GSAP Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero section animation
      const tl = gsap.timeline()
      
      tl.from('.hero-title', {
        y: 100,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
      })
      .from('.hero-subtitle', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
      }, '-=0.5')
      .from('.hero-buttons', {
        y: 30,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out'
      }, '-=0.3')
      .from('.hero-stats', {
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1
      }, '-=0.2')

      // Features animation on scroll
      gsap.from('.feature-card', {
        scrollTrigger: {
          trigger: featuresRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse'
        },
        y: 50,
        opacity: 0,
        duration: 0.6,
        stagger: 0.2,
        ease: 'power3.out'
      })

      // Floating animation for logo
      gsap.to('.floating-logo', {
        y: -10,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'power2.inOut'
      })

    }, heroRef)

    return () => ctx.revert()
  }, [])

  // Fetch GitHub stats
  useEffect(() => {
    const fetchGitHubStats = async () => {
      try {
        const response = await fetch('https://api.github.com/repos/Dpro-at/AI-Agent-Player')
        const data = await response.json()
        
        setGithubStats({
          stars: data.stargazers_count || 1,
          forks: data.forks_count || 0,
          watchers: data.watchers_count || 0,
          downloads: githubStats.downloads + Math.floor(Math.random() * 5) // Simulate downloads
        })
      } catch (error) {
        console.log('GitHub API limit reached, using mock data')
      }
    }

    fetchGitHubStats()
    // Update downloads counter every 30 seconds
    const interval = setInterval(() => {
      setGithubStats(prev => ({
        ...prev,
        downloads: prev.downloads + Math.floor(Math.random() * 3)
      }))
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const features = [
    {
      icon: FaRocket,
      title: 'Zero Setup Required',
      description: 'Download and run immediately. No complex configuration or dependencies needed.'
    },
    {
                  icon: FaLock,
      title: 'Privacy First',
      description: 'Your data stays on your device. No telemetry, no tracking, complete privacy control.'
    },
    {
      icon: FaCode,
      title: 'Open Source',
      description: 'Fully open source under MIT license. Contribute, modify, and customize as needed.'
    },
    {
      icon: FaUsers,
      title: 'Enterprise Ready',
      description: 'Built for teams and enterprises with advanced security and management features.'
    }
  ]

  const downloadOptions = [
    {
      platform: 'Windows',
                  icon: FaWindows,
      file: 'agent-player-windows.msi',
      size: '45 MB',
      arch: '64-bit'
    },
    {
      platform: 'macOS',
              icon: FaApple,
      file: 'agent-player-macos.dmg',
      size: '52 MB',
      arch: 'Universal'
    },
    {
      platform: 'Linux',
              icon: FaLinux,
      file: 'agent-player-linux.AppImage',
      size: '48 MB',
      arch: '64-bit'
    }
  ]

  return (
    <div ref={heroRef} className="pt-16">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">


          {/* Main Heading */}
          <h1 className="hero-title text-6xl md:text-7xl lg:text-8xl font-bold text-gray-900 mb-6">
            Agent <span className="gradient-text">Player</span>
          </h1>
          
          <p className="hero-subtitle text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Enterprise-grade AI agent management platform with 
            <span className="font-semibold text-primary-600"> privacy-first design</span> and 
            <span className="font-semibold text-primary-600"> zero setup</span> required.
          </p>

          {/* Download Buttons */}
          <div className="hero-buttons flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <motion.button
              className="btn-primary text-lg px-8 py-4 flex items-center space-x-3 shadow-glow"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => document.getElementById('download')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <FaDownload className="w-5 h-5" />
              <span>Download Free</span>
            </motion.button>
            
            <motion.a
              href="https://github.com/Dpro-at/AI-Agent-Player"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-lg px-8 py-4 flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaGithub className="w-5 h-5" />
              <span>View on GitHub</span>
            </motion.a>
          </div>

          {/* GitHub Stats */}
          <div className="hero-stats flex flex-wrap items-center justify-center gap-8 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <FaStar className="w-4 h-4 text-yellow-500" />
              <span>{githubStats.stars} stars</span>
            </div>
            <div className="flex items-center space-x-2">
              <FaCode className="w-4 h-4 text-blue-500" />
              <span>{githubStats.forks} forks</span>
            </div>
            <div className="flex items-center space-x-2">
              <FaEye className="w-4 h-4 text-green-500" />
              <span>{githubStats.watchers} watching</span>
            </div>
            <div className="flex items-center space-x-2">
              <FaDownload className="w-4 h-4 text-purple-500" />
              <span>{githubStats.downloads.toLocaleString()} downloads</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose <span className="gradient-text">Agent Player</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built with modern technologies and enterprise needs in mind
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                className="feature-card bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
                whileHover={{ y: -5 }}
              >
                <div className="w-12 h-12 bg-gradient-to-r from-primary-600 to-accent-500 rounded-lg flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section id="download" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Download for Your Platform
            </h2>
            <p className="text-xl text-gray-600">
              Available for Windows, macOS, and Linux
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {downloadOptions.map((option) => (
              <motion.div
                key={option.platform}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-100"
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <div className="text-center">
                  <option.icon className="w-16 h-16 mx-auto mb-4 text-gray-700" />
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">{option.platform}</h3>
                  <p className="text-gray-600 mb-4">{option.size} • {option.arch}</p>
                  <motion.button
                    className="btn-primary w-full flex items-center justify-center space-x-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setGithubStats(prev => ({ ...prev, downloads: prev.downloads + 1 }))
                      // Here you would trigger the actual download
                      console.log(`Downloading ${option.file}`)
                    }}
                  >
                    <FaDownload className="w-4 h-4" />
                    <span>Download</span>
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">
              Total downloads: <span className="font-semibold text-primary-600">{githubStats.downloads.toLocaleString()}</span>
            </p>
            <p className="text-sm text-gray-500">
              All downloads are free and open source under MIT license
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home 