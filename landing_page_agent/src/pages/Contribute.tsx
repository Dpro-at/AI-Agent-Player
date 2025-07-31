import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { FaGithub, FaCode, FaBug, FaLightbulb, FaUsers, FaBook, FaHeart, FaRocket } from 'react-icons/fa'

const Contribute = () => {
  const contributionTypes = [
    {
      icon: FaCode,
      title: 'Code Contributions',
      description: 'Help us build features, fix bugs, and improve performance.',
      color: 'blue',
      actions: [
        'Add new AI service integrations',
        'Improve the user interface',
        'Optimize performance',
        'Add unit and integration tests'
      ]
    },
    {
      icon: FaBug,
      title: 'Bug Reports',
      description: 'Found a bug? Help us identify and fix issues.',
      color: 'red',
      actions: [
        'Report bugs with detailed steps',
        'Test beta versions',
        'Verify bug fixes',
        'Improve error handling'
      ]
    },
    {
      icon: FaLightbulb,
      title: 'Feature Ideas',
      description: 'Share your ideas for new features and improvements.',
      color: 'yellow',
      actions: [
        'Suggest new features',
        'Discuss user experience improvements',
        'Propose AI model integrations',
        'Share use case scenarios'
      ]
    },
    {
      icon: FaBook,
      title: 'Documentation',
      description: 'Help us improve documentation and tutorials.',
      color: 'green',
      actions: [
        'Write user guides',
        'Improve API documentation',
        'Create video tutorials',
        'Translate documentation'
      ]
    }
  ]

  const techStack = [
    { name: 'Rust', description: 'Core desktop application' },
    { name: 'Tauri', description: 'Cross-platform desktop framework' },
    { name: 'React', description: 'Frontend user interface' },
    { name: 'TypeScript', description: 'Type-safe development' },
    { name: 'FastAPI', description: 'Backend API (for web features)' },
    { name: 'SQLite', description: 'Local data storage' }
  ]

  const getStartedSteps = [
    {
      step: 1,
      title: 'Fork the Repository',
      description: 'Create your own copy of the Agent Player repository on GitHub.',
      action: 'Fork on GitHub'
    },
    {
      step: 2,
      title: 'Set Up Development Environment',
      description: 'Clone your fork and install Rust, Node.js, and other dependencies.',
      action: 'Follow Setup Guide'
    },
    {
      step: 3,
      title: 'Pick an Issue',
      description: 'Browse open issues and find something that matches your skills.',
      action: 'Browse Issues'
    },
    {
      step: 4,
      title: 'Make Your Changes',
      description: 'Create a feature branch and implement your changes.',
      action: 'Start Coding'
    },
    {
      step: 5,
      title: 'Submit Pull Request',
      description: 'Push your changes and create a pull request for review.',
      action: 'Create PR'
    }
  ]

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Helmet>
        <title>Contribute - Agent Player</title>
        <meta name="description" content="Join the Agent Player open source community. Contribute code, report bugs, suggest features, and help build the future of AI agent management." />
      </Helmet>

      {/* Hero Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-16 h-16 mx-auto mb-8 bg-gradient-to-r from-primary-600 to-accent-500 rounded-2xl flex items-center justify-center">
              <FaUsers className="w-8 h-8 text-white" />
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Join Our <span className="gradient-text">Community</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Help us build the future of AI agent management. Agent Player is open source 
              and welcomes contributors from around the world.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <motion.a
                href="https://github.com/Dpro-at/AI-Agent-Player"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-lg px-8 py-4 flex items-center space-x-3"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaGithub className="w-5 h-5" />
                <span>View on GitHub</span>
              </motion.a>
              
              <motion.a
                href="https://github.com/Dpro-at/AI-Agent-Player/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-lg px-8 py-4 flex items-center space-x-3"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaRocket className="w-5 h-5" />
                <span>Browse Issues</span>
              </motion.a>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <FaHeart className="w-4 h-4 text-red-500" />
                <span>Open Source</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaCode className="w-4 h-4 text-blue-500" />
                <span>MIT License</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaUsers className="w-4 h-4 text-green-500" />
                <span>Community Driven</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Ways to Contribute */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Ways to <span className="gradient-text">Contribute</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              There are many ways to contribute to Agent Player, regardless of your experience level
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {contributionTypes.map((type, index) => (
              <motion.div
                key={type.title}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className={`w-12 h-12 bg-${type.color}-100 rounded-lg flex items-center justify-center mb-6`}>
                  <type.icon className={`w-6 h-6 text-${type.color}-600`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{type.title}</h3>
                <p className="text-gray-600 mb-4">{type.description}</p>
                <ul className="space-y-2">
                  {type.actions.map((action, actionIndex) => (
                    <li key={actionIndex} className="flex items-center text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-primary-600 rounded-full mr-3"></div>
                      {action}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Technology <span className="gradient-text">Stack</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Agent Player is built with modern technologies
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {techStack.map((tech, index) => (
              <motion.div
                key={tech.name}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{tech.name}</h3>
                <p className="text-gray-600 text-sm">{tech.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Getting Started */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Getting <span className="gradient-text">Started</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ready to contribute? Follow these steps to get started
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {getStartedSteps.map((step, index) => (
              <motion.div
                key={step.step}
                className="flex items-start mb-8 last:mb-0"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex-shrink-0 w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-semibold mr-6">
                  {step.step}
                </div>
                <div className="flex-grow">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600 mb-3">{step.description}</p>
                  <button className="text-primary-600 hover:text-primary-700 font-medium">
                    {step.action} →
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Guidelines */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Community <span className="gradient-text">Guidelines</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We strive to maintain a welcoming and inclusive community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Code of Conduct</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  Be respectful and inclusive in all interactions
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  Provide constructive feedback and suggestions
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  Help newcomers get started with the project
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  Focus on what's best for the community
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Contribution Standards</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  Follow the coding standards and conventions
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  Write clear commit messages and documentation
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  Test your changes before submitting
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  Be open to feedback and iteration
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Make an Impact?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Join hundreds of developers who are building the future of AI agent management
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.a
                href="https://github.com/Dpro-at/AI-Agent-Player"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold flex items-center space-x-3 hover:bg-gray-100 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaGithub className="w-5 h-5" />
                <span>Start Contributing</span>
              </motion.a>
              
              <motion.a
                href="https://github.com/Dpro-at/AI-Agent-Player/discussions"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold flex items-center space-x-3 hover:bg-white hover:text-primary-600 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaUsers className="w-5 h-5" />
                <span>Join Discussion</span>
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Contribute 