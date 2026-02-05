# SharePoint Design Tools

A modern React application for designing SharePoint glassmorphism effects and image optimization tools.

## Features

- **Glass Studio**: Create and customize glassmorphism effects for SharePoint components
- **Image Tools**: Resize, upscale, and optimize images for SharePoint web parts
- **Live Preview**: Real-time preview with SharePoint-themed backgrounds
- **Export Options**: Download PNG assets and copy CSS code

## Development

### Using Docker (Recommended)

This project includes Docker configuration to avoid system-level issues like file watcher limits.

#### Prerequisites
- Docker
- Docker Compose

#### Configuration
You can change the dev server port used by docker-compose via the `DEV_PORT` environment variable. Create a `.env` file from `.env.example` and set `DEV_PORT` to the desired port (default is 4173).

#### Quick Start
```bash
# Development with hot reload (builds locally)
npm run docker:dev
# or
docker-compose up --build

# Production using published image
npm run docker:prod
# or
docker-compose -f docker-compose.prod.yml up

# Access the application at http://localhost:${DEV_PORT:-4173}
```

#### Other Docker Commands
```bash
# Build production image locally
npm run docker:build

# Run production container locally
npm run docker:run

# Stop development containers
npm run docker:down

# Stop production containers
docker-compose -f docker-compose.prod.yml down
```

### Development vs Production Docker

- **`docker-compose.yml`** (Development): Builds locally with source code mounted for hot reload
- **`docker-compose.prod.yml`** (Production): Uses published Docker Hub image for production deployment

Use development for coding, production for deployment.

### Local Development (Alternative)

If you prefer local development:

#### Prerequisites
- Node.js 20+
- npm or yarn

#### Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

#### File Watcher Issue (Linux)
If you encounter `ENOSPC: System limit for number of file watchers reached`, run:
```bash
sudo sysctl -w fs.inotify.max_user_watches=524288
echo 'fs.inotify.max_user_watches=524288' | sudo tee -a /etc/sysctl.conf
```

## Tech Stack

- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Docker** for containerization

## Project Structure

```
src/
├── components/
│   └── SharePointGlassStudio.tsx  # Main application component
├── App.tsx                       # Root component
├── main.tsx                      # Entry point
└── index.css                     # Global styles with Tailwind
```

## Docker Architecture

The Docker setup uses multi-stage builds for optimal image size:

1. **deps**: Installs dependencies
2. **builder**: Builds the application
3. **runner**: Runs the production build with minimal footprint

## Repository & CI/CD

### GitHub Repository
This project is set up for automated Docker publishing via GitHub Actions.

#### Initial Setup
1. Create a new repository on GitHub named `spdt`
2. Run the setup script:
   ```bash
   ./setup-repo.sh
   ```
   Or manually:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/spdt.git
   git push -u origin main
   ```

#### Docker Hub Integration
The repository includes GitHub Actions that automatically build and push Docker images to Docker Hub on every push to the `main` branch.

**Required GitHub Secrets:**
- `DOCKERHUB_USERNAME`: Your Docker Hub username
- `DOCKERHUB_TOKEN`: Docker Hub access token (create at https://hub.docker.com/settings/security)

Once configured, images will be available as:
- `yourusername/spdt:latest`
- `yourusername/spdt:main` (on main branch)
- `yourusername/spdt:main-<commit-sha>` (specific commits)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

MIT License - see LICENSE file for details.