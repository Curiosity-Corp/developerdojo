import random, math
W='/var/tmp/agent-scratch/mrh/dd/work/'
def w(n,s): open(W+n,'w').write(s)

# ---------- mountains band
def ridge(seed, base, amp, n=60, W_=2400, peaks=None):
    r=random.Random(seed); pts=[]
    ph=[r.uniform(0,6.28) for _ in range(4)]
    fr=[r.uniform(.8,1.3),r.uniform(2.2,3.4),r.uniform(5,7),r.uniform(11,15)]
    am=[1,.5,.22,.08]
    for i in range(n+1):
        x=W_*i/n; t=i/n
        y=sum(am[k]*math.sin(t*math.pi*2*fr[k]*1.6+ph[k]) for k in range(4))
        # sharpen peaks
        y=math.copysign(abs(y)**0.8,y)
        pts.append((x, base-amp*(y*.5+.5)))
    d=f'M0 220L'+' L'.join(f'{x:.0f} {y:.0f}' for x,y in pts)+'L2400 220Z'
    return d
def band(dark):
    cols=(['#bfb292','#9a8b70','#6e6350'] if not dark else ['#c8c0a8','#a9a18a','#8a846f'])
    ops=([.45,.6,.75] if not dark else [.14,.2,.3])
    s='''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2400 220" width="2400" height="220" preserveAspectRatio="none" role="img" aria-label="Ink-wash mountains">
<defs>
<filter id="rough" x="-2%" y="-10%" width="104%" height="120%"><feTurbulence type="fractalNoise" baseFrequency=".02 .06" numOctaves="3" seed="2" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="9"/></filter>
<filter id="soft"><feGaussianBlur stdDeviation="2.4"/></filter>
<filter id="mist" x="-10%" y="-100%" width="120%" height="300%"><feGaussianBlur stdDeviation="14"/></filter>
<filter id="ink" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".5 .03" numOctaves="2" seed="6" result="f"/><feColorMatrix in="f" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.3 1.35" result="m"/><feComposite in="SourceGraphic" in2="m" operator="in"/></filter>
<linearGradient id="fadeTop" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".35" stop-color="#fff" stop-opacity=".9"/><stop offset="1" stop-color="#fff"/></linearGradient>
<mask id="mk"><rect width="2400" height="220" fill="url(#fadeTop)"/></mask>
</defs>'''
    specs=[(11,118,100,0),(23,150,92,1),(37,184,70,2)]
    mist=['#f4ead2' if not dark else '#9fa79a']
    for (seed,base,amp,i) in specs:
        s+=f'<g mask="url(#mk)"><path d="{ridge(seed,base,amp)}" fill="{cols[i]}" fill-opacity="{ops[i]}" filter="url(#rough)"/></g>' if i==0 else f'<path d="{ridge(seed,base,amp)}" fill="{cols[i]}" fill-opacity="{ops[i]}" filter="url(#rough)"/>'
        if i<2:
            for k in range(5):
                x=200+k*470+i*130; y=base+22-i*4
                s+=f'<ellipse cx="{x}" cy="{y}" rx="260" ry="16" fill="{mist[0]}" opacity="{.55 if not dark else .12}" filter="url(#mist)"/>'
    # bottom solid so it merges into footer
    s+=f'<rect y="214" width="2400" height="6" fill="{cols[2]}" fill-opacity="{ops[2]}"/>'
    return s+'</svg>'
w('mountains-band.svg',band(False)); w('mountains-band-dark.svg',band(True))

# ---------- pagoda on cliff (600x760)
def pagoda():
    s='''<svg xmlns="http://www.w3.org/2000/svg" viewBox="90 400 470 360" width="705" height="540" role="img" aria-label="Pagoda on a misty cliff">
<defs>
<filter id="rough" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".03" numOctaves="3" seed="5" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="12"/></filter>
<filter id="mist" x="-20%" y="-100%" width="140%" height="300%"><feGaussianBlur stdDeviation="14"/></filter>
<filter id="soft"><feGaussianBlur stdDeviation="1.2"/></filter>
<linearGradient id="rock" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#6e6350"/><stop offset=".6" stop-color="#9a8b70"/><stop offset="1" stop-color="#7d705a"/></linearGradient>
<linearGradient id="fade" x1="0" y1="0" x2="0" y2="1"><stop offset=".8" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
<mask id="mk"><rect width="600" height="760" fill="url(#fade)"/></mask>
</defs><g mask="url(#mk)">
<path d="M70 760L120 640C140 600 150 560 190 540L230 500C260 470 330 470 390 490L440 520C480 540 500 600 520 650L560 760Z" fill="#b9ab8e" opacity=".55" filter="url(#rough)"/>
<path d="M140 760L170 650L205 590C230 545 250 520 290 505H440C470 540 480 600 505 660L530 760Z" fill="url(#rock)" opacity=".92" filter="url(#rough)"/>
<path d="M205 590C225 600 240 650 235 700M300 520C310 560 330 600 325 640M400 530C415 570 440 620 435 680" stroke="#4a4030" stroke-width="3" fill="none" opacity=".35" filter="url(#soft)"/>'''
    # pagoda: tiers
    cx=340; base=505
    tiers=[(105,52,70),(88,46,62),(72,40,54),(56,34,46)]
    y=base; out=''
    for i,(rw,bw,bh) in enumerate(tiers):
        yb=y; ytop=y-bh*0.55   # body height compact
        bh_=34
        out+=f'<rect x="{cx-bw/2+4}" y="{yb-bh_}" width="{bw-8}" height="{bh_}" fill="#d9cfb4"/><rect x="{cx-bw/2+4}" y="{yb-bh_}" width="{bw-8}" height="{bh_}" fill="#7a6a4a" opacity=".12"/>'
        out+=f'<rect x="{cx-7}" y="{yb-bh_+8}" width="14" height="22" fill="#4a3a28" opacity=".8"/>'
        out+=f'<rect x="{cx-bw/2+4}" y="{yb-4}" width="{bw-8}" height="4" fill="#8a2f1c" opacity=".7"/>'
        ry=yb-bh_
        out+=f'<path d="M{cx-rw-14} {ry+2}Q{cx-rw*.55} {ry+2} {cx-rw*.4} {ry-6}L{cx} {ry-26}L{cx+rw*.4} {ry-6}Q{cx+rw*.55} {ry+2} {cx+rw+14} {ry+2}Q{cx+rw*.4} {ry+14} {cx} {ry+14}Q{cx-rw*.4} {ry+14} {cx-rw-14} {ry+2}Z" fill="#3b3a33"/>'
        out+=f'<path d="M{cx-rw*.4} {ry-6}L{cx} {ry-26}L{cx+rw*.4} {ry-6}" stroke="#7b7a68" stroke-width="2" fill="none" opacity=".7"/>'
        y=ry-26+16
    out+=f'<path d="M{cx} {y-6}V{y-44}" stroke="#3b3a33" stroke-width="4"/><circle cx="{cx}" cy="{y-24}" r="4" fill="#b8902a"/><circle cx="{cx}" cy="{y-34}" r="3" fill="#b8902a"/>'
    s+=out
    # small pines on cliff
    for (px,py,sc) in [(215,545,1),(480,590,.8),(445,520,.6)]:
        s+=f'<g transform="translate({px},{py}) scale({sc})"><path d="M0 0L-3 -40" stroke="#3b3326" stroke-width="5"/><ellipse cx="-4" cy="-48" rx="30" ry="10" fill="#4d5a35"/><ellipse cx="6" cy="-60" rx="22" ry="8" fill="#5c6a3e"/></g>'
    s+='<ellipse cx="300" cy="590" rx="260" ry="24" fill="#f4ead2" opacity=".8" filter="url(#mist)"/><ellipse cx="300" cy="700" rx="320" ry="34" fill="#f4ead2" opacity=".85" filter="url(#mist)"/><ellipse cx="320" cy="500" rx="200" ry="14" fill="#f4ead2" opacity=".5" filter="url(#mist)"/>'
    return s+'</g></svg>'
w('pagoda-cliff.svg',pagoda())

# ---------- bamboo (520x900)
def bamboo():
    r=random.Random(3)
    s='''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 900" width="520" height="900" role="img" aria-label="Bamboo cluster">
<defs><linearGradient id="st" x1="0" x2="1"><stop offset="0" stop-color="#2f4a22"/><stop offset=".35" stop-color="#6f8f3c"/><stop offset="1" stop-color="#2a4120"/></linearGradient>
<filter id="soft"><feGaussianBlur stdDeviation=".8"/></filter></defs>'''
    stalks=[(90,22,.3),(170,26,-.15),(260,30,.2),(350,24,-.3),(430,20,.15),(215,18,-.45)]
    leaves=''
    for i,(x0,wd,lean) in enumerate(stalks):
        top=r.uniform(20,130)+ (60 if i==5 else 0)
        # stalk as polygon following lean curve
        def X(y): return x0 + lean*(900-y)*0.12 + math.sin((900-y)/160+i)*6
        pts_l=[(X(y)-wd/2,y) for y in range(900,int(top)-1,-20)]
        pts_r=[(X(y)+wd/2,y) for y in range(int(top),901,20)]
        d='M'+' L'.join(f'{x:.1f} {y}' for x,y in pts_l)+' L'+' L'.join(f'{x:.1f} {y}' for x,y in pts_r)+'Z'
        s+=f'<path d="{d}" fill="url(#st)"/>'
        ny=880
        while ny>top+20:
            x=X(ny)
            s+=f'<rect x="{x-wd/2-2:.1f}" y="{ny}" width="{wd+4}" height="5" rx="2" fill="#223618"/><rect x="{x-wd/2:.1f}" y="{ny+5}" width="{wd}" height="2" fill="#b7cf7a" opacity=".5"/>'
            if ny<700 and r.random()<.7:
                side=r.choice((-1,1))
                for k in range(3):
                    a=math.radians(side*(35+k*22)+r.uniform(-8,8)); L=r.uniform(70,120)
                    ex=x+math.sin(a)*L; ey=ny-math.cos(a)*L*0.2+k*14
                    mx=(x+ex)/2; my=ny-30-k*6
                    leaves+=f'<path d="M{x:.0f} {ny}Q{mx:.0f} {my-10:.0f} {ex:.0f} {ey+22:.0f}Q{mx:.0f} {my+6:.0f} {x:.0f} {ny}Z" fill="{["#4f7a2c","#3a5f24","#7fa047"][k]}"/>'
            ny-=r.randint(70,100)
    s+=leaves+'</svg>'
    return s
w('bamboo.svg',bamboo())

# ---------- paper tiles
def paper(name,base,fiber,op):
    w(name,f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
<defs><filter id="p" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="3" seed="12" stitchTiles="stitch" result="a"/><feColorMatrix in="a" type="matrix" values="0 0 0 0 {fiber[0]}  0 0 0 0 {fiber[1]}  0 0 0 0 {fiber[2]}  0 0 0 {op} 0"/></filter>
<filter id="q" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".012 .02" numOctaves="3" seed="21" stitchTiles="stitch" result="a"/><feColorMatrix in="a" type="matrix" values="0 0 0 0 {fiber[0]}  0 0 0 0 {fiber[1]}  0 0 0 0 {fiber[2]}  0 0 0 {op*1.6} 0"/></filter>
<filter id="f" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".02 .5" numOctaves="2" seed="30" stitchTiles="stitch" result="a"/><feColorMatrix in="a" type="matrix" values="0 0 0 0 {fiber[0]}  0 0 0 0 {fiber[1]}  0 0 0 0 {fiber[2]}  0 0 0 {op*1.1} -{op*.35}"/></filter></defs>
<rect width="512" height="512" fill="{base}"/><rect width="512" height="512" filter="url(#q)"/><rect width="512" height="512" filter="url(#p)"/><rect width="512" height="512" filter="url(#f)"/></svg>''')
paper('paper-tile.svg','#f4ead2',(.55,.42,.22),.22)
paper('paper-tile-dark.svg','#15231c',(.8,.75,.55),.07)
