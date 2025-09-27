// app/contact/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa'
import { motion } from 'framer-motion'
import { fadeInUp, fadeIn, slideInLeft, slideInRight } from '@/utils/animations'
import { useRouter } from 'next/navigation'
import { Loading } from '@/components/ui/loading'

interface FormData {
  name: string;
  email: string;
  message: string;
}

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

interface ContactInfo {
  id: string;
  type: 'email' | 'phone' | 'location';
  value: string;
}

export default function Contact() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: ''
  })
  const [status, setStatus] = useState<FormStatus>('idle')
  const [contactInfos, setContactInfos] = useState<ContactInfo[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchContactInfo()
  }, [])

  const fetchContactInfo = async () => {
    try {
      const response = await fetch('/api/contact-info')
      if (!response.ok) throw new Error('Failed to fetch contact info')
      const data = await response.json()
      setContactInfos(data)
    } catch (error) {
      console.error('Error fetching contact info:', error)
      // Fallback data jika API error
      setContactInfos([
        { id: '1', type: 'email', value: 'hello@devfolio.com' },
        { id: '2', type: 'phone', value: '+1 (555) 123-4567' },
        { id: '3', type: 'location', value: 'Jakarta, Indonesia' }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    try {
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to send message')
      }

      setStatus('success')
      setFormData({ name: '', email: '', message: '' })
      
      setTimeout(() => {
        router.refresh()
      }, 2000)
    } catch (error) {
      console.error('Error submitting form:', error)
      setStatus('error')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'email': return <FaEnvelope className="h-6 w-6 text-primary" />
      case 'phone': return <FaPhone className="h-6 w-6 text-primary" />
      case 'location': return <FaMapMarkerAlt className="h-6 w-6 text-primary" />
      default: return null
    }
  }

  const getLink = (type: string, value: string) => {
    switch (type) {
      case 'email': return `mailto:${value}`
      case 'phone': return `tel:${value}`
      default: return '#'
    }
  }

  if (loading) {
    return <Loading size={150} blur="sm" />
  }

  return (
    <div className="container max-w-7xl mx-auto py-12 px-4 text-text">
      <motion.h1 
        className="text-4xl font-bold mb-8 text-center"
        {...fadeInUp}
      >
        Contact Me
      </motion.h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact Information */}
        <motion.div 
          className="space-y-8"
          {...slideInLeft}
        >
          <motion.div {...fadeInUp}>
            <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
            <p>
              I&apos;m always open to discussing new projects, creative ideas, or
              opportunities to be part of your visions.
            </p>
          </motion.div>
          
          <motion.div 
            className="space-y-4"
            variants={fadeIn}
            initial="initial"
            animate="animate"
          >
            {contactInfos.map((info) => (
              <motion.div 
                key={info.id}
                className="flex items-center gap-4 p-4 rounded-lg"
                variants={fadeInUp}
                whileHover={{ x: 10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {getIcon(info.type)}
                <div>
                  <h3 className="font-semibold capitalize">{info.type}</h3>
                  {info.type === 'email' || info.type === 'phone' ? (
                    <a 
                      href={getLink(info.type, info.value)} 
                      className="hover:text-primary transition-colors"
                    >
                      {info.value}
                    </a>
                  ) : (
                    <p className="text-text">{info.value}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
        
        {/* Contact Form */}
        <motion.div 
          className="bg-white dark:bg-gray-500 p-6 rounded-lg shadow-lg border border-border dark:border-gray-700"
          {...slideInRight}
        >
          <motion.form 
            onSubmit={handleSubmit} 
            className="space-y-6"
            variants={fadeIn}
            initial="initial"
            animate="animate"
          >
            <motion.div variants={fadeInUp}>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                placeholder="Your name"
              />
            </motion.div>
            
            <motion.div variants={fadeInUp}>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                placeholder="your.email@example.com"
              />
            </motion.div>
            
            <motion.div variants={fadeInUp}>
              <label htmlFor="message" className="block text-sm font-medium mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                placeholder="Your message..."
              />
            </motion.div>
            
            <motion.button
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-primary text-white py-3 rounded-md font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {status === 'loading' ? 'Sending...' : 'Send Message'}
            </motion.button>
            
            {status === 'success' && (
              <motion.p 
                className="text-green-500 text-center font-medium"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                Message sent successfully!
              </motion.p>
            )}
            
            {status === 'error' && (
              <motion.p 
                className="text-red-500 text-center font-medium"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                Failed to send message. Please try again.
              </motion.p>
            )}
          </motion.form>
        </motion.div>
      </div>
    </div>
  )
}