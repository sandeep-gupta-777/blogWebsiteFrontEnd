import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {BlogPost, CriteriaObject, ImageContainer} from "../models";
import {Shared} from "../shared.service";
import {Helper} from "../helper.service";
import {Global} from "../Global.service";
import {ActivatedRoute, Router} from "@angular/router";
import {isUndefined} from "util";

@Component({
  selector: 'app-blog-grid',
  templateUrl: './blog-grid.component.html',
  styleUrls: ['./blog-grid.component.css']
})
export class BlogGridComponent implements OnInit {

  parent;
  criteriaObj:CriteriaObject =this.global.getCriteriaObject();

  ngOnDestroy(): void {

    if(this.subscriptionGet)
      this.subscriptionGet.unsubscribe();
    if(this.subscriptionPost)
      this.subscriptionPost.unsubscribe();
    if(this.triggerGetResultsEventSubscription)
      this.triggerGetResultsEventSubscription.unsubscribe();
    if(this.sharedServiceSubscription)
      this.sharedServiceSubscription.unsubscribe();
    if(this.makePostRequestSubscription)
      this.makePostRequestSubscription.unsubscribe();
    if(this.loadMoreImagesSubscription)
      this.loadMoreImagesSubscription.unsubscribe();
    if(this.notifyKeywordChangeEventSubscription)
      this.notifyKeywordChangeEventSubscription.unsubscribe();
  }
  lastCall;
  debounce(searchQuery,interval=0) {//TODO: shift this to helper class
    //https://stackoverflow.com/questions/18177174/how-to-limit-handling-of-event-to-once-per-x-seconds-with-jquery-javascript
    this.helper.notifyKeywordChangeEvent.emit(searchQuery);
    this.criteriaObj.searchQuery = searchQuery;
    clearTimeout(this.lastCall);
    this.lastCall = setTimeout(() => {
      this.triggerAllResultsObservable(searchQuery);
    }, interval);
  }

  triggerAllResultsObservable(searchQuery?:string){
    //navigate to http://localhost:4200/icons page is not already navigated
    if(this.router.url !== "/"+this.global._backendRoute_AllResults)//these are frontend routes but with same value
      this.router.navigate(["/"+ this.global._backendRoute_AllResults]);
    if (!isUndefined(searchQuery)) {
      this.searchQuery = searchQuery;
      this.global.setSearchQuery(searchQuery);
    }

    setTimeout(()=>{
      this.criteriaObj.url = this.global._backendRoute_AllResults;

      this.helper.triggergetResultEvent(this.criteriaObj);

    }, 0);
    // this.helper.triggerIconGridComponentGetImages('AllIcons','POST',  newValue);
  }





  showSidePanel = false;
  showLoadingIcon= false;
  showTimeoutError= false;

  searchQuery;
  showLoadMore = true;
  sortbyPropery = "-blogRelevency";
  private subscriptionGet;
  private triggerGetResultsEventSubscription;
  private sharedServiceSubscription;
  private makePostRequestSubscription;
  private loadMoreImagesSubscription;
  private loadMoreResultsSubscription;
  private notifyKeywordChangeEventSubscription;
  previouslyLoadedResultCount=0;
  newResultsToBeLoadedCount = 1;//TODO: make it a global variable
  private subscriptionPost;
  resultsArray: BlogPost[];
  loadingArray = [1,2];
  searchQueryTimeStamp;
  constructor(private sharedService: Shared, private helper:Helper, private global:Global, private router: Router, private activatedRoute:ActivatedRoute) {
  }
  test(){
    console.log(this.resultsArray);
    return this.resultsArray;
  }

  isUserAlsoOwnerOfThisBlogPost(imageAuthor_id){
    //TODO: this method is called by 4 time, debug it
    let temp = this.global.getLoggedInUserDetails();
    if(!temp) return false;
    return imageAuthor_id ===this.global.getLoggedInUserDetails()._id;
  }
  sortResultsArrayBy(property){
    this.sortbyPropery = property;
    this.resultsArray = this.resultsArray.sort(this.dynamicSort(property));
  }
  dynamicSort(property:string) {
    let sortOrder = 1;
    if (property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1);
    }
    return function (a, b) {
      let result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
      return result * sortOrder;
    }
  }

  timeOutRef;

  showTimeOutErrorIfNeeded(){
    this.timeOutRef = setTimeout(()=>{
      this.showTimeoutError = true;
      this.loadMoreResultsSubscription.unsubscribe();
    },10000);
  }

  loadMore(){
    /*perform search for a given query but skip all the images which have already been loaded*/
    /*if the newly loaded image count is less than the demanded => means there are no more such imagges
     * therefore, its safe to disable load more button
     * */

    let previouslyLoadedResultCount=0,newResultsToBeLoadedCount = 10;
    console.log('load more clicked');
    this.showLoadingIcon = true;
    this.showTimeOutErrorIfNeeded();
    this.loadMoreResultsSubscription =  this.helper.loadMoreResults(this.searchQuery,this.previouslyLoadedResultCount,this.newResultsToBeLoadedCount )
      //will trigger /loadMoreResults in backend
      .subscribe(value=>{
        clearInterval(this.timeOutRef);
        this.showLoadingIcon = false;
        value.length<newResultsToBeLoadedCount?this.showLoadMore=false:this.showLoadMore=true;//TODO: change 1 to  10
        this.resultsArray = this.resultsArray.concat(value);
        this.previouslyLoadedResultCount = this.resultsArray.length ;
        // this.sortResultsArrayBy(this.sortbyPropery); we are not sorting....we should recieve sorted queries
      });

  }
  openBlogDisplayPage(blogPost:BlogPost){

    this.global.previousSRPURL = window.location.pathname;

      this.router.navigateByUrl(`/blogdisplay/${blogPost._id}`); //TODO: use subscribe and execute rest of the code in it
    setTimeout(()=>{
      /*why this is needed?
       we want below code to execute AFTER component is finished loading; this.showSidePanel = true will start the loading
       putting in set time out will make the code ASYNC*/
      this.sharedService.getClickedBlogPost.emit(blogPost);
    }, 0);

  }


  ngOnInit() {
    this.searchQuery= this.global.getSearchQuery();
    this.criteriaObj.source= 'from blog grid';
    // debugger;
    let tempUrl = window.location.href;
    if(tempUrl.indexOf('parent=dashboard')>-1)//TODO: change this to something more robust
    {
      this.parent='dashaboard';
      // this.router.navigate(['allresults'],{queryParams:{query:searchQuery}});
    }
    else {
      this.parent=""
    }
    this.resultsArray = this.global.resultsArray;
  this.sharedServiceSubscription = this.sharedService._observable.subscribe((value)=>{
    });

    //TODO: check if this can be moved to helper function
    this.triggerGetResultsEventSubscription = this.helper.getResultEvent.subscribe((criteriaObj:CriteriaObject)=>{
      // let url = criteriaObj.url;
      // let requestType = criteriaObj.requestType;
      // let searchQuery = criteriaObj.searchQuery;
      // criteriaObj.searchQueryTImeStamp = this.searchQueryTImeStamp;
      criteriaObj.searchQueryTImeStamp=Date.now();
      if(this.global.getLoggedInUserDetails())
      criteriaObj.user_id = this.global.getLoggedInUserDetails()._id;
      console.log('getting results from server for the following criteria object:');
      console.log(criteriaObj);

      this.searchQueryTimeStamp = Date.now(); //at this time search is performed
      // let user_id = localStorage.getItem('userID');
      this.showLoadingIcon=true;

      //change the url accordingly, but not if blog-grid.component.ts is child component
      // debugger;
      // if(this.criteriaObj.shouldNavigateToSRP && !this.criteriaObj.shouldNavigateToSRP){
        if(tempUrl.indexOf('parent=dashboard')>-1)//TODO: change this to something more robust
        {
          this.parent='dashaboard';
        }else {
          this.parent='';
          this.router.navigate(['allresults'],{queryParams:{query:criteriaObj.searchQuery}});
        }
      // }

      if(criteriaObj.requestType==='POST')
      {
        if(!criteriaObj.searchQueryTImeStamp) criteriaObj.searchQuery ="";

        this.subscriptionPost = this.helper.makePostRequest(criteriaObj.url,criteriaObj).subscribe(
          (value:any) =>{
            if(value.searchQueryTimeStamp< this.searchQueryTimeStamp){
              console.log(value);
              console.log('old search...discarded');
              return;
            }
            value = value.value;
            this.showLoadingIcon=false;
            // this.imageContainers = value;
            this.resultsArray = value;
            // this.sortImageContainerArrayBy('-imageVoteCount');
            this.sortResultsArrayBy(this.sortbyPropery);//change here
            // value.length<10?this.showLoadMore=false:this.showLoadMore=true;
            value.length<1?this.showLoadMore=false:this.showLoadMore=true;//TODO: change 1 to 10

            this.global.resultsArray = value;
          },
          //
          (error)=>{
            console.log(error);
          }

        );
      }
      else {
        // this.subscriptionGet =  this.helper.makeGetRequest(url).subscribe(
        //   (value) =>{
        //     this.showLoadingIcon=false;
        //     // this.imageContainers = value;
        //     this.resultsArray = value;
        //     // this.sortImageContainerArrayBy('-imageVoteCount');
        //     this.sortResultsArrayBy('-imageVoteCount');//change here
        //     value.length<1?this.showLoadMore=false:this.showLoadMore=true;//TODO: change 1 to 10
        //   });
      }

    });

    //fine
    this.notifyKeywordChangeEventSubscription = this.helper.notifyKeywordChangeEvent.subscribe(value=>{
      this.searchQuery = value;
      this.global.setSearchQuery(value);
    })

  }

}
