# broWorks Dev-Caddy ⛳

**Your Essential Developer Companion.**
Dev-Caddy is a local-first dashboard to organize, execute, and manage your most used CLI commands, LLM prompts, and workflows.

![Dev-Caddy Screenshot](public/logo.png)

## 🚀 Features

- **⚡ Instant Access**: Search and copy commands with one click.
- **📂 Categorization**: Organize items into custom categories.
- **✨ Zen Mode**: A unified Single Page Interface for browsing and editing.
- **🛠️ Edit Mode**: Toggle "Modo Edición" to enable drag-and-drop reordering and full management.
- **💾 Local First**: Data persists locally. Export/Import your JSON configuration anytime.
- **🎨 Modern UI**: Built with Shadcn UI and Tailwind CSS for a premium dark-mode experience.

## 🛠️ Usage

### 1. View Mode (Default)
- **Browse**: Click categories in the sidebar.
- **Search**: Use the global search bar (Ctrl+K).
- **Execute**: Click a command card to copy it to clipboard.
- **Fill Variables**: If a command has `{variables}`, fill them in directly on the card before copying.

### 2. Edit Mode (Admin)
Toggle the **Lock/Unlock** switch in the Sidebar to enter Edit Mode.
- **Reorder**: Drag categories and commands to organize them.
- **Create**: Use the floating "+" button to add new Commands or Prompts.
- **Manage**: Use the "..." menu on cards or categories to Edit or Delete.

## 🏗️ Architecture
Dev-Caddy is a Next.js 14 SPA. It uses `Zustand` for state management and `@dnd-kit` for interactions.
Check `docs/ARCHITECTURE.md` for details.

## 📦 Installation

```bash
git clone https://github.com/pedropablo-dev/broworks-dev-caddy
cd broworks-dev-caddy
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🤝 Contributing
1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---
Built with ❤️ by [PedroPablo.dev](https://pedropablo.dev)