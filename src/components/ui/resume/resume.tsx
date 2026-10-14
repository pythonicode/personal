import Image from 'next/image'
import { LineSection } from '@/components/animations/line-section'
import { DrawY, Reveal } from '@/components/animations/reveal'

const experience = [
  {
    years: '2026 — Now',
    title: 'Technical Advisor',
    org: 'Hippocratic AI',
    meta: 'Gothenburg',
    summary: 'Since January 2026, after Grove was acquired.',
    logo: '/images/logos/hippocratic.png',
  },
  {
    years: '2024 — 2026',
    title: 'Founding Engineer',
    org: 'Grove AI',
    meta: 'San Francisco · acquired by Hippocratic AI',
    summary:
      'Co-founded Grove and built Grace, a multilingual AI agent for clinical trial recruitment and follow-up. Took it from a first version through a $4.9M seed to acquisition.',
    logo: '/images/logos/grove.jpg',
  },
  {
    years: '2023',
    title: 'Software Developer',
    org: 'Stanford Medicine',
    meta: 'Stanford · internship',
    summary: 'Built internal software for the School of Medicine during a summer on campus.',
    logo: '/images/logos/stanford-medicine.png',
  },
  {
    years: '2022',
    title: 'Software Engineer',
    org: 'Perform',
    meta: 'Bay Area · YC W22',
    summary: 'Worked on constraint-based systems that generate training plans for runners.',
    logo: '/images/logos/perform.jpg',
  },
] as const

const education = [
  {
    school: 'Stanford University',
    credential: 'B.S. Computer Science',
    note: 'Teaching assistant · Running Club captain',
    logo: '/images/logos/stanford.png',
  },
  {
    school: 'University of Gothenburg',
    credential: 'M.Eng. Software Engineering Management',
    note: 'Gothenburg, Sweden',
    logo: '/images/logos/gothenburg.png',
  },
] as const

export function Resume() {
  return (
    <LineSection
      id="resume"
      fade={false}
      shineDelay="2.4s"
      className="flex w-full scroll-mt-8 flex-col items-center px-4 py-16"
    >
      <h2 className="text-center text-3xl font-black md:text-5xl">RESUME</h2>
      <a
        href="https://www.linkedin.com/in/anthony-riley/"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground transition-colors duration-300 hover:text-foreground"
      >
        LinkedIn
      </a>

      <ol className="relative mt-10 w-full max-w-2xl">
        <DrawY className="bottom-3 left-[7px] top-2" />
        {experience.map((role, index) => (
          <li key={`${role.org}-${role.years}`}>
            <Reveal
              delay={index * 0.08}
              className={`group relative pl-8 ${index === experience.length - 1 ? '' : 'pb-8'}`}
            >
              <span
                className="absolute left-1 top-[9px] size-1.5 bg-line transition-colors duration-300 group-hover:bg-foreground"
                aria-hidden
              />
              <div className="flex items-start gap-3">
                <Image
                  src={role.logo}
                  alt=""
                  width={36}
                  height={36}
                  className="size-9 shrink-0 bg-white object-contain transition-transform duration-500 ease-out group-hover:scale-105"
                />
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    {role.years}
                  </p>
                  <h3 className="mt-1 text-lg font-semibold leading-snug">{role.title}</h3>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {role.org}
                    <span className="px-1.5 text-border">/</span>
                    {role.meta}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed">{role.summary}</p>
            </Reveal>
          </li>
        ))}
      </ol>

      <p className="mb-4 mt-4 text-center text-[11px] font-bold uppercase tracking-[0.22em] text-muted-foreground">
        Education
      </p>
      <div className="grid w-full max-w-2xl grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-10">
        {education.map((item, index) => (
          <Reveal key={item.school} delay={0.12 + index * 0.08} className="group">
            <div className="flex items-start gap-3">
              <Image
                src={item.logo}
                alt=""
                width={36}
                height={36}
                className="size-9 shrink-0 bg-white object-contain transition-transform duration-500 ease-out group-hover:scale-105"
              />
              <div className="min-w-0">
                <h3 className="font-semibold">{item.school}</h3>
                <p className="mt-1 text-sm">{item.credential}</p>
                <p className="mt-2 text-sm text-muted-foreground">{item.note}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </LineSection>
  )
}
