import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AlertController, LoadingController  } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { File } from '@ionic-native/file/ngx';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
Add:string="o3o"; pos=0; Comment=['','','',''];
Street='Loading...'; No='Loading...';Route='Loading...';
Contract='Loading'; Col='Loading...';Done:number=0;DoneCount=0;
Total=0; Prop='Loading...';anomalies=[]; color='primary';Reader='';
Store='';anoms=['  ','  ','  '];anomstxt=['','','']; Serial='Loading ...';
ContNo='';thisFinish='danger';thisFinishIcon='close';Current='Loading...';
  constructor(private storage:Storage, public alertController: AlertController,
    public loadingController: LoadingController, private files:File, private activatedRoute: ActivatedRoute) {
      console.log(this.activatedRoute.snapshot.paramMap.get('pos'))
    if(this.activatedRoute.snapshot.paramMap.get('pos')){
      this.pos= +this.activatedRoute.snapshot.paramMap.get('pos').replace(':', '');
    }
  }
  ngOnInit(){
    this.call(''+this.pos)
    this.storage.get('Total').then((val) => {
      this.Total = val
      this.storage.get('Done').then((done) => {
        this.DoneCount = done
        this.Done = done / val;
        switch(Math.floor((this.Done/3) ) ){
          case 0:
            this.color='danger';
          break;
          case 1:
            this.color='warning';
          break;
          default:
           this.color='success';
          break;
        }
      });
    });
    this.storage.get('picked').then((val) => {this.Reader = val;});
    this.storage.get('Route').then((val) => {this.Route=val});
    this.storage.get('aTotal').then((val) => {
      for(let i=0; i<val ;i++){
        this.storage.get('a'+(+i+1)).then((ano)=>{
          this.anomalies.push({
            name: 'a'+(+i+1),
            type: 'radio',
            label: ano,
            value: ((''+(i+1))[1] ?  (+i+1) : '0'+(+i+1) ),
          });
          console.log(ano, i+1, (''+(i+1))[1], (''+(i+1))[1] ? true : false )
        });
      }
    });
  }
  call(pos:string) {
    this.storage.get(pos).then((val) => {
      this.Street= val.item.substring(0, 49).trim();
      this.No= val.item.substring(50, 59).trim();
      this.Col= val.item.substring(140, 189).trim();
      this.Contract= val.item.substring(90, 119).trim();
      this.Prop= val.item.substring(225, 274).trim();
      this.ContNo= val.item.substring(200, 224).trim();
      this.Store = val.item;
      this.Serial = val.item.substring(317, 331).trim();
      this.Current = val.current;
      this.thisFinish = val.read == 0 ? 'danger' : 'success';
      this.thisFinishIcon = val.read == 0 ? 'close' : 'checkmark';
      this.anoms=val.anoms;this.anomstxt=val.anomstxt;
      this.Comment=['','','','']
    });
  }
  move(forward:boolean){
    this.pos = this.pos + (forward ? 1 : -1);
    this.call(''+this.pos);
  }
  async anom(pos){
    const popupanom = await this.alertController.create({
      header: 'Catalogo de anomalias',
      mode:'ios',
      inputs: this.anomalies,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: data => {
            this.anoms[pos]= data;
            console.log(data, this.anoms[pos], this.anomalies)
            this.storage.get('a'+(data[0] === '0' ? data[1] : data) ).then((ano)=>{
              this.anomstxt[pos]=ano;
              this.storage.get(''+this.pos).then(Item=>{
                this.storage.set(''+this.pos,{item:this.Store, read:Item.read, current:Item.current, anoms:this.anoms, anomstxt:this.anomstxt});
                this.process({reading:Item.current})
              });
            });
          }
        }
      ]
    });
    await popupanom.present();
  }
  async write(){
    const alert = await this.alertController.create({
      mode:'ios',
      header: 'Confirmar Creacion de lecturas!',
      message: 'Confirme <strong>que las lecturas sean correctas</strong>!!!',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okay',
          handler: () => {
            this.storage.get('Directory').then((dir) => {
              this.storage.get('Route').then((name) => {
                this.files.createFile(dir, 'L'+name+'.txt', true).then(()=>{
                  //this.files.writeExistingFile(dir, 'L'+name+'.txt', 'I LIVE!!!!')
                  this.storage.get('Total').then(async (total) => {
                    let temp = '';
                    const loading = await this.loadingController.create({
                      message: 'Escribiendo archivo'
                    });
                    const finish = await this.alertController.create({
                      mode:'ios',
                      header: 'Proceso completado',
                      subHeader: 'Archivo generado',
                      message: 'El archivo de lecturas se genero con exito.',
                      buttons: ['OK']
                    });
                    loading.onDidDismiss().then(async ()=>{
                      await finish.present();
                    })
                    await loading.present();
                    for(let i = 0; i<total; i++){
                      this.storage.get(''+i).then(async (val) => {
                        if(val.read == "0"){
                          console.log('Niggaaa????')
                        } else {
                          temp += val.read;
                          console.log('Workin')
                        }
                        if( i == (total-1)) {
                          console.log(temp)
                          loading.dismiss();
                          this.files.writeExistingFile(dir, 'L'+name+'.txt', temp);
                        }
                      });
                    }
                  });
                }).catch(Err=>console.log(Err));
              });
            });
          }
        }
      ]
    });

    await alert.present();
  }
  async read(){
    let message='Verificar que la lectura sea correcta, puesto que excede el limite maximo!'
    const showmssg = await this.alertController.create({
      header: 'Confirme su lectura!',
      message: message,
      buttons: [
        {
          text: 'Okay',
          handler: () => {
            console.log('Confirm Okay');
          }
        }
      ]
    });
    const popup = await this.alertController.create({
      header: 'Ingrese lectura',
      mode:'ios',
      inputs: [
        {
          name: 'reading',
          type: 'number',
          placeholder: 'Inserte Lectura'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'danger',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          cssClass: 'success',
          handler: async data => {
            //alert(data.reading)
            //|| +data.reading < +this.Store.substring(360, 367).trim() || +data.reading > +this.Store.substring(368, 375).trim()
              if(+data.reading > +this.Store.substring(353, 361).trim() + +this.Store.substring(369, 377).trim() ){
                await showmssg.present();
              } else if(+data.reading < +this.Store.substring(353, 361).trim()){
                showmssg.message='Verificar que la lectura sea correcta, puesto que es menor a la anterior';
                await showmssg.present();
              } else if (+data.reading == +this.Store.substring(353, 361).trim()){
                showmssg.message='Verificar que la lectura sea correcta, puesto que es identica a la anterior';
                await showmssg.present();
              } else if(+data.reading < +this.Store.substring(353, 361).trim() + +this.Store.substring(361, 369).trim()){
              showmssg.message='Verificar que la lectura sea correcta, puesto que excede el limite inferior';
                await showmssg.present();
              }
              this.process(data)
            }
          }
      ]
    });
    await popup.present();
  }
  process(data){
    let d = new Date();
    this.storage.get('picked').then(async (val) => {
      const loading = await this.loadingController.create({
        message: 'Escribiendo archivo'
      });
      let pieces = {
        contrato:this.ContNo, lectact:''+data.reading,
        fecact:( d.getDate().toString().length == 1 ? '0'+d.getDate() : ''+d.getDate() )+'/'+( (d.getMonth()+1).toString().length == 1 ? '0'+(d.getMonth()+1) : ''+(d.getMonth()+1) )+'/'+d.getFullYear(),
        hlecact:(d.getHours().toString().length == 1 ? '0'+d.getHours() : ''+d.getHours() )+':'+(d.getMinutes().toString().length == 1 ? '0'+d.getMinutes() : ''+d.getMinutes() ),
        anom1:this.anoms[0],anom2:this.anoms[1],anom3:this.anoms[2],errlec:'! ',
        coment1:this.Comment[0], coment2:this.Comment[1], coment3:this.Comment[2], coment4:this.Comment[3],
        sermed:this.Store.substring(317, 331), offset:'    0',fraude:'       0',badrx:'  0',tx:'       0',reset:'  0',pila:'  0',alarma:'  0',lect:'    ',tipolect:this.Store[376],
        lectur:this.Reader
      };
      while (pieces.lectact.length != 13){
        pieces.lectact = ' ' + pieces.lectact ;
      }
      while (pieces.coment1.length != 25){
        pieces.coment1 = pieces.coment1 + ' ';
      }
      while (pieces.coment2.length != 25){
        pieces.coment2 = pieces.coment2 + ' ';
      }
      while (pieces.coment3.length != 25){
        pieces.coment3 = pieces.coment3 + ' ';
      }
      while (pieces.coment4.length != 25){
        pieces.coment4 = pieces.coment4 + ' ';
      }
      while (pieces.sermed.length != 15){
        pieces.sermed = pieces.sermed + ' ';
      }
      while (pieces.lectur.length < 3){
        pieces.lectur = '0'+pieces.lectur;
      }
      let temp='';
      for(let key in pieces){
        temp += pieces[key]
      }
      this.storage.get(''+this.pos).then((item)=>{
        pieces.anom1 = item.anoms[0];pieces.anom2 = item.anoms[1];
        pieces.anom3 = item.anoms[2];
        item.read == 0 ? this.DoneCount++ : null;
        this.storage.set('Done', this.DoneCount);
        this.storage.set(''+this.pos, {item:this.Store, read:temp+"\n", current:pieces.lectact, anoms:item.anoms, anomstxt:item.anomstxt});
        this.thisFinish = 'success';
        this.thisFinishIcon = 'checkmark';
        loading.dismiss();
      });
    });
  }
}
