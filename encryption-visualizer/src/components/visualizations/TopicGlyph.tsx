import type { ReactNode } from 'react';

/** Small diagrams identify the mathematical structure of each lesson. */
export const TopicGlyph = ({ slug }: { slug: string }) => {
  const accent = 'var(--accent)';
  const box = (x: number, y: number, label: string, selected = false): ReactNode => (
    <g key={`${x}-${y}`}>
      <rect x={x} y={y} width="25" height="22" fill={selected ? accent : 'none'} stroke={selected ? accent : 'currentColor'} />
      <text x={x + 12.5} y={y + 14} textAnchor="middle" fill={selected ? 'var(--paper, #f4f0e7)' : 'currentColor'} stroke="none" fontSize="8">{label}</text>
    </g>
  );
  const label = (x: number, y: number, text: string, fill = 'currentColor'): ReactNode => <text x={x} y={y} textAnchor="middle" fill={fill} stroke="none" fontSize="10">{text}</text>;
  let diagram: ReactNode;
  switch (slug) {
    case 'aes':
      diagram = <>{['63', '7c', '77', '7b', 'f2', '6b', '6f', 'c5', '30', '01', '67', '2b'].map((value, index) => box(25 + index % 4 * 27, 18 + Math.floor(index / 4) * 24, value, index === 5))}<path d="M18 18H12V88H18M140 18H146V88H140" /></>;
      break;
    case 'rsa':
      diagram = <>{label(39, 30, 'p = 61')}{label(119, 30, 'q = 53')}<path d="M39 39V49L79 64M119 39V49L79 64" /><circle cx="79" cy="65" r="4" fill={accent} stroke={accent} />{label(79, 88, 'n = 3233', accent)}</>;
      break;
    case 'ecc': {
      const points = Array.from({ length: 90 }, (_, index) => {
        const x = -1.324717957 + index * (2.3 + 1.324717957) / 89;
        const y = Math.sqrt(Math.max(0, x ** 3 - x + 1));
        return { x: 55 + x * 27, y: y * 15 };
      });
      const curve = (side: number): string => points.map((point, index) => `${index ? 'L' : 'M'}${point.x.toFixed(2)} ${(56 + point.y * side).toFixed(2)}`).join(' ');
      diagram = <><path d="M12 56H149M55 103V9" opacity=".4" /><path d={curve(-1)} /><path d={curve(1)} /><path d="M15 41H142" stroke={accent} /><circle cx="55" cy="41" r="3.5" fill={accent} /><circle cx="82" cy="41" r="3.5" fill={accent} />{label(54, 30, 'P')}{label(83, 30, 'Q')}{label(104, 103, 'y² = x³ − x + 1')}</>;
      break;
    }
    case 'hashing':
      diagram = <><path d="M11 30H50M11 48H50M11 66H50M110 48H150" /><path d="M50 17H91L110 48L91 79H50Z" fill="none" /><path d="M71 27V69M81 27V69M63 39H89M63 56H89" stroke={accent} />{label(30, 90, 'message')}{label(130, 68, '256 bit')}</>;
      break;
    case 'hmac':
      diagram = <><rect x="18" y="44" width="48" height="26" /><rect x="93" y="44" width="48" height="26" /><path d="M66 57H93M42 23V44M117 23V44M42 23H117M117 70V89" stroke={accent} />{label(42, 61, 'ipad')}{label(117, 61, 'opad')}{label(79, 18, 'key')}{label(117, 103, 'MAC')}</>;
      break;
    case 'signatures':
      diagram = <><path d="M24 18H73L88 33V89H24ZM73 18V33H88M34 43H72M34 52H65M34 61H73" /><path d="M39 77C48 57 48 91 60 72C63 66 59 88 75 72" stroke={accent} /><circle cx="119" cy="61" r="19" /><path d="M109 61L116 68L130 52" stroke={accent} /></>;
      break;
    case 'diffie-hellman':
      diagram = <><circle cx="30" cy="26" r="11" /><circle cx="130" cy="26" r="11" /><path d="M30 37V89M130 37V89M43 49H116M37 69H111M110 45L116 49L110 53M43 65L37 69L43 73" />{label(30, 105, 'Alice')}{label(130, 105, 'Bob')}{label(80, 39, 'gᵃ mod p', accent)}{label(80, 88, 'gᵇ mod p', accent)}</>;
      break;
    case 'block-modes':
      diagram = <>{[15, 68, 121].map((x, i) => <g key={x}>{box(x, 47, `C${i + 1}`)}<path d={`M${x + 12} 24V47M${x + 12} 69V89`} />{i < 2 && <path d={`M${x + 25} 58H${x + 38}V35H${x + 65}`} stroke={accent} />}</g>)}</>;
      break;
    case 'padding':
      diagram = <>{['48', '65', '6c', '6c', '6f', '03', '03', '03'].map((value, index) => box(26 + index % 4 * 27, 27 + Math.floor(index / 4) * 24, value, index >= 5))}{label(80, 96, 'PKCS#7 · +3 bytes')}</>;
      break;
    case 'password-hashing':
      diagram = <><rect x="23" y="39" width="39" height="28" />{label(43, 57, 'salt')}<path d="M62 53H85M95 34C133 13 153 79 113 84C85 88 75 66 86 48M95 34L96 47L108 42" stroke={accent} />{label(117, 60, 'cost')}{label(43, 90, 'password')}</>;
      break;
    case 'tls':
      diagram = <><path d="M26 15V99M134 15V99M26 28H134M134 48H26M26 69H134M134 89H26" /><path d="M125 23L134 28L125 33M35 43L26 48L35 53M125 64L134 69L125 74M35 84L26 89L35 94" stroke={accent} />{label(80, 23, 'ClientHello')}{label(80, 43, 'ServerHello')}{label(80, 64, 'Finished')}{label(80, 84, 'Application data')}</>;
      break;
    default:
      diagram = <>{[24, 37, 18, 59, 33, 72, 27, 45, 20, 52, 31].map((height, i) => <path key={i} d={`M${24 + i * 11} 87V${87 - height}`} stroke={i === 5 ? accent : 'currentColor'} strokeWidth="5" />)}<path d="M14 88H153" />{label(80, 105, 'letter frequency')}</>;
  }
  return <svg className={`topic-glyph topic-glyph--${slug}`} viewBox="0 0 160 112" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true" focusable="false" style={{ fontFamily: 'var(--font-mono)' }}>{diagram}</svg>;
};
