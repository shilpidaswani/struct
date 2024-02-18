import { NgModule } from "@angular/core";
import { GroupByPipe } from "./groupBy.pipe";
import { DateAgoPipe, TimeAgoPipe } from "./timeago.pipe";


const pipes = [
	GroupByPipe,
	TimeAgoPipe,
	DateAgoPipe
];

@NgModule({
	declarations: [pipes],
	exports: [pipes],
})
export class PipesModule { }
