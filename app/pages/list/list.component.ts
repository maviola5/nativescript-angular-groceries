import { Component, ElementRef, OnInit, NgZone, ViewChild } from "@angular/core";
import { Grocery } from '../../shared/grocery/grocery';
import { GroceryListService } from '../../shared/grocery/grocery-list.service';
import { TextField } from 'ui/text-field';
import * as SocialShare from 'nativescript-social-share';

@Component({
  selector: "list",
  templateUrl: "pages/list/list.html",
  styleUrls: ["pages/list/list-common.css", "pages/list/list.css"],
  providers: [GroceryListService]
})

export class ListComponent implements OnInit {
  grocery = "";
  isLoading = false;
  listLoaded = false;
  @ViewChild("groceryTextField") groceryTextField: ElementRef;
  groceryList: Array<Grocery> = [];
  
  constructor(
    private groceryListService: GroceryListService,
    private zone: NgZone ){}

  ngOnInit() {
    this.isLoading = true;
    this.groceryListService.load()
    .subscribe(loadedGroceries => {
      loadedGroceries.forEach(groceryObject => this.groceryList.push(groceryObject));
      this.isLoading = false;
      this.listLoaded = true;
    })
  }

  add() {
    if(this.grocery.trim() === ""){
      alert('Enter a grocery item');
      return;
    }

    let textField = <TextField>this.groceryTextField.nativeElement;
    textField.dismissSoftInput();

    this.groceryListService.add(this.grocery)
    .subscribe(
      groceryObject => {
        this.groceryList.unshift(groceryObject);
        this.grocery = "";
      },
      () => {
        alert({
          message: 'An error occurred while adding an item to your list.',
          okButtonText: 'Ok'
        });
        this.grocery = "";
      }
    )
  }

  delete(grocery: Grocery) {
    alert('delete' + grocery.id);
    this.groceryListService.delete(grocery.id)
    .subscribe( () => {
      this.zone.run( () => {
        let index = this.groceryList.indexOf(grocery);
        this.groceryList.splice(index, 1);
      })
    });
  }

  share(){
    let listString = this.groceryList
    .map(grocery => grocery.name)
    .join(', ')
    .trim();
    SocialShare.shareText(listString);
  }
  
}