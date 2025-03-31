# NWS Weather Alerts App

This is a **React TypeScript** application that fetches and displays active weather alerts from the **National Weather Service (NWS) API**. Users can **filter** and **sort** alerts while enjoying a clean, responsive UI built with **Tailwind CSS** and **Vite** for fast development.

## 🚀 Features

- 📡 **Fetches real-time weather alerts** from the NWS API
- 🔎 **Filter alerts** based on severity
- 📊 **Sort alerts** by headline, severity, or location
- 🎨 **Responsive design** using Tailwind CSS
- ⚡ **Fast, efficient, and user-friendly UI**
- 🚀 **Built with Vite** for a blazing-fast development experience

## 📁 Project Structure

```
weather-alerts-app/
│── src/
│   ├── main.tsx           # Renders the WeatherAlerts component
│   ├── index.css          # Tailwind CSS styling
│   ├── App.tsx            # Main logic for fetching, displaying, and filtering alerts
│── package.json           # Project dependencies & scripts
│── tsconfig.json          # TypeScript configuration
│── vite.config.ts         # Vite configuration
```

## 🔧 Installation & Setup

1. **Clone the repository**
   ```sh
   git clone https://github.com/yourusername/NWSWeatherApp.git
   cd weather-alerts-app
   ```
2. **Install dependencies**
   ```sh
   npm install
   ```
3. **Start the application** (using Vite)
   ```sh
   npm run dev
   ```
4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🛠 How It Works

### 1️⃣ Fetching Weather Alerts

- Uses `useEffect` to **fetch alerts when the component mounts**.
- Handles **errors** in case of a network failure.
- Formats API data into a **consistent structure**.

### 2️⃣ Filtering & Sorting

- **Filters alerts** based on **severity**.
- **Sorts alerts dynamically** when column headers are clicked.

### 3️⃣ User Interface (Tailwind CSS)

- **Responsive table layout** for readability.
- **Hover effects** on sortable columns.
- **Colored severity levels** for better visibility.

## 🏆 Why This Approach?

- ✅ **Scalable & modular** architecture
- ✅ **TypeScript ensures type safety**
- ✅ **Optimized filtering & sorting logic** for **fast performance**
- ✅ **Clean, modern UI** using Tailwind CSS
- ✅ **Vite provides instant Hot Module Replacement (HMR) for better development**

## 📌 Future Improvements

- 🔹 **Add Pagination** for large datasets
- 🔹 **Enhance Search Filtering** to allow searching by location
- 🔹 **Improve UI with Animations** (e.g., hover effects, loading spinners)

## 📜 License

This project is **open-source** under the MIT License.

---

Enjoy real-time weather alerts with a smooth and modern interface! 🌦️🚀