import React, {Component} from 'react';
import AppRouter from './router/appRouter';
import BodyTop from "./top/bodyTop";
import BodyContents from './bodyContents/bodyContents';

class App extends Component{
  constructor(props){
    super(props);
  }

  render(){
    return (
      <>
        <BodyTop />
        <BodyContents />
        <AppRouter />
      </>
    )
  }
}

export default App;
