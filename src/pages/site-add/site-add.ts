import { SiteDetailPage } from './../site-detail/site-detail';
import { ConstantProvider } from './../../providers/constant/constant';
import { DbserviceProvider } from './../../providers/dbservice/dbservice';
import { Component, ViewChild } from '@angular/core';
import { ActionSheetController, AlertController, Content, IonicPage, NavController, NavParams, ToastController, Loading, LoadingController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { SiteListPage } from '../site-list/site-list';
import { Camera, CameraOptions } from '@ionic-native/camera';

/**
 * Generated class for the SiteAddPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-site-add',
  templateUrl: 'site-add.html',
})
export class SiteAddPage {
  @ViewChild(Content) content: Content;
  loading:Loading;
  siteform: any = {};
  states:any =[];
  state_list:any =[];
  districts: any = [];
  citys: any = [];
  image = new FormData();
  filter: any = {};
  Architect_list:any =[];
  uploadurl: any = "";
  cam:any="";
  gal:any="";
  cancl:any="";
  ok:any="";
  upl_file:any="";
  save_succ:any="";
selImages:any =[];
update_succ:any="";
flag:boolean=true;  
saveFlag:boolean=false;  
district_list: any = [];
city_list: any = [];
pincode_list: any = [];
userType:any ="";
  id: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,public service:DbserviceProvider , public loadingCtrl:LoadingController,public actionSheetController: ActionSheetController,public toastCtrl: ToastController,private camera: Camera,public translate:TranslateService,public alertCtrl: AlertController, public constant: ConstantProvider ) {
    this.uploadurl = this.constant.upload_url;
    this.userType = navParams.get('user_type');
    this.id = navParams.get('id');


    this.getstatelist();
    if(navParams.data.data){
      console.log(navParams.data.data);
      
      this.siteform = navParams.data.data;
      this.siteform.city
      this.siteform = JSON.parse(JSON.stringify(navParams.data.data));
     
this.siteform.id = this.siteform.id;
console.log(this.siteform.id);

      for(let i=0; i<this.siteform.image.length ;i++)
      {
        // if( parseInt( this.siteform.images[i].profile ) == 1  )
        this.selImages.push({"image":this.siteform.image[i].image_name,"id":this.siteform.image[i].id} );
      }
      console.log(this.selImages);
      
    }

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SiteAddPage');
    
     if (this.siteform.state) {
            this.getaddress(this.siteform.pincode)
            this.getDistrictList(this.siteform.state);
            this.getArchitectlist(this.siteform.state)
        }
      this.translate.get("Camera")
      .subscribe(resp=>{
        this.cam = resp
      });
      
      this.translate.get("Gallery")
      .subscribe(resp=>{
        this.gal = resp
      });
      
      this.translate.get("Cancel")
      .subscribe(resp=>{
        this.cancl = resp
      });
      
      this.translate.get("OK")
      .subscribe(resp=>{
        this.ok = resp
      });
      
      this.translate.get("Upload File")
      .subscribe(resp=>{
        this.upl_file = resp
      });
      
      this.translate.get("Save Successfully")
      .subscribe(resp=>{
        this.save_succ = resp
      });
      
      this.translate.get("Updated Successfully")
      .subscribe(resp=>{
        this.update_succ = resp
      });
    
  }



  showUpdate(text)
  {
    this.translate.get("Success")
    .subscribe(resp=>{
      let alert = this.alertCtrl.create({
        title:resp+'',
        cssClass:'action-close',
        subTitle: text,
        buttons: [this.ok]
      });
      alert.present();
    })
  }

  getArchitectlist(state) {
    console.log(state);

    this.filter.limit = 0;
    this.filter.state = state;
   

        this.service.post_rqst({ 'filter': this.filter }, 'app_master/Architect_list').subscribe(r => {
            this.Architect_list = r.architect_user;
            console.log(this.Architect_list);
           


            // let index=this.Architect_list.filter(row=> row.id==this.navParams.data.data.architect_id)
            // console.log(index);
            // if(index != -1 ){
            //     console.log(this.Architect_list[index]);
            //     this.siteform.architect_id=this.Architect_list[index];
            //     console.log(this.siteform.architect_id);
      
            // }

            if(r.sales_user = []){
                this.siteform.architect_id ='';
                
            }
            
            let index=this.Architect_list.findIndex(row=> row.id==this.navParams.data.data.architect_id )
            console.log(index);
            if(index != -1 ){
                console.log(this.Architect_list[index]);
                this.siteform.architect_id=this.Architect_list[index];
                console.log(this.siteform.architect_id);
      
            }


        });
        // this.loading.dismiss();



}


openeditprofile() {
  let actionsheet = this.actionSheetController.create({
      title: "Profile photo",
      cssClass: 'cs-actionsheet',

      buttons: [{
          cssClass: 'sheet-m',
          text: this.cam,
          icon: 'camera',
          handler: () => {
              console.log("Camera Clicked");
              this.takePhoto();
          }
      },
      {
          cssClass: 'sheet-m1',
          text: this.gal,
          icon: 'image',
          handler: () => {
              console.log("Gallery Clicked");
              this.getImage();
          }
      },
      {
          cssClass: 'cs-cancel',
          text: this.cancl,
          role: 'cancel',
          handler: () => {
              this.siteform.profile_edit_id = this.siteform.id;
              console.log('Cancel clicked');
          }
      }
      ]
  });
  actionsheet.present();
}
takePhoto() {
  console.log("i am in camera function");
  const options: CameraOptions = {
      quality: 70,
      destinationType: this.camera.DestinationType.DATA_URL,
      targetWidth: 500,
      targetHeight: 400,
      cameraDirection: 1,
      correctOrientation: true
  }

  console.log(options);
  this.camera.getPicture(options).then((imageData) => {
    this.flag=false;
    this.selImages.id ='';
    this.siteform.image = 'data:image/jpeg;base64,' + imageData;
    this.selImages.push({"image":this.siteform.image});
    this.siteform.images = this.selImages;
    console.log(this.siteform, 'line number 309');
    this.siteform.image='';

  }, (err) => {
  });
}
getImage() {
  const options: CameraOptions = {
      quality: 70,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      saveToPhotoAlbum: false
  }
  console.log(options);
  this.camera.getPicture(options).then((imageData) => {
    this.flag=false;
    this.siteform.image = 'data:image/jpeg;base64,' + imageData;
    this.selImages.push({"image":this.siteform.image});
    this.siteform.images = this.selImages;
    console.log(this.siteform, 'line number 309');
  }, (err) => {
  });
}

presentToast(msg) {
  console.log(msg);
  const toast = this.toastCtrl.create({
    message: msg,
    duration: 3000
  });
  toast.present();
}
presentLoading() 
{
  this.translate.get("Please wait...")
  .subscribe(resp=>{
    this.loading = this.loadingCtrl.create({
      content: resp,
      dismissOnPageChange: false
    });
    this.loading.present();
  })
}


remove_image(i:any)
{
  console.log(i);
  this.selImages.splice(i,1);
  console.log(this.selImages);
  
}



getaddress(pincode) {
  console.log(pincode)
  // if (pincode.length == 6) {
      console.log(pincode.length);
      this.service.post_rqst({ 'pincode': pincode }, 'app_karigar/getAddress')
          .subscribe((result) => {
              console.log(result);
              var address = result.address;

              if (address != null) {
                  this.siteform.state = result.address.state_name;
                  this.getDistrictList(this.siteform.state);
                  this.getArchitectlist(this.siteform.state);
                  this.siteform.district = result.address.district_name;
                   this.getCityList(this.siteform.district);

                  console.log(result.address.city);
                  this.siteform.city = result.address.city;
                  console.log(this.siteform.city);
              }
              else if (address == null) {
                 
                  this.RequiredAlert("Please Enter Valid Pincode");
                  this.siteform.state = '';
                  this.siteform.district = '';
                  this.siteform.city = '';
                  this.siteform.sales_user_id ='';
                  return;
              }
          });
  // }

}


RequiredAlert(text) {
  let alert = this.alertCtrl.create({
      title: 'Alert!',
      cssClass: 'action-close',
      subTitle: text,
      buttons: ['OK']
  });
  alert.present();
}


getstatelist() {
  this.service.get_rqst('app_master/getStates').subscribe(r => {
      console.log(r);
      this.state_list = r['states'];
      // this.karigar_id = r['id'];
      console.log(this.state_list);
  });
}
getDistrictList(state_name) {
  console.log(state_name);
  this.service.post_rqst({ 'state_name': state_name }, 'app_master/getDistrict')
      .subscribe((r) => {
          console.log(r);
          this.district_list = r['districts'];
          console.log(this.state_list);
      });
      
}

getCityList(district_name) {
  console.log(district_name);
  this.service.post_rqst({ 'district_name': district_name }, 'app_master/getCity')
      .subscribe((r) => {
          console.log(r);
          this.city_list = r['cities'];

          // let index=this.city_list.findIndex(row=> row.id==this.navParams.data.data.city )
          // console.log(index);
          // if(index != -1 ){
          //     console.log(this.city_list[index]);
          //     this.siteform.city=this.city_list[index];
          //     console.log(this.siteform.city);
    
          // }
          this.pincode_list = r['pins'];
          console.log(this.pincode_list);
      });
}


// getArchitect_id(id){
//   console.log(id);
//   this.siteform.architect_id = id;
    
//   }

submit(){
  
  // if(this.selImages.length <= 0){
  //   this.presentToast('Please upload atleast one picture');
  //   return
  // }


  // for(let i=0; i<this.siteform.architect_id.length;i++ ){
  //   this.siteform.architect_id = this.siteform.architect_id[i].id;
  // }
  if(this.siteform.id){
    this.siteform.site_location_id = this.siteform.id;

  }
  this.siteform.architect_id = this.siteform.architect_id.id;
  this.siteform.sales_user_id = this.service.karigar_id;  

  this.saveFlag = true;
  this.presentLoading();
  this.service.post_rqst( {'data':this.siteform},'app_master/siteLocationAdd ').subscribe( r =>
    {
      if(r['status'] == 'SUCCESS'){
        this.loading.dismiss();
        this.showUpdate("Site Add Successfully");
        // this.navCtrl.popTo(SiteListPage);
        this.navCtrl.push(SiteListPage,{'user_type': this.userType});

      }
      else if(r['status'] == 'UPDATED'){
        this.loading.dismiss();
        this.showUpdate("Site Update Successfully");
        this.navCtrl.push(SiteDetailPage,{'id':this.id,'user_type': this.userType });
        return
      }
    });
  }
  
  deleteImage(index,data)
  {
    console.log(data);
    
    this.service.post_rqst({"id":data},"app_master/deleteSiteLocationImage")
    .subscribe(resp=>{
      console.log(resp);
      this.selImages.splice(index,1)
    });
  }
  
  showConfirm(index,data) {
    const confirm = this.alertCtrl.create({
      title: 'Are you sure?',
      message: 'You want to delete this!',
      buttons: [
        {
          text: 'No, cancel!',
          handler: () => {
          }
        },
        {
          text: 'Yes, delete!',
          handler: () => {
            this.deleteImage(index,data);
          }
        }
      ]
    });
    confirm.present();
  }


  numeric_Number(event: any) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

}
