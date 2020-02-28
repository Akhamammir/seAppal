import { Component, OnInit } from '@angular/core';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { File } from '@ionic-native/file/ngx';
import { Storage } from '@ionic/storage';
import { AlertController } from '@ionic/angular';
@Component({
  selector: 'app-list',
  templateUrl: 'list.page.html',
  styleUrls: ['list.page.scss']
})
export class ListPage implements OnInit {
  lects=[];
  constructor(private fileChooser: FileChooser, private filePath: FilePath, private files:File, private storage: Storage, public alertController: AlertController){}
  async file(){
    this.fileChooser.open().then(uri => {
      this.filePath.resolveNativePath(uri).then(filePath => {
        this.files.readAsText( filePath.substring( 0, filePath.lastIndexOf('/') ), filePath.substring( filePath.lastIndexOf('/')+1, filePath.length) ).then(async result=>{
          const alert = await this.alertController.create({
            header: 'Archivo cargado',
            subHeader: 'Ruta actualizada',
            message: 'La ruta se actualizo con exito.',
            buttons: ['OK']
          });
          result.split("\n").forEach((I, J)=>{
            this.storage.set(''+J, {item:I, read:0, current:0, anoms:['  ','  ','  '], anomstxt:['','','']});
            this.storage.set('Total', J);
          })
          await alert.present();
          this.storage.set('Done', 0);
          this.storage.set('L', '');
          this.storage.set('Route', filePath.substring( filePath.lastIndexOf('/')+2, filePath.length-4))
          this.storage.set('Directory', filePath.substring( 0, filePath.lastIndexOf('/') ) )
        });
      }).catch(err => console.log(err));
    }).catch(e => console.log(e));
  }
  async anomalies(){
    this.fileChooser.open().then(uri => {
      this.filePath.resolveNativePath(uri).then(filePath => {
        this.files.readAsText( filePath.substring( 0, filePath.lastIndexOf('/') ), filePath.substring( filePath.lastIndexOf('/')+1, filePath.length) ).then(async result=>{
          const alert = await this.alertController.create({
            header: 'Archivo cargado',
            subHeader: 'Anomalias actualizadas',
            message: 'El catalogo de anomalias se actualizo con exito.',
            buttons: ['OK']
          });
          result.split("\n").forEach((I, J)=>{
            this.storage.set('a'+(+J+1), I.substring(6, I.length));
            this.storage.set('aTotal', J);
          });
          await alert.present();
        });
      }).catch(err => console.log(err));
    }).catch(e => console.log(e));
  }
  async reader(){
    this.fileChooser.open().then(uri => {
      this.filePath.resolveNativePath(uri).then(filePath => {
        this.files.readAsText( filePath.substring( 0, filePath.lastIndexOf('/') ), filePath.substring( filePath.lastIndexOf('/')+1, filePath.length) ).then(async result=>{
          const alert = await this.alertController.create({
            header: 'Archivo cargado',
            subHeader: 'Lecturistas actualizados',
            message: 'El catalogo de lecturistas se actualizo con exito.',
            buttons: ['OK']
          });
          result.split("\n").forEach((I, J)=>{
            this.storage.set('l'+J, I.substring(5, I.length));
            this.storage.set('lTotal', J);
          });
          await alert.present();
        });
      }).catch(err => console.log(err));
    }).catch(e => console.log(e));
  }
  ngOnInit(){}
  async pick(){
    this.storage.get('lTotal').then((val) => {
      for(let i=0; i < val ;i++){
        this.storage.get('l'+i).then((ano)=>{
          this.lects.push({
            name: 'l'+i,
            type: 'radio',
            label: ano,
            value: i,
          });
        });
      }
    });
    const popupanom = await this.alertController.create({
      header: 'Catalogo de Lecturistas',
      mode:'ios',
      inputs: this.lects,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: data => {
            this.storage.set('picked', data)
          }
        }
      ]
    });
    await popupanom.present();
  }
}
