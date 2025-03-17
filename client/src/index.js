import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import 'antd/dist/reset.css'; // Import stylesheet của Ant Design
import '@ant-design/v5-patch-for-react-19';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>  
  </React.StrictMode>
);
