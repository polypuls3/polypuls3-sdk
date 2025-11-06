# NPM Publishing Guide for @polypuls3/sdk

## Prerequisites Completed ✅

- [x] SDK configured with actual contract ABIs
- [x] Contract addresses updated (Polygon Amoy)
- [x] Subgraph URLs configured
- [x] TypeScript compilation successful
- [x] Build completed successfully

## Step 1: Create NPM Account (If you don't have one)

1. Visit [https://www.npmjs.com/signup](https://www.npmjs.com/signup)
2. Fill in:
   - Username (e.g., `polypuls3` or your name)
   - Email address
   - Password
3. Verify your email address

## Step 2: Create NPM Organization (For scoped package @polypuls3/sdk)

1. Visit [https://www.npmjs.com/org/create](https://www.npmjs.com/org/create)
2. Organization name: `polypuls3`
3. Choose "Unlimited public packages" (free)

**OR** if `polypuls3` is taken, you have two options:
- Use your own scope (e.g., `@yourname/polypuls3-sdk`)
- Use an unscoped package name (e.g., `polypuls3-sdk`)

To change the package name, update `package.json`:
```json
{
  "name": "polypuls3-sdk"  // or "@yourname/polypuls3-sdk"
}
```

## Step 3: Login to NPM via CLI

```bash
npm login
```

You'll be prompted for:
- Username
- Password
- Email
- One-time password (if 2FA is enabled)

Verify you're logged in:
```bash
npm whoami
```

## Step 4: Verify Package Configuration

Check that everything is ready:

```bash
# View what will be published
npm pack --dry-run

# This should show:
# - dist/ directory
# - README.md
# - package.json
# - But NOT src/, node_modules/, etc.
```

## Step 5: Publish to NPM

### Option A: Publish as Public Package (Recommended)

```bash
npm publish --access public
```

###  Option B: Test Locally First (Recommended)

```bash
# Create a tarball
npm pack

# This creates: polypuls3-sdk-0.1.0.tgz

# Test install in another project:
cd /path/to/test-project
npm install /Users/east/workspace/polygon/polypuls3-sdk/polypuls3-sdk-0.1.0.tgz
```

## Step 6: Verify Publication

After publishing, verify:

1. Visit: `https://www.npmjs.com/package/@polypuls3/sdk`
2. Check that version 0.1.0 is listed
3. Verify README displays correctly
4. Check package files are correct

## Step 7: Test Installation

In a new directory:

```bash
npm install @polypuls3/sdk
```

## Common Issues & Solutions

### Issue: 403 Forbidden
**Solution**: You don't have permission to publish under this scope
- Create your own organization, OR
- Change to unscoped package name

### Issue: 404 Not Found during publish
**Solution**: Organization doesn't exist
- Create the organization first at npmjs.com

### Issue: Package name already exists
**Solution**: Choose a different name
- `@yourname/polypuls3-sdk`
- `polypuls3-polygon-sdk`

### Issue: Need to update version
**Solution**: Update version in package.json
```bash
npm version patch  # 0.1.0 -> 0.1.1
npm version minor  # 0.1.0 -> 0.2.0
npm version major  # 0.1.0 -> 1.0.0
```

## Post-Publishing Checklist

- [ ] Package appears on npmjs.com
- [ ] README renders correctly
- [ ] Can install with `npm install @polypuls3/sdk`
- [ ] TypeScript types are included
- [ ] All exports work correctly

## Next Steps After Publishing

Once published, proceed to creating the Next.js demo project to test the SDK integration!

---

## Quick Reference Commands

```bash
# Login
npm login

# Check login
npm whoami

# Publish
npm publish --access public

# Update version
npm version patch

# Unpublish (within 72 hours only!)
npm unpublish @polypuls3/sdk@0.1.0 --force
```

## Package Information

- **Name**: @polypuls3/sdk
- **Version**: 0.1.0
- **Size**: ~52KB (main), ~50KB (ESM), ~42KB (components)
- **License**: MIT
- **Peer Dependencies**: React 18+, wagmi 2+, viem 2+

---

**Ready to publish!** Run `npm login` then `npm publish --access public`
