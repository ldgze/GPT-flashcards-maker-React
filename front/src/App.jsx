import { AppFooter } from "./layout/AppFooter";

export default function App() {
  async function testBack() {
    console.log("Calling /api/data...");
    const response = await fetch('/api/data');
    const data = await response.json();
    console.log("Got data: ", data);
  }

  testBack();

  return (
    <div>
      <h1>GPT Flashcards Maker React</h1>
      <div className="card">
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>

      <AppFooter />
      
    </div>
  );
}
