import * as jsonwebtoken from 'jsonwebtoken'

/**
 * Generate a JWT token for App Store Connect API
 */
export function jwt(
  issuer: string,
  aud = 'appstoreconnect-v1',
  keyId: string,
  privateKey: string,
  scope: string[] = []
): string {
  let header = {}
  if (scope.length > 0) {
    header = { scope: scope }
  }

  return jsonwebtoken.sign(header, privateKey, {
    algorithm: 'ES256',
    expiresIn: '2min',
    issuer: issuer,
    audience: aud,
    keyid: keyId
  })
}
