import * as core from '@actions/core'
import API from './api.js'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const deleteBetaGroupNameRegex: string = core.getInput('delete-name-regex')
    const deleteBetaGroupNameRegexOption: string = core.getInput(
      'delete-name-regex-option'
    )
    const betaGroupName: string = core.getInput('name', { required: true })
    const setInternalGroup: boolean = core.getBooleanInput('set-internal-group')
    const betaAppId: string = core.getInput('beta-app-id', { required: true })
    const apiPrivateKey: string = core.getInput('api-privatekey', {
      required: true
    })
    const apiIssuerId: string = core.getInput('api-issuerid', {
      required: true
    })
    const apiKeyId: string = core.getInput('api-keyid', { required: true })
    const api = new API(apiIssuerId, apiKeyId, apiPrivateKey)

    let oldBetaGroup: any = {
      attributes: {
        isInternalGroup: setInternalGroup
      }
    }

    if (deleteBetaGroupNameRegex) {
      core.info(
        `Searching for beta group with name "${deleteBetaGroupNameRegex}"`
      )

      const response = await api.fetchBetaGroups(betaAppId)
      const regex = new RegExp(
        deleteBetaGroupNameRegex,
        deleteBetaGroupNameRegexOption
      )
      oldBetaGroup = response.data.find(value =>
        regex.test(value.attributes.name)
      )

      if (!oldBetaGroup) {
        throw new Error('Specified beta group name does not exist')
      }

      const oleBetaGroupName = oldBetaGroup.attributes.name
      core.info(`Deleting beta group with name "${oleBetaGroupName}"`)
      await api.deleteBetaGroup(oldBetaGroup.id)

      core.setOutput('deleted-beta-group-name', oleBetaGroupName)
    }

    core.info(`Creating beta group with name "${betaGroupName}"`)
    const createdBetaGroup = await api.createBetaGroup(
      betaGroupName,
      betaAppId,
      oldBetaGroup.attributes?.isInternalGroup
    )

    core.setOutput('id', createdBetaGroup.data.id)
    core.setOutput('name', createdBetaGroup.data.attributes.name)
    core.setOutput(
      'is-internal-group',
      createdBetaGroup.data.attributes.isInternalGroup
    )
    core.setOutput('public-link', createdBetaGroup.data.attributes.publicLink)
    core.setOutput(
      'public-link-enabled',
      createdBetaGroup.data.attributes.publicLinkEnabled
    )
    core.setOutput(
      'public-link-limit',
      createdBetaGroup.data.attributes.publicLinkLimit
    )
    core.setOutput(
      'public-link-limit-enabled',
      createdBetaGroup.data.attributes.publicLinkLimitEnabled
    )
    core.setOutput(
      'feedback-enabled',
      createdBetaGroup.data.attributes.feedbackEnabled
    )
  } catch (error) {
    core.setFailed((error as Error).message)
  }
}
