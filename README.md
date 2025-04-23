# AI Test Case Generator

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

## Setup Instructions

1. Clone the repository.
2. Ensure all dependencies are installed (if using Node.js, run `npm install`).
3. Open `index.html` in a web browser to view the application.

## Usage Guidelines

- The application allows users to generate test cases in a structured format compatible with Google Sheets.
- Use the sidebar to navigate between generating test cases and viewing the history of submitted prompts.
- The application supports exporting test cases to Excel format.

## Contributing

- Fork the repository and create a new branch for your feature or bug fix.
- Ensure your code follows the project's coding standards.
- Submit a pull request for review.

## License

This project is licensed under the MIT License.
