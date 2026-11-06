import { createContext, useCallback, useContext, useLayoutEffect, useMemo, useRef, useState } from 'react';

const TipContext = createContext(null);

// Tooltip state lives here, so moving the mouse never re-renders the rest of the app.
export function TipProvider({ children }) {
  const [tip, setTip] = useState({ show: false, content: null, x: 0, y: 0 });
  const ref = useRef(null);

  const hide = useCallback(() => setTip((t) => (t.show ? { ...t, show: false } : t)), []);
  const show = useCallback((content, x, y) => setTip({ show: true, content, x, y }), []);

  useLayoutEffect(() => {
    if (!tip.show) return;
    const r = ref.current.getBoundingClientRect();
    const top = tip.y - r.height - 12;
    ref.current.style.left = `${Math.min(window.innerWidth - r.width - 8, Math.max(8, tip.x + 14))}px`;
    ref.current.style.top = `${top < 8 ? tip.y + 16 : top}px`;
  }, [tip]);

  const value = useMemo(() => {
    const bind = (content) => ({
      onMouseMove: (e) => show(content, e.clientX, e.clientY),
      onMouseLeave: hide,
      onFocus: (e) => {
        const r = e.currentTarget.getBoundingClientRect();
        show(content, r.left + r.width / 2, r.top);
      },
      onBlur: hide,
    });
    return { bind, hide };
  }, [show, hide]);

  return (
    <TipContext.Provider value={value}>
      {children}
      <div id="tip" role="tooltip" ref={ref} className={tip.show ? 'show' : ''}>
        {tip.content}
      </div>
    </TipContext.Provider>
  );
}

export const useTip = () => useContext(TipContext);
