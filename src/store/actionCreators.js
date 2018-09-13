import * as actionTypes from './actionTypes';
import axios from 'axios';

export const changeList = (value) => ({
  type: actionTypes.CHANGE_LIST,
  value
})

export const getList = () => {
  // 这个action返回的是一个异步函数
  return (dispatch) => {
    axios.get('/api/list.json').then((res) => {
      dispatch(changeList(res.data.data));
    }).catch((err) => {
      console.log(err);
    })
  }
}
