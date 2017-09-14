import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {BlogPost, ImageContainer} from "../models";
import {Shared} from "../shared.service";
import {Helper} from "../helper.service";
import {Global} from "../Global.service";
import {Router} from "@angular/router";
import {isUndefined} from "util";

@Component({
  selector: 'app-blog-grid',
  templateUrl: './blog-grid.component.html',
  styleUrls: ['./blog-grid.component.css']
})
export class BlogGridComponent implements OnInit {

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
  searchQueryTImeStamp;
  constructor(private sharedService: Shared, private helper:Helper, private global:Global, private router: Router) {
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

    let previouslyLoadedResultCount=0,newResultsToBeLoadedCount = 1;
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

    this.resultsArray = this.global.resultsArray;
  this.sharedServiceSubscription = this.sharedService._observable.subscribe((value)=>{
    });

    //need to change
    //TODO: check if this can be moved to helper function
    this.triggerGetResultsEventSubscription = this.helper.getResultEvent.subscribe(({url,requestType, searchQuery})=>{
      console.log("frontend: " + searchQuery);
      this.searchQueryTImeStamp = Date.now(); //at this time search is performed
      let user_id = localStorage.getItem('userID');
      this.showLoadingIcon=true;
      if(requestType==='POST')
      {
        if(!searchQuery) searchQuery ="";

        this.subscriptionPost = this.helper.makePostRequest(url,{user_id, searchQuery:searchQuery,searchQueryTImeStamp:this.searchQueryTImeStamp}).subscribe(
          (value) =>{

            if(value.searchQueryTImeStamp< this.searchQueryTImeStamp){
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
        this.subscriptionGet =  this.helper.makeGetRequest(url).subscribe(
          (value) =>{
            this.showLoadingIcon=false;
            // this.imageContainers = value;
            this.resultsArray = value;
            // this.sortImageContainerArrayBy('-imageVoteCount');
            this.sortResultsArrayBy('-imageVoteCount');//change here
            value.length<1?this.showLoadMore=false:this.showLoadMore=true;//TODO: change 1 to 10
          });
      }

    });

    //fine
    this.notifyKeywordChangeEventSubscription = this.helper.notifyKeywordChangeEvent.subscribe(value=>{
      this.searchQuery = value;
      this.global.setSearchQuery(value);
    })

  }

}
