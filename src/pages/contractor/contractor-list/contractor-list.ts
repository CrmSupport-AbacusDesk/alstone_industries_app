import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, Loading, LoadingController, NavController, NavParams } from 'ionic-angular';
import { DbserviceProvider } from '../../../providers/dbservice/dbservice';
import { ContractorAddPage } from '../contractor-add/contractor-add';
import { ContractorDetailPage } from '../contractor-detail/contractor-detail';

/**
* Generated class for the ContractorListPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-contractor-list',
  templateUrl: 'contractor-list.html',
})
export class ContractorListPage {
  data:any =[]; 
  employee_id:any;
  filter:any = {};
  filterType:any ={};

  all_count:any =0;
  pending_count : any = 0;
  verified_count : any = 0;
  reject_count : any = 0;
  loading:Loading;
  userType:any ="";
  details: string = "Pending";


  constructor(public navCtrl: NavController, public navParams: NavParams,public dbService:DbserviceProvider, public loadingCtrl:LoadingController,  public translate:TranslateService) {
    this.filter = this.dbService.get_filters();
    this.userType = navParams.get('user_type');
    // if(this.filter.status == undefined)
    // {
    //   this.filter.status = 'All';
    // }
    // this.PurchaseList(this.details);

  }
  
  

  ionViewDidLoad() {
    this.presentLoading();
    this.PurchaseList(this.details);
  }

  ionViewWillEnter(){
    this.PurchaseList(this.details)
  }
  
  doRefresh (refresher)
  {
      this.PurchaseList(this.details);
      setTimeout(() => {
          refresher.complete();
      }, 1000);
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


  goOnPurchaseAdd(){
    this.navCtrl.push(ContractorAddPage,{'user_type':this.userType});
  }

  goOnPurchaseDetail(id){
    this.navCtrl.push(ContractorDetailPage, {'id':id,'user_type':this.userType});
  }
  
  
  contractorList(status){
    this.filter.mode = 0;
    this.filter.status =  status;
    this.dbService.post_rqst( {'contractor_id':this.dbService.karigar_id, 'filter': this.filter}, 'app_karigar/get_contractor_request').subscribe( r =>
      {
        this.loading.dismiss();
        console.log(r.request_list.data);
        this.data = r.request_list.data;
        this.filter.mode = 1;
        this.all_count = r.all_count;
        this.pending_count = r.pending_count;
        this.verified_count = r.approved_count;
        this.reject_count = r.reject_count;
        
      });
      
    }





    // purchase List

  flag:any='';
    
    loadData(infiniteScroll)
    {
      this.filter.limit=this.data.length;
      this.dbService.post_rqst({'filter' : this.filter},'app_master/purchaseList')
      .subscribe( (r) =>
      {
        console.log(r);
        if(r['purchase_orders']=='')
        {
          this.flag=1;
        }
        else
        {
          setTimeout(()=>{
            this.data=this.data.concat(r['purchase_orders']);
            infiniteScroll.complete();
          },1000);
        }
      });
    }
  
  
    PurchaseList(status){
      this.filter.mode = 0;
      this.filter.limit = 0;
      this.filter.status =  status;
      this.dbService.post_rqst( {'sales_user_id':this.dbService.karigar_id, 'filter': this.filter}, 'app_master/purchaseList').subscribe( r =>
        {
          this.loading.dismiss();
         
          this.data = r.purchase_orders;
          this.filter.mode = 1;
          this.all_count = r.all_count;
          this.pending_count = r.pending_count;
          this.verified_count = r.verified_count;
          this.reject_count = r.rejected_count;
          
        });
        
      }
  

    
  }
  