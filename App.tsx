import React from 'react'
import { Provider } from 'react-redux'
import store from './src/redux/store'
import SpenDingScreen from './src/screen/SpenDingScreen'
const App = () => {
  return (
    <Provider store={store}>
      <SpenDingScreen />
    </Provider>
  )
}
export default App