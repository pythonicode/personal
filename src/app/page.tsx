import Image from 'next/image'
import { PopIn } from '@/components/animations/pop-in'
import { WordsPullUp } from '@/components/animations/text/words-pull-up'
import { Blockquote, BlockquoteAuthor } from '@/components/ui/blockquote'
import { Wiggle } from '@/components/animations/wiggle'
import { LinkImage } from '@/components/ui/images/link-image'
import { TiltHover } from '@/components/animations/tilt-hover'
import { TrainingCalendar } from '@/components/ui/activity-calendar'
import Link from 'next/link'
import { WaveEffect } from '@/components/animations/wave-effect'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { allPosts } from 'content-collections'
import { FeaturedPost } from '@/components/ui/posts/featured-post'
import { truncate } from '@/lib/utils/strings'

export const dynamic = 'force-dynamic'
export const revalidate = 3600

const posts = allPosts
  .filter((post) => post.archived === false && post.draft === false)
  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

export default function Home() {
  return (
    <main className="py-20">
      <section
        id=""
        className="mx-auto max-w-screen-lg flex flex-col items-center justify-center px-4"
      >
        <div className="flex flex-col items-center gap-4">
          <Wiggle>
            <PopIn>
              <div className="relative w-32 h-32">
                <Image
                  src="/images/hero.jpg"
                  alt="Anthony Riley"
                  fill
                  className="rounded object-cover"
                />
              </div>
            </PopIn>
          </Wiggle>
          <div className="flex flex-col text-center">
            <WordsPullUp text="Anthony Riley" className="text-4xl font-black mb-1" />
            <WordsPullUp
              text="Athlete • Developer • Entrepreneur"
              className="text-muted-foreground"
            />
            <PopIn>
              <Blockquote className="max-w-xl mx-auto text-sm my-8">
                When joining startups I noticed that the pace of development would churn out major
                amount of technical debt and spaghetti code, I was surprised to find this problem
                exacerbated and not nullified in larger software companies.
                <BlockquoteAuthor>Anthony Riley</BlockquoteAuthor>
              </Blockquote>
            </PopIn>
            <div className="max-w-prose text-left mx-auto p-4">
              <p className="leading-relaxed">
                &nbsp;&nbsp;&nbsp;&nbsp;Welcome to my website! I am a{' '}
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
      <section className="mx-auto max-w-screen-md grid grid-cols-2 gap-4 md:grid-cols-4 items-center justify-center mt-8 p-4">
        <div className="group flex flex-col p-4 col-span-2 h-full">
          <div className="grow flex items-center justify-center">
            <TrainingCalendar />
          </div>
          <div className="relative mt-4">
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
                Click on any of the squares above to see more details!
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
        <div className="group p-4 h-full">
          <TiltHover>
            <LinkImage
              src="/images/favorite-book.jpg"
              alt="My Favorite Book"
              width={200}
              height={200}
              className="aspect-[9/13] object-cover"
            />
          </TiltHover>
          <h3 className="group-hover:text-foreground transition-colors text-xs mt-4 text-center uppercase font-bold text-muted-foreground">
            Favorite Book
          </h3>
        </div>
        <div className="p-4 h-full group">
          <TiltHover degrees={1}>
            <LinkImage
              src="/images/favorite-movie.jpg"
              alt="My Favorite Book"
              width={200}
              height={200}
              className="aspect-[9/13] object-cover"
            />
          </TiltHover>
          <h3 className="group-hover:text-foreground transition-colors text-xs text-center mt-4 uppercase font-bold text-muted-foreground">
            Favorite Movie
          </h3>
        </div>
      </section>
      <section
        id="posts"
        className="mx-auto max-w-screen-lg flex flex-col items-center justify-center p-4"
      >
        <h2 className="mb-8 mt-16 text-3xl text-center md:text-5xl font-black">✨ POSTS ✨</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
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
        <WaveEffect className="mt-4">
          <Link
            href="/posts"
            className="text-sm text-center border rounded py-2 px-4 text-muted-foreground hover:text-foreground transition-colors"
          >
            View More
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
        id="contact"
        className="mx-auto max-w-screen-lg flex flex-col items-center justify-center"
      >
        <h2 className="mb-8 mt-16 text-3xl text-center md:text-5xl font-black">✨ CONTACT ✨</h2>
        <div className="flex flex-col items-center justify-center">
          <div className="flex flex-col items-center justify-center">
            <h3 className="text-2xl font-bold">TBD</h3>
          </div>
        </div>
      </section>
      <div className="h-16" />
    </main>
  )
}
