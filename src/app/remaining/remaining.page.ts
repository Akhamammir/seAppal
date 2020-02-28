import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
@Component({
  selector: 'app-remaining',
  templateUrl: './remaining.page.html',
  styleUrls: ['./remaining.page.scss'],
})
export class RemainingPage implements OnInit {

  private selectedItem: any;
  private icons = [
    'flask',
    'wifi',
    'beer',
    'football',
    'basketball',
    'paper-plane',
    'american-football',
    'boat',
    'bluetooth',
    'build'
  ];
  public items: Array<{ title: string; note: string; icon: string, href:string }> = [];
  Term='';Original=[];
  constructor(private storage:Storage,) {
    this.storage.get('Total').then((Total) => {
      for (let i = 0; i < Total; i++) {
        this.storage.get(''+i).then((val) => {
          if(val.read == "0"){
            this.items.push({
              title: 'Contrato: ' + val.item.substring(90, 119).trim(),
              note: 'Calle ' + val.item.substring(0, 49).trim() + ' #'+val.item.substring(50, 59).trim()+', '+val.item.substring(140, 189).trim(),
              icon: this.icons[Math.floor(Math.random() * this.icons.length)],
              href: 'home/'+ +i
            });
          }
          this.Original = this.items;
        });
      }
    });
  }
  search(){
    if(this.Term.length == 0){
      console.log('boo')
      this.items = this.Original;
    } else {
      console.log('yay')
      this.storage.get('Total').then((Total) => {
        this.items=[];
        for (let i = 0; i < Total; i++) {
          this.storage.get(''+i).then((val) => {
            if(
              val.item.substring(0, 49).trim().toLowerCase().includes(this.Term.toLowerCase()) ||
              val.item.substring(50, 59).trim().toLowerCase().includes(this.Term.toLowerCase()) ||
              val.item.substring(140, 189).trim().toLowerCase().includes(this.Term.toLowerCase()) ||
              val.item.substring(90, 119).trim().toLowerCase().includes(this.Term.toLowerCase()) ||
              val.item.substring(225, 274).trim().toLowerCase().includes(this.Term.toLowerCase()) ||
              val.item.substring(200, 224).trim().toLowerCase().includes(this.Term.toLowerCase()) ||
              val.item.substring(317, 331).trim().toLowerCase().includes(this.Term.toLowerCase())
              ){
              this.items.push({
                title: 'Contrato: ' + val.item.substring(90, 119).trim(),
                note: 'Dir. ' + val.item.substring(0, 49).trim() + ' #'+val.item.substring(50, 59).trim()+', '+val.item.substring(140, 189).trim(),
                icon: this.icons[Math.floor(Math.random() * this.icons.length)],
                href: 'home/:'+i
              });
            }
          });
        }
      });
    }
  }

  ngOnInit() {
  }

}
