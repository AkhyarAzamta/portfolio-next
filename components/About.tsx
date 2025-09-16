// components/About.tsx
'use client'

import { useState, useEffect } from 'react'
import { FaCode, FaLaptopCode, FaTools, FaLanguage } from 'react-icons/fa'
import { motion } from 'framer-motion'
import {
  fadeInUp,
  fadeInDown,
  fadeIn,
  staggerContainer,
  cardHover,
  cardHoverSmall
} from '@/utils/animations'
import Image from 'next/image'
import { Loading } from '@/components/ui/loading'
import Certificates from '@/components/Certificates'

interface AboutData {
  id: number;
  bio: string;
}

interface SkillCategory {
  id: number;
  name: string;
  icon: string;
  description?: string;
  skills: Skill[];
}

interface Skill {
  id: number;
  name: string;
  logo: string;
}

interface LanguageSkill {
  id: number;
  name: string;
  level: number;
  category: string | null;
  logo: string | null;
}

interface Experience {
  id: number;
  title: string;
  company: string;
  period: string;
  description: string[];
}

interface Education {
  id: number;
  degree: string;
  institution: string;
  period: string;
  description?: string;
}

export default function About() {
  const [about, setAbout] = useState<AboutData | null>(null)
  const [skillCategories, setSkillCategories] = useState<SkillCategory[]>([])
  const [languageSkills, setLanguageSkills] = useState<LanguageSkill[]>([])
  const [experience, setExperience] = useState<Experience[]>([])
  const [education, setEducation] = useState<Education[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [aboutRes, skillsRes, languageSkillsRes, experienceRes, educationRes] = await Promise.all([
          fetch('/api/about'),
          fetch('/api/skills'),
          fetch('/api/language-skills'),
          fetch('/api/experience'),
          fetch('/api/education')
        ])

        if (!aboutRes.ok || !skillsRes.ok || !languageSkillsRes.ok || !experienceRes.ok || !educationRes.ok) {
          throw new Error('Failed to fetch data')
        }

        const [aboutData, skillsData, languageSkillsData, experienceData, educationData] = await Promise.all([
          aboutRes.json(),
          skillsRes.json(),
          languageSkillsRes.json(),
          experienceRes.json(),
          educationRes.json()
        ])

        setAbout(aboutData)
        setSkillCategories(skillsData)
        setLanguageSkills(languageSkillsData)
        setExperience(experienceData)
        setEducation(educationData)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <Loading size={150} blur="sm" />
    )
  }

  // Fungsi untuk mendapatkan komponen icon berdasarkan nama
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'FaCode': return <FaCode className="h-8 w-8 text-primary mb-4" />
      case 'FaLaptopCode': return <FaLaptopCode className="h-8 w-8 text-primary mb-4" />
      case 'FaTools': return <FaTools className="h-8 w-8 text-primary mb-4" />
      case 'FaLanguage': return <FaLanguage className="h-8 w-8 text-primary mb-4" />
      default: return <FaCode className="h-8 w-8 text-primary mb-4" />
    }
  }

  return (
    <div className="container max-w-7xl mx-auto py-12">
      <motion.h1
        className="text-4xl font-bold mb-8 text-center"
        {...fadeInDown}
      >
        About Me
      </motion.h1>

      {/* Bio Section */}
      <motion.section
        className="mb-16"
        {...fadeInUp}
      >
        <p className="text-lg text-secondary max-w-3xl mx-auto text-center">
          {about?.bio}
        </p>
      </motion.section>

      {/* Skills Section */}
      <motion.section
        className="mb-16"
        {...fadeIn}
        transition={{ delay: 0.2 }}
      >
        <motion.h2
          className="section-title"
          {...fadeInUp}
        >
          Skills
        </motion.h2>
        <motion.div
          className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {skillCategories.map((category) => (
            <motion.div
              key={category.id}
              className="bg-white dark:bg-dark/50 p-6 rounded-lg shadow-md"
              variants={fadeInUp}
              whileHover={cardHover.whileHover}
            >
              {getIconComponent(category.icon)}
              <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
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
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Language Skills Section */}
      <motion.section
        className="mb-16"
        {...fadeIn}
        transition={{ delay: 0.3 }}
      >
        <motion.h2
          className="section-title"
          {...fadeInUp}
        >
          Language Skills
        </motion.h2>
        <motion.div
          className="max-w-3xl mx-auto space-y-6"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {languageSkills.map((skill) => (
            <motion.div
              key={skill.id}
              className="bg-white dark:bg-dark/50 p-6 rounded-lg shadow-md"
              variants={fadeInUp}
              whileHover={cardHoverSmall.whileHover}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {skill.logo && (
                    <div className="relative w-8 h-8">
                      <Image
                        src={skill.logo}
                        alt={skill.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                  )}
                  <h3 className="text-xl font-semibold">{skill.name}</h3>
                  {skill.category && (
                    <span className="text-sm text-primary bg-primary/10 px-2 py-1 rounded-full">
                      {skill.category}
                    </span>
                  )}
                </div>
                <span className="text-lg font-semibold">{skill.level}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-primary h-2.5 rounded-full" 
                  style={{ width: `${skill.level}%` }}
                ></div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Experience Section */}
      <motion.section
        className="mb-16"
        {...fadeIn}
        transition={{ delay: 0.4 }}
      >
        <motion.h2
          className="section-title"
          {...fadeInUp}
        >
          Experience
        </motion.h2>
        <motion.div
          className="max-w-3xl mx-auto space-y-8"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {experience.map((exp) => (
            <motion.div
              key={exp.id}
              className="bg-white dark:bg-dark/50 p-6 rounded-lg shadow-md"
              variants={fadeInUp}
              whileHover={cardHoverSmall.whileHover}
            >
              <h3 className="text-xl font-semibold mb-2">{exp.title}</h3>
              <p className="text-primary mb-2">{exp.company} • {exp.period}</p>
              <ul className="text-secondary list-disc list-inside space-y-2">
                {exp.description.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Education Section */}
      <motion.section
        className="mb-16"
        {...fadeIn}
        transition={{ delay: 0.6 }}
      >
        <motion.h2
          className="section-title"
          {...fadeInUp}
        >
          Education
        </motion.h2>
        <motion.div
          className="max-w-3xl mx-auto"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {education.map((edu) => (
            <motion.div
              key={edu.id}
              className="bg-white dark:bg-dark/50 p-6 rounded-lg shadow-md"
              variants={fadeInUp}
              whileHover={cardHoverSmall.whileHover}
            >
              <h3 className="text-xl font-semibold mb-2">{edu.degree}</h3>
              <p className="text-primary mb-2">{edu.institution} • {edu.period}</p>
              {edu.description && (
                <p className="text-secondary">{edu.description}</p>
              )}
            </motion.div>
          ))}
        </motion.div>
      </motion.section>
      
      {/* Certificates Section */}
      <Certificates />
    </div>
  )
}