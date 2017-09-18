import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Helper} from '../helper.service';
import {ActivatedRoute, NavigationEnd, Params, Router} from "@angular/router";
import {Global} from "../Global.service";
import {isUndefined} from "util";
import {factoryOrValue} from "rxjs/operator/multicast";
import {CriteriaObject} from "../models";

@Component({
  selector: 'app-header-component',
  templateUrl: './header-component.component.html',
  styleUrls: ['./header-component.component.css']
})
export class HeaderComponentComponent implements OnInit, OnChanges {


  ngOnChanges(changes: SimpleChanges): void {
    // console.log(changes);
  }
  criteriaObj:CriteriaObject =this.global.getCriteriaObject();

  ngOnDestroy(): void {

    if (this.routerEventSubscription)
      this.routerEventSubscription.unsubscribe();
    if (this.changeRouterSubscription)
      this.changeRouterSubscription.unsubscribe();
  }
  changeRouterSubscription;
  headerFixed: boolean = false;
  private routerEventSubscription;
  public searchQuery:string= "";
  public userfirstName="";
  constructor( public helper: Helper, public global:Global,private activatedRoute:ActivatedRoute,
               public router: Router) {
    helper.toggleClassEvent.subscribe((HTMLClass) => {
      this.headerFixed = true;
    });
  }


  logout(){
    localStorage.clear();
    console.log('logging out');
    this.router.navigate(['/login']);
  };

  triggerAllIconObservable(newValue?:string){
    //navigate to http://localhost:4200/icons page is not already navigated
    if(this.router.url !== '/icons')
      this.router.navigate(['/icons']);
    if (!isUndefined(newValue)) {
      this.searchQuery = newValue;
      this.global.setSearchQuery(newValue);
    }
    this.helper.notifyKeywordChangeEvent.emit(newValue);

    setTimeout(()=>{
      this.helper.triggerIconGridComponentGetImages('AllIcons','POST',  this.global.getSearchQuery());

  }, 0);
    // this.helper.triggerIconGridComponentGetImages('AllIcons','POST',  newValue);

  }
  lastCall = setTimeout(()=>{},0);

  debounce(searchQuery,interval=0) {//TODO: shift this to helper class, interval can be uptp 200
    //https://stackoverflow.com/questions/18177174/how-to-limit-handling-of-event-to-once-per-x-seconds-with-jquery-javascript
    this.helper.notifyKeywordChangeEvent.emit(searchQuery);
    this.searchQuery = searchQuery;
    this.global.setSearchQuery(searchQuery);

    clearTimeout(this.lastCall);
    this.lastCall = setTimeout(() => {
      this.triggerAllResultsObservable(searchQuery);
    }, interval);
}

  triggerAllResultsObservable(searchQuery?:string){
    //navigate to http://localhost:4200/icons page is not already navigated
    if(this.router.url !== "/"+this.global._backendRoute_AllResults)//these are frontend routes but with same value
      this.router.navigate(["/"+ this.global._backendRoute_AllResults]);

    // if (!isUndefined(searchQuery)) {
    //   this.searchQuery = searchQuery;
    //   this.global.setSearchQuery(searchQuery);
    // }


    setTimeout(()=>{

      this.criteriaObj.url =this.global._backendRoute_AllResults;
      this.criteriaObj.searchQuery=this.searchQuery;
      console.log(this.criteriaObj);
      this.helper.triggergetResultEvent(this.criteriaObj);

  }, 0);
  }

  isLoggedIn(){
    // console.log(localStorage.getItem('token'));
    return localStorage.getItem('token')!== null;
  }




  ngOnInit() {
    this.criteriaObj.source = 'from header';
    this.helper.setLoggedInUserDetailsEvent.subscribe(
      (value) => {
        this.userfirstName = value.fullName.split(" ")[0];
      });
     this.helper.setKeywordIntoSearchBarEvent.subscribe(
       (keyword)=> {this.searchQuery=keyword}
     );



    this.changeRouterSubscription = this.router.events
      .filter(event => (event instanceof NavigationEnd))
      .subscribe((routeData: any) => {

        let currentURL = routeData.url;

        console.log('checking all the routes');

        /*what does the following code do?
        * When user reloads the page...we need to show appropriate icons
        * */
        if(currentURL==='/icons'){
          setTimeout(()=>{//may not be needed
            this.helper.triggerIconGridComponentGetImages('AllIcons','POST',  this.global.getSearchQuery());
          },0);
        }
        else if(currentURL==='/dashboard/likedBlogs'){
          setTimeout(()=>{//may not be needed
            this.criteriaObj.url =  'users/likedBlogs';
            this.helper.triggergetResultEvent(this.criteriaObj);

          },0);
        }
        else if(currentURL==='/dashboard/writtenBlogs' && !this.global.resultsArray){
          // alert();
          setTimeout(()=>{//may not be needed
            this.criteriaObj.url =  'users/writtenBlogs';
            this.helper.triggergetResultEvent(this.criteriaObj);
          },0);
        }
        else if(currentURL.indexOf('/allresults')>-1) {
          this.searchQuery =  this.activatedRoute.snapshot.queryParams.query || "";

          setTimeout(() => {//may not be needed
            this.criteriaObj.url =  'allresults';
            // this.helper.notifyKeywordChangeEvent.emit(this.searchQuery);
            this.helper.triggergetResultEvent(this.criteriaObj);
            this.changeRouterSubscription.unsubscribe();
          }, 0);
        }
      });


  }
}
