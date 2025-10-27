# Contributing to StationBoard

Thank you for your interest in contributing to StationBoard! This document provides guidelines for contributing.

## Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd StationBoard
   ```

2. **Run the setup script**
   ```bash
   ./setup.sh
   ```

3. **Configure credentials**
   - Edit `.env` and add your Network Rail credentials from [datafeeds.networkrail.co.uk](https://datafeeds.networkrail.co.uk/)

4. **Start development**
   ```bash
   # Option 1: Docker (recommended for production-like environment)
   docker-compose up --build
   
   # Option 2: Local development
   # Terminal 1 - Backend
   cd backend && npm run dev
   
   # Terminal 2 - Frontend
   cd frontend && npm run dev
   ```

## Git Workflow

### Branching Strategy

- `main` - Production-ready code
- `feature/*` - New features
- `bugfix/*` - Bug fixes

### Commit Messages

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add station search autocomplete
fix: resolve WebSocket reconnection issue
docs: update README with Docker instructions
style: format code with Prettier
refactor: simplify FlipCharacter animation
```

### Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, well-commented code
   - Follow existing code style
   - Add tests if applicable

3. **Test your changes**
   ```bash
   # Backend
   cd backend && npm run lint && npm run typecheck
   
   # Frontend
   cd frontend && npm run lint && npm run typecheck
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: your descriptive commit message"
   ```

5. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   gh pr create --draft
   ```

6. **Mark PR as ready**
   ```bash
   gh pr ready
   ```

7. **After review and approval**
   ```bash
   gh pr merge
   ```

## Code Style

- **TypeScript**: Strict mode enabled
- **Formatting**: Prettier with configured rules
- **Linting**: ESLint with TypeScript plugin
- **Imports**: Use absolute paths with `@/` prefix in frontend

## Architecture Guidelines

- **Backend**: Keep API logic separate from WebSocket logic
- **Frontend**: Use custom hooks for business logic, keep components presentational
- **Flap Animation**: Maintain smooth 60fps animations, use CSS transforms
- **Real-time**: Handle WebSocket reconnection gracefully

## Security

- **NEVER** commit `.env` files or credentials
- Always validate user input (especially CRS codes)
- Use rate limiting on public endpoints
- Sanitize data before displaying

## Questions?

Feel free to open an issue for questions or suggestions!

