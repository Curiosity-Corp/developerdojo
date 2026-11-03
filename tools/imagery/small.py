import os, math, random
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
W='/var/tmp/agent-scratch/mrh/dd/work/'
def w(n,s): open(W+n,'w').write(s)

# ---------- rank icons
def badge(name, c1, c2, glyph):
    w(f'rank-{name}.svg', f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" width="96" height="96" role="img" aria-label="{name} rank icon">
<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{c1}"/><stop offset="1" stop-color="{c2}"/></linearGradient></defs>
<rect x="2" y="2" width="92" height="92" rx="22" fill="url(#g)"/>
<rect x="3.5" y="3.5" width="89" height="89" rx="20.5" fill="none" stroke="#fff" stroke-opacity=".28" stroke-width="2"/>
<g fill="#f7edd3" stroke="#f7edd3" stroke-linecap="round" stroke-linejoin="round">{glyph}</g></svg>''')
sprout='''<path d="M48 72V45" stroke-width="4" fill="none"/>
<path d="M48 52C34 53 25 45 24 33C38 32 47 39 48 52Z" stroke-width="1.5"/>
<path d="M48 46C48 31 58 22 73 22C73 37 63 46 48 46Z" stroke-width="1.5"/>
<path d="M30 38L42 47M52 41L66 30" stroke="#6b7a35" stroke-opacity=".7" stroke-width="1.8" fill="none"/>
<path d="M33 73H63" stroke-width="4" fill="none"/>'''
mount='''<path d="M15 72L38 33L49 52L58 40L81 72Z" stroke-width="2"/>
<path d="M38 33L32.5 42.5L37 40.5L40 44.5L43.5 40.5L44.5 42.5Z" fill="#b97d12" stroke="none" fill-opacity=".55"/>
<path d="M58 40L53.5 47L58 45.5L61.5 49L63 46.5Z" fill="#b97d12" stroke="none" fill-opacity=".55"/>
<path d="M15 72H81" stroke-width="3" fill="none"/>'''
torii='''<path d="M14 28Q48 37 82 28L80 37Q48 45 16 37Z" stroke-width="1.5"/>
<rect x="24" y="44" width="48" height="6.5" rx="1.5" stroke="none"/>
<rect x="30" y="38" width="8" height="36" rx="1.5" stroke="none"/>
<rect x="58" y="38" width="8" height="36" rx="1.5" stroke="none"/>
<rect x="45" y="38" width="6" height="7" stroke="none"/>
<rect x="26" y="72" width="16" height="4" rx="1.5" stroke="none"/><rect x="54" y="72" width="16" height="4" rx="1.5" stroke="none"/>'''
badge('developer','#7f9140','#5d6e2c',sprout)
badge('master-developer','#d9a62e','#b57f10',mount)
badge('sensei','#c9552f','#9c3a1d',torii)

# ---------- wordmark
GOLD='#d9a62e'
def bracket(x,h,mirror=False):
    # unit design 44x100, scaled to height h
    s=h/100
    d='M44 0L8 50L44 100L39.5 100L-2 50L39.5 0Z'
    if mirror: return f'<path transform="translate({x+44*s},0) scale({-s},{s})" d="{d}" fill="{GOLD}"/>'
    return f'<path transform="translate({x},0) scale({s})" d="{d}" fill="{GOLD}"/>'
font=TTFont('/usr/share/fonts/truetype/lato/Lato-Black.ttf')
gs=font.getGlyphSet(); cmap=font.getBestCmap(); upm=font['head'].unitsPerEm
def text_path(txt,x,size,track):
    sc=size/upm; out=[]; cx=x
    for ch in txt:
        g=cmap[ord(ch)]; pen=SVGPathPen(gs)
        tp=TransformPen(pen,(sc,0,0,-sc,cx,0)); gs[g].draw(tp)
        out.append(pen.getCommands()); cx+=gs[g].width*sc+track
    return ' '.join(out), cx
def wordmark(name, c1, c2):
    cap=font['OS/2'].sCapHeight/upm
    size=64/cap*0.64/0.64  # cap height 64 => size
    size=64/cap
    h=100
    x=0
    parts=[bracket(2,h), bracket(60,h,True)]
    tx=118
    d1,e1=text_path('DEVELOPER',tx,size,2.5)
    d2,e2=text_path('DOJO',e1,size,2.5)
    # baseline so caps centred vertically in 100
    base=50+32
    W_=e2+2
    w(name,f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W_:.0f} 100" height="40" role="img" aria-label="Developer Dojo">
{''.join(parts)}
<g transform="translate(0,{base})"><path d="{d1}" fill="{c1}"/><path d="{d2}" fill="{c2}"/></g></svg>''')
wordmark('logo-light.svg','#1b2a22','#7d7a68')   # for use on cream backgrounds
wordmark('logo-dark.svg','#f6ecd3','#b3ad98')    # for use on ink-green backgrounds
w('logo-mark.svg',f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" role="img" aria-label="Developer Dojo">
<rect width="64" height="64" rx="14" fill="#14231d"/>
<g transform="translate(9,14) scale(.36)"><path d="M44 0L8 50L44 100L39.5 100L-2 50L39.5 0Z" fill="{GOLD}"/></g>
<g transform="translate(55,14) scale(-.36,.36)"><path d="M44 0L8 50L44 100L39.5 100L-2 50L39.5 0Z" fill="{GOLD}"/></g>
<circle cx="32" cy="32" r="3.2" fill="#f6ecd3"/></svg>''')

# ---------- enso (gold brush circle)
random.seed(7)
def enso():
    cx=cy=500; pts_o=[]; pts_i=[]
    N=240; a0=math.radians(-60); sweep=math.radians(300)
    for i in range(N+1):
        t=i/N; a=a0+sweep*t
        # thickness: thin start, heavy mid, taper end
        th=22+112*math.sin(math.pi*min(1,t*1.12))**0.7*(1-0.3*t)
        r=350+18*math.sin(t*5.1+1)+t*30  # spiral outward
        pts_o.append((cx+(r+th/2)*math.cos(a), cy+(r+th/2)*math.sin(a)))
        pts_i.append((cx+(r-th/2)*math.cos(a), cy+(r-th/2)*math.sin(a)))
    pts=pts_o+pts_i[::-1]
    d='M'+' L'.join(f'{x:.1f} {y:.1f}' for x,y in pts)+'Z'
    w('enso.svg',f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000" role="img" aria-label="Gold ensō brush circle">
<defs>
<linearGradient id="gd" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f1cd6e"/><stop offset=".5" stop-color="#d9a62e"/><stop offset="1" stop-color="#a97813"/></linearGradient>
<filter id="rough" x="-10%" y="-10%" width="120%" height="120%">
<feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="3" seed="4" result="n"/>
<feDisplacementMap in="SourceGraphic" in2="n" scale="22" result="d"/>
<feTurbulence type="fractalNoise" baseFrequency=".9 .06" numOctaves="2" seed="9" result="f"/>
<feColorMatrix in="f" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.5 1.9" result="m"/>
<feComposite in="d" in2="m" operator="in"/>
</filter></defs>
<path d="{d}" fill="url(#gd)" filter="url(#rough)"/></svg>''')
enso()
