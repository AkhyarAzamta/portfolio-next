import AboutClient from '@/components/AboutClient'

async function getAboutData() {
  try {
    const [aboutRes, skillsRes, experienceRes, educationRes] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/about`, { next: { revalidate: 3600 } }),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/skills`, { next: { revalidate: 3600 } }),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/experience`, { next: { revalidate: 3600 } }),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/education`, { next: { revalidate: 3600 } })
    ])

    if (!aboutRes.ok || !skillsRes.ok || !experienceRes.ok || !educationRes.ok) {
      throw new Error('Failed to fetch data')
    }

    const [aboutData, skillsData, experienceData, educationData] = await Promise.all([
      aboutRes.json(),
      skillsRes.json(),
      experienceRes.json(),
      educationRes.json()
    ])

    return {
      about: aboutData,
      skillCategories: skillsData,
      experience: experienceData,
      education: educationData
    }
  } catch (error) {
    console.error('Error fetching data:', error)
    return {
      about: null,
      skillCategories: [],
      experience: [],
      education: []
    }
  }
}

export default async function AboutPage() {
  const data = await getAboutData()

  return <AboutClient {...data} />
}