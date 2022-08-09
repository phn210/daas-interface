# DaaS App

## Usage

### Development

Node version >= 14.17

```
  cp .env.sample .env
  yarn install
  yarn run typechain:build
  yarn dev
```

**Regenerate typechain when adding or updating Contract's ABI**

```
  yarn run typechain:build
```
