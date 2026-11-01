<!-- Seite für Langarmshirt -->
<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { auth, db } from '@/firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import {jsPDF} from 'jspdf'
import 'svg2pdf.js'
import logoGross from '@/assets/MMLogoMiauMass.svg'
import logoKleinRaw from '@/assets/MLogoMiauMass.svg?raw'

// Inhalt vom kleinen Logo ohne äusseres <svg>-Tag, damit es direkt in die Schnittteile eingefügt werden kann
const logoKleinInhalt = logoKleinRaw.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '')

const getVal = (id) => {
  const item = measurements.value.find(m => m.id === id)
  if (item) {
    // Leeres Feld -> mit Standardwert (Grösse M) rechnen
    if (item.value === null || item.value === '') {
      return item.default
    }
    return Number(item.value) || 0
  }
  const constructionItem = measurementsConstruction.value.find(m => m.id === id)
  if (constructionItem) {
    return Number(constructionItem.value) || 0
  }
  const calcItem = measurementsCalc.value.find(m => m.id === id)
  return calcItem ? Number(calcItem.value) || 0 : 0
}

// gemessene Masse aus Datenbank oder sonst Standartwert
const measurements = ref([
  { id: 'MoL', label: 'Modelllänge', value: null, default: 50, unit: 'cm' },
  { id: 'KoeH', label: 'Körperhöhe', value: null, default: 168, unit: 'cm' },
  { id: 'BrU',  label: 'Brustumfang', value: null, default: 88, unit: 'cm' },
  { id: 'TaU',  label: 'Taillenumfang', value: null, default: 72, unit: 'cm' },
  { id: 'HueU', label: 'Hüftumfang', value: null, default: 97, unit: 'cm' },
  { id: 'AlT',  label: 'Armlochtiefe', value: null, default: 20.1, unit: 'cm' },
  { id: 'HueT', label: 'Hüfttiefe', value: null, default: 21, unit: 'cm' },
  { id: 'gBrT',  label: 'Brusttiefe', value: null, default: 28.1, unit: 'cm' },
  { id: 'gArD',  label: 'Armdurchmesser', value: null, default: 9.3, unit: 'cm' },
  { id: 'BrPA', label: 'Brustpunktabstand', value: null, default: 8.8, unit: 'cm' },
  { id: 'SuB',  label: 'Schulterbreite', value: null, default: 12.2, unit: 'cm' },
  { id: 'SuWi', label: 'Schulterwinkel', value: null, default: 20, unit: '°' },
  { id: 'gRueL', label: 'Rückenlänge', value: null, default: 41.6, unit: 'cm' },
  { id: 'gVL',   label: 'Vorderlänge', value: null, default: 45.3, unit: 'cm' },
  { id: 'ArL',  label: 'Armlänge', value: null, default: 60, unit: 'cm' },
  { id: 'OaU',  label: 'Oberarmumfang', value: null, default: 28, unit: 'cm' },
  { id: 'HagU',  label: 'Handgelenkumfang', value: null, default: 15.8, unit: 'cm' },
  { id: 'HlB',  label: 'Halslochbreite', value: null, default: 6.5, unit: 'cm' }
])

// korrigierte Masse nach Messung
const measurementsConstruction = computed(() => [
  {id: 'RueL', value: getVal('gRueL')},
  {id: 'BrT', value: getVal('gBrT')-getVal('HlB')},
  {id: 'VL', value: getVal('gVL')-getVal('HlB')},
  {id: 'ArD', value: getVal('gArD')},
  {id: 'BrPa', value: getVal('BrPA')},
  {id: 'HgU', value: getVal('HagU')}
])

//Hilfsmasse
const measurementsCalc = computed(() => [
  {id: 'AlT+', value: getVal('AlT')+0.5},
  {id: 'BrW', value: getVal('BrU')+8},
  {id: 'SuNL', value: getVal('SuB')+1.5},
  {id: 'SuWi+', value: (getVal('SuWi')*Math.PI)/180},
  {id: 'AESaW', value: getVal('HgU')+6},
  {id: 'ArD+', value: getVal('ArD')+1.5},
  {id: 'OaW', value: getVal('OaU')}
])

const statusMessage = ref('')

//Ärmelpunkt (Äp)
const aepPunkt = () => {
  const p7x = getVal('BrW')/4 - getVal('ArD+')/2
  const p7y = getVal('AlT+')
  return { x: p7x, y: p7y - (p7y - getVal('HlB')/3)/4 }
}

//untere Armlochkurve: P6 → ÄP (nur Rumpf)
const armlochUnten = () => {
  const p6x = getVal('BrW')/4
  const p7y = getVal('AlT+')
  const aep = aepPunkt()
  const k = 0.55
  return `C ${p6x - k*(p6x-aep.x)} ${p7y}, ${aep.x} ${aep.y + k*(p7y-aep.y)}, ${aep.x} ${aep.y}`
}

//obere Armlochkurve: ÄP → Schulterpunkt (Rumpf und Ärmel)
const armlochOben = (Sx, Sy) => {
  const w = getVal('SuWi+')
  const aep = aepPunkt()
  const t = (aep.y - Sy)/3
  return `C ${aep.x} ${aep.y - t}, ${Sx - t*Math.sin(w)} ${Sy + t*Math.cos(w)}, ${Sx} ${Sy}`
}

//Punkt auf einer kubischen Kurve bei t (0 bis 1)
const bezierPunkt = (p0, p1, p2, p3, t) => {
  const u = 1 - t
  return {
    x: u*u*u*p0.x + 3*u*u*t*p1.x + 3*u*t*t*p2.x + t*t*t*p3.x,
    y: u*u*u*p0.y + 3*u*u*t*p1.y + 3*u*t*t*p2.y + t*t*t*p3.y
  }
}

//Länge einer Kurve: in 100 kleine gerade Stücke teilen und zusammenzählen
const bezierLaenge = (p0, p1, p2, p3) => {
  let laenge = 0
  let vorher = p0
  for (let i = 1; i <= 100; i++) {
    const p = bezierPunkt(p0, p1, p2, p3, i/100)
    laenge += Math.sqrt((p.x-vorher.x)**2 + (p.y-vorher.y)**2)
    vorher = p
  }
  return laenge
}

// SVG's für die einzelnen Schnittteile
const vorderTeil = computed(() => {

  const p3x = 0
  const p3y = getVal('MoL')

  const p5y = getVal('RueL')

  const p6x = getVal('BrW')/4
  const p6y = getVal('AlT+')

  const p7x = p6x - getVal('ArD+')/2
  const p7y = getVal('AlT+')
  
  const p9x = getVal('HlB')+0.5
  const p9y = 0

  const p10vx = p9x - 1.5*Math.sin(getVal('SuWi+'))
  const p10vy = p9y + 1.5*Math.cos(getVal('SuWi+'))
  
  const p8vx = p10vx + getVal('SuNL')*Math.cos(getVal('SuWi+'))
  const p8vy = p10vy + getVal('SuNL')*Math.sin(getVal('SuWi+'))
  
  const p11x = 0
  const p11y = getVal('HlB') + 2.5

  const p12x = p6x - 1
  const p12y = p3y

  return `M ${p11x} ${p11y} L ${p3x} ${p3y} L ${p12x} ${p12y} C ${p12x} ${p12y}, ${p12x} ${p5y}, ${p6x} ${p6y} ${armlochUnten()} ${armlochOben(p8vx, p8vy)} L ${p10vx} ${p10vy} C ${p10vx} ${p10vy}, ${p10vx} ${p11y}, ${p11x} ${p11y}`
})

const hinterTeil = computed(() => {

  const p2x = 0
  const p2y = getVal('HlB')/3

  const p3x = 0
  const p3y = getVal('MoL')

  const p5x = 0
  const p5y = getVal('RueL')

  const p6x = getVal('BrW')/4
  const p6y = getVal('AlT+')

  const p7x = p6x - getVal('ArD+')/2
  const p7y = getVal('AlT+')
  
  const p9x = getVal('HlB')+0.5
  const p9y = 0

  const p10hx = p9x + 1.5*Math.sin(getVal('SuWi+'))
  const p10hy = p9y - 1.5*Math.cos(getVal('SuWi+'))

  const p8x = p9x + getVal('SuNL')*Math.cos(getVal('SuWi+'))
  const p8y = p9y + getVal('SuNL')*Math.sin(getVal('SuWi+'))
  
  const p8hx = p10hx + getVal('SuNL')*Math.cos(getVal('SuWi+'))
  const p8hy = p10hy + getVal('SuNL')*Math.sin(getVal('SuWi+'))

  const p12x = p6x - 1
  const p12y = p3y

  //return `M ${p2x} ${p2y} L ${p3x} ${p3y} L ${p12x} ${p12y} C ${p12x} ${p12y}, ${p12x} ${p5y}, ${p6x} ${p6y} C ${p6x} ${p6y}, ${p7x} ${p7y}, ${p8hx} ${p8hy} L ${p10hx} ${p10hy} C ${p10hx} ${p10hy}, ${p10hx} ${p2y}, ${p2x} ${p2y}`
  return `M ${p2x} ${p2y} L ${p3x} ${p3y} L ${p12x} ${p12y} C ${p12x} ${p12y}, ${p12x} ${p5y}, ${p6x} ${p6y} ${armlochUnten()} ${armlochOben(p8x, p8y)} L ${p8hx} ${p8hy} L ${p10hx} ${p10hy} C ${p10hx} ${p10hy}, ${p10hx} ${p2y}, ${p2x} ${p2y}`

})

const aermel = computed(() => {
  const p2x = 0
  const p2y = getVal('HlB')/3

  const p3x = 0
  const p3y = getVal('MoL')

  const p6x = getVal('BrW')/4
  const p6y = getVal('AlT+')

  const p7x = p6x - getVal('ArD+')/2
  const p7y = getVal('AlT+')

  const p9x = getVal('HlB')+0.5
  const p9y = 0

  const p8x = p9x + getVal('SuNL')*Math.cos(getVal('SuWi+'))
  const p8y = p9y + getVal('SuNL')*Math.sin(getVal('SuWi+'))

  const aep = aepPunkt()

  //P13: Schulterlinie um die Armlänge verlängern
  const p13x = p8x + Math.cos(getVal('SuWi+'))*getVal('ArL')
  const p13y = p8y + Math.sin(getVal('SuWi+'))*getVal('ArL')

  //P14: Ärmelmitte 2 cm tiefer stellen (rechtwinklig zur Schulterlinie)
  const p14x = p13x - 2*Math.sin(getVal('SuWi+'))
  const p14y = p13y + 2*Math.cos(getVal('SuWi+'))

  //Winkel der neuen Ärmelmitte P8 → P14
  const aeWi = Math.atan2(p14y-p8y, p14x-p8x)

  //P15: ½ Ärmelsaumweite rechtwinklig zur Ärmelmitte abtragen
  const p15x = p14x - getVal('AESaW')/2*Math.sin(aeWi)
  const p15y = p14y + getVal('AESaW')/2*Math.cos(aeWi)

  //Kreisbogen um ÄP durch P6, darauf ab P6 ½ ArD+ - 1 cm abtragen → P16
  const x = Math.sqrt((p6x-aep.x)**2 + (p6y-aep.y)**2)

  const alpha = 2*Math.asin(Math.min(1, (0.5*getVal('ArD+')-1)/(2*x)))
  const beta = Math.atan2(p6y-aep.y, p6x-aep.x)
  const gamma = beta + alpha   //Richtung Körpermitte drehen

  const p16x = aep.x + Math.cos(gamma) * x
  const p16y = aep.y + Math.sin(gamma) * x

  //Länge der unteren Rumpfkurve (ÄP bis P6), gleiche Kontrollpunkte wie armlochUnten
  const k = 0.55
  const laengeRumpf = bezierLaenge(
    {x: p6x, y: p6y}, {x: p6x - k*(p6x-aep.x), y: p6y},
    {x: aep.x, y: aep.y + k*(p6y-aep.y)}, aep)

  //Senkrechte zur Ärmelmitte, Richtung Unterarm
  const nx = -Math.sin(aeWi)
  const ny = Math.cos(aeWi)

  //Richtung ÄP → P17: zwischen senkrecht und der Senkrechten zur Ärmelmitte
  const rl = Math.sqrt((nx/2)**2 + ((1+ny)/2)**2)
  const rx = (nx/2)/rl
  const ry = ((1+ny)/2)/rl

  //Ärmelkurve ÄP → P17 (hohler Teil der S-Form): senkrecht weg vom ÄP,
  //kommt bei P17 rechtwinklig zur Ärmelmitte an
  //P17 so weit setzen, bis die Ärmelkurve gleich lang ist wie die Rumpfkurve
  let d = laengeRumpf
  let p17x, p17y, kp1y, kp2x, kp2y
  for (let i = 0; i < 10; i++) {
    p17x = aep.x + d*rx
    p17y = aep.y + d*ry
    kp1y = aep.y + d/3
    kp2x = p17x - d/3*nx
    kp2y = p17y - d/3*ny
    d = d * laengeRumpf / bezierLaenge(aep, {x: aep.x, y: kp1y}, {x: kp2x, y: kp2y}, {x: p17x, y: p17y})
  }

  //P19: bei ¼ der Ärmelmitte ½ Oberarmweite abwinkeln (Kontrollpunkt für die Ärmelnaht)
  const aeMitteL = Math.sqrt((p14x-p8x)**2 + (p14y-p8y)**2)
  const p19x = p8x + aeMitteL/4*Math.cos(aeWi) + getVal('OaW')/2*nx
  const p19y = p8y + aeMitteL/4*Math.sin(aeWi) + getVal('OaW')/2*ny

  return `M ${aep.x} ${aep.y} ${armlochOben(p8x, p8y)} L ${p14x} ${p14y} L ${p15x} ${p15y} Q ${p19x} ${p19y}, ${p17x} ${p17y} C ${kp2x} ${kp2y}, ${aep.x} ${kp1y}, ${aep.x} ${aep.y} Z`

})

//console.log(alpha, beta)

const loadSizesFromFirebase = async (uid) => {
  try {
    statusMessage.value = 'Lade Daten...'
    const docRef = doc(db, 'userMeasurements', uid)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const data = docSnap.data()
      measurements.value.forEach(item => {
        if (data[item.id] !== undefined) {
          item.value = data[item.id]
        }
      })
      statusMessage.value = 'Daten erfolgreich geladen'
    } else {
      statusMessage.value = 'Keine Daten in Firebase vorhanden'
    }
  } catch (e) {
    console.error(e)
    statusMessage.value = 'Fehler beim Laden'
  }
}

const saveToFirebase = async () => {
  if (!currentUser.value) {
    statusMessage.value = 'Bitte melde dich an, um deine Masse zu speichern.'
    return
  }

  try {
    statusMessage.value = 'Speichere...'
    const docRef = doc(db, 'userMeasurements', currentUser.value.uid)

    const dataToSave = {}
    measurements.value.forEach(item => {
      // Leere Felder nicht speichern, sonst würden Masse aus Messen 1-3 gelöscht
      if (item.value !== null && item.value !== '') {
        dataToSave[item.id] = item.value
      }
    })

    // merge: andere Masse aus Messen 1-3 bleiben erhalten
    await setDoc(docRef, dataToSave, { merge: true })
    statusMessage.value = 'Gespeichert!'
  } catch (e) {
    console.error(e)
    statusMessage.value = 'Fehler beim Speichern'
  }
}

const currentUser = ref(null)
let stopAuthListener = null

onMounted(() => {
  // Erst laden, wenn Firebase weiss, wer eingeloggt ist
  stopAuthListener = onAuthStateChanged(auth, (user) => {
    currentUser.value = user
    if (user) {
      loadSizesFromFirebase(user.uid)
    } else {
      statusMessage.value = 'Du bist nicht angemeldet. Es werden Standardmasse verwendet.'
    }
  })
})

onUnmounted(() => {
  if (stopAuthListener) stopAuthListener()
})

const firstName = computed(() => {
  if (!currentUser.value || !currentUser.value.displayName) return 'Miau'
  return currentUser.value.displayName.split(' ')[0]
})

const svgDimensions = computed(() => {
  const p6x = getVal('BrW') / 4 || 10
  const p8x = (getVal('HlB') + 0.5) + getVal('SuNL') * Math.cos((getVal('SuWi') * Math.PI) / 180)
  const p14x = p8x + Math.cos((getVal('SuWi') * Math.PI) / 180) * getVal('ArL')
  const p3y = getVal('MoL') || 50
  const p10hy = 0 - 1.5 * Math.cos((getVal('SuWi') * Math.PI) / 180)

  const puffer = 20

  const xVorder = puffer
  const xHinter = xVorder + p6x + puffer
  const xAermel = xHinter + p6x + puffer

  const yPos = puffer *4
  
  const width = puffer + p6x + p6x + Math.abs(p14x - p8x)
  const height = Math.abs(p3y - p10hy) + puffer

  return {
    width: Math.max(Math.round(width), 200),
    height: Math.max(Math.round(height), 200),
    xVorder: Math.round(xVorder),
    xHinter: Math.round(xHinter),
    xAermel: Math.round(xAermel),
    yPos: Math.round(yPos)
  }
})

//Ärmelmitte P8 → P14 (Bruchkante vom Ärmel), gleiche Formeln wie beim Ärmel
const aermelMitte = computed(() => {
  const w = getVal('SuWi+')
  const p8x = getVal('HlB')+0.5 + getVal('SuNL')*Math.cos(w)
  const p8y = getVal('SuNL')*Math.sin(w)
  const p13x = p8x + Math.cos(w)*getVal('ArL')
  const p13y = p8y + Math.sin(w)*getVal('ArL')
  const p14x = p13x - 2*Math.sin(w)
  const p14y = p13y + 2*Math.cos(w)
  return { p8: {x: p8x, y: p8y}, p14: {x: p14x, y: p14y}, winkel: Math.atan2(p14y-p8y, p14x-p8x) }
})

//Drehung vom Ärmel in Grad, damit die Ärmelmitte senkrecht steht
const aermelDrehung = computed(() => 90 - aermelMitte.value.winkel*180/Math.PI)

//Punkt um (0,0) drehen (Winkel in Grad, gleich wie rotate() im SVG)
const drehe = (p, grad) => {
  const w = grad*Math.PI/180
  return { x: p.x*Math.cos(w) - p.y*Math.sin(w), y: p.x*Math.sin(w) + p.y*Math.cos(w) }
}

//alle Punkte aus einem Pfad (M, L, C, Q und Z haben nur x/y-Paare)
const pfadPunkte = (d) => {
  const zahlen = d.match(/-?(\d*\.)?\d+(e[-+]?\d+)?|NaN|-?Infinity/gi) || []
  const punkte = []
  for (let i = 0; i + 1 < zahlen.length; i += 2) {
    const x = Number(zahlen[i])
    const y = Number(zahlen[i+1])
    if (Number.isFinite(x) && Number.isFinite(y)) punkte.push({x, y})
  }
  return punkte
}

//Rechteck um alle Punkte (mit Kontrollpunkten, darum eher etwas zu gross)
const rahmenVon = (punkte) => {
  if (punkte.length === 0) return { minX: 0, minY: 0, maxX: 0, maxY: 0 }
  return {
    minX: Math.min(...punkte.map(p => p.x)),
    minY: Math.min(...punkte.map(p => p.y)),
    maxX: Math.max(...punkte.map(p => p.x)),
    maxY: Math.max(...punkte.map(p => p.y))
  }
}

//Anordnung der Teile im PDF (in cm), oben links beginnend
const exportLayout = computed(() => {
  const abstand = 2       //zwischen den Teilen
  const rand = 1          //zum Rand vom Bogen
  const unterQuadrat = 13 //Vorder- und Rückenteil beginnen unter dem Kontrollquadrat auf A1

  const rV = rahmenVon(pfadPunkte(vorderTeil.value))
  const rH = rahmenVon(pfadPunkte(hinterTeil.value))
  const rA = rahmenVon(pfadPunkte(aermel.value).map(p => drehe(p, aermelDrehung.value)))

  const vorder = { x: rand - rV.minX, y: unterQuadrat - rV.minY, rahmen: rV }
  const hinter = { x: vorder.x + rV.maxX + abstand - rH.minX, y: unterQuadrat - rH.minY, rahmen: rH }
  const aermelTeil = { x: hinter.x + rH.maxX + abstand - rA.minX, y: rand - rA.minY, rahmen: rA }

  //Rahmen der Teile auf dem ganzen Bogen in mm
  const rahmenMm = [vorder, hinter, aermelTeil].map(t => ({
    minX: (t.x + t.rahmen.minX)*10,
    minY: (t.y + t.rahmen.minY)*10,
    maxX: (t.x + t.rahmen.maxX)*10,
    maxY: (t.y + t.rahmen.maxY)*10
  }))

  return {
    vorder,
    hinter,
    aermel: aermelTeil,
    rahmenMm,
    totalW: Math.ceil(Math.max(...rahmenMm.map(r => r.maxX)) + rand*10),
    totalH: Math.ceil(Math.max(...rahmenMm.map(r => r.maxY)) + rand*10)
  }
})

//Fadenlauf: senkrechter Doppelpfeil
const fadenlaufPfad = (x, y1, y2) =>
  `M ${x} ${y1} L ${x} ${y2} M ${x-0.4} ${y1+0.8} L ${x} ${y1} L ${x+0.4} ${y1+0.8} M ${x-0.4} ${y2-0.8} L ${x} ${y2} L ${x+0.4} ${y2-0.8}`

//Bruchkante: Linie neben der Kante mit zwei Pfeilen zur Kante
//richtung: 1 = Teil liegt rechts von der Kante, -1 = Teil liegt links
const bruchPfad = (x, y1, y2, richtung) => {
  const a = x + 2*richtung
  const s = 0.6*richtung
  return `M ${x} ${y1} L ${a} ${y1} L ${a} ${y2} L ${x} ${y2} M ${x+s} ${y1-0.3} L ${x} ${y1} L ${x+s} ${y1+0.3} M ${x+s} ${y2-0.3} L ${x} ${y2} L ${x+s} ${y2+0.3}`
}

//Position von Logo, Beschriftung, Fadenlauf und Bruchkante auf den Teilen (in cm, im Teil)
const exportDeko = computed(() => {
  const teilDeko = (rahmen, textX, bruchX, bruchOben, bruchUnten, richtung) => {
    const hoehe = rahmen.maxY - rahmen.minY
    const textY = rahmen.minY + hoehe*0.22
    const bruchL = bruchUnten - bruchOben
    return {
      logo: `translate(${textX - 1}, ${textY - 3.6}) scale(${2/33})`,
      textX,
      textY,
      fadenlauf: fadenlaufPfad(textX, rahmen.minY + hoehe*0.45, rahmen.minY + hoehe*0.85),
      bruch: bruchPfad(bruchX, bruchOben + bruchL*0.15, bruchUnten - bruchL*0.15, richtung),
      bruchTextX: bruchX + 2.9*richtung,
      bruchTextY: (bruchOben + bruchUnten)/2
    }
  }

  const rV = exportLayout.value.vorder.rahmen
  const rH = exportLayout.value.hinter.rahmen
  const rA = exportLayout.value.aermel.rahmen
  const oben = drehe(aermelMitte.value.p8, aermelDrehung.value)
  const unten = drehe(aermelMitte.value.p14, aermelDrehung.value)
  //Ärmel: Beschriftung in der Mitte der Saumweite, dort ist der Ärmel am schmalsten
  const aermelTextX = oben.x - getVal('AESaW')/4

  return {
    vorder: teilDeko(rV, (rV.minX + rV.maxX)/2, 0, getVal('HlB') + 2.5, getVal('MoL'), 1),
    hinter: teilDeko(rH, (rH.minX + rH.maxX)/2, 0, getVal('HlB')/3, getVal('MoL'), 1),
    aermel: teilDeko(rA, aermelTextX, oben.x, oben.y, unten.y, -1)
  }
})

//SVG-Datei als PNG laden (das grosse Logo enthält ein Bild, so wird es zuverlässig ins PDF übernommen)
const svgAlsPng = (url, breitePx) => new Promise((resolve, reject) => {
  const img = new Image()
  img.onload = () => {
    const canvas = document.createElement('canvas')
    canvas.width = breitePx
    canvas.height = Math.round(breitePx * img.height / img.width)
    canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
    resolve({ daten: canvas.toDataURL('image/png'), verhaeltnis: canvas.height / canvas.width })
  }
  img.onerror = reject
  img.src = url
})

const downloadA4PDF = async () => {
  const svgElement = document.querySelector('.pattern-svg-export')
  if (!svgElement) return

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  })

  const rand = 10       //Rand auf dem Blatt
  const a4Width = 190   //Ausschnitt pro Seite
  const a4Height = 277
  const layout = exportLayout.value
  const ganzerBogen = `0 0 ${layout.totalW} ${layout.totalH}`

  const spalten = Math.ceil(layout.totalW / a4Width)
  const reihen = Math.ceil(layout.totalH / a4Height)
  const seitenName = (spalte, reihe) => String.fromCharCode(65 + spalte) + (reihe + 1)

  //Seite nur drucken, wenn der Rahmen von einem Teil darauf liegt (A1 immer wegen Kontrollquadrat)
  //Die Rahmen sind Rechtecke, darum liegt jedes Teil auf lückenlos zusammenhängenden Seiten
  const seiteNoetig = (spalte, reihe) => {
    if (spalte === 0 && reihe === 0) return true
    const x0 = spalte*a4Width
    const y0 = reihe*a4Height
    return layout.rahmenMm.some(r => r.minX < x0 + a4Width && r.maxX > x0 && r.minY < y0 + a4Height && r.maxY > y0)
  }

  // ---------- Titelseite ----------
  try {
    const logo = await svgAlsPng(logoGross, 600)
    const logoBreite = 50
    pdf.addImage(logo.daten, 'PNG', (210 - logoBreite)/2, 15, logoBreite, logoBreite*logo.verhaeltnis)
  } catch (e) {
    console.error('Logo konnte nicht geladen werden', e)
  }

  pdf.setTextColor(0)
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(24)
  pdf.text(`Langarmshirt für ${firstName.value}`, 105, 58, { align: 'center' })
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(14)
  pdf.text('by MiauMass', 105, 66, { align: 'center' })

  pdf.setFontSize(10)
  const hinweise = [
    '- In tatsächlicher Grösse (100 %) drucken, nicht "An Seite anpassen". Mit dem Kontrollquadrat auf Seite A1 prüfen.',
    '- Die Kreuze markieren die Ecken jeder Seite. Seiten nach dem Klebeplan so aneinanderlegen, dass die Kreuze genau aufeinanderpassen, und zusammenkleben.',
    '- Die Schnittteile enthalten noch keine Nahtzugabe.'
  ]
  let textY = 78
  hinweise.forEach(h => {
    const zeilen = pdf.splitTextToSize(h, 170)
    pdf.text(zeilen, 20, textY)
    textY += zeilen.length * 5
  })

  //Klebeplan: verkleinerter Bogen mit Seitenraster
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(12)
  pdf.text('Klebeplan', 20, textY + 5)
  const planY = textY + 9
  const massstab = Math.min(170 / (spalten*a4Width), 120 / (reihen*a4Height))
  const planX = (210 - spalten*a4Width*massstab) / 2

  svgElement.setAttribute('viewBox', ganzerBogen)
  await pdf.svg(svgElement, {
    x: planX,
    y: planY,
    width: layout.totalW*massstab,
    height: layout.totalH*massstab
  })

  pdf.setDrawColor(0)
  pdf.setLineWidth(0.2)
  pdf.setTextColor(0)
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(8)
  for (let reihe = 0; reihe < reihen; reihe++) {
    for (let spalte = 0; spalte < spalten; spalte++) {
      const x = planX + spalte*a4Width*massstab
      const y = planY + reihe*a4Height*massstab
      if (seiteNoetig(spalte, reihe)) {
        pdf.setLineDashPattern([], 0)
        pdf.rect(x, y, a4Width*massstab, a4Height*massstab)
        pdf.text(seitenName(spalte, reihe), x + 1, y + 3.5)
      } else {
        //weggelassene Seite gestrichelt
        pdf.setLineDashPattern([1, 1], 0)
        pdf.rect(x, y, a4Width*massstab, a4Height*massstab)
      }
    }
  }
  pdf.setLineDashPattern([], 0)

  //Zuschnitt
  let zuschnittY = planY + reihen*a4Height*massstab + 10
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(12)
  pdf.text('Zuschnitt', 20, zuschnittY)
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(10)
  ;['Vorderteil - 1x im Stoffbruch', 'Rückenteil - 1x im Stoffbruch', 'Ärmel - 2x im Stoffbruch'].forEach(zeile => {
    zuschnittY += 5.5
    pdf.text(zeile, 20, zuschnittY)
  })

  // ---------- Schnittseiten ----------
  for (let reihe = 0; reihe < reihen; reihe++) {
    for (let spalte = 0; spalte < spalten; spalte++) {
      if (!seiteNoetig(spalte, reihe)) continue
      pdf.addPage('a4', 'portrait')

      svgElement.setAttribute('viewBox', `${spalte*a4Width} ${reihe*a4Height} ${a4Width} ${a4Height}`)

      await pdf.svg(svgElement, {
        x: rand,
        y: rand,
        width: a4Width,
        height: a4Height
      })

      //Klebemarken: Mitte vom Kreuz genau auf den Ecken vom Ausschnitt
      pdf.setDrawColor(0)
      pdf.setLineWidth(0.2)
      const ecken = [[rand, rand], [rand + a4Width, rand], [rand, rand + a4Height], [rand + a4Width, rand + a4Height]]
      ecken.forEach(([x, y]) => {
        pdf.line(x - 5, y, x + 5, y)
        pdf.line(x, y - 5, x, y + 5)
      })

      //Seitenname klein unten rechts im Rand
      pdf.setTextColor(0)
      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(9)
      pdf.text(seitenName(spalte, reihe), rand + a4Width - 8, rand + a4Height + 6, { align: 'right' })

      //Kontrollquadrat 10 x 10 cm auf A1
      if (spalte === 0 && reihe === 0) {
        pdf.setLineWidth(0.3)
        pdf.rect(rand + 10, rand + 10, 100, 100)
        pdf.setFontSize(12)
        pdf.text('Kontrollquadrat', rand + 60, rand + 55, { align: 'center' })
        pdf.text('10 x 10 cm', rand + 60, rand + 62, { align: 'center' })
        pdf.setFontSize(8)
        pdf.text('Wenn das Quadrat nicht genau 10 cm misst, wurde beim Drucken skaliert.', rand + 60, rand + 70, { align: 'center', maxWidth: 90 })
      }
    }
  }

  svgElement.setAttribute('viewBox', ganzerBogen)
  pdf.save('schnittmusterLangarmshirt.pdf')
}


</script>


<template>
  <div class="app-container">
    <div class="info-header">
      <h1>Langarmshirt</h1>
      <p>(Info's zum Schnittmuster)</p>
      
      <button @click="saveToFirebase">Änderungen speichern</button>
      <button @click="downloadA4PDF" class="btn-pdf">PDF herunterladen</button>
      <span v-if="statusMessage">{{ statusMessage }}</span>
    </div>

    <!-- MAIN: Links SVG, Rechts Inputs -->
    <div class="content-layout">
      
      <!-- LINKS: SVG Anzeige (Verkleinert, mit weißem Hintergrund und 2 Pfaden) -->
      <div class="svg-container">
        <h2>Schnittmuster</h2>
        
        <!-- Für die sichtbare Vorschau -->
        <svg :viewBox="'0 0 ' + svgDimensions.width + ' ' + svgDimensions.height" class="pattern-svg">          <!-- Weißer Hintergrund für das SVG -->
    
          <rect width="100%" height="100%" fill="white" />

          <defs>
            <clipPath id="clip-vorder">
              <path :d="vorderTeil" />
            </clipPath>
            <clipPath id="clip-hinter">
              <path :d="hinterTeil" />
            </clipPath>
            <clipPath id="clip-aermel">
              <path :d="aermel" />
            </clipPath>
          </defs>
          <!-- SVG's für Schnittteile -->
          <g :transform="`translate(${svgDimensions.xVorder}, ${svgDimensions.yPos})`">
            <g clip-path="url(#clip-vorder)" stroke="black" stroke-width="0.3" opacity="0.4">
              <line v-for="i in 50" :key="'v'+i" :x1="-100 + i*15" y1="-50" :x2="i*15" y2="300" />
            </g>
            <path :d="vorderTeil" stroke="#4f46e5" stroke-width="0.5" fill="none" />
            <text x="10" y="20" font-size="11" fill="#4f46e5">Vorderteil</text>
          </g>

          <g :transform="`translate(${svgDimensions.xHinter}, ${svgDimensions.yPos})`">
            <g clip-path="url(#clip-hinter)" stroke="black" stroke-width="0.3" opacity="0.3">
              <line v-for="i in 50" :key="'h1'+i" :x1="-100 + i*15" y1="-50" :x2="i*15 - 50" y2="300" />
              <line v-for="i in 50" :key="'h2'+i" :x1="-100 + i*15" y1="300" :x2="i*15 - 50" y2="-50" />
            </g>
            <path :d="hinterTeil" fill="none" stroke="#10b981" stroke-width="0.5" />
            <text x="10" y="20" font-size="11" fill="#10b981">Rückenteil</text>
          </g>

          <g :transform="`translate(${svgDimensions.xAermel}, ${svgDimensions.yPos}) rotate(${aermelDrehung})`">
            <g clip-path="url(#clip-aermel)" stroke="black" stroke-width="0.3" opacity="0.3">
              <line v-for="i in 50" :key="'a'+i" :x1="i*10" y1="-50" :x2="i*10" y2="300" />
            </g>
            <path :d="aermel" fill="none" stroke="#676767" stroke-width="0.5" />
            <text x="10" y="20" font-size="11" fill="#676767">Ärmel</text>
          </g>
        </svg>
      </div>

      <div style="display:none;">
        <!-- Für das unsichtbare Export-SVG -->

        <!-- SVGs für Schnittteile -->
        <svg :viewBox="'0 0 ' + exportLayout.totalW + ' ' + exportLayout.totalH" class="pattern-svg-export">
          <rect width="100%" height="100%" fill="white" />
          <!-- Muster für Füllung -->
          <defs>
            <clipPath id="clip-vorder-pdf">
              <path :d="vorderTeil" />
            </clipPath>
            <clipPath id="clip-hinter-pdf">
              <path :d="hinterTeil" />
            </clipPath>
            <clipPath id="clip-aermel-pdf">
              <path :d="aermel" />
            </clipPath>
          </defs>

          <g transform="scale(10)">
            <g :transform="`translate(${exportLayout.vorder.x}, ${exportLayout.vorder.y})`">
              <g clip-path="url(#clip-vorder-pdf)" stroke="red" stroke-width="0.15" opacity="0.4">
                <line v-for="i in 800" :key="'vp'+i" :x1="-200 + i*1.5" y1="-100" :x2="i*1.5" y2="500" />
              </g>
              <path :d="vorderTeil" stroke="black" stroke-width="0.05" fill="none" />
              <!-- Bruchkante und Fadenlauf -->
              <path :d="exportDeko.vorder.bruch" stroke="black" stroke-width="0.05" fill="none" />
              <text :transform="`translate(${exportDeko.vorder.bruchTextX}, ${exportDeko.vorder.bruchTextY}) rotate(-90)`" text-anchor="middle" font-size="0.6" fill="black">Stoffbruch</text>
              <path :d="exportDeko.vorder.fadenlauf" stroke="black" stroke-width="0.05" fill="none" />
              <!-- Logo und Beschriftung -->
              <g :transform="exportDeko.vorder.logo" v-html="logoKleinInhalt"></g>
              <text :x="exportDeko.vorder.textX" :y="exportDeko.vorder.textY" text-anchor="middle" font-size="1.2" fill="black">Vorderteil</text>
              <text :x="exportDeko.vorder.textX" :y="exportDeko.vorder.textY + 1.2" text-anchor="middle" font-size="0.7" fill="black">1x im Stoffbruch</text>
              <text :x="exportDeko.vorder.textX" :y="exportDeko.vorder.textY + 2.2" text-anchor="middle" font-size="0.7" fill="black">{{ firstName }}</text>
            </g>

            <g :transform="`translate(${exportLayout.hinter.x}, ${exportLayout.hinter.y})`">
              <g clip-path="url(#clip-hinter-pdf)" stroke="blue" stroke-width="0.15" opacity="0.3">
                <line v-for="i in 800" :key="'hp1'+i" :x1="-200 + i*1.5" y1="-100" :x2="i*1.5 - 100" y2="500" />
                <line v-for="i in 800" :key="'hp2'+i" :x1="-200 + i*1.5" y1="500" :x2="i*1.5 - 100" y2="-100" />
              </g>
              <path :d="hinterTeil" fill="none" stroke="black" stroke-width="0.05" />
              <!-- Bruchkante und Fadenlauf -->
              <path :d="exportDeko.hinter.bruch" stroke="black" stroke-width="0.05" fill="none" />
              <text :transform="`translate(${exportDeko.hinter.bruchTextX}, ${exportDeko.hinter.bruchTextY}) rotate(-90)`" text-anchor="middle" font-size="0.6" fill="black">Stoffbruch</text>
              <path :d="exportDeko.hinter.fadenlauf" stroke="black" stroke-width="0.05" fill="none" />
              <!-- Logo und Beschriftung -->
              <g :transform="exportDeko.hinter.logo" v-html="logoKleinInhalt"></g>
              <text :x="exportDeko.hinter.textX" :y="exportDeko.hinter.textY" text-anchor="middle" font-size="1.2" fill="black">Rückenteil</text>
              <text :x="exportDeko.hinter.textX" :y="exportDeko.hinter.textY + 1.2" text-anchor="middle" font-size="0.7" fill="black">1x im Stoffbruch</text>
              <text :x="exportDeko.hinter.textX" :y="exportDeko.hinter.textY + 2.2" text-anchor="middle" font-size="0.7" fill="black">{{ firstName }}</text>
            </g>

            <g :transform="`translate(${exportLayout.aermel.x}, ${exportLayout.aermel.y})`">
              <!-- nur der Ärmel selbst wird gedreht, Beschriftung bleibt waagrecht -->
              <g :transform="`rotate(${aermelDrehung})`">
                <g clip-path="url(#clip-aermel-pdf)" stroke="green" stroke-width="0.15" opacity="0.4">
                  <line v-for="i in 800" :key="'ap'+i" :x1="i*1.0" y1="-100" :x2="i*1.0" y2="500" />
                </g>
                <path :d="aermel" fill="none" stroke="black" stroke-width="0.05" />
              </g>
              <!-- Bruchkante und Fadenlauf -->
              <path :d="exportDeko.aermel.bruch" stroke="black" stroke-width="0.05" fill="none" />
              <text :transform="`translate(${exportDeko.aermel.bruchTextX}, ${exportDeko.aermel.bruchTextY}) rotate(-90)`" text-anchor="middle" font-size="0.6" fill="black">Stoffbruch</text>
              <path :d="exportDeko.aermel.fadenlauf" stroke="black" stroke-width="0.05" fill="none" />
              <!-- Logo und Beschriftung -->
              <g :transform="exportDeko.aermel.logo" v-html="logoKleinInhalt"></g>
              <text :x="exportDeko.aermel.textX" :y="exportDeko.aermel.textY" text-anchor="middle" font-size="1.2" fill="black">Ärmel</text>
              <text :x="exportDeko.aermel.textX" :y="exportDeko.aermel.textY + 1.2" text-anchor="middle" font-size="0.7" fill="black">2x im Stoffbruch</text>
              <text :x="exportDeko.aermel.textX" :y="exportDeko.aermel.textY + 2.2" text-anchor="middle" font-size="0.7" fill="black">{{ firstName }}</text>
            </g>
          </g>

        </svg>
      </div>

      <!-- RECHTS: Inputs -->
      <div class="inputs-container">
        <h3>Benötigte Maße</h3>
        
        <div class="inputs-scroll">
          <div v-for="item in measurements" :key="item.id" class="input-item">
            <label :for="item.id">{{ item.label }} ({{ item.id }})</label>
            <div class="input-field-wrapper">
              <input 
                type="number" 
                :id="item.id" 
                v-model.number="item.value"
                :placeholder="item.default"
                step="0.5"
              />
              <span>{{ item.unit }}</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
/* Minimales Layout-Styling, Rest läuft über globales CSS */
.app-container {
  padding: 20px;
}

.info-header {
  background: #fff;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  margin-bottom: 20px;
}

.content-layout {
  display: flex;
  flex-direction: row;
  gap: 30px;
  align-items: flex-start;
}

.svg-container {
  flex: 1;
  background: #fff;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  max-width: 450px;
}

.pattern-svg {
  width: 100%;
  height: auto;
}

.inputs-container {
  flex: 1.2;
  background: #fff;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
}

.inputs-scroll {
  max-height: 400px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-right: 5px;
}

.input-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.input-item label {
  flex: 2;
  font-size: 0.9rem;
}

.input-field-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 5px;
}

.input-field-wrapper input {
  width: 80px;
  padding: 4px;
}
</style>