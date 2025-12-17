const logger = {
  log: (level: string, data: any) => {
    // Minimal logger shim — adapt to winston or other logging later
    if (level === 'error') console.error('[logger]', data);
    else if (level === 'warn') console.warn('[logger]', data);
    else console.log('[logger]', data);
  },
};

export default logger;
