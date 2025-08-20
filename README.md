# PageCrafter - AI-Powered Static Web App Creator

PageCrafter is a powerful tool that allows you to create static web applications (HTML, CSS, JavaScript) using AI assistance. Simply describe what you want to build in natural language, and the AI will generate the complete code for you.

## Features

- 🤖 **AI-Powered Generation**: Uses Google's Gemini API to generate HTML, CSS, and JavaScript
- 💬 **Interactive Chat Interface**: Chat with AI to describe and refine your web applications
- 👀 **Live Preview**: See your generated web app in real-time
- 📱 **Responsive Design**: Generated apps are mobile-friendly and responsive
- 🎨 **Modern UI**: Clean, intuitive interface with code viewing tabs
- ⚡ **Fast Generation**: Quick response times for code generation

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Get Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the API key

### 3. Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` and replace `your_gemini_api_key_here` with your actual Gemini API key:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to start using PageCrafter!

## How to Use

1. **Start a Conversation**: Type your request in the chat panel on the left side
2. **Describe Your Vision**: Tell the AI what kind of web page you want to create
3. **View the Result**: The generated code will appear in the preview panel on the right
4. **Iterate and Refine**: Ask for modifications, additions, or improvements
5. **View Code**: Click the HTML, CSS, or JS tabs to see the generated code

## Example Prompts

- "Create a landing page for a coffee shop with a hero section and menu"
- "Build a todo list app with add, delete, and mark complete functionality"
- "Make a portfolio website with a projects section and contact form"
- "Create a calculator with a modern design"
- "Build a weather dashboard with cards and animations"

## Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **AI**: Google Gemini API
- **Deployment**: Vercel-ready

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── generate/
│   │       └── route.ts          # Gemini API integration
│   ├── components/
│   │   ├── ChatPanel.tsx         # Chat interface
│   │   └── PreviewPanel.tsx      # Code preview and iframe
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # App layout
│   └── page.tsx                  # Main page component
```

## Contributing

Feel free to contribute to this project by:
- Reporting bugs
- Suggesting new features
- Submitting pull requests
- Improving documentation

## License

This project is open source and available under the MIT License.
