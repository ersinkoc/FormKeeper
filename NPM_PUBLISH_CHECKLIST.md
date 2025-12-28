# npm Publish Checklist

## ✅ Pre-Publish Checklist

### 1. Code Quality
- [x] ✅ TypeScript compilation succeeds (`npm run typecheck`)
- [x] ✅ All tests passing (`npm test`)
- [x] ✅ Build successful (`npm run build`)
- [x] ✅ No linting errors (`npm run lint`)

### 2. Package Configuration
- [x] ✅ `package.json` correctly configured
  - [x] Name: `@oxog/formkeeper`
  - [x] Version: `1.0.0`
  - [x] Description: Present
  - [x] Keywords: Present
  - [x] Repository: Configured
  - [x] Homepage: `https://formkeeper.oxog.dev`
  - [x] License: MIT
  - [x] Author: Ersin KOÇ
  - [x] Files array: `["dist", "README.md", "LICENSE", "CHANGELOG.md"]`
  - [x] Main/Module/Types: Configured
  - [x] Exports: All entry points configured

### 3. Required Files
- [x] ✅ `README.md` - Complete and up-to-date
- [x] ✅ `CHANGELOG.md` - Version 1.0.0 documented
- [x] ✅ `LICENSE` - MIT license present
- [x] ✅ `dist/` - Built files present

### 4. Build Output
- [x] ✅ ESM builds (`.js`)
- [x] ✅ CJS builds (`.cjs`)
- [x] ✅ Type declarations (`.d.ts`, `.d.cts`)
- [x] ✅ Source maps (`.map`)
- [x] ✅ All entry points built:
  - [x] Main (`dist/index.*`)
  - [x] Plugins (`dist/plugins/index.*`)
  - [x] React (`dist/react/index.*`)
  - [x] Vue (`dist/vue/index.*`)
  - [x] Svelte (`dist/svelte/index.*`)

### 5. Documentation
- [x] ✅ README links updated to use `docs/` paths
- [x] ✅ Online documentation available at formkeeper.oxog.dev
- [x] ✅ API documentation complete
- [x] ✅ Examples provided

### 6. Version Control
- [x] ✅ All changes committed
- [x] ✅ Working directory clean
- [ ] ⏳ Git tag created (`git tag v1.0.0`)
- [ ] ⏳ Changes pushed to GitHub

### 7. npm Configuration
- [ ] ⏳ Logged into npm (`npm whoami`)
- [ ] ⏳ Organization access verified
- [ ] ⏳ 2FA configured (recommended)

### 8. Package Verification
- [x] ✅ Dry run completed (`npm pack --dry-run`)
- [x] ✅ Package contents verified
- [x] ✅ Package size reasonable (~700KB with source maps)

## 📦 Package Contents

```
@oxog/formkeeper@1.0.0
├── CHANGELOG.md          (4.0 KB)
├── LICENSE               (1.1 KB)
├── README.md             (4.0 KB)
├── package.json          (3.0 KB)
└── dist/                 (~700 KB total)
    ├── index.js/cjs      (ESM/CJS builds)
    ├── index.d.ts        (TypeScript definitions)
    ├── plugins/
    ├── react/
    ├── vue/
    └── svelte/
```

## 🚀 Publishing Steps

### Step 1: Final Verification

```bash
# 1. Clean install
rm -rf node_modules package-lock.json
npm install

# 2. Run all checks
npm run typecheck
npm test
npm run build

# 3. Verify package contents
npm pack --dry-run
```

### Step 2: Version and Tag

```bash
# Already at version 1.0.0, so skip version bump
# Just create and push tag

git tag v1.0.0
git push origin v1.0.0
```

### Step 3: Publish to npm

```bash
# Option 1: Standard publish
npm publish --access public

# Option 2: Dry run first
npm publish --access public --dry-run

# Option 3: With OTP (if 2FA enabled)
npm publish --access public --otp=123456
```

### Step 4: Verify Published Package

```bash
# Check on npm
open https://www.npmjs.com/package/@oxog/formkeeper

# Install and test
mkdir test-install && cd test-install
npm init -y
npm install @oxog/formkeeper
node -e "console.log(require('@oxog/formkeeper'))"
```

### Step 5: Post-Publish

```bash
# 1. Verify installation
npm info @oxog/formkeeper

# 2. Update documentation website
cd website
npm run build
# GitHub Actions will deploy automatically

# 3. Announce release
# - GitHub Release
# - Twitter/Social media
# - Documentation update
```

## ⚠️ Pre-Publish Notes

### Important Checks

1. **Scope**: Package is scoped (`@oxog/formkeeper`) - requires `--access public`
2. **First Publish**: This is the initial 1.0.0 release
3. **Breaking Changes**: N/A (first release)
4. **Peer Dependencies**: React, Vue, Svelte marked as optional

### What Gets Published

✅ **Included**:
- `dist/` folder (built files)
- `README.md`
- `LICENSE`
- `CHANGELOG.md`
- `package.json`

❌ **Excluded** (via `.npmignore`):
- `src/` (source files)
- `tests/` (test files)
- `website/` (documentation site)
- `docs/` (markdown docs)
- `.github/` (GitHub Actions)
- Config files
- Development files

### Package Size

- **Total**: ~700 KB (with source maps)
- **Minified + Gzipped**: < 5 KB (as advertised)
- **Source maps**: Can be excluded in future versions if needed

## 🔐 Security

### Recommended Setup

```bash
# Enable 2FA
npm profile enable-2fa

# Verify profile
npm profile get

# Set up publish OTP
npm publish --access public --otp=YOUR_OTP
```

## 📊 Post-Publish Checklist

After successful publish:

- [ ] Verify package on npmjs.com
- [ ] Test installation in clean project
- [ ] Create GitHub Release
- [ ] Update documentation website
- [ ] Announce on social media
- [ ] Monitor npm download stats
- [ ] Watch for issues/bug reports

## 🎯 Quick Publish Command

```bash
# All-in-one publish command
npm run build && npm publish --access public
```

## 🚨 Troubleshooting

### Common Issues

1. **Authentication Error**
   ```bash
   npm login
   npm whoami
   ```

2. **Permission Denied**
   ```bash
   # Verify organization membership
   npm org ls @oxog
   ```

3. **Version Exists**
   ```bash
   # Bump version
   npm version patch
   git push && git push --tags
   ```

4. **Build Failures**
   ```bash
   # Clean and rebuild
   rm -rf dist node_modules
   npm install
   npm run build
   ```

## 📚 Resources

- [npm Publishing Guide](https://docs.npmjs.com/cli/v9/commands/npm-publish)
- [Scoped Packages](https://docs.npmjs.com/cli/v9/using-npm/scope)
- [Semantic Versioning](https://semver.org/)

---

**Status**: ✅ Ready for publish!
**Next Action**: Run `npm publish --access public`
