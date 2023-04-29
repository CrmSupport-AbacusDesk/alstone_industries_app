import { Camera, CameraOptions } from '@ionic-native/camera';
import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, Loading, LoadingController, NavController, NavParams, ToastController, ActionSheetController, AlertController } from 'ionic-angular';
import { DbserviceProvider } from '../../../providers/dbservice/dbservice';
import { ContractorListPage } from '../contractor-list/contractor-list';

/**
* Generated class for the ContractorAddPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-contractor-add',
  templateUrl: 'contractor-add.html',
})
export class ContractorAddPage {
  
  conData:any={};
  conData1:any={};
  today_date=new Date().toISOString().slice(0,10);
  todayDate:any
  contractorData:any =[];
  loading:Loading;
  flag:any='';
  pointValue:any ={};
  saveFlag : boolean = false;
  cam:any="";
    gal:any="";
    cancl:any="";
    ok:any="";
    upl_file:any="";
    save_succ:any="";
userType:any ="";
architect_id:any;
  constructor(public navCtrl: NavController, public navParams: NavParams,private camera: Camera, public actionSheetController: ActionSheetController,public alertCtrl: AlertController, public toastCtrl: ToastController, public dbService:DbserviceProvider, public loadingCtrl:LoadingController, public translate:TranslateService) {
    // this.dbService.karigar_id;
   
    this.userType = navParams.get('user_type');

console.log(navParams.data.data);

    if(navParams.data.data){
      this.purchaseform = JSON.parse(JSON.stringify(navParams.data.data));
      console.log(this.purchaseform);
      this.purchaseform.purchase_order_id  = this.purchaseform.id;
      this.architect_id  = this.purchaseform.architect_id;
      this.purchaseform.site_location_id={};
      this.purchaseform.site_location_id['address']=navParams.data.data.address;
      this.purchaseform.site_location_id['id']=navParams.data.data.site_location_id;
      // this.purchaseform.architect_id={};
      // this.purchaseform.architect_id['full_name']= navParams.data.data.architect_name;
      // console.log(this.purchaseform.architect_id['full_name']);
      // this.purchaseform.architect_id['architect_id']=navParams.data.data.architect_id;
      // console.log(this.purchaseform.architect_id);
      // this.purchaseform.architect_id={
      //   'full_name':navParams.data.data.architect_name,
      //   'architect_id':navParams.data.data.architect_id,
      //   'architect_contact':navParams.data.data.architect_contact,

      // }
      // this.purchaseform.dealer_id['id']=navParams.data.data.dealer_id;
      // this.siteList()
      
      
      // this.getDealer(this.siteform.sales_zone);
    }
  }
  
  ionViewDidLoad() {
    // this.distributorList();
    // this.getCategory();
    // this.getProduct();
    
    this.siteList();
    this.getProducts();
    this.getArchitectlist(this.architect_id);
   
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
    
  }
  
  presentToast() {
    const toast = this.toastCtrl.create({
      message: 'Delete successfully',
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
  
  category:any=[];
  getCategory()
  {
    this.dbService.get_rqst('app_karigar/getCategory')
    .subscribe(d => {
      console.log(d);
      this.category = d.category;
      console.log(this.category);
    });
  }
  
  product_code:any =[]
  
  getProduct(){
    // let id
    // id = val.id
    // console.log(id);
    
    // this.conData1.product_point_group = val.product_point_group;
    this.dbService.post_rqst( {}, 'app_karigar/getProduct?page=').subscribe(r=>{
      console.log(r);
      this.product_code=r['productData'];
      console.log(this.product_code);
    })
  }
  
  
  product_size:any =[]
  
  getSize(val){
    let id
    id = val.id;
    this.conData1.product_name = val.product_name;
    this.dbService.post_rqst( {'product_id':id}, 'app_karigar/coupon_product_size?page=').subscribe(r=>{
      console.log(r);
      this.product_size=r['product_sizes'];
    })
  }
  
  
   // let getData
    // getData = this.product_code.filter( x => x.id==event.value)[0];
  
  getpoint(point){
    console.log(point);
   
    this.pointValue  = point;
    
    console.log(this.pointValue);
    
    
  }
  
  
  
  
  addItem()
  {
    // let val=JSON.parse(JSON.stringify(this.conData1));
    // console.log(val);
    // if(this.conData1.product_point_group!='' && this.conData1.qty!='' ){
    //   this.contractorData.push(val);
    // }

    if(this.contractorData.length <=0){
      this.contractorData.push(JSON.parse(JSON.stringify(this.conData1)))
      this.conData1.product_point_group='';
      this.conData1.qty='';
    }
      
    else{
      let isExistIndex:any;
      isExistIndex=this.contractorData.findIndex(row=>row.product_point_group==this.conData1.product_point_group);
      if(isExistIndex == -1){
        this.contractorData.push(JSON.parse(JSON.stringify(this.conData1)))
        this.conData1.product_point_group='';
        this.conData1.qty='';

      }
      else{
          this.contractorData[isExistIndex].qty= parseInt(this.contractorData[isExistIndex].qty)+parseInt(this.conData1.qty)
          this.conData1.product_point_group='';
          this.conData1.qty='';
  
      }
    }
  
    
  }
  
  totalPoint(event){
    console.log(event);
    this.conData1.totalPoint =  event * this.pointValue;
    console.log( this.conData1.totalPoint);
    
  }
  
  
  deleteItem(i)
  {
    this.contractorData.splice(i,1);
    this.presentToast();
  }
  
  
  
  onUploadChange(evt: any) {
    // this.flag=false;
    // const file = evt.target.files[0];
    
    // if (file) {
    //   const reader = new FileReader();
    
    //   reader.onload = this.handleReaderLoaded.bind(this);
    //   reader.readAsBinaryString(file);
    // }
    let actionsheet = this.actionSheetController.create({
      title:" Upload File",
      cssClass: 'cs-actionsheet',
      
      buttons:[{
        cssClass: 'sheet-m',
        text: 'Camera',
        icon:'camera',
        handler: () => {
          console.log("Camera Clicked");
          this.takeDocPhoto();
        }
      },
      {
        cssClass: 'sheet-m1',
        text: 'Gallery',
        icon:'image',
        handler: () => {
          console.log("Gallery Clicked");
          this.getDocImage();
        }
      },
      {
        cssClass: 'cs-cancel',
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }
    ]
  });
  actionsheet.present();
}


takeDocPhoto()
{
  console.log("i am in camera function");
  const options: CameraOptions = {
    quality: 90,
    destinationType: this.camera.DestinationType.DATA_URL,
    // allowEdit:true,
    targetWidth : 1050,
    targetHeight : 1000,
    cameraDirection: 1,
    correctOrientation:true,
  }
  
  console.log(options);
  this.camera.getPicture(options).then((imageData) => {
    this.flag=false;
    this.conData1.image = 'data:image/jpeg;base64,' + imageData;
    console.log(this.conData1.image, 'line number 236');
  }, (err) => {
  });
}
getDocImage()
{
  const options: CameraOptions = {
    quality: 70,
    destinationType: this.camera.DestinationType.DATA_URL,
    sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
    saveToPhotoAlbum:false
  }
  console.log(options);
  this.camera.getPicture(options).then((imageData) => {
    this.flag=false;
    this.conData1.image = 'data:image/jpeg;base64,' + imageData;
    console.log(this.conData1.image, 'line number 252');
  }, (err) => {
  });
}

alertToast(msg){
  const toast = this.toastCtrl.create({
    message: msg,
    duration: 3000
  });
  toast.present();
}





image_data:any=[];
                
                
fileChange(image)
{
  
  this.image_data.push({'image':image});
  console.log(this.image_data);
  this.image = '';
}

remove_image(i:any)
{
  this.image_data.splice(i,1);
}


captureImage()
{
  let actionsheet = this.actionSheetController.create({
    title:"Bill Upload Media",
    cssClass: 'cs-actionsheet',
    
    buttons:[{
      cssClass: 'sheet-m',
      text: 'Camera',
      icon:'camera',
      handler: () => {
        console.log("Camera Clicked");
        
        this.takePhoto1();
      }
    },
    {
      cssClass: 'sheet-m1',
      text: 'Gallery',
      icon:'image',
      handler: () => {
        console.log("Gallery Clicked");
        this.getImage1();
      }
    },
    {
      cssClass: 'cs-cancel',
      text: 'Cancel',
      role: 'cancel',
      icon:'cancel',
      handler: () => {
        console.log('Cancel clicked');
      }
    }
  ]
});
actionsheet.present();
}



image:any;
takePhoto1()
{
console.log("i am in camera function");
const options: CameraOptions = {
  quality: 100,
  destinationType: this.camera.DestinationType.DATA_URL,
  targetWidth : 1000,
  targetHeight : 1000
}

console.log(options);
this.camera.getPicture(options).then((imageData) => {
  this.image = 'data:image/jpeg;base64,' + imageData;
//   this.image=  imageData;
  console.log(this.image);
  if(this.image)
  {
    this.fileChange(this.image);
  }
}, (err) => {
});
}
getImage1()
{
const options: CameraOptions = {
  quality: 70,
  destinationType: this.camera.DestinationType.DATA_URL,
  sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
  saveToPhotoAlbum:false
}
console.log(options);
this.camera.getPicture(options).then((imageData) => {
  this.image= 'data:image/jpeg;base64,' + imageData;
//   this.image=  imageData;
//   this.image= imageData.substr(imageData.lastIndexOf('/') + 1);
  console.log(this.image);
  if(this.image)
  {
    this.fileChange(this.image);
  }
}, (err) => {
});
}



submit2(){
 
   
  if(this.contractorData < 1){
      this.alertToast('Please add one item at least!')
      return
     }

    //    if(this.conData1.image=='' || this.conData1.image == undefined){
    //   this.alertToast('Bill image required')
    //   return
    // }
  this.presentLoading();
  this.saveFlag = true;
  this.conData1.part = this.contractorData;
  this.conData1.dealer_id = this.dbService.karigar_id;
  this.conData1.image = this.image_data?this.image_data:[];
  this.dbService.post_rqst( this.conData1,'app_karigar/add_contractor_request ').subscribe( r =>
    {
      console.log(r);
      if(r['status'] == 'SUCCESS'){
        this.loading.dismiss();
        this.showSuccess("Purchase Add Successfully");
        this.navCtrl.popTo(ContractorListPage);
      }
      else{
        this.loading.dismiss();
      this.alertToast('SomeThing Went Wrong!')
      }
    });
  }
  filter:any={};
  distributor_list:any=[];
  distributorList(){
    
   
  
    this.dbService.post_rqst( {'filter':this.filter,'karigar_id': this.dbService.karigar_id},'app_karigar/distributorList').subscribe( r =>
      {
        console.log(r);
        this.distributor_list=r['karigars'];
  
      });
    }


    showSuccess(text)
    {
        let alert = this.alertCtrl.create({
            title:'Success!',
            cssClass:'action-close',
            subTitle: text,
            buttons: ['OK']
        });
        alert.present();
    }
  
  MobileNumber(event: any) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  
// purchase request
content:any="";
Architect_list:any =[];
purchaseform: any = {};
locations:any =[];
products: any = [];
update_succ:any="";

siteList(){
  this.filter.limit = 0;
  this.filter.sales_user_id = this.dbService.karigar_id;
  this.dbService.post_rqst( { 'filter': this.filter}, 'app_master/getSites').subscribe( r =>
    {
      console.log(r);
      this.locations = r.site_locations;
      // this.getArchitectlist(this.locations.architect_id,'')
     // let index=this.locations.findIndex(row=> row.architect_id==this.navParams.data.data.architect_id )
      // console.log(index);
      // if(index != -1 ){
      //     console.log(this.locations[index]);
      //     this.purchaseform.architect_id=this.locations[index];
      //     console.log(this.purchaseform.architect_id);

      // }
    });
    return this.locations
  }

  getArchitectlist(id) {
    console.log(id);
    this.filter.limit = 0;
   this.filter.architect_id = id;

        this.dbService.post_rqst({ 'filter': this.filter }, 'app_master/Architect_list').subscribe(r => {
            this.Architect_list = r.architect_user;
            console.log(this.Architect_list);
            if(r.sales_user = []){
              this.purchaseform.architect_id ='';
              
          }
          if(this.navParams.data ){
            let index=this.Architect_list.findIndex(row=> row.id==this.navParams.data.data.architect_id )
            console.log(index);
            if(index != -1 ){
                console.log(this.Architect_list[index]);
                this.purchaseform.architect_id=this.Architect_list[index];
                console.log(this.purchaseform.architect_id);
      
            }
          }

           



        });
        // this.loading.dismiss();



}
  getProducts(){
    this.dbService.post_rqst({}, 'app_master/getProducts')
    .subscribe(d => { 
      console.log(d);
      this.products = d.products;
      if(this.navParams.data){
        let index=this.products.findIndex(row=> row.id==this.navParams.data.data.product_id )
        console.log(index);
        if(index != -1 ){
            console.log(this.products[index]);
            this.purchaseform.product_id=this.products[index];
            console.log(this.purchaseform.product_id);
  
        }
      }
     



      // let index=this.products.filter(row=> row.id==this.navParams.data.data.product_id )
      // console.log(index);
      
      // this.purchaseform.product_id = index[0].product_point_group;
    });
  }

      
  showAlert(text) {
    let alert = this.alertCtrl.create({
      title:'Alert!',
      cssClass:'action-close',
      subTitle: text,
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          this.purchaseform.qty = ''
        }
      },
      {
        text:'OK',
        cssClass: 'close-action-sheet',
        handler:()=>{
          this.purchaseform.qty = ''
        }
      }]
    });
    alert.present();
  }  

  checkValue(value){
    if(value <= 0){
      this.translate.get("Quantity value is invaild")
      .subscribe(resp=>{
        this.content = resp;
      })
      this.showAlert(this.content);
      return
    }
  }

  showUpdate(text)
  {
    this.translate.get("Success")
    .subscribe(resp=>{
      let alert = this.alertCtrl.create({
        title:resp+'!',
        cssClass:'action-close',
        subTitle: text,
        buttons: [this.ok]
      });
      alert.present();
    })
  }


  submit(){
   
      this.purchaseform.sales_user_id = this.dbService.karigar_id;
    this.purchaseform.site_location_id = this.purchaseform.site_location_id.id;
    this.purchaseform.architect_id = this.purchaseform.architect_id.id;
    this.purchaseform.product_id = this.purchaseform.product_id.id;


    
    this.saveFlag = true;
    this.presentLoading();
    
    this.dbService.post_rqst( {'data':this.purchaseform},'app_master/addPurchaseOrder').subscribe( r =>
      {
        if(r['status'] == 'SUCCESS'){
          this.showUpdate(this.save_succ+"Purchase save successfully");
          this.loading.dismiss();
          
          this.navCtrl.popTo(ContractorListPage);
        }
        else if(r['status'] == 'UPDATED'){
          this.showUpdate(this.update_succ+"Purchase update successfully");
          this.loading.dismiss();
          this.navCtrl.popTo(ContractorListPage);
        }
      });
    }
    






}
