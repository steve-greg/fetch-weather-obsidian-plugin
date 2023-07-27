# Fetch Weather Obsidian Plugin

## How to use

-   Clone this repo.
-   Make sure your NodeJS is at least v16 (`node --version`).
-   `npm i` or `yarn` to install dependencies.
-   `npm run dev` to start compilation in watch mode.

## Manually installing the plugin

-   Replace the path in the publish script in the `package.json` file with `VaultFolder/.obsidian/plugins/your-plugin-id/`
-   Run `npm run publish` to build the plugin and copy it to the vault folder.
-   Install the obsidian plugin hot reload if you want to automatically reload the plugin when you make changes.

## API Documentation

See https://github.com/obsidianmd/obsidian-api
