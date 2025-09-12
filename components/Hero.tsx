// components/Hero.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FaGithub, FaInstagram, FaLinkedin } from 'react-icons/fa'
import { motion } from 'framer-motion'
import { fadeInUp, fadeIn, scaleIn } from '@/utils/animations'
import { Loading } from './ui/loading'

interface User {
  id: number
  name: string
  email: string
  avatar: string
  role: string
  title?: string
  bio?: string
  socialLinks?: {
    github?: string
    linkedin?: string
    instagram?: string
  }
}

export default function Hero() {
  const [adminUser, setAdminUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAdminUser = async () => {
      try {
        // Fetch semua users
        const response = await fetch('/api/users')
        if (!response.ok) throw new Error('Failed to fetch users')
        const users = await response.json()
        
        // Cari user dengan role ADMIN
        const admin = users.find((user: User) => user.role === 'ADMIN')
        
        if (admin) {
          setAdminUser(admin)
        } else {
          console.error('No admin user found')
          // Fallback ke data default jika tidak ada admin
          setAdminUser({
            id: 1,
            name: 'Akhyar Azamta',
            email: 'akhyar.azamta@gmail.com',
            avatar: '/profile.jpg',
            role: 'ADMIN',
            title: 'Frontend Developer | Backend Developer | IoT Engineer',
            socialLinks: {
              github: 'https://github.com/akhyarazamta',
              linkedin: 'https://linkedin.com/in/akhyarazamta',
              instagram: 'https://instagram.com/akhyarazamta'
            }
          })
        }
      } catch (error) {
        console.error('Error fetching admin user:', error)
        // Fallback ke data default jika terjadi error
        setAdminUser({
          id: 1,
          name: 'Akhyar Azamta',
          email: 'akhyar.azamta@gmail.com',
          avatar: '/profile.jpg',
          role: 'ADMIN',
          title: 'Frontend Developer | Backend Developer | IoT Engineer',
          socialLinks: {
            github: 'https://github.com/akhyarazamta',
            linkedin: 'https://linkedin.com/in/akhyarazamta',
            instagram: 'https://instagram.com/akhyarazamta'
          }
        })
      } finally {
        setLoading(false)
      }
    }

    fetchAdminUser()
  }, [])

  if (loading) {
    return <Loading size={150} blur="sm" />
  }

  return (
    <section className="py-10">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div 
            className='flex justify-center items-center mb-4'
            {...scaleIn}
            transition={{ delay: 0.2 }}
          >
            <Image 
              src={adminUser?.avatar || "/profile.jpg"} 
              alt="Profile" 
              width={400} 
              height={400} 
              className="rounded-full mb-4 w-48 h-48 object-cover ring-2 ring-primary" 
            />
          </motion.div>
          <motion.h1 
            className="text-4xl md:text-6xl font-bold mb-6"
            {...fadeInUp}
            transition={{ delay: 0.3 }}
          >
            Hi, I&apos;m <motion.span 
              className="text-primary"
              {...fadeIn}
              transition={{ delay: 0.8 }}
            >
              {adminUser?.name || "Akhyar Azamta"}
            </motion.span>
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8"
            {...fadeInUp}
            transition={{ delay: 0.4 }}
          >
            {adminUser?.title || "Frontend Developer | Backend Developer | IoT Engineer"}
          </motion.p>
          <motion.div 
            className="flex justify-center space-x-4 mb-8"
            {...fadeInUp}
            transition={{ delay: 0.5 }}
          >
            <motion.a
              href={adminUser?.socialLinks?.github || "https://github.com/akhyarazamta"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-2xl text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaGithub />
            </motion.a>
            <motion.a
              href={adminUser?.socialLinks?.linkedin || "https://linkedin.com/in/akhyarazamta"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-2xl text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaLinkedin />
            </motion.a>
            <motion.a
              href={adminUser?.socialLinks?.instagram || "https://instagram.com/akhyarazamta"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-2xl text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaInstagram />
            </motion.a>
          </motion.div>
          <motion.div 
            className="flex flex-col md:flex-row justify-center gap-4"
            {...fadeInUp}
            transition={{ delay: 0.6 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/projects"
                className="bg-primary inline-block w-full md:w-auto text-white px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors"
              >
                View Projects
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/contact"
                className=" inline-block w-full bg-gray-500  md:w-auto text-gray-800 dark:text-white px-8 py-3 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Contact Me
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}