import random, math, sys
W='/var/tmp/agent-scratch/mrh/dd/work/'
def pad(cx,cy,rx,ry,seed):
    r=random.Random(seed); out=[]
    for i in range(7):
        ox=r.uniform(-rx*.7,rx*.7); oy=r.uniform(-ry*.5,ry*.4)
        a=r.uniform(.6,1)
        out.append(f'<ellipse cx="{cx+ox:.0f}" cy="{cy+oy:.0f}" rx="{rx*r.uniform(.45,.7):.0f}" ry="{ry*r.uniform(.6,.95):.0f}" fill="#243d22"/>')
    for i in range(6):
        ox=r.uniform(-rx*.6,rx*.6); oy=r.uniform(-ry*.7,-ry*.1)
        out.append(f'<ellipse cx="{cx+ox:.0f}" cy="{cy+oy:.0f}" rx="{rx*r.uniform(.3,.5):.0f}" ry="{ry*r.uniform(.3,.5):.0f}" fill="#4d6b2b" opacity=".85"/>')
    for i in range(5):
        ox=r.uniform(-rx*.5,rx*.5); oy=r.uniform(-ry*.9,-ry*.35)
        out.append(f'<ellipse cx="{cx+ox:.0f}" cy="{cy+oy:.0f}" rx="{rx*r.uniform(.15,.3):.0f}" ry="{ry*r.uniform(.15,.25):.0f}" fill="#c8b455" opacity=".55"/>')
    return ''.join(out)

def pine():
    s='<g>'
    # trunk
    s+='<path d="M1712 600C1700 540 1650 500 1640 440C1632 390 1600 350 1585 305L1606 300C1625 340 1662 380 1668 430C1676 485 1722 520 1742 600Z" fill="#2a1d14"/>'
    s+='<path d="M1640 440C1632 390 1600 350 1585 305" stroke="#6b4a2c" stroke-width="3" fill="none" opacity=".7"/>'
    # branches
    for (x1,y1,x2,y2) in [(1650,440,1520,380),(1665,430,1790,425),(1630,380,1760,335),(1610,330,1700,265),(1600,320,1500,300)]:
        s+=f'<path d="M{x1} {y1}Q{(x1+x2)/2} {min(y1,y2)-18} {x2} {y2}" stroke="#2a1d14" stroke-width="9" fill="none" stroke-linecap="round"/>'
    for i,(cx,cy,rx,ry) in enumerate([(1500,375,120,40),(1790,418,130,42),(1760,328,120,38),(1690,262,110,36),(1520,298,115,38),(1640,215,95,32),(1620,378,90,30)]):
        s+=pad(cx,cy,rx,ry,i+11)
    return s+'</g>'

def view():
    s='<g clip-path="url(#vclip)">'
    s+='<rect x="1190" y="150" width="710" height="445" fill="url(#sky)"/>'
    s+='<ellipse cx="1480" cy="250" rx="260" ry="90" fill="#fff6d8" opacity=".55" filter="url(#b30)"/>'
    s+='<path d="M1190 430L1260 380L1330 410L1420 340L1510 400L1580 360L1700 420L1790 370L1900 410V600H1190Z" fill="#a9bba8" opacity=".95" filter="url(#b3)"/>'
    s+='<path d="M1190 460L1290 420L1400 455L1500 410L1610 460L1730 430L1840 470L1900 450V600H1190Z" fill="#7c9580" opacity=".95" filter="url(#b2)"/>'
    s+='<ellipse cx="1500" cy="440" rx="420" ry="26" fill="#f4ecd0" opacity=".7" filter="url(#b20)"/>'
    s+='<path d="M1190 500C1300 470 1400 490 1520 485C1650 480 1780 470 1900 495V600H1190Z" fill="#a7b25e"/>'
    s+='<path d="M1190 530C1320 505 1450 520 1580 515C1700 510 1800 505 1900 520V600H1190Z" fill="#7f9440"/>'
    for i in range(9):
        y=508+i*9
        s+=f'<path d="M1190 {y}C1400 {y-14} 1700 {y+6} 1900 {y-8}" stroke="#5f7a30" stroke-width="1.4" fill="none" opacity=".45"/>'
    s+=pine()
    s+='<ellipse cx="1420" cy="505" rx="360" ry="22" fill="#fbf2d4" opacity=".55" filter="url(#b20)"/>'
    # veranda rail
    s+='<rect x="1190" y="520" width="710" height="14" fill="#35241a"/><rect x="1190" y="520" width="710" height="3" fill="#8a6a45" opacity=".7"/>'
    for x in range(1200,1900,95): s+=f'<rect x="{x}" y="520" width="12" height="80" fill="#2f2016"/>'
    s+='<rect x="1190" y="578" width="710" height="22" fill="#24170f"/>'
    s+='</g>'
    return s

def lattice():
    x0,y0,x1,y1=1190,150,1900,595
    s=''
    cw=(x1-x0)/6; rh=(y1-y0)/4
    # shoji paper on side columns
    s+=f'<rect x="{x0}" y="{y0}" width="{2*cw}" height="{y1-y0}" fill="#eadcb8" opacity=".5"/>'
    s+=f'<rect x="{x1-cw}" y="{y0}" width="{cw}" height="{y1-y0}" fill="#eadcb8" opacity=".42"/>'
    s+=f'<rect x="{x0+2*cw}" y="{y0}" width="{3*cw}" height="{rh}" fill="#eadcb8" opacity=".12"/>'
    for k in range(1,6):
        x=x0+k*cw; s+=f'<rect x="{x-4:.0f}" y="{y0}" width="8" height="{y1-y0}" fill="#2a1b11"/><rect x="{x-4:.0f}" y="{y0}" width="2" height="{y1-y0}" fill="#7a5835" opacity=".6"/>'
    for k in range(1,4):
        y=y0+k*rh; s+=f'<rect x="{x0}" y="{y-4:.0f}" width="{x1-x0}" height="8" fill="#2a1b11"/>'
    # fine sub-grid on paper columns
    for k in range(1,4):
        for sub in range(1,3):
            yy=y0+(k-1)*rh+sub*rh/3
            s+=f'<rect x="{x0}" y="{yy:.0f}" width="{2*cw}" height="2" fill="#3a281a" opacity=".7"/>'
    # outer frame
    s+=f'<rect x="{x0-18}" y="{y0-18}" width="{x1-x0+36}" height="{y1-y0+36}" fill="none" stroke="#25170e" stroke-width="22"/>'
    s+=f'<rect x="{x0-28}" y="{y0-28}" width="{x1-x0+56}" height="{y1-y0+56}" fill="none" stroke="#6b4a2a" stroke-width="2" opacity=".6"/>'
    return s

def scroll(kind):
    x,y,w,h=880,160,150,370
    s=f'<rect x="{x+10}" y="{y+16}" width="{w}" height="{h}" fill="#000" opacity=".4" filter="url(#b10)"/>'
    s+=f'<path d="M{x+w/2} 0V{y}" stroke="#1a110b" stroke-width="3"/><path d="M{x+w/2-70} {y+4}L{x+w/2} {y-60}L{x+w/2+70} {y+4}" stroke="#1a110b" stroke-width="3" fill="none"/>'
    s+=f'<rect x="{x-12}" y="{y-6}" width="{w+24}" height="14" rx="6" fill="#2d1d12"/><rect x="{x-12}" y="{y-6}" width="{w+24}" height="4" rx="2" fill="#8a6a45" opacity=".7"/>'
    s+=f'<rect x="{x}" y="{y+8}" width="{w}" height="{h}" fill="#4a4631"/>'
    s+=f'<rect x="{x+12}" y="{y+22}" width="{w-24}" height="{h-30}" fill="url(#paper)"/>'
    s+=f'<rect x="{x+12}" y="{y+22}" width="{w-24}" height="{h-30}" fill="none" stroke="#6b5a35" stroke-width="2" opacity=".6"/>'
    s+=f'<rect x="{x-12}" y="{y+h+2}" width="{w+24}" height="16" rx="7" fill="#2d1d12"/><circle cx="{x-14}" cy="{y+h+10}" r="9" fill="#3a2616"/><circle cx="{x+w+14}" cy="{y+h+10}" r="9" fill="#3a2616"/>'
    cx=x+w/2; cy=y+h/2+10
    if kind=='brackets':
        L='M34 0L6 55L34 110L26 110L-4 55L26 0Z'
        s+=f'<g fill="#2b2418" opacity=".92"><path transform="translate({cx-62},{cy-55})" d="{L}"/><path transform="translate({cx+62},{cy-55}) scale(-1,1)" d="{L}"/><path d="M{cx+10} {cy-48}L{cx-12} {cy+48}" stroke="#2b2418" stroke-width="5" stroke-linecap="round" fill="none" opacity="0"/></g>'
    else:
        s+=f'<g fill="#a63a20" opacity=".95" transform="translate({cx},{cy})"><path d="M-54 -50Q0 -36 54 -50L50 -36Q0 -23 -50 -36Z"/><rect x="-40" y="-20" width="80" height="9" rx="2"/><rect x="-32" y="-34" width="12" height="96" rx="2"/><rect x="20" y="-34" width="12" height="96" rx="2"/><rect x="-6" y="-34" width="12" height="14"/></g>'
    return s

def glyph(cx,cy,sz,color,sw):
    return (f'<g fill="none" stroke="{color}" stroke-width="{sw}" stroke-linecap="round" stroke-linejoin="round">'
            f'<path d="M{cx-sz*.35} {cy-sz*.55}L{cx-sz*.85} {cy}L{cx-sz*.35} {cy+sz*.55}"/>'
            f'<path d="M{cx+sz*.35} {cy-sz*.55}L{cx+sz*.85} {cy}L{cx+sz*.35} {cy+sz*.55}"/>'
            f'<path d="M{cx+sz*.12} {cy-sz*.5}L{cx-sz*.12} {cy+sz*.5}"/></g>')

def laptop():
    s='<ellipse cx="1480" cy="715" rx="270" ry="20" fill="#000" opacity=".45" filter="url(#b10)"/>'
    # base
    s+='<path d="M1262 672H1698L1738 708Q1738 716 1728 716H1232Q1222 716 1222 708Z" fill="url(#alu)"/>'
    s+='<path d="M1222 708H1738" stroke="#fff" stroke-opacity=".5" stroke-width="2"/>'
    s+='<path d="M1290 684H1670L1690 700H1270Z" fill="#a9a290" opacity=".7"/>'
    for r_ in range(3):
        y=686+r_*5; s+=f'<path d="M{1284-r_*4} {y}H{1676+r_*4}" stroke="#6f6a5c" stroke-width="2" stroke-dasharray="7 3" opacity=".6"/>'
    s+='<path d="M1430 703H1530" stroke="#8b8574" stroke-width="3" stroke-linecap="round"/>'
    # screen
    s+='<path d="M1318 505Q1318 497 1326 497H1634Q1642 497 1642 505L1654 676H1306Z" fill="#1c1b19"/>'
    s+='<path d="M1331 515H1629L1639 662H1321Z" fill="url(#scr)"/>'
    s+='<ellipse cx="1480" cy="590" rx="130" ry="70" fill="#f1b84a" opacity=".16" filter="url(#b20)"/>'
    s+=glyph(1480,588,64,'#f1c35c',10)
    s+='<path d="M1331 515H1629" stroke="#fff" stroke-opacity=".12" stroke-width="3"/>'
    return s

def cup():
    s='<ellipse cx="1170" cy="718" rx="62" ry="10" fill="#000" opacity=".4" filter="url(#b3)"/>'
    s+='<ellipse cx="1170" cy="708" rx="52" ry="9" fill="#e6dcc3"/><ellipse cx="1170" cy="706" rx="38" ry="6" fill="#c9bea2"/>'
    s+='<path d="M1130 646H1210C1210 680 1196 704 1170 704C1144 704 1130 680 1130 646Z" fill="url(#ceramic)"/>'
    s+='<path d="M1210 656C1236 654 1238 684 1204 686" stroke="#e3d9c0" stroke-width="7" fill="none" stroke-linecap="round"/>'
    s+='<ellipse cx="1170" cy="647" rx="40" ry="8" fill="#e9dfc6"/><ellipse cx="1170" cy="649" rx="35" ry="6" fill="#7b4f24"/>'
    s+='<ellipse cx="1166" cy="647" rx="20" ry="2.5" fill="#c58b45" opacity=".7"/>'
    steam=''
    for dx,ph in [(-12,0),(2,1.6),(14,3)]:
        steam+=f'<path d="M{1170+dx} 640C{1155+dx} 610 {1190+dx} 590 {1172+dx} 560S{1182+dx} 520 {1176+dx} 500" stroke="#fff6e0" stroke-width="7" stroke-linecap="round" fill="none" opacity=".5"/>'
    s+=f'<g filter="url(#b3)">{steam}</g>'
    return s

def books():
    s='<ellipse cx="1090" cy="705" rx="110" ry="10" fill="#000" opacity=".4" filter="url(#b3)"/>'
    spec=[(1000,672,160,32,'#5c3b26'),(1014,644,134,28,'#2f4b3a'),(1004,618,148,26,'#8b6a35'),(1022,592,120,26,'#3a3b4c')]
    for x,y,wd,h,c in spec:
        s+=f'<rect x="{x}" y="{y}" width="{wd}" height="{h}" rx="3" fill="{c}"/><rect x="{x}" y="{y}" width="{wd}" height="4" fill="#fff" opacity=".12"/>'
        s+=f'<rect x="{x+14}" y="{y}" width="3" height="{h}" fill="#e3c26a" opacity=".8"/><rect x="{x+wd-22}" y="{y}" width="3" height="{h}" fill="#e3c26a" opacity=".8"/>'
        s+=f'<rect x="{x+wd}" y="{y+3}" width="6" height="{h-6}" fill="#efe3c2"/>'
    return s

def penholder():
    s='<ellipse cx="1792" cy="710" rx="40" ry="8" fill="#000" opacity=".4" filter="url(#b3)"/>'
    for ang,c,l in [(-14,'#d9a62e',80),(-4,'#b5472a',95),(8,'#e8dcc0',85),(18,'#3d6b3a',70)]:
        s+=f'<rect x="1788" y="{640-l}" width="5" height="{l}" fill="{c}" transform="rotate({ang} 1792 650)"/>'
    s+='<path d="M1765 640H1819L1815 706Q1792 712 1769 706Z" fill="#2a1f17"/><rect x="1765" y="640" width="54" height="4" fill="#8a6a45" opacity=".6"/>'
    return s

def plant():
    r=random.Random(5); s='<g>'
    for i in range(13):
        ang=-78+i*13+r.uniform(-4,4); L=r.uniform(150,270); wd=r.uniform(24,38)
        a=math.radians(ang); x0,y0=800,750
        x1=x0+math.sin(a)*L; y1=y0-math.cos(a)*L
        mx=x0+math.sin(a*0.5)*L*.55; my=y0-math.cos(a*.5)*L*.55
        nx,ny=math.cos(a)*wd,math.sin(a)*wd
        col='#1f3a1d' if i%2 else '#2d5226'
        s+=f'<path d="M{x0} {y0}Q{mx-nx:.0f} {my-ny:.0f} {x1:.0f} {y1:.0f}Q{mx+nx:.0f} {my+ny:.0f} {x0} {y0}Z" fill="{col}"/>'
        s+=f'<path d="M{x0} {y0}Q{mx:.0f} {my:.0f} {x1:.0f} {y1:.0f}" stroke="#8fae52" stroke-width="2" fill="none" opacity=".5"/>'
    s+='<path d="M755 748H845L832 820H768Z" fill="#9a5a38"/><rect x="750" y="742" width="100" height="14" rx="3" fill="#b0683f"/><rect x="750" y="742" width="100" height="4" fill="#fff" opacity=".15"/>'
    return s+'</g>'

def chair():
    s='<g><rect x="1972" y="520" width="14" height="220" fill="#2a1a0f"/><rect x="2130" y="520" width="14" height="220" fill="#2a1a0f"/>'
    s+='<rect x="1966" y="512" width="184" height="22" rx="6" fill="#3a2514"/><rect x="1966" y="512" width="184" height="4" fill="#8a6a45" opacity=".6"/>'
    for y in (556,590,624): s+=f'<rect x="1986" y="{y}" width="144" height="12" fill="#2a1a0f"/>'
    s+='<rect x="1972" y="520" width="3" height="220" fill="#8a6a45" opacity=".5"/>'
    return s+'</g>'

def scene(kind):
    d=f'''<defs>
<filter id="b2"><feGaussianBlur stdDeviation="2"/></filter><filter id="b3"><feGaussianBlur stdDeviation="3"/></filter>
<filter id="b10" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="10"/></filter>
<filter id="b20" x="-30%" y="-80%" width="160%" height="260%"><feGaussianBlur stdDeviation="20"/></filter>
<filter id="b30" x="-50%" y="-80%" width="200%" height="260%"><feGaussianBlur stdDeviation="30"/></filter>
<filter id="grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="2" seed="3"/><feColorMatrix values="0 0 0 0 .5  0 0 0 0 .45  0 0 0 0 .35  0 0 0 .5 -.12"/></filter>
<filter id="wood" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".004 .09" numOctaves="3" seed="8"/><feColorMatrix values="0 0 0 0 .13  0 0 0 0 .07  0 0 0 0 .03  0 0 0 1.4 -.45"/></filter>
<clipPath id="vclip"><rect x="1190" y="150" width="710" height="445"/></clipPath>
<linearGradient id="wall" x1="0" x2="1"><stop offset="0" stop-color="#15241d"/><stop offset=".38" stop-color="#27382c"/><stop offset=".55" stop-color="#3b4029"/><stop offset="1" stop-color="#5a4328"/></linearGradient>
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fbe7a8"/><stop offset=".55" stop-color="#f6efcc"/><stop offset="1" stop-color="#e9efd6"/></linearGradient>
<linearGradient id="desk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7a4f2c"/><stop offset=".6" stop-color="#5e3b20"/><stop offset="1" stop-color="#4a2e18"/></linearGradient>
<linearGradient id="deskf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3b2413"/><stop offset="1" stop-color="#1a0f08"/></linearGradient>
<linearGradient id="alu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#dcd6c3"/><stop offset="1" stop-color="#a39d8a"/></linearGradient>
<linearGradient id="scr" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#202a24"/><stop offset="1" stop-color="#141a16"/></linearGradient>
<linearGradient id="ceramic" x1="0" x2="1"><stop offset="0" stop-color="#cdc2a5"/><stop offset=".4" stop-color="#f1e8d1"/><stop offset="1" stop-color="#bfb391"/></linearGradient>
<linearGradient id="paper" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e2d3a8"/><stop offset="1" stop-color="#c9b886"/></linearGradient>
<linearGradient id="fadeL" x1="0" x2="1"><stop offset="0" stop-color="#0c1712" stop-opacity=".7"/><stop offset=".5" stop-color="#0c1712" stop-opacity=".25"/><stop offset="1" stop-color="#0c1712" stop-opacity="0"/></linearGradient>
<linearGradient id="beam" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd98a" stop-opacity=".34"/><stop offset="1" stop-color="#ffd98a" stop-opacity=".05"/></linearGradient>
<radialGradient id="vig" cx=".55" cy=".5" r=".75"><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".28"/></radialGradient>
</defs>'''
    s=d
    s+='<rect width="2400" height="900" fill="url(#wall)"/>'
    for x in range(0,2400,150): s+=f'<rect x="{x}" y="0" width="2" height="900" fill="#000" opacity=".18"/>'
    s+='<rect width="2400" height="70" fill="#150e09"/><rect y="66" width="2400" height="4" fill="#6b4a2a" opacity=".5"/>'
    # wall light spill
    s+='<polygon points="1190,150 1900,150 2150,700 700,700" fill="#ffd98a" opacity=".1" filter="url(#b30)"/><polygon points="1230,150 1330,150 760,660 560,660" fill="#fff0c0" opacity=".12" filter="url(#b10)"/><polygon points="1400,150 1560,150 1060,660 820,660" fill="#fff0c0" opacity=".1" filter="url(#b10)"/><polygon points="1760,150 1880,150 1700,660 1520,660" fill="#fff0c0" opacity=".09" filter="url(#b10)"/>'
    s+=view()+lattice()
    s+=scroll(kind)
    s+=chair()
    # desk
    s+='<rect x="0" y="655" width="2400" height="62" fill="url(#desk)"/>'
    s+='<rect x="0" y="655" width="2400" height="62" filter="url(#wood)"/>'
    s+='<rect x="0" y="655" width="2400" height="3" fill="#c79a5c" opacity=".5"/>'
    s+='<rect x="0" y="717" width="2400" height="46" fill="url(#deskf)"/><rect x="0" y="717" width="2400" height="3" fill="#a77a44" opacity=".5"/>'
    s+='<rect x="0" y="763" width="2400" height="137" fill="#150c06"/>'
    # window light on desk
    s+='<polygon points="1240,655 1840,655 1560,718 640,718" fill="url(#beam)" filter="url(#b10)"/><polygon points="1000,656 1100,656 880,716 760,716" fill="#ffe3a0" opacity=".25" filter="url(#b10)"/>'
    s+=books()+cup()+laptop()+penholder()
    s+=plant()
    s+='<rect width="1500" height="900" fill="url(#fadeL)"/>'
    s+='<rect width="2400" height="900" fill="url(#vig)"/>'
    s+='<rect width="2400" height="900" filter="url(#grain)" opacity=".5"/>'
    return s

def write(kind, vb, wpx, hpx, name):
    open(W+name,'w').write(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" width="{wpx}" height="{hpx}">{scene(kind)}</svg>')
for kind in ('brackets','torii'):
    write(kind,'0 0 2400 900',2400,900,f'hero-{kind}.svg')
    write(kind,'840 0 1000 900',1000,900,f'hero-{kind}-m.svg')
