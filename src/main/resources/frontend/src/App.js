import React, {Component} from 'react';
import AppRouter from './router/appRouter';
import Login from './user/login/login';

class App extends Component{
  constructor(props){
    super(props);
  }

  render(){
    return (
      <>
        <Login />
        <AppRouter />
      </>
    )
  }
}

export default App;
