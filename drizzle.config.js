/** @type { import("drizzle-kit").Config } */
export default {
  schema: "./schema/**.js",
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL,
  },
  out: "./drizzle",
};
