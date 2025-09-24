// components/Hero.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FaGithub, FaInstagram, FaLinkedin } from 'react-icons/fa'
import { gsap } from 'gsap'
import { User } from '@/types'

interface HeroProps {
  initialAdminUser?: User | null
}

export default function Hero({ initialAdminUser = null }: HeroProps) {
  const [adminUser, setAdminUser] = useState<User | null>(initialAdminUser)
  const [loading, setLoading] = useState(!initialAdminUser)
  const heroRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const nameRef = useRef<HTMLSpanElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const socialRef = useRef<HTMLDivElement>(null)
  const buttonsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchAdminUser = async () => {
      if (initialAdminUser) {
        setLoading(false)
        return
      }

      try {
        const response = await fetch('/api/users')
        if (!response.ok) throw new Error('Failed to fetch users')
        const users = await response.json()
        
        const admin = users.find((user: User) => user.role === 'ADMIN')
        
        if (admin) {
          setAdminUser(admin)
        } else {
          setAdminUser({
            id: '1',
            name: 'Akhyar Azamta',
            email: 'akhyar.azamta@gmail.com',
            avatar: '/profile.jpg',
            role: 'ADMIN',
            title: 'Frontend Developer | Backend Developer | IoT Engineer',
            socialLinks: {
              github: 'https://github.com/akhyarazamta',
              linkedin: 'https://linkedin.com/in/akhyarazamta',
              instagram: 'https://instagram.com/akhyarazamta'
            },
            createdAt: new Date().toISOString(), // Add default createdAt
            updatedAt: new Date().toISOString(), // Add default updatedAt
          })
        }
      } catch (error) {
        console.error('Error fetching admin user:', error)
        setAdminUser({
          id: '1',
          name: 'Akhyar Azamta',
          email: 'akhyar.azamta@gmail.com',
          avatar: '/profile.jpg',
          role: 'ADMIN',
          title: 'Frontend Developer | Backend Developer | IoT Engineer',
          socialLinks: {
            github: 'https://github.com/akhyarazamta',
            linkedin: 'https://linkedin.com/in/akhyarazamta',
            instagram: 'https://instagram.com/akhyarazamta'
          },
          createdAt: new Date().toISOString(), // Add default createdAt
          updatedAt: new Date().toISOString(), // Add default updatedAt
        })
      } finally {
        setLoading(false)
      }
    }

    fetchAdminUser()
  }, [initialAdminUser])

  useEffect(() => {
    if (loading || !heroRef.current) return

    const ctx = gsap.context(() => {
      // Create a timeline for the hero animations
      const tl = gsap.timeline()

      // Background animation
      const bgElements = gsap.utils.toArray<HTMLElement>('.hero-bg-element')
      tl.fromTo(bgElements,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 1.5, stagger: 0.2, ease: "power2.out" }
      )

      // Profile image animation
      if (imageRef.current) {
        tl.fromTo(imageRef.current,
          { opacity: 0, scale: 0.5, rotation: -10 },
          { opacity: 1, scale: 1, rotation: 0, duration: 1, ease: "back.out(1.7)" },
          "-=1"
        )
      }

      // Title animation
      if (titleRef.current) {
        tl.fromTo(titleRef.current,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
          "-=0.5"
        )
      }

      // Name highlight animation
      if (nameRef.current) {
        tl.fromTo(nameRef.current,
          { opacity: 0, scale: 1.5 },
          { opacity: 1, scale: 1, duration: 0.8, ease: "power2.out" },
          "-=0.5"
        )
      }

      // Subtitle animation
      if (subtitleRef.current) {
        tl.fromTo(subtitleRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
          "-=0.5"
        )
      }

      // Social icons animation
      if (socialRef.current) {
        const socialIcons = gsap.utils.toArray<HTMLElement>(socialRef.current.children)
        tl.fromTo(socialIcons,
          { opacity: 0, y: 20, scale: 0.8 },
          { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.1, ease: "back.out(1.7)" },
          "-=0.5"
        )
      }

      // Buttons animation
      if (buttonsRef.current) {
        const buttons = gsap.utils.toArray<HTMLElement>(buttonsRef.current.children)
        tl.fromTo(buttons,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: "power2.out" },
          "-=0.5"
        )
      }

    }, heroRef)

    return () => ctx.revert()
  }, [loading])

  return (
    <section className="py-10 relative overflow-hidden" ref={heroRef}>
      {/* Animated background elements */}
      <div className="absolute inset-0 z-0">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="hero-bg-element absolute rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-green-500/10 dark:to-green-700/10"
            style={{
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>
      
      <div className="container max-w-7xl mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div ref={imageRef} className='flex justify-center items-center mb-4 opacity-0'>
            <div className="rounded-full mb-4 w-48 h-48 overflow-hidden ring-4 ring-primary/20 shadow-xl dark:ring-0 dark:border-0"
              style={{
                boxShadow: '0 0 0 4px rgba(3, 138, 39, 0.3)',
                border: '2px solid #038a27'
              }}
            >
              <Image 
                src={adminUser?.avatar || "/profile.jpg"} 
                alt="Profile" 
                width={400} 
                height={400} 
                className="w-full h-full object-cover" 
                priority
              />
            </div>
          </div>
          
          <h1 ref={titleRef} className="text-4xl md:text-6xl font-bold mb-6 opacity-0">
            Hi, I&apos;m <span 
              ref={nameRef}
              className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500 dark:from-green-600 dark:to-green-800 opacity-0"
            >
              {adminUser?.name || "Akhyar Azamta"}
            </span>
          </h1>
          
          <p ref={subtitleRef} className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 opacity-0">
            {adminUser?.title || "Frontend Developer | Backend Developer | IoT Engineer"}
          </p>
          
          <div ref={socialRef} className="flex justify-center space-x-4 mb-8">
            <a
              href={adminUser?.socialLinks?.github || "https://github.com/akhyarazamta"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-2xl text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-green-600 transition-colors p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg opacity-0 dark:border dark:border-green-600"
            >
              <FaGithub />
            </a>
            <a
              href={adminUser?.socialLinks?.linkedin || "https://linkedin.com/in/akhyarazamta"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-2xl text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-green-600 transition-colors p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg opacity-0 dark:border dark:border-green-600"
            >
              <FaLinkedin />
            </a>
            <a
              href={adminUser?.socialLinks?.instagram || "https://instagram.com/akhyarazamta"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-2xl text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-green-600 transition-colors p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg opacity-0 dark:border dark:border-green-600"
            >
              <FaInstagram />
            </a>
          </div>
          
          <div ref={buttonsRef} className="flex flex-col md:flex-row justify-center gap-4">
            <Link
              href="/projects"
              className="bg-gradient-to-r from-blue-500 to-purple-500 dark:from-green-600 dark:to-green-800 inline-block w-full md:w-auto text-white px-8 py-3 rounded-lg hover:from-blue-600 hover:to-purple-600 dark:hover:from-green-700 dark:hover:to-green-900 transition-all shadow-lg hover:shadow-xl opacity-0 dark:border dark:border-green-600"
              style={{ 
                boxShadow: '0 4px 15px rgba(3, 138, 39, 0.3)'
              }}
            >
              View Projects
            </Link>
            <Link
              href="/contact"
              className="inline-block w-full bg-gray-300 dark:bg-gray-800 md:w-auto text-gray-800 dark:text-white px-8 py-3 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-700 transition-all shadow-lg hover:shadow-xl opacity-0 dark:border dark:border-green-600"
              style={{ 
                boxShadow: '0 4px 15px rgba(3, 138, 39, 0.1)'
              }}
            >
              Contact Me
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}