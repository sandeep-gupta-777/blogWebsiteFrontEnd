import {Component, Input, OnInit} from '@angular/core';
import {BlogComment} from "../models";
import {Helper} from "../helper.service";

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {

  @Input() showEditBox = false;
  @Input() parentLevel;
  @Input() parentID;
  @Input() parentRankCode;
  @Input() commentBlog_id;
  showReplyBox = false;
  replyText = "";


  @Input() comment: BlogComment;
  replyComment: BlogComment = {};
  editedCommentText;

  saveComment() {
    if (this.showEditBox === false) {
      this.showEditBox = !this.showEditBox;
    }
    else {
      this.comment.commentText = this.editedCommentText;
      //make post request to save comment
        this.comment.commentText = this.editedCommentText;
        this.comment.commentHTML = 'hello worlds';
        // this.comment.commentAuthor_FullName = 'Sandeep';
        // this.comment.commentAuthor_PicURL = '';

        // this.comment.commentBlog_id = '59abcbc02e068633ec82f4ad';
        this.comment.commentParent_id = this.parentID;
        console.log(this.parentLevel);
        this.comment.commentParentLevel = this.parentLevel;
        this.comment.commentLevel = this.parentLevel + 1;

        this.comment.commentChild_idArray = [''];
        this.comment.commentDate = new Date;
        this.comment.commentLikeCount = 0;

        console.log('saving comment');
        console.log(this.comment);
      this.helper.makePostRequest('users/saveComment', this.comment).subscribe(value=>{
        console.log(value);
      });
      this.showEditBox = !this.showEditBox;
    }
  }

  postReply() {
//TODO: lots of repeated code here
    //save a new comment with current comment as a parent
    //make post request to save comment
    console.log('saving reply');
    this.replyComment.commentText = this.replyText;
    this.replyComment.commentHTML = 'hello worlds';
    this.replyComment.commentAuthor_FullName = 'Sandeep';
    this.replyComment.commentAuthor_PicURL = '';

    this.replyComment.commentBlog_id = this.commentBlog_id;
    this.replyComment.commentParent_id = this.comment._id;
    this.replyComment.commentParentLevel = this.comment.commentLevel;
    this.replyComment.commentLevel = ++this.comment.commentLevel;
    this.replyComment.commentRankCode=`${this.getCommentRankCode(this.comment.commentRankCode, this.comment.commentLevel)}`;

      this.replyComment.commentChild_idArray = [''];
    this.replyComment.commentDate = new Date;
    this.replyComment.commentLikeCount = 0;

    console.log('saving reply');
    console.log(this.replyComment);
    this.helper.makePostRequest('users/saveComment', this.replyComment).subscribe(value=>{
      console.log(value);
    });
    this.showReplyBox = !this.showReplyBox;

    //save replyText in database
    //changed the CommentArray in thread.component.ts
  }

  url = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyDw06sXVJ5KPbNAVXiqij6ACgrTPO64t7-7Rrt0QCn1xycwoJRrrIvIk";
  setDefaultPic() {//TODO: this is not working  https://stackoverflow.com/questions/36026428/angular2-show-placeholder-image-if-img-src-is-not-valid
    this.url = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_putgskj6rIFYM8935r17tJhJ5KUk0YA4sHV61MSh9pBjd8xTnI8ChPfi";
  }

  getCommentRankCode(parentRankCode, parentLevel){
    //parent rank code + '.' + sibling++
    if(parentRankCode ==='-1'){
      return this.helper.getSiblingBlogCommentsCount(parentLevel + 1); //starts with 0
    }
    else {
      return parentRankCode + '.' + this.helper.getSiblingBlogCommentsCount(parentLevel + 1 ); //starts with 0
    }
  }

  ngOnInit() {

    console.log('comment init');
    console.log(this.commentBlog_id);
    if (this.comment)
      this.editedCommentText = this.comment.commentText;
    else {
      this.comment =
        {

          commentText: "not set",
          commentHTML: "not set",
          commentAuthor_FullName: 'Sandeep',
          commentAuthor_PicURL: '',

          commentBlog_id: this.commentBlog_id,
          commentParent_id: this.parentID,
          commentParentLevel: this.parentLevel,
          commentLevel: this.parentLevel + 1 ,
          commentRankCode:`${this.getCommentRankCode(this.parentRankCode, this.parentLevel)}`,

          commentChild_idArray: ['not set'],
          commentDate: new Date,
          commentLikeCount: -1
        };

    }

  }

  constructor(private helper: Helper) {

  }
k(){
  console.log(this.commentBlog_id);
}
}
