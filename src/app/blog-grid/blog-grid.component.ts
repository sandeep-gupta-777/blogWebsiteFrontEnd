import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {BlogPost, ImageContainer} from "../models";
import {Shared} from "../shared.service";
import {Helper} from "../helper.service";
import {Global} from "../Global.service";
import {Router} from "@angular/router";

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
  private subscriptionPost;
  @Input() imageContainers: ImageContainer[]  = null;
  @Input() resultsArray: BlogPost[]  = null;
  searchQueryTImeStamp;
  constructor(private sharedService: Shared, private helper:Helper, private global:Global, private router: Router) {
  }

  // isUserAlsoOwnerOfThisImage(imageAuthor_id){
  //   //TODO: this method is called by 4 time, debug it
  //   let temp = this.global.getLoggedInUserDetails();
  //   if(!temp) return false;
  //   console.log(' in isUserAlsoOwnerOfThisImage');
  //   return imageAuthor_id ===this.global.getLoggedInUserDetails()._id;
  // }
  isUserAlsoOwnerOfThisBlogPost(imageAuthor_id){
    //TODO: this method is called by 4 time, debug it
    let temp = this.global.getLoggedInUserDetails();
    if(!temp) return false;
    return imageAuthor_id ===this.global.getLoggedInUserDetails()._id;
  }


  // sortImageContainerArrayBy(property){
  //   this.sortbyPropery = property;
  //   this.imageContainers = this.imageContainers.sort(this.dynamicSort(property));
  // }
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

  loadMore(){
    /*perform search for a given query but skip all the images which have already been loaded*/
    /*if the newly loaded image count is less than the demanded => means there are no more such imagges
     * therefore, its safe to disable load more button
     * */
    let previouslyLoadedImagesCount,newImagesToBeLoadedCount = 40;

    let previouslyLoadedResultCount,newResultsToBeLoadedCount = 1;
    previouslyLoadedImagesCount = this.resultsArray.length;

    this.showLoadingIcon = true;
    // this.loadMoreImagesSubscription =  this.helper.loadMoreImages(this.searchQuery,previouslyLoadedImagesCount,newImagesToBeLoadedCount )
    //   .subscribe(value=>{
    //     this.showLoadingIcon = false;
    //     console.log(value);
    //     value.length<10?this.showLoadMore=false:this.showLoadMore=true;
    //     this.imageContainers = this.imageContainers.concat(value);
    //     this.sortImageContainerArrayBy(this.sortbyPropery);
    //
    //   });
    this.loadMoreResultsSubscription =  this.helper.loadMoreResults(this.searchQuery,previouslyLoadedResultCount,newResultsToBeLoadedCount )
      //will trigger /loadMoreResults in backend
      .subscribe(value=>{
        this.showLoadingIcon = false;
        value.length<1?this.showLoadMore=false:this.showLoadMore=true;//TODO: change 1 to  10
        debugger;
        // this.imageContainers = this.imageContainers.concat(value);
        this.resultsArray = this.resultsArray.concat(value);
        // this.sortImageContainerArrayBy(this.sortbyPropery);
        this.sortResultsArrayBy(this.sortbyPropery);
      });

  }

  // openSideImagePanel(imageContainer){
  //   console.log(imageContainer);
  //   this.showSidePanel = true;
  //   setTimeout(()=>{
  //     /*why this is needed?
  //      we want below code to execute AFTER component is finished loading; this.showSidePanel = true will start the loading
  //      putting in set time out will make the code ASYNC*/
  //     this.sharedService.getImageContainers.emit(imageContainer);
  //   }, 0);
  // }

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


  //need to change
  //on clicking like
  // increaseVoteCount(imageId) {
  //   console.log('hello');
  //   let imageContainer : ImageContainer = this.helper.findImageContainerByID(this.imageContainers,imageId);
  //   console.log(imageContainer);
  //   imageContainer.imageVoteCount++;//this is just for front-end
  //   let body = {image_id: imageContainer._id, user_id: localStorage.getItem('userID')};
  //   console.log(imageContainer);
  //   this.makePostRequestSubscription = this.helper.makePostRequest("increaseVoteCount", body)
  //     .subscribe(
  //       data => console.log(data),
  //       err => console.log(err)
  //     );
  // }

  ngOnInit() {

    this.resultsArray = this.global.resultsArray || [];



    this.sharedServiceSubscription = this.sharedService._observable.subscribe((value)=>{
      // this.imageContainers = value.imageContainers;
    });

    //need to change
    // this.triggerGetResultsEventSubscription = this.helper.triggerIconGridComponentGetImagesEvent.subscribe(({url,requestType, searchQuery})=>{
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
