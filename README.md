# AI Test Case Generator

A powerful tool to automatically generate comprehensive test cases using AI technology. This tool helps QA engineers and developers create structured test scenarios efficiently.

## Features

- AI-powered test case generation
- Export to multiple formats (Excel, Google Sheets)
- Dark/Light theme support
- Chat history tracking
- Custom test case templates
- Bulk test case generation
- Real-time preview

## Project Structure

```
/public
  ├── /css
  │   ├── style.css
  │   ├── themes.css (for light/dark mode styles)
  ├── /js
  │   ├── main.js
  │   ├── api.js (handles API requests)
  │   ├── ui.js (handles UI interactions)
  │   ├── table.js (handles table formatting and exporting)
  ├── /assets
  │   ├── /images
  │   ├── /icons
  ├── /fonts
/src
  ├── /components
  │   ├── sidebar.js
  │   ├── chatHistory.js
  │   ├── testCaseGenerator.js
index.html
README.md
```

## Prerequisites

- Node.js 14.x or higher
- Modern web browser (Chrome, Firefox, Safari)
- Internet connection for AI API calls

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ai-test-generator.git
   cd ai-test-generator
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Add your AI API credentials
4. Start the application:
   ```bash
   npm start
   ```

## Usage Guidelines

### Generating Test Cases

1. Select your test case template from the sidebar
2. Enter your feature description or requirements
3. Click "Generate Test Cases"
4. Review and edit generated test cases
5. Export to your preferred format

### Managing History

- All generated test cases are automatically saved
- Access previous test cases from the History tab
- Filter and search through past generations
- Clone and modify existing test cases

## Configuration

The application can be customized through the `config.json` file:

- API endpoints
- Template formats
- Export settings
- Theme preferences

## Troubleshooting

Common issues and solutions:

- **API Connection Failed**: Check your internet connection and API credentials
- **Export Issues**: Ensure proper file permissions
- **Generation Timeout**: Try reducing the complexity of your input

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Test across different browsers

## Support

For support, please:

1. Check the [FAQ](./docs/FAQ.md)
2. Search existing issues
3. Create a new issue with detailed information

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- OpenAI for API support
- Contributors and testers
- Open source community
