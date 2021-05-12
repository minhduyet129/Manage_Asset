import axios from 'axios';
import './App.css';
import Index from './Pages/Index';
axios.interceptors.request.use(config => {
    return config;
});
axios.interceptors.response.use(response => {
    return response;
}, error => {
    if (401 === error.response.status) {
        window.location.href = "/Identity/Account/Login?returnUrl=" + window.location.pathname;
    } else {
        return Promise.reject(error);
    }
});

axios.get("/api/users").then(response => console.table(response.data));

function App() {
  return (
    <div className="App">
      <Index/>
    </div>
  );
}

export default App;
