import { MemeTemplate, MemeSticker, MemeMood } from '../types/meme';

// Helpers to generate SVG data URIs for meme templates so they never 404
function svgToUri(svg: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg.trim())}`;
}

export const MEME_TEMPLATES: MemeTemplate[] = [
  {
    id: 'drake_hotline',
    name: 'Drake Hotline Bling',
    category: 'Two-Panel',
    mood: 'Sarcastic',
    tags: ['drake', 'nah', 'yeah', 'comparison', 'preference', 'classic', 'sarcastic', 'choice'],
    defaultTopText: 'WRITING CLEAN DOCUMENTATION',
    defaultBottomText: 'ADDING 47 CONSOLE.LOG STATEMENTS',
    aspectRatio: '1:1',
    description: 'Drake rejecting something at top, happily approving something questionable at bottom.',
    isUnlocked: true,
    svgDataUri: svgToUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
        <!-- Top Panel (Reject) -->
        <rect x="0" y="0" width="400" height="400" fill="#cc6633" />
        <rect x="400" y="0" width="400" height="400" fill="#f8fafc" stroke="#cbd5e1" stroke-width="4" />
        <!-- Top Drake Figure -->
        <g transform="translate(40, 30)">
          <path d="M 120 180 Q 80 240 60 350 L 260 350 Q 240 240 200 180 Z" fill="#dc2626" />
          <path d="M 90 220 Q 30 180 20 130 Q 35 120 70 160 L 110 210 Z" fill="#dc2626" />
          <circle cx="20" cy="125" r="22" fill="#d97706" />
          <path d="M 8 115 L 2 135 L 25 142 L 35 120 Z" fill="#b45309" />
          <circle cx="160" cy="120" r="48" fill="#d97706" />
          <path d="M 115 100 Q 160 65 205 100 Q 195 70 145 70 Z" fill="#18181b" />
          <path d="M 125 130 Q 160 175 195 130 Q 160 160 125 130 Z" fill="#18181b" />
          <path d="M 135 110 L 150 115" stroke="#78350f" stroke-width="4" stroke-linecap="round" />
          <path d="M 165 115 L 180 110" stroke="#78350f" stroke-width="4" stroke-linecap="round" />
          <path d="M 140 140 Q 160 130 175 140" stroke="#78350f" stroke-width="4" fill="none" />
          <text x="230" y="220" font-family="sans-serif" font-weight="900" font-size="28" fill="#ffffff" opacity="0.8">NAH</text>
        </g>
        <!-- Divider line -->
        <line x1="0" y1="400" x2="800" y2="400" stroke="#0f172a" stroke-width="6" />
        <!-- Bottom Panel (Approve) -->
        <rect x="0" y="400" width="400" height="400" fill="#d97706" />
        <rect x="400" y="400" width="400" height="400" fill="#f8fafc" stroke="#cbd5e1" stroke-width="4" />
        <g transform="translate(40, 430)">
          <path d="M 120 180 Q 80 240 60 350 L 260 350 Q 240 240 200 180 Z" fill="#dc2626" />
          <circle cx="160" cy="120" r="48" fill="#d97706" />
          <path d="M 115 100 Q 160 65 205 100 Q 195 70 145 70 Z" fill="#18181b" />
          <path d="M 125 130 Q 160 175 195 130 Q 160 160 125 130 Z" fill="#18181b" />
          <circle cx="145" cy="115" r="4" fill="#78350f" />
          <circle cx="175" cy="115" r="4" fill="#78350f" />
          <path d="M 140 135 Q 160 155 180 135" stroke="#78350f" stroke-width="4" fill="#ffffff" />
          <path d="M 190 220 Q 260 170 280 140 L 305 155 L 230 250 Z" fill="#dc2626" />
          <circle cx="285" cy="135" r="18" fill="#d97706" />
          <text x="240" y="230" font-family="sans-serif" font-weight="900" font-size="28" fill="#ffffff" opacity="0.8">YEAH!</text>
        </g>
      </svg>
    `)
  },
  {
    id: 'sad_pablo_escobar',
    name: 'Sad Pablo Escobar (Waiting)',
    category: 'Sad',
    mood: 'Sad',
    tags: ['sad', 'pablo', 'waiting', 'alone', 'empty', 'lonely', 'depression', 'boredom'],
    defaultTopText: 'WAITING FOR THE CLIENT',
    defaultBottomText: 'TO APPROVE THE PRODUCTION BUDGET',
    aspectRatio: '1:1',
    description: 'Pablo Escobar looking melancholic and lonely waiting on a swing, at a kitchen table, and staring at an empty pool.',
    isUnlocked: true,
    svgDataUri: svgToUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
        <!-- Melancholy sepia background -->
        <rect width="800" height="800" fill="#1c1917" />
        <!-- Top Half: Staring at empty garden swing -->
        <rect x="0" y="0" width="800" height="400" fill="#292524" />
        <line x1="0" y1="400" x2="800" y2="400" stroke="#09090b" stroke-width="6" />
        
        <!-- Empty swing set -->
        <line x1="160" y1="80" x2="220" y2="350" stroke="#78716c" stroke-width="6" />
        <line x1="280" y1="80" x2="220" y2="350" stroke="#78716c" stroke-width="6" />
        <rect x="180" y="320" width="80" height="14" fill="#a8a29e" />

        <!-- Pablo slumped sitting on bench -->
        <g transform="translate(480, 160)">
          <!-- Blue polo shirt -->
          <path d="M 40 80 Q 90 60 140 80 L 160 220 L 20 220 Z" fill="#0284c7" />
          <!-- Slumped head with mustache -->
          <circle cx="90" cy="50" r="38" fill="#fed7aa" />
          <!-- Curly black hair -->
          <path d="M 55 45 Q 90 10 125 45 Q 120 25 60 25 Z" fill="#18181b" />
          <!-- Thick sad mustache -->
          <ellipse cx="90" cy="65" rx="16" ry="6" fill="#18181b" />
          <path d="M 75 75 Q 90 68 105 75" stroke="#78350f" stroke-width="3" fill="none" />
          <!-- Hands clasped in lap -->
          <ellipse cx="90" cy="180" rx="20" ry="14" fill="#fed7aa" />
        </g>
        <text x="400" y="380" font-family="sans-serif" font-weight="900" font-size="20" fill="#e7e5e4" text-anchor="middle" letter-spacing="4">WAITING... SILENCE...</text>

        <!-- Bottom Half: Staring at empty pool -->
        <rect x="0" y="400" width="800" height="400" fill="#1e293b" />
        <polygon points="120,440 680,440 760,760 40,760" fill="#0369a1" opacity="0.3" stroke="#0284c7" stroke-width="4" />
        <!-- Tiny lonely figure on edge -->
        <g transform="translate(370, 480)">
          <rect x="20" y="60" width="50" height="120" rx="12" fill="#0284c7" />
          <circle cx="45" cy="40" r="22" fill="#fed7aa" />
          <path d="M 30 35 Q 45 15 60 35" fill="#18181b" />
          <line x1="45" y1="52" x2="45" y2="58" stroke="#18181b" stroke-width="4" />
        </g>
        <text x="400" y="740" font-family="sans-serif" font-weight="900" font-size="22" fill="#94a3b8" text-anchor="middle" letter-spacing="3">JUST PURE EMPTINESS</text>
      </svg>
    `)
  },
  {
    id: 'crying_cat',
    name: 'Crying Cat (Sad Heavy Tears)',
    category: 'Sad',
    mood: 'Sad',
    tags: ['sad', 'cat', 'crying', 'tears', 'heartbreak', 'emotional', 'pain', 'glass eyes'],
    defaultTopText: 'WHEN YOU FINALLY GET TO RELAX',
    defaultBottomText: 'AND REMEMBER 4 ASSIGNMENTS DUE AT MIDNIGHT',
    aspectRatio: '1:1',
    description: 'Cat with glassy, tear-filled human eyes smiling weakly through immense pain.',
    isUnlocked: true,
    svgDataUri: svgToUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
        <!-- Room background -->
        <rect width="800" height="800" fill="#090d16" />
        <circle cx="400" cy="400" r="360" fill="#1e1b4b" opacity="0.6" />

        <!-- Cat Head -->
        <g transform="translate(200, 160)">
          <!-- Ears -->
          <polygon points="60,160 100,20 180,140" fill="#f8fafc" stroke="#cbd5e1" stroke-width="6" />
          <polygon points="80,140 105,50 160,130" fill="#f472b6" />
          <polygon points="220,140 300,20 340,160" fill="#f8fafc" stroke="#cbd5e1" stroke-width="6" />
          <polygon points="240,130 295,50 320,140" fill="#f472b6" />
          
          <!-- Fluffy face -->
          <ellipse cx="200" cy="240" rx="180" ry="150" fill="#ffffff" stroke="#cbd5e1" stroke-width="8" />

          <!-- Gigantic teary glassy eyes (The iconic meme feature) -->
          <!-- Left Eye -->
          <ellipse cx="130" cy="210" rx="52" ry="46" fill="#38bdf8" stroke="#0284c7" stroke-width="4" />
          <ellipse cx="130" cy="210" rx="46" ry="40" fill="#0369a1" />
          <circle cx="118" cy="195" r="16" fill="#ffffff" opacity="0.95" />
          <circle cx="145" cy="225" r="9" fill="#ffffff" opacity="0.8" />
          <!-- Heavy water pooled under left eye -->
          <path d="M 85 240 Q 130 280 175 240 Q 130 260 85 240 Z" fill="#7dd3fc" opacity="0.9" />
          <!-- Falling tear -->
          <path d="M 125 270 C 115 295, 140 310, 125 330 C 110 310, 135 295, 125 270 Z" fill="#38bdf8" />

          <!-- Right Eye -->
          <ellipse cx="270" cy="210" rx="52" ry="46" fill="#38bdf8" stroke="#0284c7" stroke-width="4" />
          <ellipse cx="270" cy="210" rx="46" ry="40" fill="#0369a1" />
          <circle cx="258" cy="195" r="16" fill="#ffffff" opacity="0.95" />
          <circle cx="285" cy="225" r="9" fill="#ffffff" opacity="0.8" />
          <!-- Heavy water pooled under right eye -->
          <path d="M 225 240 Q 270 280 315 240 Q 270 260 225 240 Z" fill="#7dd3fc" opacity="0.9" />
          <!-- Falling tear -->
          <path d="M 265 270 C 255 295, 280 310, 265 330 C 250 310, 275 295, 265 270 Z" fill="#38bdf8" />

          <!-- Pink nose & trembling sad smile -->
          <polygon points="200,265 186,252 214,252" fill="#f43f5e" />
          <path d="M 170 305 Q 200 285 230 305" stroke="#64748b" stroke-width="5" fill="none" stroke-linecap="round" />
          
          <!-- Whiskers -->
          <line x1="90" y1="270" x2="10" y2="260" stroke="#94a3b8" stroke-width="3" />
          <line x1="90" y1="285" x2="15" y2="295" stroke="#94a3b8" stroke-width="3" />
          <line x1="310" y1="270" x2="390" y2="260" stroke="#94a3b8" stroke-width="3" />
          <line x1="310" y1="285" x2="385" y2="295" stroke="#94a3b8" stroke-width="3" />
        </g>
      </svg>
    `)
  },
  {
    id: 'sad_wojak',
    name: 'Crying Wojak (Feels Guy)',
    category: 'Sad',
    mood: 'Sad',
    tags: ['sad', 'wojak', 'crying', 'feels', 'tears', 'alone', 'hurt', 'classic'],
    defaultTopText: 'NOOO YOU CANNOT JUST DEFEAT ME LIKE THAT',
    defaultBottomText: 'HA HA MEME GO BRRR',
    aspectRatio: '1:1',
    description: 'The infamous weeping Wojak with tears streaming down and wrinkled forehead.',
    isUnlocked: true,
    svgDataUri: svgToUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
        <rect width="800" height="800" fill="#0f172a" />
        <circle cx="400" cy="400" r="320" fill="#1e293b" opacity="0.5" />

        <!-- Crying Wojak Head -->
        <g transform="translate(180, 140)">
          <!-- Bald head outline -->
          <path d="M 90 280 C 40 220 50 100 150 50 C 260 0 380 70 390 190 C 400 280 340 370 260 410 C 180 430 110 350 90 280 Z" fill="#f8fafc" stroke="#000000" stroke-width="8" />
          
          <!-- Forehead worry creases -->
          <path d="M 180 90 Q 240 70 300 90" stroke="#000000" stroke-width="5" fill="none" />
          <path d="M 170 120 Q 240 100 310 120" stroke="#000000" stroke-width="5" fill="none" />
          
          <!-- Wrinkled sorrowful eyebrows -->
          <path d="M 150 170 L 210 195" stroke="#000000" stroke-width="7" stroke-linecap="round" />
          <path d="M 330 170 L 270 195" stroke="#000000" stroke-width="7" stroke-linecap="round" />

          <!-- Eyes crying heavily -->
          <ellipse cx="190" cy="210" rx="28" ry="16" fill="#38bdf8" stroke="#000000" stroke-width="5" />
          <circle cx="190" cy="210" r="6" fill="#000000" />
          <ellipse cx="290" cy="210" rx="28" ry="16" fill="#38bdf8" stroke="#000000" stroke-width="5" />
          <circle cx="290" cy="210" r="6" fill="#000000" />

          <!-- Tears pouring down -->
          <path d="M 175 225 Q 160 310 170 380" stroke="#38bdf8" stroke-width="10" stroke-linecap="round" fill="none" />
          <path d="M 205 225 Q 220 300 200 370" stroke="#38bdf8" stroke-width="8" stroke-linecap="round" fill="none" />
          <path d="M 275 225 Q 260 300 280 370" stroke="#38bdf8" stroke-width="8" stroke-linecap="round" fill="none" />
          <path d="M 305 225 Q 320 310 310 380" stroke="#38bdf8" stroke-width="10" stroke-linecap="round" fill="none" />

          <!-- Nose -->
          <path d="M 235 210 L 225 280 L 255 285" stroke="#000000" stroke-width="6" fill="none" stroke-linecap="round" />

          <!-- Trembling crying mouth -->
          <path d="M 190 340 Q 240 300 290 340" stroke="#000000" stroke-width="7" fill="none" stroke-linecap="round" />
        </g>
      </svg>
    `)
  },
  {
    id: 'disappointed_black_guy',
    name: 'Disappointed Guy (Happy vs Broken)',
    category: 'Two-Panel',
    mood: 'Sad',
    tags: ['sad', 'disappointed', 'expectation', 'reality', 'two-panel', 'broken', 'smile to frown'],
    defaultTopText: 'WAKING UP THINKING IT IS SATURDAY',
    defaultBottomText: 'RECALCULATING: IT IS ACTUALLY TUESDAY',
    aspectRatio: '1:1',
    description: 'Man smiling widely with hope in top panel, then staring in blank devastated disappointment in bottom panel.',
    isUnlocked: true,
    svgDataUri: svgToUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
        <!-- Top Panel: Pure Happiness -->
        <rect x="0" y="0" width="800" height="400" fill="#1e293b" />
        <g transform="translate(260, 40)">
          <!-- Blue shirt -->
          <path d="M 60 160 Q 140 130 220 160 L 260 360 L 20 360 Z" fill="#2563eb" />
          <!-- Head -->
          <ellipse cx="140" cy="110" rx="75" ry="90" fill="#78350f" />
          <path d="M 70 70 Q 140 20 210 70 Z" fill="#1c1917" />
          <!-- Huge beaming smile -->
          <path d="M 100 135 Q 140 185 180 135 Z" fill="#ffffff" stroke="#1c1917" stroke-width="4" />
          <circle cx="115" cy="95" r="7" fill="#ffffff" />
          <circle cx="165" cy="95" r="7" fill="#ffffff" />
        </g>

        <!-- Divider -->
        <line x1="0" y1="400" x2="800" y2="400" stroke="#090d16" stroke-width="6" />

        <!-- Bottom Panel: Devastated Disappointment -->
        <rect x="0" y="400" width="800" height="400" fill="#0f172a" />
        <g transform="translate(260, 440)">
          <path d="M 60 160 Q 140 130 220 160 L 260 360 L 20 360 Z" fill="#1e40af" />
          <!-- Head tilted in grief -->
          <ellipse cx="140" cy="110" rx="75" ry="90" fill="#78350f" />
          <path d="M 70 70 Q 140 20 210 70 Z" fill="#1c1917" />
          <!-- Disappointed downturned mouth -->
          <path d="M 105 160 Q 140 140 175 160" stroke="#1c1917" stroke-width="7" fill="none" stroke-linecap="round" />
          <!-- Cold, hollow staring eyes -->
          <ellipse cx="115" cy="95" rx="8" ry="6" fill="#000000" />
          <ellipse cx="165" cy="95" rx="8" ry="6" fill="#000000" />
        </g>
      </svg>
    `)
  },
  {
    id: 'distracted_boyfriend',
    name: 'Distracted Boyfriend',
    category: 'Trending',
    mood: 'Sarcastic',
    tags: ['jealous', 'distracted', 'boyfriend', 'temptation', 'choice', 'trending', 'funny'],
    defaultTopText: 'NEW JAVASCRIPT FRAMEWORK',
    defaultBottomText: 'ME / MY STABLE CODEBASE',
    aspectRatio: '16:9',
    description: 'Guy checking out another girl while his girlfriend looks on in disgust.',
    isUnlocked: true,
    svgDataUri: svgToUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 540" width="960" height="540">
        <defs>
          <linearGradient id="bg_city" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#38bdf8" />
            <stop offset="50%" stop-color="#bae6fd" />
            <stop offset="100%" stop-color="#cbd5e1" />
          </linearGradient>
        </defs>
        <rect width="960" height="540" fill="url(#bg_city)" />
        <rect y="380" width="960" height="160" fill="#94a3b8" />
        <g transform="translate(180, 160)">
          <circle cx="60" cy="50" r="32" fill="#fed7aa" />
          <path d="M 30 40 Q 60 10 90 40 Q 75 90 35 75 Z" fill="#78350f" />
          <path d="M 40 85 L 80 85 L 110 320 L 10 320 Z" fill="#ef4444" />
          <text x="60" y="200" font-family="sans-serif" font-weight="900" font-size="22" fill="#ffffff" text-anchor="middle">NEW SHINY THING</text>
        </g>
        <g transform="translate(480, 140)">
          <path d="M 40 100 L 130 100 L 150 340 L 20 340 Z" fill="#0284c7" />
          <circle cx="70" cy="45" r="35" fill="#fed7aa" />
          <path d="M 35 40 Q 70 5 105 40 Q 100 20 50 15 Z" fill="#451a03" />
          <circle cx="50" cy="45" r="4" fill="#0f172a" />
          <path d="M 42 60 Q 55 70 70 60" stroke="#0f172a" stroke-width="3" fill="none" />
          <path d="M 120 130 Q 190 190 220 220" stroke="#0284c7" stroke-width="26" stroke-linecap="round" fill="none" />
          <text x="80" y="220" font-family="sans-serif" font-weight="900" font-size="24" fill="#ffffff" text-anchor="middle">ME</text>
        </g>
        <g transform="translate(720, 170)">
          <circle cx="60" cy="45" r="32" fill="#fed7aa" />
          <path d="M 25 35 Q 60 5 95 35 Q 100 110 30 100 Z" fill="#b45309" />
          <path d="M 30 80 L 90 80 L 110 310 L 10 310 Z" fill="#10b981" />
          <line x1="45" y1="35" x2="58" y2="42" stroke="#78350f" stroke-width="4" />
          <line x1="75" y1="42" x2="62" y2="35" stroke="#78350f" stroke-width="4" />
          <ellipse cx="60" cy="62" rx="10" ry="8" fill="#78350f" />
          <text x="60" y="190" font-family="sans-serif" font-weight="900" font-size="20" fill="#ffffff" text-anchor="middle">RESPONSIBILITIES</text>
        </g>
      </svg>
    `)
  },
  {
    id: 'two_buttons',
    name: 'Two Buttons / Sweating Guy',
    category: 'Classic',
    mood: 'Panic',
    tags: ['buttons', 'choice', 'sweating', 'dilemma', 'panic', 'classic'],
    defaultTopText: 'FIX THE BUG (BREAKS 10 OTHER THINGS)',
    defaultBottomText: 'LEAVE THE BUG (DOCUMENT AS A FEATURE)',
    aspectRatio: '1:1',
    description: 'Man sweating nervously trying to choose between two catastrophic red buttons.',
    isUnlocked: true,
    svgDataUri: svgToUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
        <rect width="800" height="800" fill="#0f172a" />
        <rect x="50" y="50" width="700" height="320" rx="20" fill="#334155" stroke="#64748b" stroke-width="6" />
        <g transform="translate(140, 120)">
          <ellipse cx="90" cy="90" rx="80" ry="50" fill="#991b1b" />
          <ellipse cx="90" cy="80" rx="72" ry="42" fill="#ef4444" />
          <text x="90" y="85" font-family="sans-serif" font-weight="900" font-size="22" fill="#ffffff" text-anchor="middle">OPTION A</text>
        </g>
        <g transform="translate(470, 120)">
          <ellipse cx="90" cy="90" rx="80" ry="50" fill="#991b1b" />
          <ellipse cx="90" cy="80" rx="72" ry="42" fill="#ef4444" />
          <text x="90" y="85" font-family="sans-serif" font-weight="900" font-size="22" fill="#ffffff" text-anchor="middle">OPTION B</text>
        </g>
        <g transform="translate(250, 400)">
          <path d="M 60 200 Q 150 140 240 200 L 280 400 L 20 400 Z" fill="#1d4ed8" />
          <circle cx="150" cy="110" r="85" fill="#fde047" />
          <path d="M 70 180 Q 150 220 230 180 L 260 300 L 40 300 Z" fill="#dc2626" />
          <circle cx="150" cy="120" r="70" fill="#fed7aa" />
          <circle cx="120" cy="105" r="18" fill="#ffffff" stroke="#0f172a" stroke-width="3" />
          <circle cx="120" cy="105" r="7" fill="#0f172a" />
          <circle cx="180" cy="105" r="18" fill="#ffffff" stroke="#0f172a" stroke-width="3" />
          <circle cx="180" cy="105" r="7" fill="#0f172a" />
          <path d="M 110 155 Q 150 145 190 155 Q 150 180 110 155 Z" fill="#ffffff" stroke="#0f172a" stroke-width="3" />
          <path d="M 90 70 C 85 85, 95 95, 100 85 C 105 75, 95 60, 90 70 Z" fill="#38bdf8" />
          <path d="M 215 80 C 210 95, 220 105, 225 95 C 230 85, 220 70, 215 80 Z" fill="#38bdf8" />
        </g>
      </svg>
    `)
  },
  {
    id: 'woman_yelling_cat',
    name: 'Woman Yelling at Cat',
    category: 'Reaction',
    mood: 'Angry',
    tags: ['cat', 'yelling', 'table', 'dinner', 'smudge', 'reaction', 'angry', 'two-panel'],
    defaultTopText: 'YOU CANNOT JUST SLEEP 14 HOURS A DAY!',
    defaultBottomText: 'ME:',
    aspectRatio: '16:9',
    description: 'Angry woman yelling and pointing while calm confused cat sits at dinner table.',
    isUnlocked: true,
    svgDataUri: svgToUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 540" width="960" height="540">
        <rect x="0" y="0" width="480" height="540" fill="#1e1b4b" />
        <rect x="480" y="0" width="480" height="540" fill="#312e81" />
        <line x1="480" y1="0" x2="480" y2="540" stroke="#0f172a" stroke-width="6" />
        <g transform="translate(60, 100)">
          <path d="M 60 70 Q 150 0 240 70 Q 280 280 180 320 Q 80 320 60 70 Z" fill="#fbbf24" />
          <circle cx="160" cy="140" r="55" fill="#fde68a" />
          <path d="M 125 130 Q 145 145 160 135" stroke="#78350f" stroke-width="4" fill="none" />
          <path d="M 175 135 Q 190 145 205 130" stroke="#78350f" stroke-width="4" fill="none" />
          <ellipse cx="165" cy="175" rx="22" ry="16" fill="#7f1d1d" stroke="#b91c1c" stroke-width="3" />
        </g>
        <g transform="translate(540, 120)">
          <rect x="0" y="280" width="400" height="140" fill="#713f12" rx="10" />
          <ellipse cx="200" cy="300" rx="110" ry="25" fill="#e2e8f0" stroke="#94a3b8" stroke-width="4" />
          <g transform="translate(110, 80)">
            <polygon points="20,70 50,0 80,60" fill="#ffffff" stroke="#cbd5e1" stroke-width="3" />
            <polygon points="100,60 130,0 160,70" fill="#ffffff" stroke="#cbd5e1" stroke-width="3" />
            <ellipse cx="90" cy="110" rx="80" ry="65" fill="#ffffff" stroke="#cbd5e1" stroke-width="4" />
            <ellipse cx="60" cy="100" rx="12" ry="8" fill="#eab308" stroke="#713f12" stroke-width="3" />
            <ellipse cx="120" cy="100" rx="12" ry="8" fill="#eab308" stroke="#713f12" stroke-width="3" />
          </g>
        </g>
      </svg>
    `)
  },
  {
    id: 'this_is_fine',
    name: 'This Is Fine (Fire Dog)',
    category: 'Trending',
    mood: 'Panic',
    tags: ['dog', 'fire', 'fine', 'burning', 'calm', 'chaos', 'coffee', 'trending'],
    defaultTopText: '27 UNREAD SLACK MESSAGES & PRODUCTION IS DOWN',
    defaultBottomText: 'THIS IS TOTALLY FINE',
    aspectRatio: '1:1',
    description: 'Dog in fedora sipping coffee calmly while the entire room burns in flames.',
    isUnlocked: true,
    svgDataUri: svgToUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
        <rect width="800" height="800" fill="#78350f" />
        <rect y="500" width="800" height="300" fill="#451a03" />
        <path d="M 0 520 Q 50 180 120 450 Q 200 120 280 480 Q 360 90 440 500 Q 540 140 640 480 Q 720 180 800 520 L 800 800 L 0 800 Z" fill="#ea580c" />
        <rect x="180" y="520" width="440" height="40" rx="8" fill="#92400e" stroke="#713f12" stroke-width="4" />
        <g transform="translate(350, 320)">
          <rect x="40" y="140" width="120" height="140" rx="40" fill="#fef08a" stroke="#ca8a04" stroke-width="4" />
          <ellipse cx="100" cy="80" rx="70" ry="60" fill="#fef08a" stroke="#ca8a04" stroke-width="4" />
          <ellipse cx="80" cy="100" rx="45" ry="32" fill="#fef9c3" stroke="#ca8a04" stroke-width="3" />
          <circle cx="50" cy="95" r="10" fill="#1c1917" />
          <path d="M 55 110 Q 80 130 110 105" stroke="#713f12" stroke-width="4" fill="none" stroke-linecap="round" />
          <circle cx="85" cy="65" r="16" fill="#ffffff" stroke="#713f12" stroke-width="3" />
          <circle cx="135" cy="65" r="16" fill="#ffffff" stroke="#713f12" stroke-width="3" />
        </g>
      </svg>
    `)
  },
  {
    id: 'roll_safe',
    name: 'Roll Safe (Think About It)',
    category: 'Classic',
    mood: 'Big Brain',
    tags: ['roll safe', 'think about it', 'smart', 'hack', 'genius', 'big brain', 'classic'],
    defaultTopText: 'YOU CANNOT LOSE YOUR PHONE',
    defaultBottomText: 'IF YOU NEVER LEAVE YOUR BED',
    aspectRatio: '1:1',
    description: 'Man tapping finger on his head smiling with 200 IQ logic.',
    isUnlocked: true,
    svgDataUri: svgToUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
        <rect width="800" height="800" fill="#090d16" />
        <circle cx="450" cy="350" r="320" fill="#1e293b" opacity="0.4" />
        <g transform="translate(180, 260)">
          <path d="M 60 220 Q 180 160 300 220 L 360 480 L 0 480 Z" fill="#18181b" stroke="#27272a" stroke-width="4" />
          <ellipse cx="180" cy="110" rx="75" ry="85" fill="#78350f" />
          <path d="M 110 70 Q 180 15 250 70 L 255 90 Q 180 40 105 90 Z" fill="#09090b" />
          <path d="M 170 145 Q 210 165 235 135" stroke="#fef08a" stroke-width="5" fill="#ffffff" stroke-linecap="round" />
          <path d="M 20 380 Q 0 200 60 120" stroke="#18181b" stroke-width="48" stroke-linecap="round" fill="none" />
          <circle cx="68" cy="105" r="22" fill="#78350f" />
          <path d="M 72 98 L 122 88" stroke="#78350f" stroke-width="16" stroke-linecap="round" />
        </g>
      </svg>
    `)
  },
  {
    id: 'expanding_brain',
    name: 'Expanding Brain (Galaxy Brain)',
    category: 'Multi-Panel',
    mood: 'Big Brain',
    tags: ['brain', 'galaxy', 'expanding', 'evolution', 'intelligence', 'tiers', 'big brain'],
    defaultTopText: 'NORMAL CODER / CHATGPT USER / SENIOR ARCHITECT',
    defaultBottomText: 'PRINTS DEBUGGING DIRECTLY TO SERIAL PRINTER',
    aspectRatio: '1:1',
    description: '4 tiers of consciousness from small normal brain to cosmic ascended glowing entity.',
    isUnlocked: true,
    svgDataUri: svgToUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
        <rect width="800" height="800" fill="#090d16" />
        <rect x="10" y="10" width="380" height="185" fill="#1e293b" rx="8" />
        <rect x="400" y="10" width="390" height="185" fill="#0f172a" rx="8" />
        <ellipse cx="600" cy="100" rx="55" ry="45" fill="#f472b6" />
        <rect x="10" y="205" width="380" height="185" fill="#1e293b" rx="8" />
        <rect x="400" y="205" width="390" height="185" fill="#0f172a" rx="8" />
        <ellipse cx="600" cy="295" rx="65" ry="50" fill="#38bdf8" />
        <rect x="10" y="400" width="380" height="185" fill="#1e293b" rx="8" />
        <rect x="400" y="400" width="390" height="185" fill="#0f172a" rx="8" />
        <ellipse cx="600" cy="490" rx="75" ry="60" fill="#a855f7" />
        <rect x="10" y="595" width="380" height="195" fill="#1e293b" rx="8" />
        <rect x="400" y="595" width="390" height="195" fill="#0f172a" rx="8" />
        <circle cx="600" cy="690" r="70" fill="#ffffff" />
      </svg>
    `)
  },
  {
    id: 'stonks',
    name: 'Stonks Guy',
    category: 'Trending',
    mood: 'Smug',
    tags: ['stonks', 'finance', 'money', 'business', 'mannequin', 'wallstreet', 'smug', 'crypto'],
    defaultTopText: 'SELLS 1 COFFEE FOR $5',
    defaultBottomText: 'STONKS',
    aspectRatio: '1:1',
    description: 'Bald meme mannequin in suit standing in front of rising green stock market chart.',
    isUnlocked: true,
    svgDataUri: svgToUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
        <rect width="800" height="800" fill="#022c22" />
        <path d="M 50 650 L 300 480 L 450 540 L 720 180" stroke="#22c55e" stroke-width="24" fill="none" stroke-linecap="round" stroke-linejoin="round" />
        <polygon points="720,130 670,190 750,220" fill="#22c55e" />
        <g transform="translate(180, 260)">
          <path d="M 60 220 Q 180 180 300 220 L 360 480 L 0 480 Z" fill="#0f172a" />
          <ellipse cx="180" cy="110" rx="80" ry="100" fill="#e2e8f0" stroke="#94a3b8" stroke-width="4" transform="rotate(8 180 110)" />
          <ellipse cx="150" cy="95" rx="12" ry="10" fill="#0f172a" />
          <ellipse cx="210" cy="100" rx="12" ry="10" fill="#0f172a" />
        </g>
        <text x="400" y="740" font-family="sans-serif" font-weight="900" font-size="72" fill="#22c55e" text-anchor="middle" letter-spacing="8">STONKS ↗</text>
      </svg>
    `)
  },
  {
    id: 'golden_doge_nft',
    name: 'Cyber Golden Doge 2026 (Exclusive)',
    category: 'Community',
    mood: 'Smug',
    tags: ['exclusive', 'crypto', 'nft', 'doge', 'gold', 'vip', 'premium', 'smug'],
    defaultTopText: 'HODL TILL THE SUN BURNS OUT',
    defaultBottomText: 'UNLIMITED CRYPTO & MEME POWER',
    aspectRatio: '1:1',
    description: 'Rare holographic 24K gold Cyber Doge with neon crown and laser visors. Available on Marketplace with Crypto or UPI.',
    isUnlocked: false,
    price: {
      crypto: 0.005,
      cryptoCurrency: 'ETH',
      upiInr: 49,
      isPremium: true,
    },
    author: 'Satoshi_MemeLord',
    salesCount: 142,
    svgDataUri: svgToUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
        <defs>
          <radialGradient id="gold_glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#fef08a" />
            <stop offset="40%" stop-color="#eab308" />
            <stop offset="100%" stop-color="#713f12" />
          </radialGradient>
        </defs>
        <rect width="800" height="800" fill="#090514" />
        <circle cx="400" cy="400" r="340" fill="url(#gold_glow)" opacity="0.3" />
        <circle cx="400" cy="400" r="300" fill="none" stroke="#facc15" stroke-width="4" stroke-dasharray="12 12" />
        
        <!-- Cyber Gold Crown -->
        <polygon points="260,180 300,100 360,160 400,80 440,160 500,100 540,180" fill="#facc15" stroke="#ca8a04" stroke-width="6" />
        <circle cx="400" cy="90" r="10" fill="#38bdf8" />
        <circle cx="300" cy="110" r="8" fill="#ec4899" />
        <circle cx="500" cy="110" r="8" fill="#10b981" />

        <!-- Gold Doge Head -->
        <g transform="translate(250, 180)">
          <ellipse cx="150" cy="180" rx="140" ry="130" fill="url(#gold_glow)" stroke="#ca8a04" stroke-width="8" />
          <polygon points="40,90 90,0 140,80" fill="#eab308" stroke="#ca8a04" stroke-width="6" />
          <polygon points="160,80 210,0 260,90" fill="#eab308" stroke="#ca8a04" stroke-width="6" />
          
          <!-- Neon Cyber Visor Sunglasses -->
          <rect x="50" y="140" width="200" height="50" rx="12" fill="#ef4444" stroke="#f87171" stroke-width="4" />
          <line x1="60" y1="165" x2="240" y2="165" stroke="#fef08a" stroke-width="6" />

          <!-- Golden Snout -->
          <ellipse cx="150" cy="225" rx="80" ry="55" fill="#fef08a" stroke="#ca8a04" stroke-width="4" />
          <circle cx="150" cy="205" r="18" fill="#18181b" />
          <path d="M 130 240 Q 150 260 170 240" stroke="#713f12" stroke-width="6" fill="none" />
        </g>
        <text x="400" y="680" font-family="'Orbitron', sans-serif" font-weight="900" font-size="34" fill="#facc15" text-anchor="middle" letter-spacing="4">★ 24K CYBER DOGE ★</text>
        <text x="400" y="730" font-family="sans-serif" font-weight="700" font-size="18" fill="#38bdf8" text-anchor="middle">MARKETPLACE EXCLUSIVE NFT</text>
      </svg>
    `)
  }
];

export const MEME_FONTS = [
  { id: 'Impact', name: 'Classic Impact', cssFamily: 'Impact, Haettenschweiler, sans-serif' },
  { id: 'Anton', name: 'Anton Heavy', cssFamily: "'Anton', sans-serif" },
  { id: 'Bebas Neue', name: 'Bebas Neue', cssFamily: "'Bebas Neue', sans-serif" },
  { id: 'Montserrat', name: 'Montserrat Bold', cssFamily: "'Montserrat', sans-serif" },
  { id: 'Permanent Marker', name: 'Graffiti Marker', cssFamily: "'Permanent Marker', cursive" },
  { id: 'Orbitron', name: 'Cyberpunk Orbitron', cssFamily: "'Orbitron', sans-serif" },
  { id: 'Oswald', name: 'Oswald Cond', cssFamily: "'Oswald', sans-serif" },
  { id: 'Inter', name: 'Inter Clean', cssFamily: "'Inter', sans-serif" },
];

export const POPULAR_COLORS = [
  '#ffffff', // Classic White
  '#000000', // Black
  '#facc15', // Meme Yellow
  '#ef4444', // Red
  '#22c55e', // Green
  '#06b6d4', // Cyan
  '#a855f7', // Purple
  '#ec4899', // Pink
  '#f97316', // Orange
];

export const MEME_STICKER_PRESETS: Array<{ type: MemeSticker['type']; label: string; emoji: string }> = [
  { type: 'deal_with_it', label: 'Sunglasses', emoji: '🕶️' },
  { type: 'laser_eyes', label: 'Laser Eyes', emoji: '👀' },
  { type: 'stonks', label: 'Stonks Up', emoji: '📈' },
  { type: 'not_stonks', label: 'Stonks Down', emoji: '📉' },
  { type: 'hundred', label: '100 Score', emoji: '💯' },
  { type: 'fire', label: 'Fire Lit', emoji: '🔥' },
  { type: 'skull', label: 'Dead / Skull', emoji: '💀' },
  { type: 'clown', label: 'Clown Mode', emoji: '🤡' },
  { type: 'verified', label: 'Verified', emoji: '✅' },
  { type: 'sparkle', label: 'Sparkles', emoji: '✨' },
  { type: 'crying_laughing', label: 'Crying Laughing', emoji: '😂' },
];
