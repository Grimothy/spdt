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
# Start development server with hot reload
npm run docker:dev
# or
docker-compose up --build

# Access the application at http://localhost:${DEV_PORT:-4173}
```

#### Other Docker Commands
```bash
# Build production image
npm run docker:build

# Run production container
npm run docker:run

# Stop development containers
npm run docker:down
```

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

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

MIT License - see LICENSE file for details.