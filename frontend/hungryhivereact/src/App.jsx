import Dashboard from './Pages/Index/Dashboard';
import store from './redux-toolkit/store';
import {Provider} from 'react-redux';

function App() {

  return (
    <Provider store={store}>
      <Dashboard/>
    </Provider>
  )
}

export default App
