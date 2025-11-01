import React, { createContext, useContext, useMemo, useState } from 'react';

const AccordionContext = createContext(null);

/**
 * AccordionGroup
 * Provides a context so only one CollapsibleSection within the group is open at a time.
 * Props:
 * - initialActiveId?: string | null
 * - allowCollapse?: boolean (if true, clicking the open section closes it; default true)
 */
export function AccordionGroup({ children, initialActiveId = null, allowCollapse = true, onChange }) {
  const [activeId, setActiveId] = useState(initialActiveId);

  const value = useMemo(() => ({
    activeId,
    setActiveId: (id) => {
      setActiveId((prev) => {
        const next = id;
        if (onChange && next !== prev) onChange(next);
        return next;
      });
    },
    allowCollapse,
  }), [activeId, allowCollapse, onChange]);

  return (
    <AccordionContext.Provider value={value}>
      {children}
    </AccordionContext.Provider>
  );
}

export function useAccordion() {
  return useContext(AccordionContext);
}
