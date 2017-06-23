/**
 * Created by Winjoy on 6/21/2017.
 */

import { Component, Input } from '@angular/core';

@Component({
  selector: 'progress-bar',
  templateUrl: 'progress-bar.html'
})
export class ProgressBarComponent {

  @Input('progress') progress;
  @Input('total') total;

  constructor() {
    console.log("total",this.total)
  }

}
