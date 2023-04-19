import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, Loading, LoadingController, NavController, NavParams } from 'ionic-angular';
import { ConstantProvider } from '../../providers/constant/constant';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';

/**
* Generated class for the Super30Page page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-super30',
  templateUrl: 'super30.html',
})
export class Super30Page {
  
  leaderBoard:any =[];
  leaderBoardRetailer:any =[];
  loading:Loading;
  userType:any;
  filter:any ={};
  first_user:any ={};
  second_user:any ={};
  third_user:any ={}; 
  uploadUrl:any;
  user_id :any= '';

  
  constructor(public navCtrl: NavController, public constant: ConstantProvider, public loadingCtrl:LoadingController, public translate:TranslateService, public navParams: NavParams, public service:DbserviceProvider) {
    this.uploadUrl = this.constant.upload_url;
    this.userType = navParams.data.user_type;
    this.user_id = navParams.data.user_id;
    this.getSuper30();
  }
  
  ionViewDidLoad() {
    this.presentLoading();
  }
  
  
  presentLoading() 
  {
      this.translate.get('Please wait...')
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
    this.getSuper30();
    refresher.complete();
  }
  getSuper30()
  {
    this.filter.user_type = this.userType
    this.service.post_rqst( {"filter":this.filter},'app_karigar/getSuperkarigars').subscribe( res =>
      {
        this.loading.dismiss();
        this.first_user = res['super_karigars'][0];
        console.log(this.first_user);
        
        this.second_user = res['super_karigars'][1];
        this.third_user = res['super_karigars'][2];
        this.leaderBoard = res.super_karigars;


      });
    }
    
  }
  