
# 运行本项目
> npm install  
> npm start


# 手摸手带你撸redux：二阶(拆分actionCreators和actionTypes)
先说一下redux的工作流程。
- 第一步，创建一个store，相当于一个数据仓库；
- 第二步，React Component根据store里面的state显示UI；
- 第三步，React Component根据需求派发action给store。(dispatch(action))；
- 第四步，store根据React Component派发的action去reducer里面找对应的操作；
- 第五步，reducer告诉store怎么操作数据；
- 第六步，store更新state；
- 第七步，React Component根据store中的state更新UI；

## 1-安装redux-thunk
> npm install redux-thunk --save

redux-thunk 是redux的中间件 可以把异步请求梵高action里面

## 2-创建store
--|src  
----|store  
------|actionCreators.js
------|actionTypes.js
------|index.js  
------|reucer.js

> actionCreators.js是单独创建action的文件  
> actionTypes.js是存放actio 类型的文件
> index.js 是创建store  
> reducer.js 是告诉store怎么处理数据

### 2.1 - index.js
```js
import { createStore, applyMiddleware, compose } from 'redux'; 
import reducer from './reducer';
import thunk from 'redux-thunk';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?   
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) : compose;

const enhancer = composeEnhancers(
  applyMiddleware(thunk)
);
// 使用两个中间件，一个redux-thunk，一个redux-dev-tools
const store = createStore(reducer, enhancer);

export default store;

```

### 2.2 - reducer.js
```js
import * as actionTypes from './actionTypes';

const defaultState = {
  list: ['windows', 'mac', 'linux']
}

// reducer 可以接收state，但是不能修改state
export default (state = defaultState, action) => {
  switch (action.type) {
    case actionTypes.CHANGE_LIST:
      const newState = JSON.parse(JSON.stringify(state));
      newState.list = newState.list.concat(action.value);      
      return newState;
    default:
      return state;
  }
}

```
### 2.3 actionCreators.js
```js
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

```

### 2.4 actionTypes.js
```js
export const CHANGE_LIST = 'CHANGE_LIST'
```

## 3 组件中派发action
```js
import React, { Component } from 'react';
import store from './store';
import * as actionCreators from './store/actionCreators';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = store.getState();
    this.getMore = this.getMore.bind(this);
    this.handelStoreChange = this.handelStoreChange.bind(this);
    // 组件订阅store， 当store改变时执行改方法
    store.subscribe(this.handelStoreChange);
  }

  // 当store改变时触发的方法
  handelStoreChange() {
    this.setState(store.getState());
  }

  getMore() {
    // 这里创建的action返回的是一个函数，而不是之前的对象了
    const action = actionCreators.getList();
    // 派发这个action就执行了action中的异步方法
    store.dispatch(action);
  }

  render() {
    return (
      <div className="App">
        <ul>
          {
            this.state.list.map((item, index) => {
              return (
                <li key={index}>{item}</li>
              )
            })
          }
        </ul>
        <button onClick={this.getMore}>请求数据</button>
      </div>
    );
  }
}

export default App;

```

## 总结
本项目是redux把action和actionTypes抽出来了，还有地方可以优化，比如异步请求可以放进actionCreators里面，而不是放在组件里。下一章就使用redux-thunk把异步方法拆分出来

![avatar](./pic/redux1.png);

![avatar](./pic/redux2.png);
