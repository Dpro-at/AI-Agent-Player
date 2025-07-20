import React, { useState, useEffect } from 'react';
import config from '../../../config';

interface ProfileData {
  user_type: string;
  first_name: string;
  last_name: string;
  company_name: string;
  email: string;
  phone: string;
  bio: string;
  country: string;
  city: string;
  current_position?: string;
  company_registration_number?: string;
  industry?: string;
  company_size?: string;
  founded_year?: number;
  subscription_type?: string;
  address_street?: string;
  address_city?: string;
  address_state?: string;
  address_zip?: string;
  address_country?: string;
}

// Dynamic Profile Selector Component - English
const ProfileSettings: React.FC = () => {
  const [profileData, setProfileData] = useState<ProfileData>({
    user_type: 'individual',
    first_name: '',
    last_name: '',
    company_name: '',
    email: '',
    phone: '',
    bio: '',
    country: 'SA',
    city: '',
    subscription_type: 'free'
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [activeUserType, setActiveUserType] = useState<string>('individual');
  const [dataLoaded, setDataLoaded] = useState(false);

  const handleInputChange = (field: string, value: string | number) => {
    setProfileData((prev: ProfileData) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUserTypeChange = (newType: string) => {
    setActiveUserType(newType);
    setProfileData((prev: ProfileData) => ({
      ...prev,
      user_type: newType,
      subscription_type: newType === 'individual' ? 'free' : 'basic'
    }));
  };

  // Load profile data on component mount
  const loadProfileData = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${config.api.baseURL}/users/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setProfileData(prev => ({
            ...prev,
            ...result.data
          }));
          setActiveUserType(result.data.user_type || 'individual');
        }
      }
    } catch (error) {
      console.error('Error loading profile data:', error);
    }
    setDataLoaded(true);
  };

  // Load data when component mounts
  useEffect(() => {
    if (!dataLoaded) {
      loadProfileData();
    }
  }, [dataLoaded]);

  const handleSave = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${config.api.baseURL}/users/profile`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setMessage('✅ Profile updated successfully!');
        } else {
          setMessage('❌ Failed to update profile');
        }
      } else {
        setMessage('❌ Failed to update profile');
      }
    } catch (error) {
      setMessage('❌ Error updating profile');
      console.error('Error:', error);
    }
    
    setLoading(false);
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div>
      {message && (
        <div style={{
          padding: '12px 16px',
          marginBottom: '24px',
          background: message.includes('✅') ? '#d4edda' : '#f8d7da',
          color: message.includes('✅') ? '#155724' : '#721c24',
          borderRadius: '8px',
          fontSize: '14px',
        }}>
          {message}
        </div>
      )}

      {/* Account Type Selection */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '24px',
        color: 'white'
      }}>
        <h3 style={{ 
          fontSize: '18px', 
          fontWeight: '600', 
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          margin: '0 0 16px 0'
        }}>
          👤 Account Type
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          {[
            { id: 'individual', label: 'Individual', icon: '👤', desc: 'Personal account for individuals' },
            { id: 'company', label: 'Company', icon: '🏢', desc: 'Business account for companies' },
            { id: 'freelancer', label: 'Freelancer', icon: '💼', desc: 'Professional account for freelancers' },
            { id: 'organization', label: 'Organization', icon: '🏛️', desc: 'Account for organizations' }
          ].map(type => (
            <button
              key={type.id}
              onClick={() => handleUserTypeChange(type.id)}
              style={{
                padding: '16px',
                background: activeUserType === type.id ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)',
                border: activeUserType === type.id ? '2px solid white' : '2px solid transparent',
                borderRadius: '8px',
                color: 'white',
                cursor: 'pointer',
                textAlign: 'center' as const,
                transition: 'all 0.2s',
              }}
            >
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>{type.icon}</div>
              <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '4px' }}>{type.label}</div>
              <div style={{ fontSize: '12px', opacity: 0.9 }}>{type.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Contact Information */}
      <div style={{
        background: '#f8f9fa',
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '24px',
      }}>
        <h3 style={{ 
          fontSize: '18px', 
          fontWeight: '600', 
          marginBottom: '20px',
          color: '#2c3e50',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          margin: '0 0 20px 0'
        }}>
          📧 Contact Information
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#2c3e50' }}>
              Email Address *
            </label>
            <input
              type="email"
              value={profileData.email || ''}
              onChange={(e) => handleInputChange('email', e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e1e5e9',
                borderRadius: '8px',
                fontSize: '14px',
                boxSizing: 'border-box' as const,
              }}
              placeholder="your.email@example.com"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#2c3e50' }}>
              Phone Number
            </label>
            <input
              type="tel"
              value={profileData.phone || ''}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e1e5e9',
                borderRadius: '8px',
                fontSize: '14px',
                boxSizing: 'border-box' as const,
              }}
              placeholder="+966 50 123 4567"
            />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#2c3e50' }}>
            {activeUserType === 'individual' ? 'Personal Bio' : 'Company Description'}
          </label>
          <textarea
            value={profileData.bio || ''}
            onChange={(e) => handleInputChange('bio', e.target.value)}
            rows={4}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e1e5e9',
              borderRadius: '8px',
              fontSize: '14px',
              resize: 'vertical' as const,
              boxSizing: 'border-box' as const,
            }}
            placeholder={
              activeUserType === 'individual' 
                ? 'Tell us about yourself and your experience...' 
                : 'Describe your company and services...'
            }
          />
        </div>
      </div>

      {/* Save Button */}
      <div style={{ textAlign: 'center' as const, marginTop: '32px' }}>
        <button
          onClick={handleSave}
          disabled={loading}
          style={{
            padding: '16px 48px',
            background: loading ? '#95a5a6' : 'linear-gradient(135deg, #667eea, #764ba2)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            margin: '0 auto',
            boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)',
          }}
        >
          {loading ? (
            <>
              <span>⏳</span>
              Saving...
            </>
          ) : (
            <>
              💾 Save Changes
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProfileSettings; 