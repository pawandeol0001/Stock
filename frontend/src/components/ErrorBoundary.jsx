import {Component} from "react";
export default class ErrorBoundary extends Component{
  state={failed:false};
  static getDerivedStateFromError(){return{failed:true};}
  componentDidCatch(e){console.error(e);}
  render(){
    if(!this.state.failed) return this.props.children;
    return(<div className="max-w-xl mx-auto px-5 py-20"><h1 className="text-3xl font-bold">Something broke on our side</h1>
      <p className="mt-3">Refresh the page. If it keeps happening, note what you clicked and tell us.</p>
      <button onClick={()=>window.location.reload()} className="mt-5 bg-ink text-white px-5 py-3 rounded-lg font-bold">Refresh page</button></div>);
  }
}
