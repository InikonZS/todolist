import { Component } from "./utilities/Component";

export class Route{
  public linkName: string;
  public pageName: string;
  public onActivate: ()=>void;
  public onDeactivate: ()=>void;
  
  constructor(pageName:string, linkName:string, onActivate:()=>void, onDeactivate:()=>void){
    this.linkName = linkName;
    this.pageName = pageName;
    this.onActivate = onActivate;
    this.onDeactivate = onDeactivate;
  }

  activate(){
    this.onActivate();
  }

  deactivate(){
    this.onDeactivate();
  }
}

export class Router{
  public routes:Array<Route> = [];
  constructor(){
    window.onpopstate = ()=>this.processHash();
  }
  processHash(){
    let hash = window.location.hash.slice(1);
    console.log(hash);
    this.activateRouteByName(hash);
  }

  activateRouteByName(name:string){
    this.routes.forEach(route=>{
      if (route.pageName == name){
        route.activate();
      } else {
        route.deactivate();
      }
    })
  }

  addRoute(route:Route){
    route.deactivate();
    this.routes.push(route);
  }
}