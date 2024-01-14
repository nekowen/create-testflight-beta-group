import { got } from 'got'
import { jwt } from './jwt.js'

export type SearchParameters = Record<
  string,
  string | number | boolean | null | undefined
>

/**
 * Represents an API client for interacting with the App Store Connect API.
 */
class API {
  private host = 'https://api.appstoreconnect.apple.com'
  private issuer: string
  private keyId: string
  private privateKey: string

  constructor(issuer: string, keyId: string, privateKey: string) {
    this.issuer = issuer
    this.keyId = keyId
    this.privateKey = privateKey
  }

  private url(path: string): string {
    return `${this.host}${path}`
  }

  private scope(path: string, searchParameters: SearchParameters): string {
    const queryString = Object.entries(searchParameters)
      .map(([key, value]) => `${key}=${value}`)
      .join('&')

    if (queryString.length > 0) {
      return `GET ${path}?${queryString}`
    } else {
      return `GET ${path}`
    }
  }

  private async getApiRequest(
    path: string,
    searchParameters: SearchParameters
  ): Promise<any> {
    return new Promise(async (resolve, rejects) => {
      try {
        const token = jwt(this.issuer, undefined, this.keyId, this.privateKey, [
          this.scope(path, searchParameters)
        ])
        const response = await got(this.url(path), {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          searchParams: searchParameters
        }).json()

        resolve(response)
      } catch (error) {
        rejects(error)
      }
    })
  }

  private async postApiRequest(path: string, json: any): Promise<any> {
    return new Promise(async (resolve, rejects) => {
      try {
        const token = jwt(this.issuer, undefined, this.keyId, this.privateKey)
        const response = await got
          .post(this.url(path), {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            json: json
          })
          .json()
        resolve(response)
      } catch (error) {
        rejects(error)
      }
    })
  }

  private async deleteApiRequest(path: string): Promise<any> {
    return new Promise(async (resolve, rejects) => {
      try {
        const token = jwt(this.issuer, undefined, this.keyId, this.privateKey)
        const response = await got
          .delete(this.url(path), {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            }
          })
          .json()

        resolve(response)
      } catch (error) {
        rejects(error)
      }
    })
  }

  /**
   * Fetches all beta groups for the specified app ID.
   */
  async fetchBetaGroups(appId: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await this.getApiRequest('/v1/betaGroups', {
          'filter[app]': appId,
          include: 'app,builds',
          'limit[builds]': 1
        })

        resolve(response)
      } catch (error) {
        reject(error)
      }
    })
  }

  /**
   * Deletes the beta group with the specified ID.
   */
  async deleteBetaGroup(id: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await this.deleteApiRequest(`/v1/betaGroups/${id}`)
        resolve(response)
      } catch (error) {
        reject(error)
      }
    })
  }

  /**
   * Creates a beta group with the specified name.
   */
  async createBetaGroup(
    name: string,
    appId: string,
    isInternalGroup: boolean | undefined
  ): Promise<any> {
    const attributes = {
      name: name
    }
    if (isInternalGroup) {
      attributes['isInternalGroup'] = isInternalGroup
    }

    return new Promise(async (resolve, reject) => {
      try {
        const response = await this.postApiRequest('/v1/betaGroups', {
          data: {
            attributes: attributes,
            relationships: {
              app: {
                data: {
                  id: appId,
                  type: 'apps'
                }
              }
            },
            type: 'betaGroups'
          }
        })

        resolve(response)
      } catch (error) {
        reject(error)
      }
    })
  }
}

export default API
