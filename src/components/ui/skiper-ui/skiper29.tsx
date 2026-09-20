'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import React, { useRef } from 'react'

import { ArrowWeired } from '@/components/arrow-weired'
import { RainCanvas } from '@/components/rain-canvas'
import { TextRoll } from '@/components/ui/skiper-ui/skiper58'
import { AUTHOR, INSTAGRAM_URL, isExternal } from '@/lib/site'

const shortcuts: { label: string; href: string }[] = [
  { label: 'notes', href: '/garden' },
  { label: 'references', href: '/refs' },
  { label: 'about me', href: '#who-am-i' },
  { label: 'instagram', href: INSTAGRAM_URL },
]

const Skiper29 = () => {
  const gallery = useRef(null)

  const { scrollYProgress } = useScroll({
    target: gallery,
    offset: ['start end', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0.6, 1], ['0%', '30%'])

  return (
    <div className="flex w-screen flex-col items-center overflow-hidden bg-[#F9F7EF] text-black">
      {/* Same treatment as the section titles on the notes pages */}
      <h1 className="font-custom mt-10 h-[0.71em] w-full whitespace-nowrap border-y border-black/15 text-center text-[15vw] uppercase leading-[0.9] lg:mt-14">
        bibs garden
      </h1>

      <div
        ref={gallery}
        className="relative mt-10 flex h-[60vh] w-screen items-end overflow-hidden bg-[#F9F7EF]"
      >
        <motion.div className="size-full" style={{ y }}>
          <RainCanvas className="size-full" color="#000" />
        </motion.div>
      </div>

      <section className="mt-14 grid w-full gap-10 px-[3.2vw] xl:grid-cols-2 xl:items-start">
        <h2 className="type-h2 max-w-[14ch] text-balance">already know what you want?</h2>
        <ul className="flex flex-col items-end">
          {shortcuts.map(({ label, href }) => {
            const text = (
              <TextRoll center className="type-h1">
                {label}
              </TextRoll>
            )

            return (
              <li key={label} className="relative flex cursor-pointer flex-col items-end">
                {isExternal(href) ? (
                  <a href={href} target="_blank" rel="noreferrer">
                    {text}
                  </a>
                ) : (
                  <Link href={href}>{text}</Link>
                )}
              </li>
            )
          })}
        </ul>
      </section>

      <div className="mt-35 flex w-full flex-col items-center justify-center">
        <p className="type-caption my-10 px-6 text-center">its a doggy dog world out there</p>
        <h2 className="type-h1 h-[0.71em] w-full border-b border-t text-center">{AUTHOR}</h2>
        <div className="my-4 flex size-8 items-center justify-center rounded-full bg-black p-2 text-[#F9F7EF]">
          <ArrowWeired />
        </div>
      </div>

      {/* Draft copy */}
      <p className="type-body mt-2 max-w-[60ch] px-6 text-center">
        A digital garden is a website that grows in public: notes, references, and half-finished
        ideas, tended over time instead of published once. Nothing here is in order, so wander.
      </p>

      <div id="who-am-i" className="mt-35 mb-42 flex w-full scroll-mt-10 flex-col items-center">
        {/* Sized to the viewport so it stays on one line; the em height crops the font's leading like the other headings */}
        <h2 className="type-h2 h-[0.71em] w-full whitespace-nowrap border-b border-t text-center">
          who am i?
        </h2>
        {/* Proportions measured from the reference (1605px wide): 46px light mono (0.6em advance), 1.33 leading, 4ch first-line indent, 80% measure starting 3.2% in */}
        <p className="type-lede mt-[10vw] ml-[3.2vw] w-[93.6vw] self-start indent-[4ch] lg:w-[80vw]">
          I’m Zuhayer, a designer based in Bangladesh (no, not India). I work across branding,
          product, design engineering, wherever a problem actually needs solving. Also stupidly good
          at Mario Kart.
        </p>
      </div>
    </div>
  )
}

export { Skiper29 }

/**
 * Skiper 29 Parallax_001 — React + framer motion + lenis
 * Inspired by and adapted from https://www.siena.film/films/my-project-x
 * We respect the original creators. This is an inspired rebuild with our own taste and does not claim any ownership.
 * These animations aren’t associated with the siena.film . They’re independent recreations meant to study interaction design
 *
 * License & Usage:
 * - Free to use and modify in both personal and commercial projects.
 * - Attribution to Skiper UI is required when using the free version.
 * - No attribution required with Skiper UI Pro.
 *
 * Feedback and contributions are welcome.
 *
 * Author: @gurvinder-singh02
 * Website: https://gxuri.me
 * Twitter: https://x.com/Gur__vi
 */
