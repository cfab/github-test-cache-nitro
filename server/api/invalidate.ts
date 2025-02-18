export default defineEventHandler(async (event) => {
  // Get query parameters
  const query = getQuery(event);

  const type = query.type as string; // 'all', 'movies', 'events', 'products', etc.

  const cacheTypes = {
    time: 'time:time:time.json',
    //   events: "Objects:events:allEvents.json",
    //   collections: "Objects:collections:allCollections.json",
    //   products: "Objects:products:allProducts.json",
    //   tags: "Objects:tags:allTags.json",
    //   meta: "Objects:meta:allMeta.json",
  };

  try {
    const storage = useStorage('cache');

    if (!type || type === 'all') {
      // Invalidate all caches
      await Promise.all(
        Object.values(cacheTypes).map((key) => storage.removeItem(key))
      );
      return {
        success: true,
        message: 'All caches invalidated',
        invalidated: Object.keys(cacheTypes),
      };
    }

    // Handle multiple types: ?type=movies,events
    const typesToInvalidate = type.split(',');
    const invalidatedKeys = [];

    for (const t of typesToInvalidate) {
      if (cacheTypes[t]) {
        await storage.removeItem(cacheTypes[t]);
        invalidatedKeys.push(t);
      }
    }

    if (invalidatedKeys.length === 0) {
      return {
        success: false,
        message: `Invalid cache type(s): ${type}`,
        validTypes: Object.keys(cacheTypes),
      };
    }

    return {
      success: true,
      message: `Cache invalidated for: ${invalidatedKeys.join(', ')}`,
      invalidated: invalidatedKeys,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error invalidating cache',
      error: error.message,
    };
  }
});
