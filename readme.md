
# Rawter

A hierarchial router for RawJS projects.

## Installation (Modules)

```
npm install rawter --save
```

## Installation (No modules)

```html
<script src="https://cdn.jsdelivr.net/npm/rawter@1.0.0/rawter.min.js"></script>
```

To get TypeScript typings, first do an npm install:

```
npm install rawter --save-dev
```

Then add the typings to the `include` section of your tsconfig.json file:
```json
{
	"compilerOptions": {
		// ...
	},
	"include": [
		"node_modules/@scrollapp/rawter/*.ts"
	]
}
```

## Usage

For a complete example, see the Rawter.cover.ts file in the repository.
