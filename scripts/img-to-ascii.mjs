#!/usr/bin/env node
import sharp from 'sharp'
import { writeFileSync } from 'fs'

const CELL_W = 8
const CELL_H = 16

function usage() {
  console.log(`Usage: node scripts/img-to-ascii.mjs <image> [options]

Structural ASCII art — matches character shapes to image regions,
not just brightness. A "T" is chosen for top-heavy edges, "/" for
diagonals, etc.

Options:
  -w, --width <n>        Output width in characters (default: 80)
  --invert               For dark backgrounds (dense chars = bright areas)
  --contrast <n>         Contrast boost 0-100 (default: 20)
  --brightness <n>       Brightness adjust -100 to 100 (default: 0)
  --chars <set>          Character set: full, ascii, alphanums (default: full)
  --simple               Fall back to brightness-only ramp mode
  -o, --output <file>    Write to file instead of stdout (.ts wraps as export)
  -h, --help             Show this help`)
  process.exit(0)
}

const CHARSETS = {
  // All printable ASCII (95 characters)
  full: Array.from({ length: 95 }, (_, i) => String.fromCharCode(32 + i)),
  // Letters, digits, punctuation — skip control-like chars
  ascii: ' !"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.split(''),
  // Minimal set
  alphanums: ' .,:;!|/\\()-_+~<>{}[]0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz@#$%&*'.split(''),
}

// Simple brightness ramp for --simple mode
const SIMPLE_RAMP = '$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,"^`\'. '

// ── Render each character to a small bitmap via SVG ──

async function renderCharBitmaps(chars) {
  const bitmaps = new Map()

  for (const char of chars) {
    const escaped = char
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;')

    const svg = Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${CELL_W}" height="${CELL_H}">` +
      `<rect width="100%" height="100%" fill="black"/>` +
      `<text x="${CELL_W / 2}" y="${CELL_H * 0.75}" text-anchor="middle" ` +
      `font-family="monospace,Courier" font-size="${CELL_H - 2}" fill="white">${escaped}</text>` +
      `</svg>`
    )

    const { data } = await sharp(svg).grayscale().raw().toBuffer({ resolveWithObject: true })
    bitmaps.set(char, new Uint8Array(data))
  }

  return bitmaps
}

// ── Find the character whose bitmap best matches an image block ──
// Uses sum-of-squared-differences (SSD) at the pixel level

function findBestMatch(block, bitmaps, invert) {
  let bestChar = ' '
  let bestScore = Infinity
  const pixels = CELL_W * CELL_H

  for (const [char, bitmap] of bitmaps) {
    let score = 0
    for (let i = 0; i < pixels; i++) {
      // For dark bg (invert): bright image pixels should match white char pixels
      // For light bg: bright image pixels should match dark (empty) char pixels
      const target = invert ? block[i] : 255 - block[i]
      const diff = target - bitmap[i]
      score += diff * diff
    }
    if (score < bestScore) {
      bestScore = score
      bestChar = char
    }
  }

  return bestChar
}

// ── Simple brightness-only mode ──

function simpleModeConvert(data, width, height, invert) {
  const ramp = invert ? SIMPLE_RAMP : [...SIMPLE_RAMP].reverse().join('')
  let ascii = ''
  for (let y = 0; y < height; y++) {
    let line = ''
    for (let x = 0; x < width; x++) {
      const val = Math.max(0, Math.min(255, data[y * width + x]))
      const idx = Math.floor((val / 255) * (ramp.length - 1))
      line += ramp[idx]
    }
    ascii += line.trimEnd() + '\n'
  }
  return ascii
}

// ── Main ──

const args = process.argv.slice(2)
if (args.length === 0 || args.includes('-h') || args.includes('--help')) usage()

const inputPath = args[0]
let width = 80
let invert = false
let contrast = 20
let brightness = 0
let charsetName = 'full'
let simple = false
let outputPath = null

for (let i = 1; i < args.length; i++) {
  switch (args[i]) {
    case '-w': case '--width':      width = parseInt(args[++i], 10); break
    case '--invert':                invert = true; break
    case '--contrast':              contrast = parseInt(args[++i], 10); break
    case '--brightness':            brightness = parseInt(args[++i], 10); break
    case '--chars':                 charsetName = args[++i]; break
    case '--simple':                simple = true; break
    case '-o': case '--output':     outputPath = args[++i]; break
  }
}

const meta = await sharp(inputPath).metadata()
const aspectRatio = meta.height / meta.width
const height = Math.round(width * aspectRatio * (CELL_W / CELL_H))

const factor = 1 + contrast / 50
const offset = 128 * (1 - factor) + brightness

if (simple) {
  // Brightness-only mode — resize to char grid, one pixel per char
  const { data } = await sharp(inputPath)
    .resize(width, height, { fit: 'fill' })
    .grayscale()
    .linear(factor, offset)
    .raw()
    .toBuffer({ resolveWithObject: true })

  const ascii = simpleModeConvert(data, width, height, invert)
  outputResult(ascii, width, height, 'simple')
} else {
  // Structural mode — resize to pixel grid, one cell block per char
  const pixelW = width * CELL_W
  const pixelH = height * CELL_H

  console.error(`Rendering ${CHARSETS[charsetName]?.length ?? '?'} character bitmaps...`)
  const chars = CHARSETS[charsetName]
  if (!chars) {
    console.error(`Unknown charset "${charsetName}". Available: ${Object.keys(CHARSETS).join(', ')}`)
    process.exit(1)
  }
  const bitmaps = await renderCharBitmaps(chars)

  console.error(`Processing image at ${pixelW}x${pixelH} pixels (${width}x${height} chars)...`)
  const { data } = await sharp(inputPath)
    .resize(pixelW, pixelH, { fit: 'fill' })
    .grayscale()
    .linear(factor, offset)
    .raw()
    .toBuffer({ resolveWithObject: true })

  let ascii = ''
  const block = new Uint8Array(CELL_W * CELL_H)

  for (let cy = 0; cy < height; cy++) {
    let line = ''
    for (let cx = 0; cx < width; cx++) {
      // Extract the cell block from the image
      for (let py = 0; py < CELL_H; py++) {
        for (let px = 0; px < CELL_W; px++) {
          block[py * CELL_W + px] = Math.max(0, Math.min(255,
            data[(cy * CELL_H + py) * pixelW + (cx * CELL_W + px)]
          ))
        }
      }
      line += findBestMatch(block, bitmaps, invert)
    }
    ascii += line.trimEnd() + '\n'
  }

  outputResult(ascii, width, height, `structural, ${chars.length} chars`)
}

function outputResult(ascii, w, h, mode) {
  if (outputPath) {
    if (outputPath.endsWith('.ts') || outputPath.endsWith('.tsx')) {
      const escaped = ascii.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$')
      writeFileSync(outputPath, `export const portraitAscii = \`\n${escaped}\`\n`)
      console.error(`Wrote TS export to ${outputPath} (${w}x${h}, ${mode})`)
    } else {
      writeFileSync(outputPath, ascii)
      console.error(`Wrote to ${outputPath} (${w}x${h}, ${mode})`)
    }
  } else {
    process.stdout.write(ascii)
    console.error(`\n(${w}x${h}, ${mode})`)
  }
}
