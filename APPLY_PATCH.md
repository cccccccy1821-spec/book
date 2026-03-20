Apply the patch or manually update `package.json`.

If you have `git` available, run:

```powershell
# preview
git apply --check package-json-override.patch
# apply
git apply package-json-override.patch
# then install
npm install
npm audit
```

If you don't have `git`, open `package.json` and add the following block after the `devDependencies` closing brace:

```json
"overrides": {
  "serialize-javascript": "7.0.3"
}
```

Then run:

```powershell
npm install
npm audit
```
