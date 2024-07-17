import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://192.168.1.5:3000/spendings';

export const fetchSpendings = createAsyncThunk(
  'spending/fetchSpendings',
  async () => {
    const response = await axios.get(API_URL);
    console.log('Fetch spendings response:', response.data);
    return response.data;
  },
);

export const addSpenDing = createAsyncThunk(
  'spending/addSpenDing',
  async spending => {
    const response = await axios.post(API_URL, spending);
    return response.data;
  },
);

export const deleteSpenDing = createAsyncThunk(
  'spending/deleteSpenDing',
  async id => {
    await axios.delete(`${API_URL}/${id}`);
    return id;
  },
);

export const updateSpenDing = createAsyncThunk(
  'spending/updateSpenDing',
  async spending => {
    const response = await axios.put(`${API_URL}/${spending.id}`, spending);
    return response.data;
  },
);

const initialState = {
  listSpenDing: [],
  status: 'idle',
  error: null,
};

const spendingSlice = createSlice({
  name: 'spending',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchSpendings.fulfilled, (state, action) => {
        state.listSpenDing = action.payload;
        console.log('Fetched spendings:', action.payload);
        state.status = 'succeeded';
      })
      .addCase(fetchSpendings.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchSpendings.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
        console.error('Fetch spendings failed:', action.error.message);
      })
      .addCase(addSpenDing.fulfilled, (state, action) => {
        console.log('Added spending:', action.payload);
        state.listSpenDing.push(action.payload);
      })
      .addCase(deleteSpenDing.fulfilled, (state, action) => {
        console.log('Deleted spending:', action.payload);
        state.listSpenDing = state.listSpenDing.filter(
          spending => spending.id !== action.payload,
        );
      })
      .addCase(updateSpenDing.fulfilled, (state, action) => {
        console.log('Updated spending:', action.payload);
        const {id, title, mota, ngaythu, ngaychi, loaithuchi, sotien} =
          action.payload;
        const spending = state.listSpenDing.find(
          spending => spending.id === id,
        );
        if (spending) {
          spending.title = title;
          spending.mota = mota;
          spending.ngaythu = ngaythu;
          spending.ngaychi = ngaychi;
          spending.loaithuchi = loaithuchi;
          spending.sotien = sotien;
        }
      });
  },
});

export default spendingSlice.reducer;
