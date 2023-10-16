import { Group } from '../modules/group.module';

interface SelectableGroup extends Group {
  selected?: boolean;
}
