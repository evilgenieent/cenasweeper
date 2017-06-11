/*
 * @Author: hajnyon 
 * @Date: 2017-06-11 13:05:02 
 * @Last Modified by:   hajnyon 
 * @Last Modified time: 2017-06-11 13:05:02 
 */

// Aurelia imports
import { customElement, bindable } from 'aurelia-framework';

@customElement('controls')
export class Controls {

  @bindable x;
  @bindable y;
  @bindable minesCount;

  constructor() {

  }

}