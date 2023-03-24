import { DbserviceProvider } from './../../providers/dbservice/dbservice';
import { Component } from '@angular/core';
import { IonicPage, Loading, LoadingController, ModalController, NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { ConstantProvider } from '../../providers/constant/constant';
import { SiteAddPage } from '../site-add/site-add';
import { ViewProfilePage } from '../view-profile/view-profile';

/**
 * Generated class for the SiteDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-site-detail',
  templateUrl: 'site-detail.html',
})
export class SiteDetailPage {
  loading:Loading;
  getData:any = {};
  id:any;
  uploadUrl:any="";
  user:any = [];
  selImages=[];
  clubAddress:any ={}
  details: string = "basic";
  filter:any = {};
  userType:any ="";

  constructor(public navCtrl: NavController, public constant: ConstantProvider, public navParams: NavParams,public service : DbserviceProvider, public modalCtrl:ModalController,public loadingCtrl:LoadingController, public translate:TranslateService ) {
    this.id = this.navParams.get('id');
    this.uploadUrl = this.constant.upload_url;
    this.userType = navParams.get('user_type');

    this.presentLoading();
    this.siteDetail();
    this.purchaseList('');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SiteDetailPage');
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

  viewProfiePic(id, name, type, add, date)
  {
    this.modalCtrl.create(ViewProfilePage, {"id": id,"Image": name, "type":type, 'address':add, 'date':date}).present();
  }

  siteDetail(){
    
    
    this.service.post_rqst( { 'site_location_id': this.id}, 'app_master/siteLocationDetail').subscribe( r =>
      {
        this.loading.dismiss();
        this.getData = r.site_locations;
        this.user = r.site_locations.salesuser_id;
        this.selImages = r.site_locations.image;
        this.clubAddress = this.getData.address + ', ' + this.getData.district + ', ' + this.getData.state + ', ' + this.getData.site_owner_name + ', ' + this.getData.site_owner_contact
      });
      
    }
    data:any =[];
    flag:any='';

    purchaseList(search){
      this.filter.limit = 0;
      this.filter.search=search;
      this.filter.karigar_id = this.service.karigar_id;
      
      this.service.post_rqst( { 'filter': this.filter, 'site_location_id':this.id}, 'app_master/getSitePurchaseOrder').subscribe( r =>
        {
          console.log(r);
          this.loading.dismiss();
          
          this.data = r.purchase_orders;

          // this.data.forEach(item => {
          //   if(item.verify_at == 'Dealer') item.user_type = 2;
          //   if(item.verify_at == 'SalesTeam') item.user_type = 3;
          // });
          console.log(this.data);
          
          this.filter.mode = 1;
        });
        
      }

    doRefresh(refresher) 
      {
        this.siteDetail();
        this.purchaseList(''); 
        refresher.complete();
      }
      
      loadData(infiniteScroll)
      {
        console.log('loading');
        this.filter.limit=this.data.length;
        // this.filter.pc_id = this.service.karigar_id;
        this.service.post_rqst({'filter' : this.filter, 'site_location_id':this.id},'app_master/getSitePurchaseOrder')
        .subscribe( (r) =>
        {
          console.log(r);
          if(r['categories']=='')
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
    editDetail()
    {
      
      this.getData.edit_profile= 'edit_profile';
      this.navCtrl.push(SiteAddPage, {'data':this.getData,'id':this.id,'user_type':this.userType});
    }
}
