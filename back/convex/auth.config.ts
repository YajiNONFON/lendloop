// Clerk issues the JWTs, Convex verifies them. The domain is set with `npx convex env set`.
export default {providers:[{domain:process.env.CLERK_JWT_ISSUER_DOMAIN!,applicationID:"convex"}]};
