# Create TestFlight Beta group

[![GitHub Super-Linter](https://github.com/actions/typescript-action/actions/workflows/linter.yml/badge.svg)](https://github.com/super-linter/super-linter)
![CI](https://github.com/actions/typescript-action/actions/workflows/ci.yml/badge.svg)
[![Check dist/](https://github.com/actions/typescript-action/actions/workflows/check-dist.yml/badge.svg)](https://github.com/actions/typescript-action/actions/workflows/check-dist.yml)
[![Coverage](./badges/coverage.svg)](./badges/coverage.svg)

GitHub Actions for creating or recreate the TestFlight beta group.

## Usage

Before use the actions, you need to create [AppStoreConnect API Key](https://appstoreconnect.apple.com/access/api).

After creating the API Key, store the App ID in an environment variable;  
store the API Issuer ID, API Key ID, and API Private Key in Repository Secrets.

### Create a beta group

You can create a beta group for TestFlight with the name specified in the `name` key.

A `set-internal-group` key of true will create a beta group for internal tests; false or none will create a beta group for external tests.

```yaml
jobs:
  create-beta-group:
    runs-on: ubuntu-latest
    steps:
      - uses: nekowen/create-testflight-beta-group@v1
        id: create-testflight-beta-group
        with:
          name: 'HogeApp Beta Test'
          set-internal-group: true # Optional
          app-id: ${{ vars.APP_ID }}
          api-issuerid: ${{ secrets.API_ISSUER_ID }}
          api-keyid: ${{ secrets.API_KEY_ID }}
          api-privatekey: ${{ secrets.API_PRIVATE_KEY }}
      - run: echo "$CREATED_BETA_GROUP_ID"
        env:
          CREATED_BETA_GROUP_ID: ${{ steps.create-testflight-beta-group.outputs.id }}
```

### Recreate a beta group

You can re-create a beta group for TestFlight with the specified `delete-name-regex` key.  
This feature is useful when you want to periodically clean up your beta groups or make changes to your public links.

`delete-name-regex` key is used to identify the original beta group name to be deleted. Regular expressions can be used for this key.

`delete-name-regex-option` is an optional key. The regular expression option can be specified.

> [!WARNING]
> If no matching beta group name, Actions returns an error

```yaml
jobs:
  create-beta-group:
    runs-on: ubuntu-latest
    steps:
      - uses: nekowen/create-testflight-beta-group@v1
        id: create-testflight-beta-group
        with:
          delete-name-regex: 'HogeApp' # Optional
          delete-name-regex-option: 'i' # Optional
          name: 'HogeApp Beta Test v1.0.0'
          app-id: ${{ vars.APP_ID }}
          api-issuerid: ${{ secrets.API_ISSUER_ID }}
          api-keyid: ${{ secrets.API_KEY_ID }}
          api-privatekey: ${{ secrets.API_PRIVATE_KEY }}
      - run: echo "$DELETED_BETA_GROUP_NAME"
        env:
          DELETED_BETA_GROUP_NAME: ${{ steps.create-testflight-beta-group.outputs.deleted-beta-group-name }}
```

## Outputs

**`id`**  
The ID of the created beta group

**`name`**  
The name of the created beta group

**`is-internal-group`**  
The isInternalGroup of the created beta group

**`public-link`**  
The publicLink of the created beta group

**`public-link-enabled`**  
The publicLinkEnabled of the created beta group

**`public-link-limit`**  
The publicLinkLimit of the created beta group

**`public-link-limit-enabled`**  
The publicLinkLimitEnabled of the created beta group

**`feedback-enabled`**  
The feedbackEnabled of the created beta group

**`feedback-enabled`**  
The feedbackEnabled of the created beta group

**`deleted-beta-group-name`**  
The name of the beta group that was deleted

## License

Distributed under the MIT License. See [LICENSE](https://github.com/nekowen/StructCopyMacro/blob/main/LICENSE) for more information.
