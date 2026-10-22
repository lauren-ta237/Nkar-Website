// Subtle heritage-inspired decorative borders for the header and footer.
// Patterns are CSS/SVG based so they repeat responsively across any width.
// variant="boxes"   → alternating gold / cream / brown upright blocks (header)
// variant="diamond" → thin gold diamond-chain line (footer)

// Alternating gold, cream and brown block frieze, matching the header reference.
const BOX_PATTERN =
  'repeating-linear-gradient(90deg, #C5A059 0 8px, #F5E6D3 8px 16px, #7A4D2E 16px 24px)';

const DIAMOND_SVG =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='14' viewBox='0 0 28 14'%3E%3Cg fill='none' stroke='%23D9BC5A' stroke-width='1'%3E%3Cpath d='M0 7 L7 1 L14 7 L7 13 Z'/%3E%3Cpath d='M14 7 L21 1 L28 7 L21 13 Z'/%3E%3C/g%3E%3C/svg%3E\")";

export default function HeritageBorder({ variant = 'boxes', className = '' }) {
  const isBoxes = variant === 'boxes';

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none w-full ${className}`}
      style={{
        height: isBoxes ? '6px' : '14px',
        backgroundColor: isBoxes ? '#0F261D' : 'transparent',
        backgroundImage: isBoxes ? BOX_PATTERN : DIAMOND_SVG,
        backgroundRepeat: isBoxes ? 'repeat' : 'repeat-x',
        backgroundSize: isBoxes ? 'auto' : '28px 14px',
        backgroundPosition: 'center',
      }}
    />
  );
}