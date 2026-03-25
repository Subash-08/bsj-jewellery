'use client';

import { useRef, useState } from 'react';

interface StyleItem {
  title: string;
  href: string;
  col: number;
  row: number;
  rowSpan: number;
  mobileImg: string;
  desktopImg: string;
  width: number;
  height: number;
}

interface StyleGridClientProps {
  data: StyleItem[];
}

export default function StyleGridClient({ data }: StyleGridClientProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const SCROLL_AMOUNT = 300;

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  };

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -SCROLL_AMOUNT, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: SCROLL_AMOUNT, behavior: 'smooth' });
  };

  return (
    <>
      <div className="sgc-wrapper">
        {/* Left arrow */}
        {/* <button
          className={`sgc-arrow sgc-arrow--left ${!canScrollLeft ? 'sgc-arrow--hidden' : ''}`}
          onClick={scrollLeft}
          aria-label="Scroll left"
        >
          <svg viewBox="0 0 10 6" width="12" height="12" fill="currentColor">
            <path fillRule="evenodd" clipRule="evenodd"
              d="M9.354.646a.5.5 0 00-.708 0L5 4.293 1.354.646a.5.5 0 00-.708.708l4 4a.5.5 0 00.708 0l4-4a.5.5 0 000-.708z"
            />
          </svg>
        </button> */}

        {/* Scrollable grid container */}
        <div
          className="sgc-scroll"
          ref={scrollRef}
          onScroll={updateScrollState}
        >
          <div className="sgc-grid">
            {data.map((item, i) => (
              <a
                key={`${item.title}-${i}`}
                href={item.href}
                className="sgc-card"
                style={{
                  gridColumn: `${item.col}`,
                  gridRow: `${item.row} / span ${item.rowSpan}`,
                }}
              >
                {/* Mobile image */}
                <img
                  src={item.mobileImg}
                  alt={item.title}
                  width={item.width}
                  height={item.height}
                  loading="lazy"
                  className="sgc-img sgc-img--mobile"
                />
                {/* Desktop image */}
                <img
                  src={item.desktopImg}
                  alt={item.title}
                  width={item.width}
                  height={item.height}
                  loading="lazy"
                  className="sgc-img sgc-img--desktop"
                />
              </a>
            ))}
          </div>
        </div>

        {/* Right arrow */}
        {/* <button
          className={`sgc-arrow sgc-arrow--right ${!canScrollRight ? 'sgc-arrow--hidden' : ''}`}
          onClick={scrollRight}
          aria-label="Scroll right"
        >
          <svg viewBox="0 0 10 6" width="12" height="12" fill="currentColor">
            <path fillRule="evenodd" clipRule="evenodd"
              d="M9.354.646a.5.5 0 00-.708 0L5 4.293 1.354.646a.5.5 0 00-.708.708l4 4a.5.5 0 00.708 0l4-4a.5.5 0 000-.708z"
            />
          </svg>
        </button> */}
      </div>

      <style>{`
        /* ── Outer wrapper: positions arrows over the scroll area ── */
        .sgc-wrapper {
          position: relative;
          width: 100%;
        }

        /* ── Scroll container ──
           Hides scrollbar, clips horizontally.
           Cards slide off right edge on narrow screens.
        ── */
        .sgc-scroll {
          width: 100%;
          overflow-x: auto;
          overflow-y: hidden;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .sgc-scroll::-webkit-scrollbar {
          display: none;
        }

        /* ── Grid ──
           ALWAYS fixed pixel columns — never fluid.
           Columns never change width at any screen size.
           Only the scroll container clips them on mobile.

           Column widths (same proportions as GIVA):
             col1  155px  small stacked pair
             col2  175px  Party Wear (tall span-2)
             col3  155px  small stacked pair
             col4  220px  Twinning (widest, tall span-2)
             col5  155px  small stacked pair
           Total = 860px + 4×8px gaps = 892px
        ── */
        .sgc-grid {
          display: grid;
          grid-template-columns: 155px 175px 155px 220px 155px;
          grid-template-rows: 235px 235px;
          gap: 8px;
          /* Width is always the sum of columns — never stretches or shrinks */
          width: max-content;
        }

        /* ── On screens wide enough, scale up row height only ──
           Columns stay fixed px. Only rows grow.
           Switch point: 892px (grid width) + 2×16px padding = ~924px
        ── */
        @media (min-width: 924px) {
          .sgc-grid {
            /* Now fill container width using same proportions as fr */
            width: 100%;
            grid-template-columns: 155fr 175fr 155fr 220fr 155fr;
            grid-template-rows: 240px 240px;
          }
        }

        @media (min-width: 1100px) {
          .sgc-grid {
            grid-template-rows: 265px 265px;
          }
        }

        @media (min-width: 1280px) {
          .sgc-grid {
            grid-template-rows: 285px 285px;
          }
        }

        /* ── Card = <a> tag, fills its grid cell exactly ── */
        .sgc-card {
          display: block;
          position: relative;
          border-radius: 20px;
          overflow: hidden;
          /* Card fills the grid cell — image fills the card */
          width: 100%;
          height: 100%;
          background: #E8E2D9;
          text-decoration: none;
          transition: transform 0.28s cubic-bezier(0.34,1.4,0.64,1);
        }

        .sgc-card:hover {
          transform: scale(1.025);
          z-index: 2;
        }

        /* ── Images ──
           Both images fill the card fully with object-fit cover.
           object-position: center top keeps subjects (faces) in frame.
           The image never changes size — the card clips it.
        ── */
        .sgc-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center top;
          display: block;
        }

        /* Mobile image: show on small screens, hide on desktop */
        .sgc-img--mobile {
          display: block;
        }

        /* Desktop image: hide on small screens */
        .sgc-img--desktop {
          display: none;
        }

        @media (min-width: 768px) {
          .sgc-img--mobile {
            display: none;
          }
          .sgc-img--desktop {
            display: block;
          }
        }

        /* ── Arrow buttons ──
           Centered vertically on the grid.
           Hidden when can't scroll that direction.
        ── */
        .sgc-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%) rotate(-90deg); /* caret SVG points down, rotate for left/right */
          z-index: 10;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1px solid #E0D8CC;
          background: #FFFFFF;
          color: #4A3F35;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0,0,0,0.12);
          transition: opacity 0.2s, background 0.2s, color 0.2s;
        }

        .sgc-arrow:hover {
          background: #1C1510;
          color: #FFFFFF;
          border-color: #1C1510;
        }

        .sgc-arrow--left {
          left: -18px;
          transform: translateY(-50%) rotate(90deg);
        }

        .sgc-arrow--right {
          right: -18px;
          transform: translateY(-50%) rotate(-90deg);
        }

        .sgc-arrow--hidden {
          opacity: 0;
          pointer-events: none;
        }

        /* Hide arrows on mobile — touch scroll is enough */
        @media (max-width: 767px) {
          .sgc-arrow {
            display: none;
          }
        }
      `}</style>
    </>
  );
}