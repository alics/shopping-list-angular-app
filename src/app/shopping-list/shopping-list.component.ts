import { Ingredient } from './../shared/ingredient.model';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit {
  ingridients: Ingredient[] = [
    new Ingredient('Potatoes', 5),
    new Ingredient('Tomatoes', 10),
    new Ingredient('Onions', 2)
  ]
  constructor() { }

  ngOnInit(): void {
  }

  onIngredientAdded(ingredient: Ingredient) {
    this.ingridients.push(ingredient);
  }
}
