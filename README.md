# Replace ssh to token package

This package replaces bitbucket ssh link to https link with credentials in the package.json file.  

## Example

```
"replaceSshToToken": {
    "packages": {
        "page-builder.broker": {
            "link": "git+ssh://git@bitbucket.org:project-phoenix/broker.git#develop"
        },
        "page-builder.shared": {
            "link": "git+ssh://git@bitbucket.org:project-phoenix/shared.git#develop",
            "env": {
                "username": "GIT_USERNAME2"
            }
        }
    },
    "env": {
        "username": "GIT_USERNAME",
        "token": "GIT_TOKEN",
        "releaseBranch": "GIT_RELEASE_BRANCH"
    }
}
```