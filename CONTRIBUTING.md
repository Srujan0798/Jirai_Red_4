
# Contributing to Jirai

First off, thank you for considering contributing to Jirai! It's people like you that make the open-source community such an amazing place to learn, inspire, and create.

## 🌟 Ways to Contribute

We welcome contributions of all forms:

- **🐛 Bug Reports**: Found a glitch? Open an issue with reproduction steps.
- **💡 Feature Requests**: Have an idea to make Jirai better? Let us know!
- **📝 Documentation**: Fix typos, improve clarity, or add examples.
- **💻 Code**: Fix bugs, optimize performance, or build new features.
- **🎨 Design**: Improve the UX/UI or create new node themes.

## 🚀 Getting Started

1. **Fork the repository** on GitHub.
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/jirai.git
   cd jirai
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Create a branch** for your feature or fix:
   ```bash
   git checkout -b feat/amazing-new-feature
   ```
5. **Start the dev server**:
   ```bash
   npm run dev
   ```

## 💻 Code Style Guidelines

- **TypeScript**: We use Strict Mode. Avoid `any` whenever possible. Define interfaces in `src/types/`.
- **Formatting**: We use Prettier. Please ensure your code is formatted before submitting.
- **Naming Conventions**:
  - Components: `PascalCase` (e.g., `GraphEngine.tsx`)
  - Hooks: `camelCase` (e.g., `useSearch.ts`)
  - Utils/Functions: `camelCase`
  - Types/Interfaces: `PascalCase`
- **State Management**: Use Zustand stores located in `src/store/`. Avoid prop drilling.

## 📦 Commit Guidelines

We follow the **Conventional Commits** specification. Please prefix your commit messages:

- `feat:` New feature (e.g., `feat: add dark mode toggle`)
- `fix:` Bug fix (e.g., `fix: resolve node overlapping issue`)
- `docs:` Documentation only changes
- `style:` Changes that do not affect the meaning of the code (white-space, formatting, etc)
- `refactor:` A code change that neither fixes a bug nor adds a feature
- `test:` Adding missing tests or correcting existing tests
- `chore:` Changes to the build process or auxiliary tools

## 📥 Pull Request Process

1. **Fill out the PR Template**: When you open a PR, please describe the changes and link any related issues.
2. **Add Screenshots**: If you changed the UI, include before/after screenshots.
3. **Pass Tests**: Ensure `npm run test` passes locally.
4. **Code Review**: Maintainers will review your code within 48 hours. Be open to constructive feedback!
5. **Squash & Merge**: We may squash your commits to keep the history clean.

## 🧪 Testing Requirements

We use **Vitest** for unit tests and **Playwright** for E2E tests.

- **Unit Tests**: Required for logic-heavy utilities and hooks.
- **E2E Tests**: Required for critical user flows (e.g., creating a node, saving a file).
- **Coverage**: Aim to maintain or improve code coverage.

Run tests:
```bash
npm test          # Run unit tests
npm run test:e2e  # Run E2E tests
```

## 🤝 Community Guidelines

- Be respectful and inclusive.
- Constructive criticism is welcome; harassment is not.
- Help others learn and grow.

## 📄 License

By contributing, you agree that your contributions will be licensed under its MIT License.
