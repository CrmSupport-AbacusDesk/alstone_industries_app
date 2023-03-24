// import { ArchitectAddPage } from './../architect-add/architect-add';
import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, Loading, LoadingController, NavController, NavParams } from 'ionic-angular';
import { ConstantProvider } from '../../providers/constant/constant';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';

/**
 * Generated class for the ArchitectDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-architect-detail',
  templateUrl: 'architect-detail.html',
})
export class ArchitectDetailPage { 
  karigar_detail:any={};
  loading:Loading;
  karigar_id: any;
  uploadUrl:any="";

  constructor(public navCtrl: NavController, public navParams: NavParams,public service:DbserviceProvider,public con:ConstantProvider,public loadingCtrl:LoadingController, public translate:TranslateService) {
    this.karigar_id = this.navParams.get('id');
    this.uploadUrl = this.con.upload_url;


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ArchitectDetailPage');

  }

  ionViewWillEnter()
  {
    this.presentLoading();
      this.getKarigarDetail();
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
  updateProfile()
  {
      this.karigar_detail.edit_profile= 'edit_profile';
      console.log(this.karigar_detail);
      
      // this.navCtrl.push(ArchitectAddPage,{'data':this.karigar_detail})
  }

  filter : any={};
  getKarigarDetail()
  {
      console.log('karigar');
      this.service.post_rqst( {'karigar_id': this.karigar_id },'app_master/getSalesUserArchitectDetail')
      .subscribe((r) =>
      {
          console.log(r);
          this.loading.dismiss();
          this.karigar_detail=r.architect;
          console.log(this.karigar_detail);

      });
  }

}
