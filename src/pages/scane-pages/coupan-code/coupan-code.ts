import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { DbserviceProvider } from '../../../providers/dbservice/dbservice';
import { TabsPage } from '../../tabs/tabs';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { HomePage } from '../../home/home';
import { Geolocation } from '@ionic-native/geolocation';
import { LocationAccuracy } from '@ionic-native/location-accuracy';



@IonicPage()
@Component({
  selector: 'page-coupan-code',
  templateUrl: 'coupan-code.html',
})
export class CoupanCodePage {
  
  qr_code:any='';
  data:any={};
  flag:any='';
  
  constructor(public navCtrl: NavController,public locationaccuracy: LocationAccuracy,private geolocation: Geolocation, public navParams: NavParams,public service:DbserviceProvider,public alertCtrl:AlertController,private barcodeScanner: BarcodeScanner) {
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad CoupanCodePage');
  }
  lat:any;
    long:any;
  submit(data)
  {

    this.locationaccuracy.request(this.locationaccuracy.REQUEST_PRIORITY_HIGH_ACCURACY)
    .then(() => {
        let options = {
            maximumAge: 10000, timeout: 15000, enableHighAccuracy: true
        };
        this.geolocation.getCurrentPosition(options)
        .then((resp) => {
            this.lat = resp.coords.latitude
            this.long = resp.coords.longitude
            console.log(this.lat);
            //  this.getgeocode();
            
            if(this.lat == null && this.long == null){
                console.log("null lat",this.lat);
                
            }  
        },
        error => {
            console.log('Error requesting location permissions', error);
            if(error){
                let alert = this.alertCtrl.create({
                    title:'Alert!',
                    cssClass:'action-close',
                    subTitle:"Enable to get your location so, can't scan",
                    buttons: ['OK']
                });
                alert.present();  
            }
            
        });
    });
    this.flag=1;
    console.log(data);
    this.qr_code=data;
    this.service.post_rqst({'karigar_id':this.service.karigar_id,'qr_code':this.qr_code,'coupon_scan_lat':this.lat,'coupon_scan_long':this.long },'app_karigar/karigarCoupon').subscribe((r:any)=>
    {
      console.log(r);
      
      if(r['status'] == 'BLANK'){
        this.showAlert("This Coupon Code doesn't contain any Value");
        return;
      }
      else if(r['status'] == 'INVALID'){
        this.showAlert("Invalid Coupon Code");
        return;
      }
      else if(r['status'] == 'REQUIRED'){
        this.showAlert("Please Enter Coupon Code");
        return;
      }
      else if(r['status'] == 'USED'){
        this.showAlert("Coupon Already Used");
        return;
      }
      else if(r['status'] == 'UNASSIGNED OFFER'){
        this.showAlert("Your Account Under Verification");
        return;
      }
      else if (r['status'] == 'product_point_not_exist') {
        this.showAlert("Point not exist on this coupon");
        return;
    }
      this.showSuccess( r['coupon_value'] +" points has been added into your wallet")
      // this.navCtrl.setRoot(TabsPage,{index:'0'});
      this.navCtrl.push(HomePage);
    });
  }
  scan()
  {
    
    this.barcodeScanner.scan().then(resp => {
      console.log(resp);
      this.qr_code=resp.text;
      console.log( this.qr_code);
      if(resp.text != '')
      {
        this.service.post_rqst({'karigar_id':this.service.karigar_id,'qr_code':this.qr_code},'app_karigar/karigarCoupon').subscribe((r:any)=>
        {
          console.log(r);
          
          if(r['status'] == 'INVALID'){
            this.showAlert("Invalid Coupon Code");
            return;
          }
          else if(r['status'] == 'USED'){
            this.showAlert("Coupon Already Used");
            return;
          }
          else if(r['status'] == 'UNASSIGNED OFFER'){
            this.showAlert("Invalid Coupon Code");
            return;
          }
          else if(r['status'] == 'REQUIRED'){
            this.showAlert("Please Enter the coupon code ");
            return;
          }
          this.showSuccess( r['coupon_value'] +" points has been added into your wallet")
          // this.navCtrl.setRoot(TabsPage,{index:'0'});
          this.navCtrl.push(TabsPage);
        });
      }
      else
      {
        console.log('not scanned anything');
      }
    });      
  }
  showAlert(text)
  {
    let alert = this.alertCtrl.create({
      title:'Alert!',
      cssClass:'action-close',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present();
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
}
