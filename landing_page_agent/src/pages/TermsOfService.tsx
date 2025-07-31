import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'

const TermsOfService = () => {
  return (
    <div className="pt-16 min-h-screen bg-white">
      <Helmet>
        <title>Terms of Service - Agent Player</title>
        <meta name="description" content="Agent Player Terms of Service - Open source software license and usage terms." />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-lg text-gray-600 mb-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Acceptance of Terms</h2>
              <p className="text-gray-600 mb-4">
                By downloading, installing, or using Agent Player, you agree to be bound by these Terms of Service. 
                If you do not agree to these terms, please do not use our software.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Open Source License</h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-4">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">MIT License</h3>
                <p className="text-blue-700 mb-4">
                  Agent Player is released under the MIT License, which grants you extensive rights to:
                </p>
                <ul className="list-disc list-inside text-blue-700 space-y-1">
                  <li>Use the software for any purpose</li>
                  <li>Study and modify the source code</li>
                  <li>Distribute copies of the software</li>
                  <li>Distribute modified versions</li>
                  <li>Use in commercial projects</li>
                </ul>
              </div>
              <p className="text-gray-600">
                The full MIT License text is available in our 
                <a href="https://github.com/Dpro-at/AI-Agent-Player/blob/main/LICENSE" className="text-primary-600 hover:underline ml-1">
                  GitHub repository
                </a>.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Software Description</h2>
              <p className="text-gray-600 mb-4">
                Agent Player is a desktop application for managing AI agents. The software:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
                <li>Runs entirely on your local device</li>
                <li>Does not collect or transmit personal data</li>
                <li>Connects to third-party AI services using your credentials</li>
                <li>Stores all data locally on your device</li>
                <li>Is provided free of charge</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">User Responsibilities</h2>
              <p className="text-gray-600 mb-4">When using Agent Player, you agree to:</p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
                <li><strong>Use at Your Own Risk:</strong> The software is provided "as is" without warranties</li>
                <li><strong>Comply with AI Service Terms:</strong> Follow the terms of service for any third-party AI services you connect to</li>
                <li><strong>Secure Your API Keys:</strong> Keep your API keys and credentials secure</li>
                <li><strong>Respect Usage Limits:</strong> Adhere to rate limits and usage policies of connected services</li>
                <li><strong>Use Responsibly:</strong> Do not use the software for illegal or harmful purposes</li>
                <li><strong>Report Issues:</strong> Report bugs and security issues through appropriate channels</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Third-Party Services</h2>
              <p className="text-gray-600 mb-4">
                Agent Player may connect to various AI services including but not limited to:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
                <li>OpenAI (ChatGPT, GPT-4, etc.)</li>
                <li>Anthropic (Claude)</li>
                <li>Google (Gemini)</li>
                <li>Local AI models (Ollama, LM Studio, etc.)</li>
                <li>Other AI service providers</li>
              </ul>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <p className="text-yellow-800">
                  <strong>Important:</strong> Each AI service has its own terms of service, privacy policy, 
                  and usage costs. You are responsible for understanding and complying with these terms.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Disclaimers and Limitations</h2>
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-4">
                <h3 className="text-lg font-semibold text-red-800 mb-2">No Warranty</h3>
                <p className="text-red-700">
                  Agent Player is provided "AS IS" without warranty of any kind. We make no guarantees 
                  about the software's functionality, reliability, or suitability for any purpose.
                </p>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Limitation of Liability</h3>
              <p className="text-gray-600 mb-4">
                To the maximum extent permitted by law, Dpro GmbH and the Agent Player contributors 
                shall not be liable for any damages arising from the use of this software, including 
                but not limited to:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
                <li>Direct, indirect, incidental, or consequential damages</li>
                <li>Loss of data, profits, or business opportunities</li>
                <li>Costs of third-party AI services</li>
                <li>Security breaches or data loss</li>
                <li>Software bugs or malfunctions</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Privacy and Data</h2>
              <p className="text-gray-600 mb-4">
                Agent Player is designed with privacy in mind:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
                <li>No personal data is collected by the application</li>
                <li>All data is stored locally on your device</li>
                <li>No telemetry or usage tracking</li>
                <li>Direct connections to AI services (no intermediary servers)</li>
              </ul>
              <p className="text-gray-600">
                For complete details, see our 
                <a href="/privacy" className="text-primary-600 hover:underline ml-1">Privacy Policy</a>.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Updates and Modifications</h2>
              <p className="text-gray-600 mb-4">
                We may update Agent Player from time to time. Updates may include:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
                <li>New features and improvements</li>
                <li>Bug fixes and security patches</li>
                <li>Support for additional AI services</li>
                <li>Performance optimizations</li>
              </ul>
              <p className="text-gray-600">
                Users are encouraged to keep the software updated for the best experience and security.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Termination</h2>
              <p className="text-gray-600 mb-4">
                You may stop using Agent Player at any time by uninstalling the software. 
                These terms remain in effect until terminated by either party.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Governing Law</h2>
              <p className="text-gray-600 mb-4">
                These terms are governed by the laws of Austria, where Dpro GmbH is incorporated, 
                without regard to conflict of law principles.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Information</h2>
              <p className="text-gray-600 mb-4">
                For questions about these Terms of Service:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Email: <a href="mailto:legal@dpro.at" className="text-primary-600 hover:underline">legal@dpro.at</a></li>
                <li>GitHub Issues: <a href="https://github.com/Dpro-at/AI-Agent-Player/issues" className="text-primary-600 hover:underline">Create an issue</a></li>
                <li>Address: Dpro GmbH, Austria</li>
              </ul>
            </section>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mt-8">
              <h3 className="text-lg font-semibold text-green-800 mb-2">Open Source Community</h3>
              <p className="text-green-700">
                Agent Player is built by and for the community. We welcome contributions, feedback, 
                and collaboration from users worldwide. Join us on GitHub to be part of the development process.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default TermsOfService 