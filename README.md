# Kanban Todo App v2.0

A modern, project-based Kanban todo list application with card view functionality, built with React and Tailwind CSS.

## Features

### ✨ Core Features
- 🎯 **Project-Based Organization**: Create and manage multiple independent projects
- 📋 **Kanban Board**: Classic three-column layout (To Do, In Progress, Done)
- 🗂️ **Card View**: Unique corner-positioned project overview
- 📅 **Date Tracking**: Automatic timestamps and day counters for all tasks
- 📝 **Markdown Export**: Export projects to properly formatted markdown files
- 💾 **Data Persistence**: Automatic saving to browser localStorage

### 🆕 Version 2 Features
- **Project Card View**: View all projects simultaneously in screen corners
- **Project Management**: Create, switch between, and delete projects
- **Enhanced UI**: Beautiful gradient project cards with task summaries
- **Improved Navigation**: Quick project switching from card view

### Task Format Example
```markdown
* [ ] task 1 {Mon. 17 Nov 2025} 1 day
* [x] completed task {Sun. 16 Nov 2025} 2 days
```

## Quick Start

### Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Open browser**: Visit `http://localhost:5173`

### GitHub Pages Deployment

1. **Create a GitHub repository** (must be public for free hosting)
2. **Upload all project files** maintaining the folder structure
3. **Enable GitHub Pages**:
   - Go to repository Settings → Pages
   - Set Source to "GitHub Actions"
4. **Push to main branch** - automatic deployment will start
5. **Visit your site**: `https://yourusername.github.io/repository-name/`

## How to Use

### Basic Usage
1. **Create tasks**: Type in the input field and click "Add Task"
2. **Move tasks**: Use the colored buttons to move tasks between columns
3. **Create projects**: Use "Add Project" to create new project boards
4. **Switch projects**: Use the dropdown to change between projects

### Card View
1. Click "Card View" to see all projects at once
2. Projects appear in screen corners (top-left, top-right, bottom-left, bottom-right)
3. Each card shows:
   - Project name and total task count
   - Summary of tasks in each column (To Do, In Progress, Done)
   - Quick preview of up to 3 tasks per column
4. Click "Open Project" on any card to switch to that project
5. Click "Close Card View" to return to normal kanban view

### Markdown Export
1. Click "Export as Markdown" to download your current project
2. In card view, export includes all projects
3. Files include task details with timestamps and day counters

## Project Structure

```
kanban-todo-app/
├── src/
│   ├── KanbanTodoApp.jsx    # Main React component
│   ├── main.jsx             # React entry point
│   └── index.css            # Tailwind CSS styles
├── .github/
│   └── workflows/
│       └── deploy.yml       # GitHub Actions workflow
├── index.html               # HTML template
├── package.json             # Dependencies and scripts
├── vite.config.js           # Vite configuration
├── tailwind.config.js       # Tailwind CSS configuration
└── postcss.config.js        # PostCSS configuration
```

## Technical Details

- **React 18**: Modern React with hooks
- **Tailwind CSS**: Utility-first CSS framework
- **Vite**: Fast build tool and development server
- **Lucide React**: Beautiful icon library
- **localStorage**: Client-side data persistence
- **GitHub Actions**: Automated deployment

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

Feel free to fork this project and submit pull requests for improvements!

## License

MIT License - feel free to use this project for personal or commercial purposes.
