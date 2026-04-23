import { createRemoteJWKSet, jwtVerify, JWTVerifyOptions } from 'jose';
import { withoutTrailingSlash } from './formatter';
import logger from 'lib/logger';

const AUTH0_WELL_KNOWN_URL = `${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`;

const defaultOptions: JWTVerifyOptions = {
  audience: withoutTrailingSlash(process.env.AUTH0_API_ID) || ' ',
  issuer: `${withoutTrailingSlash(process.env.AUTH0_DOMAIN)}/` || ' ',
  algorithms: ['RS256'],
};

const getJWKS = (url: string) => createRemoteJWKSet(new URL(url));

export const verifyJwt = async (jwt: string, remoteJWKSUrl: string, options?: JWTVerifyOptions) => {
  return jwtVerify(jwt.replace('Bearer ', ''), getJWKS(remoteJWKSUrl), options || defaultOptions);
};

export const verifyApiAuthToken = async (token: string) => {
  try {
    if (!token) {
      throw new Error('[auth-validation] Token is not provided');
    }

    const decodedToken = await verifyJwt(token, AUTH0_WELL_KNOWN_URL);
    const invalidAud = !decodedToken?.payload.aud?.includes(process.env.AUTH0_API_ID || ' ');

    if (!decodedToken || invalidAud) {
      throw new Error('[auth-validation] Invalid token ');
    }
  } catch (error: any) {
    logger.error('[auth-validation] Error validating token: ', error);

    throw new Error('[auth-validation] Invalid token');
  }
};

export async function getManagementApiToken(): Promise<any> {
  const payload = {
    client_id: process.env.AUTH0_CLIENT_ID,
    client_secret: process.env.AUTH0_CLIENT_SECRET,
    audience: `${withoutTrailingSlash(process.env.AUTH0_DOMAIN)}/api/v2/`,
    grant_type: 'client_credentials',
  };

  try {
    const response = await fetch(`${withoutTrailingSlash(process.env.AUTH0_DOMAIN)}/oauth/token`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await response.json();

    return data.access_token;
  } catch (error: any) {
    logger.error('Error getting Auth0 Management API Token:', error);
    throw error;
  }
}