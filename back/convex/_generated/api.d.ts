/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as shared_auth from "../shared/auth.js";
import type * as shared_errors from "../shared/errors.js";
import type * as shared_hmac from "../shared/hmac.js";
import type * as tools_domain from "../tools/domain.js";
import type * as tools_mutations from "../tools/mutations.js";
import type * as tools_queries from "../tools/queries.js";
import type * as users_domain from "../users/domain.js";
import type * as users_mutations from "../users/mutations.js";
import type * as users_queries from "../users/queries.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "shared/auth": typeof shared_auth;
  "shared/errors": typeof shared_errors;
  "shared/hmac": typeof shared_hmac;
  "tools/domain": typeof tools_domain;
  "tools/mutations": typeof tools_mutations;
  "tools/queries": typeof tools_queries;
  "users/domain": typeof users_domain;
  "users/mutations": typeof users_mutations;
  "users/queries": typeof users_queries;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
