export default defineCachedEventHandler(
  async (event) => {
    const time = new Date();
    return time.toLocaleString();
  },
  {
    maxAge: 60, // 30 seconds
    swr: true, // Default cache options
    group: 'time',
    name: 'time',
    getKey: () => 'time',
    shouldBypassCache: (event) => {
      const { preview } = getQuery(event);
      return preview === 'true';
    },
  }
);
