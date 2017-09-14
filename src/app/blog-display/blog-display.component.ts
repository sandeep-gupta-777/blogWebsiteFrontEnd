import {ChangeDetectorRef, Component, ElementRef, OnInit} from '@angular/core';
import {BlogPost, ImageContainer} from "../models";
import {Shared} from "../shared.service";
import * as jquery from "jquery";
import {Helper} from "../helper.service";
import {Global} from "../Global.service";
import {ActivatedRoute, Route, Router} from "@angular/router";

@Component({
  selector: 'app-blog-display',
  templateUrl: './blog-display.component.html',
  styleUrls: ['./blog-display.component.css']
})
export class BlogDisplayComponent implements OnInit {

  ngOnDestroy(): void {

    if (this.getClickedBlogPostSubscription)
      this.getClickedBlogPostSubscription.unsubscribe();
  }

  editMode = false;

  // private getImageContainersSubscription;
  private getClickedBlogPostSubscription;
  imageContainer: ImageContainer = {//TODO: try using async pipe, instead of initializing like this
    imageId: 'not set',
    imageName: 'not set',
    imagePublishDate: 'not set',
    imageAuthor: 'not set',
    imageAuthor_id: 'not set'
  };
  blogPost: BlogPost = {
    blogTitle:"loading...",
    blogHTML:"loading...",
    blogDraftHTML:"loading...",
    blogText:"loading...",
    blogAuthor_id:"loading...",
    blogAuthor_fullName:"loading...",
    blogCreationDate:new Date(),
    blogLastUpdatedDate:new Date(),
    blogLikes:["asdasd"],
    blogViews:-1,
    blogComments:["loading..."],
    blogTags:["loading..."],
    blogRelevency:-1,
    blogImageURL: "loading..."
  };
  blogTitle = "not set";
  _id;

  constructor(private shared: Shared, private el: ElementRef, private helper: Helper, private global: Global, private router: Router,
              private route: ActivatedRoute,private ref : ChangeDetectorRef) {

  }

  // isUserAlsoOwnerOfThisImage(imageAuthor_id){
  //   //TODO: this method is called by 4 time, debug it
  //   let temp = this.global.getLoggedInUserDetails();
  //   if(!temp) return false;
  //   console.log(' in isUserAlsoOwnerOfThisImage');
  //   return imageAuthor_id ===this.global.getLoggedInUserDetails()._id;
  // }

  //fine
  isUserAlsoOwnerOfThisBlogPost() {
    //TODO: this method is called by 4 time, debug it
    let temp = this.global.getLoggedInUserDetails();
    if (!(temp && this.blogPost)) return false;
    return this.blogPost.blogAuthor_id === this.global.getLoggedInUserDetails()._id;
  }

  triggerAllIconObservable(searchQuery) {
    // if(searchQuery)
    // this.searchQuery = searchQuery;
    this.helper.notifyKeywordChangeEvent.emit(searchQuery);
    this.helper.setKeywordIntoSearchBarEvent.emit(searchQuery);
    this.helper.triggerIconGridComponentGetImages('AllIcons', 'POST', searchQuery);

  }
  triggerGetResultEvent(searchQuery) {//TODO: this exact same method is written in header, put it in helper file
    this.helper.notifyKeywordChangeEvent.emit(searchQuery);
    this.helper.setKeywordIntoSearchBarEvent.emit(searchQuery);

    //navigate to http://localhost:4200/icons page is not already navigated
    if(this.router.url !== "/"+this.global._backendRoute_AllResults)//these are frontend routes but with same value
      this.router.navigate(["/"+ this.global._backendRoute_AllResults]);

    setTimeout(()=>{
      this.helper.triggergetResultEvent(this.global._backendRoute_AllResults,'POST', searchQuery);
    }, 0);
  }

  makeTagsEditable() {
    this.imageContainer.imageTags.forEach(function (value) {
      (<any>$('#temp')).tagsinput('add', value);
    });
  }

  toggleEditModeAndSave() {
    this.editMode = !this.editMode;
    if (this.editMode) {
      // this.makeTagsEditable();
      //
    }
    else {
      //save all the changed values
      // imageContainer.imageName
      //this.imageContainer.imagedescription

      //TODO: Implement tags
      // this.imageContainer.imageTags =  (<any>$('#tags')).tagsinput('items');
      // console.log((<any>$('#tags')).tagsinput('items'));

      //make a call to save this object
      this.helper.saveEditedImageContainer(this.imageContainer).subscribe(
        (value) => {
          console.log(value)
        }
      );

    }


  }


  openBlogEditorPage() {
    // this.showSidePanel = true;
    this.router.navigateByUrl(`/blogEdit/${this.blogPost._id}`); //TODO: use subscribe and execute rest of the code in it

    setTimeout(() => {
      /*why this is needed?
       we want below code to execute AFTER component is finished loading; this.showSidePanel = true will start the loading
       putting in set time out will make the code ASYNC*/
      this.shared.getClickedBlogPost.emit(this.blogPost);
    }, 0);
  }


  ngOnInit(): void {
    console.log('ngoninit of blog-display.component.ts');

     this._id = this.route.snapshot.params['id'];

    console.log('entering ngOnInit in blog display...');
    // this.getImageContainersSubscription = this.shared.getImageContainers.subscribe(
    //   (value)=>{
    //     console.log("in ng on init of sidebar1.component.ts");
    //     this.imageContainer = value
    //   }
    // );
    this.getClickedBlogPostSubscription = this.shared.getClickedBlogPost.subscribe(
      (value) => {
        console.log(value);
        this.blogPost = value;
      }
    );
    //this code is to fetch the blog from server when page is reloaded
    this.helper.makePostRequest('getBlogPost', {_id: this._id}).subscribe((value) => {
      this.blogPost = value[0];
      // alert(this.blogPost.blogTitle);
      this.blogTitle = this.blogPost.blogTitle;
      console.log(value[0]);
      this.ref.detectChanges();

    });
  }


  toggleLike(){
    /*likes should be an array
    * toggle users id is found in that array
    * */
    let user_id = this.global.getLoggedInUserDetails()._id;
    let indexOfUserIDInLikedArry = this.blogPost.blogLikes.indexOf(user_id);
    if(indexOfUserIDInLikedArry===-1){
      this.blogPost.blogLikes.push(user_id);
    }
    else {
      this.blogPost.blogLikes.splice(indexOfUserIDInLikedArry,1);
    }
    //TODO: save in databse

  }

}
