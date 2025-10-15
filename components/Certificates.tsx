// components/Certificates.tsx
'use client'

import { useState, useEffect } from 'react'
import { ExternalLink, Eye, X, Calendar, Building2, Clock } from 'lucide-react'
import Image from 'next/image'
import { Loading } from '@/components/ui/loading'
import { Certificate } from '@/types'

// Function to format date
const formatDate = (dateString: string | Date | null | undefined): string => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Function to check if certificate is expired
const isExpired = (expiryDate: string | Date | null | undefined): boolean => {
  if (!expiryDate) return false;
  return new Date(expiryDate) < new Date();
};

export default function Certificates() {
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null)

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
      
      if (Array.isArray(data)) {
        setCertificates(data)
      } else if (data.certificates && Array.isArray(data.certificates)) {
        setCertificates(data.certificates)
      } else {
        throw new Error('Invalid data format received from API')
      }
    } catch (error) {
      console.error('Error fetching certificates:', error)
      setError(error instanceof Error ? error.message : 'Unknown error occurred')
      setCertificates([])
    } finally {
      setLoading(false)
    }
  }

  const openImagePreview = (certificate: Certificate) => {
    setImagePreview(certificate.image!)
    setSelectedCertificate(certificate)
  }

  const closeImagePreview = () => {
    setImagePreview(null)
    setSelectedCertificate(null)
  }

  if (loading) return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <Loading />
      </div>
    </section>
  )
  
  if (error) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Certifications
          </h2>
          <div className="text-center py-8 text-red-500 bg-red-50 dark:bg-red-900/20 rounded-2xl p-6">
            <p className="text-lg font-semibold mb-2">Error loading certificates</p>
            <p className="text-sm opacity-75">{error}</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gray-50/50 dark:bg-gray-900/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Professional Certifications
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Validated skills and expertise through industry-recognized certifications
          </p>
        </div>

        {certificates.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <Building2 className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-lg">No certificates available yet</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Certifications will appear here once added</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {certificates.map((certificate) => (
              <div
                key={certificate.id}
                className="group bg-card rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-200 dark:border-gray-700 overflow-hidden hover:-translate-y-2"
              >
                {/* Image Container */}
                {certificate.image && (
                  <div 
                    className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-700 cursor-pointer"
                    onClick={() => openImagePreview(certificate)}
                  >
                    <Image
                      src={certificate.image}
                      alt={certificate.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end justify-between p-4">
                      <div className="flex items-center space-x-2 text-white">
                        <Eye className="h-4 w-4" />
                        <span className="text-sm font-medium">View Certificate</span>
                      </div>
                      
                      {/* Status Badge */}
                      {certificate.expiryDate && (
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          isExpired(certificate.expiryDate) 
                            ? 'bg-red-500 text-white' 
                            : 'bg-green-500 text-white'
                        }`}>
                          {isExpired(certificate.expiryDate) ? 'Expired' : 'Valid'}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className="p-6">
                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {certificate.name}
                  </h3>

                  {/* Issuer */}
                  <div className="flex items-center gap-2 mb-4">
                    <Building2 className="h-4 w-4 text-blue-500" />
                    <p className="text-blue-600 dark:text-blue-400 font-medium">{certificate.issuer}</p>
                  </div>

                  {/* Dates */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="h-4 w-4" />
                      <span>Issued: {formatDate(certificate.issueDate)}</span>
                    </div>
                    
                    {certificate.expiryDate && (
                      <div className={`flex items-center gap-2 text-sm ${
                        isExpired(certificate.expiryDate) 
                          ? 'text-red-500' 
                          : 'text-green-500'
                      }`}>
                        <Clock className="h-4 w-4" />
                        <span>
                          {isExpired(certificate.expiryDate) ? 'Expired' : 'Expires'}: {formatDate(certificate.expiryDate)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    {certificate.credentialURL && (
                      <a
                        href={certificate.credentialURL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-300 text-sm font-medium group/btn"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Verify
                        <span className="group-hover/btn:translate-x-0.5 transition-transform">→</span>
                      </a>
                    )}
                    
                    <button
                      onClick={() => openImagePreview(certificate)}
                      className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm font-medium"
                    >
                      <Eye className="h-4 w-4" />
                      Preview
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Enhanced Image Preview Modal */}
      {imagePreview && selectedCertificate && (
        <div 
          className="fixed inset-0  backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={closeImagePreview}
        >
          <div 
            className="relative max-w-6xl max-h-full bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {selectedCertificate.name}
                </h3>
                <p className="text-blue-600 dark:text-blue-400 mt-1">
                  {selectedCertificate.issuer}
                </p>
              </div>
              
              <button
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                onClick={closeImagePreview}
              >
                <X className="h-6 w-6 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {/* Image */}
            <div className="relative aspect-[4/3] max-h-[70vh] bg-gray-100 dark:bg-gray-700">
              <Image
                src={imagePreview}
                alt={selectedCertificate.name}
                fill
                className="object-contain"
                quality={90}
              />
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Calendar className="h-4 w-4" />
                  <span>Issued: {formatDate(selectedCertificate.issueDate)}</span>
                </div>
                
                {selectedCertificate.expiryDate && (
                  <div className={`flex items-center gap-2 ${
                    isExpired(selectedCertificate.expiryDate) 
                      ? 'text-red-500' 
                      : 'text-green-500'
                  }`}>
                    <Clock className="h-4 w-4" />
                    <span>
                      {isExpired(selectedCertificate.expiryDate) ? 'Expired' : 'Valid until'}: {formatDate(selectedCertificate.expiryDate)}
                    </span>
                  </div>
                )}
              </div>
              
              {selectedCertificate.credentialURL && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <a
                    href={selectedCertificate.credentialURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm font-medium"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Verify Certificate Online
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}