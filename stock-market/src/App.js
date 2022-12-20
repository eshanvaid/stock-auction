import './App.css';
import Portfolio from './components/Portfolio';
import Home from './components/Home';
import Trade from './components/Trade'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import OrderBook from './components/OrderBook';
import {disableReactDevTools} from '@fvilers/disable-react-devtools';

if(process.env.NODE_ENV === 'production')disableReactDevTools();

function App() {
  return (
    
    <div className='App'>
      <Router>
    <Routes>
        <Route exact path='/' element={<Home />} />
        <Route path='/home' element={<Home />} />
        <Route path='/portfolios' element={<Portfolio />} />
        <Route path='/trade' element={<Trade />} />
        <Route path='/orderbook' element={<OrderBook />} />
    </Routes>
    </Router>
    </div>
  );
}

export default App;
