import { ContractorAddPage } from './../contractor-add/contractor-add';
import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, Loading, LoadingController, NavController, NavParams } from 'ionic-angular';
import { ConstantProvider } from '../../../providers/constant/constant';
import { DbserviceProvider } from '../../../providers/dbservice/dbservice';

/**
* Generated class for the ContractorDetailPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-contractor-detail',
  templateUrl: 'contractor-detail.html',
})
export class ContractorDetailPage {
  id:any
  conDetail:any = {};
  productData:any =[]
  productDataImg:any =[]
  userType:any ="";
  loading:Loading;
  upload_url:any =''
  constructor(public navCtrl: NavController,  public cons: ConstantProvider, public navParams: NavParams, public dbService:DbserviceProvider, public loadingCtrl:LoadingController, public translate:TranslateService) {
  
    this.upload_url = cons.upload_url;
    this.userType = navParams.get('user_type');

  }
  
  ionViewDidLoad() {
    this.id = this.navParams.get('id');
    this.presentLoading();
    // this.PurchaseDetail();
    this.contractorDetail();
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
  
  
  contractorDetail(){
    this.dbService.post_rqst( {'id':this.id}, 'app_karigar/get_contractor_request_detail').subscribe( r =>
      {
        this.loading.dismiss();
        this.conDetail = r.request_detail[0];
        console.log(this.conDetail);
        this.productData = this.conDetail.parts;
        console.log(this.productData);
        this.productDataImg = this.conDetail.image;
        console.log(this.productDataImg);
        


      });
    }

    getData:any = {};

    // PurchaseDetail(){
    
    
    //   this.dbService.post_rqst( { 'purchase_id': this.id, 'karigar_id': this.dbService.karigar_id}, 'app_master/purchaseDetail').subscribe( r =>
    //     {
    //       this.loading.dismiss();
    //       this.getData = r.purchase_order;
    //     });
        
    //   }


         
    editDetail()
    {
      
      this.getData.edit_profile= 'edit_profile';
      this.navCtrl.push(ContractorAddPage, {'data':this.getData, 'user_type':this.userType});
    }
  }
  