// components/Certificates.tsx
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Eye, X } from 'lucide-react'
import { fadeIn, fadeInUp, staggerContainer } from '@/utils/animations'
import Image from 'next/image'
import { Loading } from '@/components/ui/loading'
import { Certificate } from '@/types'

export default function Certificates() {
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  useEffect(() => {
    fetchCertificates()
  }, [])

  const fetchCertificates = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/certificates')
      
      if (!response.ok) {
        throw new Error(`Failed to fetch certificates: ${response.status}`)
      }
      
      const data = await response.json()
      
      // Ensure data is an array
      if (Array.isArray(data)) {
        setCertificates(data)
      } else if (data.certificates && Array.isArray(data.certificates)) {
        // Handle case where API returns { certificates: [...] }
        setCertificates(data.certificates)
      } else {
        throw new Error('Invalid data format received from API')
      }
    } catch (error) {
      console.error('Error fetching certificates:', error)
      setError(error instanceof Error ? error.message : 'Unknown error occurred')
      setCertificates([]) // Ensure certificates is always an array
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Loading />
  
  if (error) {
    return (
      <motion.section {...fadeIn} transition={{ delay: 0.6 }}>
        <motion.h2 className="section-title" {...fadeInUp}>
          Certifications
        </motion.h2>
        <div className="text-center py-8 text-red-500">
          Error loading certificates: {error}
        </div>
      </motion.section>
    )
  }

  return (
    <motion.section
      {...fadeIn}
      transition={{ delay: 0.6 }}
    >
      <motion.h2
        className="section-title"
        {...fadeInUp}
      >
        Certifications
      </motion.h2>

      {certificates.length === 0 ? (
        <div className="text-center py-8">
          No certificates available.
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {certificates.map((certificate) => (
            <motion.div
              key={certificate.id}
              className="bg-white dark:bg-dark/50 p-6 rounded-lg shadow-md"
              variants={fadeInUp}
            >
              {certificate.image && (
                <div className="relative aspect-video mb-4 cursor-pointer" onClick={() => setImagePreview(certificate.image!)}>
                  <Image
                    src={certificate.image}
                    alt={certificate.name}
                    fill
                    className="object-cover rounded-md"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 hover:opacity-50">
                    <Eye className="h-8 w-8 text-white" />
                  </div>
                </div>
              )}

              <h3 className="text-xl font-semibold mb-2">{certificate.name}</h3>
              <p className="text-primary mb-2">{certificate.issuer}</p>

              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-sm text-secondary">Issued: {certificate.issueDate}</p>
                  {certificate.expiryDate && (
                    <p className="text-sm text-secondary">Expires: {certificate.expiryDate}</p>
                  )}
                </div>

                {certificate.credentialURL && (
                  <a
                    href={certificate.credentialURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80"
                  >
                    <ExternalLink className="h-5 w-5" />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Image Preview Modal */}
      {imagePreview && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50" onClick={() => setImagePreview(null)}>
          <div className="relative max-w-4xl max-h-full">
            <button
              className="absolute top-4 right-4 bg-white rounded-full p-2 z-10"
              onClick={(e) => {
                e.stopPropagation();
                setImagePreview(null);
              }}
            >
              <X className="h-6 w-6" />
            </button>
            <Image
              src={imagePreview}
              alt="Certificate preview"
              width={800}
              height={600}
              className="object-contain max-h-screen"
            />
          </div>
        </div>
      )}
    </motion.section>
  )
}