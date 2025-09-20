'use client'

import { useRef, useEffect } from 'react'
import { FaCode, FaLaptopCode, FaTools } from 'react-icons/fa'
import Image from 'next/image'
import Certificates from '@/components/Certificates'
import { SkillCategory, Experience, Education, About as AboutData } from '@/types'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface AboutClientProps {
  about: AboutData | null
  skillCategories: SkillCategory[]
  experience: Experience[]
  education: Education[]
}

export default function AboutClient({ about, skillCategories, experience, education }: AboutClientProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const bioRef = useRef<HTMLParagraphElement>(null)
  const skillsRef = useRef<HTMLDivElement>(null)
  const experienceRef = useRef<HTMLDivElement>(null)
  const educationRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      // Animate title
      if (titleRef.current) {
        gsap.fromTo(titleRef.current,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            scrollTrigger: {
              trigger: titleRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse'
            }
          }
        )
      }

      // Animate bio
      if (bioRef.current) {
        gsap.fromTo(bioRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: 0.2,
            scrollTrigger: {
              trigger: bioRef.current,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            }
          }
        )
      }

      // Animate skills section
      if (skillsRef.current) {
        gsap.fromTo(skillsRef.current,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            scrollTrigger: {
              trigger: skillsRef.current,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            }
          }
        )
      }

      // Animate skill cards with stagger
      const skillCards = gsap.utils.toArray<HTMLElement>('.skill-card')
      skillCards.forEach((card, i) => {
        gsap.fromTo(card,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: i * 0.1,
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            }
          }
        )
      })

      // Animate experience section
      if (experienceRef.current) {
        gsap.fromTo(experienceRef.current,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            scrollTrigger: {
              trigger: experienceRef.current,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            }
          }
        )
      }

      // Animate experience items with stagger
      const experienceItems = gsap.utils.toArray<HTMLElement>('.experience-item')
      experienceItems.forEach((item, i) => {
        gsap.fromTo(item,
          { opacity: 0, x: -30 },
          {
            opacity: 1,
            x: 0,
            duration: 0.6,
            delay: i * 0.2,
            scrollTrigger: {
              trigger: item,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            }
          }
        )
      })

      // Animate education section
      if (educationRef.current) {
        gsap.fromTo(educationRef.current,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            scrollTrigger: {
              trigger: educationRef.current,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            }
          }
        )
      }

      // Animate education items with stagger
      const educationItems = gsap.utils.toArray<HTMLElement>('.education-item')
      educationItems.forEach((item, i) => {
        gsap.fromTo(item,
          { opacity: 0, x: 30 },
          {
            opacity: 1,
            x: 0,
            duration: 0.6,
            delay: i * 0.2,
            scrollTrigger: {
              trigger: item,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            }
          }
        )
      })

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  // Fungsi untuk mendapatkan komponen icon berdasarkan nama
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'FaCode': return <FaCode className="h-8 w-8 text-primary mb-4" />
      case 'FaLaptopCode': return <FaLaptopCode className="h-8 w-8 text-primary mb-4" />
      case 'FaTools': return <FaTools className="h-8 w-8 text-primary mb-4" />
      default: return <FaCode className="h-8 w-8 text-primary mb-4" />
    }
  }

  return (
    <div ref={sectionRef} className="container max-w-7xl mx-auto py-12">
      <h1 ref={titleRef} className="text-4xl font-bold mb-8 text-center opacity-0">
        About Me
      </h1>

      {/* Bio Section */}
      <section className="mb-16">
        <p ref={bioRef} className="text-lg text-secondary max-w-3xl mx-auto text-center opacity-0">
          {about?.bio || "I'm a passionate developer with expertise in modern web technologies."}
        </p>
      </section>

      {/* Skills Section */}
      <section ref={skillsRef} className="mb-16 opacity-0">
        <h2 className="section-title text-3xl font-semibold mb-6 text-center">
          Skills
        </h2>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {skillCategories.map((category) => (
            <div key={category.id} className="skill-card bg-white dark:bg-dark/50 p-6 rounded-lg shadow-md opacity-0">
              <h3 className="text-xl flex font-semibold mb-2">
                {getIconComponent(category.icon)} 
                <span className="ml-2">{category.name}</span>
              </h3>
              {category.skills && (
                <ul className="text-secondary space-y-2"> 
                  {category.skills.map((skill) => (
                    <li key={skill.id} className="flex items-center gap-2">
                      <Image
                        src={skill.logo}
                        alt={skill.name}
                        width={24}
                        height={24}
                        className="w-6 h-6 object-contain"
                      />
                      {skill.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Experience Section */}
      <section ref={experienceRef} className="mb-16 opacity-0">
        <h2 className="section-title text-3xl font-semibold mb-6 text-center">
          Experience
        </h2>
        <div className="max-w-3xl mx-auto space-y-8">
          {experience.map((exp) => (
            <div key={exp.id} className="experience-item bg-white dark:bg-dark/50 p-6 rounded-lg shadow-md opacity-0">
              <h3 className="text-xl font-semibold mb-2">{exp.title}</h3>
              <p className="text-primary mb-2">{exp.company} • {exp.period}</p>
              <ul className="text-secondary list-disc list-inside space-y-2">
                {exp.description.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Education Section */}
      <section ref={educationRef} className="mb-16 opacity-0">
        <h2 className="section-title text-3xl font-semibold mb-6 text-center">
          Education
        </h2>
        <div className="max-w-3xl mx-auto">
          {education.map((edu) => (
            <div key={edu.id} className="education-item bg-white dark:bg-dark/50 p-6 rounded-lg shadow-md opacity-0">
              <h3 className="text-xl font-semibold mb-2">{edu.degree}</h3>
              <p className="text-primary mb-2">{edu.institution} • {edu.period}</p>
              {edu.description && (
                <p className="text-secondary">{edu.description}</p>
              )}
            </div>
          ))}
        </div>
      </section>
      
      {/* Certificates Section */}
      <Certificates />
    </div>
  )
}