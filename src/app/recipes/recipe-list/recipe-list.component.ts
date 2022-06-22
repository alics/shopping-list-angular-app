import { RecipeService } from './../recipe.service';
import { EventEmitter } from '@angular/core';
import { Recipe } from './../recipe.model';
import { Component, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit {
  @Output() recipeWasSelected = new EventEmitter<Recipe>();
  recipes: Recipe[];
  constructor(private recipeService:RecipeService) { }

  ngOnInit(): void {
    this.recipes=this.recipeService.getRecipes();
  }
}
