
# Contributing to RecallIQ 🧠

Thank you for your interest in contributing to RecallIQ! We're excited to have you as part of our community. This guide will help you get started with contributing to our AI-powered memory assistant.

## 🌟 Code of Conduct

By participating in this project, you agree to abide by our code of conduct:

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Respect different viewpoints and experiences
- Show empathy towards other community members

## 🚀 Getting Started

### Prerequisites

Before contributing, make sure you have:

- Node.js 18+ installed
- npm package manager
- Git for version control
- A Supabase account (for backend development)
- Basic knowledge of React, TypeScript, and Tailwind CSS

### Setting Up Your Development Environment

1. **Fork the repository**
   ```bash
   # Click the "Fork" button on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/recalliq.git
   cd recalliq
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example environment file
   cp .env.example .env.local
   # Fill in your Supabase credentials and API keys
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

## 📝 How to Contribute

### Reporting Bugs 🐛

Before creating a bug report, please check if the issue already exists. If not:

1. Go to the [Issues](https://github.com/Ashutosh102/recalliq/issues) page
2. Click "New Issue" and select "Bug Report"
3. Fill out the template with:
   - Clear description of the bug
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Environment details (browser, OS, etc.)

### Suggesting Features 💡

We love new ideas! To suggest a feature:

1. Check existing issues and discussions
2. Create a new issue with the "Feature Request" template
3. Describe:
   - The problem you're trying to solve
   - Your proposed solution
   - Any alternatives you've considered
   - Why this would benefit other users

### Code Contributions 💻

#### Types of Contributions Welcome

- 🐛 **Bug fixes**
- ✨ **New features**
- 📚 **Documentation improvements**
- 🎨 **UI/UX enhancements**
- ⚡ **Performance optimizations**
- 🧪 **Test coverage improvements**
- 🔧 **Developer experience improvements**

#### Development Workflow

1. **Choose an issue**
   - Check the [Issues](https://github.com/Ashutosh102/recalliq/issues) page
   - Look for issues labeled `good first issue` for beginners
   - Comment on the issue to let others know you're working on it

2. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/bug-description
   ```

3. **Make your changes**
   - Follow our coding standards (see below)
   - Write clear, descriptive commit messages
   - Test your changes thoroughly

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add new memory search filter"
   # Use conventional commit format
   ```

5. **Push and create a Pull Request**
   ```bash
   git push origin your-branch-name
   ```
   - Go to GitHub and create a Pull Request
   - Fill out the PR template
   - Link any related issues

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (shadcn/ui)
│   ├── auth/           # Authentication components
│   ├── dashboard/      # Dashboard-specific components
│   └── ...
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── integrations/       # Third-party integrations
└── contexts/           # React contexts
```

## 🎨 Coding Standards

### TypeScript
- Use TypeScript for all new code
- Define proper types and interfaces
- Avoid `any` types when possible
- Use the existing type definitions in `src/integrations/supabase/types.ts`

### React Best Practices
- Use functional components with hooks
- Follow the existing component patterns
- Keep components small and focused
- Use proper prop types and interfaces

### Styling
- Use Tailwind CSS for styling
- Follow the existing design system
- Use semantic color tokens from `index.css`
- Ensure responsive design for all screen sizes
- Test on mobile, tablet, and desktop

### Code Quality
- Write self-documenting code
- Add comments for complex logic
- Follow the existing file structure
- Use meaningful variable and function names
- Keep functions small and focused

### Commit Messages
We use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new search functionality
fix: resolve memory card rendering issue
docs: update API documentation
style: improve button hover effects
refactor: optimize memory loading hook
test: add unit tests for auth service
```

## 🧪 Testing

### Before Submitting
- Test your changes on different browsers
- Verify responsive design on mobile devices
- Check for console errors
- Test with different user scenarios
- Ensure accessibility standards are met

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- --testNamePattern="YourTestName"
```

## 📋 Pull Request Guidelines

### PR Checklist
- [ ] My code follows the project's coding standards
- [ ] I have tested my changes thoroughly
- [ ] I have updated documentation if necessary
- [ ] My commits follow the conventional commit format
- [ ] I have linked any related issues
- [ ] My changes don't break existing functionality
- [ ] I have added appropriate comments to my code

### PR Template
When creating a PR, please include:

```markdown
## Description
Brief description of what this PR does

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Code refactoring

## Testing
- [ ] I have tested this change locally
- [ ] I have added/updated tests as needed

## Screenshots (if applicable)
Add screenshots for UI changes

## Additional Notes
Any additional information or context
```

## 🔧 Development Tips

### Working with Supabase
- Use the existing database schema and types
- Follow RLS (Row Level Security) patterns
- Test edge functions locally when possible
- Be mindful of API rate limits

### UI/UX Guidelines
- Maintain consistency with existing design
- Use the established color palette and typography
- Ensure accessibility (WCAG guidelines)
- Test on various screen sizes
- Follow glass-morphism design patterns

### Performance Considerations
- Optimize images and media files
- Use React.memo for expensive components
- Implement proper loading states
- Consider lazy loading for large components

## 🆘 Getting Help

### Community Support
- 📧 Email: gotodevashu@gmail.com
- 🐛 GitHub Issues: For bug reports and feature requests
- 💬 Discussions: For general questions and ideas

### Documentation
- [README.md](README.md) - Project overview and setup
- [API Documentation](https://github.com/Ashutosh102/recalliq) - Backend API reference
- [Component Library](src/components/ui/) - UI component documentation

## 🎉 Recognition

Contributors are recognized in several ways:

- Listed in our Contributors section (coming soon)
- Featured in release notes for significant contributions
- Special recognition for first-time contributors
- Opportunity to become a maintainer for consistent contributors

## 📋 Issue Labels

We use these labels to organize issues:

- `good first issue` - Perfect for newcomers
- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Improvements to docs
- `help wanted` - Extra attention is needed
- `priority-high` - Urgent issues
- `ui/ux` - Design-related issues

## 🚀 Release Process

1. Features are developed in feature branches
2. Pull requests are reviewed by maintainers
3. Approved changes are merged to main
4. Releases are tagged and deployed automatically
5. Release notes are generated from conventional commits

---

Thank you for contributing to RecallIQ! Your contributions help make memory management more accessible and powerful for everyone. 🧠✨

**Happy coding!** 🎉
