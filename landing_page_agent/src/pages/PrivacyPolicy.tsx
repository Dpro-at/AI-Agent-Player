import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'

const PrivacyPolicy = () => {
  return (
    <div className="pt-16 min-h-screen bg-white">
      <Helmet>
        <title>Privacy Policy - Agent Player</title>
        <meta name="description" content="Agent Player Privacy Policy - Your data stays on your device. Complete privacy protection." />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-lg text-gray-600 mb-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Commitment to Privacy</h2>
              <p className="text-gray-600 mb-4">
                At Agent Player, we believe your privacy is fundamental. Our desktop application is designed 
                with a <strong>privacy-first approach</strong> - your data stays on your device, and we collect 
                no personal information or usage data.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Collection</h2>
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-4">
                <h3 className="text-lg font-semibold text-green-800 mb-2">What We DON'T Collect:</h3>
                <ul className="list-disc list-inside text-green-700 space-y-1">
                  <li>Personal identification information</li>
                  <li>Usage analytics or telemetry</li>
                  <li>AI conversations or prompts</li>
                  <li>Configuration data</li>
                  <li>API keys or credentials</li>
                  <li>Location data</li>
                  <li>Device information</li>
                </ul>
              </div>
              <p className="text-gray-600">
                Agent Player operates entirely on your local device. All your AI agents, conversations, 
                and configurations are stored locally and never transmitted to our servers.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Local Data Storage</h2>
              <p className="text-gray-600 mb-4">
                All application data is stored locally on your device in the following locations:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
                <li><strong>Windows:</strong> <code>%APPDATA%/AgentPlayer/</code></li>
                <li><strong>macOS:</strong> <code>~/Library/Application Support/AgentPlayer/</code></li>
                <li><strong>Linux:</strong> <code>~/.config/AgentPlayer/</code></li>
              </ul>
              <p className="text-gray-600">
                You have complete control over this data and can delete it at any time by uninstalling 
                the application or manually removing the configuration folder.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Third-Party Services</h2>
              <p className="text-gray-600 mb-4">
                Agent Player may connect to third-party AI services (like OpenAI, Anthropic, etc.) 
                based on your configuration. Important notes:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
                <li>These connections are made directly from your device to the AI service</li>
                <li>We do not intercept, store, or have access to these communications</li>
                <li>Each AI service has its own privacy policy that applies to your usage</li>
                <li>You provide your own API keys and credentials</li>
                <li>All data handling is governed by the respective AI service's terms</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Open Source Transparency</h2>
              <p className="text-gray-600 mb-4">
                Agent Player is fully open source under the MIT license. You can:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
                <li>Review our complete source code on <a href="https://github.com/Dpro-at/AI-Agent-Player" className="text-primary-600 hover:underline">GitHub</a></li>
                <li>Verify that no telemetry or tracking code exists</li>
                <li>Contribute to the project or create your own version</li>
                <li>Audit the security and privacy implementations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Website Privacy</h2>
              <p className="text-gray-600 mb-4">
                This website (agent-player.com) may use basic analytics to understand usage patterns. 
                However, the desktop application itself contains no tracking or analytics whatsoever.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Changes to This Policy</h2>
              <p className="text-gray-600 mb-4">
                Given our privacy-first approach, changes to this policy will be minimal. Any updates 
                will be posted on this page and announced in our GitHub repository.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
              <p className="text-gray-600 mb-4">
                If you have questions about this Privacy Policy or our privacy practices:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Email: <a href="mailto:privacy@dpro.at" className="text-primary-600 hover:underline">privacy@dpro.at</a></li>
                <li>GitHub Issues: <a href="https://github.com/Dpro-at/AI-Agent-Player/issues" className="text-primary-600 hover:underline">Create an issue</a></li>
                <li>GitHub Discussions: <a href="https://github.com/Dpro-at/AI-Agent-Player/discussions" className="text-primary-600 hover:underline">Start a discussion</a></li>
              </ul>
            </section>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Privacy by Design</h3>
              <p className="text-blue-700">
                Agent Player is built with privacy by design principles. Your data never leaves your device, 
                ensuring complete privacy and security for your AI agent management needs.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default PrivacyPolicy 