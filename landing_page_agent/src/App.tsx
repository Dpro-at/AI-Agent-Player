import { Routes, Route } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import Navbar from './components/Layout/Navbar'
import Footer from './components/Layout/Footer'
import Home from './pages/Home'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'
import Contribute from './pages/Contribute'
import Sponsor from './pages/Sponsor'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Helmet>
        <title>Agent Player - Download AI Agent Management Platform</title>
        <meta name="description" content="Download Agent Player desktop app for Windows, Mac, and Linux. Enterprise-grade AI agent management platform with privacy-first design." />
      </Helmet>
      
      <Navbar />
      
      <main className="relative">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/contribute" element={<Contribute />} />
          <Route path="/sponsor" element={<Sponsor />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      
      <Footer />
    </div>
  )
}

export default App
