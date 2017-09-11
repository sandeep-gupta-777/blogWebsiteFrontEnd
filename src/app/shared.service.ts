/**
 * Created by sandgup3 on 17/06/2017.
 */

import {EventEmitter, Injectable} from '@angular/core';
import {Http,Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs';
import {ImageContainer, SiteUser} from "./models";
import {userInfo} from "os";
// import { Observable } from 'rxjs';

function getWindow (): any {
  // return window;
  return window;
}

function getDocument (): any {
  // return window;
  return document;
}


@Injectable()
export class Helper {
  constructor(private http: Http){

  }
  get nativeWindow (): any {
    return getWindow();
  }
  get nativeDocument (): any {
    return getDocument();
  }
  elementHeightFromTop(id, document): number{
    let ele: HTMLScriptElement = <HTMLScriptElement>document.getElementById(id);
    let x = 0;
    while (ele) {
      x += ele.offsetTop;
      ele = <HTMLScriptElement>ele.offsetParent;
    }
    return x;
  }
  findImageContainerByID(imageContainers, imageId): ImageContainer {
    for(let i=0; i <imageContainers.length ; ++i){
      if(imageContainers[i].imageId === imageId){
        return imageContainers[i];
      }
    }
  }

  makeGetRequest(url){
    return this.http.get(`http://localhost:3000${url}`).map(function (response: Response) {
      return response.json();
    })
}
  makePostRequest(url, body){

   return this.http.post("http://localhost:3000/increaseVoteCount", body)//header removed
      .map((response: Response) => response.json())
      .catch((err: Response) => Observable.throw(err.json()))

}

  toggleClassEvent =  new EventEmitter();
  dataTransfer = new EventEmitter();
  setLoggedInUserDetailsEvent = new EventEmitter();
  getLoggedInUserDetailsEvent = new EventEmitter();

  signup(user:SiteUser){
      return this.http.post('http://localhost:3000/users/signup',user)
          .map((response:Response)=>response.json())
          .catch((err:Response)=> Observable.throw(err.json()));
  }
  login(user){
    return this.http.post('http://localhost:3000/users/login',user)
        .map((response:Response)=>response.json())
        .catch((err:Response)=> Observable.throw(err.json()));
  }

  getAllLikedImagesByUser(user_id){
    return this.http.post('http://localhost:3000/users/liked_images',{user_id:user_id})
      .map((response:Response)=>response.json())
      .catch((err:Response)=> Observable.throw(err.json()));
  }
  getUsersUploadedImagesContainersFromDB(user_id){
    console.log(user_id);
    return this.http.post('http://localhost:3000/users/uploaded',{user_id:user_id})
      .map((response:Response)=>response.json())
      .catch((err:Response)=> Observable.throw(err.json()));
  }

  getUserBy_id(user_id){
    return this.http.post('http://localhost:3000/users/user_details',{user_id:user_id})
      .map((response:Response)=>response.json())
      .catch((err:Response)=> Observable.throw(err.json()));
  }
  getLoggedInUserDetails(){
    let user_id = localStorage.getItem('userID');
    return this.getUserBy_id(user_id);

  }



}
