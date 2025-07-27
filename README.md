
# 🌐 Portfolio Next.js Responsive Website

A responsive and modern portfolio website built with **Next.js** and **React**, designed for developers, freelancers, or creatives who want to showcase their work professionally. The site includes theme context, responsive layouts, and customizable components.

## 🚀 Features

- ✅ Responsive design for all devices
- 🌙 Light/Dark Mode toggle with context API
- 🧩 Modular components for reusability
- 📁 Clean folder structure (components, pages, styles, lib)
- ⚡ Fast performance with optimized Next.js features
- 🌍 Custom server with Express (server.js)

## 🧾 Project Structure

```
portfolio-next-responsive-updated/
├── components/       # Reusable UI components
├── contexts/         # Theme and app-wide contexts
├── lib/              # Utility functions and libraries
├── pages/            # Next.js pages (routes)
├── styles/           # Global and modular CSS
├── server/           # Backend API or Express setup
├── server.js         # Custom Express server entry point
├── package.json      # Project dependencies and scripts
```

## 🛠️ Setup Instructions

### 1. Clone or Download

```bash
git clone https://github.com/laravelgpt/DevProto.git
cd portfolio-next-responsive-updated
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Start the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production

```bash
npm run build
npm start
```

## 🔧 Customization

- Edit content in `pages/index.js`, `components/`, and `lib/` folders.
- To change the theme logic or toggle behavior, edit `contexts/ThemeContext.js`.
- Update styles in `styles/` as needed.

## 📦 Deployment

You can deploy this app to:

- **Vercel** (recommended for Next.js)
- Netlify
- Any Node.js-compatible hosting (with `server.js`)

## 🧑‍💻 Author

- Name: [Your Name]
- Website: [your-portfolio.com]
- GitHub: [@yourusername]

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
