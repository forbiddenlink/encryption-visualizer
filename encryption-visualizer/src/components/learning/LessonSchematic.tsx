import { useId } from 'react';

const captions: Record<string, string> = {
  aes: 'A 128-bit state, transformed round by round.',
  rsa: 'Two primes produce a public and private key pair.',
  ecc: 'A line meets the curve; reflection gives the sum.',
  hashing: 'A message becomes a fixed 256-bit fingerprint.',
  'diffie-hellman': 'Public values cross. The shared secret stays private.',
  signatures: 'Sign with the private key. Verify with the public key.',
  tls: 'Agree on keys, authenticate, then encrypt application data.',
  'block-modes': 'The mode defines how blocks connect.',
  padding: 'Fill the final block to its required boundary.',
  hmac: 'A keyed inner hash feeds a keyed outer hash.',
  'password-hashing': 'Salt separates inputs. Repeated work raises the cost.',
  cryptanalysis: 'Patterns in ciphertext can reveal structure.',
};

/** Static conceptual plates; all experimental values live in the lesson below. */
export const LessonSchematic = ({ slug }: { slug: string }) => {
  const markerId = useId().replace(/:/g, '');
  const arrow = `url(#${markerId})`;
  const line = (x1: number, y1: number, x2: number, y2: number) => (
    <line x1={x1} y1={y1} x2={x2} y2={y2} markerEnd={arrow} />
  );
  const box = (x: number, y: number, label: string, width = 76) => (
    <g>
      <rect x={x} y={y} width={width} height="34" rx="1" />
      <text x={x + width / 2} y={y + 21} textAnchor="middle">
        {label}
      </text>
    </g>
  );
  const matrix = (x: number, values: string[]) => (
    <g>
      {values.map((value, i) => (
        <g key={i}>
          <rect x={x + (i % 4) * 22} y={36 + Math.floor(i / 4) * 22} width="22" height="22" />
          <text x={x + (i % 4) * 22 + 11} y={51 + Math.floor(i / 4) * 22} textAnchor="middle">
            {value}
          </text>
        </g>
      ))}
    </g>
  );
  let drawing;
  switch (slug) {
    case 'aes':
      drawing = (
        <>
          {matrix(
            23,
            Array.from({ length: 16 }, (_, i) => `s${i.toString(16)}`)
          )}
          {line(124, 80, 202, 80)}
          <text x="163" y="62" textAnchor="middle">
            round
          </text>
          {matrix(
            217,
            Array.from({ length: 16 }, (_, i) => `s′${i.toString(16)}`)
          )}
          <text x="67" y="145" textAnchor="middle">
            input state
          </text>
          <text x="261" y="145" textAnchor="middle">
            output state
          </text>
        </>
      );
      break;
    case 'rsa':
      drawing = (
        <>
          {box(35, 24, 'prime p')}
          {box(221, 24, 'prime q')}
          {line(111, 41, 148, 77)}
          {line(221, 41, 186, 77)}
          <text x="167" y="92" textAnchor="middle" className="plate-emphasis">
            n = p × q
          </text>
          <path d="M167 104V116H73M167 116H261" />
          <text x="73" y="139" textAnchor="middle">
            public (n, e)
          </text>
          <text x="261" y="139" textAnchor="middle">
            private (n, d)
          </text>
        </>
      );
      break;
    case 'ecc':
      drawing = (
        <>
          <path className="plate-axis" d="M33 85H307M166 15V150" />
          <path
            className="plate-accent"
            d="M208 20C185 35 183 62 148 72C122 80 117 85 148 98C183 110 185 134 208 150"
          />
          <path d="M76 130L264 34" />
          <circle cx="148" cy="93" r="4" />
          <circle cx="187" cy="73" r="4" />
          <circle cx="199" cy="66" r="4" />
          <path strokeDasharray="3 4" d="M199 66V104" />
          <circle cx="199" cy="104" r="4" className="plate-accent" />
          <text x="130" y="111">
            P
          </text>
          <text x="175" y="60">
            Q
          </text>
          <text x="212" y="111">
            P + Q
          </text>
          <text x="45" y="29">
            y² = x³ + ax + b
          </text>
        </>
      );
      break;
    case 'hashing':
      drawing = (
        <>
          {box(18, 62, 'message', 82)}
          {line(100, 79, 124, 79)}
          {box(130, 62, 'SHA-256', 82)}
          {line(212, 79, 238, 79)}
          <g className="plate-accent">
            {Array.from({ length: 8 }, (_, i) => (
              <rect
                key={i}
                x={245 + (i % 4) * 14}
                y={57 + Math.floor(i / 4) * 22}
                width="11"
                height="19"
              />
            ))}
          </g>
          <text x="171" y="43" textAnchor="middle">
            64 rounds / block
          </text>
          <text x="274" y="123" textAnchor="middle">
            256 bits
          </text>
          <text x="57" y="123" textAnchor="middle">
            any length
          </text>
        </>
      );
      break;
    case 'diffie-hellman':
      drawing = (
        <>
          <text x="54" y="29">
            Alice
          </text>
          <text x="249" y="29">
            Bob
          </text>
          <path strokeDasharray="3 4" d="M75 40V134M265 40V134" />
          {line(84, 61, 255, 61)}
          {line(255, 94, 84, 94)}
          <text x="169" y="52" textAnchor="middle">
            A = gᵃ mod p
          </text>
          <text x="169" y="85" textAnchor="middle">
            B = gᵇ mod p
          </text>
          <text x="169" y="144" textAnchor="middle" className="plate-emphasis">
            Bᵃ = Aᵇ = gᵃᵇ mod p
          </text>
        </>
      );
      break;
    case 'block-modes':
      drawing = (
        <>
          {[0, 1, 2].map((i) => (
            <g key={i}>
              {box(22 + i * 104, 37, `P${i + 1}`)}
              {line(60 + i * 104, 71, 60 + i * 104, 97)}
              {box(22 + i * 104, 104, `C${i + 1}`)}
              {i < 2 && (
                <path
                  className="plate-accent"
                  d={`M${98 + i * 104} 121H${110 + i * 104}V84H${164 + i * 104}`}
                />
              )}
            </g>
          ))}
          <text x="165" y="22" textAnchor="middle">
            CBC: chain the previous ciphertext
          </text>
        </>
      );
      break;
    case 'padding':
      drawing = (
        <>
          <text x="22" y="36">
            Example: PKCS#7 / 8-byte block
          </text>
          {Array.from({ length: 8 }, (_, i) => (
            <g key={i} className={i >= 5 ? 'plate-accent' : ''}>
              <rect x={22 + i * 36} y="61" width="36" height="42" />
              <text x={40 + i * 36} y="86" textAnchor="middle">
                {i >= 5 ? '03' : ['48', '65', '6c', '6c', '6f'][i]}
              </text>
            </g>
          ))}
          <path d="M203 113V123H310V113" />
          <text x="256" y="144" textAnchor="middle">
            3 padding bytes
          </text>
        </>
      );
      break;
    case 'hmac':
      drawing = (
        <>
          {box(19, 36, 'K ⊕ ipad', 88)}
          {box(19, 103, 'K ⊕ opad', 88)}
          {box(229, 36, 'inner hash', 88)}
          {box(229, 103, 'outer hash', 88)}
          {line(107, 53, 224, 53)}
          {line(107, 120, 224, 120)}
          <path className="plate-accent" d="M273 70V89H179V120" markerEnd={arrow} />
          <text x="165" y="42" textAnchor="middle">
            + message
          </text>
        </>
      );
      break;
    case 'password-hashing':
      drawing = (
        <>
          {box(21, 58, 'password', 84)}
          {box(21, 110, 'salt', 84)}
          <path d="M105 75H143M105 127H122V75" />
          {box(148, 58, 'work', 65)}
          <path className="plate-accent" d="M180 58V30H239V75H217" markerEnd={arrow} />
          {line(213, 75, 246, 75)}
          {box(251, 58, 'hash', 65)}
          <text x="188" y="145" textAnchor="middle">
            repeat according to cost
          </text>
        </>
      );
      break;
    case 'signatures':
      drawing = (
        <>
          {box(17, 36, 'message', 80)}
          {line(97, 53, 123, 53)}
          {box(129, 36, 'sign', 80)}
          {line(209, 53, 235, 53)}
          {box(241, 36, 'signature', 80)}
          <text x="169" y="25" textAnchor="middle">
            private key
          </text>
          <path d="M281 70V114H209" markerEnd={arrow} />
          {box(129, 97, 'verify', 80)}
          <text x="169" y="153" textAnchor="middle">
            public key + original message
          </text>
        </>
      );
      break;
    case 'tls':
      drawing = (
        <>
          <text x="28" y="24">
            Client
          </text>
          <text x="270" y="24">
            Server
          </text>
          <path strokeDasharray="3 4" d="M53 33V146M291 33V146" />
          {line(61, 49, 282, 49)}
          <text x="171" y="42" textAnchor="middle">
            ClientHello + key share
          </text>
          {line(282, 81, 61, 81)}
          <text x="171" y="74" textAnchor="middle">
            ServerHello + key share
          </text>
          {line(282, 111, 61, 111)}
          <text x="171" y="104" textAnchor="middle">
            authenticate + Finished
          </text>
          <path className="plate-accent" d="M61 138H282" />
          <text x="171" y="158" textAnchor="middle">
            encrypted application data
          </text>
        </>
      );
      break;
    default:
      drawing = (
        <>
          <text x="25" y="28">
            Ciphertext letter frequency
          </text>
          <path d="M25 38V133H311" />
          {[21, 44, 29, 82, 37, 55, 27, 67, 34, 49].map((h, i) => (
            <rect
              key={i}
              className={i === 3 ? 'plate-accent' : ''}
              x={38 + i * 26}
              y={132 - h}
              width="15"
              height={h}
            />
          ))}
          <text x="122" y="155" textAnchor="middle">
            patterns remain visible
          </text>
        </>
      );
  }
  return (
    <figure className="lesson-plate">
      <svg viewBox="0 0 340 170" aria-hidden="true" focusable="false">
        <defs>
          <marker
            id={markerId}
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto-start-reverse"
          >
            <path d="M0 0L10 5L0 10Z" />
          </marker>
        </defs>
        {drawing}
      </svg>
      <figcaption>{captions[slug]}</figcaption>
    </figure>
  );
};
