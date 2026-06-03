import { User } from "../../users/entities/user.entity";
import { Role } from "../../users/enums/role.enum";

// ── Base ────────────────────────────────────────────────────────────────────────────────

/** Minimal user identity — shared base for anything that refers to a known user */
interface UserData {
  id: string;
  username: string;
  role: Role;
}

// ─── Request user ─────────────────────────────────────────────────────────────

/** Attached to req.user by Passport after validate() resolves */
export interface CurrentUserData extends UserData {}

// ─── JWT payloads ─────────────────────────────────────────────────────────────

/** Claims encoded inside the access token */
export interface AccessTokenPayload {
  sub: string;
  username: string;
  role: Role;
  tokenVersion: number;
}

// ─── Token response shapes ────────────────────────────────────────────────────

export type AccessToken = {
  access_token: string;
};

/** What AuthService.generateTokens() returns */
// Currently only access tokens, but this is where refresh tokens would go if we add them
export type Tokens = AccessToken;

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Normalizes different user representations into CurrentUserData.
 *
 * Accepts either a decoded JWT access token payload (uses `sub` as id)
 * or a full User entity (uses `id` directly), and maps both to the
 * unified shape that Passport attaches to req.user.
 *
 * @param input - Decoded AccessTokenPayload or a User entity
 * @returns Normalized CurrentUserData for use as req.user
 */
export function toCurrentUserData(payload: AccessTokenPayload): CurrentUserData;
export function toCurrentUserData(user: User): CurrentUserData;
export function toCurrentUserData(
  input: AccessTokenPayload | User,
): CurrentUserData {
  if ('sub' in input) {
    return { id: input.sub, username: input.username, role: input.role };
  }
  return { id: input.id, username: input.username, role: input.role };
}
