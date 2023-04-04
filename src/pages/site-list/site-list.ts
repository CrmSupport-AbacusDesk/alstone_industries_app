import { SiteAddPage } from './../site-add/site-add';
import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, Loading, LoadingController, NavController, NavParams } from 'ionic-angular';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { SiteDetailPage } from '../site-detail/site-detail';

/**
 * Generated class for the SiteListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-site-list',
  templateUrl: 'site-list.html',
})
export class SiteListPage {
  loading:Loading;
  filter:any = {};
  active_count:any =0;
  inactive_count:any =0;
  data:any =[];
  userType:any ="";
  flag:any='';


  constructor(public navCtrl: NavController, public navParams: NavParams, public service:DbserviceProvider, public loadingCtrl:LoadingController,public translate:TranslateService) {
    this.userType = navParams.get('user_type');
    console.log(this.userType);
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SiteListPage');
    this.presentLoading();

  }

  ionViewWillEnter(){
    this.siteList(); 
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

  doRefresh(refresher) 
  {
    this.siteList(); 
    refresher.complete();
  }




  siteList(){
    this.filter.limit = 0;
  if(this.userType == 4){
this.filter.architect_id = this.service.karigar_id;
  }
  if(this.userType == 5){
    this.filter.sales_user_id = this.service.karigar_id;
      }
  
    this.service.post_rqst( { 'filter': this.filter}, 'app_master/siteLocationList').subscribe( r =>
      {
        console.log(r);
        this.loading.dismiss();
        this.data = r.site_locations;
        // console.log(this.data);
        // this.flag = this.data.flag;
        // console.log(this.flag);
        
      });
      
    }
    
    loadData(infiniteScroll)
    {
      console.log('loading');
      this.filter.limit=this.data.length;
      this.service.post_rqst({'filter' : this.filter},'app_master/siteLocationList')
      .subscribe( (r) =>
      {
        console.log(r);
        if(r['site_locations']=='')
        {
          this.flag=1;
        }
        else
        {
          setTimeout(()=>{
            this.data=this.data.concat(r['site_locations']);
            console.log('Asyn operation has stop')
            infiniteScroll.complete();
          },1000);
        }
      });
    }
    
    goOnSiteAdd(){
      this.navCtrl.push(SiteAddPage,{'user_type':this.userType})
    }
    goOnSiteDetail(id){
      this.navCtrl.push(SiteDetailPage, {'id':id, 'user_type':this.userType});
    }
}
