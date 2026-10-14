import Image from 'next/image'
import { PopIn } from '@/components/animations/pop-in'
import { WordsPullUp } from '@/components/animations/text/words-pull-up'
import { Resume } from '@/components/ui/resume/resume'
import { LinkImage } from '@/components/ui/images/link-image'
import { TiltHover } from '@/components/animations/tilt-hover'
import { TrainingCalendar } from '@/components/ui/custom/activity-calendar'
import Link from 'next/link'
import { WaveEffect } from '@/components/animations/wave-effect'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { allPosts } from 'content-collections'
import { FeaturedPost } from '@/components/ui/posts/featured-post'
import { ProjectCard } from '@/components/ui/projects/project-card'
import { truncate } from '@/lib/utils/strings'
import { ContactFormServer } from '@/components/ui/contact/form-server'
import { Suspense } from 'react'
import { Github, Instagram, Linkedin } from '@geist-ui/icons'

const projects = [
  {
    href: 'https://oguessr.com',
    image: '/images/projects/oguessr.png',
    title: 'OGuessr',
    description: 'A geo-guessr style game for guessing the location of random orienteering maps!',
    external: true,
  },
  {
    href: 'https://ofantasy.org',
    image: '/images/projects/ofantasy.png',
    title: 'OFantasy',
    description: 'A fantasy orienteering league manager to build and manage teams and compete against your friends!',
    external: true,
  },
  {
    href: 'https://oanalysis.com',
    image: '/images/projects/oanalysis.png',
    title: 'O-Analysis',
    description:
      'A fully local orienteering analysis tool for reviewing trainings and competitions on the map!',
    external: true,
  },
  {
    href: 'https://sprintgame.projectorienteering.com',
    image: '/images/projects/sprintgame.png',
    title: 'Sprint Game',
    description:
      'A game where you try to find the shortest route choice on real sprint maps as fast as you can!',
    external: true,
  },
  {
    href: 'https://money.anthonyriley.org',
    image: '/images/projects/money.png',
    title: 'Money',
    description: 'A better expenses tracking app with a super simple interface and no accounts required!',
    external: true,
  },
  {
    href: 'https://www.stanfordrunningclub.com/',
    image: '/images/projects/src.webp',
    title: 'Stanford Running Club',
    description: 'The club website for the Stanford Running Club, a club for runners at Stanford University.',
    external: true,
  },
  {
    href: '/training',
    image: '/images/projects/training.png',
    title: 'Training',
    description: 'A tool to track and analyze my running training!',
    external: false,
  },
  {
    href: '/links',
    image: '/images/projects/links.png',
    title: 'Links',
    description: 'Short links and optional encryption to share URLs safely with your friends!',
    external: false,
  },
] as const

export const dynamic = 'force-dynamic'
export const revalidate = 3600

const posts = allPosts
  .filter((post) => post.archived === false && post.draft === false)
  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

export default async function Home() {
  return (
    <main className="pb-28">
      <section id="home">
        <div className="relative h-24 w-full overflow-hidden border-b border-line bg-muted sm:h-32">
          <Image
            src="/images/cover.jpg"
            alt="Anthony Riley with the Grove team by the bay"
            fill
            priority
            className="object-cover object-center"
            sizes="(min-width: 1024px) 1024px, 100vw"
          />
        </div>
        <div className="flex flex-col items-center px-4 pb-12">
          <PopIn>
            <div className="relative -mt-10 size-32 border-4 border-background bg-background outline outline-1 outline-border">
              <Image
                src="/images/profile.jpg"
                alt="Anthony Riley"
                fill
                priority
                className="object-cover"
                sizes="128px"
              />
            </div>
          </PopIn>
          <div className="mt-4 flex w-full max-w-prose flex-col items-center text-center">
            <WordsPullUp text="Anthony Riley" className="text-4xl font-black" />
            <p className="mt-1 text-muted-foreground">Athlete · Developer · Entrepreneur</p>
            <PopIn>
              <div className="mt-3 flex w-full flex-col items-center gap-2 text-muted-foreground">
                <div className="flex items-center justify-center gap-4 shrink-0">
                  <Link
                    href="https://www.linkedin.com/in/anthony-riley/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
                    aria-label="LinkedIn"
                  >
                    <Linkedin size={22} aria-hidden />
                  </Link>
                  <Link
                    href="https://github.com/pythonicode"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
                    aria-label="GitHub"
                  >
                    <Github size={22} aria-hidden />
                  </Link>
                  <Link
                    href="https://www.instagram.com/aj.riley"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
                    aria-label="Instagram"
                  >
                    <Instagram size={22} aria-hidden />
                  </Link>
                </div>
                <Suspense
                  fallback={<div className="h-7 w-full max-w-xs border bg-muted/30 animate-pulse" />}
                >
                  <div className="flex w-full max-w-xs justify-center">
                    <ContactFormServer compact />
                  </div>
                </Suspense>
              </div>
            </PopIn>
            <div className="mt-2 max-w-prose text-left">
              <p className="leading-relaxed">
                Welcome to my website! I am a{' '}
                <span className="z-10 cursor-pointer px-1 -mx-1 hover:bg-background rounded inline-block relative font-bold text-cyan-600 dark:text-cyan-400 hover:text-cyan-900 dark:hover:text-cyan-300 transition-all duration-100 ease-in-out hover:-rotate-2 hover:scale-110">
                  software engineer
                </span>{' '}
                and{' '}
                <span className="z-10 cursor-pointer px-1 -mx-1 hover:bg-background rounded inline-block relative font-bold text-cyan-600 dark:text-cyan-400 hover:text-cyan-900 dark:hover:text-cyan-300 transition-all duration-100 ease-in-out hover:rotate-1 hover:scale-110">
                  founder
                </span>{' '}
                with a passion for creating{' '}
                <span className="inline relative font-medium bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-cyan-600 hover:underline transition duration-100 ease-in-out">
                  intuitive and beautiful experiences
                </span>{' '}
                for users on web and mobile. Here I like to share my interests in{' '}
                <span className="hover:scale-[102%] cursor-pointer inline-block px-1 bg-cyan-200 dark:bg-cyan-900 rounded hover:bg-cyan-300 dark:hover:bg-cyan-800 transition duration-100">
                  health,
                </span>{' '}
                <span className="hover:scale-[102%] cursor-pointer inline-block px-1 bg-cyan-200 dark:bg-cyan-900 rounded hover:bg-cyan-300 dark:hover:bg-cyan-800 transition duration-100">
                  endurance,
                </span>{' '}
                <span className="hover:scale-[102%] cursor-pointer inline-block px-1 bg-cyan-200 dark:bg-cyan-900 rounded hover:bg-cyan-300 dark:hover:bg-cyan-800 transition duration-100">
                  music
                </span>{' '}
                and{' '}
                <span className="hover:scale-[102%] cursor-pointer inline-block px-1 bg-cyan-200 dark:bg-cyan-900 rounded hover:bg-cyan-300 dark:hover:bg-cyan-800 transition duration-100">
                  technology
                </span>
                . I also use this site as a store of memory for what I&apos;ve said, read, seen or
                done, as well as an{' '}
                <span className="cursor-pointer inline-block relative px-1 -mx-1 border border-dotted border-cyan-600 dark:border-cyan-400 hover:animate-pulse transition-all duration-100">
                  experimentation ground
                </span>{' '}
                for new technology,{' '}
                <span className="cursor-pointer inline-block bg-gradient-to-r from-cyan-600 to-cyan-400 text-white font-semibold px-1 rounded transition-transform duration-300 hover:rotate-1 hover:scale-105 shadow-lg">
                  unique design
                </span>{' '}
                and{' '}
                <span className="cursor-pointer inline-block border-b-4 border-dashed border-cyan-400 hover:border-cyan-600 dark:hover:border-cyan-300 hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors duration-300">
                  interesting findings
                </span>
                .
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="grid grid-cols-2 border-t border-line md:grid-cols-4">
        <div className="group col-span-2 flex h-full flex-col justify-center border-b border-line px-4 py-3 md:border-b-0 md:border-r">
          <div className="flex items-center justify-center">
            <TrainingCalendar />
          </div>
          <div className="relative mt-2">
            <h3 className="opacity-0 text-center uppercase font-bold text-xs">My Training</h3>
            <h3 className="absolute top-0 right-0 left-0 group-hover:opacity-0 opacity-100 transition-all duration-300 text-xs text-center uppercase font-bold text-muted-foreground">
              My Training
            </h3>
            <Tooltip>
              <TooltipTrigger asChild>
                <h3 className="absolute cursor-pointer top-0 right-0 left-0 group-hover:opacity-100 opacity-0 group-hover:text-foreground transition-all text-xs text-center uppercase font-bold text-muted-foreground">
                  Click For Details
                </h3>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                Click a day to see the sessions.
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
        <div className="group flex h-full flex-col items-center justify-center border-r border-line px-3 py-3">
          <TiltHover>
            <LinkImage
              src="/images/favorite-book.jpg"
              alt="My Favorite Book"
              width={112}
              height={162}
              className="aspect-[9/13] h-32 w-auto object-cover sm:h-36"
            />
          </TiltHover>
          <h3 className="mt-2 text-center text-xs font-bold uppercase text-muted-foreground transition-colors group-hover:text-foreground">
            Favorite Book
          </h3>
        </div>
        <div className="group flex h-full flex-col items-center justify-center px-3 py-3">
          <TiltHover degrees={1}>
            <LinkImage
              src="/images/favorite-movie.jpg"
              alt="My Favorite Movie"
              width={112}
              height={162}
              className="aspect-[9/13] h-32 w-auto object-cover sm:h-36"
            />
          </TiltHover>
          <h3 className="mt-2 text-center text-xs font-bold uppercase text-muted-foreground transition-colors group-hover:text-foreground">
            Favorite Movie
          </h3>
        </div>
      </section>
      <Resume />
      <section
        id="posts"
        className="flex w-full scroll-mt-8 flex-col items-center border-t border-line px-4 py-16"
      >
        <h2 className="mb-8 text-center text-3xl font-black md:text-5xl">POSTS</h2>
        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.slice(0, 3).map((post) => (
            <FeaturedPost
              key={post._meta.path}
              title={post.title}
              description={truncate(post.content, 128)}
              image={post.image}
              createdAt={new Date(post.createdAt)}
              readingTime={Math.round(post.content.split(' ').length / 250)}
              tags={post.tags}
              slug={post._meta.path}
            />
          ))}
        </div>
        <WaveEffect className="mt-6">
          <Link
            href="/posts"
            className="border border-border px-4 py-2 text-center text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:bg-foreground hover:text-background"
          >
            View more
          </Link>
        </WaveEffect>
      </section>
      {/* <section className="mx-auto max-w-screen-lg flex flex-col items-center justify-center">
        <h2 className="mb-8 mt-16 text-3xl text-center md:text-5xl font-black">✨ TIMELINE ✨</h2>
        <Timeline
          data={[
            {
              title: 'Jun 2019',
              description: 'Graduated from Conestoga High School.',
              content: (
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-3 relative aspect-video">
                    <LinkImage
                      src="/images/timeline/conestoga/friends.jpg"
                      alt="Photo with Highschool Friends"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="col-span-2 relative aspect-video">
                    <LinkImage
                      src="/images/timeline/conestoga/grandparents.jpg"
                      alt="Photo with Highschool Friends"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="col-span-1 relative">
                    <LinkImage
                      src="/images/timeline/conestoga/yearbook.jpg"
                      alt="Photo with Highschool Friends"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              ),
            },
            {
              title: 'Sep 2019',
              description: 'Started my undergraduate degree at Stanford University.',
              content: <div>Hello</div>,
            },
            {
              title: 'Aug 2021',
              description:
                'Joined the 4-man team at Perform, creating constraint-based algorithms for generating training plans for runners.',
              content: <div>Hello</div>,
            },
            {
              title: 'March 2024',
              description:
                'Started working with Tran Le & Sohit Gatiganti with the mission of improving the technology behind clinical research, eventually leading to the founding of Grove AI.',
              content: <div>Hello</div>,
            },
            {
              title: 'June 2024',
              description:
                'Conferred my undergraduate degree from Stanford University, with a B.S. in Computer Science.',
              content: <div>Hello</div>,
            },
            {
              title: 'August 2024',
              description:
                'Competed at the World University Championships in Orienteering hosted in Bansko, Bulgaria.',
              content: <div>Hello</div>,
            },
            {
              title: 'Dec 2024',
              description: `Updated my personal website to this one what you are viewing now! The old website is still available at https://old.${env.NEXT_PUBLIC_URL?.split('://')[1]}`,
              content: <></>,
            },
          ]}
        />
      </section> */}
      <section
        id="projects"
        className="flex w-full scroll-mt-8 flex-col items-center border-t border-line px-4 py-16"
      >
        <h2 className="mb-8 text-center text-3xl font-black md:text-5xl">PROJECTS</h2>
        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project.href}
              href={project.href}
              title={project.title}
              description={project.description}
              image={project.image}
              external={project.external}
            />
          ))}
        </div>
        <WaveEffect className="mt-6">
          <Link
            href="https://github.com/pythonicode"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-border px-4 py-2 text-center text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:bg-foreground hover:text-background"
          >
            View more
          </Link>
        </WaveEffect>
      </section>
    </main>
  )
}
