import Image from 'next/image'
import { PopIn } from '@/components/animations/pop-in'
import { WordsPullUp } from '@/components/animations/text/words-pull-up'
import TextGradientScroll from '@/components/animations/text/text-scroll'
import { Blockquote, BlockquoteAuthor } from '@/components/ui/blockquote'
import { Wiggle } from '@/components/animations/wiggle'
import { Timeline } from '@/components/ui/timeline'

export default function Home() {
  return (
    <main className="py-20">
      <section className="mx-auto max-w-screen-lg flex flex-col items-center justify-center px-4">
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
            <TextGradientScroll
              className="max-w-prose leading-4"
              text="&#9;&#9;&#9;&#9;Welcome to my website! I am a fullstack software engineer and manager with a passion for creating intuitive and beautiful experiences for users on web and mobile. Here I like to share my interests in health, endurance, music and technology. I also use this site as a store of memory for what I've said, read, seen or done, as well as an experimentation ground for new technology, unique design and interesting findings."
            />
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-screen-md grid grid-cols-2 gap-4 md:grid-cols-4 items-center justify-center pt-16 px-4">
        <div className="border rounded p-4 col-span-2">
          <h3 className="text-xs uppercase font-bold text-muted-foreground">My Training</h3>
        </div>
        <div className="border rounded p-4">
          <h3 className="text-xs uppercase font-bold text-muted-foreground">Favorite Book</h3>
        </div>
        <div className="border rounded p-4">
          <h3 className="text-xs uppercase font-bold text-muted-foreground">Favorite Movie</h3>
        </div>
      </section>
      <section className="mx-auto max-w-screen-lg flex flex-col items-center justify-center">
        <Timeline
          data={[
            {
              title: 'Jun 2019',
              description: 'Graduated from Conestoga High School.',
              content: <div>Hello</div>,
            },
            {
              title: 'Sep 2019',
              description: 'Started my undergraduate degree at Stanford University.',
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
              description: `Updated my personal website to this one what you are viewing now! The old website is still available at https://old.${process.env.NEXT_PUBLIC_URL?.split('://')[1]}`,
              content: <div>Hello</div>,
            },
          ]}
        />
      </section>
    </main>
  )
}
