# Present99 Scripts

Utility scripts for deployment and development.

## 📜 Available Scripts

### Deployment Scripts

#### `git-push.sh`
Push code to GitHub with automatic environment setup.

**Usage:**
```bash
./scripts/git-push.sh
```

**Features:**
- Automatically sets PATH for Cascade compatibility
- Checks git configuration
- Commits changes
- Pushes to GitHub
- Provides helpful error messages

#### `deploy.sh`
Deploy to Vercel manually.

**Usage:**
```bash
./scripts/deploy.sh
```

**Features:**
- Deploys both client and server
- Sets up environment variables
- Provides deployment URLs

### Setup Scripts

#### `setup-git-deployment.sh`
Interactive guide for setting up GitHub deployment.

**Usage:**
```bash
./scripts/setup-git-deployment.sh
```

**Features:**
- Checks git status
- Provides step-by-step instructions
- Links to relevant documentation

#### `push-to-github.sh`
Interactive GitHub push with validation.

**Usage:**
```bash
./scripts/push-to-github.sh
```

**Features:**
- Validates remote configuration
- Handles uncommitted changes
- Interactive prompts
- Authentication guidance

### Environment Configuration

#### `.cascade-env`
Environment configuration for Cascade IDE.

**Usage:**
```bash
source scripts/.cascade-env
```

**Purpose:**
- Sets PATH to include `/usr/local/bin`
- Makes git, node, npm, vercel accessible in Cascade
- Required for running git commands in Cascade terminal

## 🚀 Quick Reference

### Push to GitHub
```bash
./scripts/git-push.sh
```

### Deploy to Vercel
```bash
./scripts/deploy.sh
```

### Setup Git Deployment
```bash
./scripts/setup-git-deployment.sh
```

### Use Git in Cascade
```bash
source scripts/.cascade-env
git status
```

## 🔧 Script Configuration

All scripts include:
- PATH configuration for Cascade compatibility
- Error handling
- Helpful messages
- Exit codes for automation

### PATH Configuration
Each script includes:
```bash
export PATH="/usr/local/bin:/usr/local/sbin:/opt/homebrew/bin:$PATH"
```

This ensures tools are accessible in restricted environments like Cascade.

## 📝 Adding New Scripts

When creating new scripts:

1. **Add to this folder**: `scripts/your-script.sh`
2. **Make executable**: `chmod +x scripts/your-script.sh`
3. **Include PATH setup**:
   ```bash
   #!/bin/bash
   export PATH="/usr/local/bin:/usr/local/sbin:/opt/homebrew/bin:$PATH"
   ```
4. **Add to this README**: Document usage and features
5. **Test in Cascade**: Ensure it works in restricted environment

## 🐛 Troubleshooting

### "command not found: git"
**Solution:** Source the environment file first:
```bash
source scripts/.cascade-env
```

### "Permission denied"
**Solution:** Make script executable:
```bash
chmod +x scripts/your-script.sh
```

### "Remote not configured"
**Solution:** Set up GitHub remote:
```bash
git remote add origin https://github.com/altafr/present99.git
```

## 🔗 Related Documentation

- **Git Setup**: `../docs/GIT_DEPLOYMENT_SETUP.md`
- **Deployment Guide**: `../docs/DEPLOYMENT_GUIDE.md`
- **Cascade Setup**: `../docs/CASCADE_ENVIRONMENT_SETUP.md`

## 💡 Tips

- Run scripts from project root: `./scripts/script-name.sh`
- Use `source` for environment files: `source scripts/.cascade-env`
- Check script output for helpful error messages
- All scripts are safe to run multiple times
