import React from 'react';

export const Toaster: React.FC<React.PropsWithChildren<{ position?: string; richColors?: boolean }>> = ({ children }) => (
  <div className="toaster">{children}</div>
);

export default Toaster;
