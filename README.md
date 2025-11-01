# Present99 - AI-Powered Presentation Creator

A modern, AI-powered presentation creator inspired by Gamma AI. Create stunning presentations in seconds with intelligent content generation, beautiful layouts, and easy export options.

![Present99](https://img.shields.io/badge/React-19.1-blue) ![Node.js](https://img.shields.io/badge/Node.js-Express-green) ![License](https://img.shields.io/badge/license-MIT-blue)

## ✨ Features

- 🤖 **AI-Powered Content Generation** - Automatically generate presentation content using OpenRouter GPT-4
- 🎨 **AI Image Generation** - Automatic image creation with Replicate Flux for every slide
- 🖼️ **Multiple Layout Templates** - Choose from title, content, two-column, and image-text layouts
- ✏️ **Real-time Editing** - Edit slides with live preview
- 📤 **PDF Export** - Export presentations as high-quality PDFs
- 🎯 **Smart Content** - Topic-relevant slides with contextual images
- 🌙 **Modern Dark UI** - Beautiful, professional interface
- 📱 **Responsive Design** - Works on desktop and mobile devices

## 🚀 Quick Start

### Prerequisites

- Node.js (v22.9.0 or higher)
- npm (v11.4.1 or higher)
- OpenRouter API Key (optional - for GPT-4 content generation)
- Replicate API Token (optional - for Flux image generation)

### Installation

1. **Clone or navigate to the project directory**
   ```bash
   cd present99
   ```

2. **Install dependencies**
   ```bash
   # Install client dependencies
   cd client
   npm install

   # Install server dependencies
   cd ../server
   npm install
   ```

3. **Set up environment variables (Optional)**
   ```bash
   cd server
   cp .env.example .env
   # Edit .env and add your OpenAI API key
   ```

4. **Start the development servers**

   Open two terminal windows:

   **Terminal 1 - Backend Server:**
   ```bash
   cd server
   npm run dev
   ```

   **Terminal 2 - Frontend Client:**
   ```bash
   cd client
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:5173`

## 🎯 Usage

### Creating a Presentation

1. Enter your presentation topic in the input field
2. Select the number of slides (3-15)
3. Choose the tone (Professional, Casual, Academic, Creative, Persuasive)
4. Click "Generate Presentation"
5. Wait for AI to generate your slides

### Editing Slides

- **Edit Content**: Use the properties panel on the right to edit slide titles and content
- **Change Layout**: Click the layout button in the toolbar to switch between layouts
- **Add Slides**: Click the + button to add new slides
- **Delete Slides**: Click the trash icon to remove slides
- **Navigate**: Use arrow buttons or click thumbnails to move between slides

### Exporting

- Click the "Export PDF" button in the toolbar
- Your presentation will be downloaded as a PDF file

## 🏗️ Project Structure

```
present99/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── HomePage.jsx
│   │   │   ├── PresentationEditor.jsx
│   │   │   ├── SlideCanvas.jsx
│   │   │   └── SlideEditor.jsx
│   │   ├── utils/         # Utility functions
│   │   │   └── export.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── server/                # Node.js backend
│   ├── index.js          # Express server with AI integration
│   ├── .env.example      # Environment variables template
│   └── package.json
│
└── README.md
```

## 🔧 Configuration

### AI Integration Setup

To enable full AI features:

1. **OpenRouter (GPT-4 Content Generation)**
   - Get an API key from [OpenRouter](https://openrouter.ai/keys)
   - Add credits to your account (very affordable, ~$0.01 per presentation)

2. **Replicate (Flux Image Generation)**
   - Get an API token from [Replicate](https://replicate.com/account/api-tokens)
   - Add billing information (Flux Schnell is very fast and cheap)

3. **Configure Environment Variables**
   - Create a `.env` file in the `server` directory
   - Add your credentials:
     ```
     OPENROUTER_API_KEY=your_openrouter_key_here
     REPLICATE_API_TOKEN=your_replicate_token_here
     PORT=3001
     ```

**Note:** The app works with mock data if API keys aren't provided, but won't generate images.

## 🎨 Available Layouts

1. **Title Layout** - Perfect for cover slides with main title and subtitle
2. **Content Layout** - Standard bullet point layout for main content
3. **Two Column Layout** - Split content into two columns
4. **Image + Text Layout** - Combine images with text content

## 🛠️ Technologies Used

### Frontend
- React 19.1
- Vite
- Lucide React (Icons)
- Framer Motion (Animations)
- html2canvas (Screenshot capture)
- jsPDF (PDF generation)
- Axios (HTTP client)

### Backend
- Node.js
- Express
- OpenRouter API (GPT-4)
- Replicate API (Flux Schnell)
- CORS
- dotenv

## 📝 API Endpoints

### `POST /api/generate`
Generate a presentation based on topic and preferences.

**Request Body:**
```json
{
  "topic": "Climate Change",
  "slideCount": 5,
  "tone": "professional"
}
```

**Response:**
```json
{
  "slides": [
    {
      "id": "1",
      "type": "title",
      "title": "Climate Change",
      "subtitle": "An AI-Generated Presentation",
      "layout": "title"
    }
  ]
}
```

### `POST /api/enhance`
Enhance slide content with AI.

**Request Body:**
```json
{
  "slideContent": "Original content",
  "instruction": "Make it more engaging"
}
```

### `GET /api/health`
Check server health and AI status.

## 🧪 Testing

Present99 includes a comprehensive test suite to ensure quality:

- **Manual Tests**: 20 detailed test cases in `TEST_SUITE.md`
- **Automated API Tests**: Run with `cd server && npm test`
- **Interactive UI Tests**: Open `client/test-ui.html` in browser
- **Full Documentation**: See `TESTING.md` for complete guide

**Quick test:**
```bash
cd server
npm test
```

See `TEST_SUMMARY.md` for overview of all testing capabilities.

## 🚧 Future Enhancements

- [ ] PowerPoint (.pptx) export
- [ ] Image upload and management
- [ ] Custom themes and color schemes
- [ ] Collaboration features
- [ ] Animation effects
- [ ] Chart and graph integration
- [ ] Template library
- [ ] Cloud storage integration

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Inspired by [Gamma AI](https://gamma.app/)
- Icons by [Lucide](https://lucide.dev/)
- UI design inspired by modern presentation tools

## 📧 Support

For issues and questions, please open an issue on the GitHub repository.

---

**Made with ❤️ using React and Node.js**
