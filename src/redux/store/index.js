import {configureStore} from '@reduxjs/toolkit';
import SpenDingReducer from '../reducers/SpenDingReducer';
export default configureStore({
  reducer: {
    listSpenDing: SpenDingReducer,
  },
});
