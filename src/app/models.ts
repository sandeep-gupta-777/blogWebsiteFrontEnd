/**
 * Created by sandgup3 on 08/07/2017.
 */
class ImageContainer {
    imageId: String;
    imageName: String;
    imageTags: String[];
    imageURL: String;
    imageAuthor: String;
    imageVoteCount: Number;
    imagePublishDate?:String;
    imageComments?:String;


    constructor(imageId: String, imageName: String, imageTags: String[], imageURL: String, imageAuthor: String, imageVoteCount: Number, imagePublishDate?: String, imageComments?: String) {
        this.imageId = imageId;
        this.imageName = imageName;
        this.imageTags = imageTags;
        this.imageURL = imageURL;
        this.imageAuthor = imageAuthor;
        this.imageVoteCount = imageVoteCount;
        this.imagePublishDate = imagePublishDate;
        this.imageComments = imageComments;
    }
}

class SiteUser{
    userName:String;
    fullName:String;
    email:String;
    password:String;

    profileID?:String;
    profilePicURL?:String;
    votes?:String[];
    comments?:{comment:String, image:String}[];//array of an object
    uploaded?:String[];
    dateOfSignup?:Date;
    lastLogin?:Date;


    constructor(userName: String, fullName: String, email: String, password: String,
                profileID?: String, profilePicURL?: String, votes?: String[], comments?: { comment: String; image: String }[], uploaded?: String[], dateOfSignup?: Date, lastLogin?: Date) {
        this.userName = userName;
        this.fullName = fullName;
        this.email = email;
        this.password = password;
        this.profileID = profileID;
        this.profilePicURL = profilePicURL;
        this.votes = votes;
        this.comments = comments;
        this.uploaded = uploaded;
        this.dateOfSignup = dateOfSignup;
        this.lastLogin = lastLogin;
    }
}

module.exports = {
    ImageContainer,
    SiteUser
};