import { Dashboard } from "./pages/Main/Main";
import Layout from "./layout/Layout";
import { Route, Routes } from "react-router";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
      </Route>
    </Routes>
  );
}

export default App;
