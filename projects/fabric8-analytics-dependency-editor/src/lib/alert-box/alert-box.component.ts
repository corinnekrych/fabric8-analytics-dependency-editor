import {
  Component,
  OnInit,
  OnChanges,
  Input,
  ViewEncapsulation
} from '@angular/core';
import * as c3 from 'c3';
import {
  AlertBox
} from '../model/data.model';

@Component({
  selector: 'app-alert-box',
  styleUrls: ['./alert-box.component.less'],
  templateUrl: './alert-box.component.html'
})

export class AlertBoxComponent {
  @Input() alert: AlertBox;
  @Input() isLoading: boolean;
}
