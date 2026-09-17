import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_portfolio_jwt_key_2026_default';
const secretKey = new TextEncoder().encode(JWT_SECRET);
const COOKIE_NAME = 'admin_token';

/**
 * Sign an admin JWT token with 7 days validity
 */
export async function signAdminToken(payload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secretKey);
}

/**
 * Verify an admin JWT token
 */
export async function verifyAdminToken(token) {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return payload;
  } catch (error) {
    return null;
  }
}

/**
 * Check if the currently authenticated user in request is valid admin
 */
export async function getCurrentAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) return null;

  const payload = await verifyAdminToken(token);
  if (!payload || payload.role !== 'admin') return null;

  return payload;
}

/**
 * Check credentials against authorized admin config
 */
export function validateAdminCredentials(email, password) {
  const authorizedEmail = (process.env.ADMIN_EMAIL || 'shubhamrewamp17@gmail.com').trim().toLowerCase();
  const configuredPassword = process.env.ADMIN_PASSWORD || 'Admin@12345';

  if (!email || !password) {
    return { valid: false, error: 'Email and password are required' };
  }

  if (email.trim().toLowerCase() !== authorizedEmail) {
    return { 
      valid: false, 
      error: 'Access Denied: Only the authorized admin email has access to this dashboard.' 
    };
  }

  // Check if configured password is a bcrypt hash or plaintext
  const isHash = configuredPassword.startsWith('$2a$') || configuredPassword.startsWith('$2b$');
  const passwordMatches = isHash 
    ? bcrypt.compareSync(password, configuredPassword) 
    : password === configuredPassword;

  if (!passwordMatches) {
    return { valid: false, error: 'Invalid password. Please check your credentials.' };
  }

  return { valid: true, email: authorizedEmail };
}

export { COOKIE_NAME };
