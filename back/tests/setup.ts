/// <reference types="vite/client" />
// Lists every Convex module so convex-test can run them. Tests live outside convex/ so they are never deployed.
export const modules = import.meta.glob(["../convex/**/*.ts","../convex/**/*.js","!../convex/**/*.d.ts","!../convex/**/*.config.ts"]);
