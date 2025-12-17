import React from 'react';

export const Tabs: React.FC<any> = ({ children, ...props }) => <div className="tabs" {...props}>{children}</div>;
export const TabsList: React.FC<any> = ({ children, ...props }) => <div className="tabs-list" {...props}>{children}</div>;
export const TabsTrigger: React.FC<any> = ({ children, ...rest }) => (
  <button {...rest} className="tabs-trigger">{children}</button>
);
export const TabsContent: React.FC<any> = ({ children, ...props }) => <div className="tabs-content" {...props}>{children}</div>;

export default Tabs;
