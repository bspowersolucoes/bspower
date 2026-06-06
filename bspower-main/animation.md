Create a scroll-driven portfolio showcase section with floating project cards. The animation should feel cinematic, smooth, and depth-oriented.

Layout Behavior
The page contains multiple project cards positioned in a loose grid/masonry layout.
Cards are absolutely positioned with overlapping negative space to create a “floating canvas” effect.
Each card contains:
title,
short description,
image/screenshot preview,
subtle shadow/glow.
Animation System

Implement a scroll-linked parallax animation where each card moves independently at different speeds.

Motion Details
As the user scrolls vertically:
cards translate vertically at different rates,
some cards slightly translate horizontally,
background movement is slower than foreground movement,
motion uses smooth easing/interpolation instead of direct scroll snapping.
Entrance Animation

When cards enter the viewport:

initial state:
opacity: 0
translateY: 40px
slight scale: 0.96
optional blur: 4px
animate to:
opacity: 1
translateY: 0
scale: 1
blur: 0
duration: ~0.8–1.2s
easing: cubic-bezier(0.22, 1, 0.36, 1)
Parallax Rules

Assign each card a unique parallax factor:

foreground cards: speed = 0.25–0.35
midground cards: speed = 0.15–0.2
background cards: speed = 0.05–0.1

Movement should be calculated from scroll progress:

translateY = scrollProgress * speed * viewportHeight
Smooth Scrolling

Use smooth inertial scrolling:

interpolate scroll position with lerp
avoid native abrupt scrolling
target ~60fps motion
Visual Style
dark matte background (#0f0f12 range)
soft shadows
subtle glow accents
minimalistic typography
modern developer portfolio aesthetic
lots of empty space between cards
Interaction

Optional:

slight hover lift:
translateY(-6px)
scale(1.01)
hover transition duration: 250ms
Recommended Stack
React + Framer Motion
OR
GSAP + ScrollTrigger
Lenis for smooth scrolling
Overall Feel

The animation should resemble:

Apple-style smooth motion,
modern SaaS portfolio websites,
layered floating UI panels moving in depth with scroll-based parallax.