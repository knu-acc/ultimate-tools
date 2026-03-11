// Pure TypeScript QR Code generator — produces scannable QR codes
// Supports versions 1–10, byte mode, EC level L, mask pattern selection

// ─── GF(256) arithmetic for Reed-Solomon ────────────────────────────────────

const GF_EXP = new Uint8Array(512);
const GF_LOG = new Uint8Array(256);

(function initGF() {
  let v = 1;
  for (let i = 0; i < 255; i++) {
    GF_EXP[i] = v;
    GF_LOG[v] = i;
    v <<= 1;
    if (v & 0x100) v ^= 0x11d; // primitive polynomial x^8+x^4+x^3+x^2+1
  }
  for (let i = 255; i < 512; i++) GF_EXP[i] = GF_EXP[i - 255];
})();

function gfMul(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return GF_EXP[GF_LOG[a] + GF_LOG[b]];
}

function gfPolyMul(p: number[], q: number[]): number[] {
  const r = new Array(p.length + q.length - 1).fill(0);
  for (let i = 0; i < p.length; i++)
    for (let j = 0; j < q.length; j++)
      r[i + j] ^= gfMul(p[i], q[j]);
  return r;
}

function gfPolyDiv(dividend: number[], divisor: number[]): number[] {
  const result = dividend.slice();
  for (let i = 0; i < dividend.length - divisor.length + 1; i++) {
    if (result[i] === 0) continue;
    const coef = result[i];
    for (let j = 1; j < divisor.length; j++)
      result[i + j] ^= gfMul(divisor[j], coef);
  }
  return result.slice(dividend.length - divisor.length + 1);
}

function rsGeneratorPoly(nsym: number): number[] {
  let g = [1];
  for (let i = 0; i < nsym; i++)
    g = gfPolyMul(g, [1, GF_EXP[i]]);
  return g;
}

function rsEncode(data: number[], nsym: number): number[] {
  const gen = rsGeneratorPoly(nsym);
  const padded = [...data, ...new Array(nsym).fill(0)];
  return gfPolyDiv(padded, gen);
}

// ─── QR Version / capacity tables (EC level L, byte mode) ──────────────────

// QR Version info table for EC level L
interface VersionInfo {
  totalCW: number;
  dataCW: number;
  ecPerBlock: number;
  groups: [number, number][]; // [numBlocks, dataCWPerBlock][]
}

const VERSIONS: VersionInfo[] = [
  { totalCW: 0, dataCW: 0, ecPerBlock: 0, groups: [] },                   // 0 placeholder
  { totalCW: 26, dataCW: 19, ecPerBlock: 7, groups: [[1, 19]] },          // 1
  { totalCW: 44, dataCW: 34, ecPerBlock: 10, groups: [[1, 34]] },         // 2
  { totalCW: 70, dataCW: 55, ecPerBlock: 15, groups: [[1, 55]] },         // 3
  { totalCW: 100, dataCW: 80, ecPerBlock: 20, groups: [[1, 80]] },        // 4
  { totalCW: 134, dataCW: 108, ecPerBlock: 26, groups: [[1, 108]] },      // 5
  { totalCW: 172, dataCW: 136, ecPerBlock: 18, groups: [[2, 68]] },       // 6
  { totalCW: 196, dataCW: 156, ecPerBlock: 20, groups: [[2, 78]] },       // 7
  { totalCW: 242, dataCW: 194, ecPerBlock: 24, groups: [[2, 97]] },       // 8
  { totalCW: 292, dataCW: 232, ecPerBlock: 30, groups: [[2, 116]] },      // 9
  { totalCW: 346, dataCW: 274, ecPerBlock: 18, groups: [[2, 68], [2, 69]] }, // 10
];

// Alignment pattern positions per version
const ALIGNMENT_POSITIONS: number[][] = [
  [],         // 0
  [],         // 1
  [6, 18],    // 2
  [6, 22],    // 3
  [6, 26],    // 4
  [6, 30],    // 5
  [6, 34],    // 6
  [6, 22, 38],// 7
  [6, 24, 42],// 8
  [6, 26, 46],// 9
  [6, 28, 50],// 10
];

function getVersion(dataLen: number): number {
  for (let v = 1; v <= 10; v++) {
    // Byte mode: 4 bits mode + char count bits + data + terminator
    const charCountBits = v <= 9 ? 8 : 16;
    const availableBits = VERSIONS[v].dataCW * 8;
    const overhead = 4 + charCountBits; // mode indicator + char count
    const maxBytes = Math.floor((availableBits - overhead) / 8);
    if (dataLen <= maxBytes) return v;
  }
  return 10; // clamp to v10
}

function qrSize(version: number): number {
  return 17 + version * 4;
}

// ─── Data encoding ──────────────────────────────────────────────────────────

function encodeData(text: string, version: number): number[] {
  const vInfo = VERSIONS[version];
  const bytes = new TextEncoder().encode(text);
  const charCountBits = version <= 9 ? 8 : 16;

  // Build bit stream
  const bits: number[] = [];
  const pushBits = (val: number, len: number) => {
    for (let i = len - 1; i >= 0; i--)
      bits.push((val >> i) & 1);
  };

  // Mode indicator: byte mode = 0100
  pushBits(0b0100, 4);
  // Character count
  pushBits(bytes.length, charCountBits);
  // Data
  for (let bi = 0; bi < bytes.length; bi++) pushBits(bytes[bi], 8);
  // Terminator (up to 4 zeros)
  const totalDataBits = vInfo.dataCW * 8;
  const terminatorLen = Math.min(4, totalDataBits - bits.length);
  pushBits(0, terminatorLen);

  // Pad to byte boundary
  while (bits.length % 8 !== 0) bits.push(0);

  // Convert to bytes
  const dataBytes: number[] = [];
  for (let i = 0; i < bits.length; i += 8) {
    let byte = 0;
    for (let j = 0; j < 8; j++) byte = (byte << 1) | (bits[i + j] || 0);
    dataBytes.push(byte);
  }

  // Pad with alternating 0xEC, 0x11
  const padBytes = [0xEC, 0x11];
  let padIdx = 0;
  while (dataBytes.length < vInfo.dataCW) {
    dataBytes.push(padBytes[padIdx % 2]);
    padIdx++;
  }

  return dataBytes.slice(0, vInfo.dataCW);
}

// ─── Error correction & interleaving ────────────────────────────────────────

function computeEC(data: number[], version: number): number[] {
  const vInfo = VERSIONS[version];

  // Split data into blocks
  const dataBlocks: number[][] = [];
  const ecBlocks: number[][] = [];
  let offset = 0;

  for (const [numBlocks, dataCWPerBlock] of vInfo.groups) {
    for (let b = 0; b < numBlocks; b++) {
      const block = data.slice(offset, offset + dataCWPerBlock);
      dataBlocks.push(block);
      ecBlocks.push(rsEncode(block, vInfo.ecPerBlock));
      offset += dataCWPerBlock;
    }
  }

  // Interleave data codewords
  const maxDataLen = Math.max(...dataBlocks.map(b => b.length));
  const interleaved: number[] = [];
  for (let i = 0; i < maxDataLen; i++)
    for (const block of dataBlocks)
      if (i < block.length) interleaved.push(block[i]);

  // Interleave EC codewords
  for (let i = 0; i < vInfo.ecPerBlock; i++)
    for (const block of ecBlocks)
      if (i < block.length) interleaved.push(block[i]);

  return interleaved;
}

// ─── Module placement ───────────────────────────────────────────────────────

type Matrix = number[][]; // -1 = unset, 0 = light, 1 = dark

function createMatrix(size: number): Matrix {
  return Array.from({ length: size }, () => Array(size).fill(-1));
}

function setModule(matrix: Matrix, row: number, col: number, val: number) {
  if (row >= 0 && row < matrix.length && col >= 0 && col < matrix.length)
    matrix[row][col] = val;
}

function isReserved(matrix: Matrix, row: number, col: number): boolean {
  return matrix[row][col] !== -1;
}

function placeFinderPattern(matrix: Matrix, row: number, col: number) {
  for (let r = -1; r <= 7; r++) {
    for (let c = -1; c <= 7; c++) {
      const rr = row + r, cc = col + c;
      if (rr < 0 || rr >= matrix.length || cc < 0 || cc >= matrix.length) continue;
      if (r >= 0 && r <= 6 && c >= 0 && c <= 6) {
        if (r === 0 || r === 6 || c === 0 || c === 6 ||
            (r >= 2 && r <= 4 && c >= 2 && c <= 4)) {
          setModule(matrix, rr, cc, 1);
        } else {
          setModule(matrix, rr, cc, 0);
        }
      } else {
        // Separator
        setModule(matrix, rr, cc, 0);
      }
    }
  }
}

function placeAlignmentPattern(matrix: Matrix, row: number, col: number) {
  for (let r = -2; r <= 2; r++) {
    for (let c = -2; c <= 2; c++) {
      const rr = row + r, cc = col + c;
      if (rr < 0 || rr >= matrix.length || cc < 0 || cc >= matrix.length) continue;
      if (Math.abs(r) === 2 || Math.abs(c) === 2 || (r === 0 && c === 0)) {
        setModule(matrix, rr, cc, 1);
      } else {
        setModule(matrix, rr, cc, 0);
      }
    }
  }
}

function placeTimingPatterns(matrix: Matrix) {
  const size = matrix.length;
  for (let i = 8; i < size - 8; i++) {
    if (matrix[6][i] === -1) setModule(matrix, 6, i, i % 2 === 0 ? 1 : 0);
    if (matrix[i][6] === -1) setModule(matrix, i, 6, i % 2 === 0 ? 1 : 0);
  }
}

function reserveFormatAreas(matrix: Matrix) {
  const size = matrix.length;
  // Around top-left finder
  for (let i = 0; i <= 8; i++) {
    if (matrix[8][i] === -1) setModule(matrix, 8, i, 0);
    if (matrix[i][8] === -1) setModule(matrix, i, 8, 0);
  }
  // Around top-right finder
  for (let i = 0; i <= 7; i++) {
    if (matrix[8][size - 1 - i] === -1) setModule(matrix, 8, size - 1 - i, 0);
  }
  // Around bottom-left finder
  for (let i = 0; i <= 7; i++) {
    if (matrix[size - 1 - i][8] === -1) setModule(matrix, size - 1 - i, 8, 0);
  }
  // Dark module
  setModule(matrix, size - 8, 8, 1);
}

function computeVersionInfo(version: number): number {
  // 18 bits: 6 data bits (version) + 12 BCH error correction bits
  // Generator: x^12 + x^11 + x^10 + x^9 + x^8 + x^5 + x^2 + 1 = 1111100100101
  let bits = version << 12;
  const gen = 0b1111100100101;
  for (let i = 17; i >= 12; i--) {
    if (bits & (1 << i)) bits ^= gen << (i - 12);
  }
  return (version << 12) | bits;
}

function placeAllPatterns(matrix: Matrix, version: number) {
  const size = matrix.length;

  // Finder patterns
  placeFinderPattern(matrix, 0, 0);
  placeFinderPattern(matrix, 0, size - 7);
  placeFinderPattern(matrix, size - 7, 0);

  // Alignment patterns
  const positions = ALIGNMENT_POSITIONS[version];
  if (positions.length > 0) {
    for (let i = 0; i < positions.length; i++) {
      for (let j = 0; j < positions.length; j++) {
        const r = positions[i], c = positions[j];
        // Skip if overlapping with finder patterns
        if (r <= 8 && c <= 8) continue; // top-left
        if (r <= 8 && c >= size - 8) continue; // top-right
        if (r >= size - 8 && c <= 8) continue; // bottom-left
        placeAlignmentPattern(matrix, r, c);
      }
    }
  }

  // Timing patterns
  placeTimingPatterns(matrix);

  // Reserve format info areas
  reserveFormatAreas(matrix);

  // Place version info (version >= 7)
  if (version >= 7) {
    const versionBits = computeVersionInfo(version);
    let bitIdx = 0;
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 3; j++) {
        const bit = (versionBits >> bitIdx) & 1;
        setModule(matrix, i, size - 11 + j, bit);
        setModule(matrix, size - 11 + j, i, bit);
        bitIdx++;
      }
    }
  }
}

function placeDataBits(matrix: Matrix, data: number[]) {
  const size = matrix.length;
  // Convert codewords to bit stream
  const bits: number[] = [];
  for (const byte of data) {
    for (let i = 7; i >= 0; i--) bits.push((byte >> i) & 1);
  }

  let bitIdx = 0;
  // Traverse in 2-column stripes from right to left
  let col = size - 1;
  while (col >= 0) {
    if (col === 6) col--; // skip timing column

    // Determine direction
    const stripe = Math.floor((size - 1 - col) / 2);
    const upward = stripe % 2 === 0;

    for (let cnt = 0; cnt < size; cnt++) {
      const row = upward ? (size - 1 - cnt) : cnt;
      for (let dc = 0; dc <= 1; dc++) {
        const c = col - dc;
        if (c < 0) continue;
        if (matrix[row][c] !== -1) continue; // reserved
        if (bitIdx < bits.length) {
          matrix[row][c] = bits[bitIdx];
          bitIdx++;
        } else {
          matrix[row][c] = 0; // remainder bits
        }
      }
    }
    col -= 2;
  }
}

// ─── Masking ────────────────────────────────────────────────────────────────

type MaskFn = (row: number, col: number) => boolean;

const MASK_FUNCTIONS: MaskFn[] = [
  (r, c) => (r + c) % 2 === 0,
  (r, _) => r % 2 === 0,
  (_, c) => c % 3 === 0,
  (r, c) => (r + c) % 3 === 0,
  (r, c) => (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 0,
  (r, c) => ((r * c) % 2 + (r * c) % 3) === 0,
  (r, c) => ((r * c) % 2 + (r * c) % 3) % 2 === 0,
  (r, c) => ((r + c) % 2 + (r * c) % 3) % 2 === 0,
];

function buildReservedMap(version: number): boolean[][] {
  const size = qrSize(version);
  const reserved = Array.from({ length: size }, () => Array(size).fill(false));

  // Finder patterns + separators
  for (let r = 0; r <= 8; r++)
    for (let c = 0; c <= 8; c++) reserved[r][c] = true;
  for (let r = 0; r <= 8; r++)
    for (let c = size - 8; c < size; c++) reserved[r][c] = true;
  for (let r = size - 8; r < size; r++)
    for (let c = 0; c <= 8; c++) reserved[r][c] = true;

  // Alignment patterns
  const positions = ALIGNMENT_POSITIONS[version];
  if (positions.length > 0) {
    for (let i = 0; i < positions.length; i++) {
      for (let j = 0; j < positions.length; j++) {
        const pr = positions[i], pc = positions[j];
        if (pr <= 8 && pc <= 8) continue;
        if (pr <= 8 && pc >= size - 8) continue;
        if (pr >= size - 8 && pc <= 8) continue;
        for (let r = -2; r <= 2; r++)
          for (let c = -2; c <= 2; c++) {
            const rr = pr + r, cc = pc + c;
            if (rr >= 0 && rr < size && cc >= 0 && cc < size)
              reserved[rr][cc] = true;
          }
      }
    }
  }

  // Timing patterns
  for (let i = 0; i < size; i++) {
    reserved[6][i] = true;
    reserved[i][6] = true;
  }

  // Dark module
  reserved[size - 8][8] = true;

  // Format info
  // (already covered by finder pattern area above)

  // Version info (version >= 7)
  if (version >= 7) {
    for (let i = 0; i < 6; i++)
      for (let j = 0; j < 3; j++) {
        reserved[i][size - 11 + j] = true;
        reserved[size - 11 + j][i] = true;
      }
  }

  return reserved;
}

function applyMask(matrix: Matrix, reserved: boolean[][], maskIdx: number): Matrix {
  const size = matrix.length;
  const masked = matrix.map(row => row.slice());
  const fn = MASK_FUNCTIONS[maskIdx];
  for (let r = 0; r < size; r++)
    for (let c = 0; c < size; c++)
      if (!reserved[r][c])
        masked[r][c] = masked[r][c] ^ (fn(r, c) ? 1 : 0);
  return masked;
}

// ─── Format information ────────────────────────────────────────────────────

// EC level L = 01, mask patterns 0-7
// Format info is 15 bits: 5 data + 10 EC (BCH)
const FORMAT_MASK = 0b101010000010010;

function computeFormatBits(ecLevel: number, maskPattern: number): number {
  const data = (ecLevel << 3) | maskPattern;
  let bits = data << 10;
  // BCH(15,5) generator: x^10 + x^8 + x^5 + x^4 + x^2 + x + 1 = 10100110111
  const gen = 0b10100110111;
  for (let i = 14; i >= 10; i--) {
    if (bits & (1 << i)) bits ^= gen << (i - 10);
  }
  return ((data << 10) | bits) ^ FORMAT_MASK;
}

function placeFormatInfo(matrix: Matrix, ecLevel: number, maskPattern: number) {
  const size = matrix.length;
  const fmt = computeFormatBits(ecLevel, maskPattern);

  // First copy: around top-left finder pattern
  // Row 8 horizontal (bits 0-7), skipping col 6
  const copy1: [number, number][] = [
    [8, 0], [8, 1], [8, 2], [8, 3], [8, 4], [8, 5], [8, 7], [8, 8],  // bits 0-7
    [7, 8], [5, 8], [4, 8], [3, 8], [2, 8], [1, 8], [0, 8],          // bits 8-14
  ];

  // Second copy: bottom-left (vertical) + top-right (horizontal)
  const copy2: [number, number][] = [
    [size - 1, 8], [size - 2, 8], [size - 3, 8], [size - 4, 8],       // bits 0-3
    [size - 5, 8], [size - 6, 8], [size - 7, 8],                       // bits 4-6
    [8, size - 8], [8, size - 7], [8, size - 6], [8, size - 5],        // bits 7-10
    [8, size - 4], [8, size - 3], [8, size - 2], [8, size - 1],        // bits 11-14
  ];

  for (let i = 0; i < 15; i++) {
    const bit = (fmt >> (14 - i)) & 1;
    matrix[copy1[i][0]][copy1[i][1]] = bit;
    matrix[copy2[i][0]][copy2[i][1]] = bit;
  }
}

// ─── Penalty score calculation ──────────────────────────────────────────────

function penaltyScore(matrix: Matrix): number {
  const size = matrix.length;
  let score = 0;

  // Rule 1: Adjacent modules in row/column with same color
  for (let r = 0; r < size; r++) {
    let count = 1;
    for (let c = 1; c < size; c++) {
      if (matrix[r][c] === matrix[r][c - 1]) {
        count++;
        if (count === 5) score += 3;
        else if (count > 5) score += 1;
      } else {
        count = 1;
      }
    }
  }
  for (let c = 0; c < size; c++) {
    let count = 1;
    for (let r = 1; r < size; r++) {
      if (matrix[r][c] === matrix[r - 1][c]) {
        count++;
        if (count === 5) score += 3;
        else if (count > 5) score += 1;
      } else {
        count = 1;
      }
    }
  }

  // Rule 2: 2x2 blocks of same color
  for (let r = 0; r < size - 1; r++) {
    for (let c = 0; c < size - 1; c++) {
      const v = matrix[r][c];
      if (v === matrix[r][c + 1] && v === matrix[r + 1][c] && v === matrix[r + 1][c + 1])
        score += 3;
    }
  }

  // Rule 3: Finder-like patterns (1011101 0000 or 0000 1011101)
  const pattern1 = [1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0];
  const pattern2 = [0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c <= size - 11; c++) {
      let match1 = true, match2 = true;
      for (let k = 0; k < 11; k++) {
        if (matrix[r][c + k] !== pattern1[k]) match1 = false;
        if (matrix[r][c + k] !== pattern2[k]) match2 = false;
      }
      if (match1) score += 40;
      if (match2) score += 40;
    }
  }
  for (let c = 0; c < size; c++) {
    for (let r = 0; r <= size - 11; r++) {
      let match1 = true, match2 = true;
      for (let k = 0; k < 11; k++) {
        if (matrix[r + k][c] !== pattern1[k]) match1 = false;
        if (matrix[r + k][c] !== pattern2[k]) match2 = false;
      }
      if (match1) score += 40;
      if (match2) score += 40;
    }
  }

  // Rule 4: Proportion of dark modules
  let darkCount = 0;
  for (let r = 0; r < size; r++)
    for (let c = 0; c < size; c++)
      if (matrix[r][c] === 1) darkCount++;
  const total = size * size;
  const pct = (darkCount / total) * 100;
  const prev5 = Math.floor(pct / 5) * 5;
  const next5 = prev5 + 5;
  score += Math.min(Math.abs(prev5 - 50) / 5, Math.abs(next5 - 50) / 5) * 10;

  return score;
}

// ─── Main QR generation function ────────────────────────────────────────────

export function generateQR(text: string): boolean[][] {
  if (!text) return [[false]];

  const bytes = new TextEncoder().encode(text);
  const version = getVersion(bytes.length);
  const size = qrSize(version);

  // Encode data
  const dataCodewords = encodeData(text, version);

  // Compute error correction and interleave
  const finalData = computeEC(dataCodewords, version);

  // Build reserved map for masking
  const reserved = buildReservedMap(version);

  // Place function patterns
  const baseMatrix = createMatrix(size);
  placeAllPatterns(baseMatrix, version);

  // Place data bits
  placeDataBits(baseMatrix, finalData);

  // Try all 8 mask patterns and pick the one with lowest penalty
  let bestMask = 0;
  let bestScore = Infinity;
  let bestMatrix: Matrix = baseMatrix;

  for (let m = 0; m < 8; m++) {
    const masked = applyMask(baseMatrix, reserved, m);
    // Place format info (EC level L = 01)
    placeFormatInfo(masked, 1, m);
    const score = penaltyScore(masked);
    if (score < bestScore) {
      bestScore = score;
      bestMask = m;
      bestMatrix = masked;
    }
  }

  // Final matrix with best mask
  const finalMatrix = applyMask(baseMatrix, reserved, bestMask);
  placeFormatInfo(finalMatrix, 1, bestMask);

  // Convert to boolean[][] (1 = dark = true)
  return finalMatrix.map(row => row.map(cell => cell === 1));
}
