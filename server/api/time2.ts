let time = defineCachedFunction(
  async (event) => {
    const time = new Date();
    return time.toLocaleString();
  },
  {
    maxAge: 40, // 30 seconds
    group: "time",
    name: "time",
    getKey: () => "time",
    shouldBypassCache: (event) => {
      const { preview } = getQuery(event);
      return preview === "true";
    },
  }
);

export default defineEventHandler(async (event) => {
  return time(event);
});
