import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaExternalLinkAlt, FaHeart, FaStar, FaRocket } from 'react-icons/fa'
import { Helmet } from 'react-helmet-async'

const Sponsor = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <Helmet>
        <title>Our Sponsor - Agent Player</title>
        <meta name="description" content="Meet Flowxtra GmbH, our proud sponsor supporting Agent Player development." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        {/* Hero Section */}
        <section className="pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Our <span className="gradient-text">Sponsor</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
                We're proud to be supported by industry leaders who believe in our vision
              </p>
            </motion.div>
          </div>
        </section>

        {/* Main Sponsor Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="bg-white rounded-3xl shadow-xl p-12 border border-gray-100"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Logo and Info */}
                <div className="text-center lg:text-left">
                  <div className="mb-8">
                    {/* Flowxtra Logo */}
                    <div className="mb-6">
                      <img 
                        src="/flowxtra-main.png" 
                        alt="Flowxtra GmbH Logo" 
                        className="w-48 h-auto mx-auto lg:mx-0 object-contain"
                      />
                    </div>
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                      Flowxtra GmbH
                    </h2>
                    <p className="text-xl text-primary-600 mb-6">
                      Our Proud Sponsor
                    </p>
                  </div>

                  <div className="space-y-4 mb-8">
                    <p className="text-gray-600 leading-relaxed">
                      Flowxtra GmbH is our main sponsor, supporting the development and growth of Agent Player. 
                      Through their platform, you can create powerful automation workflows and integrate AI agents 
                      for various business processes.
                    </p>
                    <p className="text-gray-600 leading-relaxed">
                      With Flowxtra, you can build sophisticated HR agents, customer service automation, 
                      and much more using our Agent Player technology.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <motion.a
                      href="http://flowxtra.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary text-lg px-8 py-4 flex items-center justify-center space-x-3"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span>Visit Flowxtra</span>
                      <FaExternalLinkAlt className="w-4 h-4" />
                    </motion.a>
                    <motion.button
                      className="btn-secondary text-lg px-8 py-4 flex items-center justify-center space-x-3"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaHeart className="w-5 h-5" />
                      <span>Thank You</span>
                    </motion.button>
                  </div>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 gap-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    What Flowxtra Offers:
                  </h3>
                  
                  {[
                    {
                      icon: FaRocket,
                      title: 'Workflow Automation',
                      description: 'Create powerful automation workflows with drag-and-drop interface'
                    },
                    {
                      icon: FaStar,
                      title: 'AI Agent Integration',
                      description: 'Seamlessly integrate Agent Player AI agents into your business processes'
                    },
                    {
                      icon: FaHeart,
                      title: 'HR Agent Solutions',
                      description: 'Build sophisticated HR agents for recruitment, onboarding, and employee management'
                    }
                  ].map((feature, index) => (
                    <motion.div
                      key={index}
                      className="bg-gray-50 rounded-xl p-6 border border-gray-100"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                    >
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                          <feature.icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-2">
                            {feature.title}
                          </h4>
                          <p className="text-gray-600">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-gradient-to-r from-primary-600 to-accent-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Experience the Power of Flowxtra + Agent Player
              </h2>
              <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
                Combine the automation capabilities of Flowxtra with the AI intelligence of Agent Player
              </p>
              <motion.a
                href="http://flowxtra.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-3 bg-white text-primary-600 font-semibold px-8 py-4 rounded-full hover:bg-gray-50 transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Get Started with Flowxtra</span>
                <FaExternalLinkAlt className="w-4 h-4" />
              </motion.a>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  )
}

export default Sponsor 