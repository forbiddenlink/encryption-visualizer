import React from 'react';
import { m } from 'framer-motion';
import { Info } from 'lucide-react';

interface AESStateMatrixProps {
  state: number[][];
  title?: string;
  highlightCells?: { row: number; col: number }[];
  showAnimation?: boolean;
  subtitle?: string;
}

export const AESStateMatrix: React.FC<AESStateMatrixProps> = ({
  state,
  title,
  highlightCells = [],
  showAnimation = true,
  subtitle,
}) => {
  const isHighlighted = (row: number, col: number) => {
    return highlightCells.some(cell => cell.row === row && cell.col === col);
  };

  const toHex = (byte: number) => {
    return byte.toString(16).padStart(2, '0').toUpperCase();
  };

  const toBinary = (byte: number) => {
    return byte.toString(2).padStart(8, '0');
  };

  return (
    <div className="space-y-4">
      {title && (
        <div className="space-y-2">
          <h4 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">{title}</h4>
          {subtitle && (
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{subtitle}</p>
          )}
        </div>
      )}
      
      <div className="inline-block glass-card p-6 sm:p-8">
        {/* Column labels */}
        <div className="flex justify-center mb-3 gap-2 sm:gap-3">
          {[0, 1, 2, 3].map((col) => (
            <div key={`col-${col}`} className="w-14 sm:w-16 flex items-center justify-center">
              <span className="text-[10px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 font-mono">Col {col}</span>
            </div>
          ))}
        </div>
        
        <div className="grid grid-rows-4 gap-2 sm:gap-3">
          {state.map((row, rowIndex) => (
            <div key={`row-${rowIndex}`} className="flex items-center gap-2 sm:gap-3">
              {/* Row label */}
              <div className="w-8 sm:w-10 flex items-center justify-end mr-1 sm:mr-2">
                <span className="text-[10px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 font-mono">R{rowIndex}</span>
              </div>
              
              {/* Cells */}
              {row.map((byte, colIndex) => {
                const highlighted = isHighlighted(rowIndex, colIndex);
                
                return (
                  <m.div
                    key={`${rowIndex}-${colIndex}`}
                    initial={showAnimation ? { scale: 0.9, opacity: 0 } : false}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      delay: showAnimation ? (rowIndex * 4 + colIndex) * 0.03 : 0,
                      duration: 0.3,
                      type: "spring",
                      stiffness: 300,
                      damping: 25,
                    }}
                    className={`
                      relative w-14 h-14 sm:w-16 sm:h-16 flex flex-col items-center justify-center rounded-lg text-xs sm:text-sm font-bold
                      transition-all duration-200 group/cell
                      ${
                        highlighted
                          ? 'matrix-cell-highlighted'
                          : 'matrix-cell'
                      }
                    `}
                  >
                    {/* Byte value */}
                    <div className="relative z-10 text-center">
                      <div className={`text-sm sm:text-base font-mono tracking-wider ${highlighted ? 'text-white' : 'text-blue-600 dark:text-blue-300'}`}>
                        {toHex(byte)}
                      </div>
                      <div className={`text-[9px] sm:text-[10px] mt-0.5 ${highlighted ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'}`}>
                        {byte}
                      </div>
                    </div>

                    {/* Tooltip on hover */}
                    <div
                      className={`
                        byte-tooltip absolute z-50 px-3 py-2.5 rounded-lg text-xs font-medium whitespace-nowrap pointer-events-none
                        opacity-0 group-hover/cell:opacity-100 transition-opacity duration-150
                        bg-slate-900 dark:bg-slate-800 text-white border border-slate-700
                        shadow-lg
                        ${colIndex < 2 ? 'left-full ml-2' : 'right-full mr-2'}
                        ${rowIndex < 2 ? 'top-0' : 'bottom-0'}
                      `}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5 pb-1.5 border-b border-slate-700">
                          <Info className="w-3 h-3 text-blue-400" />
                          <span className="font-semibold text-blue-400">Byte Info</span>
                        </div>
                        <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-[11px]">
                          <span className="text-slate-400">Position:</span>
                          <span className="text-white font-mono">[{rowIndex}][{colIndex}]</span>

                          <span className="text-slate-400">Hex:</span>
                          <span className="text-white font-mono">0x{toHex(byte)}</span>

                          <span className="text-slate-400">Binary:</span>
                          <span className="text-white font-mono">{toBinary(byte)}</span>

                          {byte >= 32 && byte < 127 && (
                            <>
                              <span className="text-slate-400">ASCII:</span>
                              <span className="text-white font-mono">'{String.fromCharCode(byte)}'</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </m.div>
                );
              })}
            </div>
          ))}
        </div>
        
        {/* Matrix info footer */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-mono">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
            <span className="font-medium">4×4 State Matrix</span>
          </div>
          <div className="hidden sm:block w-px h-3 bg-slate-200 dark:bg-slate-700"></div>
          <div className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-mono">
            16 bytes (128 bits)
          </div>
          <div className="hidden sm:block w-px h-3 bg-slate-200 dark:bg-slate-700"></div>
          <div className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-mono">
            Column-major order
          </div>
        </div>
      </div>
    </div>
  );
};
