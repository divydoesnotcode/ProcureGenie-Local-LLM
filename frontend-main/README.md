# ⚛️ ProcureGenie-Local-LLM Frontend

This is the React frontend for the **ProcureGenie-Local-LLM** system. It provides a clean terminal-like and card-based interface for searching and generating procurement vendors.

## 🛠️ Tech Stack
- **React + Vite**
- **Tailwind CSS**
- **Aceternity UI** (Beams, Sparkles, Covers, Sidebar)
- **Httpx** (via API services for backend communication)

## ⚙️ Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment**:
   Create a `.env` if needed, but defaults are usually set to `http://localhost:8000`.

3. **Run Development Server**:
   ```bash
   npm run dev
   ```

## 📂 Structure
- `components/ui/`: Rich UI components and animations.
- `src/api.js`: Axios/Fetch logic to communicate with the FastAPI backend.
- `lib/utils.tsx`: Utility functions for styling.
