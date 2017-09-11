import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {SiteUser} from "./models";
import {Helper} from "./helper.service";
import {Global} from "./Global.service";
// import { Helper } from './helper.service';
// import {SiteUser} from "./models";
// import {Global} from "./Global.service";

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  blogContent;

  constructor(private helper:Helper, private global:Global,private ref : ChangeDetectorRef){

   }

  ngOnInit(){

    /*if localstorage is not empty fetch the user details and set to Global.service.ts
    this will be required when user refreshes the page*/
    // console.log(this.global.getLoggedInUserDetails(),'from app.component');

    if(!this.global.getLoggedInUserDetails())
    {
      this.helper.getUserBy_id(localStorage.getItem('userID')).subscribe(
       (value)=> {
         console.log(value);
         this.global.setLoggedInUserDetails(value[0]);
         this.helper.setLoggedInUserDetailsEvent.emit(value[0]);

        }
      );
    }
  }

  onBodyTextEditorKeyUp(event){

    this.blogContent = event;
    this.ref.detectChanges();
  }
}
