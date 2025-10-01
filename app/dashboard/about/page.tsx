// app/dashboard/about/page.tsx
'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import AboutForm from '@/components/AboutForm'
import SkillsManager from '@/components/SkillsManager'
import ExperienceManager from '@/components/ExperienceManager'
import EducationManager from '@/components/EducationManager'
import CertificateManager from '@/components/CertificateManager'

export default function AboutDashboard() {
  return (
    <div className="container mx-auto py-8 text-text">
      <h1 className="text-3xl font-bold mb-8">Manage About Section</h1>
      
      <Tabs defaultValue="about" className="w-full">
        <TabsList>
          <TabsTrigger value="about">About Bio</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="language-skills">Language Skills</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="certificates">Certificates</TabsTrigger>
        </TabsList>
        
        <TabsContent value="about">
          <AboutForm />
        </TabsContent>
        
        <TabsContent value="skills">
          <SkillsManager />
        </TabsContent>
        
        <TabsContent value="experience">
          <ExperienceManager />
        </TabsContent>
        
        <TabsContent value="education">
          <EducationManager />
        </TabsContent>
        
        <TabsContent value="certificates">
          <CertificateManager />
        </TabsContent>
      </Tabs>
    </div>
  )
}