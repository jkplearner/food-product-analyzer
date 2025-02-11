# food-product-analyzer
# NutriScope

NutriScope is a full-stack MERN application designed to analyze food products for nutritional content, health hazards, and suitability for different age groups and genders. It uses AES encryption for password security, k-means clustering for categorization, and Chart.js for data visualization.

## Features

- **Product Analysis**: Analyze food products using image uploads or name inputs.
- **Product Comparison**: Compare the nutritional profiles of two food products.
- **Data Visualization**: Interactive radar and bar charts for detailed analysis.
- **User Authentication**: Secure login and signup system.

## Getting Started

### Prerequisites

- Node.js installed on your system.
- MongoDB Atlas configured for database connectivity.

### Installation

1. Create a react app 
   ```bash
   npx create-react-app nutriscope
   ```
2. Navigate to the project directory:
   ```bash
   cd NutriScope
   ```
3. Swap the files in the repository to the files in the newly created project
4. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

1. Split your terminal into three panels.
2. In the first panel, start the React frontend:
   ```bash
   npm start
   ```
3. In the second panel, start the main backend server:
   ```bash
   node app.js
   ```
4. In the third panel, start the secondary backend server:
   ```bash
   node app2.js
   ```

## Main Page

The main page of NutriScope allows users to upload an image or enter a food product name to receive detailed nutritional analysis. The processed data includes nutrient information, health suitability, and categorized results based on the k-means clustering algorithm.

### How It Works

1. Upload an image or provide the product name.
2. The system analyzes the input using the Gemini API.
3. Results are displayed, showing nutritional values and a category (e.g., High-Protein, High-Carb, Balanced).

## Technologies Used

- **Frontend**: React.js
- **Backend**: Express.js, Node.js
- **Database**: MongoDB Atlas
- **Data Visualization**: Chart.js
- **Algorithms**: AES encryption for passwords, k-means clustering for categorization

---
